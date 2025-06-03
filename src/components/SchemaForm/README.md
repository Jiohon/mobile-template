# SchemaForm 组件

基于 antd-mobile 的动态表单组件，支持 ProComponents 风格的配置。

## 特性

- 🚀 **ProComponents 风格**：使用 `columns` 配置，支持 `valueType`、`valueEnum` 等
- 🔗 **强大的联动系统**：支持字段间的复杂联动关系  
- 📋 **动态字段生成**：通过 `dependency` 字段实现动态表单
- ✅ **完整的验证支持**：兼容 antd-mobile 的验证规则
- 🎯 **条件显示**：基于字段值的条件显示/隐藏
- 🔄 **向后兼容**：支持旧的 `schema` 格式
- 📱 **原生 Form 属性**：支持 antd-mobile Form 组件的所有原生属性

## 基础用法

```tsx
import { SchemaForm } from '@/components/SchemaForm'

const Demo = () => {
  const columns = [
    {
      dataIndex: 'name',
      title: '姓名',
      valueType: 'text',
      required: true,
    },
    {
      dataIndex: 'email', 
      title: '邮箱',
      valueType: 'text',
      rules: [{ type: 'email', message: '请输入有效的邮箱地址' }],
    },
  ]

  const handleFinish = (values) => {
    console.log('表单值：', values)
  }

  return (
    <SchemaForm
      columns={columns}
      onFinish={handleFinish}
      showSubmitButton
      submitButtonText="提交"
      // 支持所有 antd-mobile Form 的原生属性
      name="myForm"
      disabled={false}
      preserve={true}
      className="custom-form"
    />
  )
}
```

## API 属性

### SchemaForm Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| **基础配置** ||||
| columns | 表单字段配置（推荐） | `ColumnSchema[]` | `[]` |
| schema | 表单字段配置（兼容旧版） | `FieldSchema[]` | `[]` |
| **表单回调** ||||
| onFinish | 表单提交成功回调 | `(values) => void` | - |
| onFinishFailed | 表单提交失败回调 | `(errorInfo) => void` | - |
| onValuesChange | 表单值变化回调 | `(changed, all) => void` | - |
| **提交按钮** ||||
| showSubmitButton | 是否显示提交按钮 | `boolean` | `false` |
| submitButtonText | 提交按钮文本 | `string` | `'提交'` |
| submitButtonProps | 提交按钮属性 | `object` | `{}` |
| **Form 原生属性** ||||
| name | 表单名称，字段 id 的前缀 | `string` | - |
| disabled | 禁用整个表单 | `boolean` | `false` |
| preserve | 字段被删除时保留字段值 | `boolean` | `true` |
| validateMessages | 验证提示模板 | `object` | - |
| validateTrigger | 字段校验时机 | `string \| string[]` | - |
| onFieldsChange | 字段更新时的回调 | `(changedFields, allFields) => void` | - |
| form | Form 实例 | `FormInstance` | - |
| className | 表单样式类名 | `string` | - |
| style | 表单样式 | `CSSProperties` | - |
| initialValues | 表单初始值 | `object` | `{}` |
| **引用** ||||
| formRef | 表单实例引用 | `React.RefObject` | - |

### 表单属性扩展说明

SchemaForm 组件完全兼容 antd-mobile Form 组件的所有原生属性，你可以像使用原生 Form 一样传递这些属性：

```tsx
<SchemaForm
  columns={columns}
  // antd-mobile Form 原生属性
  name="userForm"
  disabled={false}
  preserve={true}
  validateTrigger="onBlur"
  validateMessages={{
    required: '${label} 是必填项！',
    types: {
      email: '${label} 不是有效的邮箱地址！',
    },
  }}
  onFieldsChange={(changedFields, allFields) => {
    console.log('字段变化：', changedFields)
  }}
  className="my-custom-form"
  style={{ padding: '20px' }}
  onFinish={(values) => {
    console.log('提交值：', values)
  }}
  onFinishFailed={(errorInfo) => {
    console.error('提交失败：', errorInfo)
  }}
/>
```

这种设计让 SchemaForm 具有最大的灵活性，既可以享受动态表单配置的便利，又不失去原生 Form 组件的完整功能。

## 特性

