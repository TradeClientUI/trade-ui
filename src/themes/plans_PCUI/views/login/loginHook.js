import { ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { getDevice } from '@/utils/util'
import { MsgSocket, setQuoteService } from '@/plugins/socket/socket'
import RuleFn from './rule'
import { checkUserStatus } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { Toast } from 'vant'
export default function () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    // 登录成功跳转
    const loginToPath = () => {
        const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
        router.replace(toURL)
    }

    // 点击登录
    const loginSubmit = (state) => {
        const loginParams = {
            type: state.type,
            loginName: state.loginName,
            googleCode: state.googleCode,
            device: getDevice(),
            verifyCode: state.loginType === 'checkCode' ? state.checkCode : undefined,
            loginPwd: state.loginType === 'password' ? state.pwd : undefined,
            sendToken: state.loginType === 'checkCode' ? state.token : undefined,
        }
        if (state.type === 2) loginParams.phoneArea = state.phoneArea

        const validator = new Schema(RuleFn(t))

        return new Promise((resolve, reject) => {
            validator.validate(
                loginParams,
                {
                    ...loginParams,
                    loginType: state.loginType,
                    first: true,
                },
                (errors, fields) => {
                    // console.log(errors, fields)
                    if (errors) {
                        state.loading = false
                        Toast(errors[0].message)
                        reject()
                        return
                    }
                    return store.dispatch('_user/login', {
                        ...loginParams,
                        loginPwd: md5(state.pwd)
                    }).then(res => {
                        if (res.check()) {
                            MsgSocket.login()

                            // 切换登录后的行情websocket
                            setQuoteService()
                        }
                        resolve(res)
                        return res
                    })
                })
        })
    }

    // 发送验证码
    const verifyCodeBtnText = ref(t('signIn.getVerifyCode'))
    const sendVerifyCode = (params) => {
        const verifyParams = {
            ...params
        }

        const validator = new Schema(RuleFn(t))
        return validator.validate({
            ...verifyParams
        }).then(res => {
            // 检测客户是否存在,同时获取区号
            return checkUserStatus(verifyParams).then(res => {
                if (res.check()) {
                    if (Number(res.data.status) === 2) {
                        const msg = verifyParams.type === 1 ? t('common.noEmail') : t('common.noPhone')
                        return Toast(msg)
                    } else if (Number(res.data.status === -1)) {
                        return Toast(t('c.userDisable'))
                    } else {
                        // const zone = res.data.phoneArea
                        const sendParams = {
                            bizType: params.type === 1 ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
                            toUser: params.type === 1 ? params.loginName : params.phoneArea + ' ' + params.loginName,
                        }
                        return verifyCodeSend(sendParams).then((res) => {
                            verifyCountDown() // 倒计时
                            return res
                        })
                    }
                }
            })
        }).catch(({
            errors,
            fields
        }) => {
            if (errors) {
                Toast(errors[0].message)
            }
        })
    }

    // 验证码倒计时
    let verifyCountDownTimer = null
    const verifyCountDown = () => {
        verifyCodeBtnText.value = 60
        verifyCountDownTimer = setInterval(() => {
            verifyCodeBtnText.value--
            if (verifyCodeBtnText.value === 0) {
                verifyCodeBtnText.value = t('signIn.getVerifyCode')
                clearInterval(verifyCountDownTimer)
            }
        }, 1000)
    }

    // 离开时清除定时器
    onUnmounted(() => {
        verifyCountDownTimer && clearInterval(verifyCountDownTimer)
    })

    return {
        loginToPath,
        loginSubmit,
        verifyCodeBtnText,
        sendVerifyCode,
    }
}
