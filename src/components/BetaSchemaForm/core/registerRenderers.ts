import {
  CascaderRenderer,
  CascaderRendererProps,
  CheckboxRenderer,
  CheckboxRendererProps,
  CustomRenderer,
  CustomRendererProps,
  DateRenderer,
  DateRendererProps,
  NumberRenderer,
  NumberRendererProps,
  PickerRenderer,
  PickerRendererProps,
  RadioRenderer,
  RadioRendererProps,
  RateRenderer,
  RateRendererProps,
  SelectRenderer,
  SelectRendererProps,
  SliderRenderer,
  SliderRendererProps,
  StepperRenderer,
  StepperRendererProps,
  SwitchRenderer,
  SwitchRendererProps,
  TextAreaRenderer,
  TextAreaRendererProps,
  TextRenderer,
  TextRendererProps,
  UploadRenderer,
  UploadRendererProps,
} from "../renderers"
import { SchemaFormValuesType } from "../types"

import { SchemaRenderer } from "./index"

/**
 * 字段类型到对应渲染器组件 Props 的映射
 * @template TValues - 表单数据类型
 */
export type SchemaFormCompMap<TValues extends SchemaFormValuesType> = {
  text: TextRendererProps<TValues>
  textArea: TextAreaRendererProps<TValues>
  number: NumberRendererProps<TValues>
  switch: SwitchRendererProps<TValues>
  select: SelectRendererProps<TValues>
  radio: RadioRendererProps<TValues>
  checkbox: CheckboxRendererProps<TValues>
  date: DateRendererProps<TValues>
  picker: PickerRendererProps<TValues>
  rate: RateRendererProps<TValues>
  slider: SliderRendererProps<TValues>
  stepper: StepperRendererProps<TValues>
  upload: UploadRendererProps<TValues>
  custom: CustomRendererProps<TValues>
  cascader: CascaderRendererProps<TValues>
}

/**
 * 注册默认渲染器到指定的渲染器实例
 */
export const registerDefaultRenderers = <TValues extends SchemaFormValuesType>(
  renderer: SchemaRenderer<TValues>
) => {
  // 文本类型
  renderer.register("text", TextRenderer)
  renderer.register("textArea", TextAreaRenderer)
  renderer.register("number", NumberRenderer)
  // 开关类型
  renderer.register("switch", SwitchRenderer)
  // 选择类型
  renderer.register("select", SelectRenderer)
  renderer.register("radio", RadioRenderer)
  renderer.register("checkbox", CheckboxRenderer)
  // 日期类型
  renderer.register("date", DateRenderer)
  // 选择类型
  renderer.register("picker", PickerRenderer)
  // 评分类型
  renderer.register("rate", RateRenderer)
  // 滑块类型
  renderer.register("slider", SliderRenderer)
  // 步进器类型
  renderer.register("stepper", StepperRenderer)
  // 上传类型
  renderer.register("upload", UploadRenderer)
  // 级联选择器类型
  renderer.register("cascader", CascaderRenderer)
  // 自定义类型
  renderer.register("custom", CustomRenderer)
}
