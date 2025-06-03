import alova from "./index"

/**
 * GET 请求
 */
export const get = <T = any>(url: string, config?: any): Promise<T> => {
  return alova.Get(url, config)
}

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  return alova.Post(url, data, config)
}

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  return alova.Put(url, data, config)
}

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, config?: any): Promise<T> => {
  return alova.Delete(url, config)
}

/**
 * PATCH 请求
 */
export const patch = <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  return alova.Patch(url, data, config)
}
