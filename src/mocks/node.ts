import { setupServer } from "msw/node"

import { handlers } from "./handlers"

// 设置Node环境的MSW服务器（用于测试）
export const server = setupServer(...handlers)
