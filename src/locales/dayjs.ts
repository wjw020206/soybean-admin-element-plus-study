import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { locale } from 'dayjs';
import { localStg } from '@/utils/storage';

/** 设置 dayjs 语言 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-CN') {
  const localMap = {
    'zh-CN': 'zh-cn',
    'en-US': 'en'
  } satisfies Record<App.I18n.LangType, string>;

  const l = lang || localStg.get('lang') || 'zh-CN';

  locale(localMap[l]);
}
