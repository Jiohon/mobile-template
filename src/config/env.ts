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
  API_TIMEOUT: number

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
 * 获取环境变量值
 */
const getEnvValue = (key: string, defaultValue = undefined) => {
  const envKey = `VITE_${key}`
  const env = import.meta.env
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
  if (value.includes(",")) {
    return (value as string).split(",").map((item) => item.trim())
  }

  return value
}

/**
 * 解析环境变量配置
 */
const parseEnvConfig = (): EnvConfig => {
  return {
    // 应用信息
    APP_TITLE: getEnvValue("APP_TITLE"),
    APP_VERSION: getEnvValue("APP_VERSION"),
    APP_DESCRIPTION: getEnvValue("APP_DESCRIPTION"),
    APP_ENV: getEnvValue("APP_ENV"),

    // API 配置
    API_BASE_URL: getEnvValue("API_BASE_URL"),
    API_TIMEOUT: getEnvValue("API_TIMEOUT"),

    // 认证配置
    TOKEN_KEY: getEnvValue("TOKEN_KEY"),
    REFRESH_TOKEN_KEY: getEnvValue("REFRESH_TOKEN_KEY"),
    TOKEN_EXPIRES_IN: getEnvValue("TOKEN_EXPIRES_IN"),

    // 反向代理配置
    PROXY_PATH: getEnvValue("PROXY_PATH"),
    PROXY_TARGET: getEnvValue("PROXY_TARGET"),
    PROXY_PATH_REWRITE: getEnvValue("PROXY_PATH_REWRITE"),
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
