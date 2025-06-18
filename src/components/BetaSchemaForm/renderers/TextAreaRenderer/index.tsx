import { TextArea } from "antd-mobile"
import classNames from "classnames"

import type { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"
import type { TextAreaProps } from "antd-mobile"

import "./index.less"

/**
 * TextAreaRenderer组件的Props类型
 */
export interface TextAreaRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"text", TextAreaProps, T> {}

/**
 * 文本输入渲染器
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const TextAreaRenderer = <T extends SchemaFormValuesType>({
  className,
  formItemProps,
  formInstance,
  ...restProps
}: TextAreaRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请输入${formItemProps.label}`

  return (
    <TextArea
      className={classNames("schema-form-TextArea-renderer", className)}
      placeholder={placeholder}
      {...restProps}
    />
  )
}

export default TextAreaRenderer
