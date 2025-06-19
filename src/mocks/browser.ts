import { setupWorker } from "msw/browser"

import { handlers } from "./handlers"

// 设置浏览器环境的MSW worker
export const worker = setupWorker(...handlers)
