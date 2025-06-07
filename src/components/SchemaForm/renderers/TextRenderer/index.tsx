import { Input } from "antd-mobile"

import type { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"
import type { InputProps } from "antd-mobile"

import "./index.less"

/**
 * TextRenderer组件的Props类型
 */
export interface TextRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"text", InputProps, T> {}

/**
 * 文本输入渲染器
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const TextRenderer = <T extends SchemaFormValuesType>({
  disabled,
  type,
  formItemProps,
  ...restProps
}: TextRendererProps<T>) => {
  // Form.Item 会自动传递 value 和 onChange 到 restProps 中
  return <Input type={type} disabled={disabled} placeholder={"placeholder"} {...restProps} />
}

export default TextRenderer
