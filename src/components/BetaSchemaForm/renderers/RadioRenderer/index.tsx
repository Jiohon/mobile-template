import { Radio, Space } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { RadioGroupProps, RadioProps } from "antd-mobile"
import "./index.less"

export interface RadioOption extends RadioProps {
  label: string
}

/**
 * RadioRenderer组件的Props类型
 */
export interface RadioRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"radio", RadioGroupProps, T> {
  options?: RadioOption[]
  className?: string
}

/**
 * 单选框渲染器
 */
const RadioRenderer = <T extends SchemaFormValuesType>({
  options = [],
  className,
  formItemProps,
  formInstance,
  ...restProps
}: RadioRendererProps<T>) => {
  return (
    <div className={classNames("schema-form-radio-renderer", className)}>
      <Radio.Group {...restProps}>
        <Space wrap style={{ "--gap-horizontal": "12px", "--gap-vertical": "8px" }}>
          {options.map((option) => (
            <Radio key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  )
}

export default RadioRenderer
