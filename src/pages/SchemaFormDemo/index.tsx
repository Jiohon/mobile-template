import React, { useRef } from "react"

import { Button, Card, Toast } from "antd-mobile"

import { SchemaForm } from "@/components/SchemaForm"
import {
  SchemaFormColumnType,
  SchemaFormInstance,
  SchemaFormOptionType,
  SchemaFormValuesType,
} from "@/components/SchemaForm/types"

// 定义表单数据类型
interface DemoFormValues extends SchemaFormValuesType {
  name: string
  age: number | undefined
  email: string
  gender: string
  isVip: boolean
  hobbies: string[]
  city: string
  district: string
  dependencyColumn?: string
}

// SchemaFormItemBase<"text", TextRendererProps<DemoFormValues>, DemoFormValues>.fieldProps?: TextRendererProps<DemoFormValues> | undefined

// 完整功能测试配置
const fullFeatureColumns: SchemaFormColumnType<DemoFormValues>[] = [
  {
    label: "姓名",
    name: "name",
    valueType: "text",
    required: true,
    rules: [
      {
        required: true,
        message: "请输入姓名",
      },
    ],
    fieldProps: {
      placeholder: "请输入姓名",
    },
  },
  {
    label: "年龄",
    name: "age",
    valueType: "number",
    required: true,
    rules: [
      {
        required: true,
        message: "请输入年龄",
      },
    ],
    fieldProps: {
      placeholder: "请输入年龄",
      min: 18,
      max: 100,
    },
  },
  {
    label: "性别",
    name: "gender",
    valueType: "select",
    required: true,
    rules: [
      {
        required: true,
        message: "请选择性别",
      },
    ],
    fieldProps: {
      options: [
        { label: "男", value: "male" },
        { label: "女", value: "female" },
      ],
    },
  },
  {
    label: "VIP用户",
    name: "isVip",
    valueType: "switch",
    fieldProps: {
      checkedText: "是",
      uncheckedText: "否",
    },
  },
  {
    label: "兴趣爱好",
    name: "hobbies",
    valueType: "checkbox",
    fieldProps: {
      options: [
        { label: "音乐", value: "music" },
        { label: "体育", value: "sports" },
        { label: "阅读", value: "reading" },
        { label: "旅游", value: "travel" },
      ],
    },
  },
  {
    label: "城市",
    name: "city",
    valueType: "select",
    required: true,
    rules: [
      {
        required: true,
        message: "请选择城市",
      },
    ],
    fieldProps: {
      options: [
        { label: "北京", value: "beijing" },
        { label: "上海", value: "shanghai" },
        { label: "广州", value: "guangzhou" },
        { label: "深圳", value: "shenzhen" },
      ],
    },
  },

  // dependency 字段 - 根据城市动态生成区县选择
  {
    valueType: "dependency",
    to: ["city"],
    children: (changedValues, _form) => {
      const { city } = changedValues

      console.log("dependency city 变化:", city)

      if (city) {
        const districtOptions = getDistrictOptions(city)
        if (districtOptions.length > 0) {
          return [
            {
              label: "区县",
              name: "district",
              valueType: "select",
              required: true,
              rules: [{ required: true, message: "请选择区县" }],
              a: 1,
              fieldProps: {
                options: districtOptions,
                placeholder: "请选择区县",
              },
            },
          ]
        }
      }

      return []
    },
  },

  // 多层dependency - 根据VIP状态动态生成字段
  {
    valueType: "dependency",
    to: ["isVip"],
    children: (changedValues, _form) => {
      const { isVip } = changedValues

      console.log("dependency isVip 变化:", isVip)

      if (isVip) {
        return [
          {
            label: "VIP专属字段",
            name: "dependencyColumn",
            valueType: "text",
            required: true,
            rules: [{ required: true, message: "请输入VIP信息" }],
            fieldProps: {
              placeholder: "这是VIP用户的专属字段",
            },
          },
        ]
      }

      return []
    },
  },
]

// 根据城市获取区县选项
const getDistrictOptions = (city: string): SchemaFormOptionType[] => {
  const districtMap: Record<string, SchemaFormOptionType[]> = {
    beijing: [
      { label: "朝阳区", value: "chaoyang" },
      { label: "海淀区", value: "haidian" },
      { label: "西城区", value: "xicheng" },
      { label: "东城区", value: "dongcheng" },
    ],
    shanghai: [
      { label: "浦东新区", value: "pudong" },
      { label: "黄浦区", value: "huangpu" },
      { label: "徐汇区", value: "xuhui" },
      { label: "长宁区", value: "changning" },
    ],
    guangzhou: [
      { label: "天河区", value: "tianhe" },
      { label: "越秀区", value: "yuexiu" },
      { label: "海珠区", value: "haizhu" },
      { label: "荔湾区", value: "liwan" },
    ],
    shenzhen: [
      { label: "南山区", value: "nanshan" },
      { label: "福田区", value: "futian" },
      { label: "罗湖区", value: "luohu" },
      { label: "宝安区", value: "baoan" },
    ],
  }

  return districtMap[city] || []
}

const SchemaFormDemo: React.FC = () => {
  const formRef = useRef<SchemaFormInstance>(null!)

  const handleFinish = (values: DemoFormValues) => {
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
    changedValues: Partial<DemoFormValues>,
    allValues: DemoFormValues
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
      name: "张三",
      age: 25,
      gender: "male",
      isVip: true,
      hobbies: ["music", "reading"],
      city: "beijing",
    })
    Toast.show("已填充示例数据")
  }

  const handleValidate = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        console.log("验证成功:", values)
        Toast.show("表单验证通过")
      })
      .catch((error) => {
        console.log("验证失败:", error)
        Toast.show("表单验证失败")
      })
  }

  const handleSubmit = () => {
    formRef.current?.submit()
  }

  const handleGetValues = () => {
    const values = formRef.current?.getFieldsValue()
    console.log("当前表单值:", values)
    Toast.show(`当前表单值: ${JSON.stringify(values, null, 2)}`)
  }

  return (
    <div className="schema-form-demo">
      <Card title="SchemaForm 表单示例" className="demo-card">
        <div className="demo-actions">
          <Button size="small" onClick={handleReset}>
            重置表单
          </Button>
          <Button size="small" onClick={handleFillDemo}>
            填充示例
          </Button>
          <Button size="small" onClick={handleValidate}>
            验证表单
          </Button>
          <Button size="small" onClick={handleSubmit}>
            提交表单
          </Button>
          <Button size="small" onClick={handleGetValues}>
            获取值
          </Button>
        </div>

        <SchemaForm<DemoFormValues>
          layout="horizontal"
          formRef={formRef}
          columns={fullFeatureColumns}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          onValuesChange={handleValuesChange}
          showSubmitButton={true}
          submitButtonText="完成提交"
          initialValues={{
            name: "name11",
            age: undefined,
            gender: "male",
            isVip: false,
            hobbies: [],
            city: "beijing",
            district: "",
          }}
        />
      </Card>
      {/* <Demo /> */}
    </div>
  )
}

export default SchemaFormDemo
