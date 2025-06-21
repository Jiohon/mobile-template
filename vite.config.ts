// eslint-disable-next-line import/no-duplicates
import { defineConfig, loadEnv, mergeConfig } from "vite"

import { parseEnv } from "./src/config/env"
import {
  createDeployConfig,
  createDevConfig,
  createProdConfig,
  createSharedCommonConfig,
  createStagingConfig,
  // eslint-disable-next-line import/no-duplicates
} from "./vite"

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  // 加载环境变量
  const env = parseEnv(loadEnv(mode, process.cwd(), ""))

  // 根据不同模式返回对应配置
  const getConfig = () => {
    switch (mode) {
      case "development":
        return mergeConfig(createSharedCommonConfig(env), createDevConfig(env))

      case "staging":
        return mergeConfig(createSharedCommonConfig(env), createStagingConfig(env))

      case "production":
        return mergeConfig(createSharedCommonConfig(env), createProdConfig(env))

      case "deploy":
        return mergeConfig(createSharedCommonConfig(env), createDeployConfig(env))

      default:
        return mergeConfig(createSharedCommonConfig(env), createDevConfig(env))
    }
  }

  const config = getConfig()

  // 开发环境下输出配置信息
  if (["development", "local"].includes(env.MODE)) {
    console.log(`🔧 Vite Config Loaded for ${mode} mode`)
    console.log(`📡 Proxy enabled: ${env.VITE_PROXY_ENABLE}`)
    console.log(`🚀 Mock enabled: ${env.VITE_MOCK_ENABLE}`)
    console.log(`🚀 PWA enabled: ${env.VITE_PWA_ENABLE}`)
    console.log(`🚀 APP_BASE_PATH: ${env.VITE_APP_BASE_PATH}`)
    console.log(`🚀 API_BASE_URL: ${env.VITE_API_BASE_URL}`)
  }

  return config
})
