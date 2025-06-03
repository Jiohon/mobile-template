import { User } from "@/types/auth"
import { RoutePermission } from "@/types/router"

import { hasAnyPermission, hasAnyRole } from "./auth"

/**
 * 检查用户是否有访问路由的权限
 * @param user 用户信息
 * @param permission 路由权限配置
 * @returns 是否有权限
 */
export const checkRoutePermission = (user: User | null, permission?: RoutePermission): boolean => {
  // 如果没有权限配置，默认允许访问
  if (!permission) return true

  // 检查角色权限
  if (permission.roles && permission.roles.length > 0) {
    if (!user || !hasAnyRole(user, permission.roles)) {
      return false
    }
  }

  // 检查具体权限
  if (permission.permissions && permission.permissions.length > 0) {
    if (!user || !hasAnyPermission(user, permission.permissions)) {
      return false
    }
  }

  return true
}

/**
 * 过滤用户有权限的路由
 * @param routes 路由配置
 * @param user 用户信息
 * @returns 过滤后的路由
 */
export const filterRoutesByPermission = (routes: any[], user: User | null): any[] => {
  return routes.filter((route) => {
    // 检查当前路由权限
    const hasPermission = checkRoutePermission(user, route.meta?.permission)

    if (!hasPermission) {
      return false
    }

    // 如果有子路由，递归过滤
    if (route.children && route.children.length > 0) {
      route.children = filterRoutesByPermission(route.children, user)
    }

    return true
  })
}

/**
 * 检查菜单项是否应该显示
 * @param permission 权限配置
 * @param user 用户信息
 * @returns 是否显示
 */
export const shouldShowMenuItem = (
  permission: RoutePermission | undefined,
  user: User | null
): boolean => {
  // 如果配置了隐藏，则不显示
  if (permission?.hidden) {
    return false
  }

  // 检查权限
  return checkRoutePermission(user, permission)
}
