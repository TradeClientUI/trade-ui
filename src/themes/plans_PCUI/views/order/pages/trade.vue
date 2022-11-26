<template>
    <div class='trade-header'>
        <!-- 订单类型 -->
        <OrderTypeTab
            v-model='orderType'
            :trade-mode='product.dealMode'
            :trade-type='product.tradeType'
            @selected='changeOrderType'
        />
        <div class='right-wrap'>
            <!-- 杠杆倍数设置 -->
            <a
                v-show='showLeverage'
                class='multipleBtn'
                href='javascript:;'
                @click='multipleSetVisible = true'
            >
                <span class='text'>
                    {{ multipleVal }}x
                </span>
                <i class='icon_icon_arrow'></i>
            </a>
            <div v-if='[1,2].includes(product.tradeType)' class='switch'>
                <span class='label'>
                    {{ $t('trade.tackStopSetup') }}
                </span>
                <van-switch
                    v-model='enabled'
                    :active-color='$style.success'
                    size='20'
                />
            </div>
            <!-- 基金代币产品 -->
            <van-popover v-model:show='showFundPopover' placement='left' theme='dark'>
                <p
                    style=' width: 300px;
padding: 10px;'
                >
                    {{ $t('trade.purchaseOrRedemptionTip') }}
                </p>
                <template #reference>
                    <a
                        v-if='product.etf'
                        class='fundtokenLink'
                        @click='fundtokenLink'
                        @mouseenter='showFundPopover=true'
                        @mouseleave='showFundPopover=false'
                    >
                        {{ $t('trade.purchaseOrRedemption') }}
                    </a>
                </template>
            </van-popover>
        </div>
    </div>
    <!-- 杠杆设置 -->
    <MultipleSetCross
        v-if="product && [1].includes(product.tradeType) && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='multipleVal'
        :product='product'
    />
    <MultipleSet
        v-if="product && [2].includes(product.tradeType) && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='multipleVal'
        :product='product'
    />

    <!-- 借款 -->
    <LoanBar v-if='[3, 9].includes(product.tradeType)' v-model='operationType' :account='account' class='loanBarMargin' :product='product' />

    <div class='trade-wrap'>
        <div class='buy-wrap'>
            <!-- 挂单设置 -->
            <div v-if='[3, 5, 9].includes(product.tradeType) && orderType===10' class='form-item'>
                <PendingBar
                    ref='pendingRef'
                    v-model='buy.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else-if='orderType===10' class='form-item'>
                <PendingBarCFD
                    ref='pendingRef'
                    v-model='buy.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else class='form-item disable'>
                <label for=''>
                    {{ $t('trade.buyPrice') }}  &nbsp;&nbsp;
                    <span class='minor'>
                        {{ $t('trade.bestPriceBuy') }}
                    </span>
                </label>
            </div>

            <div class='form-item'>
                <OrderVolume
                    v-model='buy.volume'
                    v-model:entryType='buy.entryType'
                    :account='account'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>

            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if=' [1,2].includes(product.tradeType)'
                v-model:stopLoss='buy.stopLoss'
                v-model:stopProfit='buy.stopProfit'
                class='cellMarginTop'
                direction='buy'
                :enabled='enabled'
                :product='product'
            />

            <!-- 过期类型 -->
            <CellExpireType
                v-if='orderType===10 && [1,2].includes(product.tradeType)'
                v-model='buy.expireType'
                :btn-list='expireTypeList'
                class='mtop20'
                :title="$t('trade.expireTime')"
            />

            <!-- 订单金额 -->
            <Assets
                v-if='account'
                :account='account'
                direction='buy'
                :product='product'
                :volume='buy.volume'
            />
            <div class='footerBtn buy'>
                <van-button block :disabled='buy.loading || product.tradeEnable === 2' :loading='buy.loading' size='normal' @click='submitHandler("buy")'>
                    {{ $t('trade.buyText') }}
                </van-button>
            </div>
            <LoginMask class='loginMaskPop' />
            <!-- <div v-if='!customerInfo' class='login-bar'>
                <router-link to='login'>
                    {{ $t('c.login') }}
                </router-link> {{ $t('c.or') }}
                <router-link to='register'>
                    {{ $t('c.register') }}
                </router-link>
            </div> -->
        </div>
        <div class='sell-wrap'>
            <!-- 挂单设置 -->
            <div v-if='[3, 5, 9].includes(product.tradeType) && orderType===10' class='form-item'>
                <PendingBar
                    v-if='[3, 5, 9].includes(product.tradeType) && orderType===10'
                    ref='pendingRef'
                    v-model='sell.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else-if='orderType===10' class='form-item'>
                <PendingBarCFD
                    ref='pendingRef'
                    v-model='sell.pendingPrice'
                    class='cellMarginTop'
                    direction='sell'
                    :product='product'
                />
            </div>
            <div v-else class='form-item disable'>
                <label for=''>
                    {{ $t('trade.sellPrice') }} &nbsp;&nbsp;
                    <span class='minor'>
                        {{ $t('trade.bestPriceSell') }}
                    </span>
                </label>
            </div>

            <div class='form-item'>
                <OrderVolume
                    v-model='sell.volume'
                    v-model:entryType='sell.entryType'
                    :account='account'
                    class='cellMarginTop'
                    direction='sell'
                    :product='product'
                />
            </div>

            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if=' [1,2].includes(product.tradeType)'
                v-model:stopLoss='sell.stopLoss'
                v-model:stopProfit='sell.stopProfit'
                class='cellMarginTop'
                direction='sell'
                :enabled='enabled'
                :product='product'
            />

            <!-- 过期类型 -->
            <CellExpireType
                v-if='orderType===10 && [1,2].includes(product.tradeType)'
                v-model='sell.expireType'
                :btn-list='expireTypeList'
                class='mtop20'
                :title="$t('trade.expireTime')"
            />

            <!-- 可用余额 -->
            <Assets
                v-if='account'
                :account='account'
                direction='sell'
                :product='product'
                :volume='sell.volume'
            />

            <div class='footerBtn sell'>
                <van-button block :disabled='sell.loading || product.tradeEnable === 2' :loading='sell.loading' size='normal' @click='submitHandler("sell")'>
                    {{ $t('trade.sellText') }}
                </van-button>
            </div>
            <LoginMask class='loginMaskPop' />
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch, unref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { delayAwaitTime, isEmpty } from '@/utils/util'
import { addMarketOrder } from '@/api/trade'
import { mul, pow } from '@/utils/calculation'
import hooks from '../orderHooks'
import OrderVolume from './components/orderVolume'
import PendingBar from './components/pendingBar'
import CellExpireType from './components/cellExpireType'
import ProfitlossSet from './components/profitLossSet'
import OrderTypeTab from './components/orderType.vue'
import PendingBarCFD from './components/pendingBar_CFD'
import LoanBar from './components/loanBar'
import Assets from './components/assets.vue'
import MultipleSet from '@planspc/components/multipleSet.vue'
import MultipleSetCross from '@planspc/components/multipleSetCross.vue'
import LoginMask from '@planspc/components/loginMask.vue'
import { findFundPage } from '@/api/fund'

