import { authHandlers } from "./auth"

// 导出所有handlers
export const handlers = [
  ...authHandlers,
  // 在这里添加其他模块的handlers
]
