// 扩展 ImportMeta 接口以支持 Vite 的 env 属性
declare global {
  interface ImportMeta {
    readonly env: AppEnvConfig
  }
}

/**
 * 应用环境配置接口
 */
export interface AppEnvConfig {
  // 基础 Vite 环境变量
  readonly MODE: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean

  /**
   * 应用标题
   */
  readonly VITE_APP_TITLE: string
  /**
   * 应用描述
   */
  readonly VITE_APP_DESCRIPTION: string

  /**
   * 应用基础路径
   */
  readonly VITE_APP_BASE_PATH: string

  /**
   * API 配置
   */
  readonly VITE_API_BASE_URL: string
  /**
   * API 超时时间
   */
  readonly VITE_API_TIMEOUT: number

  /**
   * 是否启用代理
   */
  readonly VITE_PROXY_ENABLE: boolean

  /**
   * 反向代理路径
   */
  readonly VITE_PROXY_PATH: string
  /**
   * 反向代理目标地址
   */
  readonly VITE_PROXY_TARGET: string
  /**
   * 反向代理路径重写规则
   */
  readonly VITE_PROXY_PATH_REWRITE: string

  /**
   * 认证配置
   */
  readonly VITE_TOKEN_KEY: string
  /**
   * 刷新令牌键
   */
  readonly VITE_REFRESH_TOKEN_KEY: string
  /**
   * 令牌过期时间
   */
  readonly VITE_TOKEN_EXPIRES_IN: number

  /**
   * 是否启用 Mock
   */
  readonly VITE_MOCK_ENABLE: boolean

  /**
   * 是否启用 PWA
   */
  readonly VITE_PWA_ENABLE: boolean

  /**
   * 是否启用chunks可视化分析
   */
  readonly VITE_VISUALIZER_ENABLE: boolean

  /**
   * 是否启用 HTTPS
   */
  readonly VITE_HTTPS_ENABLE: boolean

  /**
   * 是否启用 sourcemap
   */
  readonly VITE_SOURCEMAP_ENABLE: boolean
}
