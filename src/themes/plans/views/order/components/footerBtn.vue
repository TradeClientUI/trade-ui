<template>
    <div v-if='$route.query.isClosePosition' class='footerBtn'>
        <div class='col'>
            <button class='btn' :disabled='disabled' @click='closeOrder()'>
                {{ $t('trade.closeOrder') }}
            </button>
        </div>
    </div>
    <div v-else-if='$route.query.positionId' class='footerBtn'>
        <div class='col'>
            <button class='btn' :disabled='disabled' @click='updateOrder()'>
                {{ $t('trade.modify') }}
            </button>
        </div>
    </div>
    <div v-else-if='$route.query.pendingId' class='footerBtn'>
        <div class='col'>
            <button v-if='[2, 4].includes(openOrderSelected.val)' class='btn' :disabled='disabled || buyDisabled' @click='updatePending'>
                {{ $t('trade.modify') }}
            </button>
            <button v-else-if='[3, 5].includes(openOrderSelected.val)' class='btn' :disabled='disabled || sellDisabled' @click='updatePending'>
                {{ $t('trade.modify') }}
            </button>
        </div>
    </div>
    <div v-else-if='openOrderSelected.val === 1' class='footerBtn'>
        <div class='col'>
            <button class='btn sell' :disabled='disabled || sellDisabled' @click="openOrder('sell')">
                SELL
            </button>
        </div>
        <div class='col'>
            <button class='btn buy' :disabled='disabled || buyDisabled' @click="openOrder('buy')">
                BUY
            </button>
        </div>
    </div>
    <div v-else class='footerBtn'>
        <div class='col'>
            <button v-if='[2, 4].includes(openOrderSelected.val)' class='btn buy' :disabled='disabled || buyDisabled' @click='openOrder()'>
                {{ $t('trade.submitOrder') }}
            </button>
            <button v-else-if='[3, 5].includes(openOrderSelected.val)' class='btn sell' :disabled='disabled || sellDisabled' @click='openOrder()'>
                {{ $t('trade.submitOrder') }}
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        disabled: Boolean,
        openOrderSelected: Object,
        pendingPrice: [String, Number],
        stopLoss: [String, Number],
        takeProfit: [String, Number],
        isModifyStatus: {
            type: Boolean,
            default: false
        }
    },
    emits: ['openOrder', 'updateOrder', 'updatePending'],
    setup (props, { emit }) {
        const store = useStore()
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const pendingPriceRang = computed(() => store.getters['_trade/pendingPriceRang'])

        // 是否符合买入的止盈止损范围
        const buyDisabled = computed(() => {
            let { stopLoss, takeProfit, pendingPrice, openOrderSelected, isModifyStatus } = props
            const [buyProfitMin, buyProfitMax] = profitLossRang.value.buyProfitRange
            const [buyStopLossMin, buyStopLossMax] = profitLossRang.value.buyStopLossRange
            const [buyLimitMin, buyLimitMax] = pendingPriceRang.value.buyLimitRange
            const [buyStopMin, buyStopMax] = pendingPriceRang.value.buyStopRange
            const openOrderVal = openOrderSelected.val
            pendingPrice = Number(pendingPrice)
            stopLoss = Number(stopLoss)
            takeProfit = Number(takeProfit)

            // console.log('限价买入范围', buyLimitMin, buyLimitMax)
            // console.log('停损买入范围', buyStopMin, buyStopMax)
            if (stopLoss > 0 && (stopLoss < buyStopLossMin || stopLoss > buyStopLossMax)) {
                return true
            } else if (takeProfit > 0 && (takeProfit < buyProfitMin || takeProfit > buyProfitMax)) {
                return true
            } else if (openOrderVal === 2 && !isModifyStatus && (!buyLimitMax || pendingPrice < buyLimitMin || pendingPrice > buyLimitMax)) {
                return true
            } else if (openOrderVal === 4 && !isModifyStatus && (!buyStopMax || pendingPrice < buyStopMin || pendingPrice > buyStopMax)) {
                return true
            } else {
                return false
            }
        })
        // 是否符合卖出的止盈止损范围
        const sellDisabled = computed(() => {
            let { stopLoss, takeProfit, pendingPrice, openOrderSelected, isModifyStatus } = props

            const [sellProfitMin, sellProfitMax] = profitLossRang.value.sellProfitRange
            const [sellStopLossMin, sellStopLossMax] = profitLossRang.value.sellStopLossRange
            const [sellLimitMin, sellLimitMax] = pendingPriceRang.value.sellLimitRange
            const [sellStopMin, sellStopMax] = pendingPriceRang.value.sellStopRange
            const openOrderVal = openOrderSelected.val
            pendingPrice = Number(pendingPrice)
            stopLoss = Number(stopLoss)
            takeProfit = Number(takeProfit)

            // console.log('限价卖出范围', sellLimitMin, sellLimitMax)
            // console.log('停损卖出范围', sellStopMin, sellStopMax)

            if (stopLoss > 0 && (stopLoss < sellStopLossMin || stopLoss > sellStopLossMax)) {
                return true
            } else if (takeProfit > 0 && (takeProfit < sellProfitMin || takeProfit > sellProfitMax)) {
                return true
            } else if (openOrderVal === 3 && !isModifyStatus && (!sellLimitMax || pendingPrice < sellLimitMin || pendingPrice > sellLimitMax)) {
                return true
            } else if (openOrderVal === 5 && !isModifyStatus && (!sellStopMax || pendingPrice < sellStopMin || pendingPrice > sellStopMax)) {
                return true
            } else {
                return false
            }
        })

        // 下单操作
        const openOrder = param => {
            emit('openOrder', param)
        }
        const updateOrder = () => {
            emit('updateOrder')
        }
        const updatePending = () => {
            emit('updatePending')
        }
        const closeOrder = () => {
            emit('closeOrder')
        }
        return {
            buyDisabled,
            sellDisabled,
            openOrder,
            updatePending,
            updateOrder,
            closeOrder,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.footerBtn {
    position: relative;
    display: flex;
    width: 100%;
    height: rem(100px);
    border-top: 1px solid var(--lineColor);
    &.line::before {
        position: absolute;
        top: 20%;
        bottom: 20%;
        left: 50%;
        width: 1px;
        background: var(--lineColor);
        content: '';
    }
    .col {
        flex: 1;
    }
    .btn {
        @include active();
        width: 100%;
        height: rem(100px);
        font-weight: bold;
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        background: var(--bgColor);
        &.sell {
            color: var(--contentColor);
            background: var(--fallColor);
        }
        &.buy {
            color: var(--contentColor);
            background: var(--riseColor);
        }
        &:disabled {
            background: var(--color);
            opacity: 0.2;
        }
    }
}
</style>
