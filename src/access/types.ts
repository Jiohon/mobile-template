import { User } from "@/types/auth"
import type { PermissionsType } from "@/types/router"

/**
 * 权限访问对象类型定义
 */
export interface AccessType {
  // 认证相关权限
  isAuthenticated: boolean

  // 角色权限判断
  isAdmin: boolean
  isUser: boolean

  /**
   * 检查用户是否拥有读取权限
   * @param permission 权限
   * @returns 是否拥有读取权限
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const canRead = access.canRead("user:read")
   */
  canRead: (permission: PermissionsType) => boolean

  /**
   * 检查用户是否拥有创建权限
   * @param permission 权限
   * @returns 是否拥有创建权限
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const canCreate = access.canCreate("user:create")
   */
  canCreate: (permission: PermissionsType) => boolean

  /**
   * 检查用户是否拥有更新权限
   * @param permission 权限
   * @returns 是否拥有更新权限
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const canUpdate = access.canUpdate("user:update")
   */
  canUpdate: (permission: PermissionsType) => boolean

  /**
   * 检查用户是否拥有删除权限
   * @param permission 权限
   * @returns 是否拥有删除权限
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const canDelete = access.canDelete("user:delete")
   */
  canDelete: (permission: PermissionsType) => boolean

  /**
   * 检查用户是否拥有指定权限
   * @param permission 权限码
   * @returns 是否拥有权限
   * @example
   * const access = useAccess() or const access = createAccess()
   * const hasPermission = access.hasPermission()
   */
  hasPermission: (permission: PermissionsType) => boolean

  /**
   * 检查用户是否拥有指定角色
   * @returns 是否拥有角色
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const hasRole = access.hasRole("admin")
   */
  hasRole: (role: string) => boolean

  /**
   * 检查用户是否拥有任一角色
   * @param roles 角色名数组
   * @returns 是否拥有任一角色
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const hasAnyRole = access.hasAnyRole(["admin", "user"])
   */
  hasAnyRole: (roles: string[]) => boolean

  /**
   * 检查用户是否拥有任一权限
   * @param permissions 权限码数组
   * @returns 是否拥有任一权限
   * @example
   * const access = useAccess()
   * const access = createAccess()
   *
   * const hasAnyPermission = access.hasAnyPermission([...])
   */
  hasAnyPermission: (permissions: PermissionsType[]) => boolean
}

/**
 * 权限配置函数类型
 */
export type AccessConfigFunction = (initialState: {
  user?: User | null
  userRolesSet?: Set<string>
  userPermissionsSet?: Set<PermissionsType>
}) => AccessType

/**
 * useAccess Hook 返回类型
 */
export type UseAccessReturnType = AccessType
