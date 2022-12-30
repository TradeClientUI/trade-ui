import { createApp } from 'vue'
import App from './App.vue'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import { getCookie, getQueryString } from '@/utils/util'

const app = createApp(App)
app.use(I18n)

const langLocal = getCookie('lang') || getQueryString('lang') || 'en-US'
setI18nLanguage(I18n, langLocal)
loadLocaleMessages(I18n, langLocal)

app.mount('#app')
