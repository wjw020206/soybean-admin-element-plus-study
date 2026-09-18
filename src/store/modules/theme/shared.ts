import defu from 'defu';
import { localStg } from '@/utils/storage';
import { overrideThemeSettings, themeSettings } from '@/theme/settings';

/** 初始化主题设置 */
export function initThemeSettings() {
  const isProd = import.meta.env.NODE === 'prod';

  // 在开发模式下，主题设置不会被缓存；如需更新主题设置，请修改 `src/theme/settings.ts` 中的 `themeSettings`
  if (!isProd) return themeSettings;

  // 如果处于生产模式，主题设置将缓存在 localStorage 中
  // 如果需要在发布新版本时更新主题设置，请修改 `src/theme/settings.ts` 中的 `overrideThemeSettings`

  const localSettings = localStg.get('themeSettings');

  // 使用 defu 递归合并主题配置对象
  let settings = defu(localSettings, themeSettings);

  // 判断是否需要主题覆盖
  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME;

  if (!isOverride) {
    // 每次发布新版本后，只执行一次主题配置覆盖，避免用户旧的本地主题配置阻止新配置生效
    settings = defu(overrideThemeSettings, settings);
    localStg.set('overrideThemeFlag', BUILD_TIME);
  }

  return settings;
}
