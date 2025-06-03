import { RouteConfig } from "@/types/router"

export const routes: RouteConfig[] = [
  {
    path: "/login",
    name: "Login",
    element: () => import("@/pages/Login"),
    meta: {
      title: "登录",
      permission: {
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
      permission: {
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
      permission: {
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
      permission: {
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
      permission: {
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
      permission: {
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
      permission: {
        requireAuth: true,
        roles: ["admin"],
      },
    },
    children: [
      {
        path: "/admin/users",
        name: "UserManagement",
        element: () => import("@/pages/UserManagement"),
        meta: {
          title: "用户管理",
          icon: "👥",
          permission: {
            requireAuth: true,
            roles: ["admin"],
            permissions: ["user:read"],
          },
        },
      },
      {
        path: "/admin/system",
        name: "SystemSettings",
        element: () => import("@/pages/SystemSettings"),
        meta: {
          title: "系统设置",
          icon: "🔧",
          permission: {
            requireAuth: true,
            roles: ["admin"],
            permissions: ["system:config"],
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
      permission: {
        requireAuth: false,
      },
    },
  },
]
