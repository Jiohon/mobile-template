# 环境变量配置指南

本文档详细说明了项目中所有环境变量的配置方式和用途。

## 📋 环境变量列表

### 应用配置
- `VITE_APP_TITLE`: 应用标题
- `VITE_APP_VERSION`: 应用版本
- `VITE_APP_DESCRIPTION`: 应用描述
- `VITE_APP_ENV`: 运行环境 (development/staging/production)

### API 配置
- `VITE_API_BASE_URL`: API 基础地址

### 反向代理配置
- `VITE_PROXY_PATH`: 需要代理的路径规则
- `VITE_PROXY_TARGET`: 代理目标服务器地址
- `VITE_PROXY_PATH_REWRITE`: 代理路径重写规则

### 认证配置
- `VITE_TOKEN_KEY`: 存储 access token 的 localStorage 键名
- `VITE_REFRESH_TOKEN_KEY`: 存储 refresh token 的 localStorage 键名
- `VITE_TOKEN_EXPIRES_IN`: Token 过期时间（毫秒）

## 🛠 环境配置示例

### 公共配置 (.env)
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

### 开发环境 (.env.development)
```bash
# 开发环境配置
VITE_APP_ENV=development
VITE_API_BASE_URL=/api

# 反向代理配置
VITE_PROXY_PATH=/api
VITE_PROXY_TARGET=http://localhost:3001
VITE_PROXY_PATH_REWRITE=^/api
```

### 生产环境 (.env.production)
```bash
# 生产环境配置
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com

# 反向代理配置（生产环境通常不需要）
VITE_PROXY_TARGET=https://api.example.com
VITE_PROXY_PATH_REWRITE=^/api
```

### 预发布环境 (.env.staging)
```bash
# 预发布环境配置
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.example.com

# 反向代理配置
VITE_PROXY_TARGET=https://staging-api.example.com
VITE_PROXY_PATH_REWRITE=^/api
```

## 📚 使用方法

在代码中通过 `env` 对象访问这些配置：

```typescript
import { env } from '@/config'

const tokenKey = env.TOKEN_KEY
const apiBaseUrl = env.API_BASE_URL
const proxyTarget = env.PROXY_TARGET
```

## 🔄 反向代理说明

项目在开发环境中配置了反向代理来解决跨域问题：

- **代理路径**: `/api/*` 
- **目标服务器**: 通过 `VITE_PROXY_TARGET` 配置
- **路径重写**: 通过 `VITE_PROXY_PATH_REWRITE` 配置重写规则

例如：当前端请求 `/api/users` 时，会被代理到 `http://localhost:3001/users`

## 🔧 验证配置

运行配置检查脚本：

```bash
npm run check-env
```

该脚本会显示当前环境的所有配置信息，包括反向代理配置。

## 🛠️ 部署配置

### Vercel 部署
在 Vercel 项目设置中添加环境变量：
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

### Netlify 部署
在 Netlify 项目设置的 Environment Variables 中添加：
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

### Docker 部署
在 Docker Compose 文件中：
```yaml
services:
  app:
    build: .
    environment:
      - VITE_API_BASE_URL=https://api.yourdomain.com
      - VITE_APP_ENV=production
```

## ⚠️ 注意事项

1. **安全性**: 只有以 `VITE_` 开头的变量才会暴露到客户端
2. **优先级**: `.env.local` > `.env.[mode]` > `.env`
3. **重启**: 修改环境变量后需要重启开发服务器
4. **敏感信息**: 放在 `.env.local` 文件中，不会被 git 跟踪

## 📚 相关文档

- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
- [项目配置文档](src/config/README.md) 