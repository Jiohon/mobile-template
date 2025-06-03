// 主要 SchemaForm 组件
export { default as SchemaForm } from "./SchemaForm"
export { default as BetaSchemaForm } from "./SchemaForm" // 向后兼容

// 类型和工具函数导出
export * from "./types"
export * from "./utils"
export { schemaRenderer } from "./core"
export * from "./renderers"

// 默认导出
import SchemaForm from "./SchemaForm"
export default SchemaForm
