import { lazy } from "react"

import type { RouteConfig } from "@/types/router"

export const routes: RouteConfig[] = [
  {
    path: "/login",
    name: "Login",
    element: lazy(() => import("@/pages/Login")),
    meta: {
      title: "登录",
      access: {
        requireAuth: false,
      },
    },
  },
  {
    path: "/",
    name: "Root",
    redirect: "/home",
    meta: {
      title: "根路径",
      access: {
        requireAuth: false,
      },
    },
  },
  {
    path: "/home",
    name: "Home",
    element: () => import("@/pages/Home"),
    meta: {
      title: "首页",
      icon: "🏠",
      access: {
        requireAuth: true,
      },
    },
  },
  {
    path: "/profile",
    name: "Profile",
    element: () => import("@/pages/Profile"),
    meta: {
      title: "个人中心",
      icon: "👤",
      access: {
        requireAuth: true,
      },
    },
  },
  {
    path: "/settings",
    name: "Settings",
    element: () => import("@/pages/Settings"),
    meta: {
      title: "设置",
      icon: "⚙️",
      access: {
        requireAuth: true,
      },
    },
  },
  {
    path: "/schema-form-demo",
    name: "SchemaFormDemo",
    element: () => import("@/pages/SchemaFormDemo"),
    meta: {
      title: "动态表单演示",
      icon: "📋",
      access: {
        requireAuth: false,
      },
    },
  },
  {
    path: "/access-demo",
    name: "AccessDemo",
    element: () => import("@/pages/AccessDemo"),
    meta: {
      title: "权限系统演示",
      icon: "🔐",
      access: {
        requireAuth: false,
      },
    },
  },
  // 管理员功能
  {
    path: "/admin",
    name: "Admin",
    meta: {
      title: "系统管理",
      icon: "👨‍💼",
      access: {
        requireAuth: true,
        roles: ["admin"],
      },
    },
    children: [
      {
        path: "users",
        name: "UserManagement",
        element: () => import("@/pages/UserManagement"),
        meta: {
          title: "用户管理",
          icon: "👥",
          access: {
            requireAuth: true,
            roles: ["admin"],
            permissions: ["user:*:*"],
          },
        },
      },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    element: () => import("@/pages/NotFound"),
    meta: {
      title: "页面不存在",
      access: {
        requireAuth: false,
      },
    },
  },
]
