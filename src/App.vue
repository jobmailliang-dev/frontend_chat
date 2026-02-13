<template>
  <div class="app-container">
    <!-- 原有布局 -->
    <Sidebar
      :conversations="conversations"
      :currentConversationId="currentConversationId"
      @new-chat="handleNewChat"
      @select="handleSelect"
      @delete="handleDelete"
    />
    <ChatWindow
      ref="chatWindowRef"
      :baseUrl="baseUrl"
      :messages="messages"
      :chatState="chatState"
      :conversationTitle="conversationTitle"
      @send-message="handleSendMessage"
      @clear-messages="clearMessages"
      @update-error="handleUpdateError"
      @update-title="handleUpdateTitle"
    />

    <!-- 设置按钮 -->
    <button class="settings-btn" @click="showSettings = true" title="系统设置">
      <el-icon><Setting /></el-icon>
    </button>

    <!-- 设置弹框 -->
    <SettingsDialog v-model="showSettings" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import Sidebar from './components/Sidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import SettingsDialog from './components/SettingsDialog.vue';
import { useChat } from './hooks/useChat';
import { useConversation } from './hooks/useConversation';

// 控制设置弹框显示
const showSettings = ref(false);

const baseUrl = import.meta.env.VITE_API_TARGET || 'http://localhost:8000';
const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);

const { messages, state: chatState, streamMessage, clearMessages } = useChat(baseUrl);
const {
  conversations,
  currentConversationId,
  createConversationOnFirstMessage,
  selectConversation,
  deleteConversation,
  updateConversation,
} = useConversation();

// 当前对话标题
const conversationTitle = computed(() => {
  if (currentConversationId.value && conversations.value.length > 0) {
    const conv = conversations.value.find(c => c.id === currentConversationId.value);
    if (conv) return conv.title;
  }
  return '新对话';
});

const handleNewChat = () => {
  // 只清空消息，不创建对话
  clearMessages();
  // 清空当前对话ID，这样发送消息时会创建新对话
  currentConversationId.value = null;
  // 通过 ref 调用子组件的聚焦方法
  chatWindowRef.value?.focusInput();
};

const handleSelect = (id: string) => {
  selectConversation(id);
  // TODO: 加载对应对话的历史消息
  clearMessages();
};

const handleDelete = (id: string) => {
  deleteConversation(id);
};

const handleSendMessage = async (message: string) => {
  // 如果没有当前对话，首次发送消息时创建对话
  if (!currentConversationId.value) {
    createConversationOnFirstMessage(message);
  }
  await streamMessage(message);
};

const handleUpdateError = (error: string | null) => {
  // 更新错误状态
};

const handleUpdateTitle = (title: string) => {
  // 首次发送消息后，用消息内容更新对话标题
  if (currentConversationId.value) {
    const displayTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    updateConversation(currentConversationId.value, { title: displayTitle });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}

/* 设置按钮样式 */
.settings-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  z-index: 1000;
}

.settings-btn:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.settings-btn .el-icon {
  font-size: 24px;
  color: #666;
}
</style>
