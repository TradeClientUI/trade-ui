<template>
    <Top class='topBar' />
    <LayoutTop :menu='false' :show-title='false' :title='$t("route.mine")' />
    <div v-if='!accessFlag' class='register'>
        <!-- <PageComp v-if='pageui' :data='pageui' /> -->
        <div class='container'>
            <p class='pageTitle'>
                <span v-if='openAccountType===1' class='openType2'>
                    {{ $t('register.businessOpen') }}
                </span>
                <span v-else class='openType1'>
                    {{ $t("register.welcomeRegister") }}CATS
                </span>
            </p>
            <div class='banner'>
                <img v-if='registerBanner' alt='' :src='registerBanner' srcset='' />
            </div>
            <van-tabs
                v-model:active='openType'
                class='openTypeTab'
                :color='style.assistColor'
                line-height='2px'
                line-width='20px'
                :title-inactive-color='style.mutedColor'
                type='card'
            >
                <van-tab name='email' :title='$t("register.email")' />
                <van-tab name='mobile' :title='$t("register.phoneNo")' />
            </van-tabs>

            <form class='form'>
                <!-- <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                <!-- <div v-show='openType==="mobile"' class='cell'>
                    <a class='countryPlease van-hairline--bottom' @click='showZoneSelect'>
                        <span>{{ country.displayName }}</span>
                        <van-icon name='arrow-down' />
                    </a>
                </div> -->

                <div v-show="openType === 'mobile'" class='cell'>
                    <areaInput
                        ref='zoneSelectRef'
                        v-model.trim='mobile'
                        v-model:zone='zone'
                        :account-type='openAccountType'
                        clear
                        :country-code='countryCode'
                        :placeholder='$t("register.phoneNo")'
                        :show-select='true'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-show="openType === 'email'" class='cell'>
                    <InputComp
                        v-model.trim='email'
                        clear
                        :label='$t("register.email")'
                    />
                </div>
                <div v-show="openType === 'mobile'" class='cell'>
                    <CheckCode
                        v-model.trim='mobileCheckCode'
                        clear
                        ga-class='mobile_signup_code_ga'
                        :label='$t("login.verifyCode")'
                        :loading='verifyCodeLoading'
                        @verifyCodeSend='verifyCodeSendHandler'
                    />
                </div>
                <div v-show="openType === 'email'" class='cell'>
                    <CheckCode
                        v-model.trim='emailCheckCode'
                        clear
                        ga-class='mobile_signup_code_ga'
                        :label='$t("login.verifyCode")'
                        :loading='verifyCodeLoading'
                        @verifyCodeSend='verifyCodeSendHandler'
                    />
                </div>
                <!-- <template v-if='openAccountType === 0'>
                    <div v-if='customerNoIsDisabled' class='cell van-hairline--bottom'>
                        <p class='isdisabled'>
                            {{ customerNo }}
                        </p>
                    </div>

                    <div v-else class='invite-wrap'>
                        <p class='text' @click='inviteVis = !inviteVis'>
                            <span> {{ $t("register.referrerID") }}</span>
                            <van-icon :name='inviteVis ? "arrow-up" : "arrow-down"' />
                        </p>
                        <div v-if='inviteVis' class='cell'>
                            <input
                                v-model='customerNo'
                                class='customNo'
                                :placeholder='$t("register.referrerID")'
                            />
                        </div>
                    </div>
                </template> -->

                <div v-if='instructions' class='instructions'>
                    <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                        <span v-html='instructions'></span>
                    </van-checkbox>
                </div>
                <div class='footerBtn'>
                    <van-button
                        block
                        class='registerBtn mobile_signup_ga'
                        :disabled='loading'
                        @click='registerHandler'
                    >
                        {{ $t('register.registerBtn') }}
                    </van-button>
                </div>
                <div class='to-login'>
                    {{ $t('login.goLogin') }}
                    <router-link to='/login'>
                        {{ $t('login.loginBtn') }}
                    </router-link>
                </div>
            </form>
        </div>

        <third-login v-if='openAccountType===0' />
        <div
            v-if='companyCountryVisible'
            class='businessOpen'
            :class='{ openType2: openAccountType===1 }'
        >
            <a class='businessOpenBtn' href='javascript:;' @click='openAccountType=openAccountType===0 ? 1:0'>
                {{ openAccountType===0 ? $t('register.businessOpen') : $t("register.openAccount") }}&nbsp;&nbsp;>>
            </a>
        </div>

        <Loading :show='loading' />
    </div>
