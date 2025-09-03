import { Slider } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { SliderProps } from "antd-mobile"
import "./index.less"

/**
 * SliderRenderer组件的Props类型
 */
export interface SliderRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"slider", SliderProps, T> {
  readOnly?: boolean
}

/**
 * 滑块渲染器
 */
const SliderRenderer = <T extends SchemaFormValuesType>({
  value,
  className,
  formItemProps,
  formInstance,
  popover = true,
  ...restProps
}: SliderRendererProps<T>) => {
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  if (readOnly) {
    return <div className={classNames("schema-form-slider-renderer", className)}>{value}</div>
  }

  return (
    <div
      className={classNames("schema-form-slider-renderer", className)}
      style={{ pointerEvents: readOnly ? "none" : "auto" }}
    >
      <Slider {...restProps} popover={popover} value={value} />
    </div>
  )
}

export default SliderRenderer
