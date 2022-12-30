<template>
    <div class='profitLossSetBar'>
        <FloatTip v-if='stopLossWarn || stopProfitWarn'>
            {{ stopLossWarn || stopProfitWarn }}
        </FloatTip>

        <div v-if='enabled'>
            <ProfitLossBar
                ref='stopLossRef'
                v-model='stopLossPrice'
                :max='stopLossRange[1]'
                :min='stopLossRange[0]'
                :product='product'
                @change="$emit('update:stopLoss',stopLossPrice)"
            >
                <template #title>
                    <p>{{ $t('trade.stopLossPrice') }}</p>
                    <p class='priceRange'>
                        &le; {{ stopLossRange[1] }}
                    </p>
                </template>
            </ProfitLossBar>
            <ProfitLossBar
                ref='stopProfitRef'
                v-model='stopProfitPrice'
                :max='profitRange[1]'
                :min='profitRange[0]'
                :product='product'
                @change="$emit('update:stopProfit',stopProfitPrice)"
            >
                <template #title>
                    <p>{{ $t('trade.stopProfitPrice') }}</p>
                    <p class='priceRange'>
                        &ge; {{ profitRange[0] }}
                    </p>
                </template>
            </ProfitLossBar>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watchEffect } from 'vue'
import ProfitLossBar from '@planspc/modules/profitLossBar/profitLossBar'
import FloatTip from './floatTip'
import { profitLossPriceCompare } from './checkProfitLoss'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        ProfitLossBar,
        FloatTip,
    },
    props: ['product', 'stopLoss', 'stopProfit', 'direction', 'enabled'],
    emits: ['update:stopLoss', 'update:stopProfit'],
    setup (props, { emit }) {
        const store = useStore()
        const stopLossRef = ref(null)
        const stopProfitRef = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({

            stopLossPrice: '',
            stopProfitPrice: '',
        })
        const dire = props.direction === 'buy' ? 1 : 2
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const stopLossRange = computed(() => props.direction === 'buy' ? profitLossRang.value.buyStopLossRange : profitLossRang.value.sellStopLossRange)
        const profitRange = computed(() => props.direction === 'buy' ? profitLossRang.value.buyProfitRange : profitLossRang.value.sellProfitRange)
        const stopLossWarn = computed(() => {
            const warn = stopLossRef.value?.warn
            return warn && profitLossPriceCompare('stopLoss', dire, state.stopLossPrice, profitLossRang.value, t)
        })
        const stopProfitWarn = computed(() => {
            const warn = stopProfitRef.value?.warn
            return warn && profitLossPriceCompare('profit', dire, state.stopProfitPrice, profitLossRang.value, t)
        })

        watchEffect(() => {
            if (props.stopLoss !== state.stopLossPrice) {
                state.stopLossPrice = props.stopLoss
            }
            if (props.stopProfit !== state.stopProfitPrice) {
                state.stopProfitPrice = props.stopProfit
            }
        })
        // 开启关闭止盈止损
        const switchCellChange = (e) => {
            if (!e) {
                emit('update:stopLoss', '')
                emit('update:stopProfit', '')
            }
        }
        return {
            ...toRefs(state),
            stopLossWarn,
            stopProfitWarn,
            stopLossRef,
            stopProfitRef,
            profitLossRang,
            stopLossRange,
            profitRange,
            switchCellChange,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.cellWrapper {
    padding: 10px 0;
    &::after {
        display: none;
    }
}
.priceRange {
    color: var(--color);
    font-size: rem(24px);
}
.floatTip {
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: rem(50px);
    color: var(--warn);
    line-height: rem(50px);
    text-align: center;
    background: #FFF0E2;
}
</style>
