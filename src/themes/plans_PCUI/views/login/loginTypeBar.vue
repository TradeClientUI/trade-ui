<template>
    <div class='loginTypeBar'>
        <van-tabs v-model:active='type'>
            <van-tab name='password' :title='$t("signIn.pwd")' />
            <van-tab name='checkCode' :title='$t("signIn.verifyCode")' />
        </van-tabs>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
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
.loginTypeBar{
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
