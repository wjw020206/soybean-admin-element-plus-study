import type { Ref } from 'vue';
import { ref, toRefs } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { initThemeSettings } from './shared';

export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  /** 主题配置 */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());

  return {
    ...toRefs(settings.value) // 解构主题配置对象属性，同时保留响应性
  };
});
