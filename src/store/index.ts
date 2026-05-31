import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** 设置 Vue store 插件 pinia */
export function setupStore(app: App) {
  const store = createPinia();

  // 安装 store 重置插件
  store.use(resetSetupStore);

  app.use(store);
}
