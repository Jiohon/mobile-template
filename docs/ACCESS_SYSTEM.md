# 权限系统使用指南

本项目参考了 `@umijs/plugin-access` 的设计模式，实现了一套完整的权限管理系统。

## 📁 文件结构

```
src/
├── access.ts                    # 权限定义文件
├── hooks/
│   └── useAccess.ts            # useAccess Hook
├── components/
│   └── Access/                 # Access 组件
│       └── index.tsx
├── types/
│   └── access.ts               # 权限系统类型定义
├── utils/
│   └── access.ts               # 权限工具函数统一导出
└── pages/
    └── AccessDemo/             # 权限系统演示页面
        └── index.tsx
```

## 🚀 核心功能

### 1. 权限定义 (`src/access.ts`)

类似于 UmiJS 的约定，我们在 `src/access.ts` 中定义所有权限逻辑：

```typescript
export default function access(initialState: { user: User | null }) {
  const { user } = initialState

  return {
    // 基础权限
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes("admin") ?? false,

    // 页面权限
    canReadHome: !!user,
    canAccessAdmin: user?.roles?.includes("admin") ?? false,

    // 动态权限函数
    canEditUser: (targetUserId: string) => {
      if (!user) return false
      if (user.roles?.includes("admin")) return true
      return user.id === targetUserId
    },

    // 权限检查函数
    hasPermission: (permission: string) => {
      return user?.permissions?.includes(permission) ?? false
    },

    hasRole: (role: string) => {
      return user?.roles?.includes(role) ?? false
    },
  }
}
```

### 2. useAccess Hook

在组件中使用 `useAccess` 获取权限信息：

```typescript
import { useAccess } from "@/utils/access"

const MyComponent: React.FC = () => {
  const access = useAccess()

  // 直接使用权限判断
  if (access.isAdmin) {
    // 管理员逻辑
  }

  // 使用权限检查函数
  if (access.hasRole("moderator")) {
    // 版主逻辑
  }

  // 使用动态权限
  const canEdit = access.canEditUser("user-123")

  return <div>...</div>
}
```

### 3. Access 组件

用于条件渲染组件：

```typescript
import { Access, useAccess } from "@/utils/access"

const MyComponent: React.FC = () => {
  const access = useAccess()

  return (
    <div>
      {/* 基础用法 */}
      <Access
        accessible={access.isAdmin}
        fallback={<div>无权限访问</div>}
      >
        <div>管理员内容</div>
      </Access>

      {/* 无 fallback，无权限时不显示任何内容 */}
      <Access accessible={access.canManageUsers}>
        <button>用户管理</button>
      </Access>

      {/* 动态权限判断 */}
      <Access
        accessible={access.canEditUser("user-123")}
        fallback={<button disabled>编辑用户（无权限）</button>}
      >
        <button>编辑用户</button>
      </Access>
    </div>
  )
}
```

## 🎯 使用场景

### 1. 页面级权限控制

在路由配置中使用权限：

```typescript
// src/router/routes.tsx
{
  path: "/admin",
  name: "Admin",
  element: () => import("@/pages/Admin"),
  meta: {
    title: "管理后台",
    permission: {
      requireAuth: true,
      roles: ["admin"],
    },
  },
}
```

### 2. 组件级权限控制

```typescript
const UserList: React.FC = () => {
  const access = useAccess()

  return (
    <div>
      <h2>用户列表</h2>

      {/* 只有管理员能看到添加按钮 */}
      <Access accessible={access.canCreateUser}>
        <Button>添加用户</Button>
      </Access>

      {/* 根据权限显示不同的操作按钮 */}
      {users.map(user => (
        <UserCard key={user.id}>
          <Access accessible={access.canEditUser(user.id)}>
            <Button>编辑</Button>
          </Access>

          <Access accessible={access.canDeleteUser}>
            <Button color="danger">删除</Button>
          </Access>
        </UserCard>
      ))}
    </div>
  )
}
```

### 3. 菜单权限控制

在布局组件中根据权限动态生成菜单：

