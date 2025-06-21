import { mergeConfig } from "vite"

import { createServerCommonConfig } from "./common/server.common"

import type { AppEnvConfig } from "../src/types/environment"
import type { UserConfig } from "vite"

/**
 * 开发环境 Vite 配置
 */
export const createDevConfig = (env: AppEnvConfig): UserConfig => {
  return mergeConfig(createServerCommonConfig(env), {
    server: {},
    define: {
      __DEV__: true,
      __PROD__: false,
    },
  })
}
