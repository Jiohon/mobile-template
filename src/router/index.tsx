import { createBrowserRouter } from "react-router-dom"

import { useAuthStore } from "@/stores/auth"

import { generateLayoutRoutes } from "./generator"
import { routes } from "./routes"

/**
 * 创建动态路由
 */
export const createDynamicRouter = () => {
  // 获取当前用户信息（这里可以从localStorage或其他地方获取）
  const user = useAuthStore.getState().user

  // 根据用户权限生成路由
  const dynamicRoutes = generateLayoutRoutes(routes, user)

  const router = createBrowserRouter(dynamicRoutes)

  return router
}

// 默认导出静态路由（用于初始化）
const router = createBrowserRouter(generateLayoutRoutes(routes, null))

export default router
