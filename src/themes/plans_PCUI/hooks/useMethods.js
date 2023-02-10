import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { localGetJSON, localSetObj, sessionSet, setToken } from '@/utils/util'
import { switchUserAccount } from '@/api/user'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket, connectMsgWS } from '@/plugins/socket/socket'
import { geoipCountry } from '@/api/base'

export default function () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const businessConfig = computed(() => store.state.businessConfig)
    // 用户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // 是否显示全仓玩法真实模拟净值
    const showFullNetAsset = computed(() => store.getters.showFullNetAsset)

    // 根据tradeType获取默认品种
    const getDefaultProduct = (tradeType) => {
        tradeType = Number(tradeType)

        // 有效的品种
        const availableList = store.getters['_quote/userProductCategoryKeys'] || []

        let product = null
        // 优先进入上一次访问的产品
        const lastProductSymbolKey = (localGetJSON('lastProductActived', {})[tradeType]) || ''
        if (lastProductSymbolKey && availableList.includes(lastProductSymbolKey)) {
            const lastProduct = store.state._quote.productMap[lastProductSymbolKey]
            if (lastProduct?.symbolName && lastProduct?.symbolId) {
                return lastProduct
            }
        }
        const arr = store.state._quote.productList.filter(el => {
            return Number(el.tradeType) === tradeType && availableList.includes(el.symbolKey)
        }).sort((a, b) => {
            return a.sortNum - b.sortNum
        })

        const symbolKyes = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSDT']
        for (let i = 0; i < symbolKyes.length; i++) {
            if (product) break
            for (let j = 0; j < arr.length; j++) {
                const el = arr[j]
                if (symbolKyes[i] === 'XAUUSD') {
                    if (symbolKyes[i] === el.symbolCode) {
                        product = el
                        break
                    }
                } else {
                    if (symbolKyes[i] === (el.baseCurrency + el.profitCurrency)) {
                        product = el
                        break
                    }
                }
            }
        }
        if (!product && arr.length) product = arr[0]
        return product
    }

    // 跳转到下单页面并优先显示指定产品
    const toOrderPriority = (tradeType) => {
        const product = getDefaultProduct(tradeType)
        if (product) {
            const symbolId = product.symbolId
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            router.push({
                path: '/order',
                query: {
                    name: product?.symbolName?.replace(/ /g, '_'),
                    symbolId,
                    tradeType
                }
            })
        } else {
            console.log("can't find default product")
        }
    }

    const tradeTypeShowCash = computed(() => {
        try {
            return JSON.parse(store.state.businessConfig?.tradeTypeShowCash)
        } catch (error) {
            return []
        }
    })

    /**
     * 去充值页面，如果是真实账户直接跳转，模拟需要弹窗提示用户确认再跳转
     */
    const toDeposit = (_tradeType) => {
        // 判断玩法是否支持充值，不支持默认跳转
        const tradeType = tradeTypeShowCash.value.includes(Number(_tradeType)) ? _tradeType : ''
        const search = tradeType ? '?tradeType=' + tradeType : ''

        if (store.state._user.customerInfo.companyType === 'real') {
            router.push('/depositChoose' + search)
        } else {
            Dialog.confirm({
                title: t('common.tip'),
                message: t('mockAccount.switchTip'),
            }).then(() => {
                handleSwitchAccount({
                    type: 'real',
                    callback: async () => {
                        router.push('/depositChoose' + search)
                    }
                })
            })
        }
    }

    // 切换真实模拟
    const handleSwitchAccount = ({
        type,
        callback,
        fail,
        url
    }) => {
        store.commit('_user/Update_switchAccounting', true)
        store.dispatch('_user/findCustomerInfo', false).then(res => {
            if (res.check()) {
                if (Number(res.data.relationCustomerId) > 0) {
                    MsgSocket.ws.close()
                    switchUserAccount().then(res => {
                        if (res.check()) {
                            setToken(res.data.token)
                            sessionSet('companyId', res.data.associationCompanyId)

                            // 清空之前的账户数据和产品数据
                            store.commit('_user/Empty_selfSymbolList')
                            store.commit('_trade/Empty_data')
                            store.commit('_quote/Empty_data')

                            localSetObj('mockAccount', 'accountType', type)
                            localSetObj('mockAccount', 'lastAccountType', type)
                            localSetObj('mockAccount', 'demo_domain', store.state._base.wpCompanyInfo.demo_domain)
                        }
                    }).then(() => {
                        return store.dispatch('_base/initBaseConfig')
                    }).then(() => {
                        return store.dispatch('_user/findCustomerInfo')
                    }).then(() => {
                        store.commit('_user/Update_emptyAccountAssets')
                        store.commit('_quote/Update_symbolBaseLoaded', 0)
                        return store.dispatch('_quote/querySymbolBaseInfoList')
                    }).then(async () => {
                        const { tradeType } = store.getters.productActived
                        const defaultProduct = getDefaultProduct(tradeType)
                        if (route.name === 'Order' && defaultProduct?.symbolName && defaultProduct?.symbolId) {
                            await router.replace(`/order?name=${defaultProduct.symbolName}&symbolId=${defaultProduct.symbolId}&tradeType=${tradeType}`)
                        }

                        // 重新连接切换后的账户的消息 websocket
                        connectMsgWS()
                        // 订阅资产
                        if (showFullNetAsset.value && customerInfo.value) {
                            MsgSocket.subscribedListAdd(() => {
                                MsgSocket.subscribeAsset(1)
                            })
                        }

                        store.commit('_user/Update_switchAccounting', false)
                        callback && callback()

                        const detail = { accountType: type }
                        document.body.dispatchEvent(new CustomEvent('Event_switchAccountEnd', { detail }))

                        // setTimeout(() => {
                        //     if (url) {
                        //         location.href = url
                        //     } else {
                        //         // location.reload()
                        //     }
                        // }, 0)
                    }).catch(() => {
                        store.commit('_user/Update_switchAccounting', false)
                        fail && fail()
                    })
                }
            } else {
                store.commit('_user/Update_switchAccounting', false)
            }
        }).catch(() => {
            store.commit('_user/Update_switchAccounting', false)
            fail && fail()
        })
    }

    return {
        toOrderPriority,
        getDefaultProduct,
        handleSwitchAccount,
        toDeposit
    }
}
