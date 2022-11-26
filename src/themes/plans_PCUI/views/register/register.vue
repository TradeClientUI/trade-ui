<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <div class='login-link'>
                    <router-link to='/login'>
                        {{ $t('register.hasAccount') }}
                    </router-link>
                </div>

                <div class='pageTitle'>
                    <h5>{{ openAccountType===1 ? $t('register.businessOpen') : $t("register.openAccount") }}</h5>
                </div>
                <div class='banner'>
                    <img alt='' src='https://testcms.ixmiddle.com/docs/registerBanner.png' srcset='' />
                </div>
                <van-tabs
                    v-model:active='openType'
                    class='openTypeTab'
                    :color='style.primary'
                    line-height='2px'
                    :title-inactive-color='style.mutedColor'
                >
                    <van-tab name='email' :title='$t("register.email")' />
                    <van-tab name='mobile' :title='$t("register.phoneNo")' />
                </van-tabs>

                <form class='form'>
                    <!-- <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                    <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                    <!-- <areaInputPc
                        v-model.trim='email'
                        v-model:zone='zone'
                        clear
                        input-type='text'
                        :placeholder='$t("register.email")'
                        type='business'
                        @zoneSelect='zoneSelect'
                    /> -->
                    <div class='cell'>
                        <el-select
                            v-model='countryVal'
                            class='select-conuntry'
                            :placeholder='$t("auth.countrySelect")'
                            @change='zoneOnSelect'
                        >
                            <el-option
                                v-for='item in countryList'
                                :key='item.code'
                                :label='item.displayName'
                                :value='item.code'
                            >
                                <span style='float: left;'>
                                    {{ item.displayName }}
                                </span>
                                <span
                                    style='float: right;'
                                >
                                    {{ item.countryCode }}
                                </span>
                            </el-option>
                        </el-select>
                    </div>

                    <div v-if="openType === 'mobile'" class='cell'>
                        <areaInputPc
                            v-model.trim='mobile'
                            v-model:zone='zone'
                            clear
                            :disabled='false'
                            :is-business='openAccountType === 1'
                            :placeholder='$t("common.inputPhone")'
                            type='mobile'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div v-else class='cell'>
                        <areaInputPc
                            v-model.trim='email'
                            v-model:zone='zone'
                            clear
                            :disabled='true'
                            input-type='text'
                            :is-business='openAccountType === 1'
                            :placeholder='$t("common.inputEmail")'
                            type='email'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div v-show="openType === 'mobile'" class='cell verifyCodeCell'>
                        <CheckCode
                            v-model.trim='mobileCheckCode'
                            clear
                            :label='$t("login.verifyCode")'
                            :loading='verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <div v-show="openType === 'email'" class='cell verifyCodeCell'>
                        <CheckCode
                            v-model.trim='emailCheckCode'
                            clear
                            :label='$t("login.verifyCode")'
                            :loading='verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <div v-if='instructions' class='cell'>
                        <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                            <span v-html='instructions'></span>
                        </van-checkbox>
                    </div>
                    <!-- <div class='cell'>
                        <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                            {{ $t('register.protocol') }}
                        </van-checkbox>
                    </div> -->
                </form>
                <div class='footerBtn'>
                    <van-button
                        block
                        class='registerBtn'
                        :disabled='loading'
                        @click='registerHandler'
                    >
                        {{ $t('common.submit') }}
                    </van-button>
                </div>
                <div v-if='companyCountryVisible' class='businessOpen'>
                    <a class='businessOpenBtn' href='javascript:;' @click='openAccountType=openAccountType===0 ? 1:0'>
                        {{ openAccountType===0 ? $t('register.businessOpen') : $t("register.openAccount") }}
                    </a>
                </div>
            </div>
        </div>
        <userLayoutFooter />
        <router-view />

        <Loading :show='loading' />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/components/userLayoutFooter'
import Schema from 'async-validator'
// import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInputPc from '@/components/form/areaInputPc'
// import CurrencyAction from './components/currencyAction'
// import TradeTypeAction from './components/tradeTypeAction'
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet, localSet } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend, findCompanyCountry, getCountryListByParentCode } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, computed, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { unescape } from 'lodash'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
// import { pageConfig } from '@/api/wpApi'
import { useI18n } from 'vue-i18n'
import hooks from './hooks'

