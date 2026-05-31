declare namespace App {
  /** 主题命名空间 */
  namespace Theme {
    /** 颜色调色板编号类型 */
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

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
