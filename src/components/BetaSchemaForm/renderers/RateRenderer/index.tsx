import { Rate } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { RateProps } from "antd-mobile"
import "./index.less"

/**
 * RateRenderer组件的Props类型
 */
export interface RateRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"rate", RateProps, T> {
  disabled?: boolean
}

/**
 * 评分渲染器
 */
const RateRenderer = <T extends SchemaFormValuesType>({
  className,
  formItemProps,
  onChange,
  ...restProps
}: RateRendererProps<T>) => {
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const disabled = restProps?.disabled || formItemProps?.disabled

  const handleChange = (value: number) => {
    if (disabled) return

    onChange?.(value)
  }

  return (
    <div className={classNames("schema-form-rate-renderer", className)}>
      <Rate
        {...restProps}
        className={classNames(disabled && "adm-rate-star-disabled")}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </div>
  )
}

export default RateRenderer
