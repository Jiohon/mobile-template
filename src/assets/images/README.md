# Images 目录

这里存放项目中使用的图片资源。

## 使用方式

### 在 CSS/Less 中使用路径别名：

```less
.background {
  background-image: url('@/assets/images/bg.png');
}

// 或者使用变量
.header {
  background-image: url('@{images-path}/header-bg.jpg');
}
```

### 在 React 组件中使用：

```tsx
import bgImage from '@/assets/images/bg.png'

// 或者直接在JSX中
;<img src="/src/assets/images/logo.png" alt="Logo" />
```

## 支持的格式

- PNG
- JPG/JPEG
- SVG
- WebP
- GIF
