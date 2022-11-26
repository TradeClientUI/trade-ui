<template>
    <div class='popup-dialog'>
        <van-popup v-model:show='show' @close='close'>
            <div class='popup-model'>
                <div class='model-header'>
                    <strong class='title'>
                        Approval
                    </strong>
                    <van-icon class='close' name='cross' @click='close' />
                </div>
                <div class='model-content'>
                    <p class='text'>
                        {{ text }}
                    </p>
                    <button class='btn' @click='close'>
                        Ok, I got it
                    </button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
    show: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:show'])

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.popup-dialog {
    :deep(.van-overlay) {
        z-index: 4000 !important;
    }
    :deep(.van-popup) {
        background: transparent;
        z-index: 4001 !important;
        @media (max-width: 768px) {
            width: 100%;
        }
    }
}
.popup-model {
    width: 420px;
    max-height: calc(100vh - 20px);
    background-color: var(--contentColor);
    color: var(--normalColor);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0px 2px 1px, rgb(0 0 0 / 25%) 0px 0px 1px;
    overflow-y: auto;
    padding: 24px;
    position: relative;
    @media (max-width: 768px) {
        width: calc(100% - 30px);
        margin: 0 auto;
        padding: 24px 16px;
    }
}
.model-header {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color);
    margin-bottom: 24px;
    position: relative;
    .title {
        font-size: 20px;
    }
    .close {
        font-size: 24px;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
    }
}
.model-content {
    padding: 0 10px;
    .text {
        text-align: center;
        font-size: 14px;
        color: var(--color);
    }
    .btn {
        @include hover();
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 64px;
        margin: 20px auto 0;
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        color: #fff;
        background: var(--primary);
        cursor: pointer;
    }
}
</style>
