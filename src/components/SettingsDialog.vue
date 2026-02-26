<template>
  <el-dialog
    v-model="dialogVisible"
    width="900px"
    :modal="true"
    :close-on-click-modal="true"
    destroy-on-close
    :append-to-body="true"
    :show-close="false"
    class="settings-dialog"
  >
    <div class="settings-container">
      <div class="close-btn" @click="dialogVisible = false">
        <el-icon><Close /></el-icon>
      </div>
      <SubApp />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { SubApp } from 'frontend-settings'

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const dialogVisible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
});

watch(dialogVisible, (val) => {
  emit('update:modelValue', val);
});
</script>

<style>
.settings-dialog {
  --el-dialog-padding-primary: 0;
}

.settings-dialog :deep(.el-dialog) {
  border-radius: var(--el-dialog-border-radius);
}

.settings-container {
  height: 600px;
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 20px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 999;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #409eff;
}

</style>
