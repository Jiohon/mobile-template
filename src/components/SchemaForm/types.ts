import React from "react"

import type { CheckboxRendererProps } from "./renderers/CheckboxRenderer"
import type { CustomRendererProps } from "./renderers/CustomRenderer"
import type { DateRendererProps } from "./renderers/DateRenderer"
import type { NumberRendererProps } from "./renderers/NumberRenderer"
import type { RadioRendererProps } from "./renderers/RadioRenderer"
import type { RateRendererProps } from "./renderers/RateRenderer"
import type { SelectRendererProps } from "./renderers/SelectRenderer"
import type { SliderRendererProps } from "./renderers/SliderRenderer"
import type { SwitchRendererProps } from "./renderers/SwitchRenderer"
import type { TextRendererProps } from "./renderers/TextRenderer"
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

// ==================== 字段类型映射定义 ====================

/**
 * 支持的字段类型枚举
 */
export type SchemaFormColumnValueType =
  keyof SchemaFormColumnTypeToPropsMapType<SchemaFormValuesType>

/**
 * 字段类型到对应渲染器 Props 的映射
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnTypeToPropsMapType<TValues extends SchemaFormValuesType> = {
  text: TextRendererProps<TValues>
  number: NumberRendererProps<TValues>
  switch: SwitchRendererProps<TValues>
  select: SelectRendererProps<TValues>
  radio: RadioRendererProps<TValues>
  checkbox: CheckboxRendererProps<TValues>
  date: DateRendererProps<TValues>
  time: DateRendererProps<TValues>
  datetime: DateRendererProps<TValues>
  rate: RateRendererProps<TValues>
  slider: SliderRendererProps<TValues>
  custom: CustomRendererProps<TValues>
}

/**
 * 根据字段类型提取对应的渲染器 Props 类型
 * @template TColumnType - 字段类型
 * @template TValues - 表单数据类型
 */
export type ExtractColumnPropsType<
  TColumnType extends SchemaFormColumnValueType,
  TValues extends SchemaFormValuesType,
> = SchemaFormColumnTypeToPropsMapType<TValues>[TColumnType]

/**
 * 所有字段渲染器 Props 的联合类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormAllColumnRendererPropsType<TValues extends SchemaFormValuesType> =
  SchemaFormColumnTypeToPropsMapType<TValues>[keyof SchemaFormColumnTypeToPropsMapType<TValues>]

// ==================== 表单字段配置类型 ====================

/**
 * 表单字段的基础配置类型
 * @template TColumnType - 字段类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnConfigType<
  TColumnType extends SchemaFormColumnValueType,
  TValues extends SchemaFormValuesType,
> = Omit<AntdMobileFormItemProps, "name" | "children"> & {
  /** 字段名称，必须是表单数据中的键 */
  name: keyof TValues
  /** 字段类型标识符 */
  valueType: TColumnType
  /**
   * 字段属性配置
   * 排除 formItemProps 和内部测试属性以避免循环引用
   */
  fieldProps?: Omit<ExtractColumnPropsType<TColumnType, TValues>, "formItemProps">
}

/**
 * 渲染器扩展 Props 基础类型
 * @template TColumnType - 字段类型
 * @template TProps - 原始 Props 类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormExpandRendererPropsType<
  TColumnType extends SchemaFormColumnValueType,
  TProps,
  TValues extends SchemaFormValuesType,
> = TProps & {
  formItemProps: Omit<SchemaFormColumnConfigType<TColumnType, TValues>, "fieldProps">
}

// ==================== SchemaForm 字段类型定义 ====================

/**
 * 支持的基础字段配置类型（所有非依赖字段）
 * @template TValues - 表单数据类型
 */
export type SchemaFormBaseColumnType<TValues extends SchemaFormValuesType> = {
  [K in keyof SchemaFormColumnTypeToPropsMapType<TValues>]: SchemaFormColumnConfigType<
    K & SchemaFormColumnValueType,
    TValues
  >
}[keyof SchemaFormColumnTypeToPropsMapType<TValues>]

/**
 * 依赖字段配置类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormDependencyColumnType<TValues extends SchemaFormValuesType> = {
  valueType: "dependency"
  /** 监听的字段名称列表 */
  to: (keyof TValues)[]
  /** 动态渲染函数，根据监听字段的变化生成字段配置 */
  children: RenderDependencyFunction<TValues>
}

/**
 * 动态渲染函数类型
 * @template TValues - 表单数据类型
 */
export type RenderDependencyFunction<TValues extends SchemaFormValuesType> = (
  changedValues: Partial<TValues>,
  formInstance: SchemaFormInstance
) => SchemaFormColumnsType<TValues>

/**
 * 完整的字段配置类型（包括基础字段和依赖字段）
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnType<TValues extends SchemaFormValuesType> =
  | SchemaFormBaseColumnType<TValues>
  | SchemaFormDependencyColumnType<TValues>

/**
 * 表单列配置数组类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnsType<TValues extends SchemaFormValuesType> =
  SchemaFormColumnType<TValues>[]

// ==================== SchemaForm 实例和组件类型 ====================

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
  columns: SchemaFormColumnsType<TValues>
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

// ==================== 渲染器相关类型 ====================

export type SchemaFormColumnConfigMapType<T extends SchemaFormValuesType> = {
  [K in keyof T]: SchemaFormColumnType<T> & { name: K }
}
