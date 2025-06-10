import { Slider } from "antd-mobile"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SliderProps } from "antd-mobile"
import "./index.less"

/**
 * SliderRenderer组件的Props类型
 */
export interface SliderRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"slider", SliderProps, T> {}

/**
 * 滑块渲染器
 */
const SliderRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled,
  ...restProps
}: SliderRendererProps<T>) => {
  // 处理 onChange 事件，确保类型兼容
  const handleChange = (val: number | [number, number]) => {
    onChange?.(val)
  }

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <Slider value={value} onChange={handleChange} {...restProps} />
    </div>
  )
}

export default SliderRenderer
