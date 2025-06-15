import { lazy } from "react"
import type { ComponentType, LazyExoticComponent } from "react"

import { Navigate, RouteObject } from "react-router"

import AuthGuard from "@/components/AuthGuard"
import Layout from "@/components/Layout"
import SuspenseWrapper from "@/components/SuspenseWrapper"
import { PermissionsType, RouteConfig } from "@/types/router"
import { isLazyComponent } from "@/utils/is"
import { filterRoutesByPermission } from "@/utils/permission"

// 动态导入组件的解析函数
const resolveComponent = (element: RouteConfig["element"]): ComponentType => {
  if (typeof element === "function" && element.prototype?.isReactComponent) {
    return element as ComponentType
  }

  if (isLazyComponent(element)) {
    return element as LazyExoticComponent<ComponentType>
  }

  return lazy(element as () => Promise<{ default: ComponentType }>)
}

/**
 * 创建基础元素
 */
const createBaseElement = (route: RouteConfig) => {
  if (!route.element) return null

  const Component = resolveComponent(route.element)
  const needAuth = route.meta?.access?.requireAuth === true

  if (needAuth) {
    return (
      <AuthGuard>
        <SuspenseWrapper>
          <Component />
        </SuspenseWrapper>
      </AuthGuard>
    )
  } else {
    return (
      <SuspenseWrapper>
        <Component />
      </SuspenseWrapper>
    )
  }
}

/**
 * 创建路由
 * @param routes 路由配置
 * @param isChild 是否是子路由
 * @returns 路由对象
 */
const create = (routes: RouteConfig[], isChild = false): RouteObject[] => {
  return routes.map((route) => {
    const routeObject: RouteObject = {
      // 如果是子路由，将绝对路径转换为相对路径
      path: isChild ? route.path.replace(/^\//, "") : route.path,
    }

    // 处理重定向
    if (route.redirect) {
      routeObject.element = <Navigate to={route.redirect} replace />
      return routeObject
    }

    // 处理组件
    if (route.element) {
      routeObject.element = createBaseElement(route)
    }

    // 处理没有元素的路由（仅有子路由的情况）
    if (route.children && route.children.length > 0) {
      routeObject.children = create(route.children, true)
    }

    return routeObject
  })
}

/**
 * 生成带有布局的路由
 */
export const generateLayoutRoutes = (
  routes: RouteConfig[],
  userRolesSet: Set<string>,
  userPermissionsSet: Set<PermissionsType>
): RouteObject[] => {
  // 过滤权限
  const filteredRoutes = filterRoutesByPermission(routes, userRolesSet, userPermissionsSet)

  // 分离路由：login和通配符路由保持在顶层，其他路由放到"/"下
  const loginRoute = filteredRoutes.find((r) => r.path === "/login")
  const notFoundRoute = filteredRoutes.find((r) => r.path === "*")
  const rootRoute = filteredRoutes.find((r) => r.path === "/")
  const mainRoutes = filteredRoutes.filter((r) => !["/login", "*", "/"].includes(r.path))

  const result: RouteObject[] = []

  if (loginRoute) {
    result.push(...create([loginRoute]))
  }

  if (rootRoute && rootRoute.redirect) {
    result.push({
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to={rootRoute.redirect} replace />,
        },
        ...create(mainRoutes, true),
      ],
    })
  }

  if (notFoundRoute) {
    result.push(...create([notFoundRoute]))
  }

  return result
}
