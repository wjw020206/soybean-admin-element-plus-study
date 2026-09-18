declare namespace StorageType {
  interface Local {
    /** i18n 语言 */
    lang: App.I18n.LangType;
    /** 主题颜色 */
    themeColor: string;
    /** 是否暗黑模式 */
    darkMode: boolean;
    /** 主题设置 */
    themeSettings: App.Theme.ThemeSetting;
    /**
     * 主题覆盖标志
     *
     * 该值为项目的构建时间
     */
    overrideThemeFlag: string;
  }
}
