import { Switch } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SwitchProps } from "antd-mobile"
import "./index.less"

/**
 * SwitchRenderer组件的Props类型
 */
export interface SwitchRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"switch", SwitchProps, T> {
  value?: boolean
}

/**
 * 开关渲染器
 * 支持自定义开关状态文本
 */
const SwitchRenderer = <T extends SchemaFormValuesType>({
  value,
  className,
  formItemProps,
  formInstance,
  ...restProps
}: SwitchRendererProps<T>) => {
  return (
    <Switch
      checked={value}
      className={classNames("schema-form-switch-renderer", className)}
      {...restProps}
    />
  )
}

export default SwitchRenderer
