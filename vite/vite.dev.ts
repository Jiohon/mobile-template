import { viteMockServe } from "vite-plugin-mock"

import type { UserConfig } from "vite"

/**
 * 开发环境 Vite 配置
 */
export const createDevConfig = (env: Record<string, string>): UserConfig => {
  // 代理路径配置
  const proxyPath = env.VITE_PROXY_PATH || "/api"
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:3001"
  const proxyPathRewrite = env.VITE_PROXY_PATH_REWRITE || "^/api"

  // 是否启用mock（当没有后端服务时启用）
  const enableMock = env.VITE_ENABLE_MOCK !== "false"

  return {
    plugins: [
      // Mock插件配置
      viteMockServe({
        mockPath: "mock",
        enable: enableMock,
        watchFiles: true,
        logger: true,
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 3000,
      open: true,
      proxy: enableMock
        ? undefined
        : {
            // 只有在禁用mock时才启用代理
            [proxyPath]: {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(proxyPathRewrite), ""),
              configure: (proxy) => {
                proxy.on("error", (err) => {
                  console.log("🚨 Proxy Error:", err.message)
                })
                proxy.on("proxyReq", (proxyReq, req) => {
                  console.log("📤 Proxy Request:", req.method, req.url, "→", proxyTarget)
                })
                proxy.on("proxyRes", (proxyRes, req) => {
                  console.log("📥 Proxy Response:", proxyRes.statusCode, req.url)
                })
              },
            },
          },
    },
    define: {
      __DEV__: true,
      __PROD__: false,
    },
  }
}
