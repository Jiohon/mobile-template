import { ConfigProvider } from "antd-mobile"
import zhCN from "antd-mobile/es/locales/zh-CN"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { createDynamicRouter } from "./router"
import "./styles/global.less"

// 创建动态路由实例
const router = createDynamicRouter()

ReactDOM.createRoot(document.getElementById("root")!).render(
  // 暂时注释掉 StrictMode 以避免 antd-mobile 的 findDOMNode 警告
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
  // </React.StrictMode>
)
