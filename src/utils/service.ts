import json5 from 'json5';

/** 创建网络请求配置
 * @param viteEnv Vite 环境变量
 */
export function createServiceConfig(viteEnv: Env.ImportMeta) {
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = viteEnv;

  let other = {} as Record<App.Service.OtherBaseURLKey, string>;

  try {
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
  }

  /** 网络请求配置 */
  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  /** 获取其它网络请求配置 key */
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    };
  });

  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  };

  return config;
}

/** 创建请求地址的代理模式
 * @param key 如果未设置，则使用默认模式
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  if (!key) {
    return `/proxy-default`;
  }

  return `/proxy-${key}`;
}