- 🎯 **Schema 驱动**: 通过 JSON 配置快速生成表单
- 🔧 **丰富组件**: 支持文本、数字、选择、开关、日期等多种字段类型
- 🎭 **条件显示**: 支持字段间的条件依赖和动态显示隐藏
- ✅ **表单验证**: 内置多种验证规则，支持自定义验证函数
- 📱 **移动优先**: 基于 antd-mobile v5，完美适配移动端
- 🎨 **主题定制**: 支持自定义样式和主题
- 🔄 **实时响应**: 支持表单值实时变化监听
- 🚀 **ProComponents 风格**: 支持类似 ProTable 的配置方式，包括 dependencies、valueEnum、formItemProps 等

## 快速开始 (ProComponents 风格)

```tsx
import React from 'react'
import { SchemaForm, ColumnSchema } from '@/components/SchemaForm'

const valueEnum = {
  open: { text: '开放', status: 'Success' },
  closed: { text: '关闭', status: 'Error' },
}

const Demo: React.FC = () => {
  const columns: ColumnSchema[] = [
    {
      title: '标题',
      dataIndex: 'title',
      initialValue: '必填',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '状态',
      dataIndex: 'state', 
      valueType: 'select',
      valueEnum,
      fieldProps: (form) => ({
        disabled: form.getFieldValue('title') === 'disabled',
        placeholder: form.getFieldValue('title') === 'disabled' ? 'disabled' : 'normal',
      }),
    },
    {
      title: '标签',
      dataIndex: 'labels',
      dependencies: ['title'],
      formItemProps: (form) => ({
        rules: form.getFieldValue('title') === '必填' ? [{ required: true }] : [],
      }),
    },
  ]

  return (
    <SchemaForm
      columns={columns}
      onFinish={(values) => console.log(values)}
    />
  )
}
```

## 基础用法 (传统方式)

```tsx
import React from 'react'
import { SchemaForm } from '@/components/SchemaForm'
import { FieldSchema } from '@/components/SchemaForm/types'

const Demo: React.FC = () => {
  const schema: FieldSchema[] = [
    {
      name: 'username',
      label: '用户名',
      componentType: 'text',
      placeholder: '请输入用户名',
      required: true,
      rules: [
        { type: 'required', message: '用户名不能为空' },
        { type: 'min', value: 3, message: '用户名至少3个字符' }
      ]
    },
  ]

  return (
    <SchemaForm
      schema={schema}  // 传统方式使用 schema
      onFinish={(values) => console.log(values)}
    />
  )
}
```

## 支持的字段类型 (valueType)

### 基础输入

- `text` - 文本输入框 (默认)
- `password` - 密码输入框  
- `email` - 邮箱输入框
- `tel` - 电话输入框
- `url` - 网址输入框
- `number` / `digit` - 数字输入框
- `textarea` - 多行文本框

### 选择类

- `select` - 下拉选择器
- `radio` - 单选框组
- `checkbox` - 复选框/复选框组
- `cascader` - 级联选择器

### 交互类

- `switch` - 开关
- `slider` - 滑动条
- `rate` - 评分

### 日期时间

- `date` - 日期选择器
- `time` - 时间选择器
- `datetime` / `dateTime` - 日期时间选择器

### 文件上传

- `image` - 图片上传

### 特殊类型

- `dependency` - 依赖字段（动态显示其他字段）
- `custom` - 自定义组件

## ProComponents 核心特性

### 1. ValueEnum 支持

使用 `valueEnum` 定义选项，支持状态标识：

```tsx
const columns: ColumnSchema[] = [
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      draft: { text: '草稿', status: 'Default' },
      published: { text: '已发布', status: 'Success' },
      archived: { text: '已归档', status: 'Warning' },
    },
  },
]
```

### 2. 动态属性 (fieldProps & formItemProps)

支持函数形式的动态属性配置：

```tsx
const columns: ColumnSchema[] = [
  {
    title: '确认密码',
    dataIndex: 'confirmPassword',
    valueType: 'password',
    fieldProps: (form) => ({
      placeholder: '请再次输入密码',
      disabled: !form.getFieldValue('password'),
    }),
    formItemProps: (form) => ({
      rules: [
        {
          required: true,
          message: '请确认密码',
        },
        {
          validator: (rule, value) => {
            if (value !== form.getFieldValue('password')) {
              return Promise.reject('两次密码不一致')
            }
            return Promise.resolve()
          },
        },
      ],
    }),
  },
]
```

### 3. 字段依赖 (dependencies)

声明字段间的依赖关系：

