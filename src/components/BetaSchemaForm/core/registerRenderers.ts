import CheckboxRenderer from "../renderers/CheckboxRenderer"
import CustomRenderer from "../renderers/CustomRenderer"
import DateRenderer from "../renderers/DateRenderer"
import NumberRenderer from "../renderers/NumberRenderer"
import PickerRenderer from "../renderers/PickerRenderer"
import RadioRenderer from "../renderers/RadioRenderer"
import RateRenderer from "../renderers/RateRenderer"
import SelectRenderer from "../renderers/SelectRenderer"
import SliderRenderer from "../renderers/SliderRenderer"
import SwitchRenderer from "../renderers/SwitchRenderer"
import TextRenderer from "../renderers/TextRenderer"
import UploadRenderer from "../renderers/UploadRenderer"
import { SchemaFormValuesType } from "../types"

import { SchemaRenderer } from "./index"

/**
 * 注册默认渲染器到指定的渲染器实例
 */
export const registerDefaultRenderers = <TValues extends SchemaFormValuesType>(
  renderer: SchemaRenderer<TValues>
) => {
  // 文本类型
  renderer.register("text", TextRenderer)
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

  // 上传类型
  renderer.register("upload", UploadRenderer)

  // 自定义类型
  renderer.register("custom", CustomRenderer)
}
