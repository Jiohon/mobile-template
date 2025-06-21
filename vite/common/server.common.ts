import basicSsl from "@vitejs/plugin-basic-ssl"

import type { AppEnvConfig } from "../../src/types/environment"
import type { UserConfig } from "vite"

/**
 * 构建(build)环境公共配置
 */
export const createServerCommonConfig = (
  env: AppEnvConfig
): Pick<UserConfig, "plugins" | "server"> => {
  // 代理路径配置
  const enableProxy = env.VITE_PROXY_ENABLE
  const enableMock = env.VITE_MOCK_ENABLE
  const proxyPath = env.VITE_PROXY_PATH
  const proxyTarget = env.VITE_PROXY_TARGET
  const proxyPathRewrite = env.VITE_PROXY_PATH_REWRITE

  // HTTPS 配置
  const enableHttps = env.VITE_HTTPS_ENABLE

  // HTTPS 日志输出
  if (enableHttps) {
    console.log("🔒 HTTPS 模式已启用")
    console.log("🔐 使用 @vitejs/plugin-basic-ssl 自动生成的自签名证书")
    console.log("⚠️  注意: 自签名证书可能需要在浏览器中手动信任")
  }

  return {
    plugins: [enableHttps && basicSsl()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      open: true,
      proxy: enableProxy
        ? {
            [proxyPath]: {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(proxyPathRewrite), ""),
              configure: (proxy) => {
                proxy.on("error", (err) => {
                  console.log("🚨 Proxy Error:", err.message)
                })
                proxy.on("proxyReq", (proxyReq, req) => {
                  if (enableMock) {
                    console.log(
                      "📤 [Fallback] Proxy Request:",
                      req.method,
                      req.url,
                      "→",
                      proxyTarget
                    )
                  } else {
                    console.log("📤 Proxy Request:", req.method, req.url, "→", proxyTarget)
                  }
                })
                proxy.on("proxyRes", (proxyRes, req) => {
                  if (enableMock) {
                    console.log("📥 [Fallback] Proxy Response:", proxyRes.statusCode, req.url)
                  } else {
                    console.log("📥 Proxy Response:", proxyRes.statusCode, req.url)
                  }
                })
              },
            },
          }
        : {},
    },
  }
}
