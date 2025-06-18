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
 * 获取refreshToken
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken")
}

/**
 * 设置refreshToken
 */
export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem("refreshToken", refreshToken)
}

/**
 * 移除refreshToken
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem("refreshToken")
}
