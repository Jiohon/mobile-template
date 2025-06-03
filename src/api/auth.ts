import { get, post, put } from "@/request"
import { LoginRequest, LoginResponse, User } from "@/types/auth"

/**
 * 用户登录
 */
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  return await post("/auth/login", data)
}

/**
 * 刷新Token
 */
export const refreshTokenApi = async (refreshToken: string): Promise<LoginResponse> => {
  return await post("/auth/refresh", {
    refresh_token: refreshToken,
  })
}

/**
 * 用户登出
 */
export const logoutApi = async (): Promise<void> => {
  await post("/auth/logout")
}

/**
 * 获取当前用户信息
 */
export const getCurrentUserApi = async (): Promise<User> => {
  return await get("/auth/me")
}

/**
 * 更新用户信息
 */
export const updateUserApi = async (data: Partial<User>): Promise<User> => {
  return await put("/auth/user", data)
}

/**
 * 修改密码
 */
export const changePasswordApi = async (data: {
  oldPassword: string
  newPassword: string
}): Promise<void> => {
  await post("/auth/change-password", data)
}
