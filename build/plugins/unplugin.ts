import path from 'node:path';
import process from 'node:process';
import type { PluginOption } from 'vite';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export function setupUnplugin(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv;

  /** 本地 SVG 图标路径 */
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** 本地图标集的名称（去除 iconify 图标的前缀） */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  const plugins: PluginOption[] = [
    // https://github.com/unplugin/unplugin-icons
    // 配置组件式图标
    Icons({
      // 根据使用的框架配置 compiler
      compiler: 'vue3',
      // 配置加载本地的图标集
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          // 统一成本地 svg 图标组件为可响应字体大小的图标尺寸
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      // 相对于当前字体大小的比例（1em）
      scale: 1,
      // 图标默认使用的类名（这里使用了 Unocss CSS 类名）
      defaultClass: 'inline-block'
    }),
    // https://github.com/unplugin/unplugin-auto-import
    // 配置 API 自动导入
    AutoImport({
      // 配置 API 自动导入的类型文件的生成路径
      dts: 'src/typings/auto-imports.d.ts',
      resolvers: [
        // 自动导入 Element Plus API
        ElementPlusResolver()
      ]
    }),
    // https://github.com/unplugin/unplugin-vue-components
    // 配置组件自动导入
    Components({
      // 配置自动导入组件的类型文件的生成路径
      dts: 'src/typings/components.d.ts',
      // 注册全局组件类型
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          // 加载器提供的自定义集合的名称
          customCollections: [collectionName],
          // 图标组件的前缀
          componentPrefix: VITE_ICON_PREFIX
        })
      ]
    })
  ];

  return plugins;
}
