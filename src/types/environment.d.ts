// 扩展 ImportMeta 接口以支持 Vite 的 env 属性
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// Vite 环境变量类型声明 - 包含所有项目中使用的环境变量
export interface ImportMetaEnv {
  // 基础 Vite 环境变量
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean

  /**
   * 应用标题
   */
  readonly APP_TITLE: string
  /**
   * 应用版本
   */
  readonly APP_VERSION: string
  /**
   * 应用描述
   */
  readonly APP_DESCRIPTION: string

  /**
   * 应用基础路径
   */
  readonly APP_BASE_PATH: string

  /**
   * API 配置
   */
  readonly API_BASE_URL: string
  /**
   * API 超时时间
   */
  readonly API_TIMEOUT: number

  /**
   * 反向代理配置
   */
  readonly PROXY_PATH: string
  /**
   * 反向代理目标
   */
  readonly PROXY_TARGET: string
  /**
   * 反向代理路径重写
   */
  readonly PROXY_PATH_REWRITE: string

  /**
   * 认证配置
   */
  readonly TOKEN_KEY: string
  /**
   * 刷新令牌键
   */
  readonly REFRESH_TOKEN_KEY: string
  /**
   * 令牌过期时间
   */
  readonly TOKEN_EXPIRES_IN: number

  // 允许其他未明确定义的环境变量
  readonly [key: string]: any
}
