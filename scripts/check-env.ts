import { env, isDev, isProd, isStaging } from "../src/config"

console.log("🔍 环境变量配置检查")
console.log("====================")
console.log()

console.log("📋 基本环境信息:")
console.log(`  应用标题: ${env.APP_TITLE}`)
console.log(`  应用版本: ${env.APP_VERSION}`)
console.log(`  环境类型: ${env.APP_ENV}`)
console.log(`  是否开发环境: ${isDev}`)
console.log(`  是否生产环境: ${isProd}`)
console.log(`  是否预发布环境: ${isStaging}`)
console.log()

console.log("🌐 API 配置:")
console.log(`  基础地址: ${env.API_BASE_URL}`)
console.log()

console.log("🔄 反向代理配置:")
console.log(`  代理路径: ${env.PROXY_PATH}`)
console.log(`  代理目标: ${env.PROXY_TARGET}`)
console.log(`  路径重写: ${env.PROXY_PATH_REWRITE}`)
console.log()

console.log("🔐 认证配置:")
console.log(`  Token 键名: ${env.TOKEN_KEY}`)
console.log(`  刷新 Token 键名: ${env.REFRESH_TOKEN_KEY}`)
console.log(
  `  Token 过期时间: ${env.TOKEN_EXPIRES_IN}ms (${Math.round(env.TOKEN_EXPIRES_IN / 1000 / 60)} 分钟)`
)
console.log()

console.log("🔑 配置常量示例:")
console.log(`  Token 存储键: ${env.TOKEN_KEY}`)
console.log(`  登录路由: /login`)
console.log(`  登录 API: /auth/login`)
console.log(`  用户详情 API: /users/123`)
console.log()

console.log("✅ 环境变量配置检查完成！")
