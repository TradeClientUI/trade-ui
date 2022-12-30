<template>
    <div class='switchTradeType'>
        <div v-if='product' class='productInfo'>
            <div class="box" @click="$emit('switchProduct')">
                <span class='sortIconSpan'>
                    <i class="icon_quanrejiaohuan-"></i>
                </span>
                <span class='productName'>
                    {{ product.symbolName }}
                </span>
            </div>
            <ETF v-if='product.etf' />
            <span class='upDownWidth' :class='product.rolling_upDownColor'>
                {{ product.rolling_upDownWidth }}
                <!-- {{ parseFloat(product.upDownWidth) > 0 ? '+'+ product.upDownWidth : '-'+ Math.abs(parseFloat(product.upDownWidth)) }} -->
            </span>
            <span class='chartIcon icon_tubiao' @click="$router.push({ name:'Product', query: { symbolId:product.symbolId, tradeType:product.tradeType } })"></span>
        </div>
    </div>
</template>

<script>
import ETF from '@plans/components/etfIcon.vue'
export default {
    components: {
        ETF,
    },
    props: ['product'],
    emits: ['switchProduct'],
    setup (props, { emit }) {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.switchTradeType {
    position: relative;
    background: var(--contentColor);
}
.switchWrapper {
    display: flex;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(28px);
    line-height: rem(90px);
    border-bottom: 1px solid var(--assistColor);
    .item {
        margin-right: rem(35px);
        vertical-align: baseline;
    }
    .active {
        color: var(--color);
        font-weight: bold;
        font-size: rem(38px);
    }
}
.productInfo {
    display: flex;
    align-items: center;
    height: rem(104px);
    padding: 0 rem(30px);
    font-size: rem(34px);
    line-height: rem(104px);
    .box {
        display: inline-flex;
        align-items: center;
    }
    .icon_chouti1 {
        padding-right: rem(20px);
        font-size: rem(26px);
    }
    .productName {
        padding-right: rem(20px);
        font-weight: bold;
    }
    .upDownWidth {
        flex: 1;
    }
    .chartIcon {
        width: rem(62px);
        height: rem(58px);
        color: var(--normalColor);
        font-weight: 500;
        font-size: rem(30px);
        line-height: rem(58px);
        text-align: center;
        border-radius: 3px;
    }
    .sortIconSpan{
        margin-right: rem(8px);
    }
    .sortIcon{
        transform: rotate(90deg);
        font-size: rem(40px);
    }
    :deep(.etfIcon) {
        margin-right: rem(8px);
    }
}
</style>
