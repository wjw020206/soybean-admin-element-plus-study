import { ref } from 'vue';
import { defineStore } from 'pinia';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  return {
    locale
  };
});
