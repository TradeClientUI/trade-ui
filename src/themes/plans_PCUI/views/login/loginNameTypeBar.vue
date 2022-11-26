<template>
    <div class='loginNameTypeBar'>
        <van-tabs v-model:active='type' @change='$emit("change", $event)'>
            <van-tab name='email' :title='$t("register.email")' />
            <van-tab name='mobile' :title='$t("register.phoneNo")' />
        </van-tabs>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const type = computed({
            get: () => {
                return props.modelValue
            },
            set: (val) => {
                emit('update:modelValue', val)
            }
        })

        return {
            type,
        }
    }
}
</script>

<style lang="scss" scoped>
.loginNameTypeBar{
    :deep(.van-tabs__nav){
        .van-tab {
            flex: none;
            margin: 0 10px;
            font-size: 16px;
        }
        .van-tabs__line{
            background: var(--primary);
        }
    }
}
</style>
