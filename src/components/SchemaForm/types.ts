export interface BaseColumnSchema {
  /** 列标题 */
  title: string
  /** 数据字段名 */
  dataIndex: string
  /** 字段描述/帮助文本 */
  tooltip?: string
  /** 是否必填 */
  required?: boolean
  /** 默认值 */
  initialValue?: any
  /** 是否禁用 */
  disabled?: boolean
  /** 占位符 */
  placeholder?: string
  /** 宽度 */
  width?: "s" | "m" | "l" | "xl" | number | string
  /** 字段间依赖 */
  dependencies?: string[]
  /** 显示条件 */
  condition?: FieldCondition
  /** 验证规则 */
  rules?: ValidationRule[]
  /** 动态表单项属性 */
  formItemProps?: FormItemPropsFunction | Record<string, any>
  /** 动态字段属性 */
  fieldProps?: FieldPropsFunction | Record<string, any>
  /** 自定义渲染表单项 */
  renderFormItem?: (schema: any, config: any, form: any) => React.ReactNode
  /** 字段联动配置 */
  linkage?: FieldLinkage
}

// 扩展的字段联动配置
export interface FieldLinkage {
  /** 依赖的字段列表 */
  dependencies?: string[]
  /** 显示条件 */
  when?: ConditionExpression
  /** 动态属性计算 */
  props?: LinkageProps
  /** 动态选项计算 */
  options?: LinkageOptions
  /** 动态验证规则 */
  rules?: LinkageRules
  /** 值计算函数 */
  valueCompute?: ValueCompute
  /** 联动效果 */
  effects?: LinkageEffect[]
}

// 条件表达式 - 支持复杂的逻辑判断
export interface ConditionExpression {
  /** 操作符 */
  operator?: "and" | "or" | "not"
  /** 条件列表 */
  conditions?: FieldCondition[]
  /** 自定义条件函数 */
  custom?: (values: Record<string, any>) => boolean
}

// 动态属性
export interface LinkageProps {
  /** 动态禁用 */
  disabled?: (values: Record<string, any>) => boolean
  /** 动态必填 */
  required?: (values: Record<string, any>) => boolean
  /** 动态占位符 */
  placeholder?: (values: Record<string, any>) => string
  /** 动态标题 */
  title?: (values: Record<string, any>) => string
  /** 动态帮助文本 */
  help?: (values: Record<string, any>) => string
  /** 自定义属性函数 */
  custom?: (values: Record<string, any>) => Record<string, any>
}

// 动态选项
export interface LinkageOptions {
  /** 选项来源字段 */
  sourceField?: string
  /** 选项过滤函数 */
  filter?: (options: any[], values: Record<string, any>) => any[]
  /** 选项转换函数 */
  transform?: (sourceValue: any, values: Record<string, any>) => any[]
  /** 异步选项加载 */
  async?: (values: Record<string, any>) => Promise<any[]>
  /** 静态选项计算 */
  compute?: (values: Record<string, any>) => any[]
}

// 动态验证规则
export interface LinkageRules {
  /** 条件验证 */
  when?: ConditionExpression
  /** 验证规则计算函数 */
  compute?: (values: Record<string, any>) => ValidationRule[]
  /** 异步验证 */
  async?: (value: any, values: Record<string, any>) => Promise<string | null>
}

// 值计算
export interface ValueCompute {
  /** 计算表达式 */
  expression?: string
  /** 计算函数 */
  function?: (values: Record<string, any>, currentValue: any) => any
  /** 触发条件 */
  trigger?: "change" | "blur" | "submit" | string[]
  /** 是否立即计算 */
  immediate?: boolean
}

// 联动效果
export interface LinkageEffect {
  /** 目标字段 */
  target: string | string[]
  /** 效果类型 */
  type:
    | "show"
    | "hide"
    | "enable"
    | "disable"
    | "setValue"
    | "setOptions"
    | "setProps"
    | "validate"
    | "clear"
  /** 触发条件 */
  when?: ConditionExpression
  /** 效果值 */
  value?: any
  /** 效果函数 */
  effect?: (values: Record<string, any>, targetField: string) => any
  /** 延迟执行（毫秒） */
  delay?: number
}

export interface FieldCondition {
  /** 依赖的字段名 */
  field: string
  /** 操作符 */
  operator:
    | "="
    | "!="
    | "in"
    | "notIn"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "includes"
    | "startsWith"
    | "endsWith"
    | "regex"
  /** 比较值 */
  value: any
}

