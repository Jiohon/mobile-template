import { BaseColumnSchema, ColumnSchema, FieldCondition, ValidationRule, ValueEnum } from "./types"

/**
 * 从columns中提取默认值
 */
export const getDefaultValues = (columns: ColumnSchema[]): Record<string, any> => {
  const defaultValues: Record<string, any> = {}

  columns.forEach((column) => {
    // 跳过dependency类型的字段
    if (column.valueType === "dependency") {
      return
    }

    const fieldName = (column as BaseColumnSchema).dataIndex

    if ((column as BaseColumnSchema).initialValue !== undefined) {
      defaultValues[fieldName] = (column as BaseColumnSchema).initialValue
    } else {
      // 根据valueType设置默认值
      const valueType = (column as any).valueType || "text"
      switch (valueType) {
        case "text":
        case "password":
        case "email":
        case "tel":
        case "url":
        case "textarea":
          defaultValues[fieldName] = ""
          break
        case "number":
        case "digit":
          defaultValues[fieldName] = undefined
          break
        case "switch":
          defaultValues[fieldName] = false
          break
        case "checkbox":
          defaultValues[fieldName] =
            (column as any).options || (column as any).valueEnum ? [] : false
          break
        case "select":
          defaultValues[fieldName] = (column as any).multiple ? [] : undefined
          break
        case "radio":
          defaultValues[fieldName] = undefined
          break
        case "date":
        case "time":
        case "datetime":
        case "dateTime":
          defaultValues[fieldName] = undefined
          break
        case "cascader":
          defaultValues[fieldName] = []
          break
        case "rate":
          defaultValues[fieldName] = 0
          break
        case "slider":
          defaultValues[fieldName] = (column as any).min || 0
          break
        case "image":
          defaultValues[fieldName] = []
          break
        default:
          defaultValues[fieldName] = undefined
      }
    }
  })

  return defaultValues
}

/**
 * 合并初始值和默认值
 */
export const getInitialValues = (
  defaultValues: Record<string, any>,
  initialValues?: Record<string, any>
): Record<string, any> => {
  return {
    ...defaultValues,
    ...initialValues,
  }
}

/**
 * 检查字段是否应该显示
 */
