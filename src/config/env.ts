/**
 * 环境变量类型定义
 */
export interface EnvConfig {
  // 应用信息
  APP_TITLE: string
  APP_VERSION: string
  APP_DESCRIPTION: string
  APP_ENV: "development" | "staging" | "production"

  // API 配置
  API_BASE_URL: string

  // 反向代理配置
  PROXY_PATH: string
  PROXY_TARGET: string
  PROXY_PATH_REWRITE: string

  // 认证配置
  TOKEN_KEY: string
  REFRESH_TOKEN_KEY: string
  TOKEN_EXPIRES_IN: number
}

/**
 * 默认环境变量配置
 */
const defaultConfig: EnvConfig = {
  // 应用信息
  APP_TITLE: "Antd Mobile Template",
  APP_VERSION: "1.0.0",
  APP_DESCRIPTION: "基于 antd-mobile 的移动端应用模版",
  APP_ENV: "development",

  // API 配置
  API_BASE_URL: "/api",

  // 反向代理配置
  PROXY_PATH: "/api",
  PROXY_TARGET: "http://localhost:3001",
  PROXY_PATH_REWRITE: "^/api",

  // 认证配置
  TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  TOKEN_EXPIRES_IN: 3600000, // 1小时
}

/**
 * 获取环境变量值
 */
const getEnvValue = (key: string, defaultValue: any = undefined): any => {
  const envKey = `VITE_${key}`
  const env = (import.meta as any).env
  const value = env?.[envKey]

  if (value === undefined || value === "") {
    return defaultValue
  }

  // 处理布尔值
  if (value === "true") return true
  if (value === "false") return false

  // 处理数字
  if (!isNaN(Number(value))) return Number(value)

  // 处理数组（逗号分隔）
  if (typeof defaultValue === "object" && Array.isArray(defaultValue)) {
    return value.split(",").map((item: string) => item.trim())
  }

  return value
}

/**
 * 解析环境变量配置
 */
const parseEnvConfig = (): EnvConfig => {
  return {
    // 应用信息
    APP_TITLE: getEnvValue("APP_TITLE", defaultConfig.APP_TITLE),
    APP_VERSION: getEnvValue("APP_VERSION", defaultConfig.APP_VERSION),
    APP_DESCRIPTION: getEnvValue("APP_DESCRIPTION", defaultConfig.APP_DESCRIPTION),
    APP_ENV: getEnvValue("APP_ENV", defaultConfig.APP_ENV),

    // API 配置
    API_BASE_URL: getEnvValue("API_BASE_URL", defaultConfig.API_BASE_URL),

    // 反向代理配置
    PROXY_PATH: getEnvValue("PROXY_PATH", defaultConfig.PROXY_PATH),
    PROXY_TARGET: getEnvValue("PROXY_TARGET", defaultConfig.PROXY_TARGET),
    PROXY_PATH_REWRITE: getEnvValue("PROXY_PATH_REWRITE", defaultConfig.PROXY_PATH_REWRITE),

    // 认证配置
    TOKEN_KEY: getEnvValue("TOKEN_KEY", defaultConfig.TOKEN_KEY),
    REFRESH_TOKEN_KEY: getEnvValue("REFRESH_TOKEN_KEY", defaultConfig.REFRESH_TOKEN_KEY),
    TOKEN_EXPIRES_IN: getEnvValue("TOKEN_EXPIRES_IN", defaultConfig.TOKEN_EXPIRES_IN),
  }
}

/**
 * 环境配置实例
 */
export const env = parseEnvConfig()

/**
 * 是否为开发环境
 */
export const isDev = env.APP_ENV === "development"

/**
 * 是否为生产环境
 */
export const isProd = env.APP_ENV === "production"

/**
 * 是否为预发布环境
 */
export const isStaging = env.APP_ENV === "staging"

/**
 * 开发环境初始化（如需要可在此处添加开发专用逻辑）
 */
if (isDev) {
  console.log("🔧 环境配置已加载:", env)
}
