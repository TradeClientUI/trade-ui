<template>
    <router-view />
    <div class='login'>
        <topNav class='header' />
        <div class='login-wrap'>
            <div class='pageTitle'>
                <h5 v-if='accountType === 1' class='opentype1'>
                    {{ $t('login.welcomeLogin') }}MagnaMarkets
                </h5>
                <h5 v-if='accountType === 2' class='opentype2'>
                    {{ $t('login.loginByCorporate') }}
                </h5>
                <h5 v-if='accountType === 3' class='opentype3'>
                    {{ $t('login.loginByFund') }}
                </h5>
            </div>
            <div class='main' :class="inAnimation?'anim':''" @animationend='inAnimation=false'>
                <!-- <div class='logo'>
                <img alt='' src='/images/logo_vitamin.png' srcset='' />
            </div> -->

                <loginNameTypeBar v-model='loginNameType' />
                <form class='loginForm'>
                    <!-- <h2 class='loginTitle'>
                    {{ loginType==='password' ? $t("signIn.loginByPwd") : $t("signIn.loginByCode") }}
                </h2> -->
                    <div v-if="loginNameType==='mobile'" class='field'>
                        <areaInputPc
                            ref='loginNameEl'
                            v-model.trim='loginName'
                            v-model:zone='zone'
                            block
                            :country-code='countryCode'
                            :is-business='accountType === 2'
                            :placeholder="$t('common.inputPhone')"
                            @keyup.enter='onLoginNameKeyupEnter'
                            @onBlur='checkUserMfa'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div v-else class='field'>
                        <compInput
                            ref='loginNameEl'
                            v-model.trim='email'
                            block
                            :placeholder="$t('common.inputEmail')"
                            @keyup.enter='onLoginNameKeyupEnter'
                            @onBlur='checkUserMfa'
                        />
                    </div>
                    <div v-if="loginType==='password'" class='field'>
                        <compInput
                            ref='pwdEl'
                            v-model='pwd'
                            block
                            :placeholder="$t('signIn.pwd')"
                            type='password'
                            @keyup.enter='loginHandle'
                        />
                    </div>
                    <div v-else class='field'>
                        <div v-show="loginNameType==='email'" class='verifyCodeCell'>
                            <CheckCode
                                ref='checkCodeEmailEl'
                                v-model.trim='checkCodeEmail'
                                clear
                                :label='$t("login.verifyCode")'
                                :loading='sendVerifyLoading'
                                @verifyCodeSend='sendVerifyHandler'
                            />
                        </div>
                        <div v-show="loginNameType==='mobile'" class='verifyCodeCell'>
                            <CheckCode
                                ref='checkCodeMobileEl'
                                v-model.trim='checkCodeMobile'
                                clear
                                :label='$t("login.verifyCode")'
                                :loading='sendVerifyLoading'
                                @verifyCodeSend='sendVerifyHandler'
                            />
                        </div>
                    </div>
                    <div v-if='googleCodeVis' class='field field-google'>
                        <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                    </div>
                    <div class='forget-link'>
                        <router-link :to='{ path: "/forgot",query:{ type: "login" } }'>
                            {{ $t('signIn.forgot') }}?
                        </router-link>
                    </div>

                    <van-button block class='loginBtn' :disabled='loading' icon='/images/icon-register.png' @click='loginHandle'>
                        {{ $t('signIn.loginBtn') }}
                    </van-button>
                </form>
                <div class='linkBar'>
                    <div>
                        {{ $t('login.goRegister') }}
                        <router-link class='link pc_signin_signup_ga' to='/register'>
                            {{ $t('signIn.register') }}
                        </router-link>
                    </div>

                    <a class='switchLoginType' href='javascript:;' @click='switchLoginType'>
                        {{ loginType==='password' ? $t("signIn.loginByCode") : $t("signIn.loginByPwd") }}
                    </a>
                </div>
                <third-login v-if='accountType !== 2' />

                <!-- 登录账号类型 -->
                <!-- <div v-if='businessConfig.enterpriseLogin || businessConfig.fundLogin' class='account-type'>
                    <button v-if='accountType!==1' :class="['btn', { 'active': accountType === 1 }]" @click='changeLoginType(1)'>
                        {{ $t('login.loginByPersonal') }}
                    </button>
                    <button v-if='businessConfig.enterpriseLogin && accountType!==2' :class="['btn', { 'active': accountType === 2 }]" @click='changeLoginType(2)'>
                        {{ $t('login.loginByCorporate') }}
                    </button>
                    <button v-if='businessConfig.fundLogin && accountType !== 3' :class="['btn', { 'active': accountType === 3 }]" @click='changeLoginType(3)'>
                        {{ $t('login.loginByFund') }}
                    </button>
                </div> -->
            </div>
        </div>

        <div class='footer'>
            <!-- © 2021 Trade Switcher. All rights reserved -->
        </div>

        <!-- 设置登录密码弹窗 -->
        <LoginPwdDialog v-model='loginPwdPop' />

        <!-- 加载效果 -->
        <Loading :show='loading' />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import loginNameTypeBar from './loginNameTypeBar'
