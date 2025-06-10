import { Radio, Space } from "antd-mobile"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { RadioGroupProps, RadioProps } from "antd-mobile"
import "./index.less"

/**
 * RadioRenderer组件的Props类型
 */
export interface RadioRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"radio", RadioGroupProps, T> {
  options?: (RadioProps & { label: string })[]
}

/**
 * 单选框渲染器
 */
const RadioRenderer = <T extends SchemaFormValuesType>({
  value,
  disabled,
  options = [],
  ...restProps
}: RadioRendererProps<T>) => {
  return (
    <Radio.Group value={value} disabled={disabled} {...restProps}>
      <Space wrap style={{ "--gap-horizontal": "12px", "--gap-vertical": "8px" }}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  )
}

export default RadioRenderer
