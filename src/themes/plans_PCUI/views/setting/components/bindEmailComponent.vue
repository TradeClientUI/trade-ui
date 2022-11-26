<template>
    <div class='pageWrap'>
        <Top back left-icon='arrow-left' :right-action='false' show-center :title='title'>
            <template #left>
                <a class='topBack' href='javascript:;' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <!-- <areaInput
                    v-model='email'
                    v-model:zone='zoneText'
                    clear
                    :disabled='true'
                    :input-type='"text"'
                    :placeholder='type === "bind" ? $t("common.inputEmail"): $t("common.inputNewEmail")'
                    type='email'
                /> -->
                <p class='title'>
                    {{ $t("common.inputEmail") }}
                </p>
                <van-field
                    v-model.trim='email'
                    class='inputEmail'
                    label=''
                    :placeholder='type === "bind" ? $t("common.inputEmail"): $t("common.inputNewEmail")'
                    type='text'
                />
            </div>
            <div class='field'>
                <p v-if='type === "change"' class='title'>
                    {{ $t('common.sendToYourEmail') }}
                </p>
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div>
            <div v-if='type === "change"' class='field'>
                <p class='title'>
                    {{ $t('common.sendToYou') }} {{ customInfo.email }}
                </p>
                <CheckCode v-model='checkCodeOld' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSendOld' />
            </div>
            <div v-if='googleCodeVis' class='field form-item-google'>
                <p class='title'>
                    {{ $t('common.inputGoogleCode') }}
                </p>
                <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
            </div>
            <!-- <div class='field'>
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div> -->
            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
        </form>
    </div>
</template>

<script>
import Top from '@/components/top'
import CheckCode from '@/components/form/checkCode'
import areaInput from '@/components/form/areaInput.vue'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { Toast, Dialog } from 'vant'
import { reactive, toRefs, computed, onUnmounted } from 'vue'
import { isEmpty, emailReg, getArrayObj } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { bindEmail, changeEmailV1v1v2, checkCustomerExist } from '@/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Top,
        areaInput,
        googleVerifyCode,
        CheckCode
    },
    props: {
        type: {
            type: String
        }
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            email: '',
            sendToken: '',
            sendTokenOld: '',
            checkCode: '',
            checkCodeOld: '',
            loading: false,
            zone: '+86',
            googleCode: ''
        })
        store.dispatch('getCountryListByParentCode')
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const countryList = computed(() => store.state.countryList)
        const customInfo = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)
        const zoneText = computed(() => {
            const countryObj = getArrayObj(countryList.value, 'code', customInfo.value.country)
            state.zone = countryObj.countryCode
            return countryObj.name + ' (' + countryObj.countryCode + ')'
        })
        const title = computed(() => props.type === 'bind' ? t('setting.bindEmail') : t('setting.replaceEmail'))

        store.dispatch('getListByParentCode')

        const handleConfirm = () => {
            if (isEmpty(state.email)) {
                return Toast(t('common.inputEmail'))
            }
            if (!emailReg.test(state.email)) {
                return Toast(t('common.inputRealEmail'))
            }
            if (isEmpty(state.checkCode)) {
                return Toast(t('common.inputVerifyCode'))
            }
            if (isEmpty(state.sendToken)) {
                return Toast(t('common.getVerifyCode'))
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }
            if (props.type === 'change') {
                if (isEmpty(state.checkCodeOld)) {
                    return Toast(t('common.inputVerifyCode'))
                }
                if (isEmpty(state.sendTokenOld)) {
                    return Toast(t('common.getVerifyCode'))
                }
            }

            const params = {
                email: state.email,
                verifyCode: state.checkCode,
                sendToken: state.sendToken || '11',
                emailArea: state.zone,
                verifyCodeOld: state.checkCodeOld,
                sendTokenOld: state.sendTokenOld,
                googleCode: state.googleCode
            }
            state.loading = true

            if (props.type === 'bind') {
                bindEmail(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.emailBindSuccess'))
                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            } else if (props.type === 'change') {
                changeEmailV1v1v2(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.replaceEmailSuccess'))
                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
        }
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.email)) {
                callback && callback(false)
                return Toast(t('common.inputEmail'))
            }
            if (!emailReg.test(state.email)) {
                callback && callback(false)
                return Toast(t('common.inputRealEmail'))
            }
            const params = {
                bizType: 'EMAIL_COMMON_VERIFICATION_CODE',
                toUser: state.email,
            }
            const existParams = {
                type: 1,
                loginName: state.email,
                phoneArea: state.zone,
                emailArea: state.zone
            }
            state.loading = true
            checkCustomerExist(existParams).then(res => {
                state.loading = false
                if (res.check()) {
                    if (res.data === 1) {
                        callback && callback(false)
                        return Dialog.confirm({
                            title: t('common.tip'),
                            message: t('common.emailBinded'),
                            confirmButtonText: t('common.serivce'),
                            cancelButtonText: t('common.close')
                        }).then(() => {
                            if (onlineServices.value) { location.href = onlineServices.value }
                        }).catch(() => {
                            callback && callback(false)
                            // on cancel
                        })
                    } else {
                        verifyCodeSend(params).then(res => {
                            if (res.check()) {
                                if (res.code === '0') {
                                    state.sendToken = res.data.token
                                    Toast(t('common.verifySended'))
                                    callback && callback()
                                }
                            }
                        })
                    }
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        const handleVerifyCodeSendOld = (callback) => {
            const params = {
                bizType: 'EMAIL_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(params).then(res => {
                if (res.check()) {
                    if (Number(res.code) === 0) {
                        state.sendTokenOld = res.data.token
                        Toast(t('common.verifySended'))
                        callback && callback()
                    }
                }
            })
        }

        onUnmounted(() => {
            store.dispatch('_user/findCustomerInfo', false)
        })

        return {
            handleConfirm,
            onlineServices,
            handleVerifyCodeSend,
            zoneText,
            customInfo,
            googleCodeVis,
            getGooleVerifyCode,
            handleVerifyCodeSendOld,
            title,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    .form {
        padding-top: rem(20px);
        .field {
            margin-top: 10px;
            padding: 0 rem(30px);
            background: var(--contentColor);
            .label {
                color: var(--minorColor);
            }
        }
        .confirm-btn {
            @include hover();
            position: absolute;
            bottom: 0;
            height: rem(90px);
            background: var(--contentColor);
            border-color: var(--lineColor);
            span {
                color: var(--color);
                font-size: rem(32px);
            }
        }
    }
    .inputEmail{
        padding-left: 0;
    }
    .form-item-google :deep() {
        .van-cell {
            padding-left: 0;
            background: none;
        }
        .paste {
            display: none;
        }
    }
}
</style>
