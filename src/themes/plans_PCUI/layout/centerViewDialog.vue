<template>
    <el-dialog v-model='dialogVisible' :before-close='beforeClose' :close-on-click-modal='false' :custom-class='customClass' width='520px'>
        <slot></slot>
    </el-dialog>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit, attrs }) {
        const store = useStore()
        const router = useRouter()
        const customClass = 'centerViewDialog ' + attrs.class
        const dialogVisible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 关闭弹窗
        const beforeClose = (done) => {
            console.log('beforeClose')
            router.back()
        }
        return {
            customClass,
            dialogVisible,
            beforeClose,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.el-overlay{
    z-index: 999 !important;
}
.el-overlay-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
}
.centerViewDialog {
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        display: flex;
        flex-flow: column;
        padding: 0;
        height: 600px;
        max-height: 80%;
        background: var(--bgColor);
    }
    .pageWrap {
        @include scroll-pc();
        flex: 1;
        padding-bottom: 1rem;
        overflow-y: auto;
    }
    .topNav {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 100%;
        height: 42px;
        color: var(--color);
        font-size: 14px;
        background: var(--contentColor);
    }
    &.withdraw-coin-wrap {
        background: #3894FF;
        .el-dialog__body{
            height: 637px;
        }

    }
}
</style>
