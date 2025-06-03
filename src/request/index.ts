import { createAlova } from "alova"
import adapterFetch from "alova/fetch"

import { createAuthHandler } from "./auth"
import { getEnvConfig } from "./config"
import { beforeRequestHandler, responseHandler } from "./interceptors"

// 创建认证处理器
const { onAuthRequired, onResponseRefreshToken } = createAuthHandler()

// 创建 alova 实例
const alova = createAlova({
  // 基础配置
  baseURL: getEnvConfig().baseURL,
  timeout: 10000,

  // 使用 fetch 适配器
  requestAdapter: adapterFetch(),

  // 请求拦截器 - 使用认证处理器
  beforeRequest: onAuthRequired(beforeRequestHandler),

  // 响应拦截器 - 使用认证处理器和自定义逻辑
  responded: onResponseRefreshToken(responseHandler),
})

export default alova

// 导出请求方法
export { get, post, put, del, patch } from "./methods"

// 导出认证工具
export { tokenUtils } from "./auth"

// 导出类型
export type { RequestError, RequestConfig } from "./types"