```tsx
const columns: ColumnSchema[] = [
  {
    title: '用户类型',
    dataIndex: 'userType',
    valueType: 'select',
    valueEnum: {
      normal: '普通用户',
      vip: 'VIP用户',
    },
  },
  {
    title: 'VIP等级',
    dataIndex: 'vipLevel',
    valueType: 'select',
    dependencies: ['userType'], // 依赖 userType 字段
    valueEnum: {
      silver: '银卡',
      gold: '金卡',
      diamond: '钻石卡',
    },
    formItemProps: (form) => ({
      // 只有VIP用户才显示此字段
      style: { 
        display: form.getFieldValue('userType') === 'vip' ? 'block' : 'none' 
      },
    }),
  },
]
```

### 4. 依赖字段 (dependency)

使用 `dependency` 类型动态渲染字段：

```tsx
const columns: ColumnSchema[] = [
  {
    title: '是否有经验',
    dataIndex: 'hasExperience',
    valueType: 'switch',
  },
  {
    valueType: 'dependency',
    name: ['hasExperience'], // 监听的字段
    columns: ({ hasExperience }) => {
      // 根据条件返回不同的字段配置
      return hasExperience ? [
        {
          title: '工作年限',
          dataIndex: 'workYears',
          valueType: 'digit',
          min: 0,
          max: 50,
        },
        {
          title: '技能描述',
          dataIndex: 'skills',
          valueType: 'textarea',
          placeholder: '请描述您的技能',
        },
      ] : []
    },
  },
]
```

### 5. 自定义渲染 (renderFormItem)

支持完全自定义的字段渲染：

```tsx
import { Input } from 'antd-mobile'

const columns: ColumnSchema[] = [
  {
    title: '自定义输入',
    dataIndex: 'custom',
    renderFormItem: (schema, config, form) => {
      return (
        <Input
          placeholder="这是自定义渲染的输入框"
          prefix="$"
          suffix="元"
          onChange={(value) => form.setFieldValue('custom', value)}
        />
      )
    },
  },
]
```

## 表单验证增强

### 支持多种验证规则写法

```tsx
const columns: ColumnSchema[] = [
  {
    title: '邮箱',
    dataIndex: 'email',
    valueType: 'email',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { type: 'email', message: '邮箱格式不正确' },
    ],
  },
  {
    title: '手机号',
    dataIndex: 'phone', 
    valueType: 'tel',
    formItemProps: {
      rules: [
        { required: true },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
      ],
    },
  },
]
```

## API

### SchemaForm Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `ColumnSchema[]` | - | 表单字段配置 (新) |
| schema | `FieldSchema[]` | - | 表单字段配置 (兼容) |
| initialValues | `Record<string, any>` | - | 表单初始值 |
| onValuesChange | `(changedValues, allValues) => void` | - | 表单值变化回调 |
| onFinish | `(values) => void` | - | 表单提交回调 |
| onFinishFailed | `(errorInfo) => void` | - | 表单验证失败回调 |
| showSubmitButton | `boolean` | `true` | 是否显示提交按钮 |
| submitButtonText | `string` | `'提交'` | 提交按钮文本 |
| submitButtonProps | `object` | - | 提交按钮属性 |
| layout | `'horizontal' \| 'vertical'` | `'vertical'` | 表单布局 |
| className | `string` | - | 表单样式类名 |
| disabled | `boolean` | `false` | 是否禁用整个表单 |
| formRef | `React.RefObject<any>` | - | 表单实例引用 |

### ColumnSchema (ProComponents风格)

```typescript
interface BaseColumnSchema {
  title: string                    // 列标题
  dataIndex: string                // 数据字段名
  valueType?: string               // 字段类型
  tooltip?: string                 // 字段描述
  required?: boolean               // 是否必填
  initialValue?: any               // 初始值
  disabled?: boolean               // 是否禁用
  placeholder?: string             // 占位符
  width?: 's' | 'm' | 'l' | 'xl'   // 宽度
  dependencies?: string[]          // 字段依赖
  condition?: FieldCondition       // 显示条件
  rules?: ValidationRule[]         // 验证规则
  formItemProps?: FormItemPropsFunction | object  // 动态表单项属性
  fieldProps?: FieldPropsFunction | object        // 动态字段属性
  renderFormItem?: (schema, config, form) => ReactNode  // 自定义渲染
  valueEnum?: ValueEnum            // 选项枚举
  options?: SelectOption[]         // 选项数组
}
```

### 表单实例方法

通过 `formRef` 可以访问表单实例，现在具有完整的 TypeScript 类型支持：

