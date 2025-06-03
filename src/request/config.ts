import { env } from "@/config"

import { RequestConfig } from "./types"

// 获取环境配置
export const getEnvConfig = (): Partial<RequestConfig> => {
  return {
    baseURL: env.API_BASE_URL,
  }
}

// 错误消息映射
export const errorMessages: Record<number, string> = {
  400: "请求参数错误",
  401: "未授权，请重新登录",
  403: "拒绝访问",
  404: "请求地址出错",
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP版本不受支持",
}
