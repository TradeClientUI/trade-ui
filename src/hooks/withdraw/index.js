import {
    checkKycApply,
    withdrawCurrencyList,
    queryWithdrawConfig,
    computeWithdrawFee,
    queryWithdrawRate,
    handleWithdraw,
    queryBankList,
    getWithdrawCurrencyList as queryWithdrawWalletList,
    getWalletAddressList,
    queryWithdrawLimitInfo
} from '@/api/user'
import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
import { isEmpty } from '@/utils/util'

export default function withdraw ({ tradeType, accountId }) {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const router = useRouter()
    // 客户信息
    const customerInfo = computed(() => store.state._user.customerInfo)
    // businessConfig
    const businessConfig = computed(() => store.state.businessConfig)
    // 账户列表
    const accountCurrencyList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(unref(tradeType))))
    // 账户币种
    const accountCurrencyItem = computed(() => store.state._user.customerInfo.accountList?.find(el => el.accountId === Number(unref(accountId))) || {})
    const isMobile = process.env.VUE_APP_theme === 'plans'
    const gaClass = isMobile ? 'mobile_withdraw_kyc_ga' : 'pc_withdraw_kyc_ga'
    // kyc判断
    const checkKyc = () => {
        return checkKycApply({
            businessCode: 'withdraw',
            openAccountType: customerInfo.value.openAccountType
        }).then(res => {
            if (Number(res.data) !== 2) {
                Dialog.alert({
                    title: t('withdraw.hint'),
                    // 埋点类名
                    className: Number(res.data) !== 1 ? gaClass : '',
                    confirmButtonText: Number(res.data) === 1 ? t('withdraw.kycBtn_1') : t('withdraw.kycBtn_2'),
                    message: Number(res.data) === 2 ? t('withdraw.kycMsg_1') : t('withdraw.kycMsg_2'),
                }).then(() => {
                    if (window.isPC) {
                        router.replace({
                            path: '/withdrawAccount/authentication',
                            query: {
                                businessCode: 'withdraw'
                            }
                        })
                    } else {
                        router.replace({
                            name: 'Authentication',
                            query: {
                                businessCode: 'withdraw'
                            }
                        })
                    }
                })
                return false
            }
            return true
        })
    }
    // 提现币种
    const getWithdrawCurrencyList = () => {
        return withdrawCurrencyList({
            customerGroupId: customerInfo.value.customerGroupId,
            customerNo: customerInfo.value.customerNo,
            tradeType: unref(tradeType),
            accountId: unref(accountId),
        })
    }

    // 可用的提币币种和链名称列表
    const getWithdrawWalletList = (params) => {
        return queryWithdrawWalletList({
            customerGroupId: customerInfo.value.customerGroupId,
            customerNo: customerInfo.value.customerNo,
            country: customerInfo.value.country,
            accountCurrency: accountCurrencyItem.value.currency,
            tradeType: unref(tradeType),
            accountId: unref(accountId),
            ...params
        })
    }

    // 出金时间列表
    const getTimeList = (withdrawConfig) => {
        // 时间
        const weekdayMap = {
            1: t('weekdayMap.1'),
            2: t('weekdayMap.2'),
            3: t('weekdayMap.3'),
            4: t('weekdayMap.4'),
            5: t('weekdayMap.5'),
            6: t('weekdayMap.6'),
            7: t('weekdayMap.7')
        }
        const todayStr = window.dayjs().format('YYYY-MM-DD')
        const withdrawTimeConfigMap = {}
        if (!withdrawConfig) return withdrawTimeConfigMap
        withdrawConfig.withdrawTimeConfigList.forEach(el => {
            el.openTimeLocal = []
            withdrawTimeConfigMap[el.weekDay] = {
                weekDay: el.weekDay,
                openTime: el.openTime,
                openTimeLocal: []
            }
        })
        // 处理跨天逻辑
        for (const key in withdrawTimeConfigMap) {
            if (Object.hasOwnProperty.call(withdrawTimeConfigMap, key)) {
                const el = withdrawTimeConfigMap[key]
                if (!isEmpty(el.openTime)) {
                    const timeRange = el.openTime.split(',')
                    if (timeRange.length > 0) {
                        timeRange.forEach(timeRangeItem => {
                            const [start, end] = timeRangeItem.split('-')
                            const startLocal = window.dayjs.utc(`${todayStr} ${start}`).local()
                            const endLocal = window.dayjs.utc(`${todayStr} ${end}`).local()

                            // 第二天
                            const weekDay = key < 7 ? Number(key) + 1 : 1
                            let elNext = withdrawTimeConfigMap[weekDay]

                            if (!elNext) {
                                elNext = {
                                    openTimeLocal: [],
                                    weekDay
                                }
                                withdrawTimeConfigMap[weekDay] = elNext
                            }

                            if (startLocal.isAfter(todayStr, 'day')) {
                                elNext.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            } else if (endLocal.format('HH:mm') === '00:00') {
                                el.openTimeLocal.push(startLocal.format('HH:mm') + '-24:00')
                            } else if (endLocal.isAfter(todayStr, 'day')) {
                                elNext.openTimeLocal.unshift('00:00-' + endLocal.format('HH:mm'))
                                el.openTimeLocal.push(startLocal.format('HH:mm') + '-23:59')
                            } else if (el.openTime !== '00:00-00:00' || el.openTime !== '') {
                                el.openTimeLocal.push(startLocal.format('HH:mm') + '-' + endLocal.format('HH:mm'))
                            }
                        })
                    }
                }
            }
        }
        // 处理时间合并
        for (const key in withdrawTimeConfigMap) {
            if (Object.hasOwnProperty.call(withdrawTimeConfigMap, key)) {
                const el = withdrawTimeConfigMap[key]
                if (Array.isArray(el.openTimeLocal)) {
                    el.openTimeLocal.forEach((time, index) => {
                        const start = el.openTimeLocal[0].split('-')[0]

                        const end = time.split('-')[1]
                        const nextStart = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[0]
                        const nextEnd = el.openTimeLocal[index + 1] && el.openTimeLocal[index + 1].split('-')[1]

                        if (window.dayjs(`${todayStr} ${end}`).add(1, 'minute').isSame(window.dayjs(`${todayStr} ${nextStart}`)) ||
                            end === nextStart
                        ) {
                            el.openTimeLocal = start + '-' + nextEnd
                        }
                    })
                }
            }
        }
        const tempList = []
        if (!isEmpty(withdrawTimeConfigMap)) {
            for (const key in withdrawTimeConfigMap) {
                if (Object.hasOwnProperty.call(withdrawTimeConfigMap, key)) {
                    const item = withdrawTimeConfigMap[key]
                    if (!isEmpty(item.openTimeLocal)) {
                        tempList.push({
                            weekDay: weekdayMap[item.weekDay],
                            openTimeLocal: item.openTimeLocal
                        })
                    }
                }
            }
        }
        return tempList
    }
    // 获取出金限制配置
    const getWithdrawConfig = (params) => {
        return queryWithdrawConfig({
            companyId: customerInfo.value.companyId,
            customerNo: customerInfo.value.customerNo,
            customerGroupId: customerInfo.value.customerGroupId,
            country: customerInfo.value.country,
            tradeType: unref(tradeType),
            accountId: unref(accountId),
            ...params
        })
    }
    // 获取取款汇率
    const getWithdrawRate = (params) => {
        return queryWithdrawRate({
            companyId: customerInfo.value.companyId,
            customerNo: customerInfo.value.customerNo,
            customerGroupId: customerInfo.value.customerGroupId,
            country: customerInfo.value.country,
            tradeType: unref(tradeType),
            accountId: unref(accountId),
            ...params
        })
    }

    // 获取取款手续费
    const getWithdrawFee = (params) => {
        return computeWithdrawFee({
            companyId: customerInfo.value.companyId,
            customerNo: customerInfo.value.customerNo,
            customerGroupId: customerInfo.value.customerGroupId,
            country: customerInfo.value.country,
            tradeType: unref(tradeType),
            accountId: unref(accountId),
            ...params
        })
    }

    // 获取取款额度
    const getWithdrawLimitInfo = (params) => {
        return queryWithdrawLimitInfo({
            companyId: customerInfo.value.companyId,
            customerNo: customerInfo.value.customerNo,
            accountId: unref(accountId),
            customerGroupId: customerInfo.value.customerGroupId,
            country: customerInfo.value.country,
            ...params
        })
    }

    return {
        tradeType,
        accountId,
        accountCurrencyItem, // 当前账户信息
        accountCurrencyList, // 用户货币列表
        checkKyc, // kyc
        getWithdrawCurrencyList, // 获取出金币种
        getWithdrawConfig, // 出金配置
        getWithdrawRate, // 获取取款汇率
        getWithdrawFee, //  获取出金手续费
        queryBankList, //  获取第三方取款银行列表
        handleWithdraw, // 创建取款提案
        getTimeList, //  获取取款时间
        getWithdrawWalletList,
        getWalletAddressList, // 钱包列表
        getWithdrawLimitInfo,
        businessConfig
    }
}
