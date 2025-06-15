# Mock 数据使用指南

本项目已集成 `vite-plugin-mock` 插件，为认证模块提供了完整的 mock 数据支持。

## 📁 目录结构

```
mock/
├── index.ts          # Mock 入口文件
└── auth.ts          # 认证相关 mock 接口
```

## 🚀 快速开始

### 1. Mock 开关配置

在项目根目录创建 `.env.development` 文件：

```bash
# Mock 配置
VITE_ENABLE_MOCK=true   # 启用 mock
# VITE_ENABLE_MOCK=false  # 禁用 mock，使用真实后端
```

### 2. 启动开发服务

```bash
pnpm dev
```

当启用 mock 时，控制台会显示：

- `[vite:mock] ✅ Mock Server is running`
- 各个 mock 接口的注册信息

## 🔐 认证接口说明

### 登录接口

- **URL**: `POST /api/auth/login`
- **测试账号**:
  - 用户名: `admin` 密码: `123456`
  - 用户名: `user` 密码: `123456`

### 其他接口

- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/user` - 更新用户信息
- `POST /api/auth/change-password` - 修改密码

## 📊 Mock 数据

项目提供了两个测试用户：

### 管理员用户

```json
{
  "id": "1",
  "username": "admin",
  "email": "admin@example.com",
  "phone": "13800138000",
  "avatar": "https://avatars.githubusercontent.com/u/1?v=4",
  "roles": ["admin"],
  "permissions": ["*:*:*"]
}
```

### 普通用户

```json
{
  "id": "2",
  "username": "user",
  "email": "user@example.com",
  "phone": "13800138001",
  "avatar": "https://avatars.githubusercontent.com/u/2?v=4",
  "roles": ["user"],
  "permissions": ["user:read", "user:update"]
}
```

## 🔄 切换到真实后端

1. 在 `.env.development` 中设置：

   ```bash
   VITE_ENABLE_MOCK=false
   VITE_PROXY_TARGET=http://your-backend-url
   ```

2. 重启开发服务器

## 🛠️ 添加新的 Mock 接口

1. 在 `mock/` 目录下创建新的 mock 文件
2. 在 `mock/index.ts` 中导入并添加到 mocks 数组
3. Mock 插件会自动热重载

### 示例：

```typescript
// mock/user.ts
import { MockMethod } from "vite-plugin-mock"

const userMock: MockMethod[] = [
  {
    url: "/api/users",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "获取用户列表成功",
        data: [],
      }
    },
  },
]

export default userMock
```

## 🔍 调试 Mock

- 启动时会在控制台显示所有注册的 mock 接口
- 请求时会显示匹配的 mock 接口日志
- 可以在浏览器开发者工具中查看请求响应

## ⚠️ 注意事项

1. Mock 数据存储在内存中，刷新页面会重置
2. 登录状态通过内存变量维护，生产环境需要使用真实的 JWT
3. 密码验证简化处理，实际项目需要使用加密比较
4. Token 刷新逻辑较为简单，生产环境需要更严格的验证
