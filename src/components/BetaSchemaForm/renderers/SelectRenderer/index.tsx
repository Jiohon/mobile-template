import { Selector } from "antd-mobile"
import classNames from "classnames"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SelectorProps } from "antd-mobile"
import "./index.less"

type SelectorValue = string | number

/**
 * SelectRenderer组件的Props类型
 */
export interface SelectRendererProps<T extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"select", SelectorProps<SelectorValue>, T> {}

/**
 * 选择器渲染器
 * 支持单选和多选
 */
const SelectRenderer = <T extends SchemaFormValuesType>({
  options = [],
  className,
  formItemProps,
  formInstance,
  ...restProps
}: SelectRendererProps<T>) => {
  return (
    <Selector
      className={classNames("schema-form-select-renderer", className)}
      options={options}
      {...restProps}
    />
  )
}

export default SelectRenderer
