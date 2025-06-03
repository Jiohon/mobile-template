import { BaseColumnSchema, ConditionExpression, FieldCondition, LinkageEffect } from "../types"

// 联动引擎类
export class LinkageEngine {
  private effects: Map<string, LinkageEffect[]> = new Map()
  private dependencies: Map<string, string[]> = new Map()
  private computeCache: Map<string, any> = new Map()

  constructor(private columns: BaseColumnSchema[]) {
    this.buildDependencyGraph()
  }

  // 构建依赖关系图
  private buildDependencyGraph() {
    this.columns.forEach((column) => {
      if (column.linkage) {
        const { dependencies = [], effects = [] } = column.linkage

        // 记录字段依赖
        if (dependencies.length > 0) {
          this.dependencies.set(column.dataIndex, dependencies)
        }

        // 记录联动效果
        effects.forEach((effect) => {
          const targets = Array.isArray(effect.target) ? effect.target : [effect.target]
          targets.forEach((target) => {
            const existing = this.effects.get(target) || []
            existing.push(effect)
            this.effects.set(target, existing)
          })
        })
      }
    })
  }

  // 评估条件表达式
  public evaluateCondition(
    condition: ConditionExpression | FieldCondition,
    values: Record<string, any>
  ): boolean {
    // 如果是简单条件
    if ("field" in condition) {
      return this.evaluateFieldCondition(condition as FieldCondition, values)
    }

    const expr = condition as ConditionExpression

    // 如果有自定义函数
    if (expr.custom) {
      try {
        return expr.custom(values)
      } catch (error) {
        console.error("条件表达式执行错误:", error)
        return false
      }
    }

    // 如果有条件列表
    if (expr.conditions && expr.conditions.length > 0) {
      const results = expr.conditions.map((cond) => this.evaluateFieldCondition(cond, values))

      switch (expr.operator) {
        case "and":
          return results.every(Boolean)
        case "or":
          return results.some(Boolean)
        case "not":
          return !results.some(Boolean)
        default:
          return results.every(Boolean) // 默认 AND
      }
    }

    return true
  }

  // 评估字段条件
  private evaluateFieldCondition(condition: FieldCondition, values: Record<string, any>): boolean {
    const { field, operator, value } = condition
    const fieldValue = values[field]

    switch (operator) {
      case "=":
        return fieldValue === value
      case "!=":
        return fieldValue !== value
      case "in":
        return Array.isArray(value) && value.includes(fieldValue)
      case "notIn":
        return Array.isArray(value) && !value.includes(fieldValue)
      case "gt":
        return Number(fieldValue) > Number(value)
      case "lt":
        return Number(fieldValue) < Number(value)
      case "gte":
        return Number(fieldValue) >= Number(value)
      case "lte":
        return Number(fieldValue) <= Number(value)
      case "includes":
        return String(fieldValue).includes(String(value))
      case "startsWith":
        return String(fieldValue).startsWith(String(value))
      case "endsWith":
        return String(fieldValue).endsWith(String(value))
      case "regex":
        const regex = typeof value === "string" ? new RegExp(value) : value
        return regex.test(String(fieldValue))
      default:
        return true
    }
  }

  // 检查字段是否应该显示
  public shouldShowField(column: BaseColumnSchema, values: Record<string, any>): boolean {
    // 优先检查新的 linkage.when 条件
    if (column.linkage?.when) {
      return this.evaluateCondition(column.linkage.when, values)
    }

    // 兼容旧的 condition
    if (column.condition) {
      return this.evaluateCondition(column.condition, values)
    }

    return true
  }

  // 计算动态属性
  public computeProps(column: BaseColumnSchema, values: Record<string, any>): Record<string, any> {
    const cacheKey = `${column.dataIndex}_props_${JSON.stringify(values)}`

    if (this.computeCache.has(cacheKey)) {
      return this.computeCache.get(cacheKey)
    }

    const computedProps: Record<string, any> = {}

    if (column.linkage?.props) {
      const { props } = column.linkage

      // 计算各种动态属性
      if (props.disabled) {
        computedProps.disabled = props.disabled(values)
      }
      if (props.required) {
        computedProps.required = props.required(values)
      }
      if (props.placeholder) {
        computedProps.placeholder = props.placeholder(values)
      }
      if (props.title) {
        computedProps.title = props.title(values)
      }
      if (props.help) {
        computedProps.help = props.help(values)
      }
      if (props.custom) {
        Object.assign(computedProps, props.custom(values))
      }
    }

    this.computeCache.set(cacheKey, computedProps)
    return computedProps
  }

