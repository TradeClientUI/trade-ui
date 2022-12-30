<template>
    <div class='stockSummary'>
        <p>{{ $t('contract.amount') }} {{ cashAmount }} {{ isHKD ? 'HKD':'USD' }} ({{ $t('c.reference') }})</p>
        <p v-if='data && direction==="buy" && parseFloat(data.closeCanBuyPositionNum)'>
            {{ $t('trade.closePositionAvailableBuy') }}
            <em class='val'>
                {{ data.closeCanBuyPositionNum }}
            </em>
            {{ $t('trade.stocks') }}
        </p>
        <template v-else>
            <div>
                <span v-if='data && direction==="sell"'>
                    {{ direction==='buy' ? $t('trade.cashAvailableBuy') : $t('trade.cashAvailableSell') }}
                    <em class='val'>
                        {{ direction==='buy' ? data.canBuyNum : data.canClosePositionNum }}
                    </em>
                    {{ $t('trade.stocks') }}
                </span>
                <span v-if='data' class='gapLeft'>
                    {{ direction==='buy' ? $t('trade.financingAvailableBuy') : $t('trade.financingAvailableSell') }}
                    <em class='val'>
                        {{ direction==='buy' ? data.canLoanBuyNum : data.canSellNum }}
                    </em>
                    {{ $t('trade.stocks') }}
                </span>
            </div>
        </template>
        <p v-if='Number(orderType) === 10'>
            {{ $t('trade.limitOrderTip') }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { toFixed, mul } from '@/utils/calculation'

const props = defineProps({
    product: {
        type: Object,
        default: () => ({})
    },
    orderType: {
        type: [String, Number],
        default: 1
    },
    direction: {
        type: String,
        default: 'buy'
    },
    pendingPrice: {
        type: String,
        default: '0'
    },
    volume: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
})

// 参考现金
const cashAmount = computed(() => {
    const realPrice = props.direction === 'buy' ? props.product.buy_price : props.product.sell_price
    const price = parseInt(props.orderType) === 10 ? props.pendingPrice : realPrice
    const a = mul(props.volume, price)
    return toFixed(a)
})

const isHKD = computed(() => {
    return props.product.labels?.toLowerCase().split(',').includes('hk-stock')
})

const isUSD = computed(() => {
    return props.product.labels?.toLowerCase().split(',').includes('us-stock')
})
</script>

<style lang="scss" scoped>
.stockSummary {
    margin-top: -5px;
    padding-bottom: 10px;
    text-align: right;
    line-height: 1.8;
    color: var(--normalColor);
    font-size: 12px;
    .val {
        color: #B72122;
        font-style: normal;
    }
    .gapLeft {
        margin-left: 20px;
    }
}
</style>
