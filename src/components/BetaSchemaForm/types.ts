import React from "react"

import type { SchemaFormCompMap } from "./core/registerRenderers"
import type { FormProps as AntdMobileFormProps, ButtonProps } from "antd-mobile"
import type { FormInstance as AntdMobileFormInstance } from "antd-mobile/es/components/form"
import type { FormItemProps as AntdMobileFormItemProps } from "antd-mobile/es/components/form/form-item"

// ==================== 基础类型定义 ====================

/**
 * 表单数据的基础类型约束
 * 所有表单数据类型都必须继承此类型
 */
export type SchemaFormValuesType = unknown

/**
 * 扩展的 antd-mobile 表单实例类型，添加类型安全的泛型支持
 * @template TValues - 表单数据类型
 */
export type SchemaFormInstance = AntdMobileFormInstance

// ==================== 渲染器核心类型 ====================

/**
 * componentType 类型
 * 所有渲染器组件名称类型
 */
export type SchemaFormCompNameType<TValues extends SchemaFormValuesType> =
  keyof SchemaFormCompMap<TValues>

/**
 * 所有 componentType 的 Props 类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormCompPropsType<TValues extends SchemaFormValuesType> =
  SchemaFormCompMap<TValues>[SchemaFormCompNameType<TValues>]

// ==================== 渲染器扩展类型 ====================

/**
 * 根据 componentType 提取对应的渲染器组件 Props 类型
 * @template TCompType - 组件类型
 * @template TValues - 表单数据类型
 */
export type ExtractCompPropsType<
  TCompType extends SchemaFormCompNameType<TValues>,
  TValues extends SchemaFormValuesType,
> = SchemaFormCompMap<TValues>[TCompType]

/**
 * 扩展 **formItemProps** 、**formInstance** 字段
 * @template TCompType - 组件类型
 * @template TValues - 表单数据类型
 */
export interface ExpandFormField<
  TCompType extends keyof SchemaFormCompMap<SchemaFormValuesType>,
  TValues extends SchemaFormValuesType,
> {
  formItemProps: Omit<SchemaFormColumnConfigType<TCompType, TValues>, "componentProps">
  formInstance: SchemaFormInstance
}

/**
 * 渲染器组件扩展 Props 类型
 * @template TCompType - 组件类型
 * @template TProps - 组件 Props 类型
 * @template TValues - 表单数据类型
 */
export type ExpandCompPropsType<
  TCompType extends keyof SchemaFormCompMap<SchemaFormValuesType>,
  TProps,
  TValues extends SchemaFormValuesType,
> = TProps &
  ExpandFormField<TCompType, TValues> & {
    /**
     * 只读模式渲染组件
     * 自定义只读模式的 dom,render 方法只管理的只读模式，编辑模式需要使用 renderFormItem
     */
    renderReadOnly?: (props: SchemaFormCompPropsType<TValues>) => React.ReactNode
  }

// ==================== 字段配置类型 ====================

/**
 * 表单渲染器组件的基础配置类型
 * @template TCompType - 组件类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnConfigType<
  TCompType extends keyof SchemaFormCompMap<SchemaFormValuesType>,
  TValues extends SchemaFormValuesType,
> = Omit<AntdMobileFormItemProps, "name" | "children" | "initialValue"> & {
  /** 字段名称，必须是表单数据中的键 */
  name: keyof TValues
  /** 字段类型标识符 */
  componentType: TCompType
  /** 字段初始值 */
  initialValue?: ExtractCompPropsType<TCompType, TValues>["value"]
  /**
   * 字段属性配置
   * column 配置内排除 ExpandFieldType 组件内部字段
   */
  componentProps?: Omit<
    ExpandCompPropsType<TCompType, ExtractCompPropsType<TCompType, TValues>, TValues>,
    keyof ExpandFormField<TCompType, TValues>
  >

  /** 是否只读，只读时，组件不进行交互 */
  readOnly?: boolean
  /**
   * 渲染组件
   * 自定义渲染renderFormItem组件
   */
  renderFormItem?: (props: SchemaFormBaseColumnType<TValues>) => React.ReactNode
}

/**
 * 基础 column 类型配置类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormBaseColumnType<TValues extends SchemaFormValuesType> = {
  [K in SchemaFormCompNameType<TValues>]: SchemaFormColumnConfigType<K, TValues>
}[SchemaFormCompNameType<TValues>]

/**ƒ
 * 依赖 column 配置类型
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
 * 完整的 column 配置类型（包括基础 column 和依赖 column）
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnType<TValues extends SchemaFormValuesType> =
  | SchemaFormBaseColumnType<TValues>
  | SchemaFormDependencyColumnType<TValues>

// ==================== 表单组件类型 ====================

/**
 * 表单验证错误信息类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormErrorInfoType<TValues extends SchemaFormValuesType> = {
  values: TValues
  errorFields: {
    name: (string | number)[]
    errors: string[]
  }[]
  outOfDate: boolean
}

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
  /** 提交按钮文本 */
  submitButtonText?: string
  /** 提交按钮属性 */
  submitButtonProps?: ButtonProps
  /** 表单实例引用 */
  formRef?: React.RefObject<SchemaFormInstance>
  /** 表单是否只读 */
  readOnly?: boolean
}
