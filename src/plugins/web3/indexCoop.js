import { ref } from 'vue'
import Web3, { utils } from 'web3'
import Web3Modal from 'web3modal'
import BigNumber from 'bignumber.js'
import { useStore } from 'vuex'
import { localRemove, localSet } from '@/utils/util'
import { divide, mul, pow } from '@/utils/calculation'
import networkConfigs from './config/networkConfigs'

import { web3 } from './index'
import { commonABI } from './abi/indexCoop_abi'

export const indexCoopHooks = () => {
    const store = useStore()
    const state = store.state._web3

    /**
     * 根据链查询钱包余额
     * @param {string} chainId
     * @param {Number} decimals
     * @returns
     */
    const getChainBalance = async (chainId, decimals = 18) => {
        const publicJsonRPCUrl = networkConfigs[chainId].publicJsonRPCUrl
        const provider = publicJsonRPCUrl[0]
        const web3Provider = new Web3.providers.HttpProvider(provider)
        const web3 = new Web3(web3Provider)
        const balanceWei = await web3.eth.getBalance(state.userAddress)
        const balance = utils.fromWei(balanceWei)
        console.log('chainId', chainId, provider, balance)
        return balance
    }

    /**
     * 根据链查询钱包余额
     * @param {string} chainId
     * @param {string} address
     * @returns
     */
    const getBalanceOf = async (chainId, address) => {
        const publicJsonRPCUrl = networkConfigs[chainId].publicJsonRPCUrl
        const provider = publicJsonRPCUrl[0]
        const web3Provider = new Web3.providers.HttpProvider(provider)
        const web3 = new Web3(web3Provider)
        const from = state.userAddress
        const myContract = new web3.eth.Contract(commonABI, address, {
            from
        })
        const balance = await myContract.methods.balanceOf(from).call()
        return balance
    }

    /**
     * indexCoop查询代币的授权余额
     *
     * @param {string} chainId
     * @param {string} daiAddress 在当前链上需要查询的代币地址
     * @return {string} 代币的授权余额
     */
    const allowance = async (chainId, ZERO_EX_ADDRESS, daiAddress) => {
        const publicJsonRPCUrl = networkConfigs[chainId].publicJsonRPCUrl
        const provider = publicJsonRPCUrl[0]
        const web3Provider = new Web3.providers.HttpProvider(provider)
        const web3 = new Web3(web3Provider)
        const from = state.userAddress
        const myContract = new web3.eth.Contract(commonABI, daiAddress)
        const allowanceBalance = await myContract.methods.allowance(from, ZERO_EX_ADDRESS).call()
        return allowanceBalance
    }

    /**
     * 代币存款授权
     *
     * @param {string} ZERO_EX_ADDRESS 0x交易所地址
     * @param {string} daiAddress 代币地址
     * @param {string} value 授权额度(以太币单位)
     *
     */
    const allowanceApprove = async (ZERO_EX_ADDRESS, daiAddress, value = utils.toWei('2')) => {
        const from = state.userAddress
        console.log('ZERO_EX_ADDRESS', ZERO_EX_ADDRESS, 'daiAddress', daiAddress)
        console.log('value', value, 'from', from)
        const myContract = new web3.eth.Contract(commonABI, daiAddress)
        const gasPrice = await web3.eth.getGasPrice()
        console.log('gasPrice', gasPrice)
        return myContract.methods.approve(ZERO_EX_ADDRESS, value).send({
            from,
            gasPrice: 50000000000,
        })
    }

    /**
     * indexCoop 申购基金
     *
     * @param {string} swapQuoteInfo 行情接口返回的信息
     */
    const indexCoop_purchase = (swapQuoteInfo) => {
        const state = store.state._web3
        const from = state.userAddress // '0xa19515df175e7482E3De4f8040696A83071d51bD'
        const pramas = {
            ...JSON.parse(JSON.stringify(swapQuoteInfo)),
            from,
            gas: undefined,
        }
        console.log(pramas)
        return web3.eth.sendTransaction(pramas)
    }

    return {
        getChainBalance,
        getBalanceOf,
        allowance,
        allowanceApprove,
        indexCoop_purchase,
    }
}
