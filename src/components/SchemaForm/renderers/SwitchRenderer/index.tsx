import { Switch } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SwitchProps } from "antd-mobile"
import "./index.less"

/**
 * SwitchRenderer组件的Props类型
 */
export interface SwitchRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"switch", SwitchProps, T> {
  value?: boolean
}

/**
 * 开关渲染器
 * 支持自定义开关状态文本
 */
const SwitchRenderer = <T extends SchemaFormValuesType>({
  disabled,
  formItemProps,
  ...restProps
}: SwitchRendererProps<T>) => {
  // Form.Item 会自动传递 value 和 onChange，无需手动处理
  return <Switch disabled={disabled} className="schema-form-switch-renderer" {...restProps} />
}

export default SwitchRenderer
