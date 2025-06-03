# 配置模块说明

## 📁 文件结构

```
src/config/
├── index.ts          # 配置模块入口
├── env.ts            # 环境变量配置
└── README.md         # 配置文档
```

## 🔧 配置说明

### 环境变量配置 (`env.ts`)

项目通过环境变量进行配置管理，支持多环境部署。

#### 支持的环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_APP_TITLE` | `Antd Mobile Template` | 应用标题 |
| `VITE_APP_VERSION` | `1.0.0` | 应用版本 |
| `VITE_APP_DESCRIPTION` | `基于 antd-mobile 的移动端应用模版` | 应用描述 |
| `VITE_APP_ENV` | `development` | 运行环境 |
| `VITE_API_BASE_URL` | `/api` | API 基础地址 |
| `VITE_PROXY_PATH` | `/api` | 反向代理路径匹配规则 |
| `VITE_PROXY_TARGET` | `http://localhost:3001` | 反向代理目标地址 |
| `VITE_PROXY_PATH_REWRITE` | `^/api` | 代理路径重写规则 |
| `VITE_TOKEN_KEY` | `access_token` | Token 存储键名 |
| `VITE_REFRESH_TOKEN_KEY` | `refresh_token` | 刷新 Token 存储键名 |
| `VITE_TOKEN_EXPIRES_IN` | `3600000` | Token 过期时间（毫秒，1小时） |

## 📋 使用方法

### 1. 导入配置

```typescript
import { env, isDev, isProd, isStaging } from '@/config'

// 使用环境配置
console.log('API URL:', env.API_BASE_URL)
console.log('Token Key:', env.TOKEN_KEY)
console.log('Proxy Target:', env.PROXY_TARGET)
```

### 2. 环境判断

```typescript
import { isDev, isProd, isStaging } from '@/config'

if (isDev) {
  console.log('开发环境 - 启用反向代理')
}

if (isProd) {
  console.log('生产环境')
}

if (isStaging) {
  console.log('预发布环境')
}
```

## 🌍 环境文件

### 公共配置 (`.env`)

```bash
# 应用基本信息
VITE_APP_TITLE=Antd Mobile Template
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=基于 antd-mobile 的移动端应用模版

# 认证配置
VITE_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_TOKEN_EXPIRES_IN=3600000
```

### 开发环境 (`.env.development`)

```bash
# 开发环境配置
VITE_APP_ENV=development
VITE_API_BASE_URL=/api

# 反向代理配置
VITE_PROXY_PATH=/api
VITE_PROXY_TARGET=http://localhost:3001
VITE_PROXY_PATH_REWRITE=^/api
```

### 生产环境 (`.env.production`)

```bash
# 生产环境配置
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com

# 反向代理配置
VITE_PROXY_TARGET=https://api.example.com
VITE_PROXY_PATH_REWRITE=^/api
```

### 预发布环境 (`.env.staging`)

```bash
# 预发布环境配置
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.example.com

# 反向代理配置
VITE_PROXY_TARGET=https://staging-api.example.com
VITE_PROXY_PATH_REWRITE=^/api
```

## 🔄 反向代理功能

项目内置了反向代理功能，主要用于开发环境解决跨域问题：

### 配置说明
- **代理规则**: 所有 `/api/*` 请求会被代理到目标服务器
- **目标地址**: 通过 `VITE_PROXY_TARGET` 环境变量配置
- **路径重写**: 通过 `VITE_PROXY_PATH_REWRITE` 配置重写规则

### 工作原理
1. 前端请求: `GET /api/users`
2. 代理重写: `GET /users` (移除 `/api` 前缀)
3. 转发至: `http://localhost:3001/users`

### 调试信息
开发环境下代理会输出详细的请求日志，方便调试。

## 🔍 配置验证

使用内置的配置检查脚本：

```bash
npm run check-env
```

该脚本会显示当前环境的所有配置信息，包括反向代理配置。

## 💡 最佳实践

1. **环境变量命名**：使用 `VITE_` 前缀
2. **配置分层**：公共配置 + 环境特定配置
3. **类型安全**：使用 TypeScript 接口定义
4. **默认值**：为所有配置提供合理的默认值
5. **反向代理**：仅在开发环境启用，生产环境直接访问 API