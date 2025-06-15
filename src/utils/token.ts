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
