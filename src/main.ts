import { createApp } from 'vue';
import './plugins/assets';
import { setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';

async function setupApp() {
  // 初始化首屏加载动画
  setupLoading();

  // 初始化顶部进度条
  setupNProgress();

  // 初始化 Iconify 离线加载图标插件
  setupIconifyOffline();

  // 初始化 dayjs
  setupDayjs();

  const app = createApp(App);

  // 初始化 store
  setupStore(app);

  await setupRouter(app);

  app.mount('#app');
}

setupApp();
