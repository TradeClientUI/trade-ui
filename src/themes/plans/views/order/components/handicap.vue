<template>
    <div class='orderHandicap'>
        <van-popover v-model:show='showPopover' :actions='digitLevelList' class='handicapDigitsOptions' @select='onSelect'>
            <template #reference>
                <button class='selectBtn'>
                    {{ handicapDigit }}
                    <i class='icon_arrow'></i>
                </button>
            </template>
        </van-popover>
        <div class='titleBar'>
            <span class='hd'>
                {{ $t('trade.priceLabel') }}
            </span>
            <span class='ft'>
                <span v-if='Number(product.tradeType) === 2'>
                    {{ $t('trade.quantity') }}
                </span>
                <span v-else>
                    {{ $t('trade.volumes') }}
                </span>
            </span>
        </div>

        <div class='priceMultiGear buy'>
            <p v-for='(item, index) in ask_deep' :key='index' class='item'>
                <span class='hd'>
                    {{ item.price_ask }}
                </span>
                <span class='ft'>
                    {{ formatAmount(item.volume_ask) }}
                </span>
                <span v-if='item.width' class='volunmePercent buy' :style="{ width:item.width+'%' }"></span>
            </p>
        </div>
        <div class='curPrice' :class='[product.cur_color]' :data-lastPrice='lastPrice'>
            {{ lastPriceShow || '--' }}
        </div>
        <div class='priceMultiGear sell'>
            <p v-for='(item, index) in bid_deep' :key='index' class='item'>
                <span class='hd'>
                    {{ item.price_bid }}
                </span>
                <span class='ft'>
                    {{ formatAmount(item.volume_bid) }}
                </span>
                <span v-if='item.width' class='volunmePercent' :style="{ width:item.width+'%' }"></span>
            </p>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import computeHandicap from '@plans/hooks/handicap'
