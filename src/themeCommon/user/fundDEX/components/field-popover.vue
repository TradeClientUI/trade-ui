<template>
    <div class='field-popover'>
        <van-popover v-model:show='showPopover' :offset='bodyWidth > 768 ? [0, 8] : offset' placement='top'>
            <div class='popover-content'>
                <p>
                    {{ content }}
                </p>
            </div>
            <template #reference>
                <span class='popover-title' @mouseenter='open' @mouseleave='close'>
                    {{ title }}<van-icon name='info-o' />
                </span>
            </template>
        </van-popover>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useViewport } from '@/utils/hooks/useViewport'

defineProps({
    // 标题
    title: {
        type: String,
        default: ''
    },
    // 提示内容
    content: {
        type: String,
        default: ''
    },
    // 偏移距离
    offset: {
        type: Array,
        default: () => [0, 8]
    }
})

const { bodyWidth } = useViewport()
// 是否显示悬浮框
const showPopover = ref(false)

// 显示悬浮框
const open = () => {
    if (bodyWidth.value > 768) {
        showPopover.value = true
    }
}

// 关闭悬浮框
const close = () => {
    if (bodyWidth.value > 768) {
        showPopover.value = false
    }
}
</script>

<style lang="scss" scoped>
.popover-content {
    width: 280px;
    padding: 10px 12px;
    line-height: 1.2;
    font-size: 12px;
    @media (max-width: 768px) {
        width: 200px;
    }
}
.popover-title {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    :deep(.van-icon) {
        margin-top: -4px;
        margin-left: 2px;
    }
    @media (max-width: 768px) {
        :deep(.van-icon) {
            margin-top: -2px;
        }
    }
}
</style>