export interface ValidationRule {
  /** 验证类型 */
  type?: "required" | "email" | "phone" | "url" | "number" | "min" | "max" | "pattern" | "custom"
  /** 是否必填 */
  required?: boolean
  /** 错误信息 */
  message?: string
  /** 验证参数 */
  value?: any
  /** 最小值/长度 */
  min?: number
  /** 最大值/长度 */
  max?: number
  /** 正则模式 */
  pattern?: string | RegExp
  /** 自定义验证函数 */
  validator?: (rule: any, value: any, callback: any) => void | Promise<any>
}

export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

export type ValueEnum = Record<
  string | number,
  | {
      text: string
      status?: string
      disabled?: boolean
    }
  | string
>

export type FormItemPropsFunction = (form: any) => Record<string, any>
export type FieldPropsFunction = (form: any) => Record<string, any>

// 字段类型定义
export interface TextColumnSchema extends BaseColumnSchema {
  valueType?: "text" | "password" | "email" | "tel" | "url"
  maxLength?: number
  minLength?: number
  showCount?: boolean
}

export interface NumberColumnSchema extends BaseColumnSchema {
  valueType: "digit" | "number"
  min?: number
  max?: number
  step?: number
  precision?: number
}

export interface TextAreaColumnSchema extends BaseColumnSchema {
  valueType: "textarea"
  rows?: number
  maxLength?: number
  showCount?: boolean
  autoSize?: boolean | { minRows?: number; maxRows?: number }
}

export interface SelectColumnSchema extends BaseColumnSchema {
  valueType: "select"
  options?: SelectOption[]
  valueEnum?: ValueEnum
  multiple?: boolean
}

export interface RadioColumnSchema extends BaseColumnSchema {
  valueType: "radio"
  options?: SelectOption[]
  valueEnum?: ValueEnum
  direction?: "horizontal" | "vertical"
}

export interface CheckboxColumnSchema extends BaseColumnSchema {
  valueType: "checkbox"
  options?: SelectOption[]
  valueEnum?: ValueEnum
  /** 如果没有options，则为单个checkbox */
}

export interface SwitchColumnSchema extends BaseColumnSchema {
  valueType: "switch"
  checkedText?: string
  uncheckedText?: string
}

export interface DateColumnSchema extends BaseColumnSchema {
  valueType: "date" | "time" | "datetime" | "dateTime"
  format?: string
  minDate?: Date
  maxDate?: Date
}

export interface PickerColumnSchema extends BaseColumnSchema {
  valueType: "cascader"
  options: SelectOption[][]
  cascade?: boolean
}

export interface RateColumnSchema extends BaseColumnSchema {
  valueType: "rate"
  count?: number
  allowHalf?: boolean
}

export interface SliderColumnSchema extends BaseColumnSchema {
  valueType: "slider"
  min?: number
  max?: number
  step?: number
  marks?: Record<number, string>
}

export interface ImageColumnSchema extends BaseColumnSchema {
  valueType: "image"
  maxCount?: number
  maxSize?: number
  accept?: string
  compress?: boolean
}

export interface DependencyColumnSchema {
  valueType: "dependency"
  name: string[]
  columns: (values: Record<string, any>) => ColumnSchema[]
}

export interface CustomColumnSchema extends BaseColumnSchema {
  valueType: "custom"
  /** 自定义渲染组件 */
  render?: (props: any) => React.ReactNode
}

export type ColumnSchema =
  | TextColumnSchema
  | NumberColumnSchema
  | TextAreaColumnSchema
  | SelectColumnSchema
  | RadioColumnSchema
  | CheckboxColumnSchema
  | SwitchColumnSchema
  | DateColumnSchema
  | PickerColumnSchema
  | RateColumnSchema
  | SliderColumnSchema
  | ImageColumnSchema
  | DependencyColumnSchema
  | CustomColumnSchema

// antd-mobile Form 组件的原生属性接口
interface AntdMobileFormProps {
  /** 表单名称，会作为字段 id 的前缀 */
  name?: string
  /** 设置字段组件的禁用状态 */
  disabled?: boolean
  /** 设置字段保留字段值 */
  preserve?: boolean
  /** 验证提示模板 */
  validateMessages?: any
  /** 设置字段校验的时机 */
  validateTrigger?: string | string[]
  /** 字段更新时触发回调事件 */
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void
  /** 表单样式类名 */
  className?: string
  /** 表单样式 */
  style?: React.CSSProperties
  /** 当字段值发生改变时的回调 */
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void
  /** 数据验证成功后回调事件 */
  onFinish?: (values: Record<string, any>) => void
  /** 数据验证失败后回调事件 */
  onFinishFailed?: (errorInfo: any) => void
  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** Form 实例，可通过 Form.useForm 获取 */
  form?: any
}

