import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import progress from 'vite-plugin-progress';
import { setupUnocss } from './unocss';
import { setupUnplugin } from './unplugin';
import { setupHtmlPlugin } from './html';
import { setupDevToolsPlugin } from './devtools';

/** 安装 Vite 插件 */
export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugins: PluginOption = [
    vue(),
    setupDevToolsPlugin(viteEnv),
    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    // 打包时在终端展示进度条
    progress(),
    // 打包时在 HTML head 的 meta 中添加构建时间
    setupHtmlPlugin(buildTime)
  ];

  return plugins;
}
