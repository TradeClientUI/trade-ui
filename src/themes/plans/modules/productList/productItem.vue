<template>
    <div class='productItem of-1px-bottom' :class='[bgClass]' :data-symbolId='product.symbolId' @click="$emit('open')">
        <div v-if='product.symbolName' class='cell'>
            <div
                class='th name'
                :class='[
                    getLen(product.simplified) > 10 && "small",
                    getLen(product.simplified) > 15 && "mini"]'
            >
                {{ product.symbolName }}
                <p v-if='product.etf'>
                    <ETF />
                </p>
            </div>
            <div class='ft'>
                <span
                    class='buy_price'
                    :class='[product.last_color, "digits"+product.symbolDigits]'
                >
                    {{ !product.rolling_last_price && product.rolling_last_price != 0 ? '- -' : product.rolling_last_price }}
                    <!-- {{ !product.buy_price && product.buy_price != 0 ? '- -' : product.buy_price }} -->
                </span>
            </div>
            <div class='tb'>
                <span
                    class='sell_price'
                    :class='[product.rolling_upDownColor,"digits"+product.symbolDigits]'
                >
                    {{ !product.rolling_upDownWidth && product.rolling_upDownWidth != 0 ? '- -' : product.rolling_upDownWidth }}
                    <!-- {{ !product.sell_price && product.sell_price != 0 ? '- -' : product.sell_price }} -->
                </span>
            </div>
        </div>
        <!-- <div v-if='product.symbolName' class='cell'>
            <p>
                <span class='upDownAmount' :class='product.upDownColor'>
                    {{ product.upDownAmount }}
                </span>
                <span class='upDownWidth' :class='product.upDownColor'>
                    {{ product.upDownWidth }}
                </span>
            </p>
        </div> -->
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { getLen, localGet, getQueryString } from '@/utils/util'
import ETF from '@plans/components/etfIcon'
export default {
    components: {
        ETF,
    },
    props: {
        product: {
            type: Object,
            default: () => ({})
        },
    },
    setup (props, context) {
        const store = useStore()

        const quoteMode = computed(() => store.state.quoteMode)
        const longName = computed(() => getLen(props.product?.symbolName) > 10)
        const tickTime = computed(() => {
            const tick_time = props.product.tick_time ?? ''
            return tick_time ? window.dayjs(Number(tick_time)).format('HH:mm:ss') : ''
        })

        const chartColorType = computed(() => getQueryString('chartColorType') || Number(JSON.parse(localGet('chartConfig'))?.chartColorType) || 1)

        const state = reactive({
            bgClass: ''
        })
        const price = 0
        watch(
            () => props.product.sell_price,
            (val) => {
                // if (price === 0) {
                //     if ((props.product.sell_color === 'riseColor' && chartColorType.value === 1) || (props.product.sell_color === 'fallColor' && chartColorType.value === 2)) {
                //         state.bgClass = 'riseColorBgAni'
                //     } else if ((props.product.sell_color === 'fallColor' && chartColorType.value === 1) || (props.product.sell_color === 'riseColor' && chartColorType.value === 2)) {
                //         state.bgClass = 'fallColorBgAni'
                //     }
                //     price = val
                // } else {
                //     if (val - price > 0) {
                //         state.bgClass = 'riseColorBgAni'
                //     } else if (val - price < 0) {
                //         state.bgClass = 'fallColorBgAni'
                //     }
                //     price = val
                // }
            })
        return {
            ...toRefs(state),
            tickTime,
            quoteMode,
            getLen,
            longName,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem {
    @include active();
    position: relative;
    height: rem(118px);
    padding: rem(20px) 0;
    overflow: hidden;
    line-height: rem(76px);
    background-color: var(--contentColor);
    .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
        // line-height: 1.45;
        .th {
            position: relative;
            flex: 1;
            overflow-y: visible;
        }
        .tb {
            width: rem(210px);
            text-align: right
        }
        .ft {
            width: rem(210px);
            text-align: left;
        }
    }
    .price {
        font-size: rem(30px);
    }
    .hd {
        flex: 1;
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1.3;
    }
    .name {
        @include ellipsis();
        color: var(--color);
        font-weight: 400;
        font-size: rem(30px);
        line-height: 1.15;
        padding-bottom: 1px;
        &.small {
            font-size: rem(26px);
        }
        &.mini {
            font-size: rem(22px);
        }
    }
    .symbolCode {
        margin-top: 5px;
        color: var(--minorColor);
    }
    .sell_price,
    .buy_price {
        font-size: rem(30px);
        &.digits11,
        &.digits12,
        &.digits13 {
            font-size: rem(26px);
        }
        &.digits14,
        &.digits15,
        &.digits16 {
            font-size: rem(22px);
        }
    }
    .sell_price{
        font-weight: bold;
    }
    .col {
        width: rem(280px);
        margin-left: rem(10px);
        font-size: rem(24px);
        text-align: right;
    }
    .upDownAmount {
        padding-right: rem(15px);
    }
}
</style>
