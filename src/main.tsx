import ReactDOM from "react-dom/client"

import App from "./App"
import { env } from "./config"
import { startMockServiceWorker } from "./mocks/setupWorker"
import "./styles/global.less"

// 渲染应用
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
}

// 启动应用
const bootstrap = async () => {
  if (env.VITE_MOCK_ENABLE) {
    try {
      console.log("🔧 [main] MSW is enabled, starting mock service worker...")
      await startMockServiceWorker()
      console.log("✅ [main] MSW mock service worker started successfully.")
    } catch (error) {
      console.error("🚨 [main] MSW start failed, app will continue without mock.", error)
    }
  }
  renderApp()
}

bootstrap()
