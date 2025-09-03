import { Radio, Space } from "antd-mobile"
import { RadioValue } from "antd-mobile/es/components/radio"
import { FieldNamesType } from "antd-mobile/es/hooks"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { RadioGroupProps, RadioProps } from "antd-mobile"
import "./index.less"

export interface RadioOption extends RadioProps {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/**
 * RadioRenderer组件的Props类型
 */
export interface RadioRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"radio", RadioGroupProps, T> {
  readOnly?: boolean
  options?: RadioOption[]
  className?: string
  fieldNames?: Omit<FieldNamesType, "children">
}

/**
 * 单选框渲染器
 */
const RadioRenderer = <T extends SchemaFormValuesType>({
  options = [],
  className,
  formItemProps,
  formInstance,
  value,
  fieldNames,
  ...restProps
}: RadioRendererProps<T>) => {
  const labelName = (fieldNames?.label || "label") as keyof RadioOption
  const valueName = (fieldNames?.value || "value") as keyof RadioOption
  const disabledName = (fieldNames?.disabled || "disabled") as keyof RadioOption

  const disabled = restProps?.disabled || formItemProps?.disabled
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const getOption = (v: RadioValue, key: keyof RadioOption) => {
    const option = options.find((option) => option[valueName] === v)
    return option ? option[key] : v
  }

  if (readOnly) {
    return (
      <div className={classNames("schema-form-radio-renderer", className)}>
        {<>{getOption(value as RadioValue, labelName)}</>}
      </div>
    )
  }

  return (
    <div className={classNames("schema-form-radio-renderer", className)}>
      <Radio.Group value={value} {...restProps} disabled={disabled}>
        <Space wrap style={{ "--gap-horizontal": "12px", "--gap-vertical": "8px" }}>
          {options.map((option) => (
            <Radio
              {...option}
              key={option[valueName]}
              value={option[valueName]}
              disabled={option[disabledName]}
            >
              {option[labelName]}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  )
}

export default RadioRenderer
