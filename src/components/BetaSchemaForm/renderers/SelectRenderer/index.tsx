import { useMemo } from "react"

import { Selector } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { SelectorProps } from "antd-mobile"
import "./index.less"

type SelectorValue = string | number

/**
 * SelectRenderer组件的Props类型
 */
export type SelectRendererProps<T extends SchemaFormValuesType> = ExpandCompPropsType<
  "select",
  SelectorProps<SelectorValue>,
  T
> & {
  value?: SelectorValue
  readOnly?: boolean
}

/**
 * 选择器渲染器
 * 支持单选和多选
 */
const SelectRenderer = <T extends SchemaFormValuesType>({
  value,
  options = [],
  className,
  formItemProps,
  fieldNames,
  formInstance,
  ...restProps
}: SelectRendererProps<T>) => {
  const labelName = fieldNames?.label || "label"
  const valueName = fieldNames?.value || "value"

  const readOnly = restProps?.readOnly || formItemProps?.readOnly
  const disabled = restProps?.disabled || formItemProps?.disabled

  const Value = useMemo(() => {
    if (!value) return []

    if (Array.isArray(value)) {
      return value
    }
    return [value] as SelectorValue[]
  }, [value])

  if (readOnly) {
    return (
      <div className={classNames("schema-form-select-renderer", className)}>
        {Value?.map((v) => {
          return options.find((option) => option[valueName] === v)?.[labelName]
        })}
      </div>
    )
  }

  return (
    <Selector
      value={Value}
      className={classNames("schema-form-select-renderer", className)}
      fieldNames={fieldNames}
      options={options}
      {...restProps}
      disabled={disabled}
    />
  )
}

export default SelectRenderer
