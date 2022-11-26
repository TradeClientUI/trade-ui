<template>
    <div class='deal-item'>
        <div class='t-header'>
            <div class='fl'>
                <span :class="Number(item.direction) === 1 ? 'riseColor' : 'fallColor'">
                    {{ Number(item.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                </span>&nbsp;
                <span class='name'>
                    {{ item?.symbolName || '--' }}
                </span>
                <ETF v-if='curProduct.etf' />
            </div>
            <div class='fr'>
                {{ bizTypeText ? bizTypeText[item.bizType] : '--' }}
            </div>
        </div>
        <div class='t-body'>
            <div class='t-block'>
                <p class='tl-item'>
                    <label for=''>
                        <span v-if='[3,5,9].includes(Number(tradeType)) '>
                            {{ Number(item.direction) === 1 ? $t('trade.pendingAmount') + '('+item.outCurrency + ')' : $t('trade.pendingUnit')+ '(' +item.outCurrency + ')' }}
                        </span>

                        <span v-else-if='Number(tradeType) === 1'>
                            {{ $t('trade.pendingUnit')+ ' (' +$t('trade.volumeUnit') + ')' }}
                        </span>
                        <span v-else>
                            {{ Number(item.numberStatisticMode) === 1 ? $t('trade.pendingUnit')+ '(' +$t('trade.volumeUnit') + ')' : $t('trade.pendingAmount') + ' ('+item.accountCurrency + ')' }}
                        </span>
                    </label>
                    <span>
                        {{ item.requestNum || '--' }}
                    </span>
                </p>

                <p class='tl-item'>
                    <label for=''>
                        <span v-if='[3,5,9].includes(Number(tradeType)) '>
                            {{ Number(item.direction) === 1 ? $t('trade.orderAmount') : $t('trade.dealVolume') }}
                        </span>

                        <span v-if='[1,2].includes(Number(tradeType)) '>
                            {{ $t('trade.dealVolume') }}({{ $t('trade.volumeUnit') }})
                        </span>
                        <span v-else>
                            ({{ item.outCurrency }})
                        </span>
                    </label>
                    <span>
                        {{ item?.executeNum || '--' }}
                    </span>
                </p>

                <p v-if='isCloseType(item.bizType)' class='tl-item'>
                    <!-- 如果是平仓 显示开仓价 -->
                    <label for=''>
                        {{ $t('trade.positionPrice') }}
                    </label><span>
                        {{ item?.requestPrice || '--' }}
                    </span>
                </p>
                <p v-else-if='Number(item.bizType) === 1 || Number(item.bizType) === 12' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.trustPrice') }}
                    </label>
                    <span>
                        --
                    </span>
                </p>
                <p v-else class='tl-item'>
                    <label for=''>
                        {{ $t('trade.trustPrice') }}
                    </label>
                    <span>
                        {{ item?.requestPrice || '--' }}
                    </span>
                </p>

                <p class='tl-item'>
                    <label for=''>
                        {{ $t('trade.dealAvgPrice') }}
                    </label>
                    <span>
                        {{ item?.executePrice }}
                    </span>
                </p>

                <p v-if='showLossOrProfit(item)' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.stopLossPrice') }}
                    </label>
                    <span>
                        {{ parseFloat(item.stopLoss) > 0 ? item.stopLoss : '--' }}
                    </span>
                </p>
                <p v-if='showLossOrProfit(item)' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.stopProfitPrice') }}
                    </label>
                    <span>
                        {{ parseFloat(item.takeProfit) > 0 ? item.takeProfit : '--' }}
                    </span>
                </p>
                <p v-if='isCloseType(item.bizType)' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.profit') }}
                    </label>
                    <span>
                        {{ item?.profitLoss || '--' }}
                    </span>
                </p>

                <p v-if='[3, 9].includes(Number(tradeType))' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.loan') }}({{ item.outCurrency }})
                    </label>
                    <span>
                        {{ item.loanAmount || '--' }}
                    </span>
                </p>

                <p class='tl-item'>
                    <label for=''>
                        {{ $t('fee') }}
                        <span v-if='[3, 5].includes(Number(tradeType)) '>
                            ({{ item.inCurrency || '--' }})
                        </span>
                    </label>
                    <span>
                        {{ item.commission || '--' }}
                    </span>
                </p>

                <p v-if='Number(tradeType) === 2 && isCloseType(item.bizType)' class='tl-item'>
                    <label for=''>
                        {{ $t('trade.swap') }}
                    </label>
                    <span>
                        {{ item.overnightInterest || '--' }}
                    </span>
                </p>
            </div>
        </div>
        <div class='t-body'>
            <div class='t-block'>
                <p class='tl-item'>
                    <span>
                        {{ formatTime(item.executeTime,'YYYY/MM/DD HH:mm:ss' ) }}
                    </span>
                </p>
                <p class='tl-item'>
                    <span>
                        #{{ item?.dealId }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// components
import ETF from '@plans/components/etfIcon.vue'
// vue
import { computed } from 'vue'
// vuex
import { useStore } from 'vuex'
export default {
    components: {
        ETF
    },
    props: {
        // 数据
        item: {
            type: Object,
            defaulut: () => {}
        },
        // bizTypeText
        bizTypeText: {
            type: Object,
            default: () => {}
        },
        // 玩法类型
        tradeType: {
            type: [Number, String],
            default: ''
        }
    },
    setup (props) {
        const store = useStore()
        // 获取当前产品
        const symbolKey = `${props.item.symbolId}_${props.tradeType}`
        const curProduct = computed(() => store.state._quote.productMap[symbolKey] || {})

        // 判断是否是平仓
        const isCloseType = (bizType) => {
            if ([4, 5, 6, 7, 8].indexOf(Number(bizType)) > -1) {
                return true
            } else {
                return false
            }
        }

        // 是否显示止盈止损价
        const showLossOrProfit = (item) => {
            // 玩法cfd全仓和cfd逐仓才显示止盈止损价
            if ([1, 2].indexOf(Number(props.tradeType)) > -1 && !isCloseType(item.bizType)) {
                return true
            } else {
                return false
            }
        }

        return {
            curProduct,
            isCloseType,
            showLossOrProfit
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.deal-item {
    margin: 0 rem(20px) rem(20px) rem(20px);
    padding: rem(20px);
    background-color: var(--contentColor);
    border-radius: rem(8px);
    .t-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: rem(20px);
        .fl {
            display: flex;
            align-items: center;
            margin-right: rem(32px);
            color: var(--color);
            font-size: rem(30px);
            .name {
                margin-right: rem(20px);
            }
        }
    }
    .direction {
        margin: rem(20px) 0;
    }
    .t-body {
        .t-block {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .tl-item {
                display: inline-flex;
                justify-content: space-between;
                width: 47%;
                margin-bottom: rem(10px);
                color: var(--normalColor);
                line-height: rem(35px);
                label {
                    display: inline-block;
                    font-size: rem(20px);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }
                span {
                    font-size: rem(20px);
                    text-align: left;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
