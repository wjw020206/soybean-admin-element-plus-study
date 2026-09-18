import type { RouteMeta } from 'vue-router';
import ElegantVueRouter from '@elegant-router/vue/vite';
import type { RouteKey } from '@elegant-router/types';

export function setupElegantRouter() {
  return ElegantVueRouter({
    /** 路由布局的名称和文件路径 */
    layouts: {
      base: 'src/layouts/base-layout/index.vue',
      blank: 'src/layouts/blank-layout/index.vue'
    },
    /**
     * 定义自定义路由，该路由仅生成路由声明
     * 自定义路由的名称路径映射或名称，如果仅提供名称，则会根据路由名称生成路径
     */
    customRoutes: {
      names: []
    },
    /** 转换路由路径
     * @param routeName 当前路由名称
     * @param routePath 插件原本准备生成的路径
     * @returns 最终使用的路由路径
     */
    routePathTransformer(_, routePath) {
      return routePath;
    },
    /** 路由元生成器
     * @param routeName 当前路由名称
     */
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey;

      const constantRoutes: RouteKey[] = [];

      const meta: Partial<RouteMeta> = {
        title: key,
        i18nKey: `route.${key}` as App.I18n.I18nKey
      };

      if (constantRoutes.includes(key)) {
        meta.constant = true;
      }

      return meta;
    }
  });
}
