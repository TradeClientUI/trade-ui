import { ref, reactive, getCurrentInstance, toRefs, } from 'vue'
import Web3, { utils } from 'web3'
import Web3Modal from 'web3modal'
import { getChainData } from '../tools/tools'
import { providerOptions } from '../tools/config'
import { ElMessage } from 'element-plus'
import { abi_approve, abi_depositWithdraw, abi_depositWithdrawETH, abi_lendingPool, abi_token } from '@/plugins/web3/abi'
import networkConfigs from '../config/networkConfigs'
import BigNumber from 'bignumber.js'
import { getETHPrice } from '@/api/fundDEX'

const INITIAL_STATE = {
    web3: null,
    provider: null,
    userAddress: '',
    connected: false,
    chainId: 1,
    networkId: '1',
    networkType: '',
    loading: false
}

export default function UseWallet () {
    const { ctx: _this } = getCurrentInstance()

    const state = reactive({ ...INITIAL_STATE })
    const fetching = ref(false)
    const assets = ref(0)
    // https://github.com/Web3Modal/web3modal#web3modal
    const web3Modal = new Web3Modal({
        theme: 'dark',
        network: getChainData(state.chainId).network,
        cacheProvider: true,
        providerOptions,
    })
    // methods wallte.js
    const resetApp = async () => {
        const { web3 } = state
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            web3.currentProvider.close().then(res => {
                console.log('close', res)
            })
        }

        web3Modal.clearCachedProvider()
        assets.value = 0
        Object.keys(INITIAL_STATE).forEach((e) => {
            state[e] = INITIAL_STATE[e]
        })
        _this.$forceUpdate()
    }

    // 查询余额
    const getUserBalance = () => {
        if (!state.web3) return ElMessage.warning('未连接钱包')
        state.loading = true
        return state.web3.eth
            .getBalance(state.userAddress)
            .then((res) => {
                state.loading = false
                return utils.fromWei(res.toString(), 'ether') || 0
            })
    }

    const getAccountAssets = async () => {
        fetching.value = true
        assets.value = await getUserBalance()
    }

    const subscribeProvider = async (provider) => {
        if (!provider.on) {
            return
        }
        provider.on('close', () => {
            console.log('guanbi')
            resetApp()
        })
        provider.on('accountsChanged', async (accounts) => {
            // eslint-disable-next-line prefer-destructuring
            state.userAddress = accounts[0]
            await getAccountAssets()
        })
        provider.on('chainChanged', async (chainId) => {
            const networkId = await state.web3.eth.net.getId()
            state.chainId = chainId
            state.networkId = networkId.toString()
            await getAccountAssets()
            _this.$forceUpdate()
        })
    }

    // 链接狐狸钱包
    const executeConnect = async () => {
        const provider = await web3Modal.connect()
        console.log('provider', provider)
        await subscribeProvider(provider)

        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts()

        const address = accounts[0]

        const networkId = await web3.eth.net.getId()
        const networkType = await web3.eth.net.getNetworkType()

        const chainId = await web3.eth.getChainId()

        state.web3 = web3
        window.web3vm = web3
        window.web3utils = utils
        state.provider = provider
        state.connected = true
        state.userAddress = address
        state.chainId = chainId
        state.networkId = networkId.toString()
        state.networkType = networkType
        await getAccountAssets()
        web3.eth.getBalance('0xa19515df175e7482E3De4f8040696A83071d51bD')
            .then(console.log)
    }

    const getAccounts = async () => {
        const accounts = await state.web3.eth.getCoinbase()
        console.log(accounts)
    }

    // 切换网络
    const switchNetwork = (value) => {
        const chainId = utils.toHex(value)
        window.ethereum &&
            window.ethereum
                .request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId
                        }
                    ]
                })
                .then(() => {
                    networkSelectRef.value.blur()
                    ElMessage.success('网络切换成功')
                })
                .catch((e) => {
                    ElMessageBox.confirm(e.message, {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        addNetwork(value)
                    })
                })
    }

    // 添加网络
    const addNetwork = (value) => {
        const { name, publicJsonRPCUrl } = networkConfigs[value]
        const chainId = utils.toHex(value)
        window.ethereum &&
            window.ethereum
                .request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId,
                            chainName: name,
                            // nativeCurrency: {
                            //     name: 'BNB',
                            //     symbol: 'BNB',
                            //     decimals: 18,
                            // },
                            rpcUrls: publicJsonRPCUrl
                            // blockExplorerUrls: ['https://bscscan.com/'],
                        }
                    ]
                })
                .then(() => {
                    console.log('网络添加成功')
                })
                .catch((e) => {})
    }

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

        window.ethereum
            .request({ method: 'wallet_watchAsset', params })
            .then(() => ElMessage.success('添加代币成功'))
            .catch((error) => console.log(error))
    }

    // 发送代币
    const transferDAI = async () => {
        const daiAddress = '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd'
        const from = '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const lendingPool = '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        var WZGLToken = new state.web3.eth.Contract(abi_approve, daiAddress, {
            from
        })
        console.log(WZGLToken)
        // 发送一个代币
        WZGLToken.methods.approve(lendingPool, utils.toWei('0.2')).send().then(console.log)
        // const aa = await WZGLToken.methods.allowance('0xa19515df175e7482E3De4f8040696A83071d51bD','0xe0fba4fc209b4948668006b2be61711b7f465bae').call()
        // console.log(aa);

        var WZGLToken2 = new state.web3.eth.Contract(abi_depositWithdraw, lendingPool, {
            from
        })

        WZGLToken2.methods.deposit(daiAddress, utils.toWei('0.1'), from, 0).send().then(console.log)
    }

    /**
     * 查询代币的授权余额
     *
     * @param {string} daiAddress 在当前链上需要查询的代币地址 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @return {string} 代币的授权余额
     */
    const allowance = async (daiAddress) => {
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!networkConfigs[state.networkId]?.lendingPool) return console.error('不支持该网络', state.networkId)
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const lendingPool = networkConfigs[state.networkId]?.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        var WZGLToken = new state.web3.eth.Contract(abi_approve, daiAddress, {
            from
        })
        const aa = await WZGLToken.methods.allowance(from, lendingPool).call()
        return utils.fromWei(aa)
    }

    /**
     * 代币存款授权
     *
     * @param {string} daiAddress 在当前链上需要查询的代币地址 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
     * @param {string} value 授权额度(以太币单位)
     *
     */
    const depositApprove = (daiAddress, value = utils.toWei('2')) => {
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!networkConfigs[state.networkId]?.lendingPool) return console.error('不支持该网络', state.networkId)
        const lendingPool = networkConfigs[state.networkId]?.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const WZGLToken = new state.web3.eth.Contract(abi_approve, daiAddress, {
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
    const depositDAI = (daiAddress, value) => {
        if (!daiAddress) return console.error('必须传入代币地址')
        if (!value) return console.error('必须传入存款额度')
        if (!networkConfigs[state.networkId]?.lendingPool) return console.error('不支持该网络', state.networkId)
        const lendingPool = networkConfigs[state.networkId]?.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const WZGLToken2 = new state.web3.eth.Contract(abi_depositWithdraw, lendingPool, {
            from
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
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xa61ca04df33b72b235a8a28cfb535bb7a5271b70'
        const WZGLToken = new state.web3.eth.Contract(abi_depositWithdrawETH, WETHGateway, {
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
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WZGLToken = new state.web3.eth.Contract(abi_approve, aTokenAddress, {
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
    const withdrawDAI = (daiAddress, value) => {
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        var WZGLToken2 = new state.web3.eth.Contract(abi_depositWithdraw, lendingPool, {
            from
        })

        return WZGLToken2.methods.withdraw(daiAddress, value, from).send()
    }

    console.log(utils.toWei('0.0003'))

    /**
     * ETH 提现授权
     * @param {string} aTokenAddress atoken地址
     * @param {string} value 取款授权额度(以太币单位)
     */
    const withdrawETHApprove = (aTokenAddress, value = utils.toWei('2')) => {
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        var WZGLToken = new state.web3.eth.Contract(abi_approve, aTokenAddress, {
            from
        })
        WZGLToken.methods.approve(WETHGateway, value).send().then(console.log)
    }

    /**
     * ETH 提现
     * @param {string} value 取款额度(以太币单位)
     */
    const withdrawETH = (value) => {
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const network = networkConfigs[state.networkId] || {}
        const lendingPool = network.lendingPool // '0xe0fba4fc209b4948668006b2be61711b7f465bae'
        const WETHGateway = network.WETHGateway // '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70'
        const WZGLToken = new state.web3.eth.Contract(abi_depositWithdrawETH, WETHGateway, {
            from
        })

        return WZGLToken.methods.withdrawETH(lendingPool, value, from).send()
    }

    /**
     * 计算预估手续费
        1、获取gasPrice
        2、定义gasLimit
        3、消耗的ETH数量 = gasPrice * gasLimit / 18;
        4、得到的eth数量 * eth的价格 = 预估消耗的⼿续费
     */
    const estimateFee = async () => {
        const gasPrice = '0.00000000485'
        const gasLimit = '279536'
        const ethNum = BigNumber(gasPrice).times(gasLimit).div(18).toString()
        const ethPriceResult = await getETHPrice()
        const ethPrice = ethPriceResult.ethereum.usd
        // console.log('ethPrice', ethPrice, ethNum, BigNumber(ethNum).times(ethPrice).toString())
        return BigNumber(ethNum).times(ethPrice).toString()
    }
    // estimateFee()

    /*
    根据代币地址查询钱包余额
    */
    const getWalletBalance = async (chainId, assetId) => {
        const networkName = networkConfigs[chainId].infuraName
        if (!networkName) return
        const baseurl = `https://${networkName}.infura.io/v3/a0d897eb140e4347b804a9234c813f04`
        const web3 = new Web3(new Web3.providers.HttpProvider(baseurl))
        var myContract = new web3.eth.Contract(abi_token, assetId)

        try {
            const balance = await myContract.methods
                .balanceOf(state.userAddress)
                .call()

            // const bal = divide(balance, mul(10, el.decimals))
            return utils.fromWei(balance, 'ether')
        } catch (error) {
            console.log('error', error)
        }
    }

    return {
        ...toRefs(state),
        fetching,
        assets,
        resetApp,
        getAccountAssets,
        //
        web3Modal,
        // methods
        executeConnect,
        getAccounts,
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
        getWalletBalance
    }
}
