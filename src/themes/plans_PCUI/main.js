import { createApp } from 'vue'
import '@vant/touch-emulator'
import '@/utils/dayjs'
import App from './App.vue'
import router from './router'
import store from './store'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import VantBase from './vantBase'
import MixinGlobal from './mixin'
import { Dialog } from 'vant'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import FindCustomerInfo from '@planspc/plugins/findCustomerInfo'
import Loading from '@/components/loading'
import PageComp from '@planspc/components/PageComp'
import LayoutTop from '@planspc/layout/centerViewTop'
import { setRootVariable } from './colorVariables'
import { setRouter, setStore, modifybaseURL } from '@/utils/request'
import { getLoginParams, getToken, isEmpty, removeLoginParams, checkUserKYC, localGet, localSet, getCookie, sessionSet, localRemove } from '@/utils/util'
import BigNumber from 'bignumber.js'
import preventReClick from '@/directives/preventReClick'
import positiveNumber from '@/directives/positiveNumber'
// import { skywalkingRegister, skywalkingRreportErrors } from './skywalkingSteup.js'
import { getPreDemoAccountParams } from './officialDemoAccount.js'
import Setup from './setup'
import { requestBusinessConfig } from '@/api/wpApi'
import 'element-plus/theme-chalk/dark/css-vars.css'

const isProduction = process.env.NODE_ENV === 'production'

BigNumber.config({ EXPONENTIAL_AT: [-16, 26] })

sessionSet('entrySearch', location.search) // 缓存入口url的参数，给注册开会来源使用

// 调试工具
// import VConsole from 'vconsole'
// const Vconsole = new VConsole()

const app = createApp(App)
Setup(app)
app.use(preventReClick).use(positiveNumber)
app.use(VantBase).use(I18n).use(store).use(router)
app.use(FindCustomerInfo, { $store: store, $router: router, $I18n: I18n })
app.component('Loading', Loading)
app.component('LayoutTop', LayoutTop)
app.component('PageComp', PageComp)
app.mixin(MixinGlobal)

app.config.errorHandler = (err, vm, info) => {
    // 处理错误  `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    console.error(err, vm, info)
    // skywalkingRreportErrors(err)
}
// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
let loginParams = getLoginParams()
if (loginParams) localRemove('loginParams') // 删除之前缓存登录密码

const token = getToken()

// 设置默认主题色
if (isEmpty(localGet('invertColor'))) {
    localSet('invertColor', 'night') // 默认黑色主题
}

setRouter(router)
setStore(store)
setRootVariable(localGet('invertColor'))

if (token) store.commit('_user/Update_loginLoading', true)
else if (location.search.includes('from=officialWebsite')) loginParams = getPreDemoAccountParams() // 从官网过来自动分配pre的Demo账号

// 加载业务渠道自定义配置json
requestBusinessConfig().then(res => {
    store.commit('Update_businessConfig', res)
    store.dispatch('_base/checkGeoipCountry')
})

window.isPC = process.env.VUE_APP_theme === 'plans_PCUI'
window.store = store

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(async () => {
    store.dispatch('_base/getFooter')
    // if (isProduction) skywalkingRegister(router)
    if (!isProduction) modifybaseURL(store.state._base.wpCompanyInfo.apiService)

    // 注册websocket插件
    app.use(Socket, { $store: store, $router: router })

    // 设置语言
    const langLocal = getCookie('lang') || 'zh-CN'
    setI18nLanguage(I18n, langLocal)
    await loadLocaleMessages(I18n, langLocal)

    // 设置玩法别名
    const { tm } = I18n.global
    const tradeTypesConfig = store.state._base.wpCompanyInfo?.tradeTypesConfig || {}
    const tradeTypesConfigLocal = tradeTypesConfig[langLocal] || {}
    const tradeTypeClone = tm('tradeType')
    Object.keys(tradeTypesConfigLocal).forEach(el => {
        if (tradeTypesConfigLocal[el]) tradeTypeClone[el] = tradeTypesConfigLocal[el]
    })
    store.commit('_base/Update_plansNames', tradeTypeClone)

    // 获取设置系统推送的自选产品加入到本地缓存
    const localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
    if (localSelfSymbolList.length === 0) {
        const systemOptional = store.state._base.wpSelfSymbol[0].data.product
        console.log(systemOptional)
        const proArr = []
        Object.keys(systemOptional).forEach(el => {
            if (Object.keys(systemOptional[el]).find(it => it === '2')) { // 普通游客选取客户组为2的数据加载到本地自选缓存中
                systemOptional[el]['2'].forEach(item => {
                    proArr.push(item + '_' + el)
                })
            }
        })
        if (proArr) {
            localSet('localSelfSymbolList', JSON.stringify(proArr))
            store.dispatch('_user/queryLocalCustomerOptionalList', proArr)
        }
    }

    // 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
    if (token) {
        Promise.resolve().then(() => {
            return store.dispatch('_user/findCustomerInfo')
        }).then(res => {
            if (typeof (res.check) === 'function' && res.check()) {
                checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
            } else if (res.invalid && res.invalid()) {
                removeLoginParams()
                return false
            }
            // 登录消息websocket
            MsgSocket.subscribedListAdd(function () {
                MsgSocket.login()
            })
        })
    } else {
        store.dispatch('_quote/querySymbolBaseInfoList', null)
    }

    app.mount('#app')
})
