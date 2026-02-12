<template>
  <el-dialog
    v-model="dialogVisible"
    title="系统设置"
    width="90%"
    :modal="true"
    :close-on-click-modal="true"
    destroy-on-close
    class="settings-dialog"
    :append-to-body="true"
  >
    <div class="settings-container">
      <AdminLayout @close="closeSettings" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { AdminLayout } from '@next/embed';

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

const closeSettings = () => {
  dialogVisible.value = false;
};
</script>

<style>
.settings-dialog {
  --ep-dialog-margin-top: 5vh;
}

.settings-dialog .ep-dialog {
  height: 80vh;
  max-height: 800px;
}

.settings-dialog .ep-dialog__body {
  padding: 0;
  height: calc(100% - 56px);
}

.settings-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
