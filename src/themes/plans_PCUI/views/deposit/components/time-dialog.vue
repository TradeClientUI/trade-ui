<template>
    <van-dialog v-model:show='show' confirm-button-text='Got it' :title="$t('withdraw.hint')" @close='close'>
        <div class='dialog-wrap'>
            <p v-if='(timeList.length > 0)'>
                {{ $t('deposit.timeTip1') }}
                <span v-for='(item, index) in timeList' :key='index'>
                    {{ item }}
                    <span v-if='timeList.length - 1 !== index'>
                        ,
                    </span>
                </span>
            </p>
            <p v-else>
                {{ $t('deposit.timeTip2') }}
            </p>
        </div>
    </van-dialog>
</template>

<script>
import { ref, watch } from 'vue'
export default {
    props: {
        // 是否显示弹窗
        modelValue: {
            type: Boolean,
            default: false
        },
        // 时间列表数据
        timeList: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        // 是否显示弹窗
        const show = ref(false)
        // 关闭弹窗
        const close = () => {
            emit('update:modelValue', false)
        }

        // 监听modelValue
        watch(() => props.modelValue, () => {
            show.value = props.modelValue
        }, { immediate: true })

        return {
            show,
            close
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-wrap {
    line-height: 1.2;
    padding: rem(20px) rem(30px) rem(50px);
    font-size: rem(28px);
    p {
        margin-bottom: rem(10px);
    }
}
</style>
