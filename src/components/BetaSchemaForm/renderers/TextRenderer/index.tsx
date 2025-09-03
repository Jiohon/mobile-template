import { Input } from "antd-mobile"
import classNames from "classnames"

import type { ExpandCompPropsType, SchemaFormValuesType } from "../../types"
import type { InputProps } from "antd-mobile"

import "./index.less"

/**
 * TextRenderer组件的Props类型
 */
export interface TextRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"text", InputProps, T> {}

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

  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  return (
    <Input
      className={classNames("schema-form-text-renderer", className)}
      placeholder={placeholder}
      {...restProps}
      readOnly={readOnly}
    />
  )
}

export default TextRenderer
