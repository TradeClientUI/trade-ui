<template>
    <span class='symbolCurrency'>
        <i v-show='isHK || isUS' class='supLabel' :class='{ hk:isHK,us:isUS }'>
            {{ isUS ? 'US':'HK' }}
        </i>
        {{
            product.isCryptocurrency
                ? product.baseCurrency
                : product.symbolName
        }}
    </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    product: {
        type: Object,
        default: () => ({})
    }
})
const labels = computed(() => props.product.labels?.toLowerCase().split(',') || [])
const isUS = computed(() => labels.value.includes('us-stock'))
const isHK = computed(() => labels.value.includes('hk-stock'))
</script>

<style lang="scss" scoped>
.symbolCurrency {
    display: inline-block;
    font-size: 14px;
    vertical-align: middle;
    .supLabel {
        font-weight: normal;
        line-height: 1;
        font-size: 12px;
        &.hk {
            padding: 1px 3px;
            border-radius: 2px;
            color: #ED8700;
            background: #FFF0D3;
        }
        &.us {
            padding: 1px 3px;
            border-radius: 2px;
            color: #0062FF;
            background: #E4E4E4;
        }
    }
}
</style>
