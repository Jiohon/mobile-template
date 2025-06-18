import type { UserConfig } from "vite"

/**
 * 生产环境 Vite 配置
 */
export const createProdConfig = (_env: Record<string, string>): UserConfig => {
  return {
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

            // React 核心生态
            if (
              ["react", "react-dom", "react-router"].some((lib) => new RegExp(`/${lib}/`).test(id))
            ) {
              return "vendor-react"
            }

            // UI 组件库
            if (
              ["antd-mobile", "antd-mobile-icons"].some((lib) => new RegExp(`/${lib}/`).test(id))
            ) {
              return "vendor-antd"
            }

            // 国际化相关
            if (["i18next", "react-i18next"].some((lib) => new RegExp(`/${lib}/`).test(id))) {
              return "vendor-i18n"
            }

            // 状态管理和HTTP
            if (["zustand", "alova"].some((lib) => new RegExp(`/${lib}/`).test(id))) {
              return "vendor-state"
            }

            // 轻量级工具库
            if (
              ["lodash-es", "dayjs", "classnames", "rc-field-form", "ryt-jssdk"].some((lib) =>
                new RegExp(`/${lib}/`).test(id)
              )
            ) {
              return "vendor-utils"
            }

            // 其他未分类的第三方依赖
            return "vendor-misc"
          },
        },
      },
      // 启用 gzip 压缩
      reportCompressedSize: true,
      // 设置 chunk 大小警告限制
      chunkSizeWarningLimit: 250,
    },
    define: {
      __DEV__: false,
      __PROD__: true,
    },
    esbuild: {
      // 移除生产环境的 console 和 debugger
      drop: ["console", "debugger"],
    },
  }
}
