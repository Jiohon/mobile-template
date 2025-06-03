import React from "react"

// 示例：导入图片资源
// import bgImage from '@/assets/images/bg.png'
// import logoImage from '@/assets/images/logo.png'

import styles from "./index.module.less"

/**
 * 静态资源使用示例组件
 */
const AssetExample: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>静态资源使用示例</h2>

      {/* 方式1: 使用导入的图片变量 */}
      <div className={styles.section}>
        <h3>1. 导入图片变量使用</h3>
        <div className={styles.codeBlock}>
          <pre>{`
import bgImage from '@/assets/images/bg.png'

<img src={bgImage} alt="Background" />
          `}</pre>
        </div>
        {/* <img src={bgImage} alt="Background" className={styles.image} /> */}
      </div>

      {/* 方式2: 在CSS中使用别名 */}
      <div className={styles.section}>
        <h3>2. CSS/Less 中使用路径别名</h3>
        <div className={styles.codeBlock}>
          <pre>{`
// 在 Less 文件中
.background {
  background-image: url('@/assets/images/bg.png');
  // 或者使用变量
  background-image: url('@{images-path}/bg.png');
}
          `}</pre>
        </div>
        <div className={styles.backgroundExample}>使用 CSS 背景图片</div>
      </div>

      {/* 方式3: 动态导入 */}
      <div className={styles.section}>
        <h3>3. 动态导入资源</h3>
        <div className={styles.codeBlock}>
          <pre>{`
// 动态导入
const loadImage = async () => {
  const module = await import('@/assets/images/logo.png')
  return module.default
}
          `}</pre>
        </div>
      </div>

      {/* 方式4: 公共资源访问 */}
      <div className={styles.section}>
        <h3>4. 公共资源访问</h3>
        <div className={styles.codeBlock}>
          <pre>{`
// 放在 public 目录下的资源可以直接访问
<img src="/logo.png" alt="Public Logo" />
          `}</pre>
        </div>
      </div>
    </div>
  )
}

export default AssetExample
