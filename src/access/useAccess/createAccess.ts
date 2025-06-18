import { hasAnyPermission, hasAnyRole, hasPermission, hasRole } from "@/access/auth"
import { useAuthStore } from "@/stores/auth"

import { AccessConfigFunction, UseAccessReturnType } from "../types"

const ADMIN_ROLE = "admin"
const USER_ROLE = "user"

/**
 * 权限定义文件 - 参考 RBAC 模型（Role-Based Access Control）
 * 该文件定义了应用中所有的权限判断逻辑
 * @param initialState 初始状态（用户信息）
 * @returns 权限对象
 * @example
 * const access = createAccess()
 * const access = createAccess({ user: {...}, userRolesSet: new Set([...]), userPermissionsSet: new Set([...]) })
 */
const createAccess: AccessConfigFunction = (initialState): UseAccessReturnType => {
  const user = initialState.user ?? useAuthStore.getState().user
  const userRolesSet = initialState.userRolesSet ?? useAuthStore.getState().userRolesSet
  const userPermissionsSet =
    initialState.userPermissionsSet ?? useAuthStore.getState().userPermissionsSet

  return {
    // 认证相关权限
    isAuthenticated: !!user, // 是否已登录

    // 角色权限判断
    isAdmin: userRolesSet.has(ADMIN_ROLE) ?? false,
    isUser: userRolesSet.has(USER_ROLE) ?? false,

    canRead: (permission) => hasPermission(userPermissionsSet, permission),

    canCreate: (permission) => hasPermission(userPermissionsSet, permission),

    canUpdate: (permission) => hasPermission(userPermissionsSet, permission),

    canDelete: (permission) => hasPermission(userPermissionsSet, permission),

    hasRole: (role) => hasRole(userRolesSet, role),

    hasPermission: (permission) => hasPermission(userPermissionsSet, permission),
    hasAnyRole: (roles) => hasAnyRole(userRolesSet, roles),

    hasAnyPermission: (permissions) => hasAnyPermission(userPermissionsSet, permissions),
  }
}

export default createAccess
