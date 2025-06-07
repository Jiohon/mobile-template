import React from "react"

import { Input } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { InputProps } from "antd-mobile"
import "./index.less"

/**
 * NumberRenderer组件的Props类型
 */
export interface NumberRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"number", InputProps, T> {
  type?: "number" | "digit"
}

/**
 * 数字输入渲染器
 * 支持 number、digit 类型
 * 完整继承 antd-mobile Input 组件的所有功能
 */
const NumberRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled,
  type = "number",
  ...restProps
}: NumberRendererProps<T>): React.ReactElement => {
  // 处理 onChange 事件，确保类型兼容和数值转换
  const handleChange = (val: string) => {
    const numValue = val === "" ? undefined : Number(val)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?.(numValue as any)
  }

  return (
    <Input
      type={type}
      value={value?.toString() || ""}
      onChange={handleChange}
      disabled={disabled}
      {...restProps}
    />
  )
}

export default NumberRenderer
