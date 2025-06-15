import { AccessConfigFunction, UseAccessReturnType } from "@/hooks/useAccess/types"
import { useAuthStore } from "@/stores/auth"
import { User } from "@/types/auth"

import { hasAnyPermission, hasAnyRole, hasPermission, hasRole } from "../../utils/auth"

/**
 * 权限定义文件 - 参考 RBAC 模型（Role-Based Access Control）
 * 该文件定义了应用中所有的权限判断逻辑
 * @param initialState 初始状态（用户信息）
 * @returns 权限对象
 */
const access: AccessConfigFunction = (initialState: { user: User | null }): UseAccessReturnType => {
  const { user } = initialState

  const userRolesSet = useAuthStore.getState().userRolesSet
  const userPermissionsSet = useAuthStore.getState().userPermissionsSet

  return {
    // 基础权限判断
    canLogin: true, // 任何人都可以访问登录页

    // 认证相关权限
    isAuthenticated: !!user, // 是否已登录

    // 角色权限判断
    isAdmin: user?.roles?.includes("admin") ?? false,
    isUser: user?.roles?.includes("user") ?? false,

    canRead: (permission) => hasPermission(userPermissionsSet, `${permission}`),

    canCreate: (permission) => hasPermission(userPermissionsSet, `${permission}`),

    canUpdate: (permission) => hasPermission(userPermissionsSet, `${permission}`),

    canDelete: (permission) => hasPermission(userPermissionsSet, `${permission}`),

    hasRole: (role) => hasRole(userRolesSet, role),

    hasPermission: (permission) => hasPermission(userPermissionsSet, permission),
    hasAnyRole: (roles) => hasAnyRole(userRolesSet, roles),

    hasAnyPermission: (permissions) => hasAnyPermission(userPermissionsSet, permissions),
  }
}

export default access
