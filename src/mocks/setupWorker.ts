import { worker } from "./browser"

// 启动MSW worker
export const startMockServiceWorker = async () => {
  if (typeof window !== "undefined") {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
    console.log("🔧 MSW Mock Service Worker started")
  }
}

// 停止MSW worker
export const stopMockServiceWorker = () => {
  if (typeof window !== "undefined") {
    worker.stop()
    console.log("🔧 MSW Mock Service Worker stopped")
  }
}
