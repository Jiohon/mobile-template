import { env } from "@/config"

/**
 * 获取token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(env.TOKEN_KEY)
}

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(env.TOKEN_KEY, token)
}

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem(env.TOKEN_KEY)
}

/**
 * 获取refreshToken
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(env.REFRESH_TOKEN_KEY)
}

/**
 * 设置refreshToken
 */
export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * 移除refreshToken
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(env.REFRESH_TOKEN_KEY)
}
