import { name } from "../../package.json"

import type { AppEnvConfig } from "../types/environment"

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * 解析环境变量配置
 */
export const parseEnv = (env: Record<string, string>): AppEnvConfig => {
  const parsed: Mutable<AppEnvConfig> = {} as Mutable<AppEnvConfig>

  for (const [_key, value] of Object.entries(env)) {
    const key = _key as keyof AppEnvConfig

    if (value === undefined) {
      parsed[key] = undefined as never
      continue
    }

    if (value === "true") {
      parsed[key] = true as never
    } else if (value === "false") {
      parsed[key] = false as never
    } else if (!isNaN(Number(value))) {
      parsed[key] = Number(value) as never
    } else {
      parsed[key] = value as never
    }
  }

  return parsed
}

/**
 * 获取环境变量值
 */
export const getEnvValue = <T extends keyof AppEnvConfig>(
  key: T,
  defaultValue?: AppEnvConfig[T]
): AppEnvConfig[T] => {
  const env = import.meta.env

  const value = env?.[key]

  if (value === undefined || value === "") {
    return defaultValue as AppEnvConfig[T]
  }

  // 处理布尔值
  if (value === "true") return true as AppEnvConfig[T]
  if (value === "false") return false as AppEnvConfig[T]

  // 处理数字
  if (/\d+/.test(`${value}`) && !isNaN(Number(value))) {
    return Number(value) as AppEnvConfig[T]
  }

  return value
}

/**
 * 解析环境变量配置
 */
const parseEnvConfig = (): AppEnvConfig => {
  return {
    MODE: getEnvValue("MODE"),
    PROD: getEnvValue("PROD"),
    DEV: getEnvValue("DEV"),
    SSR: getEnvValue("SSR"),

    /**
     * 应用标题
     */
    VITE_APP_TITLE: getEnvValue("VITE_APP_TITLE", name),
    /**
     * 应用描述
     */
    VITE_APP_DESCRIPTION: getEnvValue("VITE_APP_DESCRIPTION"),

    /**
     * 应用基础路径
     */
    VITE_APP_BASE_PATH: getEnvValue("VITE_APP_BASE_PATH"),

    /**
     * API 配置
     */
    VITE_API_BASE_URL: getEnvValue("VITE_API_BASE_URL"),
    /**
     * API 超时时间
     */
    VITE_API_TIMEOUT: getEnvValue("VITE_API_TIMEOUT"),

    /**
     * 认证配置
     */
    VITE_TOKEN_KEY: getEnvValue("VITE_TOKEN_KEY"),
    VITE_REFRESH_TOKEN_KEY: getEnvValue("VITE_REFRESH_TOKEN_KEY"),
    VITE_TOKEN_EXPIRES_IN: getEnvValue("VITE_TOKEN_EXPIRES_IN"),

    /**
     * 是否启用代理
     */
    VITE_PROXY_ENABLE: getEnvValue("VITE_PROXY_ENABLE"),
    /**
     * 反向代理路径
     */
    VITE_PROXY_PATH: getEnvValue("VITE_PROXY_PATH"),
    /**
     * 反向代理目标地址
     */
    VITE_PROXY_TARGET: getEnvValue("VITE_PROXY_TARGET"),
    /**
     * 反向代理路径重写规则
     */
    VITE_PROXY_PATH_REWRITE: getEnvValue("VITE_PROXY_PATH_REWRITE"),

    /**
     * 是否启用 Mock
     */
    VITE_MOCK_ENABLE: getEnvValue("VITE_MOCK_ENABLE"),

    /**
     * 是否启用 PWA
     */
    VITE_PWA_ENABLE: getEnvValue("VITE_PWA_ENABLE"),

    /**
     * 是否启用chunks可视化分析
     */
    VITE_VISUALIZER_ENABLE: getEnvValue("VITE_VISUALIZER_ENABLE"),

    /**
     * 是否启用 HTTPS
     */
    VITE_HTTPS_ENABLE: getEnvValue("VITE_HTTPS_ENABLE"),

    /**
     * 是否启用 sourcemap
     */
    VITE_SOURCEMAP_ENABLE: getEnvValue("VITE_SOURCEMAP_ENABLE"),
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
