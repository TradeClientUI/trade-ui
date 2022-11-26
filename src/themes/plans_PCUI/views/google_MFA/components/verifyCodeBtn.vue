<template>
    <van-button class='btn' :disabled='disabled || loading' size='small' type='primary' @click='verifyCodeSendHanlder'>
        <van-loading v-if='loading' size='20px' />
        <span v-else>
            {{ text }}
        </span>
    </van-button>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    emits: ['send'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })

        const disabled = ref(false)
        const loading = ref(false)
        let interval
        const text = ref(t('common.sendCode'))
        const verifyCodeSendHanlder = () => {
            disabled.value = true
            loading.value = true
            emit('send', getCodeBtnCountDown)
        }

        // 获取验证码倒计时
        const getCodeBtnCountDown = (flag) => {
            loading.value = false
            if (flag === false) {
                disabled.value = false
                return false
            }
            let len = 60
            interval = setInterval(() => {
                if (len === 0) {
                    clearInterval(interval)
                    text.value = t('register.reGet')
                    disabled.value = false
                    return
                }
                len--
                text.value = `${len}s`
            }, 1000)
        }
        return {
            text,
            disabled,
            loading,
            verifyCodeSendHanlder,
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    width: rem(220px);
    &:disabled {
        background: var(--minorColor);
    }
}
</style>
