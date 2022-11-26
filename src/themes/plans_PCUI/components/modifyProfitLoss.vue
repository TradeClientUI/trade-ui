<template>
    <div class='modifyProfitLoss'>
        <!-- {{ stopLossRange }}--
        {{ product.buy_price }}--
        {{ product.sell_price }} -->
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
</template>

<script>
import ProfitLossBar from '@planspc/modules/profitLossBar/profitLossBar'
import { computed, reactive, ref, toRefs, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { profitLossPriceCompare } from '@planspc/views/order/pages/components/checkProfitLoss'
import { useStore } from 'vuex'
export default {
    components: {
        ProfitLossBar,
    },
    props: ['stopLoss', 'stopProfit', 'product', 'orderData', 'direction'],
    emits: ['update:stopLoss', 'update:stopProfit'],
    setup (props) {
        const stopLossRef = ref(null)
        const stopProfitRef = ref(null)
        const store = useStore()
        const state = reactive({
            stopLossPrice: '',
            stopProfitPrice: '',
        })
        const { t } = useI18n({ useScope: 'global' })
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const stopLossRange = computed(() => props.direction === 1 ? profitLossRang.value.buyStopLossRange : profitLossRang.value.sellStopLossRange)
        const profitRange = computed(() => props.direction === 1 ? profitLossRang.value.buyProfitRange : profitLossRang.value.sellProfitRange)
        const stopLossWarn = computed(() => {
            const warn = stopLossRef.value?.warn
            return warn && profitLossPriceCompare('stopLoss', props.direction, state.stopLossPrice, profitLossRang.value, t)
        })
        const stopProfitWarn = computed(() => {
            const warn = stopProfitRef.value?.warn
            return warn && profitLossPriceCompare('profit', props.direction, state.stopProfitPrice, profitLossRang.value, t)
        })
        watchEffect(() => {
            if (state.stopLossPrice !== props.stopLoss) {
                state.stopLossPrice = props.stopLoss
            }
            if (state.stopProfitPrice !== props.stopProfit) {
                state.stopProfitPrice = props.stopProfit
            }
        })
        return {
            ...toRefs(state),
            stopLossRef,
            stopProfitRef,
            stopLossRange,
            profitRange,
            stopProfitWarn,
            stopLossWarn,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.modifyProfitLoss{

}
.priceRange {
    color: var(--minorColor);
    font-size: rem(22px);
}
</style>
