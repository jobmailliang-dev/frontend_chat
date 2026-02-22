<template>
  <div class="app-container">
    <Sidebar
      :conversations="conversations"
      :currentConversationId="currentConversationId"
      :isLoading="isLoading"
      :collapsed="sidebarCollapsed"
      @new-chat="handleNewChat"
      @select="handleSelect"
      @delete="handleDelete"
      @rename="handleRename"
      @toggle-sidebar="toggleSidebar"
    />
    <ChatWindow
      ref="chatWindowRef"
      :baseUrl="baseUrl"
      :messages="messages"
      :chatState="chatState"
      :conversationTitle="conversationTitle"
      :sidebarCollapsed="sidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
      @send-message="handleSendMessage"
      @clear-messages="clearMessages"
      @update-title="handleUpdateTitle"
    />

    <!-- 设置按钮（保留当前分支功能） -->
    <button class="settings-btn" @click="showSettings = true" title="系统设置">
      <el-icon><Setting /></el-icon>
    </button>

    <!-- 设置弹框 -->
    <SettingsDialog v-model="showSettings" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import Sidebar from './components/Sidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import SettingsDialog from './components/SettingsDialog.vue';
import { useChat } from './hooks/useChat';
import { useConversation } from './hooks/useConversation';

// 控制设置弹框显示（保留当前分支功能）
const showSettings = ref(false);

const baseUrl = import.meta.env.VITE_API_TARGET || '';
const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);

// 侧栏折叠状态
const sidebarCollapsed = ref(false);

const { messages, state: chatState, streamMessage, clearMessages, loadHistoryMessages } = useChat(baseUrl);
const {
  conversations,
  currentConversationId,
  isLoading,
  createConversationOnFirstMessage,
  selectConversation,
  resetCurrentConversation,
  deleteConversation,
  updateConversation,
  loadConversations,
} = useConversation();

// 当前对话标题
const conversationTitle = computed(() => {
  if (currentConversationId.value && conversations.value.length > 0) {
    const conv = conversations.value.find((c) => c.id === currentConversationId.value);
    if (conv) return conv.title;
  }
  return '新对话';
});

// 页面加载时获取对话列表
onMounted(() => {
  loadConversations();
});

// 切换侧栏折叠状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const handleNewChat = () => {
  // 只清空消息，不创建对话
  clearMessages();
  // 重置当前对话ID，这样发送消息时会创建新对话
  resetCurrentConversation();
  // 聚焦输入框
  chatWindowRef.value?.focusInput();
};

const handleSelect = async (id: string) => {
  selectConversation(id);
  // 加载对应对话的历史消息
  await loadHistoryMessages(id);
};

const handleDelete = (id: string) => {
  deleteConversation(id);
};

const handleRename = (id: string, newTitle: string) => {
  const displayTitle = newTitle.length > 20 ? newTitle.substring(0, 20) + '...' : newTitle;
  updateConversation(id, { title: displayTitle });
};

const handleSendMessage = async (message: string) => {
  // 如果没有当前对话，首次发送消息时创建对话
  if (!currentConversationId.value) {
    await createConversationOnFirstMessage(message);
  }
  await streamMessage(message, currentConversationId.value || undefined);
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

/* 设置按钮样式（保留当前分支功能） */
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
