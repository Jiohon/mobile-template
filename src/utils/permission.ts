import { PermissionsType, RouteAccess } from "@/types/router"
import type { RouteConfig } from "@/types/router"

import { hasAnyPermission, hasAnyRole } from "./auth"

/**
 * 检查用户是否有访问路由的权限
 * @param user 用户信息
 * @param access 路由访问控制配置
 * @returns 是否有权限
 */
export const checkRoutePermission = (
  userRolesSet: Set<string>,
  userPermissionsSet: Set<PermissionsType>,
  routeAccess?: RouteAccess
): boolean => {
  // 如果没有访问控制配置，默认允许访问
  if (!routeAccess) return true

  // 检查角色权限
  if (!hasAnyRole(userRolesSet, routeAccess?.roles || [])) {
    return false
  }

  // 检查具体权限
  if (!hasAnyPermission(userPermissionsSet, routeAccess?.permissions || [])) {
    return false
  }

  return true
}

/**
 * 过滤用户有权限的路由
 * @param routes 路由配置
 * @param user 用户信息
 * @returns 过滤后的路由
 */
export const filterRoutesByPermission = (
  routes: RouteConfig[],
  userRolesSet: Set<string>,
  userPermissionsSet: Set<PermissionsType>
): RouteConfig[] => {
  return routes.filter((route) => {
    // 检查当前路由权限
    const hasPermission = checkRoutePermission(userRolesSet, userPermissionsSet, route.meta?.access)

    if (!hasPermission) {
      return false
    }

    // 如果有子路由，递归过滤
    if (route.children && route.children.length > 0) {
      route.children = filterRoutesByPermission(route.children, userRolesSet, userPermissionsSet)
    }

    return true
  })
}

/**
 * 检查菜单项是否应该显示
 * @param access 访问控制配置
 * @param user 用户信息
 * @returns 是否显示
 */
export const shouldShowMenuItem = (
  access: RouteAccess | undefined,
  userRolesSet: Set<string>,
  userPermissionsSet: Set<PermissionsType>
): boolean => {
  // 如果配置了隐藏，则不显示
  if (access?.hidden) {
    return false
  }

  // 检查权限
  return checkRoutePermission(userRolesSet, userPermissionsSet, access)
}
