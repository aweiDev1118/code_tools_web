import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import en from './locales/en'
import ja from './locales/ja'
import ko from './locales/ko'
import vi from './locales/vi'
import toolsGroup1 from './locales/_tools_group1'
import toolsGroup2 from './locales/_tools_group2'
import toolsGroup3 from './locales/_tools_group3'

export type LocaleKey = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'vi'

export const localeOptions: { value: LocaleKey; label: string; flag: string }[] = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'zh-TW', label: '繁體中文', flag: '🇭🇰' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
]

function mergeToolMessages(
  base: Record<string, unknown>,
  ...groups: Array<Record<string, Record<string, unknown>>>
): Record<string, unknown> {
  const tool = { ...(base.tool as Record<string, unknown> || {}) }
  for (const group of groups) {
    for (const [key, value] of Object.entries(group)) {
      const existing = tool[key] as Record<string, unknown> | undefined
      tool[key] = existing ? { ...existing, ...value } : { ...value }
    }
  }
  return { ...base, tool }
}

const savedLocale = (localStorage.getItem('locale') as LocaleKey) || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': mergeToolMessages(zhCN, toolsGroup1['zh-CN'], toolsGroup2['zh-CN'], toolsGroup3['zh-CN']),
    'zh-TW': mergeToolMessages(zhTW, toolsGroup1['zh-TW'], toolsGroup2['zh-TW'], toolsGroup3['zh-TW']),
    en: mergeToolMessages(en, toolsGroup1['en'], toolsGroup2['en'], toolsGroup3['en']),
    ja: mergeToolMessages(ja, toolsGroup1['ja'], toolsGroup2['ja'], toolsGroup3['ja']),
    ko: mergeToolMessages(ko, toolsGroup1['ko'], toolsGroup2['ko'], toolsGroup3['ko']),
    vi: mergeToolMessages(vi, toolsGroup1['vi'], toolsGroup2['vi'], toolsGroup3['vi']),
  },
})

export function setLocale(locale: LocaleKey) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

export default i18n