export interface SchemaFormProps
  extends Omit<
    AntdMobileFormProps,
    "onFinish" | "onFinishFailed" | "onValuesChange" | "initialValues" | "form"
  > {
  /** 表单字段配置 (新) */
  columns?: ColumnSchema[]
  /** 表单字段配置 (兼容) */
  schema?: FieldSchema[]
  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** 表单值变化回调 */
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void
  /** 表单提交回调 */
  onFinish?: (values: Record<string, any>) => void
  /** 表单验证失败回调 */
  onFinishFailed?: (errorInfo: any) => void
  /** 是否显示提交按钮 */
  showSubmitButton?: boolean
  /** 提交按钮文本 */
  submitButtonText?: string
  /** 提交按钮属性 */
  submitButtonProps?: any
  /** 表单实例引用 */
  formRef?: React.RefObject<SchemaFormInstance>
  /** Form 实例，可通过 Form.useForm 获取 */
  form?: any
}

export interface FormContextValue {
  /** 当前表单值 */
  values: Record<string, any>
  /** 设置表单值 */
  setFieldValue: (name: string, value: any) => void
  /** 获取表单值 */
  getFieldValue: (name: string) => any
  /** 获取所有表单值 */
  getFieldsValue: () => Record<string, any>
  /** 验证字段 */
  validateField: (name: string) => Promise<any>
  /** 是否禁用 */
  disabled?: boolean
}

// SchemaForm 实例接口
export interface SchemaFormInstance {
  /** 获取指定字段的值 */
  getFieldValue: (name: string) => any
  /** 获取所有字段的值 */
  getFieldsValue: () => Record<string, any>
  /** 设置指定字段的值 */
  setFieldValue: (name: string, value: any) => void
  /** 设置多个字段的值 */
  setFieldsValue: (values: Record<string, any>) => void
  /** 验证所有字段 */
  validateFields: () => Promise<Record<string, any>>
  /** 重置表单 */
  resetFields: () => void
  /** 提交表单 */
  submit: () => void
  /** 联动引擎实例 */
  linkageEngine: any
  /** 清除联动缓存 */
  clearLinkageCache: () => void
  /** 手动触发依赖字段更新 */
  triggerDependencyUpdate: () => void
}

// 兼容性类型（保持向后兼容）
export type FieldSchema = ColumnSchema
export interface BaseFieldSchema extends BaseColumnSchema {
  name: string
  label: string
  componentType: string
}

// 兼容性接口定义
export interface TextFieldSchema extends BaseFieldSchema {
  componentType: "text" | "password" | "email" | "tel" | "url"
  maxLength?: number
  minLength?: number
  showCount?: boolean
}

export interface NumberFieldSchema extends BaseFieldSchema {
  componentType: "number"
  min?: number
  max?: number
  step?: number
  precision?: number
}

export interface TextAreaFieldSchema extends BaseFieldSchema {
  componentType: "textarea"
  rows?: number
  maxLength?: number
  showCount?: boolean
  autoSize?: boolean | { minRows?: number; maxRows?: number }
}

export interface SelectFieldSchema extends BaseFieldSchema {
  componentType: "select"
  options: SelectOption[]
  multiple?: boolean
}

export interface RadioFieldSchema extends BaseFieldSchema {
  componentType: "radio"
  options: SelectOption[]
  direction?: "horizontal" | "vertical"
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  componentType: "checkbox"
  options?: SelectOption[]
}

export interface SwitchFieldSchema extends BaseFieldSchema {
  componentType: "switch"
  checkedText?: string
  uncheckedText?: string
}

export interface DateFieldSchema extends BaseFieldSchema {
  componentType: "date" | "time" | "datetime"
  format?: string
  minDate?: Date
  maxDate?: Date
}

export interface PickerFieldSchema extends BaseFieldSchema {
  componentType: "picker"
  options: SelectOption[][]
  cascade?: boolean
}

export interface RateFieldSchema extends BaseFieldSchema {
  componentType: "rate"
  count?: number
  allowHalf?: boolean
}

export interface SliderFieldSchema extends BaseFieldSchema {
  componentType: "slider"
  min?: number
  max?: number
  step?: number
  marks?: Record<number, string>
}

export interface ImageFieldSchema extends BaseFieldSchema {
  componentType: "image"
  maxCount?: number
  maxSize?: number
  accept?: string
  compress?: boolean
}

export interface CustomFieldSchema extends BaseFieldSchema {
  componentType: "custom"
  render: (props: any) => React.ReactNode
}
