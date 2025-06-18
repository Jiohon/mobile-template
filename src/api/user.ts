import alova from "@/request"
import { User } from "@/types/auth"
import { PageResponse } from "@/types/common"

/**
 * 获取用户列表
 */
export const getUserListApi = async (params: {
  current: number
  pageSize: number
  keyword?: string
}) => {
  return await alova.Get<PageResponse<User[]>>("/users", { params })
}

/**
 * 获取用户详情
 */
export const getUserDetailApi = async (id: string) => {
  return await alova.Get<User>(`/users/${id}`)
}

/**
 * 创建用户
 */
export const createUserApi = async (data: Omit<User, "id" | "createTime" | "updateTime">) => {
  return await alova.Post<User>("/users", data)
}

/**
 * 更新用户
 */
export const updateUserInfoApi = async (id: string, data: Partial<User>) => {
  return await alova.Put<User>(`/users/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUserApi = async (id: string) => {
  await alova.Delete(`/users/${id}`)
}

/**
 * 批量删除用户
 */
export const batchDeleteUsersApi = async (ids: string[]) => {
  await alova.Delete("/users/batch", { data: { ids } })
}
