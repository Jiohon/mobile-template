# Request 模块

基于 alova 的 HTTP 请求配置和工具，采用模块化设计。

## 文件结构

```
src/request/
├── index.ts        # 主入口文件，导出所有模块
├── instance.ts     # alova 实例创建
├── auth.ts         # 认证相关逻辑（token 刷新、认证处理器）
├── interceptors.ts # 请求和响应拦截器
├── methods.ts      # HTTP 请求方法封装
├── config.ts       # 请求配置和错误映射
├── types.ts        # 类型定义
└── README.md       # 模块说明
```

## 使用方式

### 基本请求

```typescript
import { get, post, put, del, patch } from '@/request'

// GET 请求
const users = await get<User[]>('/api/users')

// POST 请求
const result = await post('/api/login', { username, password })

// PUT 请求
const updatedUser = await put('/api/users/1', userData)

// DELETE 请求
await del('/api/users/1')

// PATCH 请求
const patchedUser = await patch('/api/users/1', { name: 'New Name' })
```

### 使用 alova 实例

```typescript
import alova from '@/request'

// 创建方法实例
const userMethod = alova.Get('/api/users')
const data = await userMethod

// 带配置的请求
const userMethodWithConfig = alova.Get('/api/users', {
  params: { page: 1, size: 10 }
})
```

### 认证工具

```typescript
import { tokenUtils } from '@/request'

// 检查登录状态
if (tokenUtils.isLoggedIn()) {
  // 已登录
}

// 获取 token
const token = tokenUtils.getToken()

// 手动设置 token
tokenUtils.setToken('new-token')

// 退出登录
tokenUtils.removeToken()
```

## 模块功能

### 🔐 认证模块 (auth.ts)
- 自动 token 刷新
- token 工具函数
- 认证处理器创建

### 🛡️ 拦截器模块 (interceptors.ts)
- 请求拦截器（自动添加 token）
- 响应拦截器（错误处理、数据解析）

### 🌐 请求方法模块 (methods.ts)
- 封装常用 HTTP 方法
- 类型安全的请求函数

### ⚙️ 实例模块 (instance.ts)
- alova 实例配置
- 集成认证和拦截器

## 特性

- ✅ 基于 alova 的现代化请求库
- ✅ 自动 Token 认证和无感刷新
- ✅ 模块化设计，职责分离
- ✅ 统一错误处理和 Toast 提示
- ✅ 完整的 TypeScript 支持
- ✅ 请求等待机制（token 刷新时）
- ✅ 灵活的配置选项

## 配置

通过环境变量 `VITE_API_BASE_URL` 配置 API 基础地址。

## alova 优势

相比传统方案，alova 提供了：
- 🚀 更好的性能和缓存机制
- 🔧 更简洁的 API 设计
- 🛡️ 内置的请求策略
- 📱 更好的移动端支持
- 🎯 专为现代前端框架优化 