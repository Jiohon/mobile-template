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
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-antd": ["antd-mobile", "antd-mobile-icons"],
            "vendor-utils": ["alova", "dayjs", "classnames"],
          },
        },
      },
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
    },
    define: {
      __DEV__: false,
      __PROD__: false,
      __STAGING__: true,
    },
    esbuild: {
      // 预发布环境只移除 debugger
      drop: ["debugger"],
    },
  }
}
