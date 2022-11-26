import { ref } from 'vue'
import Web3, { utils } from 'web3'
import Web3Modal from 'web3modal'
import { getChainData } from './tools/tools'
import { providerOptions } from './tools/config'
import { abi_approve, abi_depositWithdraw, abi_depositWithdrawETH, abi_token } from '@/plugins/web3/abi'
import networkConfigs from './config/networkConfigs'
import BigNumber from 'bignumber.js'
import { getETHPrice } from '@/api/fundDEX'
import { useStore } from 'vuex'
import { localRemove, localSet, getDevice, sessionGet } from '@/utils/util'
import { divide, mul, plus, pow, toNonExponential } from '@/utils/calculation'
import { getBaseUrl } from '@/plugins/web3/config/infuraConfig.js'
import { ElMessage, ElMessageBox } from 'element-plus'

export let web3 = null
export let provider = null
export let web3Modal = null

export const assets = ref(0)

export const baseSymbol = ['eth', 'matic'] // 各个链的标准货币

const fetching = ref(false)
const loading = ref(false)

export const web3Hooks = () => {
    const store = useStore()
    const state = store.state._web3

    // 获取账户列表
    const getAccountAssets = async () => {
        fetching.value = true
        assets.value = await getUserBalance()
        store.commit('_web3/Update_userBalance', assets.value)
    }

    // 查询余额
    const getUserBalance = () => {
        if (!web3) return console.error('未连接钱包')
        loading.value = true
        return web3.eth
            .getBalance(store.state._web3.userAddress)
            .then((res) => {
                loading.value = false
                return utils.fromWei(res.toString(), 'ether') || 0
            })
    }

    // 链接狐狸钱包
    const executeConnect = async () => {
        // if (!window.ethereum) {
        //     return ElMessageBox.confirm(
        //         'This dapp requires access to your MetaMask wallet, go to install MetaMask wallet?',
        //         'Warning',
        //         {
        //             title: 'Login and authorize your wallet',
        //             confirmButtonText: 'OK',
        //             cancelButtonText: 'Cancel',
        //             type: 'warning',
        //         }
        //     )
        //         .then(() => {
        //             window.open('https://metamask.io/download/')
        //         })
        //         .catch(() => {

        //         })
        // }
        try {
            const device = getDevice()
            web3Modal = new Web3Modal({
                theme: 'light',
                network: getChainData(1).network,
                cacheProvider: true,
                providerOptions
            })
            let providerParam = {}
            if (device === 1) {
                providerParam = await web3Modal.connectTo('walletconnect')
            } else {
                providerParam = await web3Modal.connect()
            }
            await subscribeProvider(providerParam)
            web3 = new Web3(providerParam)
            const accounts = await web3.eth.getAccounts()
            const address = accounts[0]
            const networkId = await web3.eth.net.getId()
            const networkType = await web3.eth.net.getNetworkType()
            const chainId = await web3.eth.getChainId()

            window.web3 = web3
            window.web3utils = utils
            provider = providerParam

            store.commit('_web3/Update_userAddress', address)
            store.commit('_web3/Update_chainId', chainId)
            store.commit('_web3/Update_networkId', networkId.toString())
            store.commit('_web3/Update_networkType', networkType)
            localSet('walletProvider', 'injected')

            await getAccountAssets()

            return Promise.resolve()
        } catch (error) {
            console.log('=================', error)
            return Promise.reject()
        }
    }

    // 监听provider事件
    const subscribeProvider = async (provider) => {
        if (!provider.on) {
            return
        }
        provider.on('close', () => {
            store.commit('_web3/Empty_data')
            localRemove('walletProvider')
        })
        provider.on('accountsChanged', async (accounts) => {
            // eslint-disable-next-line prefer-destructuring
            store.commit('_web3/Update_userAddress', accounts[0])
            await getAccountAssets()
        })
        provider.on('chainChanged', async (_chainId) => {
            await getAccountAssets()
            const networkId = await web3.eth.net.getId()
            const networkType = await web3.eth.net.getNetworkType()
            const chainId = await web3.eth.getChainId()
            store.commit('_web3/Update_chainId', chainId)
            store.commit('_web3/Update_networkId', networkId.toString())
            store.commit('_web3/Update_networkType', networkType)
        })
    }

    // 断开app链接
    const disconnect = async () => {
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            web3.currentProvider.close().then(res => {
                console.log('disconnect', res)
            })
        }
        web3Modal.clearCachedProvider()
        store.commit('_web3/Empty_data')
        localRemove('walletProvider')
    }

    // 切换网络
    const switchNetwork = (value) => {
        return provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${value.toString(16)}` },
        ])
    }

    // 添加网络
    const addNetwork = (value) => {
        const { name, publicJsonRPCUrl } = networkConfigs[value]
        const chainId = utils.toHex(value)
        return provider.send('wallet_addEthereumChain', [{
            chainId,
            chainName: name,
            rpcUrls: publicJsonRPCUrl
        }])
    }

    // 添加代币到狐狸钱包
    const addToken = (address, name, decimals, iconUrl) => {
        const params = {
            type: 'ERC20',
            options: {
                address: address,
                symbol: name,
                decimals: decimals,
                image: iconUrl || 'https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png'
            }
        }

        return window.ethereum.request({ method: 'wallet_watchAsset', params })
    }

    /**
     * 查询代币的授权余额
     * 关于授权：
     * 存款的时候，除了eth之外的都需要用assetId授权，合约地址是 lendingPool
     * 提现的时候，所有的代币都需要用atoken检查授权，aweth用WETHGateway地址授权，其他代币用 lendingPool
     *
     * @param {string} daiAddress 在当前链上需要查询的代币地址 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @return {string} 代币的授权余额
     */
    const allowance = async (daiAddress, isETH) => {
        const state = store.state._web3
        const network = networkConfigs[state.networkId] || {}
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!network.lendingPool) return console.error('不支持该网络', state.networkId)
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xa61ca04df33b72b235a8a28cfb535bb7a5271b70'
        var WZGLToken = new web3.eth.Contract(abi_approve, daiAddress, {
            from
        })
        const aa = await WZGLToken.methods.allowance(from, isETH ? WETHGateway : lendingPool).call()
        return aa
    }

    /**
     * 代币存款授权
     *
     * @param {string} daiAddress 在当前链上需要查询的代币地址 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @param {string} value 授权额度(以太币单位)
     *
     */
    const depositApprove = (daiAddress, value = utils.toWei('2')) => {
        const state = store.state._web3
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!networkConfigs[state.networkId]?.lendingPool) return console.error('不支持该网络', state.networkId)
        const lendingPool = networkConfigs[state.networkId]?.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const WZGLToken = new web3.eth.Contract(abi_approve, daiAddress, {
            from
        })
        return WZGLToken.methods.approve(lendingPool, value).send()
    }

    /**
     * 代币存款
     *
     * @param {string} daiAddress 在当前链上需要查询的代币地址 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @param {string} value 存款额度(以太币单位)
     */
    const depositDAI = async (daiAddress, value) => {
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!value) return console.error('必须传入存款额度')
        const state = store.state._web3
        if (!networkConfigs[state.networkId]?.lendingPool) return console.error('不支持该网络', state.networkId)
        const lendingPool = networkConfigs[state.networkId]?.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const gas = await queryGasLimit(daiAddress, value, false, true)
        const WZGLToken2 = new web3.eth.Contract(abi_depositWithdraw, lendingPool, {
            from,
            gas
        })

        return WZGLToken2.methods.deposit(daiAddress, value, from, 0).send()
    }

    /**
     * ETH 存款
     *
     * @param {string} value 存款额度(以太币单位)
     *
     */
    const depositETH = (value) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xa61ca04df33b72b235a8a28cfb535bb7a5271b70'
        const WZGLToken = new web3.eth.Contract(abi_depositWithdrawETH, WETHGateway, {
            from,
        })

        return WZGLToken.methods.depositETH(lendingPool, from, 0).send({ value })
    }

    /**
     * 代币取款授权
     *
     * @param {string} aTokenAddress 代币的atoken地址 0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8
     * @param {string} value 取款授权额度(以太币单位)
     *
     */
    const withdrawApprove = (aTokenAddress, value = utils.toWei('2')) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WZGLToken = new web3.eth.Contract(abi_approve, aTokenAddress, {
            from
        })
        return WZGLToken.methods.approve(lendingPool, value).send()
    }

    /**
     * 代币取款
     *
     * @param {string} daiAddress 底层资产token 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @param {string} value 取款额度(以太币单位)
     *
     */
    const withdrawDAI = async (daiAddress, value) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const gas = await queryGasLimit(daiAddress, value, false, false)
        var WZGLToken2 = new web3.eth.Contract(abi_depositWithdraw, lendingPool, {
            from,
            gas
        })

        return WZGLToken2.methods.withdraw(daiAddress, value, from).send()
    }

    /**
     * ETH 提现授权
     * @param {string} aTokenAddress atoken地址
     * @param {string} value 取款授权额度(以太币单位)
     */
    const withdrawETHApprove = (aTokenAddress, value = utils.toWei('2')) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        var WZGLToken = new web3.eth.Contract(abi_approve, aTokenAddress, {
            from
        })
        return WZGLToken.methods.approve(WETHGateway, value).send()
    }

    /**
     * ETH 提现
     * @param {string} value 取款额度(以太币单位)
     */
    const withdrawETH = (value) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        const WZGLToken = new web3.eth.Contract(abi_depositWithdrawETH, WETHGateway, {
            from
        })

        return WZGLToken.methods.withdrawETH(lendingPool, value, from).send()
    }

    /**
     * 获取gasLimit
     */
    const getGasLimit = async (daiAddress, amount, isPurchase) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        const myContract = new web3.eth.Contract(abi_depositWithdraw, lendingPool)
        const type = isPurchase ? 'deposit' : 'withdraw'
        const params = isPurchase ? [daiAddress, amount, from, '0'] : [daiAddress, amount, from]
        const gas = await myContract.methods[type](...params).estimateGas({ from })
        console.log(gas)
        return gas
    }
    /**
     * 获取ETH gasLimit
     */
    const getGasLimitETH = async (daiAddress, amount) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        const myContract = new web3.eth.Contract(abi_depositWithdrawETH, WETHGateway)
        return myContract.methods.depositETH(lendingPool, from, 0).estimateGas({ from, value: amount })
    }

    /** 获取gasLimit
     * aave源码上 eth增加了 30%，polygon链增加了60%
     */
    const queryGasLimit = async (daiAddress, amount, isETH, isPurchase) => {
        const { chainId } = store.state._web3
        let gasLimit = isETH ? await getGasLimitETH(daiAddress, amount, isPurchase) : await getGasLimit(daiAddress, amount, isPurchase)
        if (chainId === 1 || chainId === 42) {
            gasLimit = plus(gasLimit, mul(gasLimit, 0.3))
        } else if (chainId === 137) {
            gasLimit = plus(gasLimit, mul(gasLimit, 0.6))
        }
        gasLimit = parseInt(gasLimit)
        return gasLimit
    }

    /**
     * 计算预估手续费
        1、获取gasPrice
        2、定义gasLimit
        3、消耗的ETH数量 = gasPrice * gasLimit / 18;
        4、得到的eth数量 * eth的价格 = 预估消耗的⼿续费
    */
    const estimateFee = async (daiAddress, amount, isETH, isPurchase = true) => {
        amount = amount.split('.')[0]
        const gasLimit = await queryGasLimit(daiAddress, amount, isETH, isPurchase)
        let gasPrice = await web3.eth.getGasPrice()
        gasPrice = utils.fromWei(gasPrice)
        console.log('gasLimit', gasLimit)
        // console.log('gasPrice', gasPrice, 'gasLimit', gasLimit)
        // const gasPrice = '0.000000056130521212'
        // const gasLimit = '279536'
        const ethNum = BigNumber(gasPrice).times(gasLimit).toString()
        const ethPriceResult = await getETHPrice()
        const ethPrice = ethPriceResult.ethereum.usd
        // console.log('ethPrice', ethPrice, ethNum, BigNumber(ethNum).times(ethPrice).toString())

        // return myContract.methods.depositETH(lendingPool, from, 0).call().estimateGas({ from })
        return BigNumber(ethNum).times(ethPrice).toString()
    }

    /**
     * 根据代币地址查询钱包余额
     * @param {string} chainId
     * @param {string} assetId
     * @param {Number} decimals
     * @returns
     */
    const getWalletBalance = async (chainId, assetId, decimals = 18) => {
        const networkName = networkConfigs[chainId].infuraName
        if (!networkName) return
        const baseUrl = getBaseUrl(networkName)
        const web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
        var myContract = new web3.eth.Contract(abi_token, assetId)

        try {
            const balance = await myContract.methods
                .balanceOf(state.userAddress)
                .call()
            return toNonExponential(divide(balance, pow(10, decimals)))
        } catch (error) {
            console.log('error', error)
        }
    }

    /**
     * 外部浏览器打开
     * @param {string} explorerLink url地址
     */
    const openExtBrowser = explorerLink => {
        const isUniapp = sessionGet('isUniapp')
        if (isUniapp) {
            uni.postMessage({
                data: {
                    action: 'message',
                    type: 'fundDEX',
                    params: {
                        explorerLink
                    }
                }
            })
        } else {
            window.open(explorerLink)
        }
    }

    return {
        getUserBalance,
        getAccountAssets,
        executeConnect,
        disconnect,
        switchNetwork,
        addToken,
        addNetwork,
        allowance,
        withdrawApprove,
        withdrawDAI,
        depositApprove,
        depositDAI,
        depositETH,
        withdrawETHApprove,
        withdrawETH,
        estimateFee,
        getWalletBalance,
        openExtBrowser
    }
}
