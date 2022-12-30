<template>
    <div class='register'>
        <Top class='topBar' on-back @back='onBack' />
        <Loading :show='loading' />
        <div class='auth-content'>
            <!-- 授权成功 -->
            <div class='auth-success'>
                <div class='text'>
                    {{ $t('thirdRegister.tip1') }}
                </div>
                <div class='text'>
                    {{ thirdInfo.thirdSource }} {{ $t('thirdRegister.tip2') }}
                </div>
            </div>
            <div class='register-form'>
                <div class='tip'>
                    {{ $t('thirdRegister.bindAccountTips') }}
                </div>
                <div class='tabs'>
                    <div :class="{ 'item': true, 'active': openType === 'email' }" @click="switchTab('email')">
                        {{ $t('thirdRegister.safetyEmail') }}
                    </div>
                    <div :class="{ 'item': true, 'active': openType === 'mobile' }" @click="switchTab('mobile')">
                        {{ $t('thirdRegister.safetyPhone') }}
                    </div>
                </div>
                <!-- 邮箱 -->
                <div v-show="openType === 'email'">
                    <div class='block'>
                        <div class='label'>
                            {{ $t('register.email') }}
                        </div>
                        <div class='box'>
                            <InputComp
                                v-model.trim='email'
                                clear
                                :label='$t("common.inputEmail")'
                            />
                        </div>
                    </div>
                    <div class='block'>
                        <div class='label'>
                            {{ $t('login.verifyCode') }}
                        </div>
                        <div class='box'>
                            <CheckCode
                                v-model.trim='emailCheckCode'
                                clear
                                :label='$t("common.inputVerifyCode")'
                                :loading='verifyCodeLoading'
                                @show-count-down='handleCountdown'
                                @verifyCodeSend='verifyCodeSendHandler'
                            />
                        </div>
                    </div>
                </div>
                <!-- 手机 -->
                <div v-show="openType === 'mobile'">
                    <div class='block'>
                        <div class='label'>
                            {{ $t('register.phoneNo') }}
                        </div>
                        <div class='box'>
                            <areaInputPc
                                v-if='isPC'
                                ref='loginNameEl'
                                v-model.trim='mobile'
                                v-model:zone='zone'
                                block
                                :country-code='countryCode'
                                :placeholder="$t('common.inputPhone')"
                                @zoneSelect='zoneSelect'
                            />
                            <areaInput
                                v-else
                                ref='zoneSelectRef'
                                v-model.trim='mobile'
                                v-model:zone='zone'
                                :account-type='0'
                                clear
                                :country-code='countryCode'
                                :placeholder='$t("common.inputPhone")'
                                :show-select='true'
                                @zoneSelect='zoneSelect'
                            />
                        </div>
                    </div>
                    <div class='block'>
                        <div class='label'>
                            {{ $t('login.verifyCode') }}
                        </div>
                        <div class='box'>
                            <CheckCode
                                v-model.trim='mobileCheckCode'
                                clear
                                :label='$t("common.inputVerifyCode")'
                                :loading='verifyCodeLoading'
                                @show-count-down='handleCountdown'
                                @verifyCodeSend='verifyCodeSendHandler'
                            />
                        </div>
                    </div>
                </div>
                <!-- <div class='showTips' @click='showTipsAlert'>
                    未收到验证码
                </div> -->
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class='confirm-set' @click='onConfirm'>
            {{ $t('thirdRegister.confirmSet') }}
        </div>
    </div>
</template>

