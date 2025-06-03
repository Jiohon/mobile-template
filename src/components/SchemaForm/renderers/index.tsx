import React from "react"

import { Checkbox, DatePicker, Input, Radio, Rate, Selector, Slider, Switch } from "antd-mobile"

import { FieldRenderProps, schemaRenderer } from "../core"

// 文本输入渲染器
const TextRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any
  const inputType = (schema as any).valueType === "password" ? "password" : "text"

  return (
    <Input
      type={inputType}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      placeholder={schema.placeholder}
      maxLength={(schema as any).maxLength}
      {...fieldProps}
    />
  )
}

// 数字输入渲染器
const NumberRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any

  const handleChange = (val: string) => {
    const numValue = val === "" ? undefined : Number(val)
    onChange(numValue)
  }

  return (
    <Input
      type="number"
      value={value?.toString() || ""}
      onChange={handleChange}
      disabled={disabled}
      placeholder={schema.placeholder}
      {...fieldProps}
    />
  )
}

// 开关渲染器
const SwitchRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any

  return <Switch checked={Boolean(value)} onChange={onChange} disabled={disabled} {...fieldProps} />
}

// 选择器渲染器
const SelectRenderer: React.FC<FieldRenderProps> = ({
  schema,
  value,
  onChange,
  disabled,
  form,
}) => {
  const { fieldProps, options: staticOptions, valueEnum } = schema as any

  // 处理 valueEnum 格式的选项
  const processValueEnum = (enumData: any): any[] => {
    if (!enumData) return []

    return Object.entries(enumData).map(([key, option]: [string, any]) => {
      if (typeof option === "string") {
        return { label: option, value: key }
      } else if (option && typeof option === "object") {
        return {
          label: option.text || option.label || key,
          value: key,
          disabled: option.disabled,
        }
      }
      return { label: key, value: key }
    })
  }

  // 处理已有的 options 格式
  const processOptions = (options: any[]): any[] => {
    if (!Array.isArray(options)) return []

    return options.map((option) => {
      // 如果已经是正确格式，直接返回
      if (option && typeof option === "object" && "label" in option && "value" in option) {
        return option
      }
      // 如果是字符串，转换为正确格式
      if (typeof option === "string") {
        return { label: option, value: option }
      }
      // 其他格式尝试转换
      return {
        label: option?.text || option?.label || option?.value || option,
        value: option?.value || option,
        disabled: option?.disabled,
      }
    })
  }

  // 获取动态选项（同步方式）
  const getDynamicOptions = (): any[] => {
    if (schema.linkage?.options) {
      const currentValues = form?.getFieldsValue?.() || {}

      // 计算选项
      if (schema.linkage.options.compute) {
        try {
          return schema.linkage.options.compute(currentValues)
        } catch (error) {
          console.error("计算动态选项失败:", error)
          return []
        }
      }

      // 基于源字段的选项
      if (schema.linkage.options.sourceField) {
        const sourceValue = currentValues[schema.linkage.options.sourceField]
        let sourceOptions: any[] = []

        if (schema.linkage.options.transform) {
          try {
            sourceOptions = schema.linkage.options.transform(sourceValue, currentValues)
          } catch (error) {
            console.error("转换源字段选项失败:", error)
            return []
          }
        } else if (Array.isArray(sourceValue)) {
          sourceOptions = sourceValue
        }

        if (schema.linkage.options.filter) {
          try {
            sourceOptions = schema.linkage.options.filter(sourceOptions, currentValues)
          } catch (error) {
            console.error("过滤源字段选项失败:", error)
            return sourceOptions
          }
        }

        return sourceOptions
      }
    }

    return []
  }

  // 使用动态选项、静态选项或valueEnum选项，按优先级排序
  let finalOptions: any[] = []

  const dynamicOptions = getDynamicOptions()

  if (dynamicOptions.length > 0) {
    finalOptions = processOptions(dynamicOptions)
  } else if (staticOptions && Array.isArray(staticOptions)) {
    finalOptions = processOptions(staticOptions)
  } else if (valueEnum) {
    finalOptions = processValueEnum(valueEnum)
  }

  return (
    <Selector
      options={finalOptions}
      value={value}
      onChange={onChange}
      disabled={disabled}
      multiple={(schema as any).multiple}
      {...fieldProps}
    />
  )
}

