<template>
    <div class='select-market'>
        <div :class="['select-box', { 'select-box-active': show }]" @click.stop='show = !show'>
            <div v-if="modelValue === 'all'" class='all'>
                <van-icon class='apps-o' name='apps-o' />
            </div>
            <img v-else class='icon' :src='"/images/markets/"+ modelValue.toLowerCase() +".svg"' />
            <span class='name'>
                {{ modelValue === 'all' ? 'All Markets' : modelValue }}
            </span>
            <van-icon class='arrow' name='arrow-down' />
        </div>
        <div :class="['select-list', show ? 'show' : 'hide']">
            <ul>
                <li v-if='showAll' :class="{ 'active': 'all' === modelValue }" @click.stop="selectMarket('all')">
                    <div class='all'>
                        <van-icon class='apps-o' name='apps-o' />
                    </div>
                    <span class='name'>
                        All Markets
                    </span>
                </li>
                <li v-for='(item, index) in list' :key='index' :class="{ 'active': item === modelValue }" @click.stop='selectMarket(item)'>
                    <img class='icon' :src='"/images/markets/"+ item.toLowerCase() +".svg"' />
                    <span class='name'>
                        {{ item }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div v-if='show' class='mask-layer' @click='show = false'></div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
    // 当前市场
    modelValue: {
        type: String,
        default: ''
    },
    // 下拉列表数据
    list: {
        type: Array,
        default: () => []
    },
    // 是否显示全部选项
    showAll: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])
// 是否显示下拉框
const show = ref(false)

// 选择市场
const selectMarket = (value) => {
    emit('update:modelValue', value)
    show.value = false
}
</script>

<style lang="scss" scoped>
.select-market {
    position: relative;
    z-index: 99;
}
.select-box {
    display: flex;
    align-items: center;
    width: 180px;
    height: 42px;
    padding: 0 12px;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    &:hover {
        border: 1px solid var(--primary);
    }
    .all {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        background: var(--primary);
        border-radius: 50%;
        .apps-o {
            margin-top: -4px;
            font-size: 18px;
            color: #fff;
        }
    }
    .icon {
        width: 28px;
        height: 28px;
    }
    .name {
        @include ellipsis;
        flex: 1;
        margin-left: 6px;
        font-weight: bold;
    }
    .arrow {
        margin-top: -2px;
        margin-left: 2px;
        color: var(--minorColor);
        transition: .2s;
    }
    @media (max-width: 768px) {
        width: 130px;
        height: 34px;
        padding: 0 5px;
        .all {
            width: 24px;
            height: 24px;
            .apps-o {
                font-size: 16px;
            }
        }
        .icon {
            width: 24px;
            height: 24px;
        }
    }
}
.select-box-active {
    .arrow {
        margin-top: 3px;
        transform: rotate(180deg);
    }
}
.select-list {
    position: absolute;
    top: 48px;
    right: 0;
    width: 180px;
    background: var(--contentColor);
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: rgb(0 0 0 / 20%) 0 0 2px, rgb(0 0 0 / 10%) 0 2px 10px;
    transform-origin: 32px 0;
    transition: all ease-in-out .2s;
    &.show {
        transform: scale(1, 1);
        visibility: visible;
        opacity: 1;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    &.hide {
        transform: scale(0.75, 0.5625);
        visibility: hidden;
        opacity: 0;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 103ms;
    }
    ul {
        padding: 5px 0;
    }
    li {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border-bottom: 1px solid var(--lineColor);
        cursor: pointer;
        &:last-of-type {
            border-bottom: none;
        }
        &:hover {
            background: var(--bgColor);
        }
        .all {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 28px;
            background: var(--primary);
            border-radius: 50%;
            .apps-o {
                margin-top: -4px;
                font-size: 18px;
                color: #fff;
            }
        }
        .icon {
            width: 28px;
            height: 28px;
        }
        .name {
            @include ellipsis;
            margin-left: 6px;
            font-weight: bold;
        }
    }
    .active {
        color: var(--primary);
    }
    @media (max-width: 768px) {
        width: 130px;
        top: 40px;
        li {
            padding: 5px;
            .all {
                width: 24px;
                height: 24px;
                .apps-o {
                    font-size: 16px;
                }
            }
            .icon {
                width: 24px;
                height: 24px;
            }
        }
    }
}
.mask-layer {
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;
}
</style>
