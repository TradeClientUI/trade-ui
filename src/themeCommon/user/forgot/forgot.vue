<template>
    <div class='pageWrap'>
        <Top
            :menu='false'
            :right-action='false'
            :show-center='false'
        />
        <Loading :show='loading' />
        <header class='header'>
            <h1 class='pageTitle'>
                {{ type === 'login' ? $t('forgot.forgot') : $t('forgot.forgotFund') }}
            </h1>
        </header>
        <div class='tabs-wrap'>
            <van-tabs
                v-model:active='active'
                class='openTypeTab mtop10'
                :color='style.assistColor'
                shrink
                :title-active-color='$style.primary'
                type='card'
                @click='handleTabChange'
            >
                <van-tab :name='1' :title='$t("forgot.retrievedByEmail")' />
                <van-tab :name='0' :title='$t("forgot.retrievedByPhone")' />
            </van-tabs>
        </div>
        <div class='tabs-content'>
            <form v-show='curTab === 0' class='loginForm'>
                <div v-if="type==='login'" class='field'>
                    <areaInputMobile
                        v-model.trim='mobile'
                        v-model:zone='phoneArea'
                        clear
                        :country-code='countryCode'
                        :country-list='countryList'
                        :placeholder='$t("common.inputPhone")'
                        @onBlur='checkUserMfa'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-else class='field'>
                    <p class='title'>
                        {{ $t('common.sendToYou') }} {{ customerInfo?.phone }}
                    </p>
                </div>

                <div class='field'>
                    <checkCode
                        v-if="type === 'login'"
                        v-model.trim='checkCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
                        @verifyCodeSend='handleVerifyCodeSend'
                    />
                    <checkCode
                        v-else
                        v-model.trim='checkCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
                        @verifyCodeSend='handleVerifyCodeSendFund'
                    />
                </div>

                <div v-if='googleCodeVis' class='field field-google'>
                    <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                </div>
            </form>

            <form v-show='curTab === 1' class='loginForm'>
                <div v-if="type==='login'" class='field'>
                    <InputComp
                        v-model.trim='email'
                        clear
                        :label='$t("common.inputEmail")'
                        @onBlur='checkUserMfa'
                    />
                </div>
                <div v-else class='field'>
                    <p class='title'>
                        {{ $t('common.sendToYou') }} {{ customerInfo?.email }}
                    </p>
                </div>
                <div class='field'>
                    <checkCode
                        v-if='type === "login"'
                        v-model.trim='emailCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
                        @verifyCodeSend='handleVerifyCodeSend'
                    />
                    <checkCode
                        v-else
                        v-model.trim='emailCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
                        @verifyCodeSend='handleVerifyCodeSendFund'
                    />
                </div>

                <div v-if='googleCodeVis' class='field field-google'>
                    <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                </div>
            </form>
        </div>
        <div class='btn-wrap'>
            <van-button block class='next-btn' type='primary' @click='next'>
                <span>{{ $t('common.nextStep') }}</span>
            </van-button>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import InputComp from '@/components/form/input'
import { reactive, toRefs, computed, watch } from 'vue'
import areaInputMobile from '@/themeCommon/user/register/components/areaInput'
import checkCode from '@/components/form/checkCode'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import uInput from '@/components/input.vue'
import Schema from 'async-validator'
import RuleFn from './rule'
import { useStore } from 'vuex'
import { verifyCodeSend, verifyCodeCheck } from '@/api/base'
import { checkUserStatus, checkGoogleMFAStatus } from '@/api/user'
import { isEmpty, getArrayObj, localGetJSON } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'

