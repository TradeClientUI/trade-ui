<template>
    <div v-if='product' class='directions' :class="{ 'center': dealModeShowMap[product.dealMode]?.handicap }">
        <div class='item buy' :class="{ 'buy-active':modelValue==='buy' }" @click="setDirection('buy')">
            <span>
                {{ $t('trade.buy') }}
            </span>
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class='price flRight'>
                {{ product.buy_price }}
            </span>
            <i class='tick'></i>
        </div>
        <div class='item sell' :class="{ 'sell-active':modelValue==='sell' }" @click="setDirection('sell')">
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class=' price'>
                {{ product.sell_price }}
            </span>
            <span class='flRight'>
                {{ $t('trade.sell') }}
            </span>
            <i class='tick'></i>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { toolHooks } from '@plans/hooks/handicap'
export default {
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const { dealModeShowMap } = toolHooks()

        // 颜色值
        const style = computed(() => store.state.style)
        const setDirection = (data) => {
            emit('update:modelValue', data)
        }
        // 16进制颜色透明度
        const fallColor = style.value.fallColor + '80'
        const riseColor = style.value.riseColor + '80'
        return {
            setDirection,
            dealModeShowMap,
            fallColor,
            riseColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.directions {
    position: relative;
    display: flex;
    margin-top: rem(38px);
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        line-height: 1;
        box-sizing: border-box;
        height: rem(80px);
        padding: 0 rem(30px);
        color: var(--color);
        border-radius: rem(6px);
        font-weight: bold;
        font-size: rem(28px);
        color: var(--minorColor);
        border: 1px solid var(--minorColor);
        position: relative;
        &::after{
            visibility: hidden;
            position: absolute;
            content: '\e728';
            width: rem(30px);
            height: rem(30px);
            border-radius: 0px rem(10px) 0px rem(10px);
            right: -1px;
            top: rem(-2px);
            font-family: 'iconfont';
        }
        .tick {
            visibility: hidden;
            position: absolute;
            right: rem(8px);
            top: 0;
            width: rem(10px);
            height: rem(18px);
            border-color: var(--contentColor);
            border-style: solid;
            border-width: 0 rem(4px) rem(4px) 0;
            transform: rotate(45deg);
            z-index: 99;
        }
    }
    .buy {
        margin-right: rem(10px);
    }
    .buy-active {
        opacity: 1;
        color: var(--riseColor);
        border: 1px solid var(--riseColor);
        &::after {
            visibility: visible;
            background: var(--riseColor);
        }
        .tick {
            visibility: visible;
        }
    }
    .sell-active {
        opacity: 1;
        color: var(--fallColor);
        border: 1px solid var(--fallColor);
        &::after {
            visibility: visible;
            background: var(--fallColor);
        }
        .tick {
            visibility: visible;
        }
    }
    .price {
        font-size: rem(30px);
    }
    &.center {
        .item {
            justify-content: center;
        }
    }
}
</style>