export const shouldShowField = (
  condition: FieldCondition | undefined,
  values: Record<string, any>
): boolean => {
  if (!condition) return true

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

/**
 * 将ValueEnum转换为SelectOption数组
 */
export const valueEnumToOptions = (valueEnum: ValueEnum) => {
  return Object.entries(valueEnum).map(([value, config]) => {
    if (typeof config === "string") {
      return { label: config, value }
    }
    return {
      label: config.text,
      value,
      disabled: config.disabled,
    }
  })
}

/**
 * 获取字段的选项数据
 */
export const getFieldOptions = (column: any) => {
  if (column.options) {
    return column.options
  }
  if (column.valueEnum) {
    return valueEnumToOptions(column.valueEnum)
  }
  return []
}

/**
 * 解析动态属性
 */
export const parseDynamicProps = (props: any, form: any): Record<string, any> => {
  if (typeof props === "function") {
    return props(form) || {}
  }
  return props || {}
}

/**
 * 获取字段的验证规则
 */
export const getFieldRules = (column: ColumnSchema, form: any): ValidationRule[] => {
  if (column.valueType === "dependency") {
    return []
  }

  const baseColumn = column as BaseColumnSchema
  const rules: ValidationRule[] = []

  // 处理静态rules
  if (baseColumn.rules) {
    rules.push(...baseColumn.rules)
  }

  // 处理动态formItemProps中的rules
  const dynamicFormItemProps = parseDynamicProps(baseColumn.formItemProps, form)
  if (dynamicFormItemProps.rules) {
    rules.push(...dynamicFormItemProps.rules)
  }

  // 如果字段必填，添加必填验证
  if (baseColumn.required && !rules.some((rule) => rule.required || rule.type === "required")) {
    rules.unshift({
      required: true,
      message: `${baseColumn.title}不能为空`,
    })
  }

  return rules
}

/**
 * 验证字段值
 */
export const validateFieldValue = async (
  value: any,
  rules: ValidationRule[] = [],
  allValues: Record<string, any> = {}
): Promise<string | undefined> => {
  for (const rule of rules) {
    const error = await validateSingleRule(value, rule, allValues)
    if (error) {
      return error
    }
  }
  return undefined
}

/**
 * 验证单个规则
 */
const validateSingleRule = async (
  value: any,
  rule: ValidationRule,
  _allValues: Record<string, any>
): Promise<string | undefined> => {
  const { type, required, message, min, max, pattern, validator } = rule

  // 处理required验证
  if (required || type === "required") {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return message || "此项为必填项"
    }
  }

  // 如果值为空且不是必填，跳过其他验证
  if (!value && !required && type !== "required") {
    return undefined
  }

  switch (type) {
    case "email":
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message || "请输入正确的邮箱格式"
      }
      break

    case "phone":
      if (value && !/^1[3-9]\d{9}$/.test(value)) {
        return message || "请输入正确的手机号码"
      }
      break

    case "url":
      if (value && !/^https?:\/\/.+/.test(value)) {
        return message || "请输入正确的URL格式"
      }
      break

    case "number":
      if (value && isNaN(Number(value))) {
        return message || "请输入正确的数字"
      }
      break

    case "min":
      if (min !== undefined) {
        if (typeof value === "string" && value.length < min) {
          return message || `至少输入${min}个字符`
        }
        if (typeof value === "number" && value < min) {
          return message || `数值不能小于${min}`
        }
        if (Array.isArray(value) && value.length < min) {
          return message || `至少选择${min}项`
        }
      }
      break

    case "max":
      if (max !== undefined) {
        if (typeof value === "string" && value.length > max) {
          return message || `最多输入${max}个字符`
        }
        if (typeof value === "number" && value > max) {
          return message || `数值不能大于${max}`
        }
        if (Array.isArray(value) && value.length > max) {
          return message || `最多选择${max}项`
        }
      }
      break

    case "pattern":
      if (value && pattern) {
        const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern
        if (!regex.test(value)) {
          return message || "格式不正确"
        }
      }
      break

    case "custom":
      if (validator) {
        try {
          await new Promise((resolve, reject) => {
            const callbackResult = validator(rule, value, (error?: string) => {
              if (error) {
                reject(error)
              } else {
                resolve(true)
              }
            })
            // 如果validator返回Promise
            if (callbackResult && typeof callbackResult.then === "function") {
              callbackResult.then(resolve).catch(reject)
            }
          })
        } catch (error) {
          return typeof error === "string" ? error : message || "验证失败"
        }
      }
      break
  }

  return undefined
}

/**
 * 验证整个表单
 */
export const validateForm = async (
  columns: ColumnSchema[],
  values: Record<string, any>,
  form: any
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  const errors: Record<string, string> = {}

  for (const column of columns) {
    // 跳过dependency类型的字段
    if (column.valueType === "dependency") {
      continue
    }

    const baseColumn = column as BaseColumnSchema

    // 只验证显示的字段
    if (!shouldShowField(baseColumn.condition, values)) {
      continue
    }

    const fieldValue = values[baseColumn.dataIndex]
    const fieldRules = getFieldRules(column, form)

    const error = await validateFieldValue(fieldValue, fieldRules, values)
    if (error) {
      errors[baseColumn.dataIndex] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 检查字段是否有依赖变化
 */
export const hasFieldDependencyChanged = (
  column: ColumnSchema,
  changedValues: Record<string, any>
): boolean => {
  if (column.valueType === "dependency") {
    return false
  }

  const baseColumn = column as BaseColumnSchema
  if (!baseColumn.dependencies) {
    return false
  }

  return baseColumn.dependencies.some((dep) => changedValues.hasOwnProperty(dep))
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * 深度克隆对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}
