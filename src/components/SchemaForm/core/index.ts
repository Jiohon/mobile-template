import React from "react"

import { BaseColumnSchema, ColumnSchema } from "../types"
import { getFieldOptions, parseDynamicProps } from "../utils"

// 字段渲染器映射
export interface FieldRenderProps {
  schema: BaseColumnSchema
  value: any
  onChange: (value: any) => void
  form: any
  disabled?: boolean
}

export type FieldRenderer = (props: FieldRenderProps) => React.ReactNode

// 核心字段渲染器
export class SchemaRenderer {
  private renderers: Map<string, FieldRenderer> = new Map()

  constructor() {
    this.registerDefaultRenderers()
  }

  // 注册字段渲染器
  register(valueType: string, renderer: FieldRenderer) {
    this.renderers.set(valueType, renderer)
  }

  // 获取字段渲染器
  getRenderer(valueType: string): FieldRenderer | undefined {
    return this.renderers.get(valueType) || this.renderers.get("text")
  }

  // 渲染字段
  render(props: FieldRenderProps): any {
    const { schema } = props
    const valueType = (schema as any).valueType || "text"
    const renderer = this.getRenderer(valueType)

    if (!renderer) {
      console.warn(`❌ No renderer found for valueType: ${valueType}`)
      return null
    }

    try {
      return renderer(props)
    } catch (error) {
      console.error(`❌ 渲染器 ${valueType} 执行出错:`, error)
      return null
    }
  }

  private registerDefaultRenderers() {
    // 默认渲染器会在需要时注册
  }
}

// 单例渲染器实例
export const schemaRenderer = new SchemaRenderer()

// 渲染配置工厂函数
export const createRenderConfig = (column: ColumnSchema, form: any) => {
  if (column.valueType === "dependency") {
    return null
  }

  const baseColumn = column as BaseColumnSchema

  // 解析动态属性
  const fieldProps = parseDynamicProps(baseColumn.fieldProps, form)
  const formItemProps = parseDynamicProps(baseColumn.formItemProps, form)

  // 获取选项数据
  const options = getFieldOptions(baseColumn)

  return {
    ...baseColumn,
    fieldProps,
    formItemProps,
    options,
  }
}
