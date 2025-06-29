import { Checkbox, Space } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { CheckboxGroupProps, CheckboxProps } from "antd-mobile"

import "./index.less"

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
  extends ExpandRendererPropsType<"checkbox", CheckboxGroupProps, T> {
  options?: (CheckboxProps & { label: string })[]
  className?: string
}

/**
 * 复选框渲染器
 */
const CheckboxRenderer = <T extends SchemaFormValuesType>({
  value,
  disabled = false,
  options = [],
  className,
  formItemProps,
  formInstance,
  ...restProps
}: CheckboxRendererProps<T>) => {
  return (
    <div className={classNames("schema-form-checkbox-renderer", className)}>
      <Checkbox.Group value={value} disabled={disabled} {...restProps}>
        <Space wrap style={{ "--gap-horizontal": "12px", "--gap-vertical": "8px" }}>
          {options.map(({ value, label, ...restProps }) => (
            <Checkbox key={value} value={value} disabled={disabled} {...restProps}>
              {label}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  )
}

export default CheckboxRenderer
