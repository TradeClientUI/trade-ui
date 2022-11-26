import { ref, computed } from 'vue'
import { getDaiPrice, getFundPrice, getSwapQuote } from '@/api/fundDEX'
import { useStore } from 'vuex'
import { formatAmount, toFixed, pow, mul, div, limitNumber, gt } from '@/utils/calculation'
import { UsePurchase } from '../../config/indexCoop-purchase'
import { baseSymbol, web3Hooks } from '@/plugins/web3/index'

export default () => {
    const store = useStore()
    const isH5 = process.env.VUE_APP_theme === 'plans'
    const {
        payCoinList,
        setCurChainId,
        getBalanceOf,
        allowance,
        allowanceApprove,
        indexCoop_purchase,
        getEthereumPayCoinListBalance
    } = UsePurchase()

    // 交易基金的数据
    const fundData = ref({})
    const setFund = data => (fundData.value = data)

    // 基金地址
    const fundAddress = computed(() => store.state._web3.chainId === 1 ? fundData.value.address : fundData.value.polygonAddress)

    // 交易行情数据
    const swapQuoteInfo = ref(null)

    // 交易类型，当前是申购或者赎回， purchase申购  withdraw赎回
    const swapType = ref('purchase')

    // 弹窗显示的时候重置某些数据
    const reset = (fund) => {
        setFund(fund)
        swapType.value = 'purchase'
        swapQuoteInfo.value = null

        // 先设置当前产品的ChainId
        console.log(fundData.value.chainId)
        setCurChainId(fundData.value.chainId)
        // 获取基金最新价格
        getFundPriceHandler()
    }
    // 支付币种转usd的汇率
    const usdRate = ref('0')
    // 基金转usd的汇率
    const fundUsdRate = ref('0')

    // 查询代币转usd的汇率
    const getDaiPriceHandler = (from) => {
        const address = from.symbol.toLowerCase() === 'eth' ? 'ethereum' : from.address
        getDaiPrice(fundData.value.chainId, address).then(res => {
            const addressTolower = address.toLowerCase()
            if (res && res[addressTolower]?.usd) {
                usdRate.value = res[addressTolower].usd
            }
        })
    }
    // 获取授权余额
    const queryAllowance = async (from) => {
        const daiAddress = swapType.value === 'purchase' ? from.value.address : fundAddress.value
        return allowance(fundData.value.chainId, swapQuoteInfo.value.to, daiAddress).then(res => {
            const amount = div(res, pow(10, 18))
            console.log(res, amount)
            return amount
        })
    }
    // 获取基金最新价格
    const getFundPriceHandler = () => {
        const address = fundData.value.chainId === 1 ? fundData.value.address : fundData.value.polygonAddress
        getFundPrice(fundData.value.chainId, address).then(res => {
            const addressLowerCase = address.toLowerCase()
            if (res?.[addressLowerCase]?.usd) {
                fundUsdRate.value = res[addressLowerCase].usd
            }
        })
    }
    // 额度授权
    const allowanceApproveHandler = (from, amount) => {
        const approveAddress = swapType.value === 'purchase' ? from.value.address : fundAddress.value
        const approveAmount = mul(amount, pow(10, 18))
        if (fundData.value.chainId === 137 && isH5) {
            // 手机上metamask app的额度授权也没有回调，暂时定为30s后当作正常回调执行
            return Promise.race([
                allowanceApprove(swapQuoteInfo.value.to, approveAddress, approveAmount),
                new Promise(function (resolve, reject) {
                    setTimeout(() => resolve(), 30000)
                })
            ])
        } else {
            return allowanceApprove(swapQuoteInfo.value.to, approveAddress, approveAmount)
        }
    }

    // 获取交易行情数据
    const querySwapQuote = (from, to, fromAmount) => {
        const payCurrency = swapType.value === 'purchase' ? from.value : to.value
        const { chainId } = store.state._web3
        const { address, polygonAddress } = fundData.value
        const { address: fromAddress, symbol: fromThirdCoinCode } = payCurrency
        const buyAddress = chainId === 1 ? address : polygonAddress
        const sellAddress = baseSymbol.includes(fromThirdCoinCode.toLowerCase()) ? fromThirdCoinCode : fromAddress
        let [buyToken, sellToken] = [buyAddress, sellAddress]
        if (swapType.value === 'withdraw') [sellToken, buyToken] = [buyAddress, sellAddress]

        return getSwapQuote({
            chainId,
            sellToken,
            buyToken,
            slippagePercentage: 0.03,
            sellAmount: mul(fromAmount.value, pow(10, from.value.decimals || 18)),
            affilliateAddress: '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'
            // takerAddress: store.state._web3.userAddress,
        }).then(async res => {
            res.minimumReceived = mul(res.guaranteedPrice, fromAmount.value)
            swapQuoteInfo.value = res
            return res
        })
    }

    // 交易
    const indexCoopPurchase = (...pramas) => {
        if (fundData.value.chainId === 137 && isH5) {
            return Promise.race([
                // 手机上metamask app的额度授权也没有回调，暂时定为30s后当作正常回调执行
                indexCoop_purchase(...pramas),
                new Promise(function (resolve, reject) {
                    setTimeout(() => resolve(), 30000)
                })
            ])
        } else {
            return indexCoop_purchase(...pramas)
        }
    }

    return {
        swapType,
        swapQuoteInfo,
        usdRate,
        fundUsdRate,
        payCoinList,
        getDaiPriceHandler,
        getBalanceOf,
        getEthereumPayCoinListBalance,
        reset,
        queryAllowance,
        indexCoopPurchase,
        querySwapQuote,
        allowanceApproveHandler,
    }
}
