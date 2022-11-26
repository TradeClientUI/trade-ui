<template>
    <div class='pageWrap'>
        <!-- <Top back show-center /> -->
        <Top back left-icon='arrow-left' :right-action='false' show-center :title='title'>
            <template #left>
                <a class='topBack' href='javascript:;' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
            <template #right>
            </template>
        </Top>
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <areaInput
                    v-model.trim='mobile'
                    v-model:zone='zoneText'
                    :all-country='true'
                    clear
                    :disabled='true'
                    :placeholder='type === "bind" ? $t("common.inputPhone"): $t("common.inputNewPhone")'
                />
            </div>

            <div v-if='type === "change"' class='field'>
                <p class='title'>
                    {{ $t('common.sendToYourPhone') }}
                </p>
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div>

            <div v-if='type === "change"' class='field'>
                <p class='title'>
                    {{ $t('common.sendToYou') }} {{ customInfo.phone }}
                </p>
                <CheckCode v-model='checkCodeOld' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSendOld' />
            </div>
            <div v-else class='field'>
                <!-- <label class='label'>
                    验证码
                </label> -->
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div>
            <div v-if='googleCodeVis' class='field field-google'>
                <p class='title'>
                    {{ $t('common.inputGoogleCode') }}
                </p>
                <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
            </div>

            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
        </form>
    </div>
</template>

<script>
import Top from '@/components/top'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import areaInput from '@/components/form/areaInput'
import CheckCode from '@/components/form/checkCode'
import { toRefs, reactive, computed, onUnmounted } from 'vue'
import { isEmpty, getArrayObj } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { bindPhone, changePhoneV1v1v2, checkUserStatus } from '@/api/user'
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
        const title = computed(() => props.type === 'bind' ? t('setting.bindPhone') : t('setting.replacePhone'))
        const state = reactive({
            zone: '',
            sendToken: '',
            sendTokenOld: '',
            mobile: '',
            checkCode: '',
            checkCodeOld: '',
            loading: false,
            googleCode: '',
            allCountryList: []
        })

        store.dispatch('getCountryListByParentCode').then(res => {
            if (res.data.length > 0) {
                state.allCountryList = res.data
            }
        })
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const countryList = computed(() => store.state.countryList)
        const customInfo = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)
        const zoneText = computed(() => {
            const countryObj = getArrayObj(state.allCountryList, 'code', customInfo.value.country)
            if (countryObj) state.zone = countryObj.countryCode
            return countryObj.name + ' (' + countryObj.countryCode + ')'
        })
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'code', customInfo.value.country).extend || '')

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        const handleVerifyCodeSendOld = (callback) => {
            const params = {
                bizType: 'SMS_LOGINED_VERIFICATION_CODE'
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

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.mobile)) {
                callback && callback(false)
                return Toast(t('common.inputPhone'))
            }

            if (!RegExp(mobileReg.value).test(state.mobile)) {
                callback && callback(false)
                return Toast(t('common.inputRealPhone'))
            }

            const params = {
                bizType: 'SMS_COMMON_VERIFICATION_CODE',
                toUser: state.zone + ' ' + state.mobile
            }

            const existParams = {
                type: 2,
                loginName: state.mobile,
                phoneArea: state.zone
            }
            checkUserStatus(existParams).then(res => {
                if (res.check()) {
                    if (Number(res.data.status) === 1) {
                        callback && callback(false)
                        return Dialog.confirm({
                            title: t('common.tip'),
                            message: t('common.phoneBinded'),
                            confirmButtonText: t('common.serivce'),
                            cancelButtonText: t('common.close')
                        }).then(() => {
                            if (onlineServices.value) location.href = onlineServices.value
                        }).catch(() => {
                            // on cancel
                            callback && callback(false)
                        })
                    } else if (Number(res.data.status === -1)) {
                        callback && callback(false)
                        return Toast(t('c.userDisable'))
                    } else {
                        verifyCodeSend(params).then(res => {
                            if (res.check()) {
                                if (Number(res.code) === 0) {
                                    state.sendToken = res.data.token
                                    Toast(t('common.verifySended'))
                                    callback && callback()
                                }
                            }
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }

        const handleConfirm = () => {
            if (isEmpty(state.mobile)) {
                return Toast(t('common.inputPhone'))
            }
            if (!RegExp(mobileReg.value).test(state.mobile)) {
                return Toast(t('common.inputRealPhone'))
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

            state.loading = true
            const params = {
                phone: state.mobile,
                verifyCode: state.checkCode,
                sendToken: state.sendToken || '11',
                phoneArea: state.zone,
                verifyCodeOld: state.checkCodeOld,
                sendTokenOld: state.sendTokenOld,
                googleCode: state.googleCode
            }

            if (props.type === 'bind') {
                bindPhone(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.phoneBindSuccess'))
                        store.dispatch('_user/findCustomerInfo', false)

                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            } else if (props.type === 'change') {
                changePhoneV1v1v2(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.replacePhoneSuccess'))
                        store.dispatch('_user/findCustomerInfo', false)
                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
        }

        onUnmounted(() => {
            store.dispatch('_user/findCustomerInfo', false)
        })

        return {
            handleVerifyCodeSend,
            handleVerifyCodeSendOld,
            handleConfirm,
            onlineServices,
            zoneText,
            customInfo,
            googleCodeVis,
            getGooleVerifyCode,
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
            .title {
                padding: 10px 0 0;
                line-height: 1.4;
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
    .field-google :deep() {
        .van-cell {
            background: none;
        }
        .paste {
            display: none;
        }
    }
}
</style>
