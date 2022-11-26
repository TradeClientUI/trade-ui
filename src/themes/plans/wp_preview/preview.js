import { createApp } from 'vue'
import App from './preview.vue'
import store from '@admin/pages/index/store'
import VantBase from '../vantBase'
// import router from '../router'
import I18n, { setI18nLanguage, loadLocaleMessages } from '../i18n/i18n.js'
import { localGet, localSet } from '@utils/index'
import MyAsset from '@index/components/placeholder/placeholder.vue'

import longpress from '@/directives/longpress'
import Loading from '@/components/loading'
import { setRootVariable } from '../colorVariables'
import { setRouter } from '@/utils/request'
// import LuckDraw from 'vue-luck-draw/vue3'

setRouter(null)
localSet('invertColor', 'light')
setRootVariable(localGet('invertColor'))
if (process.env.NODE_ENV === 'development') window._store = store
async function render (container,lang) {
    console.log("lang123",lang)
    const app = createApp(App)
    app.use(longpress)
    app.use(store)
    // app.use(router)
    app.use(I18n)
    app.use(VantBase)
    // app.use(LuckDraw)
    app.component('AccountChange', MyAsset)
    app.component('MyAsset', MyAsset)
    app.component('Loading', Loading)

    const defaultLocal = lang||'zh-CN'
    setI18nLanguage(I18n, defaultLocal)
    await loadLocaleMessages(I18n, defaultLocal)

    app.mixin({
        data () {
            return {
                h5Preview: process.env.VUE_APP_h5Preview,
            }
        },
        computed: {
            $style () {
                return {
                    primary: '#1989fa'
                }
            }
        }
    })

    // 获取到公司配置后初始化vue实例
    app.mount(container,lang)
}
export default render
