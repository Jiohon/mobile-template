import { User } from "@/types/auth"

/**
 * 检查用户是否拥有指定权限
 * @param user 用户信息
 * @param permission 权限码
 * @returns 是否拥有权限
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user || !permission) return false
  return user.permissions.includes(permission)
}

/**
 * 检查用户是否拥有指定角色
 * @param user 用户信息
 * @param role 角色名
 * @returns 是否拥有角色
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !role) return false
  return user.roles.includes(role)
}

/**
 * 检查用户是否拥有任一权限
 * @param user 用户信息
 * @param permissions 权限码数组
 * @returns 是否拥有任一权限
 */
export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user || !permissions.length) return false
  return permissions.some((permission) => user.permissions.includes(permission))
}

/**
 * 检查用户是否拥有任一角色
 * @param user 用户信息
 * @param roles 角色名数组
 * @returns 是否拥有任一角色
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles.length) return false
  return roles.some((role) => user.roles.includes(role))
}

/**
 * 检查用户是否拥有所有权限
 * @param user 用户信息
 * @param permissions 权限码数组
 * @returns 是否拥有所有权限
 */
export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  if (!user || !permissions.length) return false
  return permissions.every((permission) => user.permissions.includes(permission))
}

/**
 * 检查用户是否拥有所有角色
 * @param user 用户信息
 * @param roles 角色名数组
 * @returns 是否拥有所有角色
 */
export const hasAllRoles = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles.length) return false
  return roles.every((role) => user.roles.includes(role))
}

/**
 * 获取token
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token")
}

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  localStorage.setItem("token", token)
}

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
}

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}
