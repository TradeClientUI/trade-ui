<template>
    <div class='login'>
        <topNav class='header' />

        <div class='main'>
            <!-- 登录账号类型 -->
            <div v-if='businessConfig.enterpriseLogin || businessConfig.fundLogin' class='account-type'>
                <button :class="['btn', { 'active': accountType === 1 }]" @click='accountType = 1'>
                    <!-- {{ $t('signIn.defaultLogin') }} -->
                    {{ $t('login.loginByPersonal') }}
                </button>
                <button v-if='businessConfig.enterpriseLogin' :class="['btn', { 'active': accountType === 2 }]" @click='accountType = 2'>
                    {{ $t('login.loginByCorporate') }}
                </button>
                <button v-if='businessConfig.fundLogin' :class="['btn', { 'active': accountType === 3 }]" @click='accountType = 3'>
                    {{ $t('signIn.fundLogin') }}
                </button>
            </div>
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
                <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                    {{ $t('signIn.loginBtn') }}
                </van-button>
            </form>
            <div class='linkBar'>
                <router-link to='/register'>
                    {{ $t('signIn.register') }}
                </router-link>
                <a class='switchLoginType' href='javascript:;' @click='switchLoginType'>
                    {{ loginType==='password' ? $t("signIn.loginByCode") : $t("signIn.loginByPwd") }}
                </a>
                <router-link :to='{ path: "/forgot",query:{ type: "login" } }'>
                    {{ $t('signIn.forgot') }}
                </router-link>
            </div>
            <div v-if='thirdLoginArr.length > 0' class='three-way-login'>
                <p class='title'>
                    {{ $t('login.otherLogin') }}
                </p>
                <div class='otherLogin'>
                    <LoginByGoogle v-if="thirdLoginArr.includes('google')" />
                    <LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />
                    <LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />
                </div>
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
import { localGet, isEmpty, localSet } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import LoginHook from './loginHook'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
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
        LoginByGoogle,
        LoginByFacebook,
        LoginByTwitter,
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
            zone: localGet('phoneArea') || '',
            pwd: '',
            googleCodeVis: '',
            checkCodeMobile: '',
            checkCodeEmail: '',
            token: '', // 验证码token
            loginNameType: localGet('loginNameType') || 'email', // mobile 手机号登录   email 邮箱登录
            loginType: 'password', // password 密码登录   checkCode 验证码登录
        })

        // 获取国家区号
        store.dispatch('getCountryListByParentCode').then(res => {
            if (res.check() && res.data.length) {
                setDefaultZone()
            }
        })
        const countryList = computed(() => store.state.countryList)
        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])

        const { loginSubmit, loginToPath, verifyCodeBtnText, sendVerifyCode } = LoginHook()

        // 监听个人登录还是企业登录,设置不同国家列表
        watch(() => state.accountType, val => {
            setDefaultZone()
        })

        watch(() => state.loginNameType, val => {
            state.pwd = ''
        })

        // 设置默认区号
        const setDefaultZone = () => {
            const localArea = localGet('phoneArea')
            let localObj
            if (state.accountType === 2) {
                localObj = store.getters.companyCountryList.find(el => el.countryCode === localArea)
                state.zone = localObj ? localArea : store.getters.companyCountryList[0]?.countryCode
            } else {
                localObj = countryList.value.find(el => el.countryCode === localArea)
                state.zone = localObj ? localArea : countryList.value[0]?.countryCode
            }
        }

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
                localSet('loginNameType', state.loginNameType)
                localSet('phoneArea', state.zone)

                if (Number(res.data.companyKycStatus) === 1) {
                    if (Number(res.data.kycAuditStatus === 0)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('login.goAuthenticate'),
                            message: t('login.goAuthenticateMsg'),

                        }).then(() => {
                            toRoute('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 1)) {
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
                    } else if (Number(res.data.kycAuditStatus === 3)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.reSubmit'),
                            message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                        }).then(() => {
                            toRoute('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 2)) {
                        noticeSetPwd(res.data.loginPassStatus)
                    }
                } else if (Number(res.data.companyKycStatus) === 2) {
                    noticeSetPwd(res.data.loginPassStatus)
                }
            }).finally(() => {
                state.loading = false
            })
        }

        // 显示密码设置弹窗
        const noticeSetPwd = (loginPassStatus) => {
            if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
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
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 选择登录手机号区号
        const zoneSelect = (data) => {
            state.zone = data.code
            if (state.loginName) checkUserMfa(state.loginName)
        }

        onMounted(() => {
            if (isEmpty(countryList.value) && !isEmpty(thirdLoginArr.value)) {
                // 获取国家区号
                store.dispatch('getCountryListByParentCode')
            }
            // 获取三方登录配置
            store.dispatch('_base/getLoginConfig')

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
            businessConfig
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 100%;
    font-size: 14px;
    background: var(--bgColor);
    .footer {
        padding-bottom: 16px;
        color: var(--minorColor);
        font-size: 12px;
        text-align: center;
    }
    .main {
        width: 520px;
        margin: 0 auto;
        padding: 40px 60px 60px;
        background: var(--contentColor);
        border-radius: 10px;
    }
    .account-type {
        display: flex;
        align-items: center;
        height: 44px;
        margin-bottom: 30px;
        padding: 0 2px;
        background: var(--assistColor);
        border-radius: 22px;
        .btn {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            height: 40px;
            color: var(--minorColor);
            font-size: 18px;
            background: none;
            border-radius: 20px;
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
.loginForm {
    margin-top: 34px;
    .field {
        margin-top: 24px;
        :deep(.pcInputBar) {
            border-radius: 4px;
        }
        :deep(.pcInput) {
            font-size: 16px;
        }
    }
    .field-google :deep() {
        .form-item {
            background: var(--assistColor);
        }
        .van-cell {
            padding-left: 20px;
            background: none;
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
}
.three-way-login {
    margin-top: 50px;
    .title {
        margin-bottom: 10px;
        color: var(--placeholdColor);
        text-align: center;
    }
    .otherLogin {
        display: flex;
        justify-content: space-evenly;
        width: 200px;
        margin: 15px auto 0;
        text-align: center;
    }
}
.verifyCodeCell {
    :deep {
        .checkCodeBar {
            background-color: var(--assistColor);
            border-bottom: none;
            border-radius: 4px;
            .checkCodeInput {
                font-size: 16px;
            }
            .getCodeBtn {
                margin: 0 18px;
                color: var(--primary);
                font-size: 16px;
                cursor: pointer;
                &:disabled {
                    color: var(--minorColor);
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
</style>
