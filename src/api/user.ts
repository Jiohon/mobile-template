import { del, get, post, put } from "@/request"
import { User } from "@/types/auth"
import { PageResponse } from "@/types/common"

/**
 * 获取用户列表
 */
export const getUserListApi = async (params: {
  current: number
  pageSize: number
  keyword?: string
}): Promise<PageResponse<User[]>> => {
  return await get("/users", { params })
}

/**
 * 获取用户详情
 */
export const getUserDetailApi = async (id: string): Promise<User> => {
  return await get(`/users/${id}`)
}

/**
 * 创建用户
 */
export const createUserApi = async (
  data: Omit<User, "id" | "createTime" | "updateTime">
): Promise<User> => {
  return await post("/users", data)
}

/**
 * 更新用户
 */
export const updateUserInfoApi = async (id: string, data: Partial<User>): Promise<User> => {
  return await put(`/users/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUserApi = async (id: string): Promise<void> => {
  await del(`/users/${id}`)
}

/**
 * 批量删除用户
 */
export const batchDeleteUsersApi = async (ids: string[]): Promise<void> => {
  await del("/users/batch", { data: { ids } })
}
