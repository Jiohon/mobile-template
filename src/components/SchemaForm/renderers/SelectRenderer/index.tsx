import { Selector } from "antd-mobile"

import { SchemaFormExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { SelectorProps } from "antd-mobile"
import "./index.less"

type SelectorValue = string | number

/**
 * SelectRenderer组件的Props类型
 */
export interface SelectRendererProps<T extends SchemaFormValuesType>
  extends SchemaFormExpandRendererPropsType<"select", SelectorProps<SelectorValue>, T> {}

/**
 * 选择器渲染器
 * 支持单选和多选（antd-mobile Selector 组件值始终为数组）
 * 完整继承 antd-mobile Selector 组件的所有功能
 */
const SelectRenderer = <T extends SchemaFormValuesType>({
  disabled,
  options = [],
  multiple,
  formItemProps,
  ...restProps
}: SelectRendererProps<T>) => {
  console.log("restProps", restProps)
  // Form.Item 会自动传递 value 和 onChange，无需手动处理
  return (
    <div className="schema-form-select-renderer">
      <Selector disabled={disabled} options={options} multiple={multiple} {...restProps} />
    </div>
  )
}

export default SelectRenderer
