import { useMemo } from "react"

import { ConfigProvider } from "antd-mobile"
import zhCN from "antd-mobile/es/locales/zh-CN"
import { Helmet } from "react-helmet"
import { RouterProvider } from "react-router"

import { env } from "@/config"
import { createDynamicRouter } from "@/router"
import { useAuthStore } from "@/stores/auth"

import "@/styles/global.less"

function App() {
  const { userRolesSet, userPermissionsSet } = useAuthStore()

  const router = useMemo(
    () => createDynamicRouter(userRolesSet, userPermissionsSet),
    [userRolesSet, userPermissionsSet]
  )

  return (
    <>
      <Helmet>
        <title>{env.APP_TITLE}</title>
        <meta name="description" content={env.APP_DESCRIPTION} />
      </Helmet>

      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  )
}

export default App
