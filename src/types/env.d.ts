/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_ENV: "development" | "staging" | "production"

  // API 配置
  readonly VITE_API_BASE_URL: string

  // 反向代理配置
  readonly VITE_PROXY_PATH: string
  readonly VITE_PROXY_TARGET: string
  readonly VITE_PROXY_PATH_REWRITE: string

  // 认证配置
  readonly VITE_TOKEN_KEY: string
  readonly VITE_REFRESH_TOKEN_KEY: string
  readonly VITE_TOKEN_EXPIRES_IN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
