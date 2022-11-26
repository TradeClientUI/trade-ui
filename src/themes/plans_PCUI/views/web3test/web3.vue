<template>
    <div class='page-wrap'>
        <!-- <h1 class="text-purple-600">Web3.js DEMO</h1> -->
        <section class='networkBlock'>
            网络 &nbsp;&nbsp;
            <el-select
                ref='networkSelectRef'
                v-model='networkId'
                clearable
                filterable
                placeholder='请选择'
                @change='switchNetworkHandler'
            >
                <el-option
                    v-for='(value, name) in networkConfigs'
                    :key='value'
                    :label='value.name'
                    :value='name'
                    width='100'
                >
                    <img
                        alt=''
                        class='icon-network'
                        :src='value.networkLogoPath'
                        srcset=''
                    />
                    {{ value.name }}
                </el-option>
            </el-select>
        </section>

        <div class='btnsGroup'>
            <van-button class='oper-btn' type='default' @click='handleWalletConnect'>
                连接钱包
            </van-button>
            <van-button class='oper-btn' type='default' @click='close'>
                断开钱包
            </van-button>

            <van-button class='oper-btn' type='default' @click='getAccountAssets'>
                获取最新余额
            </van-button>
            <van-button class='oper-btn' type='default' @click='transfer'>
                转账
            </van-button>
            <van-button class='oper-btn' type='default' @click='addToken'>
                添加代币到钱包
            </van-button>
            <van-button class='oper-btn' type='default' @click='getFeeHandler'>
                getFeeHandler
            </van-button>
        </div>

        <section class='tabWrapper'>
            <van-tabs v-model:active='egActive' shrink type='card'>
                <van-tab title='获取钱包余额'>
                    获取钱包余额
                </van-tab>
                <van-tab title='添加代币到钱包'>
                    添加代币到钱包
                </van-tab>
                <van-tab title='getFee'>
                    <get-fee />
                </van-tab>
            </van-tabs>
        </section>

        <div v-loading='loading' class='result'>
            <p>
                Address:
                {{ $store.state._web3.userAddress }}
            </p>
            <p>balance: {{ $store.state._web3.userBalance }}</p>
            <p>networkId: {{ $store.state._web3.networkId }}</p>
            <p>chainId: {{ $store.state._web3.chainId }}</p>
            <p>testnetMode: {{ $store.state._web3.testnetMode }}</p>
            <p>
                TxHASH:
                <a
                    class='text-blue-600'
                    :href="'https://ropsten.etherscan.io/tx/' + output"
                    target='_blank'
                >
                    {{ output }}
                </a>
            </p>
        </div>

        <section class='stepBlock'>
            <h2 class='title'>
                其他代币存款API调用流程
            </h2>
            <van-steps :active='0' direction='vertical'>
                <van-step>
                    <p>1. 先调用 allowance 获取授权额度是否大于存款金额</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='allowanceHandler("0xD1B98B6607330172f1D991521145A22BCe793277")'>
                            allowance
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>2. 如果 allowance 额度小于存款金额，则调用 depositApprove 授权</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='depositApproveHandler("0xD1B98B6607330172f1D991521145A22BCe793277")'>
                            depositApprove
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>3. 调用 depositDAI 存款</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='depositDAIHandler'>
                            depositDAI
                        </van-button>
                    </p>
                </van-step>
            </van-steps>
        </section>

        <section class='stepBlock'>
            <h2 class='title'>
                ETH 存款 API 调用流程
            </h2>
            <van-steps :active='0' direction='vertical'>
                <van-step>
                    <p>1. ETH 存款不需要授权，直接存款</p>
                </van-step>
                <van-step>
                    <p>2. 调用 depositETH 存款</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='depositETHHandler'>
                            depositETH
                        </van-button>
                    </p>
                </van-step>
            </van-steps>
        </section>

        <section class='stepBlock'>
            <h2 class='title'>
                其他代币取款API调用流程
            </h2>
            <van-steps :active='0' direction='vertical'>
                <van-step>
                    <p>1. 先调用 allowance 获取授权额度是否大于存款金额</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='allowanceHandler("0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8")'>
                            allowance
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>2. 如果 allowance 额度小于取款金额，则调用 withdrawApprove 授权</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='withdrawApproveHandler'>
                            withdrawApprove
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>3. 调用 withdrawDAI 取款</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='withdrawDAIHandler'>
                            withdrawDAI
                        </van-button>
                    </p>
                </van-step>
            </van-steps>
        </section>

        <section class='stepBlock'>
            <h2 class='title'>
                ETH取款API调用流程
            </h2>
            <van-steps :active='0' direction='vertical'>
                <van-step>
                    <p>1. 先调用 allowance 获取授权额度是否大于存款金额</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='allowanceHandler("0x87b1f4cf9BD63f7BBD3eE1aD04E8F52540349347")'>
                            allowance
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>2. 如果 allowance 额度小于取款金额，则调用 withdrawETHApprove 授权</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='withdrawETHApproveHandler'>
                            withdrawETHApprove
                        </van-button>
                    </p>
                </van-step>
                <van-step>
                    <p>3. 调用 withdrawETH 取款，和其他代币取款的方法相同</p>
                    <p>
                        <van-button hairline plain size='small' type='success' @click='withdrawETHHandler'>
                            withdrawETH
                        </van-button>
                    </p>
                </van-step>
            </van-steps>
        </section>
    </div>

    <el-dialog v-model='dialogTableVisible' title='转账' width='30%'>
        <el-form-item label='钱包地址' :label-width='100'>
            <el-input v-model='toAccount' autocomplete='off' />
        </el-form-item>
        <el-form-item label='金额' :label-width='100'>
            <el-input v-model='amount' autocomplete='off' type='number' />
        </el-form-item>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='dialogTableVisible = false'>
                    取消
                </el-button>
                <el-button
                    type='primary'
                    @click='handleTransfer'
                >
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import getFee from './components/getFee.vue'
import { reactive, ref } from 'vue'
import Web3, { utils } from 'web3'
import Web3Modal from 'web3modal'
import { getChainData } from '@/plugins/web3/tools/tools'
import { providerOptions } from '@/plugins/web3/tools/config'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { mul, pow, toFixed } from '@/utils/calculation'
import { web3, web3Hooks } from '@/plugins/web3/index'
import { localGet } from '@/utils/util'
import { useStore } from 'vuex'
// import { LendingPool } from '@aave/contract-helpers'

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

