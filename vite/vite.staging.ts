import type { UserConfig } from "vite"

/**
 * 预发布环境 Vite 配置
 */
export const createStagingConfig = (_env: Record<string, string>): UserConfig => {
  return {
    build: {
      outDir: "dist",
      sourcemap: true, // 保留 sourcemap 便于调试
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: false, // 保留 console 便于调试
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
              ["zustand", "alova", "lodash-es", "dayjs", "classnames", "ryt-jssdk"].some((lib) =>
                new RegExp(`/${lib}/`).test(id)
              )
            ) {
              return "vendor-utils"
            }

            // React 核心生态 - 包含所有依赖 React 的库（包括间接依赖）
            if (["react", "react-dom"].some((lib) => new RegExp(`/${lib}/`).test(id))) {
              return "vendor-react-core"
            }

            if (["react"].some((lib) => id.includes(lib))) {
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
      chunkSizeWarningLimit: 500,
    },
    define: {
      __DEV__: false,
      __PROD__: false,
    },
    esbuild: {
      // 预发布环境保留 console，只移除 debugger
      drop: ["debugger"],
    },
  }
}
