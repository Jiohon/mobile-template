import React from "react"

import { Input } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { InputProps } from "antd-mobile"
import "./index.less"

/**
 * NumberRenderer组件的Props类型
 */
// export interface NumberRendererProps<T extends SchemaFormValuesType>
//   extends ExpandCompPropsType<"number", Omit<InputProps, "value" | "onChange">, T> {
//   value?: number
//   type?: "number"
//   onChange?: (value: number | string) => void
// }

export type NumberRendererProps<T extends SchemaFormValuesType> = ExpandCompPropsType<
  "number",
  Omit<InputProps, "value" | "onChange">,
  T
> & {
  value?: number
  type?: "number"
  onChange?: (value: number | string) => void
}

/**
 * 数字输入渲染器
 * 支持 number、digit 类型
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const NumberRenderer = <T extends SchemaFormValuesType>({
  value,
  type,
  className,
  formItemProps,
  formInstance,
  onChange,
  ...restProps
}: NumberRendererProps<T>): React.ReactElement => {
  const placeholder = restProps?.placeholder || `请输入${formItemProps.label}`

  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const handleChange = (value: string) => {
    const numberValue = Number.isNaN(Number(value)) ? "" : Number(value)
    onChange?.(numberValue)
  }

  return (
    <Input
      className={classNames("schema-form-number-renderer", className)}
      type={"number"}
      value={value?.toString() || ""}
      placeholder={placeholder}
      onChange={handleChange}
      {...restProps}
      readOnly={readOnly}
    />
  )
}

export default NumberRenderer
