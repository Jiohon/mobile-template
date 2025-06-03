import React, { useRef } from "react"

import { Button, Card, Toast } from "antd-mobile"

import { SchemaForm } from "@/components/SchemaForm"
import { ColumnSchema, SchemaFormInstance } from "@/components/SchemaForm/types"

// 完整功能测试配置
const fullFeatureColumns: ColumnSchema[] = [
  {
    title: "用户名",
    dataIndex: "username",
    valueType: "text",
    placeholder: "请输入用户名",
    required: true,
  },
  {
    title: "用户类型",
    dataIndex: "userType",
    valueType: "select",
    placeholder: "请选择用户类型",
    valueEnum: {
      normal: {
        text: "普通用户",
        status: "default",
      },
      vip: {
        text: "VIP用户",
        status: "success",
      },
      admin: {
        text: "管理员",
        status: "warning",
      },
    },
    required: true,
  },
  {
    title: "标题",
    dataIndex: "title",
    valueType: "text",
    placeholder: "请输入标题",
    required: true,
    initialValue: "默认标题",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "此项为必填项",
        },
      ],
    },
  },

  // dependency 字段 - 根据标题动态生成字段
  {
    valueType: "dependency",
    name: ["title"],
    columns: ({ title }) => {
      console.log("dependency title 变化:", title)
      return title !== "hidden"
        ? [
            {
              title: "动态生成的文本字段",
              dataIndex: "dynamicText",
              valueType: "text",
              placeholder: "这是动态生成的文本字段",
              required: true,
            },
            {
              title: "动态生成的日期字段",
              dataIndex: "dynamicDate",
              valueType: "date",
              placeholder: "选择日期",
              required: true,
            },
            {
              title: "动态生成的选择字段",
              dataIndex: "dynamicSelect",
              valueType: "select",
              placeholder: "请选择",
              valueEnum: {
                option1: { text: "选项1" },
                option2: { text: "选项2" },
                option3: { text: "选项3" },
              },
            },
          ]
        : []
    },
  },
]

