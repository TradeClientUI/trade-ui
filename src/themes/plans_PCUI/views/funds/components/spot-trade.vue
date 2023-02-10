<template>
    <div class='spot-trade'>
        <div class='trade-header'>
            <span>{{ $t('funds.spot') }}</span>
            <span>{{ $t('funds.spot') }}</span>
        </div>
        <!-- 选项卡 -->
        <el-tabs v-model='submitType'>
            <el-tab-pane :label="$t('trade.buy')" name='buy'>
                <div class='trade-block' v-if="product?.symbolName">
                    <div class='form-item disable'>
                        <label for=''>
                            {{ $t('trade.buyPrice') }}
                        </label>
                        <span class='minor'>
                            {{ $t('trade.bestPriceBuy') }}
                        </span>
                        <div class='right-val'>
                            {{ product?.profitCurrency || '&nbsp;' }}
                        </div>
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
                    <Assets
                        v-if='account'
                        :account='account'
                        direction='buy'
                        :product='product'
                        :volume='buy.volume'
                    />
                    <!-- 已登录 -->
                    <div v-if='customerInfo'>
                        <div class='footerBtn buy'>
                            <van-button block :disabled='buy.loading || product.tradeEnable === 2' :loading='buy.loading' size='normal' @click='submitHandler("buy")'>
                                {{ $t('trade.buyText') }}
                            </van-button>
                        </div>
                        <p class='rules-link'>
                            <span @click='openDeal'>
                                {{ $t('trade.dealList') }}
                            </span>
                        </p>
                        <p class='trade-tip'>
                            {{ $t('funds.spotTip1') }}<span @click="toOrder" >{{ $t('funds.spotTip2') }}</span>{{ $t('funds.spotTip3') }}
                        </p>
                    </div>
                    <!-- 未登录 -->
                    <div class='handle-not' v-else>
                        <button class='register-btn' @click="router.push('/register')">
                            {{ $t('c.register') }}
                        </button>
                        <button class='login-btn' @click="router.push('/login')">
                            {{ $t('c.login') }}
                        </button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('trade.sell')" name='sell'>
                <div class='trade-block' v-if='product?.symbolName'>
                    <div class='form-item disable'>
                        <label>
                            {{ $t('trade.sellPrice') }}
                        </label>
                        <span class='minor'>
                            {{ $t('trade.bestPriceSell') }}
                        </span>
                        <div class='right-val'>
                            {{ product?.profitCurrency || '&nbsp;' }}
                        </div>
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
                    <Assets
                        v-if='account'
                        :account='account'
                        direction='sell'
                        :product='product'
                        :volume='sell.volume'
                    />
                    <!-- 已登录 -->
                    <div v-if='customerInfo'>
                        <div class='footerBtn sell'>
                            <van-button block :disabled='sell.loading || product.tradeEnable === 2' :loading='sell.loading' size='normal' @click='submitHandler("sell")'>
                                {{ $t('trade.sellText') }}
                            </van-button>
                        </div>
                        <p class='rules-link'>
                            <span @click='openDeal'>
                                {{ $t('trade.dealList') }}
                            </span>
                        </p>
                        <p class='trade-tip'>
                            {{ $t('funds.spotTip1') }}<span @click="toOrder" >{{ $t('funds.spotTip2') }}</span>{{ $t('funds.spotTip3') }}
                        </p>
                    </div>
                    <!-- 未登录 -->
                    <div class='handle-not' v-else>
                        <button class='register-btn' @click="router.push('/register')">
                            {{ $t('c.register') }}
                        </button>
                        <button class='login-btn' @click="router.push('/login')">
                            {{ $t('c.login') }}
                        </button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class='none-trade' v-if='!product?.symbolName'>
            {{ $t('fundInfo.noTradeMarket') }}
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, reactive, inject, computed, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { addMarketOrder } from '@/api/trade'
import { mul } from '@/utils/calculation'
import Assets from './assets.vue'
import OrderVolume from './orderVolume'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 改变当前显示的模块
const changeShowModel = inject('changeShowModel')
// 当前基金对应的产品
const product = inject('curProduct')
// 当前账户
const account = computed(() => {
    let account = {}
    const buyCurrency = product.value?.profitCurrency
    const sellCurrency = product.value?.baseCurrency
    const tradeType = product.value?.tradeType
    account = {
        buy: (buyCurrency && customerInfo.value)  ? customerInfo?.value?.accountMap[`${tradeType}_${buyCurrency}`] : {},
        sell: (sellCurrency && customerInfo.value)  ? customerInfo?.value?.accountMap[`${tradeType}_${sellCurrency}`] : {}
    }
    return account
})
const state = reactive({
    // 买入
    buy: {
        volume: '',
        stopLoss: '',
        stopProfit: '',
        expireType: 1, // 挂单过期类型
        pendingPrice: '',
        loading: false,
        entryType: 2, // 1按数量下单 2按成交额下单
    },
    // 卖出
    sell: {
        volume: '',
        stopLoss: '',
        stopProfit: '',
        expireType: 1, // 挂单过期类型
        pendingPrice: '',
        loading: false,
        entryType: 2 // 1按数量下单 2按成交额下单
    },
    // 买卖方向 buy:买入 sell:卖出
    submitType: 'buy'
})

