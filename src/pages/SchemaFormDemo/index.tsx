import React, { useMemo, useRef, useState } from "react"

import { Button, Card, Space, Tabs, Toast } from "antd-mobile"

import BetaSchemaForm from "@/components/BetaSchemaForm"
import {
  SchemaFormColumnType,
  SchemaFormErrorInfoType,
  SchemaFormInstance,
} from "@/components/BetaSchemaForm/types"

import { createBasicFields, DemoFormValues } from "./field.tsx"
import styles from "./index.module.less"

const SchemaFormDemo: React.FC = () => {
  const formRef = useRef<SchemaFormInstance>(null)
  const [activeTab, setActiveTab] = useState("basic")

  // 完整表单配置
  const fullColumns = createBasicFields()

  // 基础表单配置
  const basicColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () => fullColumns.filter((col) => !["dependency"].includes(col.componentType)),
    [fullColumns]
  )

  // 依赖字段演示
  const dependencyColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () =>
      fullColumns.filter((col) => ["select", "switch", "dependency"].includes(col.componentType)),
    [fullColumns]
  )

  // 获取当前选项卡的表单配置
  const currentColumns = useMemo(() => {
    switch (activeTab) {
      case "basic":
        return basicColumns
      case "dependency":
        return dependencyColumns
      case "full":
        return fullColumns
      default:
        return basicColumns
    }
  }, [activeTab, basicColumns, dependencyColumns, fullColumns])

  // 事件处理函数
  const handleFinish = (values: DemoFormValues) => {
    console.log("表单提交成功", values)
    Toast.show({
      icon: "success",
      content: "表单提交成功！",
    })
  }

  const handleFinishFailed = (errorInfo: SchemaFormErrorInfoType<DemoFormValues>) => {
    console.log(formRef.current?.getFieldsValue())
    Toast.show({
      icon: "fail",
      content: `表单验证失败，${errorInfo.errorFields?.length || 0}个字段有误`,
    })
  }

  const handleValuesChange = (
    changedValues: Partial<DemoFormValues>,
    allValues: DemoFormValues
  ) => {
    console.log("表单值变化", changedValues, allValues)
  }

  // 操作函数
  const handleReset = () => {
    formRef.current?.resetFields()
    Toast.show("表单已重置")
  }

  const handleFillDemo = () => {
    const demoData: Partial<DemoFormValues> = {
      name: "11",
      age: 22,
      gender: "male",
      city: ["beijing"],
      hobbies: ["music"],
      isVip: true,
      birthday: "2025-07-26 00:00:00",
      workStartDate: ["2015"],
      cascader: ["浙江", "杭州", "西湖区"],
      avatar: [
        {
          url: "https://picsum.photos/200/300",
        },
      ],
      remark: "123",
      rate: 3,
      slider: 17,
      stepper: 3,
    }

    formRef.current?.setFieldsValue(demoData)
    Toast.show("已填充示例数据")
  }

  const handleValidate = async () => {
    formRef.current?.submit()
  }

  const handleGetValues = () => {
    const values = formRef.current?.getFieldsValue()
    console.log("表单值", values)
    Toast.show({
      content: "获取表单值成功",
      duration: 1000,
    })
  }

  const handleClearValues = () => {
    formRef.current?.resetFields()
    Toast.show("表单值已清空")
  }

  return (
    <Space className={styles.container} direction="vertical" block>
      <div className={styles.header}>
        <div className={styles.title}>SchemaForm 动态表单演示</div>
        <div className={styles.subtitle}>
          基于JSON配置的动态表单组件，支持多种字段类型、验证规则和依赖关系
        </div>
      </div>

      <div className={styles.actionBar}>
        <Button size="small" color="default" onClick={handleReset}>
          重置
        </Button>
        <Button size="small" color="primary" onClick={handleFillDemo}>
          填充示例
        </Button>
        <Button size="small" color="success" onClick={handleValidate}>
          验证
        </Button>
        <Button size="small" color="warning" onClick={handleGetValues}>
          获取值
        </Button>
        <Button size="small" color="danger" onClick={handleClearValues}>
          清空
        </Button>
      </div>

      <Card className={styles.formContainer} style={{}}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title="基础表单" key="basic" />
          <Tabs.Tab title="依赖字段" key="dependency" />
          <Tabs.Tab title="完整示例" key="full" />
        </Tabs>

        <div style={{ marginTop: 8 }}>
          <BetaSchemaForm<DemoFormValues>
            layout="horizontal"
            formRef={formRef}
            initialValues={{
              name: "11",
              age: 22,
              gender: "male",
              city: ["beijing"],
              hobbies: ["music"],
              isVip: true,
              birthday: "2025-07-26 00:00:00",
              workStartDate: ["2015"],
              cascader: ["浙江", "杭州", "西湖区"],
              avatar: [
                {
                  url: "https://picsum.photos/200/300",
                },
              ],
              remark: "123",
              rate: 3,
              slider: 17,
              stepper: 3,
            }}
            columns={currentColumns}
            readOnly={false}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            onValuesChange={handleValuesChange}
          />
        </div>
      </Card>
    </Space>
  )
}

export default SchemaFormDemo