```typescript
const Layout: React.FC = () => {
  const { user } = useAuthStore()

  const tabs = useMemo(() => {
    const allTabs = [
      {
        key: "/home",
        title: "首页",
        permission: { requireAuth: true },
      },
      {
        key: "/admin",
        title: "管理",
        permission: {
          requireAuth: true,
          roles: ["admin"],
        },
      },
    ]

    // 根据权限过滤菜单
    return allTabs.filter(tab =>
      shouldShowMenuItem(tab.permission, user)
    )
  }, [user])

  return (
    <TabBar>
      {tabs.map(tab => (
        <TabBar.Item key={tab.key} title={tab.title} />
      ))}
    </TabBar>
  )
}
```

## 🔧 高级用法

### 1. 自定义权限检查

```typescript
const MyComponent: React.FC = () => {
  const access = useAccess()

  // 检查单个权限
  const canCreatePost = access.hasPermission("post:create")

  // 检查多个角色（任一）
  const isStaff = access.hasAnyRole(["admin", "moderator"])

  // 检查多个权限（全部）
  const canManageAll = access.hasAllPermissions([
    "user:read",
    "user:write",
    "user:delete"
  ])

  return <div>...</div>
}
```

### 2. 复杂权限逻辑

```typescript
// 在 access.ts 中定义复杂权限
export default function access(initialState: { user: User | null }) {
  const { user } = initialState

  return {
    // 复合权限判断
    canAccessUserManagement:
      (user?.roles?.includes("admin") && user?.permissions?.includes("user:manage")) ?? false,

    // 时间相关权限
    canEditPost: (post: { authorId: string; createdAt: string }) => {
      if (!user) return false

      // 管理员总是可以编辑
      if (user.roles?.includes("admin")) return true

      // 作者只能在发布24小时内编辑
      const isAuthor = post.authorId === user.id
      const isWithin24Hours = Date.now() - new Date(post.createdAt).getTime() < 24 * 60 * 60 * 1000

      return isAuthor && isWithin24Hours
    },
  }
}
```

## 📝 最佳实践

### 1. 权限命名规范

```typescript
// 推荐的命名方式
{
  // 角色判断：is + 角色名
  isAdmin: boolean,
  isUser: boolean,

  // 页面权限：can + 动作 + 页面名
  canReadHome: boolean,
  canAccessAdmin: boolean,

  // 操作权限：can + 动作 + 资源
  canCreateUser: boolean,
  canUpdatePost: boolean,
  canDeleteComment: boolean,

  // 动态权限：can + 动作 + 资源（函数形式）
  canEditUser: (userId: string) => boolean,
  canDeletePost: (post: Post) => boolean
}
```

### 2. 类型安全

使用 TypeScript 类型确保权限使用的正确性：

```typescript
// src/types/access.ts
export interface AccessType {
  isAuthenticated: boolean
  isAdmin: boolean
  canReadHome: boolean
  // ... 其他权限
}

// 在组件中获得完整的类型提示
const access: AccessType = useAccess()
```

### 3. 性能优化

- `useAccess` 内部使用了 `useMemo` 优化性能
- 权限计算只在用户信息变化时重新执行
- 避免在渲染函数中进行复杂的权限计算

### 4. 错误处理

```typescript
// 安全的权限检查
const canEdit = access.canEditUser?.(userId) ?? false

// 或者在 access.ts 中提供默认值
canEditUser: (userId: string) => {
  try {
    if (!user) return false
    // ... 权限逻辑
  } catch (error) {
    console.error("权限检查失败:", error)
    return false
  }
}
```

## 🎨 演示页面

访问 `/access-demo` 页面查看完整的权限系统演示，包括：

- 当前用户权限信息展示
- 页面访问权限演示
- 操作权限控制演示
- 动态权限判断演示
- 权限检查函数演示

## 🔗 与现有系统集成

这套权限系统与项目中现有的认证系统完全兼容：

- 使用 `useAuthStore` 获取用户信息
- 复用现有的 `AuthGuard` 组件进行路由保护
- 兼容现有的权限工具函数 (`hasPermission`, `hasRole` 等)

## 🚧 扩展性

系统设计具有良好的扩展性：

1. **添加新权限**：在 `access.ts` 中添加新的权限判断逻辑
2. **自定义权限组件**：基于 `Access` 组件创建特定场景的权限组件
3. **权限中间件**：可以轻松添加权限相关的中间件和守卫
4. **权限缓存**：可以在需要时添加权限计算结果的缓存机制
