import { useCallback, useMemo } from "react"

import { DatePicker, Input } from "antd-mobile"
import classNames from "classnames"
import dayjs from "dayjs"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

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
  extends ExpandCompPropsType<"date", Omit<DatePickerProps, "value">, T> {
  readOnly?: boolean
  disabled?: boolean
  placeholder?: string
  format?: FormatType
  popupClassName?: string
  value?: PickerDate | string | null
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
  format = "YYYY-MM-DD HH:mm:ss",
  className,
  popupClassName,
  formItemProps,
  formInstance,
  ...restProps
}: DateRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请选择${formItemProps.label}`

  const readOnly = restProps?.readOnly || formItemProps?.readOnly
  const disabled = restProps?.disabled || formItemProps?.disabled

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
  }

  const handleClick = (open: () => void) => {
    if (readOnly || disabled) return
    open()
  }

  return (
    <DatePicker
      value={currentValue}
      onConfirm={handleConfirm}
      renderLabel={labelRenderer}
      className={classNames("schema-form-date-popup-renderer", popupClassName)}
      {...restProps}
    >
      {(currentValue, { open }) => (
        <div
          className={classNames("schema-form-date-renderer", className)}
          onClick={() => handleClick(open)}
        >
          <Input
            placeholder={placeholder}
            readOnly
            disabled={disabled}
            value={getFormatValue(currentValue)}
          />
        </div>
      )}
    </DatePicker>
  )
}

export default DateRenderer
