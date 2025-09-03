import { Stepper } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { StepperProps } from "antd-mobile"
import "./index.less"

/**
 * SliderRenderer组件的Props类型
 */
export type StepperRendererProps<T extends SchemaFormValuesType> = ExpandCompPropsType<
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
  value,
  className,
  formItemProps,
  formInstance,
  ...restProps
}: StepperRendererProps<T>) => {
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  if (readOnly) {
    return <div className={classNames("schema-form-stepper-renderer", className)}>{value}</div>
  }

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
