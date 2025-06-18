# 权限系统使用指南

本项目参考了 `@umijs/plugin-access` 的设计模式，实现了一套完整的权限管理系统。

## 📁 文件结构

```
src/access/
├── auth.ts                     # 权限认证核心逻辑
├── types.ts                    # 权限系统类型定义
├── index.ts                    # 统一导出权限相关工具和组件
├── useAccess/                  # useAccess Hook 目录
│   ├── useAccess.ts           # useAccess Hook 实现
│   └── createAccess.ts        # createAccess 工厂函数
└── Access/                     # Access 权限组件目录
    └── index.tsx              # Access 组件实现
```

## 🚀 核心功能

### 1. 权限系统架构 (`src/access/`)

权限系统采用模块化设计，主要包含以下核心文件：

#### `src/access/types.ts` - 权限类型定义

```typescript
export interface AccessType {
  // 认证相关权限
  isAuthenticated: boolean

  // 角色权限判断
  isAdmin: boolean
  isUser: boolean

  // CRUD 权限检查方法
  canRead: (permission: PermissionsType) => boolean
  canCreate: (permission: PermissionsType) => boolean
  canUpdate: (permission: PermissionsType) => boolean
  canDelete: (permission: PermissionsType) => boolean

  // 权限检查函数
  hasPermission: (permission: PermissionsType) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAnyPermission: (permissions: PermissionsType[]) => boolean
}
```

#### `src/access/auth.ts` - 权限认证核心逻辑

```typescript
/**
 * 检查用户是否拥有指定权限
 * 支持通配符权限匹配：resource:action:scope
 */
export const hasPermission = (
  userPermissionsSet: Set<PermissionsType>,
  permission?: PermissionsType | null
) => {
  if (!userPermissionsSet?.size) return false
  if (!permission) return true

  // 检查超级管理员权限
  if (userPermissionsSet.has("*:*:*")) return true

  // 检查精确权限
  if (userPermissionsSet.has(permission)) return true

  // 检查通配符权限
  const [resource, action, scope = "*"] = permission.split(":")
  const candidates = [
    `${resource}:${action}:*`,
    `${resource}:*:${scope}`,
    `*:${action}:${scope}`,
    `${resource}:*:*`,
    `*:${action}:*`,
    `*:*:${scope}`,
  ] as PermissionsType[]

  return candidates.some((c) => userPermissionsSet.has(c))
}
```

#### `src/access/useAccess/createAccess.ts` - 权限工厂函数

```typescript
const createAccess: AccessConfigFunction = (initialState): UseAccessReturnType => {
  const user = initialState.user ?? useAuthStore.getState().user
  const userRolesSet = initialState.userRolesSet ?? useAuthStore.getState().userRolesSet
  const userPermissionsSet =
    initialState.userPermissionsSet ?? useAuthStore.getState().userPermissionsSet

  return {
    // 认证相关权限
    isAuthenticated: !!user,

    // 角色权限判断
    isAdmin: userRolesSet.has("admin") ?? false,
    isUser: userRolesSet.has("user") ?? false,

    // CRUD 权限检查
    canRead: (permission) => hasPermission(userPermissionsSet, permission),
    canCreate: (permission) => hasPermission(userPermissionsSet, permission),
    canUpdate: (permission) => hasPermission(userPermissionsSet, permission),
    canDelete: (permission) => hasPermission(userPermissionsSet, permission),

    // 权限检查函数
    hasRole: (role) => hasRole(userRolesSet, role),
    hasPermission: (permission) => hasPermission(userPermissionsSet, permission),
    hasAnyRole: (roles) => hasAnyRole(userRolesSet, roles),
    hasAnyPermission: (permissions) => hasAnyPermission(userPermissionsSet, permissions),
  }
}
```

### 2. useAccess Hook (`src/access/useAccess/useAccess.ts`)

在组件中使用 `useAccess` 获取权限信息：

```typescript
import { useAccess } from "@/access"

const MyComponent: React.FC = () => {
  const access = useAccess()

  // 角色权限判断
  if (access.isAdmin) {
    // 管理员逻辑
  }

  // 使用权限检查函数
  if (access.hasRole("moderator")) {
    // 版主逻辑
  }

  // 使用 CRUD 权限检查
  const canReadUser = access.canRead("user:read:*")
  const canCreatePost = access.canCreate("post:create:*")

  // 使用通配符权限
  const hasUserPermissions = access.hasPermission("user:*:*")

  // 批量权限检查
  const hasAnyRole = access.hasAnyRole(["admin", "moderator"])
  const hasAllPermissions = access.hasAnyPermission([
    "user:read:*",
    "post:create:*"
  ])

  return <div>...</div>
}
```

#### useAccess Hook 实现原理

```typescript
export const useAccess = (): UseAccessReturnType => {
  const { user, userRolesSet, userPermissionsSet } = useAuthStore()

  const accessPermissions = useMemo(() => {
    return createAccess({ user, userRolesSet, userPermissionsSet })
  }, [user, userRolesSet, userPermissionsSet])

  return accessPermissions
}
```

### 3. Access 组件 (`src/access/Access/index.tsx`)

用于条件渲染组件：

```typescript
import { Access, useAccess } from "@/access"

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
      <Access accessible={access.canRead("user:read:*")}>
        <button>用户管理</button>
      </Access>

      {/* CRUD 权限控制 */}
      <Access
        accessible={access.canCreate("post:create:*")}
        fallback={<button disabled>创建文章（无权限）</button>}
      >
        <button>创建文章</button>
      </Access>

      {/* 通配符权限判断 */}
      <Access accessible={access.hasPermission("user:*:*")}>
        <div>用户管理模块</div>
      </Access>
    </div>
  )
}
```

#### Access 组件接口定义

```typescript
export interface AccessProps {
  /**
   * 是否有权限访问
   */
  accessible: boolean
  /**
   * 无权限时显示的内容
   */
  fallback?: ReactNode
  /**
   * 有权限时显示的内容
   */
  children: ReactNode
}
```

#### Access 组件实现

```typescript
const Access: React.FC<AccessProps> = ({ accessible, fallback, children }) => {
  if (accessible) {
    return <>{children}</>
  }

  if (fallback !== undefined) {
    return <>{fallback}</>
  }

  // 无权限且没有指定 fallback 时，不渲染任何内容
  return null
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
