# Antd Mobile Template

🚀 一个功能完整的移动端应用开发模板，基于现代前端技术栈构建，提供开箱即用的移动端开发解决方案。

## ✨ 核心特性

### 🏗️ 现代技术栈

- **React 18.2** - 最新版本的React，支持并发特性
- **TypeScript 5.2** - 完整的类型支持，提升开发体验
- **Vite 5.0** - 极速的构建工具，热更新秒级响应
- **antd-mobile 5.36** - 移动端UI组件库

### 📱 移动端优化

- 移动端优先的响应式设计
- 触摸友好的交互体验
- PWA支持，可安装到手机桌面
- 适配各种移动设备屏幕

### 🔐 权限管理系统

- **基于 RBAC 模型** - 角色权限访问控制，支持角色和权限的精细化管理
- **多级权限控制** - 页面级、组件级、功能级权限控制
- **通配符权限** - 支持 `resource:action:scope` 格式，如 `user:read:*`、`*:*:*`
- **权限 Hook** - `useAccess()` Hook，在组件中便捷获取权限状态
- **权限组件** - `<Access>` 组件，声明式权限控制UI显示
- **动态路由** - 基于用户权限动态生成可访问路由
- **权限工厂** - `createAccess()` 工厂函数，灵活创建权限对象

### 🛣️ 路由管理

- React Router 7.6 最新版本
- 动态路由配置
- 懒加载支持
- 路由守卫和权限验证
- 嵌套路由支持

### 🗄️ 状态管理

- Zustand 4.4 轻量级状态管理
- 持久化存储支持
- TypeScript类型安全
- 简洁的API设计

### 🌐 网络请求

- Alova 3.0 现代HTTP客户端
- 请求/响应拦截器
- 自动错误处理
- TypeScript类型推导

### 🎨 UI/UX

- 完整的移动端UI组件
- 一致的设计规范
- 支持主题定制
- 国际化支持（i18next）

### 🔧 开发工具

- ESLint + Prettier 代码规范
- Husky + lint-staged Git钩子
- TypeScript严格模式
- 路径别名支持
- Mock数据支持

## 📦 技术栈

| 类别   | 技术         | 版本   | 说明                 |
| ------ | ------------ | ------ | -------------------- |
| 框架   | React        | 18.2.0 | 用户界面库           |
| 语言   | TypeScript   | 5.2.2  | 类型安全的JavaScript |
| 构建   | Vite         | 5.0.0  | 下一代前端构建工具   |
| UI库   | antd-mobile  | 5.36.1 | 移动端UI组件库       |
| 路由   | react-router | 7.6.2  | 声明式路由           |
| 状态   | zustand      | 4.4.7  | 轻量级状态管理       |
| 请求   | alova        | 3.0.9  | 现代HTTP客户端       |
| 样式   | Less         | 4.2.0  | CSS预处理器          |
| 国际化 | i18next      | 23.7.6 | 国际化框架           |

## 🏗️ 项目结构

```
src/
├── api/                 # API接口定义
├── assets/              # 静态资源
├── components/          # 公共组件
│   ├── Layout/         # 布局组件
│   └── ...
├── config/              # 配置文件
├── hooks/               # 自定义Hooks
├── pages/               # 页面组件
│   ├── Home/           # 首页
│   ├── Login/          # 登录页
│   ├── Profile/        # 个人中心
│   ├── Settings/       # 设置页
│   ├── UserManagement/ # 用户管理
│   ├── AccessDemo/     # 权限演示
│   ├── SchemaFormDemo/ # 表单演示
│   └── NotFound/       # 404页面
├── request/             # 网络请求封装
├── router/              # 路由配置
├── stores/              # 状态管理
├── styles/              # 全局样式
├── types/               # 类型定义
├── utils/               # 工具函数
├── App.tsx             # 应用根组件
└── main.tsx            # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 1. 克隆项目

```bash
git clone <repository-url>
cd mobile-template
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 3. 环境配置

```bash
# 运行环境检查脚本
pnpm check-env

# 设置开发环境（如果需要）
pnpm setup-env
```

### 4. 启动开发服务器

```bash
pnpm dev
```

服务器将在 `http://localhost:5173` 启动，支持热重载。

### 5. 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 📋 可用脚本

| 命令                | 说明               |
| ------------------- | ------------------ |
| `pnpm dev`          | 启动开发服务器     |
| `pnpm build`        | 构建生产版本       |
| `pnpm preview`      | 预览构建结果       |
| `pnpm lint`         | 运行ESLint检查     |
| `pnpm lint:fix`     | 自动修复ESLint问题 |
| `pnpm format`       | 格式化代码         |
| `pnpm format:check` | 检查代码格式       |
| `pnpm type-check`   | TypeScript类型检查 |
| `pnpm code-check`   | 运行所有代码检查   |
| `pnpm check-env`    | 检查环境配置       |

## 🎯 功能演示

### 权限管理

访问 `/access-demo` 页面查看完整的权限管理功能演示，包括：

- 角色权限控制
- 页面访问权限
- 组件显示权限
- 动态菜单生成

### 用户管理

访问 `/user-management` 页面体验：

- 用户列表管理
- 用户信息编辑
- 权限分配
- 角色管理

### 表单组件

访问 `/schema-form-demo` 查看：

- 动态表单生成
- 表单验证
- 复杂表单交互
- 移动端优化的表单体验

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件配置开发环境：

```bash
# API代理配置
VITE_PROXY_TARGET=http://localhost:3001
VITE_PROXY_PATH=/api

# 应用配置
VITE_APP_TITLE=移动端应用
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交代码

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

项目使用严格的代码规范：

- ESLint 用于代码质量检查
- Prettier 用于代码格式化
- TypeScript 严格模式
- 提交前自动运行代码检查

## 📚 相关文档

- [权限系统说明](./docs/ACCESS_SYSTEM.md) - 详细的权限管理系统文档

## 🐛 问题反馈

遇到问题？请通过以下方式反馈：

1. 查看 [Issues](../../issues) 是否已有相关问题
2. 如果没有，请 [创建新Issue](../../issues/new)
3. 提供详细的问题描述和复现步骤

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

感谢以下开源项目：

- [React](https://reactjs.org/)
- [antd-mobile](https://mobile.ant.design/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Alova](https://alova.js.org/)

---

⭐ 如果这个项目对你有帮助，请给一个Star支持！
