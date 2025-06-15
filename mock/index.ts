import { MockMethod } from "vite-plugin-mock"

import authMock from "./auth"

// 汇总所有mock接口
const mocks: MockMethod[] = [...authMock]

export default mocks
