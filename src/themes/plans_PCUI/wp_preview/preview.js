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
import Setup from '../setup'

setRouter(null)
localSet('invertColor', 'light')
setRootVariable(localGet('invertColor'))
if (process.env.NODE_ENV === 'development') window._store = store
async function render (container) {
    const app = createApp(App)
    Setup(app)
    app.use(longpress)
    app.use(store)
    // app.use(router)
    app.use(I18n)
    app.use(VantBase)
    // app.use(LuckDraw)
    app.component('AccountChange', MyAsset)
    app.component('MyAsset', MyAsset)
    app.component('Loading', Loading)

    const defaultLocal = 'zh-CN'
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
        },
        methods: {
            // 用wp配置的URL
            openUrl (toRoute) {
                return false
            },
            // 日期时间格式化
            formatTime (val, fmt = 'YYYY-MM-DD HH:mm:ss') {
                return dayjs(val).format(fmt)
            }
        }
    })

    // 获取到公司配置后初始化vue实例
    app.mount(container)
}
export default render
