// 主要 SchemaForm 组件
export { default as BetaSchemaForm } from "./BetaSchemaForm"

// 类型和工具函数导出
export * from "./types"
export { createSchemaRenderer } from "./core"
export * from "./renderers"

// 默认导出
import BetaSchemaForm from "./BetaSchemaForm"
export default BetaSchemaForm

// 泛型类型助手，方便使用
export type BetaSchemaFormType = typeof BetaSchemaForm
