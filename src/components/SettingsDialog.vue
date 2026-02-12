<template>
  <el-dialog
    v-model="dialogVisible"
    title="系统设置"
    width="900px"
    :modal="true"
    :close-on-click-modal="true"
    destroy-on-close
    :append-to-body="true"
  >
    <div class="settings-container">
      <SubApp />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { SubApp } from 'frontend-next-scaffold'

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

<style scoped>
.settings-container {
  height: 600px;
  width: 100%;
  overflow: hidden;
}

:deep(.el-dialog) {
  --el-dialog-margin-top: 5vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
  flex: 1;
  overflow: hidden;
}

:deep(.el-dialog__footer) {
  display: none;
}
</style>
