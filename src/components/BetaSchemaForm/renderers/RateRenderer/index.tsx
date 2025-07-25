import { Rate } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { RateProps } from "antd-mobile"
import "./index.less"

/**
 * RateRenderer组件的Props类型
 */
export interface RateRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"rate", RateProps, T> {
  disabled?: boolean
}

/**
 * 评分渲染器
 */
const RateRenderer = <T extends SchemaFormValuesType>({
  disabled = false,
  className,
  ...restProps
}: RateRendererProps<T>) => {
  return (
    <div
      className={classNames("schema-form-rate-renderer", className)}
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}
    >
      <Rate {...restProps} />
    </div>
  )
}

export default RateRenderer
