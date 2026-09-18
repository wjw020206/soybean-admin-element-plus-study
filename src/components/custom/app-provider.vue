<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue';

defineOptions({ name: 'AppProvider' });

/**
 * 全局反馈 API 注册组件
 *
 * 将 Element Plus 的通知、消息框和消息 API 挂载到 window
 * 供组件外的普通 TypeScript 模块调用，组件本身不渲染可见内容
 */
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    /** 将 Element Plus 反馈 API 注册到全局 window */
    function register() {
      window.$notification = ElNotification;
      window.$messageBox = ElMessageBox;
      window.$message = ElMessage;
    }

    register();

    // 渲染空文本节点，该组件仅用于执行注册逻辑
    return () => createTextVNode();
  }
});
</script>

<template>
  <div class="h-full">
    <ContextHolder />
    <slot />
  </div>
</template>

<style scoped></style>
