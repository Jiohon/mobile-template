import { SchemaFormColumnType } from "@/components/BetaSchemaForm/types"

import type { SelectorOption } from "antd-mobile"

// 定义表单数据类型
export interface DemoFormValues {
  // 基础字段
  name: string
  age: number | undefined
  remark: string

  // 选择字段
  gender: string
  city: string
  district: string
  hobbies: string[]

  // 状态字段
  isVip: boolean

  // 日期字段
  birthday: string
  workStartDate: string[]

  // 文件上传
  avatar: { url: string }[]

  // 动态字段
  vipLevel?: string
  specialRequirement?: string
  rate: number
  slider: number
  stepper: number
  cascader: string[]
  customField: string
}

// 获取区县选项
const getDistrictOptions = (city: string): SelectorOption<string>[] => {
  const districtMap: Record<string, SelectorOption<string>[]> = {
    beijing: [
      { label: "朝阳区", value: "chaoyang" },
      { label: "海淀区", value: "haidian" },
      { label: "西城区", value: "xicheng" },
    ],
    shanghai: [
      { label: "浦东新区", value: "pudong" },
      { label: "黄浦区", value: "huangpu" },
      { label: "徐汇区", value: "xuhui" },
    ],
    guangzhou: [
      { label: "天河区", value: "tianhe" },
      { label: "越秀区", value: "yuexiu" },
      { label: "海珠区", value: "haizhu" },
    ],
  }
  return districtMap[city] || []
}

export const createBasicFields = (): SchemaFormColumnType<DemoFormValues>[] => {
  return [
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
        ],
      },
    },
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
      componentType: "dependency",
      to: ["isVip"],
      children(changedValues) {
        const { isVip } = changedValues
        console.log(changedValues, "changedValues")
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
    {
      label: "地区选择",
      name: "cascader",
      componentType: "cascader",
      componentProps: {
        placeholder: "请选择地区",
        options: [
          {
            label: "浙江",
            value: "浙江",
            children: [
              {
                label: "杭州",
                value: "杭州",
                children: [
                  { label: "西湖区", value: "西湖区" },
                  { label: "上城区", value: "上城区" },
                  { label: "余杭区", value: "余杭区" },
                ],
              },
              {
                label: "宁波",
                value: "宁波",
                children: [
                  { label: "海曙区", value: "海曙区" },
                  { label: "江北区", value: "江北区" },
                  { label: "镇海区", value: "镇海区" },
                ],
              },
            ],
          },
          {
            label: "江苏",
            value: "江苏",
            children: [
              {
                label: "南京",
                value: "南京",
                children: [
                  { label: "玄武区", value: "玄武区" },
                  { label: "秦淮区", value: "秦淮区" },
                  { label: "建邺区", value: "建邺区" },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: "头像",
      name: "avatar",
      componentType: "upload",
      componentProps: {
        maxCount: 1,
        upload: async (file) => {
          // 模拟上传
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return {
            url: URL.createObjectURL(file),
          }
        },
      },
    },
    {
      label: "备注",
      name: "remark",
      componentType: "textArea",
      componentProps: {
        placeholder: "请输入备注信息",
      },
    },
    {
      label: "评分",
      name: "rate",
      componentType: "rate",
      componentProps: {
        count: 5,
      },
    },
    {
      label: "滑块",
      name: "slider",
      componentType: "slider",
      componentProps: {
        min: 0,
        max: 100,
        step: 1,
      },
    },
    {
      label: "步进器",
      name: "stepper",
      componentType: "stepper",
      componentProps: {
        min: 0,
        max: 100,
        step: 1,
      },
    },
  ]
}
