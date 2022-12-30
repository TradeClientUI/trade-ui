<template>
    <van-popup
        v-model:show='popupShow'
        class='custom-dialog'
        :duration='0.2'
        position='bottom'
        round
        :transition-appear='true'
    >
        <div class='header'>
            <div class='header-title'></div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='popup-wrap'>
            <ul class='assets-list'>
                <li
                    v-for='(item, i) in accountList'
                    :key='i'
                    :class='{ active: curCurrency === item.currency }'
                    @click='checkCurrency(item)'
                >
                    <div class='name'>
                        <p class='t1'>
                            {{ item.currency }}
                        </p>
                    </div>
                    <i v-if='curCurrency === item.currency' class='tick'></i>
                </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, watch, toRefs } from 'vue'
export default {
    props: ['show', 'currency', 'tradeType', 'accountList', 'hiddenTitle'],
    setup (props, context) {
        const store = useStore()
        const style = computed(() => store.state.style)
        const state = reactive({
            popupShow: props.show,
            curCurrency: props.currency
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
            context.emit('update:currency', currency)
        }
        const bgColor = style.value.primary + '0D'
        return {
            close,
            bgColor,
            checkCurrency,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog{
    display: flex;
    flex-direction: column;
    height: 92%;
    overflow: hidden;
    background: var(--bgColor);
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title{
            font-size: rem(48px);
            font-weight: bold;
            color: var(--color);
        }
        .icon_guanbi{
            font-size: rem(30px);
            font-weight: bold;
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.popup-wrap{
    overflow-y: scroll;
    padding: 0 rem(30px);
    .assets-list{
        width: 100%;
        li{
            position: relative;
            background: var(--contentColor);
            border-radius: rem(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            height: rem(110px);
            margin-bottom: rem(30px);
            border: rem(2px) solid transparent;
            .name {
                margin-left: rem(20px);
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
}
</style>
