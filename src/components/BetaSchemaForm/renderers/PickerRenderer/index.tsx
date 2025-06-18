import { Input, Picker } from "antd-mobile"
import classNames from "classnames"

import type { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"
import type { PickerProps } from "antd-mobile"
import type { PickerValue, PickerValueExtend } from "antd-mobile/es/components/picker"

import "./index.less"

/**
 * DateRenderer组件的Props类型
 */
export interface PickerRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"picker", PickerProps, T> {
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  onChange?: ((value: PickerValue[], extend: PickerValueExtend) => void) | undefined
}

/**
 * 选择渲染器
 * 支持 date、time、datetime、dateTime 类型
 */
const PickerRenderer = <T extends SchemaFormValuesType>({
  value,
  onConfirm,
  disabled,
  readOnly,
  className,
  popupClassName,
  formItemProps,
  formInstance,
  ...restProps
}: PickerRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请选择${formItemProps.label}`

  const handleConfirm = (value: PickerValue[], extend: PickerValueExtend) => {
    onConfirm?.(value, extend)
    restProps?.onChange?.(value, extend)
  }

  const handleClick = (open: () => void) => {
    if (readOnly || disabled) return
    open()
  }

  return (
    <Picker
      value={value}
      onConfirm={handleConfirm}
      title={restProps?.title ?? placeholder}
      popupClassName={classNames("schema-form-picker-popup-renderer", popupClassName)}
      {...restProps}
    >
      {(items, { open }) => {
        return (
          <div
            className={classNames("schema-form-picker-renderer", className)}
            onClick={() => handleClick(open)}
          >
            <Input
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              value={
                items.every((item) => item === null)
                  ? ""
                  : items.map((item) => item?.label ?? "").join(" - ")
              }
            />
          </div>
        )
      }}
    </Picker>
  )
}

export default PickerRenderer
