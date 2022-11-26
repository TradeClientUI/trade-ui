<template>
    <div style='display: inline-block;'>
        <van-popover v-model:show='showPopover' :offset='offset' placement='top' trigger='manual'>
            <div class='popover-content'>
                <p>{{ defauleNum }}</p>
            </div>
            <template #reference>
                <span @click='onToggle' @mouseenter='open' @mouseleave='close'>
                    {{ formatNum }}
                </span>
            </template>
        </van-popover>
    </div>
</template>

<script setup>
import { defineProps, watch, ref } from 'vue'
import { formatAmount } from '@/utils/calculation'

const props = defineProps({
    // 初始值
    value: {
        type: [String, Number],
        default: ''
    },
    // 偏侈的距离
    offset: {
        type: Array,
        default: () => [0, 8]
    }
})

// 是否显示悬浮弹窗
const showPopover = ref(false)
// 默认数字
const defauleNum = ref('')
// 格式化后的数字
const formatNum = ref('')

watch(() => props.value, () => {
    const num = formatAmount(props.value)
    if (num.length > 10) {
        formatNum.value = num.substr(0, 8) + '...' + num.substr(num.length - 1)
        defauleNum.value = num
    } else {
        formatNum.value = num
        defauleNum.value = ''
    }
}, { immediate: true })

// 点击显示或关闭悬浮弹窗
const onToggle = () => {
    if (defauleNum.value) {
        showPopover.value = !showPopover.value
    }
}

// 打开悬浮弹窗
const open = () => {
    if (defauleNum.value) {
        showPopover.value = true
    }
}

// 关闭悬浮弹窗
const close = () => {
    if (defauleNum.value) {
        showPopover.value = false
    }
}
</script>

<style lang="scss" scoped>
.popover-content {
    max-width: 200px;
    padding: 10px 12px;
    line-height: 1.2;
    font-size: 12px;
    word-break: break-all;
}
</style>
