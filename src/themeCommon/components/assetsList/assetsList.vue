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
            <div class='header-title'>
                <span v-if='!hiddenTitle'>
                    {{ title || $t('assets.assets') }}
                </span>
            </div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='popup-wrap'>
            <ul class='assets-list'>
                <li
                    v-for='(item, i) in accountList'
                    :key='i'
                    :class="[flex === 1 ? 'item-flex-1' : 'item-flex-2', { active: curCurrency === item.currency }]"
                    @click='checkCurrency(item)'
                >
                    <CurrencyIcon v-if='flex === 2' :currency='item.currency' :size='24' />
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
        </div>
    </van-popup>
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
    props: {
        // 是否显示弹窗
        show: {
            type: Boolean,
            default: false
        },
        // 当前标题
        title: {
            type: String,
            default: ''
        },
        // 当前选择资产
        currency: {
            type: String,
            default: ''
        },
        // 玩法类型
        tradeType: {
            type: [Number, String],
            default: ''
        },
        // 资产列表
        accountList: {
            type: Array,
            default: () => []
        },
        // 是否隐藏标题
        hiddenTitle: {
            type: Boolean,
            default: false
        },
        // 排列方式 1.一行一个 2.一行两个
        flex: {
            type: Number,
            default: 2
        }
    },
    setup (props, context) {
        const store = useStore()
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

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
    display: flex;
    flex-direction: column;
    height: 92%;
    overflow: hidden;
    background: var(--assistColor) !important;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title {
            font-size: rem(42px) !important;
            font-weight: bold;
            color: var(--color);
        }
        .icon_guanbi {
            font-size: rem(30px);
            font-weight: bold;
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.popup-wrap {
    overflow-y: scroll;
    padding: 0 rem(30px);
    .assets-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        /* padding-bottom: rem(220px); */
        li {
            position: relative;
            background: var(--contentColor);
            border-radius: rem(10px);
            display: flex;
            align-items: center;
            height: rem(110px);
            margin-bottom: rem(30px);
            border: rem(2px) solid transparent;
            .name {
                margin-left: rem(20px);
            }
            .t1 {
                font-size: rem(32px);
            }
            .t2 {
                color: var(--minorColor);
                font-size: rem(24px);
            }
            &.active {
                border: rem(2px) solid var(--primary);
                &::after {
                    position: absolute;
                    content: '\e728';
                    width: rem(30px);
                    height: rem(30px);
                    background: var(--primary);
                    border-radius: 0 rem(10px) 0 rem(10px);
                    right: 0;
                    top: rem(-2px);
                    font-family: 'iconfont';
                }
            }
            .tick {
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
        .item-flex-1 {
            flex: 0 0 100%;
            justify-content: center;
            text-align: center;
        }
        .item-flex-2 {
            flex: 0 0 48%;
            padding-left: rem(20px);
        }
    }
}
</style>
