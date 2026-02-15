import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_TARGET || '';

export interface ConversationListItem {
  id: string;
  title: string;
  preview: string;
  createTime: number;
  updateTime: number;
  messageCount: number;
}

export interface ConversationMessagesResponse {
  conversationId: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    timestamp: number;
    isThinking?: boolean;
  }>;
}

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 对话列表 API
export async function getConversations(): Promise<ConversationListItem[]> {
  const response = await axiosInstance.get<{ data: ConversationListItem[] }>('/conversations');
  return response.data.data;
}

// 创建对话
export async function createConversation(title: string): Promise<ConversationListItem> {
  const response = await axiosInstance.post<{ data: ConversationListItem }>('/conversations', { title });
  return response.data.data;
}

// 删除对话
export async function deleteConversation(id: string): Promise<void> {
  await axiosInstance.delete('/conversations', { data: { id } });
}

// 更新对话
export async function updateConversation(
  id: string,
  data: { title?: string; preview?: string; messageCount?: number }
): Promise<ConversationListItem> {
  const response = await axiosInstance.patch<{ data: ConversationListItem }>('/conversations', { id, ...data });
  return response.data.data;
}

// 获取对话消息
export async function getConversationMessages(conversationId: string): Promise<ConversationMessagesResponse> {
  const response = await axiosInstance.get<{ data: ConversationMessagesResponse }>('/conversations/messages', {
    params: { conversationId },
  });
  return response.data.data;
}
