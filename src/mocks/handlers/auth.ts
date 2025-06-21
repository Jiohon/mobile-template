import { http, HttpResponse } from "msw"

// 生成随机字符串函数（替代Mock.Random）
const generateRandomString = (type: "upper" | "lower", length: number): string => {
  const chars =
    type === "upper"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      : "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 模拟用户数据
const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    phone: "13800138000",
    avatar: "https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg",
    roles: ["admin"],
    permissions: ["*:*:*"],
    createTime: "2023-01-01T00:00:00.000Z",
    updateTime: "2023-12-01T00:00:00.000Z",
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    phone: "13800138001",
    avatar: "https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg",
    roles: ["user"],
    permissions: [],
    createTime: "2023-06-01T00:00:00.000Z",
    updateTime: "2023-12-01T00:00:00.000Z",
  },
]

// 存储当前登录的用户token
let currentToken: string | null = null
let currentUser: any = null

// 生成随机token
const generateToken = () => generateRandomString("upper", 32)
const generateRefreshToken = () => generateRandomString("lower", 32)

export const authHandlers = [
  // 用户登录
  http.post("http://localhost:3000/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string }
    const { username, password } = body

    // 简单验证
    if (!username || !password) {
      const response = {
        code: 400,
        message: "用户名和密码不能为空",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 查找用户
    const user = mockUsers.find((u) => u.username === username)
    if (!user) {
      const response = {
        code: 401,
        message: "用户名或密码错误",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 验证密码（这里简化处理，实际项目中应该加密比较）
    if (password !== "123456") {
      const response = {
        code: 401,
        message: "用户名或密码错误",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 生成token
    const token = generateToken()
    const refreshToken = generateRefreshToken()

    // 保存当前登录状态
    currentToken = token
    currentUser = user

    const response = {
      code: 200,
      message: "登录成功",
      data: {
        token,
        refreshToken,
        user,
      },
    }

    return HttpResponse.json(response)
  }),

  // 刷新Token
  http.post("http://localhost:3000/api/auth/refresh", async ({ request }) => {
    const body = (await request.json()) as { refresh_token: string }
    const { refresh_token } = body

    if (!refresh_token) {
      const response = {
        code: 400,
        message: "refresh_token不能为空",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 简单验证refresh_token有效性
    if (!currentUser) {
      const response = {
        code: 401,
        message: "refresh_token无效",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 生成新的token
    const token = generateToken()
    const refreshToken = generateRefreshToken()
    currentToken = token

    const response = {
      code: 200,
      message: "刷新成功",
      data: {
        token,
        refreshToken,
        user: currentUser,
      },
    }

    return HttpResponse.json(response)
  }),

  // 用户登出
  http.post("http://localhost:3000/api/auth/logout", () => {
    // 清除登录状态
    currentToken = null
    currentUser = null

    const response = {
      code: 200,
      message: "登出成功",
      data: null,
    }

    return HttpResponse.json(response)
  }),

  // 获取当前用户信息
  http.get("http://localhost:3000/api/auth/me", ({ request }) => {
    const authorization =
      request.headers.get("authorization") || request.headers.get("Authorization")
    const token = authorization?.replace("Bearer ", "")

    if (!token || token !== currentToken || !currentUser) {
      const response = {
        code: 401,
        message: "未登录或token已过期",
        data: null,
      }
      return HttpResponse.json(response)
    }

    const response = {
      code: 200,
      message: "获取用户信息成功",
      data: currentUser,
    }

    return HttpResponse.json(response)
  }),

  // 更新用户信息
  http.put("http://localhost:3000/api/auth/user", async ({ request }) => {
    const authorization =
      request.headers.get("authorization") || request.headers.get("Authorization")
    const token = authorization?.replace("Bearer ", "")

    const body = (await request.json()) as Record<string, any>

    if (!token || token !== currentToken || !currentUser) {
      const response = {
        code: 401,
        message: "未登录或token已过期",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 更新用户信息
    const updatedUser = {
      ...currentUser,
      ...body,
      id: currentUser.id, // 不允许修改ID
      username: currentUser.username, // 不允许修改用户名
      updateTime: new Date().toISOString(),
    }

    // 更新内存中的用户信息
    currentUser = updatedUser
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser
    }

    const response = {
      code: 200,
      message: "更新用户信息成功",
      data: updatedUser,
    }

    return HttpResponse.json(response)
  }),

  // 修改密码
  http.post("http://localhost:3000/api/auth/change-password", async ({ request }) => {
    const authorization =
      request.headers.get("authorization") || request.headers.get("Authorization")
    const token = authorization?.replace("Bearer ", "")

    const body = (await request.json()) as { oldPassword: string; newPassword: string }
    const { oldPassword, newPassword } = body

    if (!token || token !== currentToken || !currentUser) {
      const response = {
        code: 401,
        message: "未登录或token已过期",
        data: null,
      }
      return HttpResponse.json(response)
    }

    if (!oldPassword || !newPassword) {
      const response = {
        code: 400,
        message: "旧密码和新密码不能为空",
        data: null,
      }
      return HttpResponse.json(response)
    }

    // 验证旧密码（这里简化处理）
    if (oldPassword !== "123456") {
      const response = {
        code: 400,
        message: "旧密码错误",
        data: null,
      }
      return HttpResponse.json(response)
    }

    if (newPassword.length < 6) {
      const response = {
        code: 400,
        message: "新密码长度不能少于6位",
        data: null,
      }
      return HttpResponse.json(response)
    }

    const response = {
      code: 200,
      message: "密码修改成功",
      data: null,
    }

    return HttpResponse.json(response)
  }),
]
