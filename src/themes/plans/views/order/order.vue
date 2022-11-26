<template>
    <div class='orderWrap'>
        <div class='orderTop'>
            <plansType v-if='plansList.length>1' :list='plansList' :value='productTradeType' @change='handleTradeType' />
            <SwitchTradeType
                :product='product'
                @switchProduct='switchProductVisible=true'
            />
        </div>

        <div class='container'>
            <div v-if='product' class='main'>
                <div v-if='dealModeShowMap[product.dealMode]?.handicap && product.symbolName' class='left'>
                    <!-- 五档报价 -->
                    <OrderHandicap :product='product' />
                </div>
                <div v-if='product' class='right'>
                    <!-- 订单类型 -->
                    <OrderTypeTab
                        v-model='orderType'
                        v-model:multipleVal='multipleVal'
                        :product='product'
                        :trade-mode='product.dealMode'
                        :trade-type='product.tradeType'
                        @selected='changeOrderType'
                    />
                    <!-- 自动借款 -->
                    <LoanBar v-if='[3, 9].includes(product.tradeType)' v-model='operationType' :account='account' class='loanBarMargin' :product='product' />
                    <!-- 方向 -->
                    <Direction v-model='direction' :product='product' />
                    <!-- 挂单设置 -->
                    <PendingBar
                        v-if='[3, 5, 9].includes(product.tradeType) && orderType===10'
                        ref='pendingRef'
                        v-model='pendingPrice'
                        class='cellMarginTop'
                        :direction='direction'
                        :product='product'
                    />
                    <PendingBarCFD
                        v-else-if='orderType===10'
                        ref='pendingRef'
                        v-model='pendingPrice'
                        class='cellMarginTop'
                        :direction='direction'
                        :product='product'
                    />
                    <!-- 手数 -->
                    <OrderVolume
                        v-model='volume'
                        v-model:entryType='entryType'
                        :account='account'
                        class='cellMarginTop'
                        :product='product'
                    />
                    <!-- 订单金额 -->
                    <Assets
                        v-if='account'
                        :account='account'
                        :direction='direction'
                        :product='product'
                        :volume='volume'
                    />
                    <!-- 止盈止损 -->
                    <ProfitlossSet
                        v-if='[1,2].includes(product.tradeType)'
                        v-model:stopLoss='stopLoss'
                        v-model:stopProfit='stopProfit'
                        :direction='direction'
                        :product='product'
                    />
                    <!-- 过期类型 -->
                    <CellExpireType
                        v-if='orderType===10 && [1,2].includes(product.tradeType)'
                        v-model='expireType'
                        :btn-list='expireTypeList'
                        class='mtop20'
                        :title="$t('trade.expireTime')"
                    />
                </div>
            </div>
            <div v-if='!customerInfo' class='footerBtn' :class='[direction]'>
                <van-button block size='normal' @click='toRegister'>
                    {{ $t('trade.loginOrRegister') }}
                </van-button>
            </div>
            <div v-else-if='product && product.tradeEnable===1' class='footerBtn' :class='[direction]'>
                <van-button block :disabled='loading' :loading='loading' size='normal' @click='submitHandler'>
                    <i class='icon' :class='direction==="buy" ? "icon_mairu" : "icon_maichu"'></i>
                    {{ directionText }}
                </van-button>
            </div>
            <!-- 交易记录 -->
            <OrderRecord ref='roderRecordRef' :trade-type='productTradeType' @subscribe='setProductKeys' />
        </div>

        <!-- 侧边栏-切换产品 -->
        <sidebarProduct v-if='product' v-model='switchProductVisible' :default-trade-type='product.tradeType' :hide-trade-type='plansLen<=1' @select='onSelectProduct' />
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { mul, pow } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import SwitchTradeType from './components/switchTradeType'
import Direction from './components/direction'
import OrderVolume from './components/orderVolume'
import ProfitlossSet from './components/profitLossSet'
import PendingBar from './components/pendingBar'
import LoanBar from './components/loanBar'
import PendingBarCFD from './components/pendingBar_CFD'
import OrderTypeTab from './components/orderType.vue'
import Assets from './components/assets.vue'
import CellExpireType from './components/cellExpireType'
import OrderHandicap from './components/handicap.vue'
import OrderRecord from './components/orderRecord.vue'
import plansType from '@plans/components/plansType.vue'
import sidebarProduct from '@plans/components/sidebarProduct.vue'
import hooks from './orderHooks'
import { toolHooks } from '@plans/hooks/handicap'
import { addMarketOrder } from '@/api/trade'
import { Toast } from 'vant'
import { delayAwaitTime } from '@/utils/util'
export default {
    components: {
        Direction,
        OrderVolume,
        OrderTypeTab,
        SwitchTradeType,
        plansType,
        ProfitlossSet,
        OrderHandicap,
        sidebarProduct,
        Assets,
        CellExpireType,
        PendingBar,
        LoanBar,
        PendingBarCFD,
        OrderRecord
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const originTitle = document.title
        const { t } = useI18n({ useScope: 'global' })
        const { symbolId, direction, tradeType } = route.query
        if (symbolId && tradeType) store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const state = reactive({
            loading: false,
            switchProductVisible: false,
            direction: direction || 'buy',
            orderType: 1, // 订单类型
            expireType: 1, // 挂单过期类型
            expireTypeList: [{
                title: t('trade.expireType2'),
                val: 2
            }, {
                title: t('trade.expireType1'),
                val: 1
            }],
            volume: '',
            entryType: 2, // 1按数量下单 2按成交额下单
            operationType: 2, // 操作类型。1-普通；2-自动借款；3-自动还款
            pendingPrice: '',
            stopLoss: '',
            stopProfit: '',
            multipleVal: '', // 杠杆倍数
            productKeys: [] // 交易记录组件需要订阅的产品
        })
        const roderRecordRef = ref(null) // 交易记录组件对象
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const product = computed(() => store.getters.productActived)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })
        const { bizType, account, findProductInCategory, switchProduct } = hooks(state)
        const { dealModeShowMap } = toolHooks()
        const productSwitchHistory = {} // 顶部玩法类型切换记录
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(el => !(el.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )
        // 1.玩法类型
        const productTradeType = ref(tradeType)

        const positionList = computed(() => store.state._trade.positionList[productTradeType.value] ?? [])
        // 合约全仓的当前产品的持仓杠杆倍数
        const multipleValPosition = computed(() => {
            const position = positionList.value.find(el => parseInt(el.symbolId) === parseInt(product.value.symbolId))
            return position ? position.crossLevelNum : ''
        })
        // 合约全仓监听当前产品持仓的杠杆倍数修改
        watch(
            () => multipleValPosition.value,
            newval => {
                if (parseInt(productTradeType.value) === 1) state.multipleVal = newval
            }
        )

        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)

        const accountList = computed(() => store.state._user.customerInfo?.accountList)

        const directionText = computed(() => {
            if ([1, 2].includes(Number(product.value.tradeType))) {
                return state.direction === 'buy' ? t('trade.buyText') : t('trade.sellText')
            } else {
                return state.direction === 'buy' ? t('trade.buy') : t('trade.sell')
            }
        })

        store.commit('_trade/Update_modifyPositionId', 0)

        // 获取账户信息
        const queryAccountInfo = () => {
            if ([3, 5, 9].indexOf(product.value?.tradeType) === -1) return false
            const proCurrency = state.direction === 'buy' ? product.value?.profitCurrency : product.value?.baseCurrency
            const curAccount = customerInfo.value?.accountList?.find(({ currency, tradeType }) => (currency === proCurrency && tradeType === product.value.tradeType))
            if (curAccount)store.dispatch('_user/queryAccountAssetsInfo', { accountId: curAccount.accountId, tradeType: product.value?.tradeType })
            else if (customerInfo.value) Toast(t('trade.nullAssets'))
        }

        // 设置按额或者按手数，切换产品或者切换方向时需要重新设置；现货撮合、杠杆玩法下单买入按额，其他都是按手数交易
        const setVolumeType = () => {
            // CFD逐仓和杠杆全仓玩法才支持按额下单功能
            const tradeType = parseInt(product.value?.tradeType)
            if ([2, 3, 5].includes(tradeType)) {
                if ([3, 5].includes(tradeType) && state.direction === 'buy') {
                    state.entryType = 2 // 1按数量下单 2按成交额下单
                } else {
                    state.entryType = 1 // 1按数量下单 2按成交额下单
                }
            } else {
                state.entryType = 1 // 1按数量下单 2按成交额下单
            }
        }

        // 买入卖出方向变化时重新获取资产信息
        watch(
            () => state.direction,
            () => {
                state.volume = ''
                queryAccountInfo()
                if (product.value?.tradeType !== 2) setVolumeType()
            },
        )
        // 监听玩法类型
        const handleTradeType = (tradeType) => {
            let changeProductKey = ''
            productTradeType.value = String(tradeType)
            if (productSwitchHistory[tradeType]) {
                changeProductKey = productSwitchHistory[tradeType]
            } else {
                changeProductKey = findProductInCategory(tradeType)
                productSwitchHistory[tradeType] = changeProductKey
            }
            if (changeProductKey) {
                const [symbolId, tradeType] = changeProductKey.split('_')
                switchProduct(symbolId, tradeType).then(() => {
                    state.orderType = 1
                    init()
                })
            }
        }
        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 10)
        }
        // 侧边栏-切换产品
        const onSelectProduct = (product, close) => {
            const { symbolId, tradeType } = product
            productTradeType.value = String(tradeType)
            productSwitchHistory[tradeType] = `${symbolId}_${tradeType}`
            switchProduct(symbolId, tradeType).then(res => {
                state.orderType = 1
                init()
                close()
            })
        }

        // 设置交易记录组件需要订阅的产品
        const setProductKeys = (arr) => {
            state.productKeys = arr
            quoteSubscribe()
        }

        // 下单页面的行情订阅，包括当前产品和挂单列表的产品
        const quoteSubscribe = () => {
            let result = state.productKeys
            result.push(symbolKey.value)
            result = [...new Set(result)]
            QuoteSocket.send_subscribe(result)
            QuoteSocket.send_subscribe24H(result)
        }

        // 初始化设置
        const init = () => {
            // 获取产品详情
            const [symbolId, tradeType] = symbolKey.value.split('_')
            state.operationType = parseFloat(tradeType) === 3 ? 1 : 2 // 杠杆玩法默认是普通类型
            state.multipleVal = tradeType === '1' ? 20 : 1 // 全仓默认20倍
            setVolumeType() // 设置按额或者按手数交易
            productSwitchHistory[tradeType] = symbolKey.value
            if (tradeType === '1') {
                store.dispatch('_trade/queryPositionPage', { tradeType }).then(res => {
                    if (res.check() && res.data?.length) {
                        const position = res.data.find(el => el.tradeType === parseInt(tradeType) && el.symbolId === parseInt(symbolId))
                        if (position && position.crossLevelNum) {
                            state.multipleVal = position.crossLevelNum
                        }
                    }
                })
            }
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then(product => {
                // state.volume = product.minVolume  不需要设置默认手数
                state.volume = ''
                state.pendingPrice = ''

                quoteSubscribe() // 订阅产品行情
                // 订阅产品五档报价
                const curDigits = pow(0.1, product.symbolDigits)
                if (['5', '9'].includes(tradeType) || product.dealMode === 2) QuoteSocket.deal_subscribe(symbolId, 5, curDigits, tradeType, 20)
                if (tradeType === '9') store.dispatch('_user/queryCustomerAssetsInfo', { tradeType }) // 拉取全仓账户币种

                const accountIds = accountList.value?.filter(el => el.tradeType === Number(product.tradeType)).map(el => el.accountId)

                if ([3, 5, 9].includes(product.tradeType)) queryAccountInfo()

                if (product.tradeType === 1 && product.marginInfo?.type === '2') {
                    // 默认显示20x杠杆，若后台设置的产品最大杠杆小于20x，则取最大杠杆；若后台设置最小杠杆大于20x，则取最小杠杆
                    const [min, max] = product.marginInfo?.values?.split('-') || [1, 1]
                    if (max < 20) {
                        state.multipleVal = max
                    } else if (min > 20) {
                        state.multipleVal = min
                    }
                }
            })
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 10 && !state.pendingPrice) return Toast(t('trade.inputPendingPrice'))
            else if (state.orderType === 10 && isNaN(state.pendingPrice)) return Toast(t('trade.pendingPriceError'))
            else if (!state.volume) return Toast(t('trade.inputVolume'))
            else if (isNaN(state.volume)) return Toast(t('trade.volumeError'))
            else if (!account.value) return Toast(t('trade.nullAssets'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 下单参数
        const orderParams = () => {
            if (paramsInvalid()) return null
            let requestPrice = state.direction === 'sell' ? product.value.sell_price : product.value.buy_price
            const [symbolId, tradeType] = symbolKey.value.split('_')
            const direction = state.direction === 'sell' ? 2 : 1
            if (state.orderType === 10) {
                requestPrice = state.pendingPrice
            }
            const price_digits = product.value.hasOwnProperty('price_digits') && product.value.price_digits !== undefined ? product.value.price_digits : product.value.symbolDigits
            const p = Math.pow(10, price_digits)
            const params = {
                bizType: bizType.value, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(symbolId),
                accountCurrency: account.value.currency,
                accountId: account.value.accountId,
                requestTime: Date.now(),
                requestNum: Number(state.volume),
                operationType: state.operationType,
                requestPrice: mul(requestPrice, p),
                accountDigits: account.value.digits,
                tradeType: parseInt(tradeType),
                stopLoss: mul(state.stopLoss, p),
                takeProfit: mul(state.stopProfit, p),
                expireType: state.expireType,
                entryType: state.entryType
            }
            if (['1', '2'].includes(tradeType) && product.value.marginInfo?.type !== '1') params.crossLevelNum = parseInt(state.multipleVal)
            return params
        }

        // 点击提交按钮
        const submitHandler = () => {
            if (!customerInfo.value) return router.push({ name: 'Login', query: { back: encodeURIComponent(route.fullPath) } })
            const params = orderParams()
            if (!params) return
            if (state.loading) return false
            state.loading = true
            addMarketOrder(params)
                .then(async res => {
                    if (res.invalid()) {
                        state.loading = false
                        return false
                    }
                    const data = res.data
                    if (data.hasDelay === 2) {
                        // 延时单，让loading效果多转2s
                        await delayAwaitTime(2000)
                    }
                    state.loading = false
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                    state.volume = ''
                    state.pendingPrice = ''
                    Toast({
                        message: [1, 12].includes(params.bizType) ? t('trade.orderSuccessToast') : t('trade.orderPendingSuccessToast'),
                        duration: 1000,
                        forbidClick: true,
                    })
                    // 更新数据
                    roderRecordRef.value.init()
                    queryAccountInfo()
                })
                .catch(err => {
                    state.loading = false
                })
        }

        // 价格跳动修改页面title
        const unWatchPrice = watch(
            () => product.value?.cur_price,
            (newval, oldval) => {
                if (newval) {
                    document.title = `${newval} | ${product.value.symbolCode} | ${originTitle}`
                }
            },
            { immediate: true }
        )

        // 去注册
        const toRegister = () => {
            router.push('/register')
        }

        init()

        onBeforeUnmount(() => {
            unWatchPrice()
            document.title = originTitle

            QuoteSocket.cancel_subscribe(1)
            QuoteSocket.cancel_subscribe(3)
            store.commit('_quote/Delete_dealList')
        })
        return {
            ...toRefs(state),
            init,
            customerInfo,
            plansList,
            dealModeShowMap,
            productTradeType,
            onSelectProduct,
            plansLen,
            account,
            roderRecordRef,
            pendingRef,
            handleTradeType,
            profitLossRef,
            pendingWarn,
            profitLossWarn,
            product,
            changeOrderType,
            quoteSubscribe,
            submitHandler,
            toRegister,
            directionText,
            setProductKeys
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .short_name {
        margin-top: rem(8px);
        color: var(--minorColor);
        font-size: rem(20px);
    }
    .productName {
        @include single-line-clamp();
    }
    .icon_icon_arrow {
        margin-left: rem(5px);
        font-size: rem(24px);
        vertical-align: 2px;
    }
}
.icon_icon_close_big {
    color: var(--color);
}
.orderWrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: rem(100px);
    overflow-y: auto;
    color: var(--color);
    background: var(--bgColor);
    .container {
        flex: 1;
        overflow-y: auto;
    }
    .main {
        @include scroll();
        display: flex;
        flex: 1;
        padding: 0 rem(30px) rem(40px);
        overflow: auto;
        background: var(--contentColor);
        border-top: rem(20px) solid var(--bgColor);
        .left {
            width: rem(250px);
            margin-right: rem(30px);
        }
        .right {
            flex: 1;
            padding-top: rem(10px);
        }
    }
}
.loanBarMargin {
    margin: rem(25px) 0 rem(-12px);
}
.trustList {
    margin-top: rem(20px);
}
.cellMarginTop {
    margin-top: rem(40px);
}
.typeMarginTop {
    margin-top: rem(10px);
    overflow: hidden;
}
.footerBtn {
    width: 100%;
    margin-bottom: rem(20px);
    padding: rem(50px) rem(30px) rem(30px);
    font-weight: bold;
    background: var(--contentColor);
    .icon {
        margin-right: rem(20px);
        font-size: rem(20px);
        vertical-align: middle;
        opacity: 0.5;
    }
    &.buy {
        .van-button {
            color: #FFF;
            font-size: rem(30px);
            background: var(--riseColor);
            border-color: var(--riseColor);
            border-radius: rem(6px);
        }
    }
    &.sell {
        .van-button {
            color: #FFF;
            font-size: rem(30px);
            background: var(--fallColor);
            border-color: var(--fallColor);
        }
    }
}
</style>
