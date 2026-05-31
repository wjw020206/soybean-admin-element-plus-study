import path from 'node:path';
import process from 'node:process';
import { presetIcons } from 'unocss';
import unocss from 'unocss/vite';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

/** 安装 Unocss */
export function setupUnocss(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  /** 本地 SVG 图标路径 */
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** 本地图标集的名称（去除 iconify 图标的前缀） */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  return unocss({
    presets: [
      // 配置 unocss 类名式图标
      // https://unocss.dev/presets/icons#options
      presetIcons({
        prefix: `${VITE_ICON_PREFIX}-`,
        // 相对于当前字体大小的比例（1em）
        scale: 1,
        // 应用于生成 CSS 的额外 CSS 属性
        extraProperties: {
          display: 'inline-block'
        },
        // 配置加载本地的图标集
        collections: {
          [collectionName]: FileSystemIconLoader(
            localIconPath,
            // 统一成本地 svg 图标组件为可响应字体大小的图标尺寸
            svg => svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        // 当匹配到缺失的图标时发出警告
        warn: true
      })
    ]
  });
}
