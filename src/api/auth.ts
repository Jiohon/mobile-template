import alova from "@/request"
import { LoginRequest, LoginResponse, User } from "@/types/auth"

/**
 * 用户登录
 */
export const loginApi = async (data: LoginRequest) => {
  return await alova.Post<LoginResponse>("/auth/login", data)
}

/**
 * 刷新Token
 */
export const refreshTokenApi = async (refreshToken: string) => {
  return await alova.Post<LoginResponse>("/auth/refresh", {
    refresh_token: refreshToken,
  })
}

/**
 * 用户登出
 */
export const logoutApi = async () => {
  await alova.Post("/auth/logout")
}

/**
 * 获取当前用户信息
 */
export const getCurrentUserApi = async () => {
  return await alova.Get<User>("/auth/me")
}

/**
 * 更新用户信息
 */
export const updateUserApi = async (data: Partial<User>) => {
  return await alova.Put<User>("/auth/user", data)
}

/**
 * 修改密码
 */
export const changePasswordApi = async (data: { oldPassword: string; newPassword: string }) => {
  await alova.Post("/auth/change-password", data)
}
