<template>
    <div class='page-wrap'>
        <Top
            absolute
            back
            left-icon='arrow-left'
            :right-action='false'
            show-center
            :title="customerInfo.googleId>0 ? $t('cRoute.MFA_close'):$t('cRoute.MFA_bind')"
        />
        <div class='formBox'>
            <div v-if='customerInfo.phone' class='cell'>
                <p class='label'>
                    {{ $t('common.sendToYou') }}{{ customerInfo.phone }}
                </p>
                <van-field
                    v-model='verifyCodeSMS'
                    center
                    clearable
                >
                    <template #button>
                        <VerifyCodeBtn @send='smsCodeSendHanlder' />
                    </template>
                </van-field>
            </div>

            <div v-if='customerInfo.email' class='cell'>
                <p class='label'>
                    {{ $t('common.sendToYou') }}{{ customerInfo.email }}
                </p>
                <van-field
                    v-model='verifyCodeEmail'
                    center
                    clearable
                >
                    <template #button>
                        <VerifyCodeBtn @send='emailCodeSendHanlder' />
                    </template>
                </van-field>
            </div>

            <div class='cell'>
                <p class='label'>
                    {{ $t('common.inputGoogleCode') }}
                </p>
                <van-field
                    ref='googleVerifyCodeRef'
                    v-model='googleCode'
                    center
                    class='inputHeight'
                    clearable
                    :formatter='formatter'
                    maxlength='6'
                >
                    <!-- <template #button>
                        <a class='copyBtn' href='javascript:;' @click='pasteHanlder'>
                            {{ $t('common.paste') }}
                        </a>
                    </template> -->
                </van-field>
            </div>
        </div>

        <div class='footerBox'>
            <van-button block :disabled='loading' :loading='loading' type='primary' @click='bindHanlder'>
                {{ customerInfo.googleId>0 ? $t('cRoute.MFA_close'):$t('cRoute.MFA_bind') }}
            </van-button>
        </div>
    </div>
</template>

<script >
import Top from '@/components/top'
import { computed, reactive, ref, toRefs } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import BindDataRules from './bindDataRules'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { enableOrForbidMFA } from '@/api/user'
import VerifyCodeBtn from './verifyCodeBtn.vue'

export default {
    components: {
        Top,
        VerifyCodeBtn,
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query
        const state = reactive({
            loading: false,
            googleCode: '', // 谷歌验证码
            verifyCodeSMS: '', // 手机验证码
            sendTokenSMS: '', // 手机验证码发送票据
            verifyCodeEmail: '', // 邮箱验证码
            sendTokenEmail: '', // 邮箱验证码发送票据
        })

        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const descriptorRules = BindDataRules(t, customerInfo.value)
        const validator = new Schema(descriptorRules)
        console.log(customerInfo.value)

        const formatter = (value) => {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        // 发送短信验证码
        const smsCodeSendHanlder = fn => {
            const pramas = {
                bizType: 'SMS_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(pramas).then(res => {
                if (res.check()) {
                    fn && fn(true)
                    state.sendTokenSMS = res.data.token
                } else {
                    fn && fn(false)
                }
            })
        }
        // 发送邮箱验证码
        const emailCodeSendHanlder = fn => {
            const pramas = {
                bizType: 'EMAIL_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(pramas).then(res => {
                if (res.check()) {
                    fn && fn(true)
                    state.sendTokenEmail = res.data.token
                } else {
                    fn && fn(false)
                }
            })
        }

        // 效验绑定参数
        const validatPramas = (pramas) => {
            return new Promise((resolve, reject) => {
                validator.validate(pramas, (errors, fields) => {
                    if (errors) {
                        console.log(errors, fields)
                        Toast(errors[0].message)
                        return resolve(false)
                    }
                    resolve(true)
                })
            })
        }

        // 绑定谷歌验证码
        const bindHanlder = () => {
            const googleId = customerInfo.value.googleId > 0 ? customerInfo.value.googleId : parseInt(id)
            const pramas = {
                type: customerInfo.value.googleId > 0 ? 2 : 1, // 1开启，2关闭
                googleCode: state.googleCode, // String 必填 谷歌验证码
                googleId: googleId, // Long 必填 谷歌Id
                verifyCodeSMS: state.verifyCodeSMS, // String 非必填 手机验证码
                sendTokenSMS: state.sendTokenSMS, // String 非必填 手机验证码发送票据
                verifyCodeEmail: state.verifyCodeEmail, // String 非必填 邮箱验证码
                sendTokenEmail: state.sendTokenEmail, // String 非必填 邮箱验证码发送票据
            }
            validatPramas(pramas).then(res => {
                if (!res) return false
                state.loading = true
                enableOrForbidMFA(pramas).then(res => {
                    console.log(res)
                    state.loading = false
                    if (res.check()) {
                        Dialog.alert({
                            message: customerInfo.value.googleId > 0 ? t('mfa.closeSuccess') : t('mfa.bindSuccess'),
                        }).then(() => {
                            router.go(customerInfo.value.googleId > 0 ? -2 : -4)
                            store.dispatch('_user/findCustomerInfo', false)
                        })
                        state.googleCode = ''
                        state.verifyCodeSMS = ''
                        state.sendTokenSMS = ''
                        state.verifyCodeEmail = ''
                        state.sendTokenEmail = ''
                    }
                }).catch(err => {
                    state.loading = false
                })
            })
            console.log('bindHanlder')
        }

        // 自动粘贴谷歌验证码
        const pasteHanlder = async () => {
            if (!navigator.clipboard) Toast(t('common.unSupported'))
            googleVerifyCodeRef.value.focus()
            const text = await navigator.clipboard.readText()
            console.log(text)
            state.googleCode = text
        }

        return {
            ...toRefs(state),
            formatter,
            smsCodeSendHanlder,
            emailCodeSendHanlder,
            customerInfo,
            googleVerifyCodeRef,
            pasteHanlder,
            bindHanlder,
        }
    }
}

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .formBox {
        margin: rem(30px);
        .cell {
            margin-bottom: rem(30px);
        }
        .van-cell {
            padding: 0 0 0 rem(20px);
        }
        .label {
            padding-bottom: rem(20px);
            line-height: 28px;
        }
        .copyBtn {
            display: block;
            width: rem(150px);
            height: rem(66px);
            color: var(--primary);
            line-height: rem(66px);
            text-align: center;
        }
        .inputHeight {
            padding: 4px 0 5px rem(20px);
        }
    }
    .footerBox {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>
