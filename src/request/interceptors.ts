import { Method } from "alova"
import { Toast } from "antd-mobile"

import { tokenUtils } from "./auth"
import { errorMessages } from "./config"
import { RequestError } from "./types"

/**
 * 请求拦截器
 */
export const beforeRequestHandler = (method: Method) => {
  // 从localStorage获取token
  const token = tokenUtils.getToken()
  if (token) {
    method.config.headers = {
      ...method.config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  // 设置默认 Content-Type
  if (!method.config.headers["Content-Type"]) {
    method.config.headers["Content-Type"] = "application/json"
  }
}

/**
 * 响应拦截器
 */
export const responseHandler = async (response: Response) => {
  try {
    // 检查 HTTP 状态码（除了401，由认证处理器处理）
    if (!response.ok && response.status !== 401) {
      const message = errorMessages[response.status] || `连接错误${response.status}`

      Toast.show({
        icon: "fail",
        content: message,
      })

      const error: RequestError = {
        code: response.status,
        message,
        status: response.status,
        name: "HTTPError",
      }
      throw error
    }

    // 尝试解析 JSON 响应
    let data: any
    try {
      data = await response.json()
    } catch (err) {
      // 如果不是 JSON，可能是文件下载等
      return response
    }

    // 检查业务状态码
    if (data.code !== 200) {
      Toast.show({
        icon: "fail",
        content: data.message || "请求失败",
      })

      const error: RequestError = {
        code: data.code,
        message: data.message || "请求失败",
        name: "BusinessError",
      }
      throw error
    }

    // 返回业务数据
    return data.data
  } catch (error: any) {
    // 统一错误处理
    let message = "网络错误"

    if (error.name === "AbortError") {
      message = "请求超时"
    } else if (error.name === "TypeError") {
      message = "网络连接失败"
    } else if (error.message) {
      message = error.message
    }

    // 只有在错误不是我们手动抛出的情况下才显示 Toast
    if (!error.name || !["HTTPError", "BusinessError"].includes(error.name)) {
      Toast.show({
        icon: "fail",
        content: message,
      })
    }

    throw error
  }
}
