import type { PermissionsType } from "@/types/router"

/**
 * 检查用户是否拥有指定角色
 * @param role 角色名
 * @param user 用户信息
 * @returns 是否拥有角色
 */
export const hasRole = (userRolesSet: Set<string>, role: string) => {
  return userRolesSet.has(role)
}

/**
 * 检查用户是否拥有指定权限
 * @param userPermissionsSet 用户权限列表 Set
 * @param permission 权限码
 * @returns 是否拥有权限
 */
export const hasPermission = (
  userPermissionsSet: Set<PermissionsType>,
  permission?: PermissionsType | null
) => {
  if (!userPermissionsSet?.size) return false

  if (!permission) return true

  // 检查是否有通配符权限
  if (userPermissionsSet.has("*:*:*")) return true

  // 检查是否有精确权限
  if (userPermissionsSet.has(permission)) return true

  // 检查通配符权限
  const [resource, action, scope = "*"] = permission.split(":")
  const candidates = [
    `${resource}:${action}:*`,
    `${resource}:*:${scope}`,
    `*:${action}:${scope}`,
    `${resource}:*:*`,
    `*:${action}:*`,
    `*:*:${scope}`,
  ] as PermissionsType[]

  return candidates.some((c) => userPermissionsSet.has(c))
}

/**
 * 检查用户是否拥有任一角色
 * @param roles 角色名数组
 * @param user 用户信息
 * @returns 是否拥有任一角色
 */
export const hasAnyRole = (userRolesSet: Set<string>, roles: string[]) => {
  if (!roles || roles.length === 0) return true
  return roles.some((role) => hasRole(userRolesSet, role))
}

/**
 * 检查用户是否拥有任一权限
 * @param userPermissionsSet 用户权限列表 Set
 * @param permissions 权限码数组
 * @returns 是否拥有任一权限
 */
export const hasAnyPermission = (
  userPermissionsSet: Set<PermissionsType>,
  permissions?: PermissionsType[] | null
) => {
  if (!permissions || permissions.length === 0) return true
  return permissions.every((permission) => hasPermission(userPermissionsSet, permission))
}
