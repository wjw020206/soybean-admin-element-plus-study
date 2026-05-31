import type { ProxyOptions } from 'vite';
import { bgRed, bgYellow, green, lightBlue } from 'kolorist';
import { consola } from 'consola';
import { createServiceConfig } from '../../src/utils/service';

/** 创建 Vite 代理配置
 * @param viteEnv Vite 环境变量
 * @param enable 是否启用代理
 */
export function createViteProxy(viteEnv: Env.ImportMeta, enable: boolean) {
  /** 开发模式下是否启用 HTTP 代理 */
  const isEnableHttpProxy = enable && viteEnv.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  /** 是否在终端中显示代理日志 */
  const isEnableProxyLog = viteEnv.VITE_PROXY_LOG === 'Y';

  const { baseURL, proxyPattern, other } = createServiceConfig(viteEnv);

  const proxy: Record<string, ProxyOptions> = createProxyItem(
    {
      baseURL,
      proxyPattern
    },
    isEnableProxyLog
  );

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item, isEnableProxyLog));
  });

  return proxy;
}

/** 创建代理配置项 */
function createProxyItem(item: App.Service.ServiceConfigItem, enableLog: boolean) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    /** 重新请求路径，实际请求时不拼接代理模式路径 */
    rewrite: path => path.replace(new RegExp(`${item.proxyPattern}`), ''),
    /** 配置代理服务器（例如，监听事件） */
    configure: (_proxy, options) => {
      /** 代理请求监听，用于配置代理请求日志 */
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        // 判断代理日志是否启用
        if (!enableLog) return;

        /** 代理请求路径 */
        const requestUrl = `${lightBlue('[proxy url]')}: ${bgYellow(`${req.method}`)} ${green(`${item.proxyPattern}${req.url}`)}`;
        /** 真是请求路径 */
        const proxyUrl = `${lightBlue('[real request url]')}: ${green(`${options.target}${req.url}`)}`;
        consola.log(`${requestUrl}\n${proxyUrl}`);
      });
      _proxy.on('error', (_err, req, _res) => {
        // 判断代理日志是否启用
        if (!enableLog) return;
        consola.log(bgRed(`Error: ${req.method} `), green(`${options.target}${req.url}`));
      });
    }
  };

  return proxy;
}
