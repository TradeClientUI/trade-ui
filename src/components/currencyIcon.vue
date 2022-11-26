<template>
    <!-- <i class='currencyIcon' :style='imgStyle'></i> -->
    <img alt='' class='currencyIcon' :src='getCurrencyIcon(currency)' srcset='' />
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
    currency: String,
    size: {
        type: [Number, String],
        default: '16px'
    }
})
// 加载币种图标
const getCurrencyIcon = (currency) => {
    try {
        return require('@/assets/currency_icon/' + currency + '.png')
    } catch (error) {
        return require('@/assets/currency_icon/default.png')
    }
}
const imgWidth = ref(parseFloat(props.size) + 'px')
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
// 资产币种的图标
.currencyIcon{
    display: inline-block;
    width: v-bind(imgWidth);
    vertical-align: middle;
}
</style>
