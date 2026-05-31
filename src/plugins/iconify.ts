import { addAPIProvider } from '@iconify/vue';

/** 安装 Iconify 离线加载图标插件 */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env;

  if (VITE_ICONIFY_URL) {
    // 配置自定义图标库的资源地址
    addAPIProvider('', {
      resources: [VITE_ICONIFY_URL]
    });
  }
}
