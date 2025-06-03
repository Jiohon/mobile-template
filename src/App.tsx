import { useEffect } from "react"

import { ConfigProvider } from "antd-mobile"
import zhCN from "antd-mobile/es/locales/zh-CN"
import { RouterProvider } from "react-router-dom"

import { createDynamicRouter } from "@/router"
import { useAuthStore } from "@/stores/auth"
import "@/styles/global.less"

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const router = createDynamicRouter()

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
