<template>
    <ul class='assets-list'>
        <li
            v-for='(item, i) in accountList'
            :key='i'
            :class='{ active: curCurrency === item.currency }'
            @click='checkCurrency(item)'
        >
            <CurrencyIcon :currency='item.currency' :size='24' />
            <div class='name'>
                <p class='t1'>
                    {{ item.currency }}
                </p>
                <p class='t2'>
                    {{ assetsMap[item.currency] }}
                </p>
            </div>
            <i v-if='curCurrency === item.currency' class='tick'></i>
        </li>
    </ul>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { useStore } from 'vuex'
import { assetsMap } from './assetsMap'
import { onBeforeMount, computed, reactive, watch, toRefs, onUnmounted } from 'vue'
export default {
    components: {
        CurrencyIcon
    },
    props: ['show', 'currency', 'tradeType', 'accountList'],
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            popupShow: props.show,
            curCurrency: props.currency,
            assetsMap
        })

        watch(() => state.popupShow, val => {
            context.emit('update:show', val)
        })

        const close = () => {
            context.emit('update:show', false)
        }

        // 选择币种
        const checkCurrency = (currency) => {
            state.curCurrency = currency.currency

            currency.fullName = state.assetsMap[currency.currency]
            context.emit('update:currency', currency)
            // state.popupShow = false
        }
        const bgColor = style.value.primary + '0D'
        return {
            close,
            bgColor,
            // accountList,
            checkCurrency,
            ...toRefs(state)
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.assets-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    max-height: 360px;
    padding: 15px;
    background: var(--bgColor);
    border: 1px solid var(--lineColor);
    position: absolute;
    left: 0;
    top: rem(110px);
    overflow-y: auto;
    li{
        @include hover();
        position: relative;
        padding-left: rem(30px);
        flex: 0 0 48%;
        background: var(--contentColor);
        border-radius: rem(10px);
        display: flex;
        align-items: center;
        height: rem(110px);
        margin-bottom: rem(30px);
        border: rem(2px) solid transparent;
        cursor: pointer;
        .name {
            margin-left: rem(15px);
        }
        .t1{
            font-size: rem(32px);
        }
        .t2{
            color: var(--minorColor);
            font-size: rem(24px);
        }
        &.active{
            background: v-bind(bgColor);
            border: rem(2px) solid var(--primary);
            &::after{
                position: absolute;
                content: '\e728';
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0px rem(10px) 0px rem(10px);
                right: 0;
                top: rem(-2px);
                font-family: 'iconfont';
            }
        }
        .tick{
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
}
</style>
