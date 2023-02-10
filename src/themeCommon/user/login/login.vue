<template>
    <LayoutTop :menu='false' :show-title='false' />
    <div v-if='!accessFlag' class='pageWrap'>
        <div class='page-title'>
            <span v-if='tabActive === 0' class='openType1'>
                {{ $t('login.welcomeLogin') }}MagnaMarkets
            </span>
            <span v-else class='openType2'>
                {{ $t('login.loginByCorporate') }}
            </span>
        </div>

        <van-tabs
            v-model:active='loginNameType'
            class='openTypeTab mtop10'
            :color='$style.assistColor'
            shrink
            :title-active-color='$style.primary'
            type='card'
            @change='loginNameTypeChange'
        >
            <van-tab name='email' :title='$t("register.email")' />
            <van-tab name='mobile' :title='$t("register.phoneNo")' />
        </van-tabs>
        <!-- <header class='header'>
            <h1 class='pageTitle'>
                {{ $t(loginType==='password'?'login.loginByPwd':'login.loginByCode') }}
            </h1>
        </header> -->

        <form class='loginForm'>
            <div v-if="loginNameType==='mobile'" class='field'>
                <areaInputMobile
                    v-model.trim='loginName'
                    v-model:zone='phoneArea'
                    clear
                    :country-code='countryCode'
                    :country-list='countryList'
                    :placeholder="$t('common.inputPhone')"
                    @onBlur='checkUserMfa'
                    @zoneSelect='zoneSelect'
                />
            </div>
            <div v-else class='field'>
                <InputComp v-model.trim='email' clear :label="$t('common.inputEmail')" @onBlur='checkUserMfa' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' clear :label="$t('login.pwd')" pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-show="loginNameType==='mobile'" v-model.trim='checkCodeMobile' clear :label="$t('login.verifyCode')" @verifyCodeSend='verifyCodeSendHandler' />
                <CheckCode v-show="loginNameType==='email'" v-model.trim='checkCodeEmail' clear :label="$t('login.verifyCode')" @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <div v-if='googleCodeVis' class='field field-google'>
                <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
            </div>
            <div class='forget-bar'>
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Forgot',query: { type: 'login' } })">
                    {{ $t('login.forgot') }}
                </a>
            </div>

            <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                {{ $t('login.loginBtn') }}
            </van-button>
            <div class='toolBtns'>
                <span class='btn'>
                    {{ $t('login.goRegister') }}
                    <a class='mobile_signin_signup_ga' href='javascript:;' @click="$router.push({ name:'Register' })">
                        {{ $t('register.registerBtn') }}
                    </a>
                </span>
                <a class='btn' href='javascript:;' @click='changeLoginType'>
                    {{ $t(loginType === 'password' ? 'login.loginByCode' : 'login.loginByPwd') }}
                </a>
            </div>
        </form>
        <third-login v-if='thirdLoginArr && thirdLoginArr.length > 0 && tabActive === 0' />
        <!-- <div
            v-if='businessConfig.enterpriseLogin'
            class='account-type'
            :class='{ openType2: tabActive===1 }'
        >
            <div v-if='tabActive === 1' class='ac-item' @click='tabActive = 0'>
                {{ $t('login.loginByPersonal') }}&nbsp;&nbsp;>>
            </div>
            <div v-if='tabActive === 0' class='ac-item' @click='tabActive = 1'>
                {{ $t('login.loginByCorporate') }}&nbsp;&nbsp;>>
            </div>
        </div> -->

        <!-- <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer> -->
        <!-- <div class='support'>
            <img alt='' src='/images/support.png' />
        </div> -->
    </div>

    <!-- 设置登录密码 -->
    <van-popup v-model:show='loginPwdPop' :close-on-click-overlay='false' :style="{ 'border-radius':'8px','background-color': $style.bgColor }">
        <section class='popContainer'>
            <a class='noTip' href='javascript:;' @click='noTip'>
                {{ $t('login.neverTip') }}
            </a>
            <div class='containerBox'>
                <p class='iconPwd'>
                    <span class='icon_password'></span>
                </p>
                <p class='tipContent'>
                    {{ $t('login.pwdTips') }}
                </p>
            </div>
            <div class='btnBox'>
                <button class='btn' @click='loginPwdSet'>
                    {{ $t('login.goSet') }}
                </button>
                <button class='btn muted' @click='loginPwdSetNext'>
                    {{ $t('login.nextTime') }}
                </button>
            </div>
        </section>
    </van-popup>
    <Loading :show='loading' />
