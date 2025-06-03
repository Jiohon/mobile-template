import { ComponentType, LazyExoticComponent } from "react"

export interface RoutePermission {
  // 是否需要登录
  requireAuth?: boolean
  // 需要的角色
  roles?: string[]
  // 需要的权限
  permissions?: string[]
  // 是否在菜单中隐藏
  hidden?: boolean
}

export interface RouteMeta {
  // 页面标题
  title?: string
  // 图标
  icon?: string
  // 权限配置
  permission?: RoutePermission
  // 面包屑路径
  breadcrumb?: string[]
  // 是否缓存页面
  keepAlive?: boolean
}

export interface RouteConfig {
  // 路由路径
  path: string
  // 组件 - 支持直接组件、懒加载组件或者导入函数
  element?:
    | ComponentType
    | LazyExoticComponent<ComponentType>
    | (() => Promise<{ default: ComponentType }>)
  // 路由元信息
  meta?: RouteMeta
  // 子路由
  children?: RouteConfig[]
  // 重定向
  redirect?: string
  // 路由名称
  name?: string
  // 是否完全匹配
  exact?: boolean
}

export interface MenuConfig {
  // 菜单项唯一标识
  key: string
  // 菜单标题
  title: string
  // 菜单图标
  icon?: string
  // 路由路径
  path?: string
  // 子菜单
  children?: MenuConfig[]
  // 权限配置
  permission?: RoutePermission
}
