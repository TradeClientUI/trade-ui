<template>
    <div class='table-title'>
        <div class='inline' @click.stop='switchSort' @mouseenter='showPopover = true' @mouseleave='showPopover = false'>
            <span class='name'>
                {{ name }}
            </span>
            <van-popover v-if='warnText' v-model:show='showPopover' :offset='bodyWidth > 768 ? [0, 8] : offset' placement='top'>
                <div class='popover-content'>
                    <p>
                        {{ warnText }}
                    </p>
                </div>
                <template #reference>
                    <van-icon class='warn-icon' name='info' />
                </template>
            </van-popover>
            <span v-if='isSort' class='sort'>
                <em :class="[ sortVal === value && sortWay === 'up' ? 'active-up' : 'up' ]"></em>
                <em :class="[ sortVal === value && sortWay === 'down' ? 'active-down' : 'down' ]"></em>
            </span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { isEmpty } from '@/utils/util'
import { useViewport } from '@/utils/hooks/useViewport'

const props = defineProps({
    // 名称
    name: {
        type: String,
        default: ''
    },
    // 提示内容
    warnText: {
        type: String,
        default: ''
    },
    // 悬浮框偏移距离
    offset: {
        type: Array,
        default: () => [0, 8]
    },
    // 是否排序
    isSort: {
        type: Boolean,
        default: false
    },
    // 排序字段
    value: {
        type: String,
        default: ''
    },
    // 当前选择的排序字段
    sortVal: {
        type: String,
        default: ''
    },
    // 当前选择的排序方式
    sortWay: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:sortVal', 'update:sortWay'])

const { bodyWidth } = useViewport()
// 是否显示提示内容
const showPopover = ref(false)
// 切换排序
const switchSort = () => {
    if (props.sortVal !== props.value || isEmpty(props.sortVal)) {
        emit('update:sortVal', props.value)
        emit('update:sortWay', 'up')
    } else {
        if (props.sortWay === 'up') {
            emit('update:sortWay', 'down')
        } else {
            emit('update:sortVal', '')
            emit('update:sortWay', '')
        }
    }
}
</script>

<style lang="scss" scoped>
.popover-content {
    width: 200px;
    padding: 10px 12px;
    line-height: 1.2;
    font-size: 12px;
}
.table-title {
    .inline {
        display: inline-flex;
        align-items: center;
        height: 24px;
        cursor: pointer;
    }
    .name {
        line-height: 1;
        font-size: 12px;
        color: var(--normalColor);
    }
    .warn-icon {
        margin-top: -3px;
        margin-left: 2px;
        font-size: 14px;
        color: var(--normalColor);
    }
    .sort {
        display: inline-flex;
        flex-direction: column;
        margin-top: 2px;
        margin-left: 4px;
        em {
            width: 0;
            height: 0;
            margin-bottom: 2px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            &.up {
                border-bottom: 5px solid #c0c4cc;
            }
            &.down {
                border-top: 5px solid #c0c4cc;
            }
            &.active-up {
                border-bottom: 5px solid var(--primary);
            }
            &.active-down {
                border-top: 5px solid var(--primary);
            }
        }
    }
}
</style>