const store = useStore()
const egActive = ref(0)
const networkId = ref('')
const output = ref('')
const networkSelectRef = ref(null)
const dialogTableVisible = ref(false)
const toAccount = ref('0xEd0f4bf5e21151dA45a1CA66Df30cbf695d92fBc')
const amount = ref('')

if (localGet('walletProvider')) executeConnect()

const handleWalletConnect = async function () {
    await executeConnect()
}
const close = async () => {
    disconnect()
}

const handleTransfer = () => {
    var message = {
        to: toAccount.value,
        value: utils.toWei(amount.value),
        from: userAddress.value
    }

    // web3.value.eth.sendTransaction(message, (err, res) => {
    //     if (!err) {
    //         output.value += res
    //     } else {
    //         output.value = 'Error'
    //     }
    // })

    web3.value.eth
        .sendTransaction(message)
        .on('transactionHash', function (hash) {
            output.value = hash
            dialogTableVisible.value = false
            console.log('hash------------', hash)
        })
        .on('receipt', function (receipt) {
            console.log('receipt------------', receipt)
            ElNotification({
                title: '转账成功',
                dangerouslyUseHTMLString: true,
                message: `<a class='text-blue-600' target="_blank" href="https://ropsten.etherscan.io/tx/${receipt.transactionHash}">${receipt.transactionHash}</a>`,
                type: 'success'
            })
        })
        .on('confirmation', function (confirmationNumber, receipt) {
            console.log('区块确认高度-----------', confirmationNumber, receipt)
        })
        .on('error', (error) => {
            console.log('error----------', error)
        })
}
const transfer = () => {
    if (!web3.value) return ElMessage.warning('未连接钱包')
    dialogTableVisible.value = true
}

const getMarketHelpData = (marketName) => {
    const testChains = [
        'Kovan',
        'Rinkeby',
        'Ropsten',
        'Mumbai',
        'Fuji',
        'Testnet'
    ]
    const arrayName = marketName.split(' ')
    const testChainName = arrayName.filter((el) => testChains.indexOf(el) > -1)
    const marketTitle = arrayName
        .filter((el) => !testChainName.includes(el))
        .join(' ')
    return {
        name: marketTitle,
        testChainName: testChainName[0]
    }
}

// 切换网络回调
const switchNetworkHandler = (e) => {
    switchNetwork(e).then(res => {
        console.log(e, res)
    })
}

// 查询授权余额
const allowanceHandler = (address) => {
    allowance(address).then(console.log)
}

// 代币存款授权
const depositApproveHandler = (address) => {
    const decimals = 18
    const p = pow(10, decimals)
    const gwei = mul('0.005', p)
    depositApprove(address || '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd', gwei).then(console.log).catch(console.log)
}

// 代币存款
const depositDAIHandler = () => {
    const decimals = 8
    const gwei = mul('0.0002', pow(10, decimals))
    depositDAI('0xD1B98B6607330172f1D991521145A22BCe793277', gwei).then(console.log).catch(console.log)
}

// ETH存款
const depositETHHandler = () => {
    depositETH(utils.toWei('0.0003')).then(console.log).catch(console.log)
}

// 代币取款授权
const withdrawApproveHandler = () => {
    withdrawApprove('0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8').then(console.log).catch(console.log)
}

// 代币取款
const withdrawDAIHandler = () => {
    withdrawDAI('0xff795577d9ac8bd7d90ee22b6c1703490b6512fd', utils.toWei('0.0002')).then(console.log).catch(console.log)
}

// 代币取款授权
const withdrawETHApproveHandler = () => {
    withdrawETHApprove('0x87b1f4cf9BD63f7BBD3eE1aD04E8F52540349347', utils.toWei('0.0005')).then(console.log).catch(console.log)
}

// ETH取款
const withdrawETHHandler = () => {
    withdrawETH(utils.toWei('0.0002')).then(console.log).catch(console.log)
}

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
    estimateFee('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', utils.toWei('0.002')).then(function (gasAmount) {
        console.log(gasAmount)
    })
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style  lang="scss" scoped>
.page-wrap{
    min-height: calc(100% - 252px);
    .title{
        font-size: 16px;
    }
}
.tabWrapper{
    margin-top: 40px;
    text-align: center;
    div.van-tabs{
        :deep(){
            .van-tab--card .van-tab__text{
                color: var(--van-tabs-default-color);
            }
            .van-tab--active{
                color: var(--van-white);
            }
            .van-tabs__content{
                padding: 20px;
                background: #eaeaea;
            }
        }
    }

}
.networkBlock{
    padding: 40px 0;
    text-align: center;
}
.btnsGroup{
    display: flex;
    justify-content: center;
    .oper-btn{
        margin: 0 .2em;
    }
}
.result, .stepBlock{
    width: 500px;
    margin: 20px auto;
    padding: 20px;
    line-height: 2;
    font-size: 14px;
    background: #fff;
}
</style>
