import React, { useCallback, useEffect, useMemo, useState } from "react"

import { Button, Form } from "antd-mobile"
import classnames from "classnames"

import { createRenderConfig, schemaRenderer } from "./core"
import { LinkageEngine } from "./linkage"
import { registerDefaultRenderers } from "./renderers"
import { BaseColumnSchema, ColumnSchema, SchemaFormInstance, SchemaFormProps } from "./types"
import { deepClone } from "./utils"

// 确保渲染器已注册
registerDefaultRenderers()

const SchemaForm: React.FC<SchemaFormProps> = ({
  columns = [],
  schema = [],
  initialValues = {},
  onValuesChange,
  onFinish,
  onFinishFailed,
  showSubmitButton = false,
  submitButtonText = "提交",
  submitButtonProps = {},
  formRef,
  // 从 props 中提取 antd-mobile Form 的原生属性
  name,
  disabled = false,
  preserve,
  validateMessages,
  validateTrigger,
  onFieldsChange,
  form: externalForm,
  className,
  style,
  ...restProps
}) => {
  // 使用 antd-mobile 的标准 Form.useForm
  const [internalForm] = Form.useForm()
  const form = externalForm || internalForm
  const [isValidating, setIsValidating] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [dependencyUpdateTrigger, setDependencyUpdateTrigger] = useState(0)

  // 确定最终使用的列配置（向后兼容）
  const finalColumns: ColumnSchema[] = useMemo(() => {
    if (columns && columns.length > 0) {
      return columns
    }
    if (schema && schema.length > 0) {
      // 将旧的 schema 格式转换为新的 columns 格式
      return schema.map((item: any) => ({
        title: item.title || item.label || item.name,
        dataIndex: item.dataIndex || item.name,
        valueType: (item.valueType || item.type || item.componentType || "text") as any,
        placeholder: item.placeholder,
        required: item.required,
        disabled: item.disabled,
        condition: item.condition,
        formItemProps: item.formItemProps,
        fieldProps: item.fieldProps,
        rules: item.rules,
        linkage: item.linkage, // 新增联动配置
        // dependency 字段支持
        name: item.name,
        columns: item.columns,
      }))
    }
    return []
  }, [columns, schema])

  // 分离基础字段和依赖字段
  const baseColumns = useMemo(() => {
    return finalColumns.filter((column) => column.valueType !== "dependency") as BaseColumnSchema[]
  }, [finalColumns])

  const dependencyColumns = useMemo(() => {
    return finalColumns.filter((column) => column.valueType === "dependency") as any[]
  }, [finalColumns])

  // 计算依赖字段产生的动态字段
  const computedDependencyFields = useMemo(() => {
    const dynamicFields: BaseColumnSchema[] = []

    dependencyColumns.forEach((depColumn) => {
      if (depColumn.columns && typeof depColumn.columns === "function") {
        try {
          // 获取依赖字段的值
          const dependencyValues: Record<string, any> = {}
          if (depColumn.name && Array.isArray(depColumn.name)) {
            depColumn.name.forEach((fieldName: string) => {
              dependencyValues[fieldName] = formValues[fieldName]
            })
          }

          // 调用 columns 函数生成动态字段
          const generatedColumns = depColumn.columns(dependencyValues)
          if (Array.isArray(generatedColumns)) {
            dynamicFields.push(
              ...(generatedColumns.filter(
                (col) => col.valueType !== "dependency"
              ) as BaseColumnSchema[])
            )
          }
        } catch (error) {
          console.error("计算依赖字段失败:", error)
        }
      }
    })

    return dynamicFields
  }, [dependencyColumns, formValues, dependencyUpdateTrigger])

  // 合并基础字段和动态字段
  const allRenderColumns = useMemo(() => {
    return [...baseColumns, ...computedDependencyFields]
  }, [baseColumns, computedDependencyFields])

  // 创建联动引擎 - 使用所有字段
  const linkageEngine = useMemo(() => {
    return new LinkageEngine(allRenderColumns)
  }, [allRenderColumns])

  // 暴露表单实例给父组件
  useEffect(() => {
    // 延迟设置 formRef，确保 Form 组件已经挂载
    const timer = setTimeout(() => {
      if (formRef && form) {
        const formInstance: SchemaFormInstance = {
          getFieldsValue: () => form?.getFieldsValue() || {},
          setFieldsValue: (values: Record<string, any>) => {
            if (form) {
              form.setFieldsValue(values)
              // 手动更新 formValues 状态以触发 dependency 字段更新
              setFormValues((prev) => ({ ...prev, ...values }))
              // 触发 dependency 重新计算
              setDependencyUpdateTrigger((prev) => prev + 1)
            }
          },
          validateFields: () => form?.validateFields() || Promise.resolve({}),
          resetFields: () => {
            if (form) {
              form.resetFields()
              setFormValues({})
              setDependencyUpdateTrigger((prev) => prev + 1)
            }
          },
          submit: () => form?.submit(),
          getFieldValue: (name: string) => form?.getFieldValue(name),
          setFieldValue: (name: string, value: any) => {
            if (form) {
              form.setFieldValue(name, value)
              // 手动更新单个字段的状态
              setFormValues((prev) => ({ ...prev, [name]: value }))
              setDependencyUpdateTrigger((prev) => prev + 1)
            }
          },
          // 新增联动相关方法
          linkageEngine,
          clearLinkageCache: () => linkageEngine.clearCache(),
          triggerDependencyUpdate: () => {
            const currentValues = form?.getFieldsValue() || {}
            setFormValues(currentValues)
            setDependencyUpdateTrigger((prev) => prev + 1)
          },
        }

        if (typeof formRef === "function") {
          ;(formRef as any)(formInstance)
        } else if (formRef && typeof formRef === "object" && "current" in formRef) {
          const ref = formRef as React.MutableRefObject<SchemaFormInstance>
          ref.current = formInstance
        }
      }
    }, 0) // 使用 setTimeout 0 来延迟到下一个事件循环

    return () => {
      clearTimeout(timer)
    }
  }, [form, formRef, linkageEngine])

  // 表单提交处理
  const handleSubmit = () => {
    setIsValidating(true)

    form
      .validateFields()
      .then((values: Record<string, any>) => {
        setIsValidating(false)
        onFinish?.(deepClone(values))
      })
      .catch((errorInfo: any) => {
        setIsValidating(false)
        onFinishFailed?.(errorInfo)
      })
  }

  // 处理表单值变化
  const handleValuesChange = useCallback(
    async (changedValues: Record<string, any>, allValues: Record<string, any>) => {
      // 更新表单值状态，用于 dependency 字段计算
      setFormValues(allValues)

      // 执行联动效果
      const changedFields = Object.keys(changedValues)
      for (const fieldName of changedFields) {
        await linkageEngine.executeEffects(fieldName, allValues, form)
      }

      onValuesChange?.(changedValues, allValues)
    },
    [onValuesChange, linkageEngine, form]
  )

  // 初始化表单值
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues)
    }
  }, [initialValues])

  // 计算字段的依赖关系
  const computeFieldDependencies = (column: BaseColumnSchema) => {
    const dependencies = linkageEngine.getDependencies(column.dataIndex)
    const isDynamicField = computedDependencyFields.some(
      (field) => field.dataIndex === column.dataIndex
    )

    // 只对动态字段添加dependency字段的依赖
    const dependencyFieldNames = isDynamicField
      ? dependencyColumns.reduce((deps: string[], depCol) => {
          if (depCol.name && Array.isArray(depCol.name)) {
            deps.push(...depCol.name)
          }
          return deps
        }, [])
      : []

    const allDependencies = [
      ...dependencies,
      ...(column.condition ? [column.condition.field] : []),
      ...(column.linkage?.dependencies || []),
      ...dependencyFieldNames,
    ].filter(Boolean)

    return { dependencies, isDynamicField, dependencyFieldNames, allDependencies }
  }

  // 处理动态属性
  const computeFieldProps = (column: BaseColumnSchema, currentValues: Record<string, any>) => {
    const baseFormItemProps =
      typeof column.formItemProps === "function"
        ? column.formItemProps(currentValues)
        : column.formItemProps || {}

    const baseFieldProps =
      typeof column.fieldProps === "function"
        ? column.fieldProps(currentValues)
        : column.fieldProps || {}

    const linkageProps = linkageEngine.computeProps(column, currentValues)

    return {
      finalFormItemProps: { ...baseFormItemProps, ...linkageProps },
      finalFieldProps: { ...baseFieldProps },
      linkageProps,
    }
  }

  // 计算验证规则
  const computeValidationRules = (
    column: BaseColumnSchema,
    currentValues: Record<string, any>,
    formItemProps: any
  ) => {
    const baseRules = formItemProps.rules || column.rules || []
    const linkageRules = linkageEngine.computeRules(column, currentValues)
    const allRules = [...baseRules, ...linkageRules]

    return allRules
      .map((rule: any) => ({
        required: rule.required,
        message: rule.message,
        pattern: typeof rule.pattern === "string" ? new RegExp(rule.pattern) : rule.pattern,
        min: rule.min,
        max: rule.max,
        validator: rule.validator,
        len: rule.len,
        type: rule.type,
        whitespace: rule.whitespace,
      }))
      .filter((rule: any) => Object.keys(rule).some((key) => rule[key] !== undefined))
  }

  // 渲染字段组件
  const renderFieldElement = (
    column: BaseColumnSchema,
    currentValues: Record<string, any>,
    fieldProps: any
  ) => {
    const renderConfig = createRenderConfig(column, form)
    if (!renderConfig) return null

    return schemaRenderer.render({
      schema: renderConfig,
      value: currentValues[column.dataIndex],
      onChange: (value: any) => {
        const computedValue = linkageEngine.computeValue(column, currentValues, value)
        form.setFieldValue(column.dataIndex, computedValue)
      },
      form,
      disabled: disabled || column.disabled || fieldProps.disabled,
      ...fieldProps,
    })
  }

  // 渲染单个表单字段的函数（简化版）
  function renderFormField(
    column: BaseColumnSchema,
    currentValues: Record<string, any>,
    key: string
  ) {
    try {
      // 计算属性
      const { finalFormItemProps, finalFieldProps, linkageProps } = computeFieldProps(
        column,
        currentValues
      )

      // 渲染字段元素
      const fieldElement = renderFieldElement(column, currentValues, finalFieldProps)
      if (!fieldElement) {
        return null
      }

      // 计算验证规则
      const validationRules = computeValidationRules(column, currentValues, finalFormItemProps)

      return (
        <Form.Item
          key={key}
          name={column.dataIndex}
          label={linkageProps.title || column.title}
          required={
            linkageProps.required !== undefined
              ? linkageProps.required
              : column.required || finalFormItemProps.required
          }
          rules={validationRules}
          help={linkageProps.help || column.tooltip || finalFormItemProps.help}
          extra={finalFormItemProps.extra}
          {...finalFormItemProps}
        >
          {fieldElement}
        </Form.Item>
      )
    } catch (error) {
      console.error(`❌ 渲染字段 ${column.dataIndex} 时出错:`, error)
      return null
    }
  }

  return (
    <div className={classnames("schema-form", className)}>
      <Form
        form={form}
        className={classnames("schema-form", className)}
        disabled={disabled}
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name={name}
        preserve={preserve}
        validateMessages={validateMessages}
        validateTrigger={validateTrigger}
        onFieldsChange={onFieldsChange}
        style={style}
        {...restProps}
      >
        {allRenderColumns.map((column, index) => {
          // 获取字段依赖
          const { isDynamicField, allDependencies } = computeFieldDependencies(column)

          // 生成唯一的 key
          const key = column.dataIndex ? String(column.dataIndex) : `column-${index}`

          if (isDynamicField) {
            // 依赖字段使用 shouldUpdate 模式
            return (
              <Form.Item
                key={key}
                noStyle
                shouldUpdate={(prevValues, currentValues) => {
                  return allDependencies.some((dep) => {
                    const prevValue = prevValues[dep]
                    const currentValue = currentValues[dep]
                    return prevValue !== currentValue
                  })
                }}
              >
                {({ getFieldsValue }) => {
                  const currentValues = getFieldsValue()

                  return renderFormField(column, currentValues, key)
                }}
              </Form.Item>
            )
          } else {
            // 普通字段使用空依赖数组，确保可以使用 render props
            return (
              <Form.Item key={key} noStyle dependencies={[]}>
                {({ getFieldsValue }) => {
                  const currentValues = getFieldsValue()

                  return renderFormField(column, currentValues, key)
                }}
              </Form.Item>
            )
          }
        })}

        {showSubmitButton && (
          <Form.Item>
            <Button
              color="primary"
              onClick={handleSubmit}
              loading={isValidating}
              disabled={disabled}
              {...submitButtonProps}
            >
              {submitButtonText}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  )
}

export default SchemaForm
