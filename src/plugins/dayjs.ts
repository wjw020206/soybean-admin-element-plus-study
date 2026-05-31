import { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { setDayjsLocale } from '../locales/dayjs';

/** 安装 dayjs 插件 */
export function setupDayjs() {
  // 根据当前语言环境动态获取本地化的星期和月份名称
  extend(localeData);

  setDayjsLocale();
}
