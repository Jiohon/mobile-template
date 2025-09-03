import { ReactNode } from "react"

import { Checkbox, Space } from "antd-mobile"
import { CheckboxValue } from "antd-mobile/es/components/checkbox"
import { FieldNamesType } from "antd-mobile/es/hooks"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { CheckboxGroupProps } from "antd-mobile"

import "./index.less"

/**
 * 选项数据结构
 */
export interface CheckboxOption {
  label: ReactNode
  value: CheckboxValue
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/**
 * CheckboxRenderer组件的Props类型
 */
export interface CheckboxRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"checkbox", CheckboxGroupProps, T> {
  readOnly?: boolean
  options?: CheckboxOption[]
  className?: string
  fieldNames?: Omit<FieldNamesType, "children">
}

/**
 * 复选框渲染器
 */
const CheckboxRenderer = <T extends SchemaFormValuesType>({
  value,
  options = [],
  fieldNames,
  className,
  formItemProps,
  formInstance,
  ...restProps
}: CheckboxRendererProps<T>) => {
  const labelName = fieldNames?.label || "label"
  const valueName = fieldNames?.value || "value"
  const disabledName = fieldNames?.disabled || "disabled"

  const disabled = restProps?.disabled || formItemProps?.disabled
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const getOption = (v: CheckboxValue, key: keyof CheckboxOption) => {
    const option = options.find((option) => option[valueName] === v)
    return option ? option[key] : v
  }

  if (readOnly) {
    return (
      <div className={classNames("schema-form-checkbox-renderer", className)}>
        {value?.map((v) => {
          return getOption(v, labelName)
        })}
      </div>
    )
  }

  return (
    <div className={classNames("schema-form-checkbox-renderer", className)}>
      <Checkbox.Group value={value} {...restProps} disabled={disabled}>
        <Space wrap style={{ "--gap-horizontal": "12px", "--gap-vertical": "8px" }}>
          {options.map((option) => (
            <Checkbox
              key={option[valueName]}
              disabled={option[disabledName]}
              {...option}
              value={option[valueName]}
            >
              {option[labelName]}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  )
}

export default CheckboxRenderer