const { buy, sell, submitType } = toRefs(state)

// 显示现货成交记录模块
const openDeal = () => {
    changeShowModel('transRecords')
}

// 跳转到交易页页
const toOrder = () => {
    router.push({
        path: '/order',
        query: {
            name: product.value.symbolName.replace(/ /g, '_'),
            symbolId: product.value.symbolId,
            tradeType: product.value.tradeType
        }
    })
}

// 获取账户信息
const queryAccountInfo = () => {
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

// 点击提交按钮
const submitHandler = (type) => {
    const params = orderParams()
    console.log('product', product.value)
    console.log('params', params)
    if (!params) return
    if (state[state.submitType].loading) return false
    state[state.submitType].loading = true
    addMarketOrder(params).then(async res => {
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
            // 获取账户信息
            queryAccountInfo()
            state[state.submitType].volume = ''
            Toast({
                message: [1, 12].includes(params.bizType) ? t('trade.orderSuccessToast') : t('trade.orderPendingSuccessToast'),
                duration: 1000,
                forbidClick: true,
            })
        }).catch(err => {
            state[state.submitType].loading = false
        })
}

// 验证下单数据是否异常
const paramsInvalid = () => {
    if (!state[state.submitType].volume) return Toast(t('trade.inputVolume'))
    else if (isNaN(state[state.submitType].volume)) return Toast(t('trade.volumeError'))
    else if (!account.value) return Toast(t('trade.nullAssets'))
}

// 下单参数
const orderParams = (ype) => {
    if (paramsInvalid()) return null
    let requestPrice = state.submitType === 'sell' ? product.value.sell_price : product.value.buy_price
    const [symbolId, tradeType] = product.value.symbolKey.split('_')
    const direction = state.submitType === 'sell' ? 2 : 1
    const price_digits = product.value.hasOwnProperty('price_digits') ? product.value.price_digits : product.value.symbolDigits
    const p = Math.pow(10, price_digits)
    const params = {
        bizType: 12, // 业务类型。1-市价开；2-限价开
        direction, // 订单买卖方向。1-买；2-卖；
        symbolId: Number(symbolId),
        accountCurrency: account.value[state.submitType]?.currency,
        accountId: account.value[state.submitType]?.accountId,
        requestTime: Date.now(),
        requestNum: Number(state[state.submitType].volume),
        operationType: 2,
        requestPrice: mul(requestPrice, p),
        accountDigits: account.value[state.submitType]?.digits,
        tradeType: parseInt(tradeType),
        stopLoss: mul(state[state.submitType].stopLoss, p),
        takeProfit: mul(state[state.submitType].stopProfit, p),
        expireType: state[state.submitType].expireType,
        entryType: state[state.submitType].entryType
    }
    return params
}
</script>

<style lang='scss' scoped>
.none-trade {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: var(--minorColor);
}
.spot-trade {
    display: flex;
    flex-direction: column;
    flex: 1;
    .trade-header {
        display: flex;
        font-size: 14px;
        color: var(--color);
        span {
            display: inline-flex;
            justify-content: center;
            flex: 1;
        }
    }
    &:deep {
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__nav {
            display: flex;
            width: 100%;
            height: 40px;
        }
        .el-tabs__nav-wrap::after {
            display: none;
        }
        .el-tabs__active-bar {
            height: 2px;
        }
        .el-tabs__item {
            flex: 1;
            font-size: 20px;
            color: var(--color);
            height: 40px;
            padding: 0;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            &.is-active {
                color: var(--primary);
            }
        }
        .el-tabs__active-bar {
            background-color: var(--primary);
        }
    }
}
.trade-block {
    padding-top: 20px;
}
.form-item {
    color: var(--minorColor);
    height: 50px;
    background: var(--assistColor);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    margin-bottom: 16px;
    label {
        margin-right: 9px;
        color: var(--normalColor);
    }
    .minor {
        color: var(--minorColor);
    }
    .right-val {
        color: var(--normalColor);
    }
    :deep(.trade-type) {
        color: var(--normalColor);
        cursor: default;
    }
    &.disable {
        background-color: var(--lineColor);
    }
}
.footerBtn {
    width: 100%;
    background: var(--contentColor);
    border-radius: 4px;
    font-weight: bold;
    margin-top: 30px;
    &:hover {
        opacity: 0.7;
    }
    &.buy {
        .van-button {
            height: 50px;
            color: #FFF;
            background: var(--riseColor);
            border-color: var(--riseColor);
            border-radius: 4px;
        }
    }
    &.sell {
        .van-button {
            height: 50px;
            color: #FFF;
            background: var(--fallColor);
            border-color: var(--fallColor);
            border-radius: 4px;
        }
    }
}
.handle-not {
    margin-top: 30px;
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50px;
        margin-bottom: 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        &.register-btn {
            color: #FFF;
            background: var(--primary);
        }
        &.login-btn {
            color: var(--primary);
            background: var(--lineColor);
        }
        &:hover {
            opacity: 0.7;
        }
    }
}
.rules-link {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    span {
        color: var(--primary);
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}
.trade-tip {
    margin-top: 10px;
    font-size: 13px;
    color: var(--color);
    :deep {
        span {
            color: var(--primary);
            cursor: pointer;
        }
    }
}
</style>
