[根目录](../../CLAUDE.md) > [frontend-master](../) > **frontend_chat**

# WIMI CHAT - 前端聊天模块

This file provides guidance to Claude Code when working with code in this repository.

## 模块职责

Frontend_chat 模块是 WIMI CHAT 的聊天界面，提供基于 Vue 3 的 AI 对话功能，包括消息列表、输入框、SSE 流式响应等。

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式（连接真实后端，端口 3000）
pnpm dev

# Mock 模式开发（连接 mock-server）
pnpm dev:mock

# 启动独立 Mock 服务器
pnpm mock:server

# 构建生产版本（包含 TypeScript 检查）
pnpm build

# 预览构建结果
pnpm preview
```

## 技术栈

- Vue 3.3.8 + TypeScript 5.2 + Composition API
- Vite 4.5.0 构建工具
- Element Plus 2.4.2 UI 组件库
- Pinia 2.1.7 状态管理（通过 hooks 模式）
- Axios HTTP 客户端
- Monaco Editor 代码编辑器
- Sass CSS 预处理器

## 项目架构

```
src/
├── api/                    # API 调用层
│   └── conversation.ts     # 对话 REST API
├── components/             # Vue 组件
│   ├── ChatInput.vue       # 聊天输入
│   ├── ChatWindow.vue      # 聊天主窗口
│   ├── MessageList.vue     # 消息列表
│   ├── Sidebar.vue         # 侧边栏
│   ├── ConfirmDialog.vue   # 确认对话框
│   ├── RenameDialog.vue    # 重命名对话框
│   └── SettingsDialog.vue  # 设置对话框
├── hooks/                  # 组合式函数（核心逻辑）
│   ├── useChat.ts          # 聊天状态与流式请求
│   └── useConversation.ts  # 对话管理
├── types/                  # TypeScript 类型定义
│   ├── chat.ts             # 消息类型
│   └── conversation.ts     # 对话类型
├── utils/
│   └── streamRequest.ts    # SSE 流式请求工具
├── styles/
│   └── index.scss          # 全局样式
├── App.vue                 # 根组件
└── main.ts                 # 入口文件
```

## 核心模式

### 状态管理

项目不使用 Pinia store，而是采用 **Hooks 模式**管理状态：
- `useChat()` - 管理消息列表、加载状态、流式响应
- `useConversation()` - 管理对话列表 CRUD

### SSE 流式请求

`utils/streamRequest.ts` 使用 Fetch API + ReadableStream 实现 SSE，支持事件类型：`content`, `thinking`, `tool_call`, `tool_result`, `done`, `error`

### 路由

项目**无 Vue Router**，采用单页面组件切换模式，通过 `currentConversationId` 控制视图切换。

### 响应式

移动端断点 768px，侧边栏在移动端变为悬浮式带遮罩。

## 环境配置

- `.env` - 默认配置
- `.env.development` - 开发环境
- `.env.mock` - Mock 模式
- `vite.config.ts` 根据 mode 切换 API 代理目标

## 后端联调

后端运行在 `localhost:8000`，API 端点：
- `GET/POST/DELETE/PATCH /api/conversations` - 对话管理
- `GET /api/conversations/messages` - 获取历史消息
- `GET /api/chat/stream` - SSE 流式聊天

## 设计风格

### 风格定位

采用 **Manus AI 风格**，现代浅色主题，简洁的卡片式布局。

### 色彩方案

| 元素 | 颜色值 | 用途 |
|------|--------|------|
| 页面背景 | `#ffffff` | 主内容区 |
| 侧边栏背景 | `#f8f8f7` | 侧边栏导航 |
| 卡片背景 | `#fafafa` | 任务卡片 |
| 主文字 | `#34322d` | 标题、正文 |
| 次要文字 | `#858481` | 辅助说明、时间 |
| 强调色 | `#e4e4e4` | 浅灰按钮、选中状态 |

## 变更记录 (Changelog)

| 时间戳 | 操作 | 说明 |
|--------|------|------|
| 2026-02-03 11:32:16 | 初始化 | 首次生成 AI 上下文文档 |
| 2026-02-17 22:00:00 | 更新 | 更新为 WIMI CHAT 项目文档 |
| 2026-02-26 00:00:00 | 更新 | 完善模块文档，统一格式 |
