import { Radio } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { RadioGroupProps } from "antd-mobile"
import "./index.less"

/**
 * 选项数据结构
 */
export interface RadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * RadioRenderer组件的Props类型
 */
export interface RadioRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"radio", RadioGroupProps, T> {
  options?: RadioOption[]
}

/**
 * 单选框渲染器
 */
const RadioRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled,
  options = [],
  ...restProps
}: RadioRendererProps<T>) => {
  // 处理 onChange 事件，确保类型兼容
  const handleChange = (val: string | number) => {
    onChange?.(val)
  }

  return (
    <Radio.Group
      value={value as string | number}
      onChange={handleChange}
      disabled={disabled}
      {...restProps}
    >
      {options.map((option) => (
        <Radio key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  )
}

export default RadioRenderer
