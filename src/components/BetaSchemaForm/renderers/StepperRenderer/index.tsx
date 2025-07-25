import { Stepper } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { StepperProps } from "antd-mobile"
import "./index.less"

/**
 * SliderRenderer组件的Props类型
 */
export type StepperRendererProps<T extends SchemaFormValuesType> = ExpandRendererPropsType<
  "stepper",
  StepperProps,
  T
> & {
  readOnly?: boolean
  className?: string
}

/**
 * 滑块渲染器
 */
const StepperRenderer = <T extends SchemaFormValuesType>({
  className,
  readOnly,
  formItemProps,
  formInstance,
  ...restProps
}: StepperRendererProps<T>) => {
  return (
    <div
      className={classNames("schema-form-stepper-renderer", className)}
      style={{ pointerEvents: readOnly ? "none" : "auto" }}
    >
      <Stepper {...restProps} />
    </div>
  )
}

export default StepperRenderer
