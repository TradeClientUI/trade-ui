import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { Locale } from 'vant';
// import zhCN_common from '../../../themeCommon/i18n/zh-CN.json'
// import zhCN from './zh-CN.json'
import {getCookie} from '@/utils/util';
import { deepAssign} from 'vant/lib/utils/deep-assign'

const defaultLocal = getCookie('lang')

const i18n = setupI18n(defaultLocal)

export default i18n

export function setupI18n(locale) {
    const i18n = createI18n({ locale })
    setI18nLanguage(i18n, locale)
    return i18n
}

export function setI18nLanguage(i18n, locale) {
    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
    /**
     * NOTE:
     * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
     * The following is an example for axios.
     *
     * axios.defaults.headers.common['Accept-Language'] = locale
     */
    document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
    // 设置vant组件的国际化
    const vant_local = await import(/* webpackChunkName: "vant-[request]" */ `vant/es/locale/lang/${locale}.js`)
    Locale.use(locale, vant_local.default);

    // load locale messages with dynamic import
    const messages = await import(/* webpackChunkName: "locale-[request]" */ `./${locale}.json`)
    const commonMessages = await import(/* webpackChunkName: "locale-[request]" */ `@/themeCommon/i18n/${locale}.json`)
    const bsMessages = await import(/* webpackChunkName: "locale-[request]" */ `@/business/i18n/${locale}.json`)
    const newMessages = Object.assign({},commonMessages.default, messages.default)
    const resultMessages = deepAssign(newMessages, bsMessages.default)
    // set locale and locale message
    i18n.global.setLocaleMessage(locale, resultMessages)

    return nextTick()
}
