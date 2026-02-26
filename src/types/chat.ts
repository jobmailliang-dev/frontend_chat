// 消息数据结构定义
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'ask_user';
  content: string;
  timestamp: number;
  isThinking: boolean;
  thinkingLog: ThinkingLog[];
  askUserFields?: AskUserField[]; // 询问用户的表单字段
  askUserTitle?: string; // 询问用户表单标题
  askUserStatus?: 'PENDING' | 'FINISH'; // 表单状态
  askUserMessageId?: string; // ask_user 消息 ID
}

export interface ThinkingLog {
  timestamp: number;
  eventType: string;
  rawData: string;
}

// 聊天状态定义
export interface ChatState {
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

// API 请求/响应定义
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  tool_calls?: any[];
}

// SSE 事件类型
export type SSEEventType =
  | 'content'
  | 'thinking'
  | 'tool_call'
  | 'tool_result'
  | 'tool_error'
  | 'done'
  | 'error'
  | 'ask_user';

// 用户输入字段定义
export interface AskUserField {
  id: string;
  text: string;
  type: 'text' | 'password' | 'select' | 'textarea';
  required?: boolean;
  options?: { label: string; value: string }[]; // for select type
  answer?: string; // 回显数据（聊天记录时使用）
}
