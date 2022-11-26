import { pageConfig, wpCompanyConfig, wpNav, wpFooter, wpSelfSymbolIndex } from '@/api/wpApi'
import { localSet, localGet, getCookie, sessionSet, setCookie, isEmpty } from '@/utils/util'
import { formatPlans } from './storeUtil.js'
import { getThirdLoginConfig } from '@/api/base'

export default {
    namespaced: true,
    state: {
        inited: false, // 配置信息是否获取完成
        wpCompanyInfo: null, //   wordpress公司配置信息
        wpSelfSymbol: [], //   wordpress自选产品配置
        wpProductCategory: [], // wordpress配置的产品板块
        wpNav: null, //   wordpress公司配置信息
        wpFooter: null, //   wordpress公司配置PCUI的页脚信息
        plansNames: {}, // 完成类型，从语言包里面获取
        plans: [], // [{ id: 1, name: 'CFD合约全仓' }, { id: 2, name: 'CFD合约逐仓' }, { id: 3, name: '现货杠杆全仓' }, { id: 9, name: 'ABCC现货撮合' }]
        thirdLoginConfig: []
    },
    mutations: {
        UPDATE_inited (state, data) {
            state.inited = data
        },
        UPDATE_wpCompanyInfo (state, data) {
            if (data.companyId) sessionSet('companyId', data.companyId)
            if (state.wpCompanyInfo) {
                Object.assign(state.wpCompanyInfo, data)
            } else {
                state.wpCompanyInfo = data
            }
        },
        UPDATE_wpNav (state, data) {
            state.wpNav = data
        },
        UPDATE_wpFooter (state, data) {
            state.wpFooter = data
        },
        UPDATE_selfSymbol (state, data) {
            state.wpSelfSymbol = data
        },
        Update_wpProductCategory (state, data = []) {
            state.wpProductCategory = data
        },
        Update_plans (state, data = []) {
            const plansNames = state.plansNames
            data.forEach(el => {
                el.name = plansNames[el.id]
            })
            state.plans = data
        },
        Update_plansNames (state, plansNames) {
            state.plansNames = plansNames
            state.plans.forEach(el => {
                el.name = plansNames[el.id]
            })
        },
        Update_trirdLoginConfig (state, data) {
            state.thirdLoginConfig = data
        }
    },
    actions: {
        // 初始化基础配置信息，如公司配置、底部导航配置、自选产品配置、产品板块配置
        initBaseConfig ({ dispatch, commit }) {
            const baseList = [
                dispatch('getCompanyInfo'),
                dispatch('getChannelSett'),
                dispatch('getNav'),
                dispatch('getWpSelfSymbols'),
                dispatch('getProductCategory')
            ]
            return Promise.all(baseList).then(res => {
                commit('UPDATE_inited', true)
                return dispatch('_quote/setProductAllList', null, { root: true })
            })
        },
        // 获取公司配置信息
        getCompanyInfo ({ commit }) {
            return wpCompanyConfig().then(data => {
                if (data) {
                    commit('UPDATE_wpCompanyInfo', data)
                }
                return data
            })
        },
        // 获取渠道配置信息
        getChannelSett ({ commit }) {
            return pageConfig('ChannelSett').then(data => {
                if (data) {
                    data.customerGroupId = '2' // 游客客户组

                    // 设置玩法别名和排序
                    // data.registList.forEach(el => formatPlans(el.plans || []))
                    if (data.registrable?.length) {
                        data.registrable.forEach(el => {
                            el.countryCode = el.country_code
                        })
                    }

                    sessionSet('utcOffset', 0 - new Date().getTimezoneOffset()) // 改成取本地时区时间，不找wp配置时间
                    // sessionSet('utcOffset', parseFloat(data.utcOffset) * 60)   改成取本地时区时间，不找wp配置时间
                    if (isEmpty(getCookie('lang'))) {
                        setCookie('lang', data.language.val || 'zh-CN', 'y10') // 语言都存储在cookie里面
                    }

                    // 在线客服补充语言参数
                    let onlineService = data.onlineService
                    if (onlineService) {
                        let lang = getCookie('lang') || 'zh-CN'
                        lang = lang.split('-')[0]
                        if (onlineService.indexOf('?') === -1) onlineService += '?_tt=1'
                        onlineService += `&lang=${lang}`
                        data.onlineService = onlineService
                    }
                    commit('UPDATE_wpCompanyInfo', data)

                    // 游客玩法
                    const guestPlans = data.defaultPlans['2']
                    commit('Update_plans', guestPlans)
                    if (data.supportLanguage) commit('Update_supportLanguages', data.supportLanguage, { root: true })
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav ({ commit }) {
            return wpNav().then(data => {
                if (data) commit('UPDATE_wpNav', data)
                return data
            }).catch(err => err)
        },
        // 获取底部页脚配置
        getFooter ({ commit }) {
            return wpFooter().then(data => {
                if (data) commit('UPDATE_wpFooter', data)
                return data
            }).catch(err => err)
        },
        // 获取自选产品配置
        getWpSelfSymbols ({ commit }) {
            return wpSelfSymbolIndex().then(data => {
                if (data) commit('UPDATE_selfSymbol', data)
                return data
            })
        },
        // 获取产品板块
        getProductCategory ({ commit }) {
            return pageConfig('TradeIndex').then(data => {
                if (data) commit('Update_wpProductCategory', data)
                return data
            })
        },
        // 获取页面模块列表
        getPageConfig ({ commit, rootGetters }, pageName) {
            return pageConfig(pageName).then(modulesList => {
                const userAccountType = rootGetters['_user/userAccountType']
                const _result = modulesList.filter(item => {
                    const { accountType, expiryDate } = item.data
                    const hasRole = accountType.includes(userAccountType)
                    const inActiveTime = !expiryDate || expiryDate?.length === 0 ? true : window.dayjs().isBetween(expiryDate[0], expiryDate[1])
                    return hasRole && inActiveTime
                })
                return _result
            })
        },
        // 获取三方登录配置文件
        getLoginConfig ({ state, commit, rootGetters }, pageName) {
            const thirdLoginArr = state.wpCompanyInfo.thirdLogin
            const companyId = state.wpCompanyInfo.companyId

            if (thirdLoginArr && thirdLoginArr.length > 0) {
                return getThirdLoginConfig({
                    companyId,
                    thirdSource: thirdLoginArr.join()
                }).then(res => {
                    if (res.check()) { commit('Update_trirdLoginConfig', res.data) }
                }).catch(err => {
                })
            }
        }
    }
}
