<script setup lang="ts">
import { computed } from 'vue';
import type { WatermarkProps } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import { useAppStore } from './store/modules/app';
import { useThemeStore } from './store/modules/theme';
import { UILocales } from './locales/ui';
import { useAuthStore } from './store/modules/auth';

defineOptions({ name: 'App' });

const appStore = useAppStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

/** 当前显示语言 */
const locale = computed(() => {
  return UILocales[appStore.locale];
});

/** 水印相关参数 */
const watermarkProps = computed<WatermarkProps>(() => {
  // 判断水印内容是用户名还是默认文本
  const content =
    themeStore.watermark.enableUserName && authStore.userInfo.userName
      ? authStore.userInfo.userName
      : themeStore.watermark.text;

  return {
    content: themeStore.watermark.visible ? content : '', // 判断是否显示水印
    font: {
      fontSize: 16 // 水印字体大小
    },
    gap: [100, 120], // 水印之间的间距
    rotate: -15, // 水印的旋转角度, 单位 °
    zIndex: 9999 // 水印元素的 z-index 值
  };
});
</script>

<template>
  <ElConfigProvider :locale="locale">
    <AppProvider>
      <ElWatermark class="h-full" v-bind="watermarkProps">
        <RouterView class="bg-layout" />
      </ElWatermark>
    </AppProvider>
  </ElConfigProvider>
</template>

<style scoped></style>
