import { Input } from "antd-mobile"
import classNames from "classnames"

import type { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"
import type { InputProps } from "antd-mobile"

import "./index.less"

/**
 * TextRenderer组件的Props类型
 */
export interface TextRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"text", InputProps, T> {}

/**
 * 文本输入渲染器
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const TextRenderer = <T extends SchemaFormValuesType>({
  className,
  formItemProps,
  formInstance,
  ...restProps
}: TextRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请输入${formItemProps.label}`

  return (
    <Input
      className={classNames("schema-form-text-renderer", className)}
      placeholder={placeholder}
      {...restProps}
    />
  )
}

export default TextRenderer
