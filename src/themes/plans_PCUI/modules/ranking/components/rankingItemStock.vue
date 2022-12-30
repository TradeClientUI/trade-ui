<template>
    <div class='rankingItem'>
        <div class='titleBar'>
            <h3 class='title'>
                {{ title }}
            </h3>

            <el-select
                v-model='currencyVal'
                class='currencySelect'
                placeholder='Select'
                size='small'
                @change='changeCurrency'
            >
                <el-option
                    v-for='item in currencyList'
                    :key='item.currency'
                    :label="item.currency + (lang==='en-US' ? ' ': '')+ $t('trade.markets')"
                    :value='item.currency'
                />
            </el-select>
        </div>
        <ul class='rankingList' :class='{ showIndex: indexColumn }'>
            <li class='item labelBar'>
                <slot name='header'>
                    <span v-if='indexColumn' class='label'></span>
                    <span class='label'>
                        {{ $t('trade.name') }}
                    </span>
                    <span class='label'>
                        {{ $t('trade.code') }}
                    </span>
                    <span class='label'>
                        {{ $t('trade.priceLabel') }}
                    </span>
                    <span class='label'>
                        {{ type==='increaseRanking' ? $t('ranking.upWidth') : $t('ranking.downWidth') }}
                    </span>
                </slot>
            </li>

            <li v-for='(item, i) in sortListResult' :key='i' class='item productItem' @click='clickHandler(item)'>
                <slot :i='i' :item='item'>
                    <span v-if='indexColumn' class='label'>
                        {{ i + 1 }}
                    </span>
                    <SymbolName class='label' :product='item' />
                    <span class='label'>
                        {{ item.symbolCode }}
                    </span>
                    <span class='label' :class='[item.cur_color]'>
                        {{ item.cur_price }}
                    </span>
                    <span class='label' :class='[item.upDownColor]'>
                        {{ item.upDownWidth }}
                    </span>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import SymbolName from './symbolName'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        SymbolName,
    },
    props: {
        title: String,
        currencyList: Array,
        currency: String,
        type: String,
        labelIndex: [String, Number],
        indexColumn: {
            type: Boolean,
            default: false
        },
        max: {
            type: Number,
            default: 3
        },
        iconSize: {
            type: [Number, String],
            default: '24px'
        },
    },
    emits: ['update:currency'],
    setup (props, { emit }) {
        const router = useRouter()

        const currencyVal = computed({
            get: () => props.currency,
            set: (val) => emit('update:currency', val),
        })

        // 排序后的产品列表
        const sortListResult = ref([])

        // 排序方法
        const sortFunc = () => {
            if (props.type === '' || props.currency === '') return []
            const curCurrencyProdocutList = props.currencyList.find(el => el.currency === props.currency)
            if (!curCurrencyProdocutList) return []
            const proList = curCurrencyProdocutList.list.slice()
            // increaseRanking 涨幅榜  declineRanking 跌幅榜 amountRanking 成交额榜
            if (props.type === 'increaseRanking') {
                proList.sort((a, b) => {
                    const firtstValue = isNaN(parseFloat(a.upDownWidth)) ? -Infinity : parseFloat(a.upDownWidth)
                    const secondValue = isNaN(parseFloat(b.upDownWidth)) ? -Infinity : parseFloat(b.upDownWidth)
                    return secondValue - firtstValue
                })
            } else if (props.type === 'declineRanking') {
                proList.sort((a, b) => {
                    const firtstValue = isNaN(parseFloat(a.upDownWidth)) ? Infinity : parseFloat(a.upDownWidth)
                    const secondValue = isNaN(parseFloat(b.upDownWidth)) ? Infinity : parseFloat(b.upDownWidth)
                    return firtstValue - secondValue
                })
            }
            sortListResult.value = proList.slice(0, props.max)
        }

        // 重置币种
        const resetCurrency = async () => {
            const currency = props.currencyList[0]?.currency
            if (currency) {
                emit('update:currency', currency)
                await nextTick()
                sortFunc()
            }
        }
        // 设置默认币种
        watch(
            () => props.currencyList,
            (newval, oldval) => {
                if (newval?.length > 0 && oldval?.length === 0) resetCurrency()
            },
            {
                immediate: true
            }
        )

        // 切换标签tab时，重置币种
        watch(
            () => props.labelIndex,
            () => {
                resetCurrency()
            },
            {
                immediate: true
            }
        )

        // 切换盈利货币时重新订阅并完成产品列表排序
        const changeCurrency = async (val) => {
            await nextTick()
            const curCurrencyProdocuts = props.currencyList.find(el => el.currency === props.currency)
            if (curCurrencyProdocuts) {
                const subscribeSymbolKey = curCurrencyProdocuts.list.map(el => el.symbolKey)
                QuoteSocket.send_subscribe_stock(subscribeSymbolKey).then(res => {
                    sortFunc()
                })
            }
        }

        // 跳转到产品交易页面
        const clickHandler = (item) => {
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }

        return {
            lang: getCookie('lang'),
            sortFunc,
            changeCurrency,
            currencyVal,
            sortListResult,
            clickHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
.rankingItem {
    position: relative;
    padding-bottom: 20px;
    .titleBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 40px;
        .title {
            font-weight: normal;
            font-size: 16px;
        }
    }
    .categorySelect {
        position: absolute;
        top: 0;
        right: 20px;
    }
    .currencySelect {
        width: 150px;
        :deep(.el-input__inner) {
            background: none;
            border: 1px solid var(--lineColor);
        }
    }
}
.rankingList {
    margin-top: 20px;
    .labelBar {
        height: 32px;
        color: var(--minorColor);
        line-height: 32px;
    }
    .item {
        display: grid;
        grid-template-columns: 3fr 2fr 1.5fr 1.5fr;
        box-sizing: content-box;
        height: 24px;
        padding: 5px 6px;
        line-height: 24px;
        &.productItem {
            padding: 7px 6px;
            cursor: pointer;
            &:hover {
                background: var(--assistColor);
                border-radius: 5px;
            }
        }
        .label {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .label:last-child {
            text-align: right;
        }
    }
    .symbolCurrencyIcon {
        margin-right: 8px;
    }
}
.showIndex {
    .item {
        grid-template-columns: 20px 3fr 3fr 1.5fr 1.5fr !important;
    }
}
</style>
