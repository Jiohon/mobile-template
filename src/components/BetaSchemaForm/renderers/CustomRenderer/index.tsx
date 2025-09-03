import React from "react"

import { ExpandCompPropsType, SchemaFormValuesType } from "../../types"

import "./index.less"

/**
 * CustomRenderer组件的Props类型
 */
export interface CustomRendererProps<T extends SchemaFormValuesType>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends ExpandCompPropsType<"custom", any, T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (props: any) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>
}

/**
 * 自定义渲染器
 * 支持自定义渲染函数或组件
 */
const CustomRenderer = <T extends SchemaFormValuesType>({
  value,
  onChange,
  disabled,
  render,
  component: Component,
  ...otherProps
}: CustomRendererProps<T>) => {
  // 处理 onChange 事件，确保类型兼容
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (val: any) => {
    onChange?.(val)
  }

  const commonProps = {
    value,
    onChange: handleChange,
    disabled,
    ...otherProps,
  }

  // 如果提供了自定义渲染函数
  if (render && typeof render === "function") {
    return <>{render(commonProps)}</>
  }

  // 如果提供了自定义组件
  if (Component) {
    return <Component {...commonProps} />
  }

  // 默认渲染
  return (
    <div className="schema-form-custom-renderer schema-form-custom-renderer--empty">
      <div className="schema-form-custom-renderer__placeholder">
        Custom Renderer: No render function or component provided
      </div>
    </div>
  )
}

export default CustomRenderer