const SchemaFormDemo: React.FC = () => {
  const formRef = useRef<SchemaFormInstance>(null!)

  const handleFinish = (values: Record<string, any>) => {
    console.log("表单提交:", values)
    Toast.show({
      content: `提交成功！`,
      duration: 2000,
    })
  }

  const handleFinishFailed = (errorInfo: any) => {
    console.log("表单验证失败:", errorInfo)
    Toast.show({
      content: "表单验证失败，请检查输入",
      duration: 2000,
    })
  }

  const handleValuesChange = (
    changedValues: Record<string, any>,
    allValues: Record<string, any>
  ) => {
    console.log("🔗 表单值变化:", changedValues, "所有值:", allValues)
  }

  // 演示表单方法
  const handleReset = () => {
    formRef.current?.resetFields()
    Toast.show("表单已重置")
  }

  const handleFillDemo = () => {
    formRef.current?.setFieldsValue({
      username: "demo_user",
      userType: "vip",
    })
    Toast.show("已填入演示数据")
  }

  const handleValidate = () => {
    formRef.current
      ?.validateFields()
      .then(() => {
        Toast.show({
          content: "验证通过",
          duration: 2000,
        })
      })
      .catch(() => {
        Toast.show({
          content: "验证失败",
          duration: 2000,
        })
      })
  }

  const handleSubmit = () => {
    formRef.current?.submit()
  }

  // 测试dependency功能的按钮
  const handleTestDependency = () => {
    formRef.current?.setFieldsValue({
      title: "普通标题", // 不包含hidden，应该显示dependency字段
    })
    // 手动触发依赖更新（setFieldsValue 已经会自动触发了，但为了展示API）
    formRef.current?.triggerDependencyUpdate()
    Toast.show("已设置为普通标题，dependency字段应该显示")
  }

  const handleHideDependency = () => {
    formRef.current?.setFieldsValue({
      title: "hidden", // 包含hidden，应该隐藏dependency字段
    })
    // 手动触发依赖更新
    formRef.current?.triggerDependencyUpdate()
    Toast.show("已设置title为hidden，dependency字段应该隐藏")
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Schema Form 演示</h1>

      {/* Dependency 功能说明 */}
      <Card title="🔗 Dependency 字段功能说明" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "#666" }}>
          <h3>Dependency 字段特性：</h3>
          <ul>
            <li>
              <strong>动态字段生成</strong>：根据依赖字段值动态生成新字段
            </li>
            <li>
              <strong>条件渲染</strong>：支持复杂的条件判断逻辑
            </li>
            <li>
              <strong>实时更新</strong>：依赖字段变化时立即重新计算
            </li>
            <li>
              <strong>多种字段类型</strong>：支持生成各种类型的表单字段
            </li>
            <li>
              <strong>自定义渲染</strong>：支持通过 renderFormItem 自定义字段渲染
            </li>
          </ul>

          <h3>📋 当前示例说明：</h3>
          <p>本示例中有一个 dependency 字段依赖于 "标题" 字段：</p>
          <ul>
            <li>当标题不等于 "hidden" 时，会显示 3 个动态生成的字段</li>
            <li>当标题等于 "hidden" 时，动态字段会被隐藏</li>
            <li>可以通过下方的测试按钮快速切换状态</li>
          </ul>
        </div>
      </Card>

      <Card title="表单配置" style={{ marginBottom: 16 }}>
        <p>支持 ProComponents 风格的 columns 配置，包含验证规则、条件显示、动态属性等功能</p>
        {/* 表单操作按钮 */}
        <h3>📋 完整功能表单</h3>
        <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleReset} style={{ padding: "4px 8px", fontSize: "12px" }}>
            重置表单
          </button>
          <button onClick={handleFillDemo} style={{ padding: "4px 8px", fontSize: "12px" }}>
            填入演示数据
          </button>
          <button onClick={handleValidate} style={{ padding: "4px 8px", fontSize: "12px" }}>
            验证表单
          </button>
          <button onClick={handleTestDependency} style={{ padding: "4px 8px", fontSize: "12px" }}>
            测试dependency功能
          </button>
          <button onClick={handleHideDependency} style={{ padding: "4px 8px", fontSize: "12px" }}>
            隐藏dependency字段
          </button>
        </div>

        <SchemaForm
          columns={fullFeatureColumns}
          formRef={formRef}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          onValuesChange={handleValuesChange}
          initialValues={{
            username: "admin",
            userType: "normal",
          }}
        />
        <Button color="primary" onClick={handleSubmit}>
          提交
        </Button>
      </Card>

      {/* 新增：Form 属性扩展演示 */}
      <Card title="📱 Form 属性扩展演示" style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
          <h3>支持的 antd-mobile Form 原生属性：</h3>
          <ul>
            <li>
              <strong>name</strong>: 表单名称，作为字段 id 的前缀
            </li>
            <li>
              <strong>disabled</strong>: 禁用整个表单
            </li>
            <li>
              <strong>preserve</strong>: 字段被删除时保留字段值
            </li>
            <li>
              <strong>validateMessages</strong>: 自定义验证提示模板
            </li>
            <li>
              <strong>validateTrigger</strong>: 设置字段校验时机
            </li>
            <li>
              <strong>onFieldsChange</strong>: 字段更新时的回调
            </li>
            <li>
              <strong>className</strong> / <strong>style</strong>: 自定义样式
            </li>
          </ul>
        </div>

        <SchemaForm
          columns={[
            {
              title: "用户名",
              dataIndex: "demo_username",
              valueType: "text",
              placeholder: "请输入用户名",
              required: true,
            },
            {
              title: "邮箱",
              dataIndex: "demo_email",
              valueType: "text",
              rules: [{ type: "email", message: "请输入有效的邮箱地址" }],
              placeholder: "请输入邮箱地址",
            },
            {
              title: "年龄",
              dataIndex: "demo_age",
              valueType: "number",
              fieldProps: {
                min: 1,
                max: 120,
                placeholder: "请输入年龄",
              },
            },
          ]}
          // antd-mobile Form 原生属性
          name="demo-extended-form"
          disabled={false}
          preserve={true}
          validateTrigger="onBlur"
          validateMessages={{
            required: "${label} 是必填项！",
            types: {
              email: "${label} 不是有效的邮箱地址！",
              number: "${label} 不是有效的数字！",
            },
          }}
          onFieldsChange={(changedFields, allFields) => {
            console.log("🔄 字段变化:", { changedFields, allFields })
          }}
          className="extended-demo-form"
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
          // SchemaForm 特有属性
          initialValues={{
            demo_username: "演示用户",
            demo_email: "",
            demo_age: 25,
          }}
          onFinish={(values) => {
            console.log("扩展表单提交:", values)
            Toast.show({
              content: `提交成功！用户名：${values.demo_username}`,
              duration: 2000,
            })
          }}
          onFinishFailed={(errorInfo) => {
            console.error("扩展表单验证失败:", errorInfo)
            Toast.show({
              content: "请检查表单填写是否正确",
              duration: 2000,
            })
          }}
          onValuesChange={(changedValues, allValues) => {
            console.log("🔗 扩展表单值变化:", { changedValues, allValues })
          }}
          showSubmitButton
          submitButtonText="提交扩展表单"
          submitButtonProps={{
            style: {
              marginTop: "16px",
              width: "100%",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            },
          }}
        />
      </Card>
    </div>
  )
}

export default SchemaFormDemo
