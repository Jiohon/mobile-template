# 静态资源使用指南

本项目已完整配置了静态资源的使用方案，支持多种方式引用图片、字体、样式等资源。

## 📁 目录结构

```
src/assets/
├── images/          # 图片资源
├── styles/          # 样式文件
│   ├── variables.less    # 全局Less变量
│   └── examples.less     # 使用示例
└── README.md        # 使用说明
```

## 🎯 使用方式

### 1. 在 React 组件中使用

#### 导入方式

```tsx
import bgImage from "@/assets/images/bg.png"
import logoImage from "@/assets/images/logo.png"

function MyComponent() {
  return <img src={bgImage} alt="Background" />
}
```

#### 动态导入

```tsx
const loadImage = async () => {
  const module = await import("@/assets/images/logo.png")
  return module.default
}
```

### 2. 在 CSS/Less 中使用

#### 使用路径别名

```less
.background {
  background-image: url("@/assets/images/bg.png");
}
```

#### 使用预定义变量

```less
.header {
  background-image: url("@{images-path}/header-bg.jpg");
  padding: @spacing-lg;
  border-radius: @border-radius-base;
}
```

### 3. 公共资源

放在 `public/` 目录下的资源可以直接访问：

```tsx
<img src="/logo.png" alt="Public Logo" />
```

## 🔧 配置说明

### Vite 配置 (vite/vite.common.ts)

```typescript
resolve: {
  alias: {
    "@/assets": path.resolve(__dirname, "../src/assets"),
    "@/assets/images": path.resolve(__dirname, "../src/assets/images"),
    "@/assets/styles": path.resolve(__dirname, "../src/assets/styles"),
  },
},
assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"],
```

### TypeScript 配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/assets/*": ["src/assets/*"],
      "@/assets/images/*": ["src/assets/images/*"],
      "@/assets/styles/*": ["src/assets/styles/*"]
    }
  }
}
```

### 全局 Less 变量 (src/assets/styles/variables.less)

项目已配置全局 Less 变量，可直接在任何 `.less` 文件中使用：

```less
// 资源路径
@images-path: "@/assets/images";
@assets-path: "@/assets";

// 颜色
@primary-color: #1677ff;
@success-color: #00b96b;

// 尺寸
@spacing-md: 16px;
@border-radius-base: 6px;
```

## 📦 支持的文件格式

- **图片**: PNG, JPG, JPEG, GIF, SVG, WebP, ICO
- **字体**: WOFF, WOFF2, TTF, EOT
- **文档**: PDF

## 💡 最佳实践

1. **图片优化**: 使用适当的格式和尺寸
2. **路径别名**: 使用 `@/assets` 而不是相对路径
3. **变量使用**: 利用 Less 变量保持一致性
4. **按需导入**: 大图片考虑动态导入
5. **公共资源**: 不会改变的资源放在 `public/` 目录

## 🔍 示例组件

查看 `src/components/AssetExample` 组件了解完整的使用示例。

```tsx
import AssetExample from "@/components/AssetExample"

// 在路由中使用
;<AssetExample />
```
