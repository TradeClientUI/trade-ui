// 谷歌安全验证 弹出框 组件
<template>
    <div class='formBox'>
        <div v-if='customerInfo.phone' class='cell'>
            <p class='label'>
                {{ $t('common.sendToYou') }}{{ customerInfo.phone }}
            </p>
            <van-field
                v-model='query.phoneCode'
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
                v-model='query.emailCode'
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
                v-model='query.googleCode'
                center
                class='inputHeight'
                clearable
                :formatter='formatter'
                maxlength='6'
            />
        </div>
    </div>

    <div class='footerBox'>
        <van-button block :disabled='loading' :loading='loading' type='primary' @click='bindHanlderFn'>
            {{ $t('compLang.confirm') }}
        </van-button>
    </div>
</template>

<script>

import { onBeforeMount, computed, reactive, watch, toRefs, ref, onUnmounted } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import googleSecurityCheckRules from './googleSecurityCheckRules'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
// import { enableOrForbidMFA } from '@/api/user'
import VerifyCodeBtn from '@/themes/plans_PCUI/views/google_MFA/components/verifyCodeBtn.vue'

export default {
    components: {
        VerifyCodeBtn
    },
    props: ['popShow', 'loading', 'googleSafetyData'],
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            ggSafetyPopupShow: props.popShow,
            curCurrency: props.currency,
            loading: props.loading,
            googleSafetyData: {},
            query: {
                googleCode: '', // 谷歌验证码
                phoneCode: '', // 手机验证码
                phoneSendToken: '', // 手机验证码发送票据
                emailCode: '', // 邮箱验证码
                emailSendToken: '', // 邮箱验证码发送票据
            },

        })

        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query

        watch(
            () => state.ggSafetyPopupShow, val => {
                context.emit('update:ggSafetyPopupShow', val)
            },

            () => state.loading, val => {
                context.emit('update:loading', val)
            }
        )
        const checkCurrency = (currency) => {
            state.curCurrency = currency.currency
            context.emit('update:currency', currency)
        }
        const bgColor = style.value.primary + '0D'
        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const descriptorRules = googleSecurityCheckRules(t, customerInfo.value)
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
                    state.query.phoneSendToken = res.data.token
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
                    state.query.emailSendToken = res.data.token
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
        const bindHanlderFn = () => {
            // const googleId = customerInfo.value.googleId > 0 ? customerInfo.value.googleId : parseInt(id)
            // const pramas = {}
            const pramas = {
                googleCode: state.query.googleCode, // String 必填 谷歌验证码
                phoneCode: state.query.phoneCode, // String 非必填 手机验证码
                emailCode: state.query.emailCode, // String 非必填 邮箱验证码
                phoneSendToken: state.query.phoneSendToken, // 手机验证码发送票据
                emailSendToken: state.query.emailSendToken, // 邮箱验证码发送票据
            }
            validatPramas(state.query).then(res => {
                if (!res) return false
                // state.loading = true
                if (pramas.phoneCode === '') {
                    delete pramas.phoneCode
                    delete pramas.phoneSendToken
                } else {
                    if (pramas.phoneSendToken === '') {
                        Toast(t('api.phoneSmsTips'))
                        return false
                    }
                }
                if (pramas.emailCode === '') {
                    delete pramas.emailCode
                    delete pramas.emailSendToken
                } else {
                    if (pramas.emailSendToken === '') {
                        Toast(t('api.emailSmsTips'))
                        return false
                    }
                }
                context.emit('update:googleSafetyData', pramas)
            })
        }

        // 自动粘贴谷歌验证码
        const pasteHanlder = async () => {
            if (!navigator.clipboard) Toast(t('common.unSupported'))
            googleVerifyCodeRef.value.focus()
            const text = await navigator.clipboard.readText()
            // console.log(text)
            state.googleCode = text
        }

        const getQuery = () => {
            state.params = route.query
            console.log(state.params)
            state.query.tag = route.query.tag
        }

        return {
            ...toRefs(state),
            bgColor,
            getQuery,
            checkCurrency,
            smsCodeSendHanlder,
            emailCodeSendHanlder,
            formatter,
            customerInfo,
            googleVerifyCodeRef,
            pasteHanlder,
            bindHanlderFn,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
    display: flex;
    flex-direction: column;
    height: 92%;
    overflow: hidden;
    background: var(--bgColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title {
            color: var(--color);
            font-weight: bold;
            font-size: rem(48px);
        }
        .icon_guanbi {
            font-weight: bold;
            font-size: rem(30px);
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(20px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .formBox {
        margin: 50px 15px 20px;
        .cell {
            margin-bottom: rem(30px);
        }
        .van-cell {
            padding: 0 0 0 rem(20px);
        }
        .label {
            padding-bottom: rem(20px);
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
