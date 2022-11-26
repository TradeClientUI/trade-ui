import { computed, ref, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { fundCalcApplyShares, fundApply, fundRedeem } from '@/api/fund'
import { Toast } from 'vant'
import { minus } from '@/utils/calculation'

export const orderHook = () => {
    const { t } = useI18n({ useScope: 'global' })
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)
    const calcLoading = ref(false)
    const { direction, fundId } = route.query
    let pageTitle = direction === 'buy' ? t('fundInfo.buy') : t('fundInfo.sell')
    pageTitle = t('fundInfo.fund') + pageTitle

    // 申购的时候表示支付资产，赎回的时候表示接受资产
    const activeCurrency = ref('')
    // 当前选择的资产数据
    const activeAssets = ref({})
    // 基金底层资产列表
    const fundAssetsList = ref([])
    // 现货玩法的账户列表
    const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5) || [])
    // 当前账户
    const curAccount = computed(() => accountList.value.find(el => el.currency === activeCurrency.value))
    // 单资产需要支付的资产
    const singleAssetsPay = ref(null)
    // 一篮子需要支付的资产
    const selfAssetsList = ref([])

    // 处理后需要支付的资产
    const lastAssetsPay = computed(() => {
        const result = []
        // 一篮子资产
        if (activeCurrency.value === 'self') {
            fundAssetsList.value.map(elem => {
                const item = {
                    currency: elem.currencyCode,
                    amountPay: '0.00',
                    isShow: false
                }
                const account = accountList.value.find(el => el.currency === item.currency)
                const payItem = selfAssetsList.value.find(el => el.currency === item.currency)
                item.available = account?.available || 0
                if (payItem) {
                    item.isShow = true
                    item.amountPay = payItem.amount
                    // 计算需要充值的金额
                    item.depositAmount = minus(item.amountPay, item.available)
                }
                result.push(item)
            })
        } else {
            // 单资产
            const item = {
                currency: activeCurrency.value,
                amountPay: '0.00',
                isShow: false
            }
            const account = accountList.value.find(el => el.currency === item.currency)
            const payItem = singleAssetsPay.value
            if (account && payItem) {
                item.isShow = true
                item.available = account.available
                item.amountPay = payItem.amountPay
                // 计算需要充值的金额
                item.depositAmount = minus(item.amountPay, item.available)
            }
            result.push(item)
        }
        return result
    })

    // 基金产品列表
    const fundProductList = computed(() => store.state._quote.fundProductList)
    if (!fundProductList.value.length) {
        store.dispatch('_quote/findFundPage')
    }

    // 基金产品信息
    const fund = computed(() => store.state._quote.fundInfo)
    const activeCurrencyList = computed(() => {
        const purchaseCurrencySetting = unref(fund)?.purchaseCurrencySetting ?? []
        const redemptionCurrencySetting = unref(fund)?.redemptionCurrencySetting ?? []
        const resultList = direction === 'buy' ? purchaseCurrencySetting : redemptionCurrencySetting
        return resultList
    })

    // 获取基金详情
    const queryFundInfo = () => {
        store.dispatch('_quote/queryFundInfo', fundId).then(res => {
            if (res.check()) {
                fundAssetsList.value = fund.value.fundCurrencyList
                activeCurrency.value = activeCurrencyList.value[0]?.currencyCode
                activeAssets.value = activeCurrencyList.value[0]
                updateAccountAssetsInfo(direction === 'buy' ? activeCurrency.value : res.data.shareTokenCode)
            }
        })
    }

    // 获取基金净值等数据
    const queryFundNetValue = () => {
        store.dispatch('_quote/fundNetValue', { fundId })
    }

    // 获取申购手续费
    const calcApplyShares = (val) => {
        getCalcApplyFee(val)
    }

    // 点击申购
    const submitFundApply = (params) => {
        loading.value = true
        return fundApply(params).then(res => {
            loading.value = false
            updateAccountAssetsInfo(activeCurrency.value)
            return res
        })
    }

    // 点击赎回
    const submitFundRedeem = (params) => {
        loading.value = true
        return fundRedeem(params).then(res => {
            loading.value = false
            updateAccountAssetsInfo(fund.value.shareTokenCode)
            return res
        })
    }

    // 选择支付资产、选择赎回方式
    const selectShow = ref(false)
    const selectActions = computed(() => {
        const resultList = activeCurrencyList.value.map(el => {
            return {
                ...el
            }
        })
        return resultList
    })
    const onSelect = (item) => {
        activeCurrency.value = item.currencyCode
        activeAssets.value = item
        updateAccountAssetsInfo(item.currencyCode)
        selectShow.value = false
    }

    // 更新单个资产详情
    const updateAccountAssetsInfo = (currency) => {
        const account = accountList.value.find(el => el.currency === currency)
        if (!account) return false
        store.dispatch('_user/queryAccountAssetsInfo', {
            tradeType: 5,
            accountId: parseInt(account.accountId)
        })
    }

    // 申购手续费,申购份额, 申购净值,手续费的币种,净值币种
    const getCalcApplyFee = (amountPay) => {
        if (!amountPay) {
            singleAssetsPay.value = null
            selfAssetsList.value = []
            return false
        }

        if (Number(amountPay) < Number(activeAssets.value.minPurchaseNum)) {
            singleAssetsPay.value = null
            selfAssetsList.value = []
            return Toast(t('fundInfo.applyMinTip') + activeAssets.value.minPurchaseNum)
        }
        calcLoading.value = true
        fundCalcApplyShares({
            amountPay,
            currencyPay: activeCurrency.value,
            fundId: parseInt(fundId),
            applyType: 2
        }).then(res => {
            calcLoading.value = false
            if (res.check()) {
                const { data } = res
                // 更新单个基金产品信息
                store.commit('_quote/Update_fundProduct', { netValue: data.sharesNet })
                if (activeCurrency.value === 'self') {
                    selfAssetsList.value = data.list || []
                } else {
                    singleAssetsPay.value = data
                }
            }
        })
    }

    // 获取基金详情
    queryFundInfo()
    // 获取基金净值等数据
    queryFundNetValue()
    // 获取账户信息
    store.dispatch('_user/findCustomerInfo', false)

    return {
        pageTitle,
        fund,
        fundAssetsList,
        lastAssetsPay,
        accountList,
        loading,
        calcLoading,
        queryFundNetValue,
        calcApplyShares,
        submitFundApply,
        submitFundRedeem,
        selectShow,
        selectActions,
        activeCurrency,
        activeAssets,
        curAccount,
        updateAccountAssetsInfo,
        onSelect
    }
}
