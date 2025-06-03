import path from "path"
import { fileURLToPath } from "url"

import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

import type { UserConfig } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 公共 Vite 配置
 */
export const commonConfig: UserConfig = {
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "Antd Mobile Template",
        short_name: "AntdMobile",
        description: "基于 antd-mobile 的移动端应用模版",
        theme_color: "#1677ff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/pages": path.resolve(__dirname, "../src/pages"),
      "@/utils": path.resolve(__dirname, "../src/utils"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
      "@/stores": path.resolve(__dirname, "../src/stores"),
      "@/types": path.resolve(__dirname, "../src/types"),
      "@/assets": path.resolve(__dirname, "../src/assets"),
      "@/assets/images": path.resolve(__dirname, "../src/assets/images"),
      "@/assets/styles": path.resolve(__dirname, "../src/assets/styles"),
    },
  },
  // 静态资源处理
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"],

  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, "../src/assets/styles/variables.less")}";`,
        modifyVars: {
          // 可以在这里定义全局 Less 变量
        },
      },
    },
  },
}
