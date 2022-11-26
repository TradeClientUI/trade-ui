<template>
    <div v-if='product' class='directions' :class="{ 'center': dealModeShowMap[product.dealMode]?.handicap }">
        <div class='item buy' :class="{ 'active':modelValue==='buy' }" @click="setDirection('buy')">
            <span>
                {{ $t('trade.buy') }}
            </span>
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class='price flRight'>
                {{ product.buy_price }}
            </span>
        </div>
        <div class='item sell' :class="{ 'active':modelValue==='sell' }" @click="setDirection('sell')">
            <span v-if='!dealModeShowMap[product.dealMode]?.handicap' class=' price'>
                {{ product.sell_price }}
            </span>
            <span class='flRight'>
                {{ $t('trade.sell') }}
            </span>
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
    &.center {
        text-align: center;
        .item {
            padding: 0 !important;
            line-height: rem(75px);
        }
        .flRight {
            float: none;
            text-align: center;
        }
    }
    .item {
        flex: 1;
        box-sizing: border-box;
        height: rem(80px);
        padding: rem(10px) rem(20px);
        color: var(--color);
        line-height: rem(50px);
        //background: var(--assistColor);
        border-radius: rem(6px);
        font-weight: bold;
        font-size: rem(28px);
        &.sell {
            margin-left: 5px;
            border: solid rem(2px) v-bind(fallColor);
            color: var(--fallColor);
            &.active {
                opacity: 1;
                color: #FFF;
                background: var(--fallColor);
            }
        }
        &.buy {
            margin-right: 5px;
            border: solid rem(2px) v-bind(riseColor);
            color: var(--riseColor);
            &.active {
                opacity: 1;
                color: #FFF;
                background: var(--riseColor);
            }
        }
    }
    .price {
        font-size: rem(30px);
    }
    .flRight {
        float: right;
    }
}
</style>
