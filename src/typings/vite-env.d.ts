/**
 * 命名空间 Env
 *
 * 用来声明 import.meta 对象的类型
 */
declare namespace Env {
  /** 路由的历史记录模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  /** import.meta 的接口类型 */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ImportMeta extends ImportMetaEnv {
    /** 应用基础路径 */
    readonly VITE_BASE_URL: string;
    /** 应用标题 */
    readonly VITE_APP_TITLE: string;
    /** 路由的历史记录模式 */
    readonly VITE_ROUTER_HISTORY_MODE: RouterHistoryMode;
    /** iconify 图标的前缀 */
    readonly VITE_ICON_PREFIX: string;
    /** 本地 SVG 图标组件的前缀 */
    readonly VITE_ICON_LOCAL_PREFIX: string;
    /** 后端服务基本 URL */
    readonly VITE_SERVICE_BASE_URL: string;
    /** 是否生成 source map 文件 */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo;
    /**
     * 其他后端服务的基本 URL
     * 该值为 JSON5 格式
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string;
    /**
     * Iconify API 提供程序 URL
     *
     * 如果项目部署在内网，您可以将 API 提供程序 URL 设置为本地 Iconify 服务器
     *
     * @link https://iconify.design/docs/api/providers.html
     */
    readonly VITE_ICONIFY_URL: string;
    /** 开发模式下是否启用 HTTP 代理 */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo;
    /** 存储键键前缀，用于区分不同域的存储 */
    readonly VITE_STORAGE_PREFIX?: string;
    /** 是否在终端中显示代理 URL 日志 */
    readonly VITE_PROXY_LOG?: CommonType.YesOrNo;
    /** 配置开发工具中打开代码所使用的编辑器 */
    readonly VITE_DEVTOOLS_LAUNCH_EDITOR?: import('vite-plugin-vue-devtools').VitePluginVueDevToolsOptions['launchEditor'];
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