</template>

<script>
import Schema from 'async-validator'
import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInput from './components/areaInput'
import InputComp from '@/components/form/input'
// import CurrencyAction from './components/currencyAction'
// import TradeTypeAction from './components/tradeTypeAction'
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet, localSet, guid, getDefaultZoneIndex, localSetObj } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend, geoipCountry } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, computed, getCurrentInstance, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { unescape } from 'lodash'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
// import { pageConfig } from '@/api/wpApi'
import { useI18n } from 'vue-i18n'
import hooks from './hooks'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import { activityRegister } from '../../../themes/plans/api/activity'

export default {
    components: {
        Top,
        areaInput,
        CheckCode,
        Loading,
        InputComp,
        thirdLogin
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
            openAccountType: Number(route.query.openAccountType) || 0, // 开户类型 0:个人 1.企业 默认为个人
            countrySheetVisible: false,
            country: {},
            allCountry: [], // 所有国家列表
            mobileToken: '',
            emailToken: '',
            customerNo: '', // 推荐人客户编号
            ipCountry: '', // 当前IP对应的国家
            defaultCountry: '', // 根据语言获取到的默认国家
            inviteVis: false
        })
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }

        const zoneSelectRef = ref(null)
        // 初始化区号
        watch([() => store.state.countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
            if (value[0] && value[0].length) {
                const countryList = value[0]
                const defaultZone = value[1]
                const index = getDefaultZoneIndex(countryList, defaultZone?.code)
                const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
                if (defaultZoneConfig?.code) {
                    state.defaultCountry = defaultZoneConfig
                    state.zone = defaultZoneConfig.countryCode
                    state.countryZone = defaultZoneConfig.countryCode
                    state.countryCode = defaultZoneConfig.code
                    state.country = defaultZoneConfig
                }
                // findCountryByIP()
            }
        }, { immediate: true })

        const accessFlag = computed(() => store.state._base.accessFlag)

        const countryList = computed(() => {
            return state.openAccountType === 0 ? store.state.countryList : store.getters.companyCountryList
        })

        const style = computed(() => store.state.style)
        // 注册类型
        const registerTypes = computed(() => store.state._base.wpCompanyInfo?.registerTypes)
        // 开户须知内容

        const instructions = computed(() => {
            const lang = locale.value
            const wpCompanyInfo = store.state._base.wpCompanyInfo || {}
            const protocol = wpCompanyInfo[lang === 'zh-CN' ? 'instructions_zh' : 'instructions_en']
            return protocol ? decodeURIComponent(unescape(protocol)) : ''
        })
        // 注册页banner
        const registerBanner = computed(() => store.state._base.wpCompanyInfo?.registerBanner)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )

        const registerSubmit = (params) => {
            state.loading = true
            if (params.customerNo) {
                // 活动注册成功接口
                activityRegister(params).finally(() => {
                    state.loading = false
                }).then(res => {
                    if (res.check()) {
                        // 缓存注册信息
                        const loginInfoParams = {
                            accountType: params.type,
                            loginName: params.loginName,
                        }
                        if (state.openType === 'mobile') loginInfoParams.phoneArea = params.phoneArea
                        localSet('loginInfo', JSON.stringify(loginInfoParams))

                        // 提示 注册成功，请登录
                        Toast.success('Registration successful, please login')

                        const loginTimer = setTimeout(() => {
                            router.replace({
                                path: '/login',
                                query: {
                                    loginType: 'checkCode'
                                }
                            })
                            clearTimeout(loginTimer)
                        }, 1000)
                    } else {
                        res.toast()
                    }
                })
            } else {
                // 系统注册接口
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

                        // 缓存注册信息
                        const loginInfoParams = {
                            accountType: params.type,
                            loginName: params.loginName,
                        }
                        if (state.openType === 'mobile') loginInfoParams.phoneArea = params.phoneArea
                        localSet('loginInfo', JSON.stringify(loginInfoParams))

                        if (res.data.token) setToken(res.data.token)

                        // 注册成功重新获取客户信息
                        store.dispatch('_user/findCustomerInfo')
                        localSetObj('mockAccount', 'lastAccountType', 'real')
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

            let params = {}
            const countryCode = state.openType === 'email' ? state.defaultCountry.code : state.countryCode
            // 判断是否填写了推荐id 设置不同的params
            if (state.customerNo) {
                params = {
                    checkVerifyCode: true,
                    companyId: sessionStorage.getItem('companyId'),
                    country: countryCode,
                    customerNo: state.customerNo,
                    lang: locale.value,
                    loginName: state.openType === 'email' ? state.email : state.mobile,
                    registerSource: getDevice(),
                    sendToken: state.openType === 'email' ? state.emailToken : state.mobileToken,
                    trace: guid(),
                    tradeTypeCurrencyList: getPlansByCountry(countryCode),
                    type: state.openType === 'email' ? 1 : 2,
                    verifyCode: state.openType === 'email' ? state.emailCheckCode : state.mobileCheckCode,
                    timestamp: new Date().getTime().toString(),
                    customerGroupId: getCustomerGroupIdByCountry(countryCode),
                    protocol: state.protocol
                }
            } else {
                params = {
                    type: state.openType === 'email' ? 1 : 2,
                    loginName: state.openType === 'email' ? state.email : state.mobile,
                    registerSource: getDevice(),
                    verifyCode: state.openType === 'email' ? state.emailCheckCode : state.mobileCheckCode,
                    // currency: state.currency,
                    // tradeType: state.tradeType,
                    sendToken: state.openType === 'email' ? state.emailToken : state.mobileToken,
                    utmSource: getQueryVariable('utm_source', entrySearch),
                    utmMedium: getQueryVariable('utm_medium', entrySearch),
                    utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                    utmContent: getQueryVariable('utm_content', entrySearch),
                    utmTerm: getQueryVariable('utm_term', entrySearch),
                    protocol: state.protocol,
                    tradeTypeCurrencyList: getPlansByCountry(countryCode),
                    customerGroupId: getCustomerGroupIdByCountry(countryCode),
                    country: countryCode,
                    openAccountType: state.openAccountType,
                }
            }

            if (state.openType === 'mobile') {
                params.phoneArea = String(state.countryZone)
            } else {
                params.emailArea = String(state.defaultCountry.countryCode)
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
                verifyParams.emailArea = String(state.defaultCountry.countryCode)
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
                            const countryCode = state.openType === 'email' ? state.defaultCountry.code : state.countryCode
                            const params = {
                                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                toUser: state.openType === 'mobile' ? state.countryZone + ' ' + state.mobile : state.email,
                                country: countryCode
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

        // 选择国家
        const showZoneSelect = () => {
            zoneSelectRef.value.handleVisible(true)
        }

        const zoneSelect = item => {
            state.country = item
            state.countryCode = item.code // 国家code
            state.zone = item.countryCode
            state.countryZone = item.countryCode
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

        // 根据地址栏是否有ref字段(推荐id)判断是否禁用推荐客户id的输入框
        const customerNoIsDisabled = route.query.hasOwnProperty('ref')
        if (customerNoIsDisabled) state.customerNo = route.query.ref

        // 根据IP获取当前国家
        // const getGeoipCountry = () => {
        //     geoipCountry().then(res => {
        //         if (res.code === '0' && res.data?.iso_code) {
        //             state.ipCountry = res.data
        //             findCountryByIP()
        //         }
        //     })
        // }

        // // 根据IP国家查找country
        // const findCountryByIP = () => {
        //     if (!state.ipCountry || countryList.value.length === 0) return
        //     const iso_code = state.ipCountry.iso_code
        //     const findCode = countryList.value.find(el => el.nationalCode.toLowerCase() === iso_code.toLowerCase())
        //     if (!findCode) return
        //     zoneSelect(findCode)
        // }

        // getGeoipCountry()

        // ip没权限。跳转受限页面
        watch(() => accessFlag.value, val => {
            if (val) router.replace('/noAccess')
        }, {
            immediate: true
        })

        onMounted(() => {
            const { mobile, email } = route.query
            if (mobile) {
                state.mobile = mobile
                state.openType = 'mobile'
            } else if (email) {
                state.email = email
                state.openType = 'email'
            }
            // 获取支持企业注册国家
            store.dispatch('getCompanyCountry')
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
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
            customerNoIsDisabled,
            businessConfig,
            zoneSelectRef,
            showZoneSelect,
            accessFlag
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    position: relative;
    // display: flex;
    // flex-flow: column;
    height: 100%;
    background: var(--contentColor);
    .topBar {
        height: rem(100px);
    }
    .container {
        overflow: auto;
        .logo {
            display: inline-block;
            padding-left: rem(30px);
            margin-bottom: rem(10px);
            img {
                width: rem(180px);
            }
        }
    }
}
.pageTitle {
    margin-bottom: rem(10px);
    padding: 0 rem(30px);
    font-size: rem(40px);
    font-weight: bold;
    .openType2 {
        color: var(--primary);
    }
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
    margin: rem(30px) 0 0;
    .footerBtn {
        width: 100%;
        margin-top: rem(60px);
        height: rem(100px);
        padding: 0 rem(30px);
        border-radius: rem(8px);
        margin-bottom: rem(40px);
    }
    .countryPlease {
        display: flex;
        flex: 1;
        justify-content: space-between;
        padding: rem(20px) rem(6px);
    }
    .to-login {
        text-align: center;
        >a {
            color: var(--primary);
        }
    }
}
.instructions {
    padding: 0 rem(30px);
}
.invite-wrap {
    margin-bottom: rem(40px);
    .text {
        color: var(--normalColor);
        padding: 0 rem(30px);
    }
}
.cell {
    display: flex;
    justify-content: space-between;
    margin: rem(20px) rem(30px) rem(46px) rem(30px);
    border: solid 1px var(--lineColor);
    border-radius: rem(8px);
    padding: 0 rem(20px);
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
    width: 50%;
    padding: 0 rem(30px) 0 rem(30px);

    --van-padding-md: 0;
    --van-tabs-card-height: 30px;
    :deep(.van-tabs__nav--line) {
        background: var(--contentColor);
    }
    :deep(.van-tabs__nav) {
        border: none;
    }
    :deep(.van-tab) {
        margin-right: rem(20px);
        border-radius: 4px;
        line-height: rem(40px);
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
    color: #FFF;
    font-size: rem(30px);
    background: var(--primary);
    border-width: 1px 0 0;
}
.checkbox {
    :deep {
        .van-checkbox__icon {
            align-self: flex-start;
            height: auto;
            margin-top: rem(4px);
        }
        .van-badge__wrapper {
            width: rem(30px);
            height: rem(30px);
            overflow: hidden;
            font-size: rem(26px);
            line-height: rem(24px);
            border-radius: rem(4px);
        }
    }
}
.businessOpen {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rem(76px);
    margin: rem(60px) rem(30px) rem(60px);
    padding: 0 rem(10px);
    border-radius: rem(8px);
    border: solid 1px var(--primary);
    &.openType2 {
        border: solid 1px var(--color);
        .businessOpenBtn {
            color: var(--color);
        }
    }
    .businessOpenBtn {
        display: inline-block;
        color: var(--primary);
        font-size: rem(26px);
        line-height: 1;
        width: 100%;
        text-align: center;
        //border-bottom: 1px solid var(--primary);
    }
}
.customNo {
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
}
.isdisabled {
    color: var(--minorColor);
    padding: 0 5px;
    height: 1rem;
    line-height: 1rem;
}
</style>
