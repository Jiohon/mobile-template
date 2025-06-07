import React from "react"

import { omit } from "lodash"

import {
  ExtractColumnPropsType,
  SchemaFormAllColumnRendererPropsType,
  SchemaFormBaseColumnType,
  SchemaFormColumnValueType,
  SchemaFormInstance,
  SchemaFormValuesType,
} from "../types"

/**
 * 字段渲染器函数类型
 * @template TValues - 表单数据类型
 */
export type SchemaFormColumnRendererFunction<TValues extends SchemaFormValuesType> = (
  props: SchemaFormBaseColumnType<TValues> & {
    formItemProps: Omit<SchemaFormBaseColumnType<TValues>, "fieldProps">
  }
) => React.ReactNode

/**
 * 核心字段渲染器类
 * @template TValues - 表单数据类型，继承自 SchemaFormValuesType
 */
export class SchemaRenderer<TValues extends SchemaFormValuesType = SchemaFormValuesType> {
  private renderers: Map<
    SchemaFormColumnValueType,
    React.ComponentType<SchemaFormAllColumnRendererPropsType<TValues>>
  > = new Map()

  /**
   * 注册字段渲染器
   * @template TColumnType - 字段值类型
   * @param valueType - 字段类型标识
   * @param renderer - 对应的渲染组件
   */
  register<TColumnType extends SchemaFormColumnValueType>(
    valueType: TColumnType,
    renderer: React.ComponentType<ExtractColumnPropsType<TColumnType, TValues>>
  ): void {
    this.renderers.set(
      valueType,
      renderer as React.ComponentType<SchemaFormAllColumnRendererPropsType<TValues>>
    )
  }

  /**
   * 批量注册渲染器
   * @param rendererMap - 渲染器映射表
   */
  registerBatch(
    rendererMap: Partial<
      Record<
        SchemaFormColumnValueType,
        React.ComponentType<SchemaFormAllColumnRendererPropsType<TValues>>
      >
    >
  ): void {
    Object.entries(rendererMap).forEach(([valueType, renderer]) => {
      if (renderer) {
        this.renderers.set(valueType as SchemaFormColumnValueType, renderer)
      }
    })
  }

  /**
   * 获取字段渲染器
   * @param valueType - 字段类型标识
   * @returns 对应的渲染组件或默认文本渲染器
   */
  getRenderer(
    valueType: SchemaFormColumnValueType
  ): React.ComponentType<SchemaFormAllColumnRendererPropsType<TValues>> | undefined {
    return this.renderers.get(valueType) || this.renderers.get("text")
  }

  /**
   * 检查渲染器是否已注册
   * @param valueType - 字段类型标识
   * @returns 是否已注册
   */
  hasRenderer(valueType: SchemaFormColumnValueType): boolean {
    return this.renderers.has(valueType)
  }

  /**
   * 获取所有已注册的渲染器类型
   * @returns 已注册的字段类型数组
   */
  getRegisteredTypes(): SchemaFormColumnValueType[] {
    return Array.from(this.renderers.keys())
  }

  /**
   * 渲染字段
   * @param props - 字段渲染属性
   * @returns 渲染后的 React 节点
   */
  render(props: SchemaFormAllColumnRendererPropsType<TValues>): React.ReactNode {
    const valueType = props.formItemProps.valueType || "text"
    const Renderer = this.getRenderer(valueType)

    if (!Renderer) {
      console.warn(`❌ No renderer found for valueType: ${valueType}`)
      return null
    }

    try {
      return React.createElement(Renderer, props)
    } catch (error) {
      console.error(`❌ 渲染器 ${valueType} 执行出错:`, error)
      return null
    }
  }

  /**
   * 清除所有注册的渲染器
   */
  clear(): void {
    this.renderers.clear()
  }

  /**
   * 移除特定类型的渲染器
   * @param valueType - 要移除的字段类型
   */
  unregister(valueType: SchemaFormColumnValueType): boolean {
    return this.renderers.delete(valueType)
  }
}

/**
 * 创建渲染器实例的工厂函数
 * @template TValues - 表单数据类型
 * @returns 新的渲染器实例
 */
export const createSchemaRenderer = <
  TValues extends SchemaFormValuesType = SchemaFormValuesType,
>(): SchemaRenderer<TValues> => {
  return new SchemaRenderer<TValues>()
}

/**
 * 渲染配置工厂函数
 * @template TValues - 表单数据类型
 * @param column - 字段配置
 * @param initialValues - 初始值
 * @param form - 表单实例
 * @returns 渲染配置对象
 */
export const createRenderConfig = <TValues extends SchemaFormValuesType>(
  column: SchemaFormBaseColumnType<TValues>,
  initialValues: Partial<TValues>,
  form: SchemaFormInstance
): SchemaFormAllColumnRendererPropsType<TValues> => {
  const formItemProps = omit(column, ["fieldProps"])

  // 优先从表单实例获取当前值，如果不存在则使用初始值
  const currentValue = form.getFieldValue(column.name) ?? initialValues[column.name]

  // 不需要手动传递 value，Form.Item 会自动管理字段值
  return {
    ...column.fieldProps,
    value: currentValue,
    formItemProps,
  }
}
