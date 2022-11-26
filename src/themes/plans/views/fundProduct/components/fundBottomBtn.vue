<template>
    <div class='footerBtnBox'>
        <div v-if='fund' class='trade-btn-wrap'>
            <div class='buy fallColorBg' :class='{ disabled:fund.canPurchase!==1 }' @click="toOrder('buy')">
                <span class='text' :class='{ small: fund.canPurchase!==1 }'>
                    {{ fund.canPurchase===1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
                </span>
            </div>
            <div class='sell riseColorBg' :class='{ disabled:fund.canRedemption!==1 }' @click="toOrder('sell')">
                <span class='text' :class='{ small: fund.canRedemption!==1 }'>
                    {{ fund.canRedemption===1 ? $t('fundInfo.sell'):$t('fundInfo.disabledSell') }}
                </span>
            </div>
            <div class='tradeBtn' @click='toOrderFund'>
                <span class='text' :class='{ small: fund.canPurchase!==1 && fund.canRedemption!==1 }'>
                    {{ $t('route.trade') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Toast } from 'vant'
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const { fundId } = route.query
const props = defineProps({
    fund: Object
})

const toOrder = direction => {
    if (direction === 'buy' && props.fund.canPurchase !== 1) {
        return false
    } else if (direction === 'sell' && props.fund.canRedemption !== 1) {
        return false
    }
    router.push({
        name: direction === 'buy' ? 'FundApply' : 'FundRedeem',
        query: { direction, fundId }
    })
}

// 点击前往交易页面的对应产品
const toOrderFund = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.tradeType === 5)
    }
    if (!product) {
        return Toast(t('fundInfo.noTradeMarket'))
    }
    router.replace(`/product?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
// 底部按钮
.footerBtnBox {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    width: 100%;
    //height: rem(100px);
    text-align: center;
    background: var(--contentColor);
    .trade-btn-wrap {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: rem(20px);
        white-space: nowrap;
        font-weight: bold;
        .buy {
            margin-right: rem(20px);
        }
        .tradeBtn {
            flex: none;
            width: rem(140px);
            margin-left: rem(20px);
        }
    }
    .sell,
    .tradeBtn,
    .buy {
        @include active();
        position: relative;
        flex: 1;
        color: #fff;
        line-height: rem(100px);
        background-color: #858c9a;
        border-radius: 3px;
        &.fallColorBg {
            background-color: var(--riseColor);
        }
        &.riseColorBg {
            background-color: var(--fallColor);
        }
        &.disabled{
            opacity: .5;
            background-color: var(--minorColor);
        }
        .text {
            font-size: rem(34px);
            vertical-align: middle;
        }
        .small{
            font-size: 12px;
        }
    }
    .sell::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.15);
        content: '';
    }
    .text {
        font-size: rem(28px);
        vertical-align: middle;
    }
}
</style>
