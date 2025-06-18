import React from "react"

import { Input } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { InputProps } from "antd-mobile"
import "./index.less"

/**
 * NumberRenderer组件的Props类型
 */
export interface NumberRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"number", Omit<InputProps, "value">, T> {
  value?: number
  type?: "number" | "digit"
}

/**
 * 数字输入渲染器
 * 支持 number、digit 类型
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const NumberRenderer = <T extends SchemaFormValuesType>({
  value,
  type = "number",
  className,
  formItemProps,
  formInstance,
  ...restProps
}: NumberRendererProps<T>): React.ReactElement => {
  const placeholder = restProps?.placeholder || `请输入${formItemProps.label}`

  return (
    <Input
      className={classNames("schema-form-number-renderer", className)}
      type={type}
      value={value?.toString() || ""}
      placeholder={placeholder}
      {...restProps}
    />
  )
}

export default NumberRenderer
