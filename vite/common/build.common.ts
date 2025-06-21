import { visualizer } from "rollup-plugin-visualizer"

import type { AppEnvConfig } from "../../src/types/environment"
import type { PluginOption, UserConfig } from "vite"

/**
 * 构建(build)环境公共配置
 */
export const createBuildCommonConfig = (
  env: AppEnvConfig
): Pick<UserConfig, "plugins" | "build"> => {
  return {
    plugins: [
      env.VITE_VISUALIZER_ENABLE &&
        (visualizer({
          open: true, // 构建后自动打开
          filename: "dist/stats.html",
          gzipSize: true,
          brotliSize: true,
        }) as PluginOption),
    ],
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks: (id) => {
            if (!id.includes("node_modules")) {
              return null
            }

            // UI 组件库
            if (
              ["antd-mobile", "antd-mobile-icons"].some((lib) => new RegExp(`/${lib}/`).test(id))
            ) {
              return "vendor-antd"
            }

            // 国际化相关 - 仅保留纯国际化库
            if (["react-i18next", "i18next"].some((lib) => new RegExp(`/${lib}/`).test(id))) {
              return "vendor-i18n"
            }

            // 工具库
            if (
              [
                "zustand",
                "alova",
                "lodash",
                "lodash-es",
                "dayjs",
                "classnames",
                "ryt-jssdk",
                "react-helmet",
              ].some((lib) => new RegExp(`/(@${lib}|${lib})/`).test(id))
            ) {
              return "vendor-utils"
            }

            // msw 相关依赖
            if (["msw", "graphql", "bundled"].some((lib) => id.includes(lib))) {
              return "vendor-mock"
            }

            // React 核心
            if (["react", "react-dom"].some((lib) => new RegExp(`/${lib}/`).test(id))) {
              return "vendor-react-core"
            }

            // React 生态相关
            if (["react", "react-router"].some((lib) => id.includes(lib))) {
              return "vendor-react-other"
            }

            // 其他未分类的第三方依赖
            return "vendor-misc"
          },
        },
      },
      // 启用 gzip 压缩
      reportCompressedSize: true,
      // 设置 chunk 大小警告限制
      chunkSizeWarningLimit: 300,
    },
  }
}
