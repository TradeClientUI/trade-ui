<template>
    <div class='register'>
        <Top class='topBar' :right-action='{ title:$t("register.hasAccount") }' @rightClick='$router.replace({ name:"Login" })' />
        <!-- <PageComp v-if='pageui' :data='pageui' /> -->
        <div class='container'>
            <p class='pageTitle'>
                {{ openAccountType===1 ? $t('register.businessOpen') : $t("register.openAccount") }}
            </p>
            <div class='banner'>
                <img v-if='registerBanner' alt='' :src='registerBanner' srcset='' />
            </div>
            <van-tabs
                v-model:active='openType'
                class='openTypeTab'
                :color='style.color'
                line-height='2px'
                line-width='20px'
                :title-inactive-color='style.mutedColor'
            >
                <van-tab name='email' :title='$t("register.email")' />
                <van-tab name='mobile' :title='$t("register.phoneNo")' />
            </van-tabs>

            <form class='form'>
                <!-- <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                <div class='cell'>
                    <a class='countryPlease van-hairline--bottom' @click='countrySheetVisible=true'>
                        <span>{{ country.displayName }}</span>
                        <van-icon name='arrow-down' />
                    </a>
                </div>

                <div v-if="openType === 'mobile'" class='cell'>
                    <areaInput
                        v-model.trim='mobile'
                        v-model:zone='zone'
                        :all-country='true'
                        clear
                        :data='countryList'
                        :placeholder='$t("register.phoneNo")'
                        :show-select='true'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-else class='cell'>
                    <areaInput
                        v-model.trim='email'
                        v-model:zone='zone'
                        clear
                        input-type='text'
                        :placeholder='$t("register.email")'
                        :zone-show='false'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-show="openType === 'mobile'" class='cell'>
                    <CheckCode v-model.trim='mobileCheckCode' clear :label='$t("login.verifyCode")' :loading='verifyCodeLoading' @verifyCodeSend='verifyCodeSendHandler' />
                </div>
                <div v-show="openType === 'email'" class='cell'>
                    <CheckCode v-model.trim='emailCheckCode' clear :label='$t("login.verifyCode")' :loading='verifyCodeLoading' @verifyCodeSend='verifyCodeSendHandler' />
                </div>
                <div v-if='instructions' class='cell'>
                    <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                        <span v-html='instructions'></span>
                    </van-checkbox>
                </div>
            </form>

            <div v-if='companyCountryVisible' class='businessOpen'>
                <a class='businessOpenBtn' href='javascript:;' @click='openAccountType=openAccountType===0 ? 1:0'>
                    {{ openAccountType===0 ? $t('register.businessOpen') : $t("register.openAccount") }}
                </a>
            </div>
        </div>
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

        <!-- 选择国家的弹窗 -->
        <CountrySheet v-model='countrySheetVisible' :data='countryList' @select='countrySelect' />

        <Loading :show='loading' />
    </div>
</template>

<script>
import Schema from 'async-validator'
import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInput from './components/areaInput'
import CountrySheet from './components/countrySheet'
// import CurrencyAction from './components/currencyAction'
// import TradeTypeAction from './components/tradeTypeAction'
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet, localSet } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend, findCompanyCountry, getCountryListByParentCode } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, computed, getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { unescape } from 'lodash'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
// import { pageConfig } from '@/api/wpApi'
import { useI18n } from 'vue-i18n'
import hooks from './hooks'

export default {
    components: {
        Top,
        areaInput,
        CheckCode,
        Loading,
        CountrySheet,
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
            emailCheckCode: '',
            mobileCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 1,
            email: '',
            pageui: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            openAccountType: 0, // 开户类型 0:个人 1.企业 默认为个人
            countrySheetVisible: false,
            country: {},
            allCountry: [], // 所有国家列表
            mobileToken: '',
            emailToken: ''
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
                    state.zone = defaultZoneConfig.countryCode
                    state.countryZone = defaultZoneConfig.countryCode
                    state.countryCode = defaultZoneConfig.code
                    state.country = defaultZoneConfig
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
        // 注册类型
        const registerTypes = computed(() => store.state._base.wpCompanyInfo?.registerTypes)
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
        // 注册页banner
        const registerBanner = computed(() => store.state._base.wpCompanyInfo?.registerBanner)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )

        const registerSubmit = (params) => {
            state.loading = true
            register(params).finally(() => {
                state.loading = false
            }).then(res => {
                // state.loading = false
                if (res?.code === 'CUSTOMER_API_00010001') {
                    // 人工审核
                    router.replace({ name: 'RegisterHandler' })
                } else if (res.check()) {
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: state.openType }))
                    sessionStorage.setItem('RegisterData', JSON.stringify(res))
                    if (params.phoneArea) localSet('loginPhoneArea', params.phoneArea)
                    localSet('loginNameType', params.loginNameType === 1 ? 'email' : 'mobile')

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
                        router.replace(
                            {
                                name: 'RegKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
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
                openAccountType: state.openAccountType,
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
                        if (Number(res.data.status) !== 2) {
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
            state.countrySheetVisible = true
        }

        // 是否显示企业开户的入口
        const companyCountryVisible = computed(() => {
            if (!businessConfig.value.enterpriseLogin) return false
            if (state.openAccountType === 0) {
                return store.getters.companyCountryList.find(el => el.code === state.country.code)
            } else {
                return store.state.countryList.find(el => el.code === state.country.code)
            }
        })

        // 选择国家
        const countrySelect = item => {
            state.country = item
            state.countryCode = item.code // 国家code
            state.zone = item.countryCode
            state.countryZone = item.countryCode
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
            countryList,
            zoneSelect,
            registerTypes,
            instructions,
            registerBanner,
            companyCountryVisible,
            countrySelect,
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
    background: var(--contentColor);
    .topBar {
        height: rem(100px);
    }
    .container {
        flex: 1;
        overflow: auto;
    }
    .footerBtn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: rem(100px);
    }
}
.pageTitle {
    margin-bottom: rem(10px);
    padding: 0 rem(30px);
    font-size: rem(46px);
}
.banner {
    margin-top: rem(60px);
    padding: 0 rem(30px);
    img {
        display: block;
        width: 100%;
    }
}
.form {
    margin-top: rem(30px);
    .countryPlease {
        display: flex;
        flex: 1;
        justify-content: space-between;
        padding: rem(20px) rem(6px);
    }
}
.cell {
    display: flex;
    justify-content: space-between;
    margin: rem(20px) rem(30px);
    div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: rem(200px);
        margin-right: rem(20px);
    }
}
.openTypeTab {
    width: 40%;
    margin: rem(60px) auto 0;
    :deep(.van-tabs__nav--line) {
        background: var(--contentColor);
    }
    :deep(.van-tab) {
        .van-tab__text {
            color: var(--minorColor);
        }
        &.van-tab--active {
            .van-tab__text {
                color: var(--color);
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
    height: rem(100px);
    color: var(--color);
    font-size: rem(30px);
    background: var(--bgColor);
    border-color: var(--lineColor);
    border-width: 1px 0 0;
}
.checkbox {
    :deep(.van-badge__wrapper) {
        width: rem(30px);
        height: rem(30px);
        overflow: hidden;
        font-size: rem(26px);
        line-height: rem(24px);
        border-radius: 100%;
    }
}
.businessOpen {
    margin-top: rem(80px);
    text-align: center;
    .businessOpenBtn {
        display: inline-block;
        color: var(--primary);
        font-size: rem(26px);
        line-height: 1;
        border-bottom: 1px solid var(--primary);
    }
}
</style>
