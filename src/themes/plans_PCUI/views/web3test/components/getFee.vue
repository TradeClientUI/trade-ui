<template>
    <div class='box'>
        <h2>获取手续费</h2>
        <van-field v-model='assetId' label='assetId' placeholder='请输入assetId' />
        <van-field v-model='value' label='金额' placeholder='请输入金额' />
        <van-field v-model='decimals' label='金额小数位' placeholder='请输入' />
        <van-button class='handlerBtn' type='primary' @click='getFeeHandler'>
            getFeeHandler
        </van-button>
        <span>
            手续费： {{ fee }}
        </span>
    </div>
</template>

<script setup>
import { utils } from 'web3'
import { web3, web3Hooks } from '@/plugins/web3/index'
import { ref } from 'vue'
import BigNumber from 'bignumber.js'
import { pow } from '@/utils/calculation'
const {
    loading,
    executeConnect,
    allowance,
    disconnect,
    switchNetwork,
    addToken,
    addNetwork,
    depositApprove,
    withdrawApprove,
    getAccountAssets,
    withdrawDAI,
    depositDAI,
    depositETH,
    withdrawETHApprove,
    withdrawETH,
    estimateFee,
} = web3Hooks()

const assetId = ref('0xff795577d9ac8bd7d90ee22b6c1703490b6512fd')
const decimals = ref('18')
const value = ref('0.02')
const fee = ref('')

// 获取预估手续费
const getFeeHandler = async () => {
    // const provider = web3.currentProvider
    // const lendingPoolAddress = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'
    // const wethGatewayAddress = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04'
    // const lendingPool = new LendingPool(provider, {
    //     LENDING_POOL: lendingPoolAddress,
    //     WETH_GATEWAY: wethGatewayAddress,
    // })
    // console.log(lendingPool)
    // const aa = async () => {
    //     const depositfn = await lendingPool.deposit({
    //         user: '0xa19515df175e7482e3de4f8040696a83071d51bd',
    //         reserve: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    //         amount: '0.002',
    //     })
    //     console.log(depositfn)
    // }
    // aa()

    const p = pow(10, decimals.value)
    const val = BigNumber(value.value).times(p).dp(0).toString()
    estimateFee(assetId.value, val).then(function (res) {
        console.log(res)
        fee.value = res
    })
}
</script>

<style lang="scss" scoped>
@import './componentStyle.scss'
</style>
