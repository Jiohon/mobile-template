import React, { useEffect, useMemo, useRef, useState } from "react"

import { Button, Card, Space, Tabs, Toast } from "antd-mobile"

import BetaSchemaForm from "@/components/BetaSchemaForm"
import {
  SchemaFormColumnType,
  SchemaFormInstance,
  SchemaFormOptionType,
  SchemaFormValuesType,
} from "@/components/BetaSchemaForm/types"

import styles from "./index.module.less"

// 定义表单数据类型
interface DemoFormValues extends SchemaFormValuesType {
  // 基础字段
  name: string
  age: number | undefined
  email: string
  phone: string

  // 选择字段
  gender: string
  city: string
  district: string
  hobbies: string[]

  // 状态字段
  isVip: boolean
  status: string

  // 日期字段
  birthday: string
  workStartDate: string

  // 文件上传
  avatar: any[]
  documents: any[]

  // 复杂字段
  address: string
  remark: string

  // 动态字段
  vipLevel?: string
  specialRequirement?: string
}

const SchemaFormDemo: React.FC = () => {
  const formRef = useRef<SchemaFormInstance>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [formValues, setFormValues] = useState<DemoFormValues>({} as DemoFormValues)
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [formStats, setFormStats] = useState({
    totalFields: 0,
    filledFields: 0,
    requiredFields: 0,
    validFields: 0,
  })

  // 基础表单配置
  const basicColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () => [
      {
        label: "姓名",
        name: "name",
        componentType: "text",
        required: true,
        rules: [
          { required: true, message: "请输入姓名" },
          { min: 2, max: 20, message: "姓名长度为2-20个字符" },
        ],
        componentProps: {
          placeholder: "请输入您的姓名",
          clearable: true,
        },
      },
      {
        label: "年龄",
        name: "age",
        componentType: "number",
        required: true,
        rules: [
          { required: true, message: "请输入年龄" },
          { type: "number", min: 18, max: 100, message: "年龄必须在18-100之间" },
        ],
        componentProps: {
          placeholder: "请输入年龄",
        },
      },
      {
        label: "邮箱",
        name: "email",
        componentType: "text",
        required: true,
        rules: [
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ],
        componentProps: {
          placeholder: "example@email.com",
          clearable: true,
        },
      },
      {
        label: "手机号",
        name: "phone",
        componentType: "text",
        required: true,
        rules: [
          { required: true, message: "请输入手机号" },
          { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码" },
        ],
        componentProps: {
          placeholder: "请输入11位手机号",
          clearable: true,
        },
      },
    ],
    []
  )

  // 高级表单配置
  const advancedColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () => [
      {
        label: "性别",
        name: "gender",
        componentType: "radio",
        required: true,
        rules: [{ required: true, message: "请选择性别" }],
        componentProps: {
          options: [
            { label: "男", value: "male" },
            { label: "女", value: "female" },
          ],
        },
      },
      {
        label: "城市",
        name: "city",
        componentType: "select",
        required: true,
        rules: [{ required: true, message: "请选择城市" }],
        componentProps: {
          options: [
            { label: "北京", value: "beijing" },
            { label: "上海", value: "shanghai" },
            { label: "广州", value: "guangzhou" },
            { label: "深圳", value: "shenzhen" },
            { label: "杭州", value: "hangzhou" },
            { label: "成都", value: "chengdu" },
          ],
        },
      },
      {
        label: "兴趣爱好",
        name: "hobbies",
        componentType: "checkbox",
        componentProps: {
          options: [
            { label: "🎵 音乐", value: "music" },
            { label: "⚽ 体育", value: "sports" },
            { label: "📚 阅读", value: "reading" },
            { label: "✈️ 旅游", value: "travel" },
            { label: "🎮 游戏", value: "gaming" },
            { label: "🍳 烹饪", value: "cooking" },
          ],
        },
      },
      {
        label: "VIP用户",
        name: "isVip",
        componentType: "switch",
        componentProps: {
          checkedText: "是",
          uncheckedText: "否",
        },
      },
      {
        label: "生日",
        name: "birthday",
        componentType: "date",
        componentProps: {
          placeholder: "请选择生日",
        },
      },
      {
        label: "工作开始时间",
        name: "workStartDate",
        componentType: "picker",
        componentProps: {
          columns: [
            Array.from({ length: 10 }, (_, i) => ({
              label: `${2015 + i}年`,
              value: `${2015 + i}`,
            })),
          ],
        },
      },
    ],
    []
  )

  // 依赖字段演示
  const dependencyColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () => [
      ...advancedColumns,
      {
        componentType: "dependency",
        to: ["city"],
        children(changedValues) {
          const { city } = changedValues
          if (city) {
            const districtOptions = getDistrictOptions(city)
            if (districtOptions.length > 0) {
              return [
                {
                  label: "区县",
                  name: "district",
                  componentType: "select",
                  rules: [{ required: true, message: "请选择区县" }],
                  componentProps: {
                    placeholder: "请选择区县",
                    options: districtOptions,
                  },
                },
              ]
            }
          }
          return []
        },
      },
      {
        componentType: "dependency",
        to: ["isVip"],
        children(changedValues) {
          const { isVip } = changedValues
          if (isVip) {
            return [
              {
                label: "VIP等级",
                name: "vipLevel",
                componentType: "select",
                required: true,
                rules: [{ required: true, message: "请选择VIP等级" }],
                componentProps: {
                  placeholder: "请选择VIP等级",
                  options: [
                    { label: "🥉 青铜VIP", value: "bronze" },
                    { label: "🥈 白银VIP", value: "silver" },
                    { label: "🥇 黄金VIP", value: "gold" },
                    { label: "💎 钻石VIP", value: "diamond" },
                  ],
                },
              },
              {
                label: "特殊需求",
                name: "specialRequirement",
                componentType: "text",
                componentProps: {
                  placeholder: "请描述您的特殊需求",
                },
              },
            ]
          }
          return []
        },
      },
    ],
    [advancedColumns]
  )

  // 完整表单配置
  const fullColumns: SchemaFormColumnType<DemoFormValues>[] = useMemo(
    () => [
      ...basicColumns,
      ...dependencyColumns,
      {
        label: "头像",
        name: "avatar",
        componentType: "upload",
        componentProps: {
          maxCount: 1,
          upload: async (_file) => {
            // 模拟上传
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return {
              url: "https://picsum.photos/200/200",
            }
          },
        },
      },
      {
        label: "地址",
        name: "address",
        componentType: "text",
        componentProps: {
          placeholder: "请输入详细地址",
        },
      },
      {
        label: "备注",
        name: "remark",
        componentType: "text",
        componentProps: {
          placeholder: "其他备注信息",
        },
      },
    ],
    [basicColumns, dependencyColumns]
  )

  // 获取当前选项卡的表单配置
  const currentColumns = useMemo(() => {
    switch (activeTab) {
      case "basic":
        return basicColumns
      case "advanced":
        return advancedColumns
      case "dependency":
        return dependencyColumns
      case "full":
        return fullColumns
      default:
        return basicColumns
    }
  }, [activeTab, basicColumns, advancedColumns, dependencyColumns, fullColumns])

  // 获取区县选项
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
      hangzhou: [
        { label: "西湖区", value: "xihu" },
        { label: "拱墅区", value: "gongshu" },
        { label: "江干区", value: "jianggan" },
        { label: "下城区", value: "xiacheng" },
      ],
      chengdu: [
        { label: "锦江区", value: "jinjiang" },
        { label: "青羊区", value: "qingyang" },
        { label: "金牛区", value: "jinniu" },
        { label: "武侯区", value: "wuhou" },
      ],
    }
    return districtMap[city] || []
  }

  // 计算表单统计信息
  const calculateStats = (
    columns: SchemaFormColumnType<DemoFormValues>[],
    values: DemoFormValues
  ) => {
    const totalFields = columns.filter((col) => "name" in col && col.name).length
    const filledFields = Object.keys(values).filter((key) => {
      const value = values[key as keyof DemoFormValues]
      return value !== undefined && value !== null && value !== ""
    }).length
    const requiredFields = columns.filter((col) => "required" in col && col.required).length

    setFormStats({
      totalFields,
      filledFields,
      requiredFields,
      validFields: filledFields, // 简化计算，实际应该验证每个字段
    })
  }

  // 事件处理函数
  const handleFinish = (values: DemoFormValues) => {
    console.log("表单提交成功", values)
    Toast.show({
      icon: "success",
      content: "表单提交成功！",
    })
  }

  const handleFinishFailed = (errorInfo: any) => {
    setValidationErrors(errorInfo.errorFields || [])
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
    setFormValues(allValues)
    calculateStats(currentColumns, allValues)
    setValidationErrors([]) // 清除验证错误
  }

  // 操作函数
  const handleReset = () => {
    formRef.current?.resetFields()
    setFormValues({} as DemoFormValues)
    setValidationErrors([])
    Toast.show("表单已重置")
  }

  const handleFillDemo = () => {
    const demoData: Partial<DemoFormValues> = {
      name: "张三",
      age: 28,
      email: "zhangsan@example.com",
      phone: "13800138000",
      gender: "male",
      city: "beijing",
      hobbies: ["reading", "music", "travel"],
      isVip: true,
      birthday: "1995-06-15",
    }

    formRef.current?.setFieldsValue(demoData)
    setFormValues((prev) => ({ ...prev, ...demoData }))
    Toast.show("已填充示例数据")
  }

  const handleValidate = async () => {
    try {
      const values = await formRef.current?.validateFields()
      console.log("表单验证通过", values)
      Toast.show({
        icon: "success",
        content: "表单验证通过！",
      })
      setValidationErrors([])
    } catch (error: any) {
      setValidationErrors(error.errorFields || [])
      Toast.show({
        icon: "fail",
        content: `验证失败，${error.errorFields?.length || 0}个字段有误`,
      })
    }
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
    setFormValues({} as DemoFormValues)
    Toast.show("表单值已清空")
  }

  // 监听Tab切换
  useEffect(() => {
    calculateStats(currentColumns, formValues)
  }, [activeTab, formValues, currentColumns])

  return (
    <Space className={styles.container} direction="vertical" block>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div className={styles.title}>SchemaForm 动态表单演示</div>
        <div className={styles.subtitle}>
          基于JSON配置的动态表单组件，支持多种字段类型、验证规则和依赖关系
        </div>
      </div>

      {/* 统计信息 */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formStats.totalFields}</div>
          <div className={styles.statLabel}>总字段数</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formStats.filledFields}</div>
          <div className={styles.statLabel}>已填写</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formStats.requiredFields}</div>
          <div className={styles.statLabel}>必填字段</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{validationErrors.length}</div>
          <div className={styles.statLabel}>验证错误</div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className={styles.actionBar}>
        <Button size="small" color="default" onClick={handleReset}>
          🔄 重置
        </Button>
        <Button size="small" color="primary" onClick={handleFillDemo}>
          📝 填充示例
        </Button>
        <Button size="small" color="success" onClick={handleValidate}>
          ✅ 验证
        </Button>
        <Button size="small" color="warning" onClick={handleGetValues}>
          📋 获取值
        </Button>
        <Button size="small" color="danger" onClick={handleClearValues}>
          🗑️ 清空
        </Button>
      </div>

      {/* 表单演示区域 */}
      <Card className={styles.formContainer} style={{}}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title="基础表单" key="basic" />
          <Tabs.Tab title="高级字段" key="advanced" />
          <Tabs.Tab title="依赖字段" key="dependency" />
          <Tabs.Tab title="完整示例" key="full" />
        </Tabs>

        <div style={{ marginTop: 8 }}>
          <BetaSchemaForm<DemoFormValues>
            layout="horizontal"
            formRef={formRef}
            columns={currentColumns}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            onValuesChange={handleValuesChange}
            showSubmitButton={true}
            submitButtonText="提交表单"
          />
        </div>
      </Card>

      {/* 实时预览 */}
      <Card title="表单数据实时预览">
        <div className={styles.previewContent}>
          {Object.keys(formValues).length > 0 ? (
            JSON.stringify(formValues, null, 2)
          ) : (
            <div className={styles.emptyPreview}>暂无数据，请填写表单字段</div>
          )}
        </div>
      </Card>
    </Space>
  )
}

export default SchemaFormDemo
