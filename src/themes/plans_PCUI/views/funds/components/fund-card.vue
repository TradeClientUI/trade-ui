<template>
    <div class='card' @click='onCard'>
        <div class='card-header'>
            <currency-icon class='currency' :currency='fund.shareTokenCode' size='64px' />
            <div class='text'>
                <span class='key'>
                    {{ fund.fundType }}
                </span>
                <span class='value'>
                    {{ fund.fundName }}
                </span>
            </div>
            <div class='row'>
                <span class='key'>
                    {{ $t('fundInfo.realtimeJZ') }}
                </span>
                <span class='value'>
                    {{ toFixed(fund.netValue) }}
                </span>
            </div>
            <div class='row'>
                <span class='key'>
                    {{ $t('trade.priceLabel') }}
                </span>
                <span class='value'>
                    {{ toFixed(fund.marketPrice) }}
                </span>
            </div>
        </div>
        <div class='card-kline'>
            <kline-svg
                v-if='netValueArrs[index]'
                :data='netValueArrs[index]'
                :height='40'
                :width='360'
            />
        </div>
        <div class='card-lable'>
            Invest in the top 10 cryptocurrencies
        </div>
    </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'
import { toFixed } from '@/utils/calculation.js'
import currencyIcon from '@/components/currencyIcon.vue'
import klineSvg from '@planspc/components/klineSvg.vue'

const props = defineProps({
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    },
    // 当前基金产品索引
    index: {
        type: [Number, String],
        default: ''
    }
})
const selectFund = inject('selectFund')
const netValueArrs = inject('netValueArrs')

// 点击基金产品
const onCard = () => {
    selectFund(props.fund.fundId)
}
</script>

<style lang='scss' scoped>
.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 640px;
    height: 300px;
    padding: 48px;
    margin: 16px;
    background: var(--contentColor);
    border-radius: 20px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
    transition: all .2s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
}
.card-header {
    display: flex;
    align-content: center;
    .currency {
        margin-right: 18px;
    }
    .text, .row {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        .key {
            line-height: 18px;
            letter-spacing: .5px;
            font-size: 12px;
            color: var(--normalColor);
        }
        .value {
            line-height: 36px;
            font-size: 30px;
            font-weight: 700;
            color: var(--mainColor);
        }
    }
    .text {
        flex: 1;
    }
    .row {
        text-align: right;
        margin-left: 20px;
    }
}
.card-kline {
    display: flex;
    justify-content: center;
    align-items: center;
}
.card-lable {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    span {
        line-height: 20px;
        margin: 0 15px;
        font-size: 14px;
        color: #000;
    }
}
</style>
