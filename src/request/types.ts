// Alova 请求配置类型
export interface RequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// 请求错误类型
export interface RequestError {
  code: string | number
  message: string
  status?: number
  name?: string
}

// 文件上传配置
export interface UploadConfig {
  field?: string
  maxSize?: number
  accept?: string[]
}

// Alova 响应拦截器返回类型
export interface AlovaResponse<T = any> {
  status: number
  statusText: string
  data: T
}
