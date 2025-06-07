import { DatePicker } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

type PickerDate = Date & {
  tillNow?: boolean
}

import type { DatePickerProps } from "antd-mobile"
import "./index.less"

/**
 * DateRenderer组件的Props类型
 */
export interface DateRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"date" | "time" | "datetime", DatePickerProps, T> {
  disabled?: boolean
  placeholder?: string
}

/**
 * 日期选择渲染器
 * 支持 date、time、datetime、dateTime 类型
 */
const DateRenderer = <T extends SchemaFormValuesType>({
  value,
  onConfirm,
  precision,
  disabled,
  placeholder = "请选择日期",
  ...restProps
}: DateRendererProps<T>) => {
  // 处理 onChange 事件，确保类型兼容
  const handleChange = (value: PickerDate) => {
    onConfirm?.(value)
  }

  return (
    <DatePicker value={value} onConfirm={handleChange} precision={precision} {...restProps}>
      {(value) => (
        <div
          style={{
            padding: "8px 0",
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          {value ? value.toLocaleString() : placeholder}
        </div>
      )}
    </DatePicker>
  )
}

export default DateRenderer
