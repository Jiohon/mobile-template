import { ReactNode } from "react"

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

/**
 * Access 组件 - 参考 @umijs/plugin-access 设计
 * 用于根据权限条件控制组件的显示和隐藏
 */
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

export default Access
