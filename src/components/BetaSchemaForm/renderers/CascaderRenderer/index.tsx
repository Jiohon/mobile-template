import { Cascader, Input } from "antd-mobile"
import { CascaderValue, CascaderValueExtend } from "antd-mobile/es/components/cascader-view"
import classNames from "classnames"

import type { ExpandCompPropsType, SchemaFormValuesType } from "../../types"
import type { CascaderProps } from "antd-mobile"

import "./index.less"

/**
 * DateRenderer组件的Props类型
 */
export interface CascaderRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"cascader", CascaderProps, T> {
  separator?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  onChange?: (value: CascaderValue[], extend: CascaderValueExtend) => void
}

/**
 * 级联选择器渲染器
 */
const CascaderRenderer = <T extends SchemaFormValuesType>({
  separator = " - ",
  value,
  onConfirm,
  className,
  formItemProps,
  formInstance,
  ...restProps
}: CascaderRendererProps<T>) => {
  const placeholder = restProps?.placeholder || `请选择${formItemProps.label}`

  const readOnly = restProps?.readOnly || formItemProps?.readOnly
  const disabled = restProps?.disabled || formItemProps?.disabled

  const handleConfirm = (value: CascaderValue[], extend: CascaderValueExtend) => {
    if (readOnly || disabled) return

    onConfirm?.(value, extend)
    restProps?.onChange?.(value, extend)
  }

  const handleClick = (open: () => void) => {
    if (readOnly || disabled) return

    open()
  }

  return (
    <Cascader
      value={value}
      onConfirm={handleConfirm}
      title={restProps?.title ?? placeholder}
      {...restProps}
    >
      {(items, { open }) => {
        return (
          <div
            className={classNames("schema-form-cascader-renderer", className)}
            onClick={() => handleClick(open)}
          >
            <Input
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              value={items.map((item) => item?.label ?? "").join(separator)}
            />
          </div>
        )
      }}
    </Cascader>
  )
}

export default CascaderRenderer
