<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <div class='pageTitle'>
                <!-- <h5 v-if='openAccountType===1' class='opentype1'>
                    {{ $t('register.businessOpen') }}
                </h5> -->
                <h5 class='opentype2'>
                    {{ $t("register.welcomeRegister") }}MagnaMarkets
                </h5>
            </div>
            <div class='content' :class="inAnimation?'anim':''" @animationend='inAnimation=false'>
                <!-- <div class='logo'>
                    <img alt='' src='/images/logo_vitamin.png' srcset='' />
                </div> -->

                <van-tabs
                    v-model:active='openType'
                    class='openTypeTab'
                    @click-tab='countryListVis=false'
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
                    <!-- <div v-show="openType==='mobile'" class='cell'>
                        <el-select
                            v-model='countryVal'
                            class='select-conuntry'
                            :filter-method='filterZone'
                            filterable
                            :placeholder='$t("auth.countrySelect")'
                            @change='zoneOnSelect'
                            @visible-change='zoneOnBlur'
                        >
                            <el-option
                                v-for='item in filterList'
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
                    </div> -->
                    <div v-if="openType === 'mobile'" class='cell'>
                        <areaInputPc
                            v-model.trim='mobile'
                            v-model:zone='zone'
                            clear
                            :country-code='countryCode'
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
                            ga-class='pc_signup_code_ga'
                            :label='$t("login.verifyCode")'
                            :loading='verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <div v-show="openType === 'email'" class='cell verifyCodeCell'>
                        <CheckCode
                            v-model.trim='emailCheckCode'
                            clear
                            ga-class='pc_signup_code_ga'
                            :label='$t("login.verifyCode")'
                            :loading='verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <!--  推荐人id  -->
                    <!-- <template v-if='openAccountType === 0'>
                        <div class='invite-item' @click='inviteVis=!inviteVis'>
                            <span>{{ $t("register.referrerID") }}</span>
                            <el-icon size='18'>
                                <CaretTop v-if='inviteVis' />
                                <CaretBottom v-else />
                            </el-icon>
                        </div>

                        <div v-if='inviteVis' class='cell customNo_cell'>
                            <el-input
                                v-model.trim='customerNo'
                                class='customNo'
                                :clear='!customerNoIsDisabled'
                                :disabled='customerNoIsDisabled'
                                :placeholder='$t("register.referrerID")'
                            />
                        </div>
                    </template> -->
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
                        class='registerBtn pc_signup_ga'
                        :disabled='loading'
                        icon='/images/icon-register.png'
                        @click='registerHandler'
                    >
                        {{ $t('c.register') }}
                    </van-button>
                </div>
                <div class='to-login'>
                    {{ $t('login.goLogin') }}
                    <router-link to='/login'>
                        {{ $t('login.loginBtn') }}
                    </router-link>
                </div>
                <third-login v-if='openAccountType === 0' />
                <!-- <div
                    v-if='companyCountryVisible'
                    class='businessOpen'
                    :class='{ openType2: openAccountType===1 }'
                    @click='changeOpentype'
                >
                    <a class='businessOpenBtn' href='javascript:;'>
                        {{ openAccountType===0 ? $t('register.businessOpen') : $t("register.openAccount") }}
                    </a>
                </div> -->
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
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet, localSet, guid, getCookie, getDefaultZoneIndex, localGet, localSetObj } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend, geoipCountry } from '@/api/base'
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
import { ElMessage } from 'element-plus'
import { activityRegister } from '../../api/activity'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import { CaretBottom, CaretTop } from '@element-plus/icons'