import compInput from '@planspc/components/form/input'
import areaInputPc from '@/components/form/areaInputPc'
import CheckCode from '@/components/form/checkCode'
import LoginPwdDialog from './loginPwdDialog.vue'
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { localGet, isEmpty, localSet, localGetJSON, getDefaultZoneIndex, localGetObj } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import LoginHook from './loginHook'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import { checkGoogleMFAStatus } from '@/api/user'

export default {
    name: 'Login',
    components: {
        LoginPwdDialog,
        loginNameTypeBar,
        topNav,
        compInput,
        CheckCode,
        areaInputPc,
        googleVerifyCode,
        thirdLogin
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const loginNameEl = ref()
        const pwdEl = ref()
        const checkCodeEmailEl = ref()
        const checkCodeMobileEl = ref()
        const { t } = useI18n({ useScope: 'global' })
        const businessConfig = computed(() => store.state.businessConfig)
        const state = reactive({
            loading: false,
            accountType: 1, // 账户登录方式 1.普通登录 2.基金经理
            pwdVisible: false,
            loginPwdPop: false,
            sendVerifyLoading: false,
            loginName: '',
            email: '',
            zone: '',
            pwd: '',
            googleCodeVis: '',
            checkCodeMobile: '',
            checkCodeEmail: '',
            token: '', // 验证码token
            loginNameType: 'email', // mobile 手机号登录   email 邮箱登录
            loginType: 'password', // password 密码登录   checkCode 验证码登录
            countryCode: '',
            theme: localGet('invertColor'),
            inAnimation: false
        })

        const countryList = computed(() => {
            return state.accountType === 2 ? store.getters.companyCountryList : store.state.countryList
        })

        // 检测客户是否开启GoogleMFA
        const checkUserMfa = (val) => {
            if (val) {
                const param = {
                    loginName: val,
                    type: state.loginNameType === 'email' ? 1 : 2
                }
                if (state.loginNameType === 'mobile') param.phoneArea = state.zone
                checkGoogleMFAStatus(param).then(res => {
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
            if (value[0] && value[0].length) {
                const allCountryList = value[0]
                const defaultZone = value[1]
                let index = -1
                const loginInfo = localGetJSON('loginInfo')
                if (loginInfo?.phoneArea) {
                    index = allCountryList.findIndex(el => el.countryCode === loginInfo.phoneArea)
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
                // 根据语言优先显示默认区号
                if (index === -1) {
                    index = getDefaultZoneIndex(allCountryList, defaultZone?.code)
                }
                const defaultZoneConfig = (index === -1) ? allCountryList[0] : allCountryList[index]
                if (defaultZoneConfig?.countryCode) {
                    state.zone = defaultZoneConfig.countryCode
                    state.countryCode = defaultZoneConfig.code
                }
                if (loginInfo?.loginName) {
                    checkUserMfa(loginInfo?.loginName)
                }
            }
        }, { immediate: true })

        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])

        const { loginSubmit, loginToPath, verifyCodeBtnText, sendVerifyCode } = LoginHook()

        watch(() => state.loginNameType, val => {
            state.pwd = ''
            const loginName = state.loginNameType === 'email' ? state.email : state.loginName
            if (loginName) {
                checkUserMfa(loginName)
            }
        })

        // 跳转路由
        const toRoute = path => {
            router.push('/home').then(() => {
                router.push('/home' + path)
            })
        }

        // 切换登录方式
        const switchLoginType = () => {
            state.loginType = state.loginType === 'password' ? 'checkCode' : 'password'
        }

        // 点击登录
        const loginHandle = () => {
            if (state.googleCodeVis && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            state.loading = true
            const params = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName,
                loginType: state.loginType,
                phoneArea: state.zone,
                checkCode: state.loginNameType === 'email' ? state.checkCodeEmail : state.checkCodeMobile,
                pwd: state.pwd,
                token: state.token,
                googleCode: state.googleCode
            }
            loginSubmit(params).then(res => {
                // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
                // companyKycStatus 公司KYC开户状态，1开启 2未开启
                if (res.invalid()) return res

                localSet('loginInfo', JSON.stringify({
                    accountType: params.type,
                    loginName: params.loginName,
                    phoneArea: params.phoneArea || '',
                }))

                const resData = res.data
                const lastAccountType = localGetObj('mockAccount', 'lastAccountType')
                const isReal = !lastAccountType || lastAccountType === 'real'
                if (isReal && Number(resData.companyKycStatus) === 1) {
                    if (Number(resData.kycAuditStatus === 0)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('login.goAuthenticate'),
                            message: t('login.goAuthenticateMsg'),

                        }).then(() => {
                            toRoute('/authentication')
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
                            toRoute('/authentication')
                        })
                    } else if (Number(resData.kycAuditStatus === 2)) {
                        noticeSetPwd(resData.loginPassStatus)
                    }
                } else if (Number(resData.companyKycStatus) === 2) {
                    noticeSetPwd(resData.loginPassStatus)
                }
            }).finally(() => {
                state.loading = false
            })
        }

        // 显示密码设置弹窗
        const noticeSetPwd = (loginPassStatus) => {
            const lastAccountType = localGetObj('mockAccount', 'lastAccountType')
            const isReal = !lastAccountType || lastAccountType === 'real'
            if (isReal && parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                state.loginPwdPop = true
            } else {
                loginToPath()
            }
        }

        // 发送验证码
        const sendVerifyHandler = (callback) => {
            const param = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName,
            }
            if (state.loginNameType === 'mobile') param.phoneArea = state.zone
            state.sendVerifyLoading = true
            sendVerifyCode(param).then(res => {
                if (res.check && res.check()) {
                    state.token = res.data.token
                    callback && callback()
                } else {
                    callback && callback(false)
                }
            }).catch(err => {
                callback && callback(false)
            }).finally(() => {
                state.sendVerifyLoading = false
            })
        }

        // 按键回车键
        const onLoginNameKeyupEnter = () => {
            console.log('onLoginNameKeyupEnter')
            if (state.loginType === 'password' && state.pwd === '') {
                const iputEl = pwdEl.value?.$el?.querySelector('input')
                iputEl && iputEl.focus()
            } else if (state.loginType === 'checkCode' && state.loginNameType === 'mobile' && state.checkCodeMobile === '') {
                const iputEl = checkCodeMobileEl.value?.$el?.querySelector('input')
                iputEl && iputEl.focus()
            } else if (state.loginType === 'checkCode' && state.loginNameType === 'email' && state.checkCodeEmail === '') {
                const iputEl = checkCodeEmailEl.value?.$el?.querySelector('input')
                iputEl && iputEl.focus()
            } else {
                console.log('调用登录')
            }
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 选择登录手机号区号
        const zoneSelect = (data) => {
            state.zone = data.code
            state.countryCode = data.countryCode
            if (state.loginName) checkUserMfa(state.loginName)
        }

        const changeLoginType = type => {
            state.accountType = type
            state.inAnimation = true
        }

        onMounted(() => {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
            // 获取支持企业注册国家
            store.dispatch('getCompanyCountry')
        })

        return {
            ...toRefs(state),
            loginHandle,
            switchLoginType,
            verifyCodeBtnText,
            sendVerifyHandler,
            zoneSelect,
            loginNameEl,
            pwdEl,
            checkCodeMobileEl,
            checkCodeEmailEl,
            thirdLoginArr,
            checkUserMfa,
            getGooleVerifyCode,
            onLoginNameKeyupEnter,
            businessConfig,
            changeLoginType
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login-wrap {
    position: relative;
    padding: 40px 0;
}
.pageTitle {
    margin: 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0;
    h5 {
        color: var(--color);
        font-size: 24px;
        font-weight: normal;
        &.opentype2 {
            color: var(--primary);
        }
        &.opentype3 {
            color: #EBB650;
        }
    }
    a {
        color: var(--color);
        font-size: 14px;
    }
}
.login {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    font-size: 14px;
    background: var(--primaryAssistColor);
    .footer {
        padding-bottom: 16px;
        color: var(--minorColor);
        font-size: 12px;
        text-align: center;
    }
    .main {
        width: 520px;
        margin: 0 auto;
        padding: 30px 60px;
        background: var(--contentColor);
        border-radius: 10px;
        &.anim {
            animation: showMsg 0.6s;
        }
        @keyframes showMsg {
            0% {
                transform: rotateY(0deg);
                opacity: 1;
            }
            50% {
                transform: rotateY(65deg);
                opacity: 0;
            }
            100% {
                transform: rotateY(0deg);
                opacity: 1;
            }
        }
        .logo {
            width: 100px;
            img {
                width: 100%;
            }
        }
    }
    .account-type {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        .btn {
            font-size: 14px;
            background: none;
            cursor: pointer;
            padding: 0 10px;
            border-right: solid 1px var(--placeholdColor);
            &:last-child {
                border: none;
            }
            &:hover {
                color: var(--primary);
                opacity: 0.8;
            }
            &.active {
                color: var(--primary);
                font-weight: bold;
                background: #FFF;
            }
        }
    }
}
.loginForm {
    margin-top: 34px;
    .field {
        margin-top: 20px;
        :deep(.pcInputBar) {
            border-radius: 4px;
            background: none;
            border: solid 1px var(--lineColor);
            &:hover,
            &:focus {
                border: solid 1px var(--primary);
            }
        }
        :deep(.pcInput) {
            font-size: 16px;
            padding: 0 16px;
        }
    }
    .forget-link {
        margin-top: 10px;
        text-align: right;
        display: inline-block;
        width: 100%;
        a {
            color: var(--primary);
        }
    }
    :deep(.field-google) {
        .form-item {
            border-radius: 4px;
            //background: var(--assistColor);
            border: solid 1px var(--lineColor);
            &:hover,
            &:focus {
                border: solid 1px var(--primary);
            }
        }
        .van-cell {
            height: 48px;
            padding-left: 20px;
            background: none;
            font-size: 16px;
            &::after {
                border-bottom: none;
            }
        }
        .paste {
            display: none;
        }
    }
    .loginTitle {
        font-weight: bold;
        font-size: 32px;
        line-height: 1;
    }
    .loginBtn {
        height: 48px;
        margin-top: 40px;
        font-size: 20px;
        border-radius: 4px;
        background: var(--primary);
        color: #FFF;
        &:hover {
            opacity: 0.8;
        }
        :deep(.van-icon__image) {
            margin-right: 4px;
            width: 20px;
            height: 20px;
        }
    }
    .verifyCodeBtn {
        width: 90px;
        margin-right: 8px;
        font-size: 14px;
        background: none;
        border: 0;
    }
}
.linkBar {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    a {
        color: var(--color);
    }
    .link {
        color: var(--primary);
    }
}
.verifyCodeCell {
    :deep {
        .checkCodeBar {
            border: solid 1px var(--lineColor);
            border-radius: 4px;
            &:hover {
                border: solid 1px var(--primary);
            }
            .checkCodeInput {
                font-size: 16px;
            }
            .getCodeBtn {
                margin: 0 18px;
                color: var(--primary);
                font-size: 16px;
                cursor: pointer;
                &:disabled {
                    color: var(--primary);
                    cursor: default;
                }
            }
            .input {
                width: 100%;
                height: 48px;
                padding: 0 5px;
                padding-left: 18px;
            }
        }
    }
}
body.night {
    .login {
        background: none;
    }
}
</style>