</template>

<script>
import Schema from 'async-validator'
import areaInputMobile from '@/themeCommon/user/register/components/areaInput'
import InputComp from '@/components/form/input'
import Vline from '@/components/vline'
import CheckCode from '@/components/form/checkCode'
import thirdLogin from '@/themeCommon/components/thirdLogin'

import Top from '@/components/top'
import { getDevice, localGet, localSet, getArrayObj, localGetObj, isEmpty, localGetJSON, getDefaultZoneIndex } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { computed, reactive, toRefs, getCurrentInstance, onUnmounted, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import RuleFn from './rule'
import md5 from 'js-md5'
import { timeline, timelineItem } from '@/components/timeline'
import { checkUserStatus, checkGoogleMFAStatus } from '@/api/user'
import { setQuoteService } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
//  import hooks from './hooks'

export default {
    components: {
        Vline,
        areaInputMobile,
        InputComp,
        CheckCode,
        Top,
        googleVerifyCode,
        thirdLogin
    },
    setup () {
        // const { getPlansByCountry, getCustomerGroupIdByCountry } = hooks()
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const instance = getCurrentInstance()
        const businessConfig = computed(() => store.state.businessConfig)
        const accessFlag = computed(() => store.state._base.accessFlag)
        const state = reactive({
            loading: false,
            pwdVisible: false,
            loginPwdPop: false,
            tabActive: 0,
            loginName: '',
            email: '',
            pwd: '',
            phoneArea: '',
            formatPhoneArea: '', // 区号和国家 用于显示
            checkCodeMobile: '', // 手机号验证码
            checkCodeEmail: '', // 邮箱验证码
            loginType: 'password', // checkCode
            loginNameType: 'email',
            bindAddShow: false,
            userId: '',
            googleCodeVis: false,
            googleCode: '',
            countryCode: '' // 国家编码
        })
        let token = ''
        const rightAction = computed(() => {
            return {
                title: t(state.loginType === 'password' ? 'login.loginByCode' : 'login.loginByPwd')
            }
        })

        // 国家列表
        const countryList = computed(() => {
            return state.tabActive === 1 ? store.getters.companyCountryList : store.state.countryList
        })

        // 检测客户是否开启GoogleMFA
        const checkUserMfa = (val) => {
            if (val) {
                checkGoogleMFAStatus({
                    loginName: val,
                    phoneArea: state.phoneArea,
                    type: state.loginNameType === 'email' ? 1 : 2
                }).then(res => {
                    if (res.check()) {
                        state.googleCodeVis = res.data > 0
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            }
        }

        // 初始化区号
        watch([countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
            const countryList = value[0]
            const defaultZone = value[1]
            // 如果有缓存则显示缓存信息
            let index = -1
            const loginInfo = localGetJSON('loginInfo')
            if (loginInfo?.phoneArea) {
                index = countryList.findIndex(el => el.countryCode === loginInfo.phoneArea)
            }
            if (loginInfo?.accountType) {
                if (loginInfo.accountType === 1) {
                    state.email = loginInfo?.loginName || ''
                    state.loginNameType = 'email'
                } else {
                    state.loginName = loginInfo?.loginName || ''
                    state.loginNameType = 'mobile'
                }
            }
            if (index === -1) {
                index = getDefaultZoneIndex(countryList, defaultZone?.code)
            }
            if (countryList.length > 0) {
                const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
                state.phoneArea = defaultZoneConfig.countryCode
                state.formatPhoneArea = defaultZoneConfig.formatName
                state.countryCode = defaultZoneConfig.code
            }
            if (loginInfo?.loginName) {
                checkUserMfa(loginInfo?.loginName)
            }
        }, { immediate: true })

        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
        // 获取白标企业开户登录的国家区号列表
        store.dispatch('getCompanyCountry')
        // 获取国家区号
        store.dispatch('getCountryListByParentCode')

        const changeLoginType = () => {
            const loginType = state.loginType
            state.loginType = loginType === 'password' ? 'checkCode' : 'password'
        }
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 切换个人登录、企业登录方式
        const tabActiveChange = (e) => {
            const hasArea = countryList.value.find(el => el.countryCode === state.phoneArea)
            if (!hasArea) {
                state.phoneArea = countryList.value[0].countryCode
            }
        }

        // 切换手机号邮箱登录方式
        const loginNameTypeChange = () => {
            state.pwd = ''
            const loginName = state.loginNameType === 'email' ? state.email : state.loginName
            if (loginName) {
                checkUserMfa(loginName)
            }
        }

        // 选择登录手机号区号
        const zoneSelect = (data) => {
            state.phoneArea = data.countryCode
            state.formatPhoneArea = data.formatName
            state.countryCode = data.code
        }

        const loginHandle = () => {
            if (state.googleCodeVis && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            const verifyCode = state.loginNameType === 'email' ? state.checkCodeEmail : state.checkCodeMobile
            const loginParams = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName,
                phoneArea: state.phoneArea,
                device: getDevice(),
                verifyCode: state.loginType === 'checkCode' ? verifyCode : undefined,
                loginPwd: state.loginType === 'password' ? md5(state.pwd) : undefined,
                sendToken: state.loginType === 'checkCode' ? token : undefined,
                thirdSource: route.query.thirdSource || '',
                bindThirdUserId: route.query.bindThirdUserId || '',
                isThird: false, // true为三方登录 false 系统登录
                googleCode: state.googleCode
            }

            const validator = new Schema(RuleFn(t))
            state.loading = true

            validator.validate(
                {
                    ...loginParams
                }, {
                    ...state,
                    first: true
                }, (errors, fields) => {
                    // console.log(errors, fields, loginParams)
                    if (errors) {
                        state.loading = false
                        Toast(errors[0].message)
                        return
                    }
                    loginSubmit(loginParams)
                })
        }

        // 登录成功跳转
        const loginToPath = () => {
            const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
            const backURL = route.query.activityBack ? decodeURIComponent(route.query.activityBack) : toURL // 返回活动页面的链接
            router.replace(backURL)
        }

        // 发送登录接
        const loginSubmit = (params) => {
            state.loading = true
            store.dispatch('_user/login', params).then(res => {
                state.loading = false
                if (res.invalid()) return false

                // 切换登录后的行情websocket
                // setQuoteService()

                // 登录websocket
                instance.appContext.config.globalProperties.$MsgSocket.login()
                store.commit('del_cacheViews', 'Home')
                store.commit('del_cacheViews', 'Layout')

                // 缓存注册信息
                localSet('loginInfo', JSON.stringify({
                    accountType: params.type,
                    loginName: params.loginName,
                    phoneArea: params.phoneArea || '',
                }))

                // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
                // companyKycStatus 公司KYC开户状态，1开启 2未开启
                const resData = res.data
                const lastAccountType = localGetObj('mockAccount', 'lastAccountType')
                const isReal = !lastAccountType || lastAccountType === 'real'
                if (!isReal) {
                    noticeSetPwd(resData.loginPassStatus)
                } else if (Number(resData.companyKycStatus) === 1) {
                    if (Number(resData.kycAuditStatus === 0)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('login.goAuthenticate'),
                            message: t('login.goAuthenticateMsg'),

                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(resData.kycAuditStatus === 1)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.close'),
                            message: t('common.inReview'),

                        }).then(() => {
                            store.dispatch('_user/logout').then(() => {
                                return router.push('/login')
                            }).then(() => {
                                location.reload()
                            })
                        })
                    } else if (Number(resData.kycAuditStatus === 3)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.reSubmit'),
                            message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + resData.kycAuditRemark,

                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(resData.kycAuditStatus === 2)) {
                        noticeSetPwd(resData.loginPassStatus)
                    }
                } else if (Number(resData.companyKycStatus) === 2) {
                    noticeSetPwd(resData.loginPassStatus)
                }
            })
        }

        // 设置登录密码弹窗
        const noticeSetPwd = (loginPassStatus) => {
            const lastAccountType = localGetObj('mockAccount', 'lastAccountType')
            const isReal = !lastAccountType || lastAccountType === 'real'
            if (isReal && parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                state.loginPwdPop = true
            } else {
                loginToPath()
            }
        }

        const topRightClick = () => {
            console.log('rightClick')
        }

        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName
            }
            if (state.loginNameType === 'mobile') verifyParams.phoneArea = state.phoneArea

            const validator = new Schema(RuleFn(t))
            validator.validate({
                ...verifyParams
            }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) === 2) {
                            const msg = t(verifyParams.type === 1 ? 'common.noEmail' : 'common.noPhone')
                            callback && callback(false)
                            return Toast(msg)
                        } else if (Number(res.data.status === -1)) {
                            callback && callback(false)
                            return Toast(t('c.userDisable'))
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.loginNameType === 'email' ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
                                toUser: state.loginNameType === 'email' ? state.email : String(state.phoneArea) + ' ' + state.loginName,
                            }
                            verifyCodeSend(params).then(res => {
                                if (res.check()) {
                                    token = res.data.token
                                    // if (res.data.code) state.checkCode = res.data.code
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            }).catch(err => {
                                callback && callback(false)
                            })
                        }
                    }
                })
            }).catch(({
                errors,
                fields
            }) => {
                callback && callback(false)
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }

        // 设置登录密码
        const loginPwdSet = () => {
            state.loginPwdPop = false
            router.push({
                name: 'SetLoginPwd'
            })
        }
        // 下次设置登录密码
        const loginPwdSetNext = () => {
            state.loginPwdPop = false
            loginToPath()
        }
        // 设置登录密码不再提醒
        const noTip = () => {
            localSet('loginPwdIgnore', true)
            state.loginPwdPop = false
            loginToPath()
        }

        // 获取三方登录配置
        store.dispatch('_base/getLoginConfig')

        // ip没权限。跳转受限页面
        watch(() => accessFlag.value, val => {
            if (val) router.replace('/noAccess')
        }, {
            immediate: true
        })

        onMounted(() => {
            if (route.query.loginType) {
                state.loginType = route.query.loginType
            }
        })
        return {
            ...toRefs(state),
            changeLoginType,
            countryList,
            tabActiveChange,
            loginNameTypeChange,
            zoneSelect,
            loginHandle,
            topRightClick,
            verifyCodeSendHandler,
            loginPwdSetNext,
            loginPwdSet,
            noTip,
            loginSubmit,
            checkUserMfa,
            getGooleVerifyCode,
            thirdLoginArr,
            businessConfig,
            accessFlag
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    padding-top: rem(110px);
    background: var(--contentColor);
    .logo {
        display: inline-block;
        padding-left: rem(30px);
        margin-bottom: rem(10px);
        img {
            width: rem(180px);
        }
    }
    .page-title {
        padding-left: rem(30px);
        font-size: rem(40px);
        font-weight: bold;
        .openType2 {
            color: var(--primary);
        }
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .support {
        position: absolute;
        bottom: rem(30px);
        width: rem(300px);
        left: 50%;
        margin-left: rem(-150px);
        color: var(--placeholdColor);
        font-size: rem(20px);
        line-height: rem(32px);
        text-align: center;
        img {
            width: 100%;
        }
    }
    .account-type {
        display: flex;
        align-items: center;
        justify-content: center;
        height: rem(76px);
        margin: rem(60px) rem(30px) rem(60px);
        padding: 0 rem(10px);
        border-radius: rem(8px);
        border: solid 1px var(--primary);
        color: var(--primary);
        &.openType2 {
            border: solid 1px var(--color);
            color: var(--color);
        }
        .ac-item {
            width: 100%;
            text-align: center;
        }
        .btn {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            height: rem(58px);
            color: var(--minorColor);
            font-size: rem(28px);
            background: none;
            border-radius: rem(36px);
            cursor: pointer;
            &:hover {
                color: var(--primary);
            }
        }
        .active {
            color: var(--primary);
            font-weight: bold;
            background: #FFF;
        }
    }
}
.openTypeTab {
    padding: rem(40px) rem(30px) 0 rem(30px);
    width: 50%;

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
.icon_icon_close_big {
    position: absolute;
    top: rem(30px);
    left: rem(30px);
    color: var(--color);
    font-size: rem(34px);
}
.loginForm {
    margin: rem(45px) rem(30px) rem(50px);
    .field {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 rem(10px);
        border: solid 1px var(--lineColor);
        border-radius: rem(8px);
        &:not(:first-of-type) {
            margin-top: rem(45px);
        }
        &.toolWrap {
            justify-content: space-between;
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
        &.field-google {
            height: 100%;
            :deep(.form-item) {
                border: none;
                margin-bottom: 0;
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
    }
    .forget-bar {
        text-align: right;
        margin-top: rem(20px);
        >a {
            color: var(--primary);
        }
    }
    .loginBtn {
        width: 100%;
        height: rem(100px);
        margin-top: rem(60px);
        color: #FFF;
        font-size: rem(30px);
        line-height: rem(80px);
        background: var(--primary);
        border-radius: rem(8px);
        &.light {
            margin-top: rem(40px);
            color: var(--primary);
            background: none;
        }
    }
}
.tools {
    font-size: rem(26px);
    // margin-top: rem(50px);
    text-align: center;
    .line {
        margin: 0 1em;
        color: var(--minorColor);
    }
}
.three-way-login {
    margin-top: rem(100px);
    padding: 0 rem(30px);
    .title {
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--placeholdColor);
        margin-bottom: rem(20px);
        .text {
            padding: 0 rem(30px);
        }
        &::after {
            background: #E9EBF2;
            content: '';
            flex: 1;
            height: 1px;
        }
        &::before {
            background: #E9EBF2;
            content: '';
            flex: 1;
            height: 1px;
        }
    }
    .otherLogin {
        text-align: center;
        display: flex;
        justify-content: space-evenly;
        width: rem(470px);
        margin: rem(30px) auto 0;
    }
}
.footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    .icon_icon_service {
        font-size: 1.2em;
        vertical-align: middle;
    }
}
.toolBtns {
    display: flex;
    justify-content: space-between;
    margin-top: rem(30px);
    text-align: center;
    .btn {
        @include active();
        color: var(--color);
        vertical-align: middle;
        >a {
            color: var(--primary);
        }
    }
}
.popContainer {
    position: relative;
    width: 80vw;
    background: var(--contentColor);
    border-radius: 8px;
    .kycTimeLine {
        padding: rem(60px);
    }
    .containerBox {
        padding: rem(80px) rem(60px);
    }
    .tipContent {
        font-size: rem(28px);
        line-height: 1.5;
        text-align: center;
    }
    .iconPwd {
        padding-bottom: rem(35px);
        text-align: center;
    }
    .icon_password {
        color: var(--primary);
        font-size: rem(60px);
    }
    .noTip {
        position: absolute;
        top: rem(20px);
        right: rem(20px);
        color: var(--minorColor);
    }
    .btnBox {
        position: relative;
        display: flex;
        color: var(--color);
        font-size: rem(34px);
        text-align: center;
        background: var(--contentColor);
        border-top: 1px solid var(--lineColor);
        &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1px;
            height: rem(50px);
            background: var(--lineColor);
            transform: translateY(-50%);
            content: '';
        }
        .btn {
            @include active();
            flex: 1;
            height: rem(100px);
            line-height: 1;
            background: none;
        }
    }
}
</style>
