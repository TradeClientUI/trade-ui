import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { web3Hooks } from '@/plugins/web3/index'
import { indexCoopHooks } from '@/plugins/web3/indexCoop'

// Ethereum的支付币种
export const EthereumPayCoinList = ref([
    {
        id: 1,
        address: '0x0000000000000000000000000000000000001010',
        symbol: 'ETH',
        symbolDesc: 'Ethereum',
        decimals: 18,
        balance: '0',
    },
    {
        id: 2,
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        symbolDesc: 'Dai',
        decimals: 18,
        balance: '0',
    },
    {
        id: 3,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        symbolDesc: 'USDC Coin',
        decimals: 6,
        balance: '0',
    },
    {
        id: 4,
        address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        symbol: 'stETH',
        symbolDesc: 'stETH',
        decimals: 18,
        balance: '0',
    },
])

// polygon的支付币种
export const PolygonPayCoinList = ref([
    {
        id: 1,
        address: '0x0000000000000000000000000000000000001010',
        symbol: 'MATIC',
        symbolDesc: 'Matic',
        decimals: 18,
        balance: '0',
    },
    {
        id: 2,
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        symbol: 'DAI',
        symbolDesc: 'Dai',
        decimals: 18,
        balance: '0',
    },
    {
        id: 3,
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        symbol: 'USDC',
        symbolDesc: 'USDC Coin',
        decimals: 6,
        balance: '0',
    },
    {
        id: 4,
        address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        symbol: 'WETH',
        symbolDesc: 'Wrapped Ether',
        decimals: 18,
        balance: '0',
    },
])

// 网络不对的时候重置balance
const resetBalance = () => {
    EthereumPayCoinList.value.forEach(el => {
        el.balance = '0'
    })
}

export const UsePurchase = () => {
    const store = useStore()
    const { getWalletBalance, getUserBalance } = web3Hooks()

    // 当前操作的产品的chainId
    const curChainId = ref(1)
    const setCurChainId = val => (curChainId.value = val)
    const { getChainBalance, getBalanceOf, allowance, indexCoop_purchase, allowanceApprove } = indexCoopHooks()

    const payCoinList = computed(() => {
        return curChainId.value === 1 ? EthereumPayCoinList.value : PolygonPayCoinList.value
    })

    // 获取coinListOrigin的代币的余额
    const getEthereumPayCoinListBalance = (chainId) => {
        const realChainIds = [1, 137] // indexCoop目前支持的链
        // const chainId = store.state._web3.chainId // 当前狐狸钱包支持的链
        if (realChainIds.indexOf(chainId) === -1) return resetBalance()
        const coinList = curChainId.value === 1 ? EthereumPayCoinList.value : PolygonPayCoinList.value
        const requestList = coinList.map(el => {
            return Promise.resolve().then(() => {
                return ['ETH', 'MATIC'].includes(el.symbol) ? getChainBalance(curChainId.value) : getWalletBalance(curChainId.value, el.address, el.decimals)
            }).then(res => {
                // console.log(el.symbolDesc, res)
                if (res) el.balance = res
                return el
            })
        })
        return Promise.allSettled(requestList)
    }

    return {
        payCoinList,
        getBalanceOf,
        allowance,
        indexCoop_purchase,
        allowanceApprove,
        setCurChainId,
        getEthereumPayCoinListBalance,
    }
}
