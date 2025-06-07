import { Rate } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { RateProps } from "antd-mobile"
import "./index.less"

/**
 * RateRenderer组件的Props类型
 */
export interface RateRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"rate", RateProps, T> {
  disabled?: boolean
}

/**
 * 评分渲染器
 */
const RateRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled = false,
  ...restProps
}: RateRendererProps<T>) => {
  // 处理 onChange 事件，确保类型兼容
  const handleChange = (val: number) => {
    onChange?.(val)
  }

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <Rate value={value} onChange={handleChange} {...restProps} />
    </div>
  )
}

export default RateRenderer
