import { createApp } from 'vue'
import '@/utils/dayjs'
import App from './App.vue'
import router from './router'
import store from './store'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import VantBase from './vantBase'
import MixinGlobal from './mixin'
import { Dialog } from 'vant'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import FindCustomerInfo from '@plans/plugins/findCustomerInfo'
import Loading from '@/components/loading'
import PageComp from '@plans/components/PageComp'
import LayoutTop from '@plans/layout/top'
import { setRootVariable } from './colorVariables'
import { setRouter, modifybaseURL } from '@/utils/request'
// import LuckDraw from 'vue-luck-draw/vue3'
import { getLoginParams, getQueryVariable, getToken, setToken, isEmpty, removeLoginParams, checkUserKYC, localGet, localSet, getCookie, sessionSet, getQueryString, localRemove, localSetObj } from '@/utils/util'
import BigNumber from 'bignumber.js'
import preventReClick from '@/directives/preventReClick'
import positiveNumber from '@/directives/positiveNumber'
// import { skywalkingRegister, skywalkingRreportErrors } from './skywalkingSteup.js'
import { getPreDemoAccountParams } from './officialDemoAccount.js'
import { requestBusinessConfig } from '@/api/wpApi'
// import VConsole from 'vconsole' // 调试工具

// const Vconsole = new VConsole()
const isProduction = process.env.NODE_ENV === 'production'

BigNumber.config({ EXPONENTIAL_AT: [-16, 26] })

sessionSet('entrySearch', location.search) // 缓存入口url的参数，给注册开会来源使用
if (getQueryVariable('tsource')) setToken(getQueryVariable('tsource'))

// 支持uniapp嵌套首页时区分真实模拟首页
const accountType = getQueryVariable('accountType')
const demoDomain = getQueryVariable('demoDomain')
if (accountType && demoDomain) {
    localSetObj('mockAccount', 'demo_domain', decodeURIComponent(demoDomain))
    localSetObj('mockAccount', 'lastAccountType', accountType)
}

const app = createApp(App)
app.use(preventReClick).use(positiveNumber)
app.use(VantBase).use(I18n).use(store).use(router)
// app.use(LuckDraw)
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

if (token) store.commit('_user/Update_loginLoading', true)
else if (location.search.includes('from=officialWebsite')) loginParams = getPreDemoAccountParams() // 从官网过来自动分配pre的Demo账号

// 加载业务渠道自定义配置json
requestBusinessConfig().then(res => {
    store.commit('Update_businessConfig', res)
})

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(async () => {
    // if (isProduction) skywalkingRegister(router)
    if (!isProduction) modifybaseURL(store.state._base.wpCompanyInfo.apiService)

    // 注册websocket插件
    app.use(Socket, { $store: store, $router: router })

    // 设置语言
    const langLocal = getCookie('lang') || getQueryString('lang') || 'en-US'
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
        const proArr = []
        Object.keys(systemOptional).forEach(el => {
            if (Object.keys(systemOptional[el]).find(it => it === '2')) { // 普通游客选取客户组为2的数据加载到本地自选缓存中
                systemOptional[el][2].forEach(item => {
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
