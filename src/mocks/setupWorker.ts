import { env, isProd } from "@/config"
import { isServiceWorkerSupported, mswLogger } from "@/utils/mswHelpers"

import { worker } from "./browser"

// 启动MSW worker
export const startMockServiceWorker = async () => {
  if (!env.VITE_MOCK_ENABLE) {
    mswLogger.info("MSW Mock 已禁用")
    return
  }

  if (typeof window === "undefined") {
    mswLogger.warn("非浏览器环境，跳过MSW启动")
    return
  }

  if (!isServiceWorkerSupported()) {
    throw new Error("当前浏览器不支持Service Worker")
  }

  mswLogger.info("启动MSW Service Worker")

  try {
    // 配置Service Worker URL
    const serviceWorkerUrl = `${env.VITE_APP_BASE_PATH || "/"}mockServiceWorker.js`

    // 启动MSW worker
    const registration = await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: serviceWorkerUrl,
      },
    })

    mswLogger.success("MSW worker.start() 调用完成", registration)

    // 验证Service Worker是否正确注册
    const currentRegistration = await navigator.serviceWorker.getRegistration()
    if (currentRegistration) {
      mswLogger.success("Service Worker注册验证成功")
    } else {
      mswLogger.warn("Service Worker注册验证失败")
    }

    mswLogger.success("MSW Mock Service Worker启动完成")
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    mswLogger.error("MSW启动失败:", errorMessage)
    mswLogger.error("错误详情:", error)

    // 在生产环境中，提供更详细的错误信息
    if (isProd) {
      mswLogger.error("生产环境MSW启动失败，可能的原因:")
      mswLogger.error("1. Service Worker文件路径不正确")
      mswLogger.error("2. HTTPS证书问题")
      mswLogger.error("3. 浏览器安全策略限制")
    }

    throw error
  }
}

// 停止MSW worker
export const stopMockServiceWorker = () => {
  if (typeof window !== "undefined") {
    try {
      worker.stop()
      mswLogger.success("MSW Mock Service Worker已停止")
    } catch (error) {
      mswLogger.error("停止MSW失败:", error)
    }
  }
}