export default {
    components: {
        OrderVolume,
        PendingBar,
        ProfitlossSet,
        CellExpireType,
        OrderTypeTab,
        PendingBarCFD,
        LoanBar,
        Assets,
        LoginMask,
        MultipleSet,
        MultipleSetCross
    },
    emits: ['update:modelValue', 'selected', 'update:multipleVal'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const product = computed(() => store.getters.productActived)
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const state = reactive({
            active: 0,
            buy: {
                volume: '',
                stopLoss: '',
                stopProfit: '',
                expireType: 1, // 挂单过期类型
                pendingPrice: '',
                loading: false,
                entryType: 1, // 1按数量下单 2按成交额下单
            },
            sell: {
                volume: '',
                stopLoss: '',
                stopProfit: '',
                expireType: 1, // 挂单过期类型
                pendingPrice: '',
                loading: false,
                entryType: 1, // 1按数量下单 2按成交额下单
            },
            operationType: 2, // 操作类型。1-普通；2-自动借款；3-自动还款
            enabled: false,
            orderType: 1, // 订单类型
            expireTypeList: [{
                title: t('trade.expireType2'),
                val: 2
            }, {
                title: t('trade.expireType1'),
                val: 1
            }],
            submitType: '',
            multipleVal: '', // 杠杆倍数初始值
            multipleSetVisible: false,
            showFundPopover: false, // 基金代币切换按钮popover提示
            findFundPageList: [], // 基金产品列表
        })

        const { bizType, account, findProductInCategory, switchProduct } = hooks(state)

        const customerInfo = computed(() => store.state._user.customerInfo)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)
        const symbolKey = computed(() => store.state._quote.productActivedID)

        const accountList = computed(() => store.state._user.customerInfo?.accountList)
        const mVal = computed({
            get () {
                return state.multipleVal
            },
            set (val) {
                state.multipleVal = val
                emit('update:multipleVal', val)
            }
        })
        // 业务配置
        const businessConfig = computed(() => store.state.businessConfig)

        const showLeverage = computed(() => [1, 2].includes(Number(product.value.tradeType)) && product.value.marginInfo?.type !== '1')

        // 现货产品的基础货币是【基金代币】的，显示【申/赎】按钮
        const fundtoken = computed(() => {
            return state.findFundPageList.find(el => el.shareTokenCode === product.value?.baseCurrency)
        })

        // 获取基金产品列表，
        const getFundPage = () => {
            findFundPage({ customerGroupId: store.getters.customerGroupId, size: 1000 }).then(res => {
                if (res.check()) {
                    state.findFundPageList = res.data.records
                }
            })
        }

        // 点击提交按钮
        const submitHandler = (type) => {
            state.submitType = type
            const params = orderParams()
            if (!params) return
            if (state[state.submitType].loading) return false
            state[state.submitType].loading = true
            addMarketOrder(params)
                .then(async res => {
                    if (res.invalid()) {
                        state[state.submitType].loading = false
                        return false
                    }
                    const data = res.data
                    if (data.hasDelay === 2) {
                        // 延时单，让loading效果多转2s
                        await delayAwaitTime(2000)
                    }
                    state[state.submitType].loading = false
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))

                    // 刷新委托列表
                    store.dispatch('_trade/queryPBOOrderPage', { tradeType: params.tradeType })
                    // 刷新成交记录
                    store.dispatch('_trade/tradeRecordList')
                    // 刷新持仓列表
                    if ([1, 2].includes(product.value?.tradeType)) {
                        store.dispatch('_trade/queryPositionPage', {
                            tradeType: params.tradeType,
                            sortFieldName: 'openTime',
                            sortType: 'desc',
                        })
                    } else {
                        queryAccountInfo()
                    }
                    // 清除表单
                    resetForm()
                    state[state.submitType].volume = ''
                    state[state.submitType].pendingPrice = ''
                    Toast({
                        message: [1, 12].includes(params.bizType) ? t('trade.orderSuccessToast') : t('trade.orderPendingSuccessToast'),
                        duration: 1000,
                        forbidClick: true,
                    })
                })
                .catch(err => {
                    state[state.submitType].loading = false
                })
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 10 && !state[state.submitType].pendingPrice) return Toast(t('trade.inputPendingPrice'))
            else if (state.orderType === 10 && isNaN(state[state.submitType].pendingPrice)) return Toast(t('trade.pendingPriceError'))
            else if (!state[state.submitType].volume) return Toast(t('trade.inputVolume'))
            else if (isNaN(state[state.submitType].volume)) return Toast(t('trade.volumeError'))
            else if (!account.value) return Toast(t('trade.nullAssets'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 下单参数
        const orderParams = (ype) => {
            if (paramsInvalid()) return null
            let requestPrice = state.submitType === 'sell' ? product.value.sell_price : product.value.buy_price
            const [symbolId, tradeType] = symbolKey.value.split('_')
            const direction = state.submitType === 'sell' ? 2 : 1
            if (state.orderType === 10) {
                requestPrice = state[state.submitType].pendingPrice
            }
            const price_digits = product.value.hasOwnProperty('price_digits') && product.value.price_digits !== undefined ? product.value.price_digits : product.value.symbolDigits
            const p = Math.pow(10, price_digits)
            const params = {
                bizType: bizType.value, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(symbolId),
                accountCurrency: account.value[state.submitType]?.currency,
                accountId: account.value[state.submitType]?.accountId,
                requestTime: Date.now(),
                requestNum: Number(state[state.submitType].volume),
                operationType: state.operationType ? 2 : 1,
                requestPrice: mul(requestPrice, p),
                accountDigits: account.value[state.submitType]?.digits,
                tradeType: parseInt(tradeType),
                stopLoss: mul(state[state.submitType].stopLoss, p),
                takeProfit: mul(state[state.submitType].stopProfit, p),
                expireType: state[state.submitType].expireType,
                entryType: state[state.submitType].entryType
            }
            if (['1', '2'].includes(tradeType) && product.value.marginInfo?.type !== '1') params.crossLevelNum = parseInt(state.multipleVal)
            return params
        }

        // 获取账户信息
        const queryAccountInfo = () => {
            if ([1, 2].includes(product.value?.tradeType)) return
            const proCurrency = product.value?.profitCurrency
            const baseCurrency = product.value?.baseCurrency
            const curProAccount = customerInfo.value?.accountList?.find(({ currency, tradeType }) => (currency === proCurrency && tradeType === product.value.tradeType))
            const curBaseCurrency = customerInfo.value?.accountList?.find(({ currency, tradeType }) => (currency === baseCurrency && tradeType === product.value.tradeType))
            if (curProAccount) {
                store.dispatch('_user/queryAccountAssetsInfo', { accountId: curProAccount.accountId, tradeType: product.value?.tradeType })
            } else Toast(t('trade.nullAssets', [proCurrency]))
            if (curBaseCurrency) {
                store.dispatch('_user/queryAccountAssetsInfo', { accountId: curBaseCurrency.accountId, tradeType: product.value?.tradeType })
            } else Toast(t('trade.nullAssets', [baseCurrency]))
        }

        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 10)
        }

        // 设置按额或者按手数，切换产品或者切换方向时需要重新设置；现货撮合、杠杆玩法下单买入按额，其他都是按手数交易
        const setVolumeType = () => {
            // CFD逐仓和杠杆全仓玩法才支持按额下单功能
            const tradeType = parseInt(product.value?.tradeType)
            if ([2, 3, 5].includes(tradeType)) {
                if ([3, 5].includes(tradeType)) {
                    state['buy'].entryType = 2 // 1按数量下单 2按成交额下单
                    state['sell'].entryType = 1
                } else {
                    state['buy'].entryType = 1 // 1按数量下单 2按成交额下单
                    state['sell'].entryType = 1
                }
            } else {
                state['buy'].entryType = 1 // 1按数量下单 2按成交额下单
                state['sell'].entryType = 1
            }
        }

        const resetForm = () => {
            state.buy.stopLoss = ''
            state.buy.stopProfit = ''
            state.buy.volume = ''
            state.buy.pendingPrice = ''
            state.sell.stopProfit = ''
            state.sell.stopLoss = ''
            state.sell.volume = ''
            state.sell.pendingPrice = ''
        }

        // 跳转到基金的产品详情
        const fundtokenLink = () => {
            if (unref(businessConfig)?.v10Link) {
                router.replace(unref(businessConfig).v10Link)
            } else {
                if (!unref(fundtoken)) {
                    return Toast(t('trade.noFeature'))
                }
                router.push('/fund?fundId=' + fundtoken.value.fundId)
            }
        }

        // 初始化设置
        const init = () => {
            resetForm()
            state.orderType = 1
            // 获取产品详情
            const [symbolId, tradeType] = symbolKey.value.split('_')
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            state.operationType = parseFloat(tradeType) !== 3 // 杠杆玩法默认是普通类型
            state.multipleVal = tradeType === '1' ? 20 : 1 // 全仓默认20倍
            setVolumeType() // 设置按额或者按手数交易
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then(product => {
                state.sell.volume = ''
                if (!isEmpty(customerInfo.value)) {
                    const accountIds = accountList.value?.filter(el => el.tradeType === Number(product.tradeType)).map(el => el.accountId)
                    queryAccountInfo()
                    store.dispatch('_trade/queryPBOOrderPage', {
                        tradeType: product.tradeType,
                        sortFieldName: 'orderTime',
                        sortType: 'desc',
                        accountIds: accountIds + ''
                    })
                }
                if (product.tradeType === 1 && product.marginInfo?.type === '2') {
                    // 默认显示20x杠杆，若后台设置的产品最大杠杆小于20x，则取最大杠杆；若后台设置最小杠杆大于20x，则取最小杠杆
                    const [min, max] = product.marginInfo?.values?.split('-') || [1, 1]
                    if (max < 20) {
                        state.multipleVal = max
                    } else if (min > 20) {
                        state.multipleVal = min
                    }
                }
            }).then(() => {
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
            })
        }

        // 监听合约全仓的持仓杠杆倍数修改
        const watchMultipLeVal = (evt) => {
            console.log(evt.detail)
            const { multipleVal, symbolId } = evt.detail
            if (parseInt(symbolId) === product.value.symbolId) state.multipleVal = multipleVal
        }

        // 监听产品变化
        watch(
            () => product.value, (val, oval) => {
                init()
            }
        )

        init()
        getFundPage()

        onMounted(() => {
            document.body.addEventListener('update:multipLeVal', watchMultipLeVal, false)
        })

        onBeforeUnmount(() => {
            document.body.removeEventListener('update:multipLeVal', removeEventListener)
        })

        return {
            orderType: 1, // 订单类型
            bizType,
            product,
            account,
            pendingWarn,
            submitHandler,
            profitLossRef,
            changeOrderType,
            customerInfo,
            fundtoken,
            mVal,
            fundtokenLink,
            showLeverage,
            ...toRefs(state),
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trade-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tabs-trade {
        width: 150px;
        margin-bottom: 20px;
        :deep(.van-tab) {
            flex: 1;
            flex-basis: auto !important;
            padding: 0;
            padding-bottom: 5px;
            font-size: 14px;
            white-space: nowrap;
        }
        :deep(.van-tabs__wrap) {
            height: 30px;
            .van-tabs__nav--line {
                padding-bottom: 0;
            }
            .van-tabs__line {
                bottom: 0;
            }
        }
    }
    .switch {
        display: inline-block;
        >span {
            margin-right: 9px;
            vertical-align: middle;
        }
        .van-switch {
            vertical-align: middle;
        }
    }
    .right-wrap {
        .multipleBtn,
        .fundtokenLink {
            @include active();
            @include hover();
            display: inline-block;
            height: 24px;
            margin-right: rem(24px);
            padding: 0 rem(16px);
            color: var(--color);
            vertical-align: middle;
            background: var(--assistColor);
            border: solid 1px var(--color);
            border-radius: 4px;
            .text {
                display: inline-block;
                padding-right: 10px;
                font-size: 14px;
            }
            .icon_icon_arrow {
                font-size: 12px;
            }
        }
        .fundtokenLink {
            color: var(--primary);
            background: none;
            border: 1px solid var(--primary);
            border-radius: 5px;
            cursor: pointer;
        }
    }
}
.trade-wrap {
    display: flex;
    width: 100%;
    .buy-wrap,
    .sell-wrap {
        position: relative;
        flex: 1;
        padding: 10px 15px;
        &:hover .loginMaskPop {
            visibility: visible;
            opacity: 1;
        }
        &:hover .footerBtn {
            opacity: 0.5;
        }
    }
    .sell-wrap {
        margin-left: 20px;
    }
    .form-item {
        display: flex;
        justify-content: space-between;
        height: 40px;
        margin-bottom: 16px;
        padding: 10px 14px;
        color: var(--minorColor);
        background: var(--assistColor);
        border-radius: 4px;
        label {
            margin-right: 9px;
            color: var(--normalColor);
            .minor {
                color: var(--minorColor);
            }
        }
        &.disable {
            background-color: var(--lineColor);
        }
    }
    .footerBtn {
        width: 100%;
        height: 40px;
        margin-bottom: 5px;
        font-weight: bold;
        background: var(--contentColor);
        border-radius: 4px;
        &:hover {
            opacity: 0.7;
        }
        &.buy {
            .van-button {
                color: #FFF;
                background: var(--riseColor);
                border-color: var(--riseColor);
                border-radius: 4px;
            }
        }
        &.sell {
            .van-button {
                color: #FFF;
                background: var(--fallColor);
                border-color: var(--fallColor);
                border-radius: 4px;
            }
        }
    }
}

</style>
