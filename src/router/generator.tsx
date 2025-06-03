import { ComponentType, lazy, Suspense } from "react"

import { SpinLoading } from "antd-mobile"
import { Navigate, RouteObject } from "react-router-dom"

import AuthGuard from "@/components/AuthGuard"
import Layout from "@/components/Layout"
import { User } from "@/types/auth"
import { RouteConfig } from "@/types/router"
import { checkRoutePermission } from "@/utils/permission"

// 加载组件的 Suspense 包装器
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <SpinLoading style={{ "--size": "48px" }} />
      </div>
    }
  >
    {children}
  </Suspense>
)

// 动态导入组件的解析函数
const resolveComponent = (
  element: ComponentType | (() => Promise<{ default: ComponentType }>)
): ComponentType => {
  if (typeof element === "function" && element.prototype?.isReactComponent) {
    return element as ComponentType
  }
  return lazy(element as () => Promise<{ default: ComponentType }>)
}

/**
 * 根据权限过滤路由
 */
export const filterRoutes = (routes: RouteConfig[], user: User | null): RouteConfig[] => {
  const filteredRoutes = routes.filter((route) => {
    // 检查权限
    const hasPermission = checkRoutePermission(user, route.meta?.permission)

    if (!hasPermission) {
      return false
    }

    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      route.children = filterRoutes(route.children, user)
    }

    return true
  })

  return filteredRoutes
}

/**
 * 将路由配置转换为 React Router 的路由对象
 */
export const generateRoutes = (routes: RouteConfig[], isLayoutChild = false): RouteObject[] => {
  return routes.map((route) => {
    const routeObject: RouteObject = {
      // 如果是布局的子路由，将绝对路径转换为相对路径
      path: isLayoutChild ? route.path.replace(/^\//, "") : route.path,
    }

    // 处理重定向
    if (route.redirect) {
      routeObject.element = <Navigate to={route.redirect} replace />
      return routeObject
    }

    // 处理组件
    if (route.element) {
      const Component = resolveComponent(route.element)

      // 根据权限配置决定是否需要认证守卫
      const needAuth = route.meta?.permission?.requireAuth === true

      if (needAuth) {
        routeObject.element = (
          <AuthGuard>
            <SuspenseWrapper>
              <Component />
            </SuspenseWrapper>
          </AuthGuard>
        )
      } else {
        routeObject.element = (
          <SuspenseWrapper>
            <Component />
          </SuspenseWrapper>
        )
      }
    }

    // 处理子路由
    if (route.children && route.children.length > 0) {
      routeObject.children = generateRoutes(route.children, isLayoutChild)
    }

    return routeObject
  })
}

/**
 * 生成带有布局的路由
 */
export const generateLayoutRoutes = (routes: RouteConfig[], user: User | null): RouteObject[] => {
  const result: RouteObject[] = []

  // 过滤权限
  const filteredRoutes = filterRoutes(routes, user)

  // 分离需要布局和不需要布局的路由
  const layoutRoutes: RouteConfig[] = []
  const standaloneRoutes: RouteConfig[] = []
  let rootRedirect: string | null = null
  let notFoundRoute: RouteConfig | null = null

  filteredRoutes.forEach((route) => {
    // 特殊处理根路径重定向
    if (route.path === "/" && route.redirect) {
      rootRedirect = route.redirect
      return
    }

    // 特殊处理NotFound路由
    if (route.path === "*") {
      notFoundRoute = route
      return
    }

    // 登录页不需要布局，其他页面都使用布局
    const isStandalone = route.path === "/login"

    if (isStandalone) {
      standaloneRoutes.push(route)
    } else {
      layoutRoutes.push(route)
    }
  })

  // 添加独立路由
  result.push(...generateRoutes(standaloneRoutes, false))

  // 添加带布局的路由
  if (layoutRoutes.length > 0) {
    const layoutChildren = generateRoutes(layoutRoutes, true)

    // 如果有根路径重定向，添加为index路由
    if (rootRedirect) {
      layoutChildren.unshift({
        index: true,
        element: <Navigate to={rootRedirect} replace />,
      })
    }

    result.push({
      path: "/",
      element: <Layout />, // 布局本身不包装 AuthGuard，让子路由自己决定
      children: layoutChildren,
    })
  }

  // 最后添加NotFound路由，确保它是最后匹配的
  if (notFoundRoute) {
    result.push(generateRoutes([notFoundRoute], false)[0])
  }

  return result
}
