import { TextArea } from "antd-mobile"
import classNames from "classnames"

import type { ExpandCompPropsType, SchemaFormValuesType } from "../../types"
import type { TextAreaProps } from "antd-mobile"

import "./index.less"

/**
 * TextAreaRenderer组件的Props类型
 */
// export interface TextAreaRendererProps<T extends SchemaFormValuesType>
//   extends ExpandCompPropsType<"text", TextAreaProps, T> {}
export type TextAreaRendererProps<T extends SchemaFormValuesType> = ExpandCompPropsType<
  "text",
  TextAreaProps,
  T
>

/**
 * 文本输入渲染器
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const TextAreaRenderer = <T extends SchemaFormValuesType>({
  className,
  autoSize = { minRows: 2, maxRows: 6 },
  formItemProps,
  formInstance,
  ...restProps
}: TextAreaRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请输入${formItemProps.label}`

  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  return (
    <TextArea
      className={classNames("schema-form-TextArea-renderer", className)}
      placeholder={placeholder}
      autoSize={autoSize}
      {...restProps}
      readOnly={readOnly}
    />
  )
}

export default TextAreaRenderer