export default {
    components: {
        topNav,
        areaInputPc,
        CheckCode,
        Loading,
        userLayoutFooter
        // CurrencyAction,
        // TradeTypeAction,
    },
    setup () {
        const instance = getCurrentInstance()
        const delayer = null
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const entrySearch = sessionGet('entrySearch')
        const { t, locale } = useI18n({ useScope: 'global' })
        const { getCustomerGroupIdByCountry, getPlansByCountry } = hooks()
        const { openAccountType } = route.query
        const businessConfig = computed(() => store.state.businessConfig)
        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '',
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            verifyCodeLoading: false,
            mobileCheckCode: '',
            emailCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 1,
            email: '',
            pageui: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            countryVal: '',
            openAccountType: 0, // 开户类型 0:个人 1.企业 默认为个人
            allCountry: [], // 所有国家列表
            emailToken: '',
            mobileToken: ''
        })
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }

        // pageConfig('Register').then(res => {
        //     state.pageui = res
        // })
        // 获取国家区号
        store.dispatch('getCountryListByParentCode').then(res => {
            if (res.check() && res.data.length) {
                const countryList = store.state.countryList
                const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
                const defaultZoneConfig = defaultZone?.code ? countryList.find(el => el.code === defaultZone.code) : countryList[0]
                if (defaultZoneConfig?.code) {
                    state.countryVal = defaultZoneConfig.code
                    state.zone = `${defaultZoneConfig.countryCode}`
                    state.countryCode = defaultZoneConfig.code
                    state.countryZone = defaultZoneConfig.countryCode
                }
            }
        })

        // 获取支持企业注册国家
        store.dispatch('getCompanyCountry')

        const countryList = computed(() => {
            const countryList = store.state.countryList
            return state.openAccountType === 0 ? countryList : store.getters.companyCountryList
        })

        const getAllCountry = () => {
            getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    state.allCountry = res.data
                }
            })
        }

        const style = computed(() => store.state.style)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )
        // 开户须知内容
        const instructions = computed(() => {
            const lang = locale.value || 'zh-CN'
            const instructionMap = {
                'zh-CN': 'instructions_zh',
                'en-US': 'instructions_en',
                'zh-HK': 'instructions_hk'
            }
            const wpCompanyInfo = store.state._base.wpCompanyInfo || {}
            const protocol = wpCompanyInfo[instructionMap[lang]]
            return protocol ? decodeURIComponent(unescape(protocol)) : ''
        })
        // 是否显示企业开户的入口
        const companyCountryVisible = computed(() => {
            if (!businessConfig.value.enterpriseLogin) return false
            if (state.openAccountType === 0) {
                return store.getters.companyCountryList.find(el => el.code === state.countryVal)
            } else {
                return countryList.value.find(el => el.code === state.countryVal)
            }
        })

        // 选择国家
        const zoneOnSelect = val => {
            const country = countryList.value.find(el => el.code === val)
            state.zone = country.countryCode
            state.countryZone = country.countryCode
            state.countryCode = country.code
        }

        const registerSubmit = (params) => {
            state.loading = true
            register(params).finally(() => {
                state.loading = false
            }).then(res => {
                // state.loading = false
                if (res.check()) {
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: state.openType }))
                    sessionStorage.setItem('RegisterData', JSON.stringify(res))
                    localSet('loginNameType', state.openType)
                    localSet('loginZone', state.countryZone)
                    localSet('phoneArea', state.countryZone)
                    if (res.data.token) setToken(res.data.token)

                    // 注册成功重新获取客户信息
                    store.dispatch('_user/findCustomerInfo')
                    // 重新登录清除账户信息
                    store.commit('_user/Update_accountAssets', {})
                    // 登录websocket
                    instance.appContext.config.globalProperties.$MsgSocket.login()

                    // 切换登录后的行情websocket
                    setQuoteService()

                    if (res.data.list.length > 0) {
                        // 需要KYC认证
                        sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                        // 判断是个人KYC还是企业KYC
                        if (params.openAccountType === 0) {
                            router.replace({
                                path: '/register/regKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
                        } else {
                            router.replace({
                                path: '/businessKYC'
                            })
                        }
                    } else {
                        router.replace({ name: 'RegisterSuccess' })
                    }
                } else {
                    res.toast()
                }
            })
        }

        // 提交注册
        const registerHandler = () => {
            clearTimeout(delayer)
            if (!state.visited) {
                return Toast(t('common.getVerifyCode'))
            }
            if ((state.openType === 'email' && !state.emailToken) || (state.openType === 'mobile' && !state.mobileToken)) {
                return Toast(t('common.inputRealVerifyCode'))
            }
            const params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName: state.openType === 'email' ? state.email : state.mobile,
                registerSource: getDevice(),
                verifyCode: state.openType === 'email'　? state.emailCheckCode : state.mobileCheckCode,
                // currency: state.currency,
                // tradeType: state.tradeType,
                sendToken: state.openType === 'email'　? state.emailToken : state.mobileToken,
                utmSource: getQueryVariable('utm_source', entrySearch),
                utmMedium: getQueryVariable('utm_medium', entrySearch),
                utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                utmContent: getQueryVariable('utm_content', entrySearch),
                utmTerm: getQueryVariable('utm_term', entrySearch),
                protocol: state.protocol,
                tradeTypeCurrencyList: getPlansByCountry(state.countryCode),
                customerGroupId: getCustomerGroupIdByCountry(state.countryCode),
                country: state.countryCode,
                openAccountType: state.openAccountType
            }

            if (state.openType === 'mobile') {
                params.phoneArea = String(state.countryZone)
            } else {
                params.emailArea = String(state.countryZone)
            }

            if (sessionGet('b_superiorAgent')) {
                params.thirdServerCode = sessionGet('b_superiorAgent')
                params.thirdServerSource = 'agent'
            }

            const validator = new Schema(RuleFn(t))
            validator.validate(
                { ...params, mobileReg: new RegExp(mobileReg.value) },
                { first: true }, (errors, fields) => {
                    if (errors) {
                        return Toast(errors[0].message)
                    }
                    registerSubmit(params)
                })
        }
        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            state.visited = true
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                protocol: state.protocol,
                mobileReg: new RegExp(mobileReg.value)

            }

            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = String(state.zone)
            }

            const validator = new Schema(checkCustomerExistRule(t))
            state.verifyCodeLoading = true
            validator.validate(verifyParams, { first: true }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) === 1) {
                            state.verifyCodeLoading = false
                            const msg = t(verifyParams.type === 1 ? 'common.existEmail' : 'common.existPhone')
                            callback && callback(false)
                            return Toast(msg)
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                toUser: state.openType === 'mobile' ? state.countryZone + ' ' + state.mobile : state.email,
                                country: state.countryCode
                            }
                            verifyCodeSend(params).then(res => {
                                state.verifyCodeLoading = false
                                if (res.check()) {
                                    state.openType === 'mobile' ? state.mobileToken = res.data.token : state.emailToken = res.data.token
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            })
                        }
                    }
                })
            }).catch(({ errors, fields }) => {
                callback && callback(false)
                state.verifyCodeLoading = false
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }

        const zoneSelect = (data) => {
            state.countryVal = data.countryCode
            zoneOnSelect(data.countryCode)

            // state.countryZone = data.code
            // state.countryCode = data.countryCode
        }

        onMounted(() => {
            const { mobile, email } = route.query
            if (mobile) {
                state.mobile = mobile
                state.openType = 'mobile'
            } else if (email) {
                state.email = email
                state.openType = 'email'
            }
            getAllCountry()
        })

        return {
            ...toRefs(state),
            registerHandler,
            verifyCodeSendHandler,
            style,
            instructions,
            countryList,
            zoneOnSelect,
            zoneSelect,
            companyCountryVisible,
            businessConfig
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--bgColor);
    .container {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        overflow: auto;
        .content {
            width: 550px;
            padding: 30px 60px 60px;
            background-color: var(--contentColor);
            border-radius: 10px;
            .login-link {
                margin-bottom: 20px;
                text-align: right;
            }
            .businessOpen {
                text-align: center;
                .businessOpenBtn {
                    display: inline-block;
                    color: var(--primary);
                    line-height: 1;
                    border-bottom: 1px solid var(--primary);
                }
            }
        }
    }
    .footerBtn {
        height: 100px;
    }
}
.pageTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0;
    h5 {
        color: var(--color);
        font-size: 32px;
        font-family: Microsoft YaHei;
    }
    a {
        color: var(--color);
        font-size: 14px;
    }
}
.banner {
    // margin-top: 60px;
    img {
        display: block;
        width: 100%;
    }
}
.form {
    margin-top: rem(30px);
}
.cell {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 20px 0;
    div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: 152px;
        margin-right: 10px;
    }
    :deep {
        .inputWrapper {
            background-color: var(--bgColor);
            border-radius: 4px;
            .input {
                width: 100%;
                height: 48px;
                padding: 0 16px;
                font-size: 16px;
            }
        }
        .van-hairline--bottom {
            &::after {
                border-bottom: none;
            }
        }
    }
    .select-conuntry {
        .el-input {
            font-size: 16px;
        }
        :deep(.el-input__inner) {
            height: 48px;
            font-size: 16px;
            line-height: 48px;
        }
    }
}
.openTypeTab {
    width: 40%;
    :deep(.van-tabs__nav--line) {
        background-color: var(--contentColor);
    }
    :deep(.van-tab) {
        .van-tab__text {
            color: var(--minorColor);
            font-size: 16px;
        }
        &.van-tab--active {
            .van-tab__text {
                color: var(--primary);
            }
        }
    }
}
:deep(.cellRow) {
    padding-top: rem(24px);
    padding-bottom: rem(24px);
}
.openTypeWrapper {
    :deep(.van-tabs__nav--card) {
        margin: 0;
        overflow: hidden;
        border-radius: rem(10px);
    }
}
.input {
    display: block;
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    font-size: rem(30px);
    line-height: 1;
    border: 1px solid var(--lineColor);
    border-radius: rem(10px);
}
.registerBtn {
    height: 48px;
    color: #FFF;
    font-size: 20px;
    background: var(--primary);
    border-color: var(--primary);
    border-width: 1px 0 0;
    border-radius: 4px;
}
.checkbox {
    //align-items: flex-start;
    :deep(.van-badge__wrapper) {
        width: 16px;
        height: 16px;
        overflow: hidden;
        font-size: 14px;
    }
    :deep(.van-checkbox__icon) {
        flex: none;
        height: 16px;
        font-size: 12px;
        line-height: 16px;
        background-color: var(--primary);
        border-color: var(--primary);
        border-radius: 4px;
        cursor: pointer;
    }
    :deep(.van-checkbox__label) {
        color: var(--placeholdColor);
        font-size: 14px;
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
