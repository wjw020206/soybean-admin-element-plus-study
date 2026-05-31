import type { Plugin } from 'vite';

/** 为 html 增加构建时间插件 */
export function setupHtmlPlugin(buildTime: string) {
  const plugin: Plugin = {
    name: 'html-plugin',
    /** 仅在 build 模式时调用 */
    apply: 'build',
    /** 转换 index.html 的专用钩子 */
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`);
    }
  };

  return plugin;
}