<script>
import { checkUserStatus, thirdRegist } from '@/api/user'
import { verifyCodeSend, getCountryListByParentCode } from '@/api/base'
import { reactive, toRefs, computed, getCurrentInstance, onMounted, onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { getDevice, getQueryVariable, sessionGet, localGetJSON, localRemove, getArrayObj, getDefaultZoneIndex, setToken } from '@/utils/util'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
import Schema from 'async-validator'
import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInput from './components/areaInput'
import areaInputPc from '@/components/form/areaInputPc'

import InputComp from '@/components/form/input'
export default {
    components: {
        Top,
        Loading,
        CheckCode,
        areaInput,
        InputComp,
        areaInputPc
    },
    setup () {
        const instance = getCurrentInstance()
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t, locale } = useI18n({ useScope: 'global' })
        const entrySearch = sessionGet('entrySearch')

        const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
        // 公司id
        const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)
        // 国家地区列表数据
        const countryList = computed(() => {
            return store.state.countryList
        })
        // 默认选择的国家地区
        const defaultCountry = computed(() => {
            const countryList = store.state.countryList
            const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
            const index = getDefaultZoneIndex(countryList, defaultZone?.code)
            const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
            return defaultZoneConfig
        })
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )

        const zoneSelectRef = ref(null)
        const state = reactive({
            // 页面加载效果
            loading: false,
            // cats返回的第三方信息
            thirdInfo: localGetJSON('thirdInfo') || {},
            zone: '',
            countryZone: '',
            countryCode: '',
            verifyCodeLoading: false,
            emailCheckCode: '',
            mobileCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            email: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            countrySheetVisible: false,
            country: {},
            allCountry: [], // 所有国家列表
            mobileToken: '',
            emailToken: '',
            isPC: window.isPC,
            showCountdown: false, // 是否展示未收到验证码链接
        })

        // 根据国家获取对应的客户组
        const getCustomerGroupIdByCountry = country => {
            if (!country || !registList.value?.length) return null
            let _resultGroup = registList.value.find(el => el.registCountry.code === country)
            if (!_resultGroup) _resultGroup = registList.value.find(el => el.registCountry.isOther)
            return _resultGroup
        }

        // 点击返回
        const onBack = () => {
            Dialog.confirm({
                title: t('tip'),
                message: t('thirdRegister.tip5'),
                confirmButtonText: t('thirdRegister.continue'),
                cancelButtonText: t('thirdRegister.back')
            }).then(() => {}).catch(() => {
                router.back()
            })
        }

        // 切换选项卡
        const switchTab = (value) => {
            state.openType = value
        }

        // 打开选择国家弹窗
        const showZoneSelect = () => {
            zoneSelectRef.value.handleVisible(true)
        }

        // 选择国家
        const zoneSelect = item => {
            if (state.isPC) {
                state.countryCode = item.nationalCode
                state.zone = item.code
                state.countryZone = item.code
            } else {
                state.countryCode = item.code
                state.zone = item.countryCode
                state.countryZone = item.countryCode
            }
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
                verifyParams.emailArea = defaultCountry.value.countryCode
            }

            const validator = new Schema(checkCustomerExistRule(t))
            state.verifyCodeLoading = true
            const params = {
                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                toUser: state.openType === 'mobile' ? state.countryZone + ' ' + state.mobile : state.email,
                country: state.openType === 'mobile' ? state.countryCode : defaultCountry.value.code
            }
            validator.validate(verifyParams, { first: true }).then(res => {
                // 发送验证码
                verifyCodeSend(params).then(res => {
                    state.verifyCodeLoading = false
                    if (res.check()) {
                        state.openType === 'mobile' ? state.mobileToken = res.data.token : state.emailToken = res.data.token
                        callback && callback()
                    } else {
                        callback && callback(false)
                    }
                })
            }).catch(({ errors, fields }) => {
                callback && callback(false)
                state.verifyCodeLoading = false
                if (errors) {
                    Toast(errors[0].message)
                }
            })

            // 产品mario.chen说发送验证码的时候验证手机号是否存在，在注册的时候判断，如果手机号存在提示绑定，如果不存在继续注册
        //     validator.validate(verifyParams, { first: true }).then(res => {
        //         // 检测客户是否存在,同时获取区号
        //         checkUserStatus(verifyParams).then(res => {
        //             if (res.check()) {
        //                 if (Number(res.data.status) !== 2) {
        //                     state.verifyCodeLoading = false
        //                     const msg = t(verifyParams.type === 1 ? 'common.existEmail' : 'common.existPhone')
        //                     callback && callback(false)
        //                     return Toast(msg)
        //                 } else {
        //                     // state.zone = res.data.phoneArea
        //                     const params = {
        //                         bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
        //                         toUser: state.openType === 'mobile' ? state.countryZone + ' ' + state.mobile : state.email,
        //                         country: state.openType === 'mobile' ? state.countryCode : defaultCountry.value.code
        //                     }
        //                     verifyCodeSend(params).then(res => {
        //                         state.verifyCodeLoading = false
        //                         if (res.check()) {
        //                             state.openType === 'mobile' ? state.mobileToken = res.data.token : state.emailToken = res.data.token
        //                             callback && callback()
        //                         } else {
        //                             callback && callback(false)
        //                         }
        //                     })
        //                 }
        //             }
        //         })
        //     }).catch(({ errors, fields }) => {
        //         callback && callback(false)
        //         state.verifyCodeLoading = false
        //         if (errors) {
        //             Toast(errors[0].message)
        //         }
        //     })
        }

        // 更新
        const handleCountdown = (flag) => {
            state.showCountdown = flag
        }

        // 点击确认按钮
        const onConfirm = () => {
            // 手机注册验证
            if (state.openType === 'mobile') {
                if (!state.mobile) {
                    return Toast(t('common.inputPhone'))
                }
                // 验证手机号是否匹配
                const reg = new RegExp(mobileReg.value)
                if (mobileReg.value && !reg.test(state.mobile)) {
                    return Toast(t('common.inputRealPhone'))
                }
                if (!state.mobileToken) {
                    return Toast(t('common.getVerifyCode'))
                }
                if (!state.mobileCheckCode) {
                    return Toast(t('common.inputVerifyCode'))
                }
            }
            // 邮箱注册验证
            if (state.openType === 'email') {
                if (!state.email) {
                    return Toast(t('common.inputEmail'))
                }
                if (!state.emailToken) {
                    return Toast(t('common.getVerifyCode'))
                }
                if (!state.emailCheckCode) {
                    return Toast(t('common.inputVerifyCode'))
                }
            }

            handleThirdRegist()
        }

        // 验证手机号邮箱是否存在
        const validatorUserStatus = () => {
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                protocol: state.protocol,
                mobileReg: new RegExp(mobileReg.value)
            }

            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = defaultCountry.value.countryCode
            }
            state.loading = true
            checkUserStatus(verifyParams).then(res => {
                if (res.check()) {
                    if (Number(res.data.status) === 1) {
                        const type = state.openType === 'mobile' ? t('register.phoneNo') : t('register.email')
                        const thirdSource = state.thirdInfo.thirdSource
                        const tipThirdSource = thirdSource.slice(0, 1).toUpperCase() + thirdSource.slice(1)
                        Dialog.confirm({
                            title: t('tip'),
                            message: t('login.registeredTips', [type, tipThirdSource]),
                            confirmButtonText: t('common.sure'),
                            cancelButtonText: t('common.cancel')
                        }).then(() => {
                            // 处理第三方注册
                            handleThirdRegist()
                        }).catch(() => {
                            state.loading = false
                        })
                    } else {
                        handleThirdRegist()
                    }
                }
            }).catch(({ errors, fields }) => {
                state.loading = false
                if (errors) Toast(errors[0].message)
            })
        }

        // 处理第三方注册
        const handleThirdRegist = () => {
            state.loading = true
            const country = state.openType === 'email' ? defaultCountry.value.code : state.countryCode
            state.customerGroupId = getCustomerGroupIdByCountry(country)?.customerGroupId
            const params = {
                companyId: companyId.value,
                userId: state.thirdInfo.userId,
                thirdSource: state.thirdInfo.thirdSource,
                customerGroupId: state.customerGroupId,
                country,
                verifyCode: state.openType === 'email' ? state.emailCheckCode : state.mobileCheckCode,
                sendToken: state.openType === 'email' ? state.emailToken : state.mobileToken,
                registerSource: getDevice(),
                utmSource: getQueryVariable('utm_source', entrySearch),
                utmMedium: getQueryVariable('utm_medium', entrySearch),
                utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                utmContent: getQueryVariable('utm_content', entrySearch),
                utmTerm: getQueryVariable('utm_term', entrySearch)
            }
            if (state.openType === 'email') {
                params.email = state.email
            } else {
                params.phone = state.mobile
                params.phoneArea = state.countryZone
            }
            thirdRegist(params).then(res => {
                state.loading = false
                if (res?.code === 'CUSTOMER_API_00010001') {
                    // 人工审核
                    router.replace({ name: 'RegisterHandler' })
                } else if (res.check()) {
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: 4 }))
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

                    if (res.data.list?.length > 0) {
                        // 需要KYC认证
                        sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                        router.replace(
                            {
                                path: window.isPC ? '/register/regKyc' : '/regKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
                    } else {
                        router.replace({ name: 'RegisterSuccess' })
                    }
                } else {
                    res.toast()
                }
            }).catch(err => {
                state.loading = false
            })
        }

        onMounted(() => {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode').then(() => {
                state.countryCode = defaultCountry.value.nationalCode
                state.zone = defaultCountry.value.countryCode
                state.countryZone = defaultCountry.value.countryCode
            })
        })

        onUnmounted(() => {
            // 删除缓存数据
            localRemove('thirdInfo')
        })

        return {
            ...toRefs(state),
            onBack,
            switchTab,
            zoneSelectRef,
            showZoneSelect,
            zoneSelect,
            verifyCodeSendHandler,
            onConfirm,
            getDevice,
            handleCountdown
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
}
.auth-content {
    padding: 0 rem(50px);
}
.auth-success {
    text-align: center;
    font-size: rem(30px);
    padding-top: rem(20px);
    padding-bottom: rem(40px);
    border-bottom: 1px solid var(--lineColor);
}
.register-form {
    padding-top: rem(30px);
    font-size: rem(28px);
    .tip {
        text-align: center;
        line-height: rem(40px);
    }
    .tabs {
        display: flex;
        justify-content: space-between;
        margin-top: rem(30px);
        margin-bottom: rem(30px);
        .item {
            display: inline-flex;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            width: calc(50% - 15px);
            height: rem(60px);
            background-color: var(--lineColor);
        }
        .active {
            color: #FFF;
            background-color: var(--primary);
        }
    }
    .block {
        margin-bottom: rem(30px);
        .label {
            margin-bottom: rem(12px);
        }
        .box {
            display: flex;
            align-items: center;
            color: var(--color);
            height: rem(80px);
            padding-left: rem(15px);
            border: 1px solid var(--lineColor);
            .checkCodeBar {
                &:hover {
                    border: none;
                }
            }
            &:deep {
                .mobileBar {
                    padding-right: rem(20px);
                    .zone-wrap {
                        width: 88px;
                        border: none;
                        border-right: solid 1px var(--lineColor);
                        height: 35px;
                        line-height: 35px;
                        .zone-text {
                            font-size: 12px;
                        }
                    }
                    .inputWrapper {
                        border: none;
                    }
                }
                .getCodeBtn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: rem(160px);
                    height: rem(80px);
                    padding: 0 rem(16px);
                    border-left: 1px solid var(--lineColor);
                }
            }
        }
    }
}
.confirm-set {
    position: absolute;
    cursor: pointer;
    left: rem(50px);
    right: rem(50px);
    bottom: rem(40px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: rem(90px);
    font-size: rem(30px);
    color: #FFF;
    background-color: var(--primary);
    border-radius: rem(10px);
}
</style>
