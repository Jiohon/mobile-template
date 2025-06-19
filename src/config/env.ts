import type { ImportMetaEnv } from "../types/environment"

/**
 * 获取环境变量值
 */
const getEnvValue = (key: keyof ImportMetaEnv, defaultValue = undefined) => {
  const envKey = `VITE_${key}`
  const env = import.meta.env
  const value = env?.[envKey] || env?.[key]

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
const parseEnvConfig = (): ImportMetaEnv => {
  return {
    MODE: getEnvValue("MODE"),
    BASE_URL: getEnvValue("BASE_URL"),
    PROD: getEnvValue("PROD"),
    DEV: getEnvValue("DEV"),
    SSR: getEnvValue("SSR"),

    // 应用信息
    APP_TITLE: getEnvValue("APP_TITLE"),
    APP_VERSION: getEnvValue("APP_VERSION"),
    APP_DESCRIPTION: getEnvValue("APP_DESCRIPTION"),

    // 应用基础路径
    APP_BASE_PATH: getEnvValue("APP_BASE_PATH"),

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
export const isDev = env.MODE === "development"

/**
 * 是否为生产环境
 */
export const isProd = env.MODE === "production"

/**
 * 是否为预发布环境
 */
export const isStaging = env.MODE === "staging"

/**
 * 开发环境初始化（如需要可在此处添加开发专用逻辑）
 */
if (isDev) {
  console.log("�� 环境配置已加载:", env)
}
