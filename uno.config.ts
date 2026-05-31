import { defineConfig, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import { themeVars } from './src/theme/vars';

// https://unocss.dev/config/#configuration
export default defineConfig({
  content: {
    pipeline: {
      // https://unocss.dev/config/#exclude
      /** 扫描文件生成 CSS 时，忽略这些目录 */
      exclude: ['node_modules', 'dist']
    }
  },
  theme: {
    ...themeVars,
    fontSize: {
      /** 自定义图标大小 */
      'icon-xs': '0.875rem', // 14px
      'icon-small': '1rem', // 16px
      icon: '1.125rem', // 18px
      'icon-large': '1.5rem', // 24px
      'icon-xl': '2rem' // 32px
    }
  },
  /** 自定义快捷类 */
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm' // 卡片样式类
  },
  transformers: [
    transformerDirectives(), // 支持 @apply 指令
    transformerVariantGroup() // 支持 CSS 分组写法
  ],
  presets: [
    // 引入 Tailwind CSS / Windi CSS 紧凑预设
    presetWind3({
      /** 暗黑模式选项 */
      dark: 'class'
    }),
    presetSoybeanAdmin()
  ]
});