```tsx
import { useRef } from 'react'
import { SchemaFormInstance } from '@/components/SchemaForm/types'

const formRef = useRef<SchemaFormInstance>(null!)

// 获取字段值 - 具有类型提示
const value = formRef.current?.getFieldValue('fieldName')

// 获取所有字段值 - 具有类型提示
const values = formRef.current?.getFieldsValue()

// 设置字段值 - 会自动触发 dependency 字段更新
formRef.current?.setFieldValue('fieldName', 'value')

// 设置多个字段值 - 会自动触发 dependency 字段更新
formRef.current?.setFieldsValue({
  field1: 'value1',
  field2: 'value2',
})

// 手动触发 dependency 字段更新（通常不需要，setFieldsValue 会自动触发）
formRef.current?.triggerDependencyUpdate()

// 验证表单
try {
  const values = await formRef.current?.validateFields()
  console.log('验证通过:', values)
} catch (error) {
  console.log('验证失败:', error)
}

// 重置表单 - 会清空所有值并重新计算 dependency 字段
formRef.current?.resetFields()
```

### SchemaFormInstance 类型定义

```typescript
interface SchemaFormInstance {
  getFieldValue: (name: string) => any
  getFieldsValue: () => Record<string, any>
  setFieldValue: (name: string, value: any) => void
  setFieldsValue: (values: Record<string, any>) => void
  validateFields: () => Promise<Record<string, any>>
  resetFields: () => void
  submit: () => void
  linkageEngine: any
  clearLinkageCache: () => void
  triggerDependencyUpdate: () => void  // 手动触发依赖字段更新
}
```

## 高级用法

### 复杂的条件显示

```tsx
const columns: ColumnSchema[] = [
  {
    title: '用户角色',
    dataIndex: 'role',
    valueType: 'radio',
    valueEnum: {
      admin: '管理员',
      user: '普通用户',
      guest: '访客',
    },
  },
  {
    valueType: 'dependency',
    name: ['role'],
    columns: ({ role }) => {
      const fields = []
      
      if (role === 'admin') {
        fields.push({
          title: '管理权限',
          dataIndex: 'permissions',
          valueType: 'checkbox',
          valueEnum: {
            user_manage: '用户管理',
            system_config: '系统配置',
            data_export: '数据导出',
          },
        })
      }
      
      if (role !== 'guest') {
        fields.push({
          title: '个人简介',
          dataIndex: 'bio',
          valueType: 'textarea',
          placeholder: '请输入个人简介',
        })
      }
      
      return fields
    },
  },
]
```

### 动态表单配置

```tsx
const [columns, setColumns] = useState<ColumnSchema[]>(initialColumns)

// 根据业务逻辑动态修改配置
const addField = () => {
  setColumns(prev => [
    ...prev,
    {
      title: '动态字段',
      dataIndex: `dynamic_${Date.now()}`,
      valueType: 'text',
      placeholder: '这是动态添加的字段',
    }
  ])
}
```

## 迁移指南

### 从传统 schema 迁移到 columns

```tsx
// 旧写法 (仍然支持)
const schema: FieldSchema[] = [
  {
    name: 'username',           // 字段名
    label: '用户名',            // 标签
    componentType: 'text',      // 组件类型
    defaultValue: '',           // 默认值
    description: '输入用户名',   // 描述
  }
]

// 新写法 (推荐)
const columns: ColumnSchema[] = [
  {
    dataIndex: 'username',      // 字段名
    title: '用户名',            // 标题  
    valueType: 'text',          // 字段类型
    initialValue: '',           // 初始值
    tooltip: '输入用户名',       // 提示
  }
]
```

## 完整示例

查看 `src/components/SchemaForm/example.tsx` 获取完整的使用示例。

## 注意事项

1. **字段名称唯一性**: 确保每个字段的 `dataIndex` 属性唯一
2. **依赖字段顺序**: 设置 dependencies 时，被依赖的字段必须在当前字段之前定义
3. **动态属性性能**: formItemProps 和 fieldProps 函数会在每次渲染时调用，避免复杂计算
4. **类型兼容性**: 支持传统的 schema 配置，可以逐步迁移
5. **表单实例**: 使用 formRef 可以获得完整的表单控制能力

## 更新日志

### v2.0.0 (ProComponents 支持)
- ✨ 新增 ProComponents 风格配置支持
- ✨ 支持 valueEnum、dependencies、formItemProps、fieldProps
- ✨ 新增 dependency 字段类型，支持动态字段渲染
- ✨ 支持 renderFormItem 自定义渲染
- ✨ 新增表单实例方法 (formRef)
- 🔄 保持向后兼容，支持传统 schema 配置

### v1.0.0
- 基础功能实现
- 支持常用字段类型
- 条件显示功能
- 表单验证功能 