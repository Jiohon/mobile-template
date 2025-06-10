import React from "react"

import type { CheckboxRendererProps } from "./renderers/CheckboxRenderer"
import type { CustomRendererProps } from "./renderers/CustomRenderer"
import type { DateRendererProps } from "./renderers/DateRenderer"
import type { NumberRendererProps } from "./renderers/NumberRenderer"
import type { PickerRendererProps } from "./renderers/PickerRenderer"
import type { RadioRendererProps } from "./renderers/RadioRenderer"
import type { RateRendererProps } from "./renderers/RateRenderer"
import type { SelectRendererProps } from "./renderers/SelectRenderer"
import type { SliderRendererProps } from "./renderers/SliderRenderer"
import type { SwitchRendererProps } from "./renderers/SwitchRenderer"
import type { TextRendererProps } from "./renderers/TextRenderer"
import type { UploadRendererProps } from "./renderers/UploadRenderer"
import type { FormProps as AntdMobileFormProps, SelectorOption } from "antd-mobile"
import type { FormInstance as AntdMobileFormInstance } from "antd-mobile/es/components/form"
import type { FormItemProps as AntdMobileFormItemProps } from "antd-mobile/es/components/form/form-item"
import type { ValidateErrorEntity } from "rc-field-form/es/interface"

// ==================== 基础类型定义 ====================
/**
 * 表单数据的基础类型约束
 * 所有表单数据类型都必须继承此类型
 */
export type SchemaFormValuesType = Record<string, unknown>

/**
 * 重新导出 antd-mobile 的选项类型
 * @template TValue - 选项值的类型，默认为 string | number
 */
export type SchemaFormOptionType<TValue = string | number> = SelectorOption<TValue>

// ==================== 表单实例类型定义 ====================

/**
 * 扩展的 antd-mobile 表单实例类型，添加类型安全的泛型支持
 * @template TValues - 表单数据类型
 */
export type SchemaFormInstance = AntdMobileFormInstance

// ==================== 渲染器组件类型映射 ====================

/**
 * 渲染器所需的 Props
 * @template TCompType - 字段类型
 * @template TProps - 原始渲染器组件 Props 类型
 * @template TValues - 表单数据类型
 */
interface ExpandProps<
  TCompType extends RendererCompNameType,
  TValues extends SchemaFormValuesType,
> {
  formItemProps: Omit<SchemaFormColumnConfigType<TCompType, TValues>, "componentProps">
  formInstance: SchemaFormInstance
}

/**
 * 渲染器组件扩展 Props 类型
 * @template TCompType - 字段类型
 * @template TProps - 原始渲染器组件 Props 类型
 * @template TValues - 表单数据类型
 */
export type ExpandRendererPropsType<
  TCompType extends RendererCompNameType,
  TProps,
  TValues extends SchemaFormValuesType,
> = TProps & ExpandProps<TCompType, TValues>

/**
 * 字段类型到对应渲染器组件 Props 的映射
 * @template TValues - 表单数据类型
 */
export type SchemaFormCompMap<TValues extends SchemaFormValuesType> = {
  text: TextRendererProps<TValues>
  number: NumberRendererProps<TValues>
  switch: SwitchRendererProps<TValues>
  select: SelectRendererProps<TValues>
  radio: RadioRendererProps<TValues>
  checkbox: CheckboxRendererProps<TValues>
  date: DateRendererProps<TValues>
  picker: PickerRendererProps<TValues>
  rate: RateRendererProps<TValues>
  slider: SliderRendererProps<TValues>
  upload: UploadRendererProps<TValues>
  custom: CustomRendererProps<TValues>
}

/**
 * componentType 类型
 * 所有渲染器组件名称类型
 */
export type RendererCompNameType = keyof SchemaFormCompMap<SchemaFormValuesType>

/**
 * 所有 componentType 的 Props 类型
 * @template TValues - 表单数据类型
 */
export type RendererCompType<TValues extends SchemaFormValuesType> =
  SchemaFormCompMap<TValues>[keyof SchemaFormCompMap<TValues>]

/**
 * 根据 componentType 提取对应的渲染器组件 Props 类型
 * @template TCompType - 字段类型
 * @template TValues - 表单数据类型
 */
export type ExtractRendererCompPropsType<
  TCompType extends RendererCompNameType,
  TValues extends SchemaFormValuesType,
> = SchemaFormCompMap<TValues>[TCompType]

/**
 * 表单渲染器组件的基础配置类型
 * @template TCompType - 字段类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnConfigType<
  TCompType extends RendererCompNameType,
  TValues extends SchemaFormValuesType,
> = Omit<AntdMobileFormItemProps, "name" | "children"> & {
  /** 字段名称，必须是表单数据中的键 */
  name: keyof TValues
  /** 字段类型标识符 */
  componentType: TCompType
  /**
   * 字段属性配置
   * 排除 ExpandProps 组件内部字段
   */
  componentProps?: Omit<
    ExpandRendererPropsType<TCompType, ExtractRendererCompPropsType<TCompType, TValues>, TValues>,
    keyof ExpandProps<TCompType, TValues>
  >
}

/**
 * 基础column类型配置类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormBaseColumnType<TValues extends SchemaFormValuesType> = {
  [K in keyof SchemaFormCompMap<TValues>]: SchemaFormColumnConfigType<K, TValues>
}[keyof SchemaFormCompMap<TValues>]

/**
 * 依赖column配置类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormDependencyColumnType<TValues extends SchemaFormValuesType> = {
  componentType: "dependency"
  /** 监听的字段名称列表 */
  to: (keyof TValues)[]
  /** 动态渲染函数，根据监听字段的变化生成字段配置 */
  // TODO: 待优化，children返回类型校验不正常
  children(
    changedValues: Partial<TValues>,
    formInstance: SchemaFormInstance
  ): SchemaFormColumnType<TValues>[]
}

/**
 * 完整的column配置类型（包括基础column和依赖column）
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnType<TValues extends SchemaFormValuesType> =
  | SchemaFormBaseColumnType<TValues>
  | SchemaFormDependencyColumnType<TValues>

/**
 * 表单验证错误信息类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormErrorInfoType<TValues extends SchemaFormValuesType> =
  ValidateErrorEntity<TValues>

/**
 * SchemaForm 组件属性类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormProps<TValues extends SchemaFormValuesType> = Omit<
  AntdMobileFormProps,
  "children" | "initialValues"
> & {
  /** 字段配置列表 */
  columns: SchemaFormColumnType<TValues>[]
  /** 表单初始值 */
  initialValues?: Partial<TValues>
  /** 是否显示提交按钮 */
  showSubmitButton?: boolean
  /** 提交按钮文本 */
  submitButtonText?: string
  /** 提交按钮属性 */
  submitButtonProps?: Record<string, unknown>
  /** 表单实例引用 */
  formRef?: React.RefObject<SchemaFormInstance>
}
