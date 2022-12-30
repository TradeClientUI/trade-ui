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
            <div v-if='curCurrency === item.currency' class='check'>
                <van-icon color='#fff' name='success' />
            </div>
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
.assets-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    max-height: 360px;
    padding: 15px;
    background: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-radius: 0 0 rem(10px) rem(10px);
    box-shadow: 0 rem(5px) rem(10px) rgba(0,0,0,.1);
    position: absolute;
    left: 0;
    top: rem(112px);
    overflow-y: auto;
    li {
        @include hover();
        position: relative;
        padding-left: rem(30px);
        flex: 0 0 48%;
        background: var(--bgColor);
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
        .t1 {
            font-size: rem(32px);
        }
        .t2 {
            color: var(--minorColor);
            font-size: rem(24px);
        }
        &.active {
            background: v-bind(bgcolor);
            border: rem(2px) solid var(--primary);
            &::after {
                position: absolute;
                width: rem(30px);
                height: rem(30px);
            }
        }
        .check {
            position: absolute;
            top: -1px;
            right: -1px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: rem(30px);
            height: rem(30px);
            background: var(--primary);
            border-radius: 0 rem(10px) 0 rem(10px);
            &:deep(.van-icon) {
                margin-top: rem(-5px);
            }
        }
    }
}
</style>
