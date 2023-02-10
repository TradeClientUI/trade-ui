<template>
    <div class='wrapper'>
        <FloatTip v-if='warn'>
            {{ warn }}
        </FloatTip>
        <label>{{ $tm('trade.priceMap')[direction] }}</label>

        <PendingBar
            v-model='pendingPrice'
            :direction='direction'
            :product='product'
            @change='onChange'
        />
    </div>
</template>

<script>
import { lt, gt, pow } from '@/utils/calculation'
import PendingBar from './pendingBar'
import FloatTip from './floatTip'
import { Dialog } from 'vant'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        FloatTip,
        PendingBar,
    },
    props: ['modelValue', 'product', 'direction'],
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const pendingRang = computed(() => {
            const range = store.getters['_trade/pendingPriceRang']
            const limitRange = props.direction === 'buy' ? range.buyLimitRange : range.sellStopRange
            const stopRange = props.direction === 'buy' ? range.buyStopRange : range.sellLimitRange
            return {
                stopRangeMax: stopRange[1],
                stopRangeMin: stopRange[0],
                limitRangeMax: limitRange[1],
                limitRangeMin: limitRange[0],
                defaultBuyPrice: range.defaultBuyPrice,
                defaultSellPrice: range.defaultSellPrice
            }
        })
        const warn = computed(() => {
            const directionText = props.direction === 'buy' ? t('trade.buy') : t('trade.sell')
            const modelValue = props.modelValue
            const pendingRange = pendingRang.value
            if (!modelValue) {
                return false
            } else if (lt(modelValue, pendingRange.stopRangeMin) && gt(modelValue, pendingRange.limitRangeMax)) {
                return directionText + t('trade.pendingPriceWarn')
            } else if (gt(modelValue, pendingRange.stopRangeMax) || lt(modelValue, pendingRange.limitRangeMin)) {
                return directionText + t('trade.pendingPriceWarn2')
            } else {
                return false
            }
        })
        const pendingPrice = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const step = computed(() => pow(0.1, props.product.price_digits))
        const state = reactive({
            num: props.modelValue
        })
        const change = val => emit('update:modelValue', val)
        const priceIntroduce = () => {
            Dialog.alert({
                title: t('trade.priceIntroduce'),
                message: t('trade.priceIntroContent'),
            })
        }
        const firstChange = () => {
            const defaultPendingPrice = pendingRang.value[props.direction === 'buy' ? 'defaultBuyPrice' : 'defaultSellPrice']
            if (defaultPendingPrice && !isNaN(defaultPendingPrice)) emit('update:modelValue', defaultPendingPrice)
        }

        const onChange = (e) => emit('change', e)
        onMounted(() => {
            firstChange()
        })
        return {
            ...toRefs(state),
            step,
            warn,
            pendingRang,
            pendingPrice,
            change,
            onChange,
            priceIntroduce,
            firstChange,
        }
    },
    watch: {
        modelValue: {
            handler (newval) {
                if (newval !== this.num) this.num = newval
                if (newval) this.$store.commit('_trade/Update_pendingPrice', { price: newval, direction: this.direction })
            },
            immediate: true
        }
    },
    beforeUnmount () {
        this.$store.commit('_trade/Update_pendingPrice', { price: '', direction: this.direction })
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    line-height: 1.5;
    .title {
        line-height: 1;
        .icon {
            color: var(--minorColor);
            vertical-align: -3px;
        }
    }
    label {
        color: var(--normalColor);
    }
    .pendingRang {
        color: var(--minorColor);
        font-size: rem(20px);
    }
}
.stepper {
    background: var(--primaryAssistColor);
    border-radius: rem(10px);
    &.warn {
        color: var(--warn);
    }
    :deep(.input) {
        width: rem(240px);
    }
}
html.dark {
    .wrapper {
        label {
            color: #FFF;
        }
    }
}
</style>
