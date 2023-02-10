import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'
import Web3 from '@/store/modules/web3'
import Home from './modules/home'
import { getListByParentCode, getCountryListByParentCode, findCompanyCountry } from '@/api/base'
import Colors from '@planspc/colorVariables'
import { localGet, localSet } from '@/utils/util'
import CheckAPI from '@/utils/checkAPI'
import Activity from '@/store/modules/activity'

const style = {
    ...Colors
}
const supportLanguages = [
    { val: 'zh-CN', name: '中文' },
    { val: 'zh-HK', name: '中文繁体' },
    { val: 'en-US', name: 'English' },
]

export default createStore({
    modules: {
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
        _web3: Web3,
        home: Home,
        _activity: Activity
    },
    state: {
        style,
        disabledSuccAnimtion: false,
        invertColor: localGet('invertColor') || 'light', // 黑夜模式
        zoneList: [],
        bankDict: [],
        supportLanguages: supportLanguages,
        countryList: [], // 个人登录开户的国家列表
        countryListAll: [], // 总的国家列表
        companyCountry: '', // 企业登录开户的国家列表， 逗号隔开的国家编码列表 "CN,GB,BG"
        cacheViews: ['Layout'],
        currencyList: [],
        stopLossPprofitProductID: '', // 用于止损止盈弹层
        businessConfig: '', // 业务渠道自定义配置
    },
    getters: {
        productActived (state) {
            const cur = state._quote.productMap[state._quote.productActivedID]
            return cur
        },
        customerGroupId (state) { // 用户组ID
            return state._user.customerInfo?.customerGroupId ?? state._base.wpCompanyInfo?.customerGroupId
        },
        // 用户自选列表
        userSelfSymbolList (state, getters,) {
            if (state._user.customerInfo?.optional === 1) {
                // return state._user.selfSymbolList
                const selfSymbolList = state._user.selfSymbolList
                const result = {}
                Object.keys(selfSymbolList).forEach(el => {
                    result[el] = selfSymbolList[el].map(item => item.symbolId)
                })
                return result
            } else {
                const wpSelfSymbol = state._base.wpSelfSymbol
                const selfSymbolData = wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data?.product || {}
                const customerGroupId = getters.customerGroupId
                const newSelfSymbolData = {}
                Object.keys(selfSymbolData).forEach(el => {
                    newSelfSymbolData[el] = selfSymbolData[el][customerGroupId] ?? []
                })
                return newSelfSymbolData
            }
        },
        // 用户产品板块
        userProductCategory (state, getters) {
            const customerGroupId = getters.customerGroupId
            const wpProductCategory = state._base.wpProductCategory
            const quoteListConfig = wpProductCategory.find(el => el.tag === 'quoteList')
            if (!quoteListConfig) return {}
            const categories = quoteListConfig.data.tradeTypeBlock || {}
            Object.keys(categories).forEach(tradeType => {
                categories[tradeType].forEach(el => {
                    el.listByUser = el.list[customerGroupId] ?? []
                })
            })
            return categories
        },
        stopLossPprofitProduct (state, getters, rootState) {
            const productID = state.stopLossPprofitProductID
            const product = rootState._quote.productMap[productID]
            return product
        },
        // 企业登录开户的国家列表
        companyCountryList (state, getters) {
            const companyCountry = state.companyCountry?.split(',') || []
            const result = state.countryListAll.filter(el => companyCountry.find(o => o === el.code))
            result.sort((a, b) => {
                return a.displayName.localeCompare(b.displayName, 'zh')
            })
            return result
        },
        // 获取当前玩法
        getCurrentTradeType: (state) => (tradeType) => {
            let result = Number(tradeType)
            const plans = state._base.plans
            const item = plans.find(el => Number(el.tradeType) === Number(tradeType))
            if (!item) {
                result = Number(plans[0].tradeType)
            }
            return result
        },
        // 是否显示全仓玩法真实模拟净值
        showFullNetAsset (state) {
            const plans = state._base.plans
            const item = plans.find(el => Number(el.tradeType) === 1)
            if (plans.length === 1 && item) {
                return true
            } else {
                return false
            }
        }
    },
    mutations: {
        Update_style (state, data) {
            state.style = data
        },
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        },
        Update_zoneList (state, list) {
            state.zoneList = list
        },
        Update_bankList (state, list) {
            state.bankDict = list
        },
        Update_countryList (state, list) {
            state.countryList = list
        },
        Update_countryListAll (state, list) {
            state.countryListAll = list
        },
        Update_companyCountryList (state, list) {
            state.companyCountry = list
        },
        Update_invertColor (state, data) {
            state.invertColor = data
            localSet('invertColor', data)
        },
        add_cacheViews (state, routeName) {
            if (!routeName) return false
            if (state.cacheViews.indexOf('Layout') === -1) state.cacheViews.push('Layout')
            if (state.cacheViews.includes(routeName)) return false
            state.cacheViews.push(routeName)
        },
        del_cacheViews (state, routeName) {
            if (!routeName) return false
            const _index = state.cacheViews.findIndex(el => el === routeName)
            if (_index > -1) {
                state.cacheViews.splice(_index, 1)
            }
        },
        Update_disabledSuccAnimtion (state, data) {
            state.disabledSuccAnimtion = data
        },
        Update_currencyList (state, data) {
            state.currencyList = data
        },
        Update_supportLanguages (state, data) {
            state.supportLanguages = data
        },
        Update_stopLossPprofitProductID (state, data) {
            state.stopLossPprofitProductID = data
        },
        Update_businessConfig (state, data) {
            state.businessConfig = data
        }
    },
    actions: {
        // 获取国家验区号
        getListByParentCode ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'phone_code' }).then(res => {
                if (res.check()) {
                    // res.data.forEach(el => {
                    //     el.name += ' ' + el.code
                    // })
                    commit('Update_zoneList', res.data)
                }
                return res
            })
        },
        getBankDictList ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'common_bank_list' }).then(res => {
                if (res.check()) {
                    commit('Update_bankList', res.data)
                }
                return res
            })
        },
        // 获取国家列表
        getCountryListByParentCode ({ dispatch, commit, state }, params = {}) {
            // 默认读缓存的国家列表 force 是否强制读接口  type 0 全部 1 可注册的国家列表
            const { force = false, type = 0 } = params
            if (force === false) {
                if (type === 1 && state.countryList.length > 0) {
                    return Promise.resolve(new CheckAPI({
                        data: state.countryList,
                        code: '0'
                    }))
                } else if (type === 0 && state.countryListAll.length > 0) {
                    return Promise.resolve(new CheckAPI({
                        data: state.countryListAll,
                        code: '0'
                    }))
                }
            }
            return getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    // 排序
                    const data = [...res.data]
                    data.sort((a, b) => {
                        return a.displayName.localeCompare(b.displayName, 'zh')
                    })
                    const countryList = []
                    const registrable = (state._base.wpCompanyInfo?.registrable || []).map((item) => item.code)
                    const countryListAll = data.map((item) => {
                        // 只展示能注册的国家区号，过滤countryCode不存在的代号
                        item = {
                            ...item,
                            formatName: item.displayName + ' (' + item.countryCode + ')',
                        }
                        if (item.countryCode && (registrable.length === 0 || (registrable.length && registrable.includes(item.code)))) {
                            countryList.push(item)
                        }
                        return item
                    })
                    commit('Update_countryList', countryList)
                    commit('Update_countryListAll', countryListAll)
                    return new CheckAPI({
                        data: countryListAll,
                        code: '0'
                    })
                }
                return res
            })
        },
        // 获取白标公司企业开户的国家列表
        getCompanyCountry ({ dispatch, commit, state }) {
            return findCompanyCountry().then(res => {
                if (res.check()) {
                    commit('Update_companyCountryList', res.data?.openCompanyCountry)
                }
                return res
            })
        },
        getCurrencyList ({ dispatch, commit, state }, params) {
            return getListByParentCode(
                { parentCode: params || 'digit_wallet_withdraw_currency' }).then(res => {
                if (res.check()) {
                    if (params) {
                        state.currencyList.map(item => {
                            if (item.name === params) {
                                item.subList = res.data
                            }
                        })
                        // currencyObj.subList = res.data
                        // commit('Update_currencyList', currencyObj)
                        return
                    }
                    commit('Update_currencyList', res.data)
                }
                return res
            })
        }

    }
})
