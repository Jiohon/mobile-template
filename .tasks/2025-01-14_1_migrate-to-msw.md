# Context

File name: 2025-01-14_1_migrate-to-msw.md
Created at: 2025-01-14_14:30:00
Created by: j
Main branch: main
Task Branch: task/migrate-to-msw_2025-01-14_1
Yolo Mode: Off

# Task Description

将项目中的 vite-plugin-mock 替换为 MSW (Mock Service Worker)，以支持在生产环境中使用 mock 功能。

vite-plugin-mock 主要面向开发环境，生产环境支持有限。MSW 提供了更好的开发和生产环境统一体验，通过 Service Worker 在生产环境拦截网络请求。

# Project Overview

这是一个基于 React + Vite + TypeScript + Antd Mobile 的移动端应用模板项目。当前使用 vite-plugin-mock 进行 API 模拟，需要迁移到 MSW 以获得更好的生产环境支持。

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️
核心 RIPER-5 协议规则：

- 必须严格按照 RESEARCH → INNOVATE → PLAN → EXECUTE → REVIEW 的模式执行
- 在 EXECUTE 模式下必须 100% 遵循计划，不得偏离
- 任何偏离都必须返回 PLAN 模式重新规划
- 每个响应都必须以 [MODE: XXX] 开头声明当前模式
  ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

# Analysis

当前项目mock架构分析：

## 当前配置

- **依赖**: vite-plugin-mock@3.0.2, mockjs@1.1.0
- **配置位置**: vite/vite.common.ts 中配置 viteMockServe 插件
- **控制变量**: VITE_ENABLE_MOCK 环境变量控制启用状态
- **Mock文件**: mock/ 目录包含 auth.ts 等API实现
- **生产环境**: mockProdServer.ts 尝试支持生产环境但效果有限

## 存在问题

- vite-plugin-mock 生产环境支持不完善
- mock 和 proxy 配置相互排斥，缺乏灵活性
- 生产环境mock可能无法正常工作
- 调试和开发体验不够好

## MSW 优势

- 统一的开发和生产环境mock体验
- Service Worker 技术在浏览器层面拦截请求
- 更好的开发者工具和调试能力
- 可与真实API并存，支持部分mock
- 更接近真实网络环境的测试

# Proposed Solution

## 迁移策略

采用分阶段迁移方案，确保项目的稳定性和连续性：

### 方案一：完全替换策略（推荐）

**优点**: 彻底解决生产环境问题，架构清晰
**缺点**: 改动相对较大，需要完整测试

**实施步骤**:

1. 安装MSW依赖，移除vite-plugin-mock
2. 创建MSW handlers目录结构
3. 重写现有mock API为MSW格式
4. 配置开发环境MSW设置
5. 配置生产环境Service Worker
6. 更新Vite配置
7. 更新环境变量和文档

### 方案二：渐进式迁移策略

**优点**: 风险较低，可以逐步验证
**缺点**: 过渡期维护两套mock系统

**实施步骤**:

1. 并行引入MSW，保留现有vite-plugin-mock
2. 逐个API迁移到MSW
3. 验证功能一致性后移除旧系统

## 技术实现细节

### 目录结构调整

```
src/
  mocks/
    handlers/
      auth.ts          # 认证相关API
      index.ts         # 导出所有handlers
    browser.ts         # 浏览器环境MSW配置
    server.ts          # Node环境MSW配置 (测试用)
    setupWorker.ts     # Service Worker设置
```

### 环境变量配置

- `VITE_ENABLE_MSW`: 控制MSW启用状态
- 保持与现有环境变量的兼容性

### 构建和部署考虑

- 生产环境需要正确配置Service Worker
- 静态资源路径处理
- CDN部署兼容性

# Current execution step: "14. 清理临时文件和进行最终验证（已完成）"

# Task Progress

[2025-01-14_15:00:00]

- Modified: package.json, pnpm-lock.yaml, public/mockServiceWorker.js, src/mocks/\*, vite/vite.common.ts, vite/vite.dev.ts, src/main.tsx, .env
- Changes: 完成MSW迁移 - 移除vite-plugin-mock依赖，安装MSW，创建MSW handlers和配置文件，更新Vite配置，集成主应用入口，更新环境变量，删除旧mock目录
- Reason: 将项目从vite-plugin-mock迁移到MSW以支持生产环境mock功能
- Blockers: 无
- Status: UNCONFIRMED

# Final Review:
