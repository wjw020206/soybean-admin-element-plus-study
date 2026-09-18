declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    /** 颜色调色板编号类型 */
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

    /** 主题设置 */
    interface ThemeSetting {
      /** 主题明暗模式 */
      themeScheme: UnionKey.ThemeScheme;
      /** 灰度模式 */
      grayscale: boolean;
      /** 色弱模式 */
      colourWeakness: boolean;
      /** 是否推荐颜色 */
      recommendColor: boolean;
      /** 主题颜色 */
      themeColor: string;
      /** 其它颜色 */
      otherColor: OtherColor;
      /** 信息颜色后是否跟随主色 */
      isInfoFollowPrimary: boolean;
      /** 布局 */
      layout: {
        /** 布局模式 */
        mode: UnionKey.ThemeLayoutMode;
        /** 滚动模式 */
        scrollMode: UnionKey.ThemeScrollMode;
        /**
         * 是否反转水平方向的菜单布局
         *
         * 如果为真，则垂直子菜单位于左侧，水平一级菜单位于顶部
         */
        reverseHorizontalMix: boolean;
      };
      /** 页面 */
      page: {
        /** 是否显示页面过渡 */
        animate: boolean;
        /** 页面过渡动画模式 */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** 顶部 */
      header: {
        /** 顶部高度 */
        height: number;
        /** 顶部面包屑 */
        breadcrumb: {
          /** 是否显示面包屑导航 */
          visible: boolean;
          /** 是否显示面包屑图标 */
          showIcon: boolean;
        };
        /** 多种语言 */
        multilingual: {
          /** 是否显示多语言 */
          visible: boolean;
        };
        /** 全局搜索 */
        globalSearch: {
          /** 是否显示全局搜索 */
          visible: boolean;
        };
      };
      /** 标签页 */
      tab: {
        /** 是否显示标签页 */
        visible: boolean;
        /**
         * 是否缓存标签页
         *
         * 如果启用了缓存，页面刷新时标签页将从本地存储获取数据
         */
        cache: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: UnionKey.ThemeTabMode;
      };
      /** 固定页眉和标签页 */
      fixedHeaderAndTab: boolean;
      /** 侧边栏 */
      sider: {
        /** 反色侧边栏 */
        inverted: boolean;
        /** 侧边栏宽度 */
        width: number;
        /** 折叠后的侧边栏宽度 */
        collapsedWidth: number;
        /** 布局为 'vertical-mix' 或 'horizontal-mix' 时的侧边栏宽度 */
        mixWidth: number;
        /** 布局为 'vertical-mix' 或 'horizontal-mix' 时折叠后的侧边栏宽度 */
        mixCollapsedWidth: number;
        /** 布局为 'vertical-mix' 或 'horizontal-mix' 时的子菜单宽度 */
        mixChildMenuWidth: number;
      };
      /** 页脚 */
      footer: {
        /** 是否显示页脚 */
        visible: boolean;
        /** 是否固定页脚 */
        fixed: boolean;
        /** 页脚高度 */
        height: number;
        /** 布局为 'horizontal-mix' 时，页脚是否靠右浮动 */
        right: boolean;
      };
      /** 水印 */
      watermark: {
        /** 是否显示水印 */
        visible: boolean;
        /** 水印文本 */
        text: string;
        /** 是否使用用户名作为水印文本 */
        enableUserName: boolean;
      };
      /** 定义一些主题设置令牌，将转换为 CSS 变量 */
      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    }

    /** 其它颜色类型 */
    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    /** 主题色类型 */
    interface ThemeColor extends OtherColor {
      primary: string;
    }

    /** 主题色类型 key 列表 */
    type ThemeColorKey = keyof ThemeColor;

    /** 主题调色板颜色类型 */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    interface ThemeSettingTokenColor {
      nprogress?: string;
      container: string;
      layout: string;
      inverted: string;
      'base-text': string;
    }
    interface ThemeSettingTokenBoxShadow {
      header: string;
      sider: string;
      tab: string;
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor;
      boxShadow: ThemeSettingTokenBoxShadow;
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** CSS 主题变量 */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string };
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  /**
   * 国际化命名空间
   *
   * 本地化类型
   */
  namespace I18n {
    /** 语言类型 */
    type LangType = 'en-US' | 'zh-CN';

    type Schema = {
      system: {
        title: string;
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    interface $T {
      (key: I18nKey): string;
    }
  }

  /** 网络请求命名空间 */
  namespace Service {
    /** 其它网络请求 key 类型 */
    type OtherBaseURLKey = 'demo';

    interface ServiceConfigItem {
      /** 后端接口请求地址 */
      baseURL: string;
      /** 后端接口请求地址的代理模式 */
      proxyPattern: string;
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    interface ServiceConfig extends ServiceConfigItem {
      other: OtherServiceConfigItem[];
    }

    /** 简单网络请求配置类型 */
    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }
  }
}
