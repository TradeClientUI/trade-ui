// export default i18n
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import {getCookie} from '@/utils/util';

const defaultLocal = getCookie('lang') || 'zh-CN'
const i18n = setupI18n(defaultLocal)

export default i18n

export function setupI18n(locale) {
    //const messages = loadLocaleMessages();
    const i18n = createI18n({ locale})
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
    const messages = await import(/* webpackChunkName: "locale-[request]" */ `./${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages)

    return nextTick()
}
