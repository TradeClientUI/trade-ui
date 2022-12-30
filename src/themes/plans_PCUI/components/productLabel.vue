<template>
    <i v-show='isHK || isUS' class='productLabel' :class='{ hk:isHK,us:isUS }'>
        {{ isUS ? 'US':'HK' }}
    </i>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const props = defineProps({
    symbolKey: {
        type: String,
        default: ''
    }
})
const store = useStore()
const productMap = computed(() => store.state._quote.productMap)
const product = computed(() => productMap.value[props.symbolKey] || {})
const labels = computed(() => product.value.labels?.toLowerCase().split(',') || [])
const isUS = computed(() => labels.value.includes('us-stock'))
const isHK = computed(() => labels.value.includes('hk-stock'))
</script>

<style lang="scss" scoped>
.productLabel {
    font-weight: normal;
    line-height: 1;
    margin-right: 2px;
    font-size: 12px;
    font-style: normal;
    display: inline-block;
    padding: 2px 3px;
    border-radius: 2px;
    &.hk {
        color: #ED8700;
        background: #FFF0D3;
    }
    &.us {
        color: #0062FF;
        background: #E4E4E4;
    }
}
</style>
