import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  });

  return {
    userInfo
  };
});
