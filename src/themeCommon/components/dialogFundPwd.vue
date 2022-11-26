<template>
    <van-popup
        v-model:show='showFundPwd'
        class='custom-popup'
        :duration='0.2'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.fundPwd') }}
            </div>
            <i class='icon_guanbi' @click='$emit("update:show",false)'></i>
        </div>
        <div class='dialog-body'>
            <div class='pwd-oper'>
                <InputComp v-model='pwd' clear :label="$t('common.inputFundPwd')" :max-length='6' pwd />
            </div>

            <div class='oper'>
                <router-link v-if='Number(customInfo.assertPassStatus) === 1' class='href' to='/setFundPwd'>
                    {{ $t('login.goSet') }}
                </router-link>
                <router-link v-else class='href' :to="{ name: 'Forgot', query: { type: 'fund' } }">
                    {{ $t('login.forgotFundPwd') }}
                </router-link>
            </div>
            <div class='pwd-oper'>
                <googleVerifyCode
                    v-if='googleCodeVis'
                    ref='googleVerifyCodeComp'
                    @clear='clear'
                    @getGooleVerifyCode='getGooleVerifyCode'
                />
            </div>
        </div>
        <div class='dialog-footer'>
            <van-button
                block
                class='pcHandler'
                :loading='loading'
                @click='submit'
            >
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
    <!-- <Loading :show='loading' /> -->
</template>

<script>
import { reactive, toRefs, computed, watchEffect, onMounted, ref } from 'vue'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import InputComp from '@/components/form/input'
export default {
    components: {
        InputComp,
        googleVerifyCode
    },
    props: ['show'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const googleVerifyCodeComp = ref(null)

        const customInfo = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)

        const state = reactive({
            showFundPwd: false,
            loading: false,
            pwd: '',
            googleCode: ''
        })

        const closed = () => { // 关闭弹出层且动画结束后触发
            state.pwd = ''
            context.emit('update:show', false)
            googleVerifyCodeComp.value.clear()
        }
        const formatter = value => {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        const submit = () => {
            if (!state.pwd) {
                return Toast(t('common.inputFundPwd'))
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            context.emit('confirmWithdraw', [state.pwd, state.googleCode])
        }

        watchEffect(() => {
            state.showFundPwd = props.show
        })

        return {
            closed,
            submit,
            customInfo,
            formatter,
            googleCodeVis,
            getGooleVerifyCode,
            googleVerifyCodeComp,
            ...toRefs(state)

        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.dialog-header {

}
.dialog-body {
    .pwd-oper {
        //padding: rem(30px) 0 0 0;
        text-align: right;
        background-color: var(--contentColor);
        .href {
            width: 100%;
            color: var(--primary);
            font-size: rem(24px);
        }
        :deep(.inputWrapper) {
            input {
                padding-left: rem(20px);
            }
        }
        .form-item {
            :deep(.van-cell) {
                //background-color: var(--bgColor);
                input {
                    padding-left: rem(20px);
                }
            }
        }
    }
    .oper {
        padding: rem(20px) 0;
        text-align: right;
    }
}
.dialog-footer {
    width: 100%;
    padding: rem(30px) 0;
    .pcHandler {
        color: #FFF;
        background: var(--primary);
        border: none;
        border-radius: 0;
        border-radius: rem(6px);
    }
}

</style>