export default {
    components: {
        Top,
        areaInputMobile,
        InputComp,
        checkCode,
        uInput,
        googleVerifyCode
    },
    setup (props) {
        const style = computed(() => store.state.style)
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { type } = route.query
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            mobile: '',
            checkCode: '',
            email: '',
            emailCode: '',
            phoneArea: '',
            formatPhoneArea: '',
            curTab: 1,
            tips: {
                flag: true,
                msg: ''
            },
            sendToken: '',
            active: 1,
            loading: false,
            googleCodeVis: false,
            googleCode: '',
            countryCode: ''
        })

        const bizTypeMap = {
            login: {
                0: 'SMS_PASSWORD_VERIFICATION_CODE',
                1: 'EMAIL_PASSWORD_VERIFICATION_CODE'
            },
            fund: {
                0: 'SMS_LOGINED_VERIFICATION_CODE',
                1: 'EMAIL_LOGINED_VERIFICATION_CODE'
            }
        }

        const customerInfo = computed(() => store.state._user.customerInfo)
        // 国家列表
        const countryList = computed(() => {
            return store.state.countryList
        })

        watch([() => countryList.value, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
            const countryList = value[0]
            const defaultZone = value[1]
            // 如果有缓存则显示缓存信息
            let index = -1
            const loginInfo = localGetJSON('loginInfo')
            if (loginInfo?.phoneArea) {
                index = countryList.findIndex(el => el.countryCode === loginInfo.phoneArea)
            }
            if (loginInfo?.accountType) {
                if (loginInfo.accountType === 2) {
                    // state.mobile = loginInfo?.loginName || ''
                    state.curTab = 0
                    state.active = 0
                } else {
                    // state.email = loginInfo?.loginName || ''
                    state.curTab = 1
                    state.active = 1
                }
            }
            const language = navigator.language // 当前系统语言
            // 根据语言优先显示默认区号
            if (index === -1 && language) {
                const langCode = language.substring(language.lastIndexOf('-') + 1, language.length)
                index = countryList.findIndex(el => el.nationalCode === langCode.toUpperCase())
            }
            if (index === -1 && defaultZone?.code) {
                index = countryList.find(el => el.code === defaultZone.code)
            }
            if (countryList.length > 0) {
                const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
                state.phoneArea = defaultZoneConfig.countryCode
                state.formatPhoneArea = defaultZoneConfig.formatName
                state.countryCode = defaultZoneConfig.code
            }
        }, { immediate: true })

        // 获取白标企业开户登录的国家区号列表
        // store.dispatch('getCompanyCountry')
        // 获取国家区号
        store.dispatch('getCountryListByParentCode')

        if (type === 'fund') {
            state.mobile = customerInfo.value?.phone
            state.email = customerInfo.value?.email
            state.googleCodeVis = customerInfo.value.googleId > 0
        }

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 检测客户是否开启GoogleMFA
        const checkUserMfa = (val) => {
            if (val) {
                const params = {
                    loginName: val,
                    type: state.active === 1 ? 1 : 2
                }
                if (params.type === 2) params.phoneArea = state.phoneArea
                checkGoogleMFAStatus(params).then(res => {
                    if (res.check()) {
                        state.googleCodeVis = res.data > 0
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            }
        }

        // 找回登录密码发送验证码
        const handleVerifyCodeSend = (callback) => {
            const validator = new Schema(RuleFn(t))
            validator.validate({
                type: state.curTab,
                mobile: state.mobile,
                email: state.email,
                zone: state.phoneArea,
                resetType: type
            }, (errors, fields) => {
                console.log('errors:', errors, fields)
                if (errors) {
                    callback && callback(false)
                    return Toast(errors[0].message)
                }

                // 验证手机号邮箱是否存在
                const source = {
                    type: state.curTab === 0 ? 2 : 1,
                    phoneArea: state.phoneArea,
                    loginName: state.curTab === 0 ? state.mobile : state.email
                }
                state.loading = true
                checkUserStatus(source).then(res => {
                    state.loading = false
                    if (res.check()) {
                        if (Number(res.data.status) === 2) {
                            const msg = t(state.curTab === 0 ? 'common.unExistPhone' : 'common.unExistEmail')
                            callback && callback(false)
                            return Toast(msg)
                        } else if (Number(res.data.status === -1)) {
                            callback && callback(false)
                            return Toast(t('c.userDisable'))
                        } else {
                            // state.phoneArea = res.data.phoneArea
                            verifyCodeSend({
                                bizType: bizTypeMap['login'][state.curTab],
                                toUser: state.curTab === 0 ? state.phoneArea + ' ' + state.mobile : state.email,
                            }).then(res => {
                                if (res.check()) {
                                    state.sendToken = res.data.token
                                    Toast(t('common.verifySended'))
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            })
                        }
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            })
        }

        // 找回资金密码发送验证码
        const handleVerifyCodeSendFund = (callback) => {
            if (state.curTab === 0 && !customerInfo.value.phone) {
                callback && callback(false)
                return Toast(t('common.noBindPhone'))
            }
            if (state.curTab === 1 && !customerInfo.value.email) {
                callback && callback(false)
                return Toast(t('common.noBindEmail'))
            }

            verifyCodeSend({
                bizType: bizTypeMap['fund'][state.curTab],
            }).then(res => {
                if (res.check()) {
                    state.sendToken = res.data.token
                    Toast(t('common.verifySended'))
                    callback && callback()
                } else {
                    callback && callback(false)
                }
            })
        }

        const resetLoginPwd = () => {
            const params = {
                mobile: state.mobile,
                email: state.email,
                checkCode: state.checkCode,
                emailCode: state.emailCode,
                type: state.curTab,
                needCheckCode: true
            }
            const validator = new Schema(RuleFn(t))

            validator.validate(params, (errors, fields) => {
                console.log(errors, fields)
                if (errors) {
                    return Toast(errors[0].message)
                }
                state.loading = true
                handleVerifyCode()
            })
        }

        const resetFundPwd = () => {
            if ((isEmpty(state.checkCode) && state.curTab === 0) || (isEmpty(state.emailCode) && state.curTab === 1)) {
                return Toast(t('common.inputVerifyCode'))
            }
            // if (isEmpty(state.sendToken)) {
            //     return Toast(t('common.getVerifyCode'))
            // }
            handleVerifyCode()
        }

        const handleVerifyCode = () => {
            // let loginName
            // if (type === 'login') {
            //     loginName = state.curTab === 0 ? state.phoneArea + ' ' + state.mobile : state.email
            // } else if (type === 'fund') {
            //     loginName = ''
            // }

            if (type === 'login') {
                verifyCodeCheck({
                    bizType: bizTypeMap['login'][state.curTab],
                    toUser: state.curTab === 0 ? state.phoneArea + ' ' + state.mobile : state.email,
                    sendToken: state.sendToken || '11',
                    code: state.curTab === 0 ? state.checkCode : state.emailCode
                }).then(res => {
                    state.loading = false
                    if (res.ok) {
                        router.push({
                            path: '/resetLoginPwd',
                            query: {
                                verifyCodeToken: res.data.token,
                                sendToken: state.sendToken,
                                phoneArea: state.phoneArea,
                                type: state.curTab === 0 ? 2 : 1,
                                loginName: state.curTab === 0 ? state.mobile : state.email,
                                googleCode: state.googleCode,
                                verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                            }
                        })
                    } else {
                        Toast(res.msg)
                    }
                }).catch((err) => {
                    state.loading = false
                })
            } else {
                router.push({
                    path: '/resetFundPwd',
                    query: {
                        // verifyCodeToken: res.data.token,
                        sendToken: state.sendToken,
                        phoneArea: state.phoneArea,
                        type: state.curTab === 0 ? 2 : 1,
                        loginName: state.curTab === 0 ? state.phoneArea + ' ' + state.mobile : state.email,
                        verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                        googleCode: state.googleCode
                    }
                })
            }
        }

        const next = () => {
            if (state.googleCodeVis && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            if (type === 'login') {
                resetLoginPwd()
            } else if (type === 'fund') {
                resetFundPwd()
            }
        }

        const zoneSelect = (data) => {
            state.phoneArea = data.countryCode
            state.formatPhoneArea = data.formatName
            state.countryCode = data.code
            if (state.mobile) checkUserMfa(state.mobile)
        }
        const back = () => {
            router.replace('/login')
        }

        return {
            ...toRefs(state),
            next,
            countryList,
            handleTabChange,
            handleVerifyCodeSend,
            style,
            zoneSelect,
            back,
            customerInfo,
            type,
            handleVerifyCodeSendFund,
            getGooleVerifyCode,
            checkUserMfa
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(20px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: bold;
        font-size: rem(40px);
    }
    .tabs-wrap {
        .openTypeTab {
            padding: rem(40px) rem(30px) 0 rem(30px);
            width: 80%;

            --van-padding-md: 0;
            --van-tabs-card-height: 30px;
            :deep(.van-tabs__nav--line) {
                background-color: var(--contentColor);
            }
            :deep(.van-tabs__nav) {
                border: none;
            }
            :deep(.van-tab) {
                margin-right: rem(20px);
                border-radius: 4px;
                line-height: rem(40px);
                padding: 0 rem(30px);
                border: none;
                .van-tab__text {
                    color: var(--minorColor);
                    font-size: rem(26px);
                }
                &.van-tab--active {
                    .van-tab__text {
                        color: var(--primary);
                    }
                }
            }
        }
    }
}
.icon_icon_close_big {
    position: absolute;
    top: rem(30px);
    left: rem(30px);
    color: var(--color);
    font-size: rem(34px);
}
.loginForm {
    margin: rem(40px) rem(30px);
    .field {
        position: relative;
        display: flex;
        flex: 1;
        line-height: rem(80px);
        align-items: center;
        border: solid 1px var(--lineColor);
        padding: 0 rem(20px);
        border-radius: rem(8px);
        &:not(:first-of-type) {
            margin-top: rem(30px);
        }
        &.toolWrap {
            justify-content: space-between;
        }
        &.field-google {
            padding: 0 0 0 rem(20px);
            :deep(.form-item) {
                border: none;
                margin-bottom: 0;
                border-radius: rem(8px);
            }
            :deep(.van-cell) {
                --van-cell-vertical-padding: 8px;
                padding-left: 0;
                &::after {
                    border-bottom: none;
                }
                input {
                    padding: 0 rem(10px);
                }
            }
        }
        .title {
            padding-left: rem(10px);
            color: var(--normalColor);
        }
        label {
            position: absolute;
            top: 0;
            left: 0;
            height: rem(75px);
            color: var(--placeholder);
            font-size: rem(30px);
            line-height: rem(75px);
            transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
            &.active {
                transform: scale(0.8) translateY(-90%);
            }
        }
        .input {
            display: block;
            flex: 1;
            height: rem(75px);
            font-size: rem(30px);
            line-height: 1;
            &:focus~label,
            &:valid~label {
                transform: scale(0.8) translateY(-90%);
                transform-origin: bottom left;
            }
        }
        .van-icon-clear {
            color: var(--lineColor);
            font-size: rem(36px);
        }
        .icon_icon_default,
        .icon_icon_pressed {
            margin-left: rem(10px);
            color: var(--lineColor);
            font-size: rem(36px);
        }
    }
}
.btn-wrap {
    padding: 0 rem(30px);
    .next-btn {
        border-radius: rem(8px);
        background: var(--primary);
        border-color: var(--lineColor);
        span {
            font-size: rem(30px);
        }
    }
    .remeber {
        margin-top: rem(40px);
        text-align: center;
        >a {
            color: var(--primary);
        }
    }
}

</style>

<style>

.pageWrap .van-tabs__line {
    background-color: #333;
}
</style>