import { lt, pow, formatAmount, gte, lte, toFixed, plus, div } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            showPopover: false,
            handicapDigit: pow(0.1, props.product?.symbolDigits),
            lastPriceColor: '', // 最新成交价的颜色
            lastPriceShow: '', // 最新成交价，新的报价不在盘口范围内的时候过滤掉
        })
        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find(({ symbol_id }) => parseInt(symbol_id) === props.product.symbolId))
        // 最新成交价
        const lastPrice = computed(() => store.state._quote.dealList[0]?.price)
        const deallist = computed(() => store.state._quote.dealList)

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: false
        })

        // 报价不够5档，补空位
        const fillPosition = (data, type) => {
            const keyLabel = {
                priceLabel: {
                    1: 'price_ask',
                    2: 'price_bid'
                },
                volume: {
                    1: 'volume_ask',
                    2: 'volume_bid'
                }
            }
            const result = data
            if (Array.isArray(result)) {
                let fillLength = 5 - data.length
                while (fillLength > 0) {
                    result.push({
                        [keyLabel.priceLabel[type]]: '--',
                        [keyLabel.volume[type]]: '--',
                        with: 0,
                        unitNum: 0
                    })
                    fillLength--
                }
            }

            return result
        }

        const ask_deep = computed(() => {
            const askResult = handicapResult.value?.ask_deep?.slice(0, 5) || []
            if (askResult.length < 5) {
                return fillPosition(askResult, 1)
            } else {
                return askResult
            }
        })

        const bid_deep = computed(() => {
            const bidREsult = handicapResult.value.bid_deep.slice(0, 5)
            if (bidREsult.length < 5) {
                return fillPosition(bidREsult, 2)
            } else {
                return bidREsult
            }
        })

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            // 部分产品price_digits可能不存在
            let symbolDigits = props.product?.price_digits || props.product?.symbolDigits || 0
            // 优先取昨收，如果没有则读开盘
            const price = (props.product?.yesterday_close_price || props.product?.open_price)
            while (symbolDigits > -3) {
                const v = pow(0.1, symbolDigits)
                // 当前档位不能大于报价缩进一位的值
                if (v <= (price / 10)) {
                    digits.push({ text: v })
                } else {
                    break
                }
                symbolDigits--
            }
            return digits.splice(0, 5)
        })

        // 最新成交价的颜色， 判断最新价是否在当前盘口买一卖一的范围内
        watch(
            () => lastPrice.value,
            (newval, oldval) => {
                (state.lastPriceColor = lt(newval, oldval) ? 'fallColor' : 'riseColor')
                const askFirst = ask_deep.value[0]
                const bidFirst = bid_deep.value[0]
                if (lte(lastPrice.value, askFirst.price_ask) && gte(lastPrice.value, bidFirst.price_bid)) {
                    state.lastPriceShow = lastPrice.value
                }
            }
        )
        // 盘口变动时，如果最新价不在当前盘口买一卖一的范围内，(买一+卖一)/2算出最新价
        watch(
            () => bid_deep.value[0],
            (newval, oldval) => {
                if (!parseFloat(newval.price_bid)) return
                const askFillList = ask_deep.value.filter(el => parseFloat(el.price_ask))
                const askFirst = askFillList[0]
                const bidFirst = bid_deep.value[0]
                const isBetween = lte(state.lastPriceShow, askFirst.price_ask) && gte(state.lastPriceShow, bidFirst.price_bid)
                if (!state.lastPriceShow || !isBetween) {
                    const t = plus(askFirst.price_ask, bidFirst.price_bid)
                    const m = div(t, 2)
                    state.lastPriceShow = toFixed(m, props.product.symbolDigits)
                }
            }
        )
        // 产品变化之后重置深度报价小数位的长度
        watch(
            () => props.product.symbolId,
            newval => (state.handicapDigit = pow(0.1, props.product.symbolDigits))
        )

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            state.handicapDigit = val.text
            const priceBreadth = Number(props.product.priceBreadth) >= 5 ? 5 : props.product.priceBreadth
            QuoteSocket.deal_subscribe(props.product.symbolId, priceBreadth, val.text, props.product.tradeType, 20)
        }

        return {
            ...toRefs(state),
            onSelect,
            handicapList,
            formatAmount,
            lastPrice,
            ask_deep,
            bid_deep,
            digitLevelList,
            handicapResult,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderHandicap {
    padding-top: rem(25px);
    .titleBar {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--placeholdColor);
    }
    .priceMultiGear {
        height: rem(200px);
        margin-top: rem(20px);
        font-size: rem(24px);
        line-height: rem(40px);

        &.sell {
            color: var(--riseColor);
        }
        &.buy {
             display: flex;
            flex-flow: column-reverse;
            color: var(--fallColor);
        }
        .item {
            position: relative;
            display: flex;
            justify-content: space-between;
            .volunmePercent {
                position: absolute;
                top: 0;
                right: 0;
                max-width: 99%;
                height: 100%;
                background: var(--riseColor);
                opacity: 0.05;
                transition: all 0.3s linear;
                content: '';
                &.buy {
                    background: var(--fallColor);
                }
            }
            .ft {
                color: var(--normalColor);
            }
        }
    }
    .curPrice {
        text-align: center;
        height: rem(34px);
        margin-top: rem(20px);
        font-size: rem(30px);
        line-height: rem(34px);
    }
    .selectBtn {
        position: relative;
        height: rem(40px);
        padding: 0 rem(60px) 0 rem(15px);
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1;
        background: var(--assistColor);
        border-radius: rem(4px);
    }
    .icon_arrow {
        position: absolute;
        top: 8px;
        right: 8px;
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid var(--minorColor);
        border-color: var(--minorColor) transparent transparent transparent;
        border-width: 5px 5px 0;
        border-radius: 3px;
    }
}
</style>

<style lang="scss">
.handicapDigitsOptions {
    --van-popover-light-background-color: var(--assistColor);
}
</style>
