<template>
  <div class="ask-user-form">
    <div class="form-header">
      <span class="form-icon">📝</span>
      <span class="form-title">{{ title || '请填写以下信息' }}</span>
    </div>

    <div class="form-fields">
      <div
        v-for="field in fields"
        :key="field.id"
        class="form-field"
      >
        <label :for="field.id" class="field-label">
          {{ field.text }}
          <span v-if="field.required" class="required-mark">*</span>
        </label>

        <!-- text 类型 -->
        <input
          v-if="field.type === 'text'"
          :id="field.id"
          v-model="formData[field.id]"
          type="text"
          class="field-input"
          :placeholder="'请输入' + field.text"
          :disabled="status === 'FINISH'"
        />

        <!-- password 类型 -->
        <input
          v-else-if="field.type === 'password'"
          :id="field.id"
          v-model="formData[field.id]"
          type="password"
          class="field-input"
          :placeholder="'请输入' + field.text"
          :disabled="status === 'FINISH'"
        />

        <!-- textarea 类型 -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.id"
          v-model="formData[field.id]"
          class="field-textarea"
          :placeholder="'请输入' + field.text"
          rows="3"
          :disabled="status === 'FINISH'"
        ></textarea>

        <!-- select 类型 -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.id"
          v-model="formData[field.id]"
          class="field-select"
          :disabled="status === 'FINISH'"
        >
          <option value="">请选择</option>
          <option
            v-for="opt in field.options"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- PENDING 状态显示提交按钮 -->
    <div v-if="status === 'PENDING'" class="form-actions">
      <button
        @click="handleSubmit"
        class="submit-btn"
        :disabled="!canSubmit"
      >
        提交
      </button>
    </div>

    <!-- FINISH 状态显示已填写标识 -->
    <div v-else-if="status === 'FINISH'" class="form-status">
      <span class="status-icon">✅</span>
      <span class="status-text">已填写</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { AskUserField } from '../types/chat';
import { updateConversationMetadata } from '../api/conversation';

const props = withDefaults(defineProps<{
  fields: AskUserField[];
  title?: string;
  status?: 'PENDING' | 'FINISH';
  conversationId?: string;
  messageId?: string;
}>(), {
  title: '',
  status: 'PENDING',
  conversationId: '',
  messageId: '',
});

const emit = defineEmits<{
  (e: 'submit', data: Record<string, string>): void;
  (e: 'submit-success'): void;
}>();

// 表单数据
const formData = reactive<Record<string, string>>({});

// 初始化表单数据
watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (!(field.id in formData)) {
        // 优先使用 answer 字段（用于历史记录回显），否则为空
        formData[field.id] = field.answer || '';
      }
    });
  },
  { immediate: true }
);

// 验证是否可提交
const canSubmit = computed(() => {
  return props.fields.every((field) => {
    if (field.required) {
      return formData[field.id]?.trim() !== '';
    }
    return true;
  });
});

// 提交
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  // 如果有 conversationId，先调用 API 更新元数据
  if (props.conversationId) {
    try {
      await updateConversationMetadata(props.conversationId, { ...formData }, props.messageId);
      emit('submit-success');
    } catch (error) {
      console.error('更新元数据失败:', error);
    }
  }

  emit('submit', { ...formData });
};
</script>

<style scoped>
.ask-user-form {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.form-icon {
  font-size: 18px;
}

.form-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  color: #666;
}

.required-mark {
  color: #ff4d4f;
  margin-left: 2px;
}

.field-input,
.field-textarea,
.field-select {
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  transition: all 0.2s;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-select {
  cursor: pointer;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 8px 20px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-status {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
}

.status-icon {
  font-size: 16px;
}

.status-text {
  font-size: 14px;
  color: #52c41a;
  font-weight: 500;
}
</style>
