/** 生成主题色的 CSS 变量映射表
 * 将基础色（primary/info/success/warning/error）及其色阶（50 ~ 950）
 * 转换为可用于主题变量的 rgb(var(--xxx)) 形式
 */
function createColorPaletteVars() {
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  const colorPaletteNumbers: App.Theme.ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  colors.forEach(color => {
    colorPaletteVar[color] = `rgb(var(--${color}-color))`;
    colorPaletteNumbers.forEach(number => {
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`;
    });
  });

  return colorPaletteVar;
}

const colorPaletteVars = createColorPaletteVars();

/** 主题变量 */
export const themeVars: App.Theme.ThemeTokenCSSVars = {
  colors: {
    ...colorPaletteVars,
    /** 进度条颜色 */
    nprogress: 'rgb(var(--nprogress-color))',
    /** 容器背景色 */
    container: 'rgb(var(--container-bg-color))',
    /** 布局背景色 */
    layout: 'rgb(var(--layout-bg-color))',
    /** 反色背景色 */
    inverted: 'rgb(var(--inverted-bg-color))',
    /** 基础文本颜色 */
    'base-text': 'rgb(var(--base-text-color))'
  },
  boxShadow: {
    /** 顶部区域阴影 */
    header: 'var(--header-box-shadow)',
    /** 侧边栏区域阴影 */
    sider: 'var(--siderbox-shadow)',
    /** 标签栏区域阴影 */
    tab: 'var(--tab-box-shadow)'
  }
};