  // 计算动态选项
  public async computeOptions(
    column: BaseColumnSchema,
    values: Record<string, any>
  ): Promise<any[]> {
    const linkageOptions = column.linkage?.options
    if (!linkageOptions) return []

    try {
      // 异步选项
      if (linkageOptions.async) {
        return await linkageOptions.async(values)
      }

      // 计算选项
      if (linkageOptions.compute) {
        return linkageOptions.compute(values)
      }

      // 基于源字段的选项
      if (linkageOptions.sourceField) {
        const sourceValue = values[linkageOptions.sourceField]

        if (linkageOptions.transform) {
          return linkageOptions.transform(sourceValue, values)
        }

        // 如果源值是数组，直接返回
        if (Array.isArray(sourceValue)) {
          return linkageOptions.filter ? linkageOptions.filter(sourceValue, values) : sourceValue
        }
      }

      return []
    } catch (error) {
      console.error("计算动态选项失败:", error)
      return []
    }
  }

  // 计算动态验证规则
  public computeRules(column: BaseColumnSchema, values: Record<string, any>): any[] {
    const linkageRules = column.linkage?.rules
    if (!linkageRules) return []

    // 检查条件
    if (linkageRules.when && !this.evaluateCondition(linkageRules.when, values)) {
      return []
    }

    // 计算规则
    if (linkageRules.compute) {
      try {
        return linkageRules.compute(values)
      } catch (error) {
        console.error("计算动态验证规则失败:", error)
        return []
      }
    }

    return []
  }

  // 计算字段值
  public computeValue(
    column: BaseColumnSchema,
    values: Record<string, any>,
    currentValue: any
  ): any {
    const valueCompute = column.linkage?.valueCompute
    if (!valueCompute) return currentValue

    try {
      if (valueCompute.function) {
        return valueCompute.function(values, currentValue)
      }

      // 简单表达式计算（可以扩展为更复杂的表达式解析器）
      if (valueCompute.expression) {
        return this.evaluateExpression(valueCompute.expression, values)
      }

      return currentValue
    } catch (error) {
      console.error("计算字段值失败:", error)
      return currentValue
    }
  }

  // 简单的表达式计算器
  private evaluateExpression(expression: string, values: Record<string, any>): any {
    try {
      // 替换变量
      let expr = expression
      Object.keys(values).forEach((key) => {
        const regex = new RegExp(`\\b${key}\\b`, "g")
        expr = expr.replace(regex, JSON.stringify(values[key]))
      })

      // 安全计算（这里可以使用更安全的表达式解析器）
      return Function('"use strict"; return (' + expr + ")")()
    } catch (error) {
      console.error("表达式计算失败:", expression, error)
      return null
    }
  }

  // 执行联动效果
  public executeEffects(
    fieldName: string,
    values: Record<string, any>,
    formInstance: any
  ): Promise<void> {
    return new Promise((resolve) => {
      const effects = this.effects.get(fieldName) || []

      const executeEffect = (effect: LinkageEffect, index: number) => {
        setTimeout(() => {
          // 检查触发条件
          if (effect.when && !this.evaluateCondition(effect.when, values)) {
            if (index === effects.length - 1) resolve()
            return
          }

          const targets = Array.isArray(effect.target) ? effect.target : [effect.target]

          targets.forEach((target) => {
            switch (effect.type) {
              case "setValue":
                const newValue = effect.effect ? effect.effect(values, target) : effect.value
                formInstance.setFieldValue(target, newValue)
                break
              case "clear":
                formInstance.setFieldValue(target, undefined)
                break
              case "validate":
                formInstance.validateFields([target])
                break
              // 其他效果类型可以通过修改字段属性来实现
            }
          })

          if (index === effects.length - 1) resolve()
        }, effect.delay || 0)
      }

      if (effects.length === 0) {
        resolve()
      } else {
        effects.forEach(executeEffect)
      }
    })
  }

  // 清除缓存
  public clearCache() {
    this.computeCache.clear()
  }

  // 获取字段依赖
  public getDependencies(fieldName: string): string[] {
    return this.dependencies.get(fieldName) || []
  }
}
