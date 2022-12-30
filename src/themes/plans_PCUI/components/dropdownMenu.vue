<template>
    <div :class="['dropdown-menu', show ? 'show' : 'hide']" :style="{ 'top': top + 'px' }" @click.stop>
        <div v-if='showSearch' class='currency-search'>
            <div class='search-box'>
                <input v-model='inputVal' placeholder='Search' type='text' />
                <van-icon v-if='inputVal' class='clear' name='clear' @click.stop="inputVal = ''" />
            </div>
        </div>
        <div class='currency-list'>
            <ul>
                <li v-for='item in resultList' :key='item.currency' @click='selectCurrency(item)'>
                    <currency-icon v-if='showIcon && item.currency' :currency='item.currency' :size='24' />
                    <span class='currency'>
                        {{ item.currency }}
                    </span>
                    <span v-if='showLabel' class='label'>
                        {{ item.singleLowAmount }} ~ {{ item.singleHighAmount }}
                    </span>
                    <!-- 自定义右侧内容 -->
                    <slot v-bind='item' name='item'></slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import currencyIcon from '@/components/currencyIcon'
import { onMounted, onUnmounted, reactive, toRefs, watch, watchEffect } from 'vue'
import { isEmpty } from '@/utils/util'

export default {
    components: {
        currencyIcon
    },
    props: {
        // 是否显示弹窗
        show: {
            type: Boolean,
            default: false
        },
        // 离顶部的距离
        top: {
            type: Number,
            default: 0
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // 选择的货币
        currency: {
            type: String,
            default: ''
        },
        // 是否显示label
        showLabel: {
            type: Boolean,
            default: false
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: true
        },
        showSearch: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:show', 'update:currency', 'onchange'],
    setup (props, { emit }) {
        const state = reactive({
            // 输入框的值
            inputVal: '',
            // 过滤后的列表数据
            resultList: []
        })

        watch(() => props.show, () => {
            if (props.show) reset()
        })

        watchEffect(() => {
            let arr = []
            if (isEmpty(state.inputVal)) {
                arr = props.list
            } else {
                const newInputVal = state.inputVal.toUpperCase()
                arr = props.list.filter(el => el.currency.toUpperCase().indexOf(newInputVal) !== -1)
            }
            state.resultList = arr
        })

        // 重置数据
        const reset = () => {
            state.inputVal = ''
        }

        // 点击选择货币
        const selectCurrency = item => {
            emit('update:currency', item.currency, item)
            emit('onchange', item)
            close()
        }

        // 关闭弹窗
        const close = () => {
            emit('update:show', false)
        }

        onMounted(() => {
            document.addEventListener('click', close)
        })

        onUnmounted(() => {
            document.removeEventListener('click', close)
        })

        return {
            ...toRefs(state),
            selectCurrency
        }
    }
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
    width: 100%;
    padding: 10px 0;
    position: absolute;
    left: 0;
    z-index: 99;
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-top: none;
    transition: ease-in-out 0.15s;
    transform-origin: top;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    &.show {
        transform: scaleY(1);
        opacity: 1;
        visibility: visible;
    }
    &.hide {
        transform: scaleY(0);
        opacity: 0;
        visibility: hidden;
    }
}
.currency-search {
    padding: 0 15px;
    font-size: 14px;
    .search-box {
        display: flex;
        align-items: center;
        height: 36px;
        background: var(--bgColor);
        border-radius: 5px;
        input {
            flex: 1;
            height: 100%;
            padding: 0 15px;
        }
        .clear {
            margin-top: -3px;
            margin-right: 10px;
            color: var(--minorColor);
            font-size: 20px;
            cursor: pointer;
        }
    }
}
.currency-list {
    max-height: 300px;
    padding: 0 12px;
    overflow-y: auto;
    li {
        display: flex;
        align-items: center;
        height: 42px;
        margin-top: 6px;
        padding: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        .currency {
            flex: 1;
            margin-top: 2px;
            margin-left: 8px;
            font-size: 15px;
        }
        .label {
            font-size: 14px;
            color: var(--minorColor);
        }
        &:hover {
            background-color: var(--bgColor);
        }
    }
}
</style>
