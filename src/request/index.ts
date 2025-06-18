import { createAlova } from "alova"
import adapterFetch from "alova/fetch"

import { env } from "@/config"

import { createAuthHandler } from "./auth"
import { beforeRequestHandler, responseHandler } from "./interceptors"

// 创建认证处理器
const { onAuthRequired, onResponseRefreshToken } = createAuthHandler()

// 创建 alova 实例
const alova = createAlova({
  // 基础配置
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,

  // 使用 fetch 适配器
  requestAdapter: adapterFetch(),

  // 请求拦截器 - 使用认证处理器
  beforeRequest: onAuthRequired(beforeRequestHandler),

  // 响应拦截器 - 使用认证处理器和自定义逻辑
  responded: onResponseRefreshToken(responseHandler),
})

export default alova

// 导出类型
export type * from "./types"
