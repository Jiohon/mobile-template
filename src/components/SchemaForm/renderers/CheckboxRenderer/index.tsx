import { Checkbox } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { CheckboxGroupProps, CheckboxProps } from "antd-mobile"
import "./index.less"

type CheckboxValue = string | number

/**
 * 选项数据结构
 */
export interface CheckboxOption {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * CheckboxRenderer组件的Props类型
 */
export interface CheckboxRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"checkbox", CheckboxGroupProps, T> {
  options?: (CheckboxProps & { label: string })[]
}

/**
 * 复选框渲染器
 */
const CheckboxRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled = false,
  options = [],
  ...restProps
}: CheckboxRendererProps<T>) => {
  // 处理onChange事件，确保类型兼容
  const handleChange = (val: CheckboxValue[]) => {
    onChange?.(val)
  }

  // 如果没有选项，渲染为单个复选框
  return (
    <Checkbox.Group
      value={Array.isArray(value) ? value : []}
      onChange={handleChange}
      disabled={disabled}
      {...restProps}
    >
      {options.map(({ value, label, ...restProps }) => (
        <Checkbox key={value} value={value} disabled={disabled} {...restProps}>
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  )
}

export default CheckboxRenderer
