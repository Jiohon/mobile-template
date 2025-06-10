import { useMemo } from "react"

import { TabBar } from "antd-mobile"
import {
  AppOutline,
  FileOutline,
  TeamOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { useAuthStore } from "@/stores/auth"
import { shouldShowMenuItem } from "@/utils/permission"

import styles from "./index.module.less"

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const { user } = useAuthStore()

  // 根据用户权限动态生成底部导航
  const tabs = useMemo(() => {
    const allTabs = [
      {
        key: "/home",
        title: "首页",
        icon: <AppOutline />,
        permission: { requireAuth: true },
      },
      {
        key: "/schema-form-demo",
        title: "表单",
        icon: <FileOutline />,
        permission: { requireAuth: false },
      },
      {
        key: "/admin/users",
        title: "管理",
        icon: <TeamOutline />,
        permission: {
          requireAuth: true,
          roles: ["admin"],
        },
      },
      {
        key: "/profile",
        title: "个人",
        icon: <UserOutline />,
        permission: { requireAuth: true },
      },
      {
        key: "/settings",
        title: "设置",
        icon: <UnorderedListOutline />,
        permission: { requireAuth: true },
      },
    ]

    // 根据权限过滤菜单项
    return allTabs.filter((tab) => shouldShowMenuItem(tab.permission, user))
  }, [user])

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.tabBar}>
        <TabBar activeKey={pathname} onChange={setRouteActive} safeArea>
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  )
}

export default Layout
