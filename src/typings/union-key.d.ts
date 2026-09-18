/** 联合键命名空间 */
declare namespace UnionKey {
  /**
   * 登录模块
   *
   * - pwd-login：密码登录
   * - code-login：手机验证码登录
   * - register：注册
   * - reset-pwd：重置密码
   * - bind-wechat：绑定微信
   */
  type LoginModule = 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat';

  /** 主题明暗模式 */
  type ThemeScheme = 'light' | 'dark' | 'auto';

  /**
   * 布局模式
   *
   * - vertical：左侧垂直菜单
   * - horizontal：顶部的水平菜单
   * - vertical-mix：左侧两个垂直混合菜单
   * - horizontal-mix：左侧垂直一级菜单和顶部水平子级菜单
   */
  type ThemeLayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

  /**
   * 内容溢出时的滚动模式
   *
   * - wrapper：包装器组件的根元素溢出
   * - content：内容组件溢出
   */
  type ThemeScrollMode = import('@sa/materials').LayoutScrollMode;

  /** 页面过渡动画模式 */
  type ThemePageAnimateMode = 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out' | 'none';

  /**
   * 标签页的模式
   *
   * - Button：按钮样式
   * - Chrome：chrome 风格样式
   *
   * @default chrome
   */
  type ThemeTabMode = import('@sa/materials').PageTabMode;
}
