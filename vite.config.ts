// eslint-disable-next-line import/no-duplicates
import { defineConfig, loadEnv, mergeConfig } from "vite"

// eslint-disable-next-line import/no-duplicates
import { commonConfig, createDevConfig, createProdConfig, createStagingConfig } from "./vite"

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "")

  // 根据不同模式返回对应配置
  const getConfig = () => {
    switch (mode) {
      case "development":
        return mergeConfig(commonConfig(env), createDevConfig(env))

      case "staging":
        return mergeConfig(commonConfig(env), createStagingConfig(env))

      case "production":
        return mergeConfig(commonConfig(env), createProdConfig(env))

      case "deploy":
        return mergeConfig(commonConfig(env), createProdConfig(env))

      default:
        return mergeConfig(commonConfig(env), createDevConfig(env))
    }
  }

  const config = getConfig()

  // 开发环境下输出配置信息
  // if (env.VITE_APP_ENV === "development") {
  console.log(`🔧 Vite Config Loaded for ${mode} mode`)
  console.log(`📡 Proxy Target: ${env.VITE_PROXY_TARGET || "http://localhost:3001"}`)
  console.log(`🛣️ Proxy Path: ${env.VITE_PROXY_PATH || "/api"}`)
  console.log(`🚀 APP_BASE_PATH: ${env.VITE_APP_BASE_PATH}`)
  // }

  return config
})
