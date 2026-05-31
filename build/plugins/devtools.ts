import VueDevTools from 'vite-plugin-vue-devtools';

/** 安装 Vue 开发者工具 */
export function setupDevToolsPlugin(viteEnv: Env.ImportMeta) {
  const { VITE_DEVTOOLS_LAUNCH_EDITOR } = viteEnv;

  return VueDevTools({
    launchEditor: VITE_DEVTOOLS_LAUNCH_EDITOR
  });
}
