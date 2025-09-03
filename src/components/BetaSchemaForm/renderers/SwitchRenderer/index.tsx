import { useMemo } from "react"

import { Switch } from "antd-mobile"
import classNames from "classnames"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import type { SwitchProps } from "antd-mobile"
import "./index.less"

/**
 * SwitchRenderer组件的Props类型
 */
export interface SwitchRendererProps<T extends SchemaFormValuesType>
  extends ExpandCompPropsType<"switch", SwitchProps, T> {
  readOnly?: boolean
  value?: boolean
  checkedValue?: string | number | boolean
  uncheckedValue?: string | number | boolean
}

/**
 * 开关渲染器
 * 支持自定义开关状态文本
 */
const SwitchRenderer = <T extends SchemaFormValuesType>({
  value,
  className,
  checkedText,
  uncheckedText,
  checkedValue = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uncheckedValue = false,
  formItemProps,
  formInstance,
  ...restProps
}: SwitchRendererProps<T>) => {
  const readOnly = restProps?.readOnly || formItemProps?.readOnly

  const checked = useMemo(() => {
    if (typeof value === "boolean") {
      return value
    }

    return value === checkedValue
  }, [value, checkedValue])

  if (readOnly) {
    return (
      <div className={classNames("schema-form-switch-renderer", className)}>
        {value === checkedValue ? checkedText : uncheckedText}
      </div>
    )
  }

  return (
    <Switch
      checked={checked}
      className={classNames("schema-form-switch-renderer", className)}
      checkedText={checkedText}
      uncheckedText={uncheckedText}
      {...restProps}
    />
  )
}

export default SwitchRenderer
