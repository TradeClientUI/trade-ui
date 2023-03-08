<template>
    <div class='fund-info'>
        <div class='info-header'>
            <currency-icon :currency='fund.shareTokenCode' size='72px' />
            <div class='text'>
                <span class='tag'>
                    {{ fund.fundType }}
                </span>
                <span class='name'>
                    {{ fund.fundName }}
                </span>
                <span class='by'>
                    By <span>CATS</span> Crypto Exchange
                </span>
            </div>
        </div>
        <h3 class='info-slogan'>
            Invest in the top 10 cryptocurrencies
        </h3>
        <p class='info-introduction'>
            {{ fund.introduction }}
        </p>
        <div class='info-block'>
            <div class='info-row'>
                <van-popover v-model:show='showPopover1' placement='top' theme='dark'>
                    <p style='padding: 10px;'>
                        {{ $t('funds.hoverTip1') }}
                    </p>
                    <template #reference>
                        <div
                            class='col'
                            @mouseenter='showPopover1=true'
                            @mouseleave='showPopover1=false'
                        >
                            <span>{{ $t('fundInfo.realtimeJZ') }}({{ fund.currencyCode }})</span>
                            <strong>{{ sharesNet || fund.netValue }}</strong>
                        </div>
                    </template>
                </van-popover>
                <van-popover v-model:show='showPopover2' placement='top' theme='dark'>
                    <p
                        style='padding: 10px;
width: 300px;'
                    >
                        {{ $t('funds.hoverTip2') }}
                    </p>
                    <template #reference>
                        <div
                            class='col'
                            @mouseenter='showPopover2=true'
                            @mouseleave='showPopover2=false'
                        >
                            <span>{{ $t('trade.priceLabel') }}({{ fund.currencyCode }})</span>
                            <strong>{{ fund.marketPrice }}</strong>
                        </div>
                    </template>
                </van-popover>
                <div class='col'>
                    <span>{{ $t('fundInfo.totalMarketValue') }}({{ fund.currencyCode }})</span>
                    <strong>{{ calculate(fund.totalBalance) }}</strong>
                </div>
                <div v-if='fund.upDate' class='col'>
                    <span>{{ $t('fundInfo.fundCreateTime') }}</span>
                    <strong>{{ fund.upDate ? fund.upDate.substring(0, fund.upDate.length - 3) : '' }}</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue'
import { toFixed } from '@/utils/calculation.js'
import currencyIcon from '@/components/currencyIcon.vue'

defineProps({
    // 当前基金
    fund: {
        type: Object,
        default: () => {}
    }
})

// 最新基金净值
const sharesNet = inject('sharesNet')

// 提示
const showPopover1 = ref(false)
const showPopover2 = ref(false)

// 计算显示的数值
const calculate = (num) => {
    let result = ''
    if (num >= 1000 && num < 1000000) {
        num = toFixed((num / 1000))
        result = num + 'K'
    } else if (num >= 1000000) {
        num = toFixed((num / 1000000))
        result = num + 'M'
    } else {
        result = num
    }
    return result
}
</script>

<style lang='scss' scoped>
.fund-info {
    .info-header {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .text {
            display: inline-flex;
            flex-direction: column;
            padding-left: 28px;
            .tag {
                font-size: 14px;
                font-weight: 300;
                color: var(--normalColor);
            }
            .name {
                margin-bottom: 5px;
                letter-spacing: 0.15px;
                font-size: 24px;
                font-weight: 700;
                color: var(--mainColor);
            }
            .by {
                font-size: 16px;
                font-weight: 600;
                color: var(--mainColor);
                span {
                    color: #EBB650;
                }
            }
        }
    }
    .info-slogan {
        margin: 16px 0;
        line-height: 48px;
        font-size: 40px;
        font-weight: 700;
        color: var(--mainColor);
    }
    .info-introduction {
        line-height: 28px;
        font-size: 20px;
        font-weight: 400;
        color: var(--normalColor);
        word-break: break-word;
    }
    .info-block {
        margin-top: 32px;
    }
    .info-row {
        display: flex;
        flex-wrap: wrap;
        .col {
            display: inline-flex;
            flex-direction: column;
            width: 180px;
            margin-bottom: 16px;
            span {
                letter-spacing: 1px;
                font-size: 14px;
                font-weight: 300;
                color: var(--normalColor);
            }
            strong {
                font-size: 28px;
                font-weight: 700;
                color: var(--mainColor);
            }
        }
    }
}
</style>
