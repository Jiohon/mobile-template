import { useCallback, useMemo, useState } from "react"

import { DatePicker, Input } from "antd-mobile"
import dayjs from "dayjs"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import { weekdayToZh } from "./labelRender"

import type { DatePickerProps } from "antd-mobile"
import type { PickerDate } from "antd-mobile/es/components/date-picker/util"
import type { Dayjs } from "dayjs"

import "./index.less"

type Generic = string
type GenericFn = (value: Dayjs) => string

export type FormatType = Generic | GenericFn

/**
 * DateRenderer组件的Props类型
 */
export interface DateRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"date", DatePickerProps, T> {
  disabled?: boolean
  placeholder?: string
  format?: FormatType
  onConfirm?: (value: PickerDate | string) => void
  onChange?: (value: PickerDate | string) => void
}

/**
 * 日期选择渲染器
 * 支持 date、time、datetime、dateTime 类型
 */
const DateRenderer = <T extends SchemaFormValuesType>({
  value,
  onConfirm,
  disabled,
  format = "YYYY-MM-DD HH:mm:ss",
  formItemProps,
  ...restProps
}: DateRendererProps<T>) => {
  const [visible, setVisible] = useState(false)

  const placeholder = restProps?.placeholder || `请选择${formItemProps.label}`

  const labelRenderer = useCallback((type: string, data: number) => {
    switch (type) {
      case "year":
        return data + "年"
      case "quarter":
        return data + "季度"
      case "month":
        return data + "月"
      case "day":
        return data + "日"
      case "hour":
        return data + "时"
      case "minute":
        return data + "分"
      case "second":
        return data + "秒"
      case "week":
        return data + "周"
      case "week-day":
        return weekdayToZh(data)
      default:
        return data
    }
  }, [])

  const currentValue = useMemo(() => {
    if (value) {
      return dayjs(value).toDate()
    }
    return null
  }, [value])

  const getFormatValue = (value: PickerDate | null): string => {
    if (!value) return ""
    const _format = typeof format === "string" ? format : format(dayjs(value))
    return dayjs(value).format(_format)
  }

  const handleConfirm = (value: PickerDate) => {
    onConfirm?.(getFormatValue(value))
    restProps?.onChange?.(getFormatValue(value))
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <DatePicker
      visible={visible}
      value={currentValue}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      renderLabel={labelRenderer}
      {...restProps}
    >
      {(currentValue) => (
        <div onClick={() => setVisible(true)}>
          <Input placeholder={placeholder} readOnly value={getFormatValue(currentValue)} />
        </div>
      )}
    </DatePicker>
  )
}

export default DateRenderer
