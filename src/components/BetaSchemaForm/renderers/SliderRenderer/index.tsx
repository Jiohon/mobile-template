import { Slider } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SliderProps } from "antd-mobile"
import "./index.less"

/**
 * SliderRenderer组件的Props类型
 */
export interface SliderRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"slider", SliderProps, T> {
  readOnly?: boolean
}

/**
 * 滑块渲染器
 */
const SliderRenderer = <T extends SchemaFormValuesType>({
  value,
  className,
  readOnly,
  formItemProps,
  formInstance,
  ...restProps
}: SliderRendererProps<T>) => {
  return (
    <div
      className={classNames("schema-form-slider-renderer", className)}
      style={{ pointerEvents: readOnly ? "none" : "auto" }}
    >
      <Slider value={value} {...restProps} />
    </div>
  )
}

export default SliderRenderer
