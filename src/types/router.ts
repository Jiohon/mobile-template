import type { ComponentType, LazyExoticComponent } from "react"

import type { RouteObject } from "react-router"

/**
 * 权限格式："模块:操作:资源" 表示：
 * 1. 第 1 位（模块）：某个功能模块（如 user, order, system）
 * 2. 第 2 位（操作）：操作行为（如 create, edit, delete, view）
 * 3. 第 3 位（资源）：具体资源或数据粒度（如某个 ID、类型、菜单等）
 *
 * 修改这里的格式 需同步修改 @/hooks/useAccess/auth.ts 中的 hasPermission 函数判断
 *
 * @example
 * "user:read:*" 表示：用户模块的读取权限，且可以访问所有用户
 * "user:update:*" 表示：用户模块的更新权限，且可以访问所有用户
 * "user:read:1" 表示：用户模块的读取权限，且可以访问 ID 为 1 的用户
 * "*:*:*" 表示：所有功能、所有操作、所有资源都能访问（超级权限）
 */
export type PermissionsType = `${string}:${"create" | "read" | "update" | "delete" | "*"}:${string}`

export interface RouteAccess {
  // 是否需要登录
  requireAuth?: boolean
  // 需要的角色
  roles?: string[]
  // 所需的权限
  permissions?: PermissionsType[]
  // 是否在菜单中隐藏
  hidden?: boolean
}

export interface RouteMeta {
  // 页面标题
  title?: string
  // 图标
  icon?: string
  // 访问控制配置
  access?: RouteAccess
  // 面包屑路径
  breadcrumb?: string[]
  // 是否缓存页面
  keepAlive?: boolean
  // 是否使用布局
  Layout?: boolean
}

export interface RouteConfig extends Omit<RouteObject, "path" | "element" | "children"> {
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
