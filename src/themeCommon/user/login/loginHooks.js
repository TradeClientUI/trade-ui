// 处理登录逻辑
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { getDevice, localGet, localSet, getArrayObj, sessionGet, setToken } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { googleLoginVerify, facebookLoginVerify, twitterLoginVerify, thirdRegist } from '@/api/user'
import { Toast, Dialog } from 'vant'
import { setQuoteService } from '@/plugins/socket/socket'
export default function hooks (state) {
    const { t } = useI18n({ useScope: 'global' })
    const instance = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
    const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)

    // 处理与cats系统交互
    const handleCBLogin = (id_token) => {
        state.loading = true
        console.log('login come in ')
        let params, loginVerifyUrl
        if (state.loginType === 'google') {
            params = {
                idToken: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = googleLoginVerify
        } else if (state.loginType === 'facebook') {
            params = {
                accessToken: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = facebookLoginVerify
        } else if (state.loginType === 'twitter') {
            params = {
                authResponse: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = twitterLoginVerify
        }

        loginVerifyUrl(params).then(res => {
            state.loading = false
            if (res.check()) {
                var { action, failReason } = res.data
                state.userId = res.data.userId
                state.thirdSource = res.data.thirdSource

                if (action === 'register') {
                    state.bindAddShow = true
                } else if (action === 'login') {
                    handleThirdLogin()
                } else if (action === 'bind') {
                    Dialog.confirm({
                        title: t('tip'),
                        message: t('login.registered'),
                        confirmButtonText: t('common.sure'),
                        cancelButtonText: t('common.cancel')
                    }).then(() => {
                        router.push({
                            path: '/login',
                            query: {
                                bindThirdUserId: state.userId,
                                thirdSource: state.thirdSource
                            }
                        })
                    }).catch(() => {})
                } else {
                    Toast(failReason)
                }
            }
        }).catch(err => {
            state.loading = false
        })
    }

    // 处理三方登录
    const handleThirdLogin = () => {
        const params = {
            companyId: companyId.value,
            userId: state.userId,
            thirdSource: state.thirdSource,
            isThird: true // true为三方登录 false 系统登录
        }
        store.dispatch('_user/login', params).then(res => {
            if (res.invalid()) return false

            // 切换登录后的行情websocket
            setQuoteService()

            // 登录websocket
            instance.appContext.config.globalProperties.$MsgSocket.login()
            store.commit('del_cacheViews', 'Home')
            store.commit('del_cacheViews', 'Layout')

            // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
            // companyKycStatus 公司KYC开户状态，1开启 2未开启
            // checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
            const { companyKycStatus, kycAuditStatus } = res.data
            if (Number(companyKycStatus) === 1) {
                if (Number(kycAuditStatus === 0)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('login.goAuthenticate'),
                        message: t('login.goAuthenticateMsg'),

                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(kycAuditStatus === 1)) {
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
                } else if (Number(kycAuditStatus === 3)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('common.reSubmit'),
                        message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(kycAuditStatus === 2)) {
                    loginToPath()
                }
            } else if (Number(companyKycStatus) === 2) {
                loginToPath()
            }
        })
    }

    const handleThirdRegist = () => {
        // 处理注册
        state.loading = true
        const params = {
            companyId: companyId.value,
            userId: state.userId,
            thirdSource: state.thirdSource,
            customerGroupId: state.customerGroupId,
            country: state.country
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

                if (res.data.list.length > 0) {
                    // 需要KYC认证
                    sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                    router.replace(
                        {
                            name: 'RegKyc',
                            query: { levelCode: res.data.list[0].levelCode }
                        })
                } else {
                    router.replace({ name: 'Home' })
                }
            } else {
                res.toast()
            }
        }).catch(err => {
            state.loading = false
        })
    }

    // 选择国家
    const onSelectCountry = (country) => {
        // 调后台注册接口
        state.country = country.countryCode
        state.customerGroupId = getCustomerGroupIdByCountry(country.countryCode)?.customerGroupId
        state.bindAddShow = false
        handleThirdRegist()
    }

    // 根据国家获取对应的客户组
    const getCustomerGroupIdByCountry = country => {
        if (!country || !registList.value?.length) return null
        let _resultGroup = registList.value.find(el => el.registCountry.code === country)
        if (!_resultGroup) _resultGroup = registList.value.find(el => el.registCountry.isOther)
        return _resultGroup
    }

    // 登录成功跳转
    const loginToPath = () => {
        const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
        router.replace(toURL)
    }

    // 国家地区列表
    const areaActions = computed(() => {
        const countryList = store.state.countryList
        const tempArr = []
        countryList.forEach(item => {
            tempArr.push({
                name: item.name + ' (' + item.countryCode + ')',
                code: item.countryCode,
                countryCode: item.code,
                countryName: item.name
            })
        })
        return tempArr
    })

    return {
        handleCBLogin,
        onSelectCountry,
        areaActions

    }
}
