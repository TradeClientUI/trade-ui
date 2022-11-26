<template>
    <div class='textWrapper'>
        {{ data }}
        <div v-if='h5Preview'>
            <div class='container'>
                <p class='pageTitle'>
                    {{ $t('register.openAccount') }}
                </p>

                <div v-if='data.registerBanner' class='banner'>
                    <img
                        alt=''
                        :src='data.registerBanner'
                        :style='{ width:"100%",height:"96px" }'
                    />
                </div>
                <div v-if='Array.isArray(data.typeSupport) && data.typeSupport.length>0'>
                    <van-tabs
                        v-model:active='openType'
                        class='openTypeTab'
                        color='#333333'
                        line-height='2px'
                        line-width='20px'
                        :title-inactive-color='data.style?.mutedColor'
                    >
                        <van-tab v-if='data.typeSupport.indexOf("mobile")>-1' name='mobile' :title='$t("register.phoneNo")' />
                        <van-tab v-if='data.typeSupport.indexOf("email")>-1' name='email' :title='$t("register.email")' />
                    </van-tabs>
                    <form class='form'>
                        <!-- <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                        <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                        <div v-if="openType === 'mobile'" class='cell'>
                            <areaInput
                                v-model.trim='mobile'
                                v-model:zone='zone'
                                clear
                                :placeholder='$t("register.phoneNo")'
                                type='mobile'
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
                                type='email'
                                @zoneSelect='zoneSelect'
                            />
                        </div>
                        <div class='cell'>
                            <CheckCode v-model.trim='checkCode' clear :label='$t("login.verifyCode")' :loading='verifyCodeLoading' @verifyCodeSend='verifyCodeSendHandler' />
                        </div>
                        <div class='cell'>
                            <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                                {{ $t('register.protocol') }}
                            </van-checkbox>
                        </div>
                    </form>
                </div>
                <van-cell v-else>
                    <template #title>
                        <span :style="{ color: '#f56c6c' }">
                            请选择注册方式
                        </span>
                    </template>
                </van-cell>
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
        <Loading :show='loading' />

        <slot></slot>
    </div>
</template>

<script>
import Schema from 'async-validator'
import { reactive, toRefs, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CheckCode from '@/components/form/checkCode'
import areaInput from '@/components/form/areaInput'
import Loading from '@/components/loading'
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { Toast } from 'vant'
import RuleFn, { checkCustomerExistRule } from '@/themeCommon/user/register/rule'
import { setQuoteService } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import hooks from '@/themeCommon/user/register/hooks'
export default {
    components: {
        // Top,
        areaInput,
        CheckCode,
        Loading,
        // CurrencyAction,
        // TradeTypeAction,
    },
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    typeSupport: ['mobile'],

                }
            }
        },
    },
    // data () {
    //     return {
    //         openType: 'mobile',
    //     }
    // },
    computed: {
        typeSupport () {
            return this.data.typeSupport
        }
    },
    setup (props, b, c) {
        const h5Preview = process.env.VUE_APP_h5Preview
        const instance = getCurrentInstance()
        const delayer = null
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { getCustomerGroupIdByCountry, getPlansByCountry } = hooks()
        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '',
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            verifyCodeLoading: false,
            checkCode: '',
            mobile: '',
            openType: 'mobile', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 1,
            email: '',
            pageui: '',
            protocol: true,
            visited: false // 是否已点击过获取验证码
        })
        store.dispatch('getCountryListByParentCode')
        // const countryList = computed(() => store.state.countryList)
        // 获取国家区号
        // store.dispatch('getCountryListByParentCode').then(res => {
        //     if (res.check() && res.data.length) {
        //         const countryList = store.state.countryList
        //         const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
        //         const defaultZoneConfig = defaultZone ? countryList.find(el => el.code === defaultZone.code) : countryList[0]
        //         if (defaultZoneConfig?.code) {
        //             state.zone = `${defaultZoneConfig.name} (${defaultZoneConfig.countryCode})`
        //             state.countryZone = defaultZoneConfig.countryCode
        //             state.countryCode = defaultZoneConfig.code
        //         }
        //     }
        // })
        const countryList = computed(() => store.state.countryList)
        const style = computed(() => store.state.style)
        const zoneSelect = (data) => {
            state.countryZone = data.code
            state.countryCode = data.countryCode
        }
        let token = ''
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
            if (!token) {
                return Toast(t('common.inputRealVerifyCode'))
            }
            const params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName: state.openType === 'email' ? state.email : state.mobile,
                registerSource: getDevice(),
                verifyCode: state.checkCode,
                // currency: state.currency,
                // tradeType: state.tradeType,
                sendToken: token,
                utmSource: getQueryVariable('utm_source'),
                utmMedium: getQueryVariable('utm_medium'),
                utmCampaign: getQueryVariable('utm_campaign'),
                utmContent: getQueryVariable('utm_content'),
                utmTerm: getQueryVariable('utm_term'),
                protocol: state.protocol,
                tradeTypeCurrencyList: getPlansByCountry(state.countryCode),
                customerGroupId: getCustomerGroupIdByCountry(state.countryCode),
                country: state.countryCode
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
                                    token = res.data.token
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
        return {
            ...toRefs(state),
            registerHandler,
            verifyCodeSendHandler,
            zoneSelect,
            countryList,
            style,
            h5Preview
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.textWrapper {
    min-height: 10px;
}
    .container {
        flex: 1;
        overflow: auto;
    }
    .footerBtn {
        height: rem(100px);
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
    background: var(--primaryAssistColor);
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
</style>
