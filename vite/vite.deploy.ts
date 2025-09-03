import { mergeConfig } from "vite"

import { createBuildCommonConfig } from "./common/build.common"

import type { AppEnvConfig } from "../src/types/environment"
import type { UserConfig } from "vite"

/**
 * 部署(deploy)环境 Vite 配置
 */
export const createDeployConfig = (env: AppEnvConfig): Omit<UserConfig, "server"> => {
  return mergeConfig(createBuildCommonConfig(env), {
    build: {
      sourcemap: env.VITE_SOURCEMAP_ENABLE,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    define: {
      __DEV__: false,
      __PROD__: true,
    },
  })
}