// 单选框渲染器
const RadioRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps, options } = schema as any

  return (
    <Radio.Group value={value} onChange={onChange} disabled={disabled} {...fieldProps}>
      {(options || []).map((option: any) => (
        <Radio key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  )
}

// 复选框渲染器
const CheckboxRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps, options } = schema as any

  if (!options || options.length === 0) {
    // 单个复选框
    return (
      <Checkbox checked={Boolean(value)} onChange={onChange} disabled={disabled} {...fieldProps}>
        {schema.title}
      </Checkbox>
    )
  }

  // 复选框组
  return (
    <Checkbox.Group value={value || []} onChange={onChange} disabled={disabled} {...fieldProps}>
      {options.map((option: any) => (
        <Checkbox key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  )
}

// 日期选择器渲染器
const DateRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any
  const componentType = (schema as any).valueType || "date"

  const precision =
    componentType === "date" ? "day" : componentType === "time" ? "minute" : "minute"

  // 安全的日期值处理
  const getSafeValue = () => {
    if (!value) return undefined
    if (value instanceof Date) return value
    if (typeof value === "string") {
      const parsed = new Date(value)
      return isNaN(parsed.getTime()) ? undefined : parsed
    }
    return undefined
  }

  const getDisplayValue = () => {
    const safeValue = getSafeValue()
    if (!safeValue) return ""
    try {
      if (componentType === "date") {
        return safeValue.toLocaleDateString()
      } else if (componentType === "time") {
        return safeValue.toLocaleTimeString()
      } else {
        return safeValue.toLocaleString()
      }
    } catch {
      return ""
    }
  }

  return (
    <DatePicker
      value={getSafeValue()}
      onConfirm={(val: any) => onChange(val)}
      precision={precision}
      {...fieldProps}
    >
      {() => (
        <Input
          value={getDisplayValue()}
          placeholder={schema.placeholder || "请选择日期"}
          readOnly
          disabled={disabled}
        />
      )}
    </DatePicker>
  )
}

// 评分渲染器
const RateRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any

  return (
    <Rate
      value={value || 0}
      onChange={onChange}
      readOnly={disabled}
      count={(schema as any).count || 5}
      allowHalf={(schema as any).allowHalf}
      {...fieldProps}
    />
  )
}

// 滑块渲染器
const SliderRenderer: React.FC<FieldRenderProps> = ({ schema, value, onChange, disabled }) => {
  const { fieldProps } = schema as any

  const handleChange = (val: number | [number, number]) => {
    if (typeof val === "number") {
      onChange(val)
    }
  }

  return (
    <Slider
      value={value || 0}
      onChange={handleChange}
      disabled={disabled}
      min={(schema as any).min}
      max={(schema as any).max}
      step={(schema as any).step}
      marks={(schema as any).marks}
      {...fieldProps}
    />
  )
}

// 自定义渲染器
const CustomRenderer: React.FC<FieldRenderProps> = ({ schema, ...props }) => {
  const { render, renderFormItem } = schema as any

  if (renderFormItem) {
    return renderFormItem(schema, {}, props.form) || null
  }

  if (render) {
    return render(props) || null
  }

  return null
}

// 注册所有默认渲染器
export const registerDefaultRenderers = () => {
  schemaRenderer.register("text", TextRenderer)
  schemaRenderer.register("password", TextRenderer)
  schemaRenderer.register("email", TextRenderer)
  schemaRenderer.register("tel", TextRenderer)
  schemaRenderer.register("url", TextRenderer)
  schemaRenderer.register("number", NumberRenderer)
  schemaRenderer.register("digit", NumberRenderer)
  schemaRenderer.register("switch", SwitchRenderer)
  schemaRenderer.register("select", SelectRenderer)
  schemaRenderer.register("radio", RadioRenderer)
  schemaRenderer.register("checkbox", CheckboxRenderer)
  schemaRenderer.register("date", DateRenderer)
  schemaRenderer.register("time", DateRenderer)
  schemaRenderer.register("datetime", DateRenderer)
  schemaRenderer.register("dateTime", DateRenderer)
  schemaRenderer.register("rate", RateRenderer)
  schemaRenderer.register("slider", SliderRenderer)
  schemaRenderer.register("custom", CustomRenderer)
}

// 自动注册
registerDefaultRenderers()

export {
  TextRenderer,
  NumberRenderer,
  SwitchRenderer,
  SelectRenderer,
  RadioRenderer,
  CheckboxRenderer,
  DateRenderer,
  RateRenderer,
  SliderRenderer,
  CustomRenderer,
}
