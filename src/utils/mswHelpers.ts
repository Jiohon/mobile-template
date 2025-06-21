/**
 * MSW 辅助工具函数
 */

/**
 * 检查Service Worker是否支持
 */
export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== "undefined" && "serviceWorker" in navigator
}

/**
 * 调试日志工具
 */
export const mswLogger = {
  info: (message: string, ...args: any[]) => {
    console.log(`🔧 [MSW] ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [MSW] ${message}`, ...args)
  },
  success: (message: string, ...args: any[]) => {
    console.log(`✅ [MSW] ${message}`, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ [MSW] ${message}`, ...args)
  },
}
