import { useState } from "react"

import { Cascader, Input } from "antd-mobile"
import { CascaderValue, CascaderValueExtend } from "antd-mobile/es/components/cascader-view"
import classNames from "classnames"

import type { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"
import type { CascaderProps } from "antd-mobile"

import "./index.less"

/**
 * DateRenderer组件的Props类型
 */
export interface CascaderRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"cascader", CascaderProps, T> {
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
  disabled,
  readOnly,
  className,
  formItemProps,
  formInstance,
  ...restProps
}: CascaderRendererProps<T>) => {
  const [visible, setVisible] = useState(false)

  const placeholder = restProps?.placeholder || `请选择${formItemProps.label}`

  const handleConfirm = (value: CascaderValue[], extend: CascaderValueExtend) => {
    console.log("handleConfirm", value, extend)
    onConfirm?.(value, extend)
    restProps?.onChange?.(value, extend)
    setVisible(false)
  }

  const handleClick = () => {
    if (readOnly || disabled) return
    setVisible(true)
  }

  return (
    <Cascader
      visible={visible}
      value={value}
      onConfirm={handleConfirm}
      title={restProps?.title ?? placeholder}
      {...restProps}
    >
      {(items) => {
        console.log("items", items)
        return (
          <div
            className={classNames("schema-form-cascader-renderer", className)}
            onClick={handleClick}
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
