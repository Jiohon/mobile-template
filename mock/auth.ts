import Mock from "mockjs"
import { MockMethod } from "vite-plugin-mock"

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
const generateToken = () => Mock.Random.string("upper", 32)
const generateRefreshToken = () => Mock.Random.string("lower", 32)

const authMock: MockMethod[] = [
  // 用户登录
  {
    url: "/api/auth/login",
    method: "post",
    response: ({ body }) => {
      const { username, password } = body

      // 简单验证
      if (!username || !password) {
        return {
          code: 400,
          message: "用户名和密码不能为空",
          data: null,
        }
      }

      // 查找用户
      const user = mockUsers.find((u) => u.username === username)
      if (!user) {
        return {
          code: 401,
          message: "用户名或密码错误",
          data: null,
        }
      }

      // 验证密码（这里简化处理，实际项目中应该加密比较）
      if (password !== "123456") {
        return {
          code: 401,
          message: "用户名或密码错误",
          data: null,
        }
      }

      // 生成token
      const token = generateToken()
      const refreshToken = generateRefreshToken()

      // 保存当前登录状态
      currentToken = token
      currentUser = user

      return {
        code: 200,
        message: "登录成功",
        data: {
          token,
          refreshToken,
          user,
        },
      }
    },
  },

  // 刷新Token
  {
    url: "/api/auth/refresh",
    method: "post",
    response: ({ body }) => {
      const { refresh_token } = body

      if (!refresh_token) {
        return {
          code: 400,
          message: "refresh_token不能为空",
          data: null,
        }
      }

      // 简单验证refresh_token有效性
      if (!currentUser) {
        return {
          code: 401,
          message: "refresh_token无效",
          data: null,
        }
      }

      // 生成新的token
      const token = generateToken()
      const refreshToken = generateRefreshToken()
      currentToken = token

      return {
        code: 200,
        message: "刷新成功",
        data: {
          token,
          refreshToken,
          user: currentUser,
        },
      }
    },
  },

  // 用户登出
  {
    url: "/api/auth/logout",
    method: "post",
    response: () => {
      // 清除登录状态
      currentToken = null
      currentUser = null

      return {
        code: 200,
        message: "登出成功",
        data: null,
      }
    },
  },

  // 获取当前用户信息
  {
    url: "/api/auth/me",
    method: "get",
    response: ({ headers }) => {
      const authorization = headers.authorization || headers.Authorization
      const token = authorization?.replace("Bearer ", "")

      if (!token || token !== currentToken || !currentUser) {
        return {
          code: 401,
          message: "未登录或token已过期",
          data: null,
        }
      }

      return {
        code: 200,
        message: "获取用户信息成功",
        data: currentUser,
      }
    },
  },

  // 更新用户信息
  {
    url: "/api/auth/user",
    method: "put",
    response: ({ headers, body }) => {
      const authorization = headers.authorization || headers.Authorization
      const token = authorization?.replace("Bearer ", "")

      if (!token || token !== currentToken || !currentUser) {
        return {
          code: 401,
          message: "未登录或token已过期",
          data: null,
        }
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

      return {
        code: 200,
        message: "更新用户信息成功",
        data: updatedUser,
      }
    },
  },

  // 修改密码
  {
    url: "/api/auth/change-password",
    method: "post",
    response: ({ headers, body }) => {
      const authorization = headers.authorization || headers.Authorization
      const token = authorization?.replace("Bearer ", "")

      if (!token || token !== currentToken || !currentUser) {
        return {
          code: 401,
          message: "未登录或token已过期",
          data: null,
        }
      }

      const { oldPassword, newPassword } = body

      if (!oldPassword || !newPassword) {
        return {
          code: 400,
          message: "旧密码和新密码不能为空",
          data: null,
        }
      }

      // 验证旧密码（这里简化处理）
      if (oldPassword !== "123456") {
        return {
          code: 400,
          message: "旧密码错误",
          data: null,
        }
      }

      if (newPassword.length < 6) {
        return {
          code: 400,
          message: "新密码长度不能少于6位",
          data: null,
        }
      }

      return {
        code: 200,
        message: "密码修改成功",
        data: null,
      }
    },
  },
]

export default authMock
