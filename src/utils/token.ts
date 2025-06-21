import { env } from "@/config"

/**
 * 获取token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(env.VITE_TOKEN_KEY)
}

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(env.VITE_TOKEN_KEY, token)
}

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem(env.VITE_TOKEN_KEY)
}

/**
 * 获取refreshToken
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(env.VITE_REFRESH_TOKEN_KEY)
}

/**
 * 设置refreshToken
 */
export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(env.VITE_REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * 移除refreshToken
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(env.VITE_REFRESH_TOKEN_KEY)
}