export default {
    components: {
        topNav,
        areaInputPc,
        CheckCode,
        Loading,
        userLayoutFooter,
        thirdLogin,
        CaretBottom,
        CaretTop
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
            customerNo: '', // 推荐人客户编号
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
            emailToken: '',
            mobileToken: '',
            filterValue: '', // 搜索内容
            ipCountry: '', // 当前IP对应的国家
            defaultCountry: '', // 根据语言获取到的默认国家
            filterList: [], // 搜索列表
            inviteVis: false,
            theme: localGet('invertColor'),
            inAnimation: false
        })
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }

        // pageConfig('Register').then(res => {
        //     state.pageui = res
        // })
        // 获取国家区号
        watch([() => store.state.countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
            if (value[0] && value[0].length) {
                const countryList = value[0]
                const defaultZone = value[1]
                const index = getDefaultZoneIndex(countryList, defaultZone?.code)
                const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
                if (defaultZoneConfig?.code) {
                    state.defaultCountry = defaultZoneConfig
                    state.countryVal = defaultZoneConfig.code
                    state.zone = `${defaultZoneConfig.countryCode}`
                    state.countryCode = defaultZoneConfig.code
                    state.countryZone = defaultZoneConfig.countryCode
                }
                // findCountryByIP()
            }
        }, { immediate: true })

        const countryList = computed(() => {
            const countryList = store.state.countryList
            return state.openAccountType === 0 ? countryList : store.getters.companyCountryList
        })

        const style = computed(() => store.state.style)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )
        // 开户须知内容
        const instructions = computed(() => {
            const lang = locale.value
            const wpCompanyInfo = store.state._base.wpCompanyInfo || {}
            const protocol = wpCompanyInfo[lang === 'zh-CN' ? 'instructions_zh' : 'instructions_en']
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

        // 根据地址栏是否有ref字段(推荐id)判断是否禁用推荐客户id的输入框
        const customerNoIsDisabled = route.query.hasOwnProperty('ref')
        if (customerNoIsDisabled) state.customerNo = route.query.ref

        // 选择国家
        const zoneOnSelect = val => {
            const country = countryList.value.find(el => el.code === val)
            if (country) {
                state.zone = country.countryCode
                state.countryZone = country.countryCode
                state.countryCode = country.code
            }
        }

        const zoneOnBlur = (visible) => {
            if (visible === false) {
                state.filterValue = ''
            }
        }

        const registerSubmit = (params) => {
            state.loading = true
            // 系统注册成功的操作
            const successful = (res) => {
                // 注册成功
                sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: state.openType }))
                sessionStorage.setItem('RegisterData', JSON.stringify(res))
                if (state.openType === 'mobile') localSet('loginZone', state.countryZone)
                // 缓存注册信息
                localSet('loginInfo', JSON.stringify({
                    accountType: params.type,
                    loginName: params.loginName,
                    phoneArea: params.phoneArea || params.emailArea || '',
                }))
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
            }

            // 活动注册成功的操作
            const activityRegisterSuccessful = (res) => {
                if (res.check()) {
                    // 提示 注册成功，请登录
                    ElMessage({
                        message: t('register.registerSuccessful'),
                        type: 'success',
                    })
                    const loginTimer = setTimeout(() => {
                        router.replace({
                            path: '/login'
                        })
                        clearTimeout(loginTimer)
                    }, 1000)
                } else {
                    res.toast()
                }
            }

            if (params.customerNo) {
                activityRegister(params).finally(() => {
                    state.loading = false
                }).then(res => {
                    // 缓存注册信息
                    localSet('loginInfo', JSON.stringify({
                        accountType: params.type,
                        loginName: params.loginName,
                        phoneArea: params.phoneArea || params.emailArea || '',
                    }))
                    activityRegisterSuccessful(res)
                })
            } else {
                register(params).finally(() => {
                    state.loading = false
                }).then(res => {
                    successful(res)
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
                    lang: getCookie('lang'),
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
                    openAccountType: state.openAccountType
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
                        if (Number(res.data.status) === 1) {
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

        const zoneSelect = (data) => {
            state.countryVal = data.countryCode
            zoneOnSelect(data.countryCode)

            // state.countryZone = data.code
            // state.countryCode = data.countryCode
        }

        const filterZone = (value) => {
            value = value.toUpperCase()
            state.filterValue = value
        }

        const changeOpentype = () => {
            state.inAnimation = true
            state.openAccountType = state.openAccountType === 0 ? 1 : 0
        }

        watch([() => state.filterValue, countryList], (newVal) => {
            const value = newVal[0]
            const currentCountryList = newVal[1]
            const list = (!value) ? currentCountryList : currentCountryList.filter(el => {
                if ((el.code && el.code.toUpperCase().indexOf(value) !== -1) || (el.countryCode && el.countryCode.toUpperCase().indexOf(value) !== -1) || (el.displayName && el.displayName.toUpperCase().indexOf(value) !== -1)) {
                    return true
                } else {
                    return false
                }
            })
            state.filterList = list
        }, { immediate: true })

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
        //     state.countryVal = findCode.code
        //     zoneOnSelect(findCode.code)
        // }

        // getGeoipCountry()
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
            instructions,
            countryList,
            zoneOnSelect,
            zoneOnBlur,
            zoneSelect,
            companyCountryVisible,
            customerNoIsDisabled,
            filterZone,
            businessConfig,
            changeOpentype
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    overflow: auto;
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--primaryAssistColor);
    .container {
        //display: flex;
        //flex: 1;
        //align-items: center;
        //justify-content: center;
        // overflow: auto;
        padding: 40px 0;
        margin: 0 auto;
        .content {
            width: 520px;
            padding: 30px 60px;
            background-color: var(--contentColor);
            border-radius: 10px;
            /* 3D变形 */
            transform-style: preserve-3d;
            -webkit-perspective: 1000;
            -moz-perspective: 1000;
            -ms-perspective: 1000;
            perspective: 1000;
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
            .businessOpen {
                cursor: pointer;
                margin-top: 30px;
                border: solid 1px var(--primary);
                display: inline-block;
                width: 100%;
                line-height: 40px;
                text-align: center;
                border-radius: 4px;
                &.openType2 {
                    border: solid 1px var(--color);
                    .businessOpenBtn {
                        color: var(--color);
                    }
                }
                &:hover {
                    opacity: 0.5;
                }
                .businessOpenBtn {
                    display: inline-block;
                    color: var(--primary);
                    line-height: 1;
                }
            }
        }
    }
    .footerBtn {
        //height: 100px;
        margin-bottom: 20px;
        margin-top: 40px;
    }
    .to-login {
        text-align: center;
        >a {
            color: var(--primary);
        }
    }
}
.pageTitle {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 40px 0;
    h5 {
        font-weight: normal;
        color: var(--color);
        font-size: 24px;
        &.opentype1 {
            color: var(--primary);
        }
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
    margin-top: 34px;
}
.invite-item {
    cursor: pointer;
    margin-bottom: 10px;
    >span {
        vertical-align: middle;
        margin-right: 5px;
    }
    .el-icon {
        vertical-align: -4px;
    }
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
    &.customNo_cell {
        margin: 10px 0;
        .customNo {
            border: solid 1px var(--lineColor);
            border-radius: 4px;
            :deep(input) {
                height: 48px;
                background: none;
            }
        }
    }
    :deep {
        .inputWrapper {
            border: solid 1px var(--lineColor);
            border-radius: 4px;
            &:hover {
                border: solid 1px var(--primary);
            }
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
    width: 50%;

    --van-padding-md: 0;
    --van-tabs-card-height: 40px;
    :deep(.van-tabs__nav--line) {
        background-color: var(--contentColor);
    }
    :deep(.van-tabs__nav) {
        .van-tab {
            flex: none;
            margin: 0 10px;
            font-size: 16px;
        }
        .van-tabs__line {
            background: var(--primary);
        }
    }
    :deep(.van-tab) {
        margin-right: 20px;
        border-radius: 4px;
        line-height: 40px;
        border: none;
        .van-tabs__line {
            background: var(--primary);
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
    &:hover {
        opacity: 0.8;
    }
    :deep(.van-icon__image) {
        margin-right: 4px;
        width: 20px;
        height: 20px;
    }
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
        align-self: flex-start;
        margin-top: 1px;
        font-size: 16px;
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
            border: solid 1px var(--lineColor);
            &:hover {
                border: solid 1px var(--primary);
            }
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
body.night {
    .register {
        background: none;
    }
}
</style>
