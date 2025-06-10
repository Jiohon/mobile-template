import React from "react"

import { omit } from "lodash"

import {
  ExtractRendererCompPropsType,
  RendererCompNameType,
  RendererCompType,
  SchemaFormBaseColumnType,
  SchemaFormColumnConfigType,
  SchemaFormInstance,
  SchemaFormValuesType,
} from "../types"

type RendererValueType<
  TCompType extends RendererCompNameType,
  TValues extends SchemaFormValuesType = SchemaFormValuesType,
> =
  | {
      renderer: React.ComponentType<ExtractRendererCompPropsType<TCompType, TValues>>
      transformProps?: (
        props: SchemaFormColumnConfigType<TCompType, TValues>
      ) => SchemaFormColumnConfigType<TCompType, TValues>
    }
  | React.ComponentType<ExtractRendererCompPropsType<TCompType, TValues>>

/**
 * 核心字段渲染器类
 * @template TValues - 表单数据类型，继承自 SchemaFormValuesType
 */
export class SchemaRenderer<TValues extends SchemaFormValuesType = SchemaFormValuesType> {
  private renderers = new Map<
    RendererCompNameType,
    RendererValueType<RendererCompNameType, TValues>
  >()

  /**
   * 注册字段渲染器
   * @template TCompType - 字段值类型
   * @param componentType - 字段类型标识
   * @param renderer - 对应的渲染组件
   */
  register<TCompType extends RendererCompNameType>(
    componentType: TCompType,
    renderer: RendererValueType<TCompType, TValues>
  ): void {
    this.renderers.set(componentType, renderer as RendererValueType<RendererCompNameType, TValues>)
  }

  /**
   * 获取字段渲染器
   * @param componentType - 字段类型标识
   * @returns 对应的渲染组件或默认文本渲染器
   */
  getRenderer<TCompType extends RendererCompNameType>(
    componentType: TCompType
  ): RendererValueType<TCompType, TValues> | undefined {
    return this.renderers.get(componentType) as RendererValueType<TCompType, TValues>
  }

  /**
   * 检查渲染器是否已注册
   * @param componentType - 字段类型标识
   * @returns 是否已注册
   */
  hasRenderer(componentType: RendererCompNameType): boolean {
    return this.renderers.has(componentType)
  }

  /**
   * 获取所有已注册的渲染器类型
   * @returns 已注册的字段类型数组
   */
  getRegisteredTypes(): RendererCompNameType[] {
    return Array.from(this.renderers.keys())
  }

  /**
   * 渲染字段
   * @param column - 字段渲染属性
   * @returns 渲染后的 React 节点
   */
  render(column: SchemaFormBaseColumnType<TValues>, form: SchemaFormInstance): React.ReactNode {
    const componentType = column.componentType || "text"
    const currentRenderer = this.getRenderer(componentType)

    if (!currentRenderer) {
      console.warn(`❌ No renderer found for componentType: ${componentType}`)
      return null
    }

    // 统一处理渲染器和属性变换
    let actualRenderer
    let transformedColumn = column

    if (typeof currentRenderer === "function") {
      actualRenderer = currentRenderer
    } else {
      actualRenderer = currentRenderer.renderer
      transformedColumn = (currentRenderer.transformProps?.(column) ??
        column) as SchemaFormBaseColumnType<TValues>
    }

    // 创建渲染配置
    const renderConfig = createRenderConfig<TValues>(transformedColumn, form)
    if (!renderConfig) return null

    try {
      return React.createElement(actualRenderer, renderConfig)
    } catch (error) {
      console.error(`❌ 渲染器 ${componentType} 执行出错:`, error)
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
   * @param componentType - 要移除的字段类型
   */
  unregister(componentType: RendererCompNameType): boolean {
    return this.renderers.delete(componentType)
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
 * 渲染配置函数
 * @template TValues - 表单数据类型
 * @param column - 字段配置
 * @param initialValues - 初始值
 * @param form - 表单实例
 * @returns 渲染配置对象
 */
export const createRenderConfig = <TValues extends SchemaFormValuesType>(
  column: SchemaFormBaseColumnType<TValues>,
  form: SchemaFormInstance
): RendererCompType<TValues> => {
  const formItemProps = omit(column, ["componentProps"])

  // 移除对 form.getFieldValue 的调用，避免在渲染期间访问未连接的 form 实例
  // Form.Item 会自动管理字段值，无需手动获取和传递
  const config: RendererCompType<TValues> = {
    ...column.componentProps,
    formInstance: form,
    formItemProps,
  }

  return config
}
