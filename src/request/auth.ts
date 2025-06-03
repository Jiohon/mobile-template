import { createServerTokenAuthentication } from "alova/client"

import { env } from "@/config"

/**
 * 刷新 token 的函数
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem(env.REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      return null
    }

    const response = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    const data = await response.json()

    if (data.success && data.data) {
      const { token, refresh_token: newRefreshToken } = data.data

      localStorage.setItem(env.TOKEN_KEY, token)
      localStorage.setItem(env.REFRESH_TOKEN_KEY, newRefreshToken)

      return token
    }

    localStorage.removeItem(env.TOKEN_KEY)
    localStorage.removeItem(env.REFRESH_TOKEN_KEY)

    window.location.href = "/login"
    return null
  } catch (error) {
    console.error("Token refresh error:", error)

    localStorage.removeItem(env.TOKEN_KEY)
    localStorage.removeItem(env.REFRESH_TOKEN_KEY)

    window.location.href = "/login"
    return null
  }
}

/**
 * 用于拦截器的刷新token处理函数
 */
const refreshTokenHandler = async (): Promise<void> => {
  await refreshAccessToken()
}

/**
 * 创建 token 认证处理器
 */
export const createAuthHandler = () => {
  return createServerTokenAuthentication({
    refreshTokenOnSuccess: {
      isExpired: (response: Response) => {
        // 检查是否为 401 错误
        return response.status === 401
      },
      handler: refreshTokenHandler,
    },
  })
}

/**
 * Token 相关的工具函数
 */
export const tokenUtils = {
  /**
   * 获取当前 token
   */
  getToken: (): string | null => {
    return localStorage.getItem(env.TOKEN_KEY)
  },

  /**
   * 设置 token
   */
  setToken: (token: string, refreshToken?: string): void => {
    localStorage.setItem(env.TOKEN_KEY, token)
    if (refreshToken) {
      localStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  /**
   * 移除 token
   */
  removeToken: (): void => {
    localStorage.removeItem(env.TOKEN_KEY)
    localStorage.removeItem(env.REFRESH_TOKEN_KEY)
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(env.TOKEN_KEY)
  },

  /**
   * 检查 token 是否过期（基于存储时间）
   */
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem(env.TOKEN_KEY)
    if (!token) return true

    // 这里可以添加 JWT 解析逻辑
    // 暂时返回 false，表示不过期
    return false
  },
}
