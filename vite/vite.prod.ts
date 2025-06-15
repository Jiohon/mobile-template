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
          manualChunks: {
            // React 相关
            "vendor-react": ["react", "react-dom", "react-router"],
            // UI 组件库
            "vendor-antd": ["antd-mobile", "antd-mobile-icons"],
            // 工具库
            "vendor-utils": ["alova", "dayjs", "classnames"],
          },
        },
      },
      // 启用 gzip 压缩
      reportCompressedSize: true,
      // 设置 chunk 大小警告限制
      chunkSizeWarningLimit: 1000,
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
