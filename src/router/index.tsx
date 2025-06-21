import { createBrowserRouter } from "react-router"

import { env } from "@/config"
import { PermissionsType } from "@/types/router"

import { generateLayoutRoutes } from "./generator"
import { routes } from "./routes"

/**
 * 创建动态路由
 */
export const createDynamicRouter = (
  userRolesSet: Set<string>,
  userPermissionsSet: Set<PermissionsType>
) => {
  // 根据用户权限生成路由
  const dynamicRoutes = generateLayoutRoutes(routes, userRolesSet, userPermissionsSet)
  const router = createBrowserRouter(dynamicRoutes, {
    basename: env.VITE_APP_BASE_PATH,
  })

  return router
}
