import { useCallback, useImperativeHandle, useMemo, useState } from "react"

import { Button, Form } from "antd-mobile"
import classnames from "classnames"
import { cloneDeep } from "lodash"

import { createSchemaRenderer } from "./core"
import { registerDefaultRenderers } from "./core/registerRenderers"
import styles from "./index.module.less"
import {
  SchemaFormBaseColumnType,
  SchemaFormDependencyColumnType,
  SchemaFormErrorInfoType,
  SchemaFormInstance,
  SchemaFormProps,
  SchemaFormValuesType,
} from "./types"

const BetaSchemaForm = <TValues extends SchemaFormValuesType = SchemaFormValuesType>({
  columns = [],
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
}: SchemaFormProps<TValues>) => {
  // 使用 antd-mobile 的标准 Form.useForm
  const [internalForm] = Form.useForm()

  const [isValidating, setIsValidating] = useState(false)

  // 安全地扩展 form 实例以支持泛型方法
  const form = useMemo(() => {
    return externalForm || internalForm
  }, [externalForm, internalForm])

  // 创建渲染器实例并注册默认渲染器
  const schemaRenderer = useMemo(() => {
    const renderer = createSchemaRenderer<TValues>()
    registerDefaultRenderers(renderer)
    return renderer
  }, [])

  // 分离基础字段和依赖字段
  const baseColumns = useMemo(() => {
    return columns.filter((column) => column.componentType !== "dependency")
  }, [columns])

  const dependencyColumns = useMemo(() => {
    return columns.filter((column) => column.componentType === "dependency")
  }, [columns])

  // 使用 useImperativeHandle 暴露表单实例方法到 formRef
  useImperativeHandle(formRef, (): SchemaFormInstance => {
    return { ...form }
  }, [form])

  // 表单提交处理
  const handleSubmit = () => {
    setIsValidating(true)

    form
      .validateFields()
      .then((values: TValues) => {
        setIsValidating(false)
        onFinish?.(cloneDeep(values))
      })
      .catch((errorInfo: SchemaFormErrorInfoType<TValues>) => {
        setIsValidating(false)
        onFinishFailed?.(errorInfo)
      })
      .finally(() => {
        setIsValidating(false)
      })
  }

  // 处理表单值变化
  const handleValuesChange = useCallback(
    async (changedValues: Partial<TValues>, allValues: TValues) => {
      onValuesChange?.(changedValues, allValues)
    },
    [onValuesChange]
  )

  // 渲染单个表单字段
  const renderFormColumn = (column: SchemaFormBaseColumnType<TValues>, key: string) => {
    try {
      // 渲染字段元素
      const columnElement = schemaRenderer.render(column, form)
      if (!columnElement) {
        return null
      }

      // 从 column 中提取 Form.Item 属性，排除自定义的属性
      const { name, ...formItemProps } = column

      return (
        <Form.Item key={key} name={name} {...formItemProps}>
          {columnElement}
        </Form.Item>
      )
    } catch (error) {
      console.error(`❌ 渲染字段 ${String(column.name)} 时出错:`, error)
      return null
    }
  }

  // 渲染依赖字段组件
  const renderDependencyColumn = (
    depColumn: SchemaFormDependencyColumnType<TValues>,
    index: number
  ) => {
    return (
      <Form.Subscribe key={`dependency-${index}`} to={depColumn.to.map((columnName) => columnName)}>
        {(changedValues, _formInstance) => {
          const { children } = depColumn
          try {
            // 调用 children 函数生成动态字段
            const dependencyColumns = children(changedValues as Partial<TValues>, form)

            // 渲染动态字段
            return dependencyColumns.map((column, columnIndex) => {
              if (column.componentType === "dependency") {
                // 嵌套的依赖字段
                return renderDependencyColumn(column, columnIndex)
              } else {
                const key = `dependency-${index}-${columnIndex}-${String(column.name)}`
                return renderFormColumn(column, key)
              }
            })
          } catch (error) {
            console.error(`❌ 渲染依赖字段时出错:`, error)
            return null
          }
        }}
      </Form.Subscribe>
    )
  }

  return (
    <div className={classnames(styles.schemaForm, className)}>
      <Form
        form={form}
        className={classnames(className)}
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
        {/* 渲染基础字段 */}
        {baseColumns.map((column, index) => {
          const key = column.name ? String(column.name) : `column-${index}`
          return renderFormColumn(column, key)
        })}

        {/* 渲染依赖字段 */}
        {dependencyColumns.map((depColumn, index) => renderDependencyColumn(depColumn, index))}

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

export default BetaSchemaForm
