<template>
    <router-view />
    <div class='dashboard'>
        <div v-if='_web3.userAddress'>
            <van-tabs
                v-model:active='activeType'
                :background='$style.contentColor'
                class='tabs'
                :color='$style.primary'
                :line-width='60'
                shrink
            >
                <van-tab title='Earning' />
                <van-tab title='IndexFunds' />
            </van-tabs>

            <div v-if='activeType === 0' class='earning-warp'>
                <!-- <el-skeleton v-show='loading' animated class='skeleton-wrap'>
                    <template #template>
                        <div class='skeleton-item'>
                            <div v-for='item in 3' :key='item' class='skeleton-fild'>
                                <el-skeleton-item class='filed1' variant='circle' />
                                <el-skeleton-item class='filed2' variant='text' />
                                <el-skeleton-item class='filed3' variant='text' />
                                <el-skeleton-item class='filed4' variant='text' />
                                <el-skeleton-item class='filed5' variant='button' />
                                <el-skeleton-item class='filed5' variant='button' />
                            </div>
                        </div>
                    </template>
                </el-skeleton> -->

                <div v-for='item in 3' v-show='loading' :key='item' class='skeleton-wrap'>
                    <van-skeleton avatar :row='3' title />
                </div>

                <div v-if='fildterMarket.length > 0' class='dashboardTable'>
                    <p class='header-title'>
                        Your portfolio
                    </p>
                    <van-collapse v-model='activeNames' @change='collapseChange'>
                        <van-collapse-item
                            v-for='(data, key) in fildterMarket'
                            :key='key'
                            :name='data.networkType +"_"+ data.marketName'
                            :toggle='true'
                        >
                            <template #title>
                                <div class='title'>
                                    <img alt='' class='currencyIcon symbolCurrencyIcon' :src='"/images/markets/"+ data.marketName.toLowerCase() +".svg"' />

                                    <span v-if='data.networkType === 2' class='testnet'>
                                        {{ data.networkName.substr(0,1) }}
                                    </span>
                                    {{ data.marketName }} Market
                                </div>
                            </template>
                            <template #right-icon>
                                <div class='collapseItem'>
                                    <span v-if='isFold(data)===-1'>
                                        Show <van-icon name='plus' />
                                    </span>
                                    <span v-else>
                                        Hide <van-icon name='minus' />
                                    </span>
                                </div>
                            </template>
                            <div class='fund-list'>
                                <!-- PC端 -->
                                <div v-if='filterData(data).length > 0' class='table-module'>
                                    <div class='table-header'>
                                        <table-title
                                            v-for='(item, index) in tableHeaders'
                                            :key='index'
                                            v-model:sort-val='sortVal'
                                            v-model:sort-way='sortWay'
                                            :class="[ item.value === 'name' ? 'pro-link' : 'pro-row' ]"
                                            :is-sort='item.isSort'
                                            :name='item.name'
                                            :value='item.value'
                                            :warn-text='item.warnText'
                                        />
                                        <div class='handle-row'></div>
                                    </div>
                                    <ul class='table-list'>
                                        <li v-for='(item, index) in filterData(data)' :key='index' @click='handleClick(item)'>
                                            <div class='pro-link'>
                                                <div class='pro-cell'>
                                                    <img
                                                        class='currencyIcon'
                                                        onerror="this.src='/images/tokens/default.png'"
                                                        :src='getCoinUrl(item.thirdCoinCode)'
                                                    />
                                                    <img
                                                        class='small'
                                                        src='/images/tokens/aave.svg'
                                                    />
                                                </div>
                                                <div class='pro-name'>
                                                    <b class='black'>
                                                        {{ item.thirdCoinCode }}
                                                    </b>
                                                    <span class='bottomText'>
                                                        {{ item.marketName }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class='pro-row'>
                                                <p class='black'>
                                                    {{ toFixed(item.balance,7) }}
                                                </p>
                                                <p v-if='item.usd<0.01 && item.usd>0' class='bottomText'>
                                                    &lt; $ 0.01
                                                </p>
                                                <p v-else class='bottomText'>
                                                    $ {{ toFixed(item.usd,2) }}
                                                </p>
                                            </div>
                                            <div class='pro-row'>
                                                <p class='black'>
                                                    <span v-if='parseFloat(item.apy) > 0 && parseFloat(item.apy) < 0.01'>
                                                        &lt; 0.01%
                                                    </span>
                                                    <span v-else-if='parseFloat(item.apy) === 0'>
                                                        0%
                                                    </span>
                                                    <span v-else>
                                                        {{ toFixed(item.apy)+'%' }}
                                                    </span>
                                                </p>
                                            </div>
                                            <div class='handle'>
                                                <button class='default' @click.stop='openPurchaseDialog(item)'>
                                                    Purchase
                                                </button>
                                                <button class='easy' @click.stop='openWithdrawDialog(item)'>
                                                    Redeem
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <!-- 手机端 -->
                                <div v-if='filterData(data).length > 0' class='table-module-wrap'>
                                    <div v-for='(item, index) in filterData(data)' :key='index' class='card' @click='handleClick(item)'>
                                        <div class='header'>
                                            <img alt='' class='currencyIcon' :src='"/images/tokens/"+ item.thirdCoinCode.toLowerCase() +".svg"' />
                                            <img
                                                alt=''
                                                class='mark'
                                                src='/images/tokens/aave.svg'
                                            />
                                            <b class='black'>
                                                {{ item.thirdCoinCode }}
                                            </b>
                                        </div>
                                        <div class='row'>
                                            <label class='label'>
                                                Balance
                                            </label>
                                            <div class='vals'>
                                                <p class='black'>
                                                    {{ toFixed(item.balance,7) }}
                                                </p>
                                                <p v-if='item.usd<0.01 && item.usd>0' class='bottomText'>
                                                    &lt; $ 0.01
                                                </p>
                                                <p v-else class='bottomText'>
                                                    $ {{ toFixed(item.usd,2) }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class='row'>
                                            <label class='APY'>
                                                APY
                                            </label>
                                            <div class='vals'>
                                                <p class='black'>
                                                    <span v-if='parseFloat(item.apy) > 0 && parseFloat(item.apy) < 0.01'>
                                                        &lt; 0.01%
                                                    </span>
                                                    <span v-else-if='parseFloat(item.apy) === 0'>
                                                        0%
                                                    </span>
                                                    <span v-else>
                                                        {{ toFixed(item.apy)+'%' }}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class='row'>
                                            <button class='default' @click.stop='openPurchaseDialog(item)'>
                                                Purchase
                                            </button>
                                            <button class='easy' @click.stop='openWithdrawDialog(item)'>
                                                Redeem
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class='no-data'>
                                    No holding yet
                                </div>
                            </div>
                        </van-collapse-item>
                    </van-collapse>
                </div>
                <div v-if='fildterMarket.length === 0 && !loading' class='all-no-data'>
                    <div class='empty-icon-wrap'>
                        <img alt='' src='/images/question.svg' srcset='' />
                    </div>

                    <h2 class='text'>
                        No holding yet
                    </h2>
                    <button class='button' @click='toMarkets'>
                        Purchase now
                    </button>
                </div>
            </div>

            <div v-else class='indexfund-wrap'>
                <IndexCoop />
            </div>
        </div>
        <div v-else class='no-login-wrap'>
            <div class='empty-icon-wrap'>
                <img alt='' src='/images/wallet.svg' srcset='' />

                <div class='close-wrap'>
                    <img alt='' class='close-icon' src='/images/close.svg' srcset='' />
                </div>
            </div>
            <h2 class='text1'>
                Wallet not connected
            </h2>
            <p class='text2'>
                Please connect your wallet to see your Portfolio
            </p>
            <button class='connect-btn' type='button' @click='handleConnect'>
                Connect wallet
            </button>
        </div>
    </div>

    <!-- 存款弹窗组件 -->
    <aave-purchase-dialog ref='aavePurchaseDialogRef' />
    <!-- 取款弹窗组件 -->
    <aave-withdraw-dialog ref='aaveWithdrawDialogRef' />
</template>

<script>
import { computed, onUnmounted, ref, unref, toRefs, reactive, watch, onMounted, watchEffect, getCurrentInstance, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toFixed, mul, divide, pow, formatAmount, toNonExponential } from '@/utils/calculation'
import Web3, { utils } from 'web3'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { abi_token } from '@/plugins/web3/abi/index'
import { localGet, sessionSet } from '@/utils/util'
import TypeScroll from '../components/type-list-scroll.vue'
import aavePurchaseDialog from '../components/aave-purchase-dialog.vue'
import aaveWithdrawDialog from '../components/aave-withdraw-dialog.vue'
import { web3Hooks } from '@/plugins/web3/index'
import { getBaseUrl } from '@/plugins/web3/config/infuraConfig.js'
import { useViewport } from '@/utils/hooks/useViewport'
import tableTitle from '../components/table-title.vue'
import IndexCoop from './components/indexCoop.vue'

export default {
    components: {
        aavePurchaseDialog,
        aaveWithdrawDialog,
        IndexCoop,
        tableTitle
    },
    props: {},
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const {
            executeConnect,
        } = web3Hooks()

        const { bodyWidth } = useViewport()

        const state = reactive({
            isPC: window.isPC,
            loading: true,
            activeType: 0,
            marketList: [], // 过滤后的市场数据
            marketListData: [], // 行情原始数据
            activeMarket: 'all',
            active: 0,
            bodyWidth: 0,
            // 表格头字段数据
            tableHeaders: [
                {
                    name: 'Assets',
                    isSort: true,
                    warnText: '',
                    value: 'assets'
                },
                {
                    name: 'Balance',
                    isSort: true,
                    warnText: '',
                    value: 'balance'
                },
                {
                    name: 'APY',
                    isSort: true,
                    warnText: 'Annual Percentage Yield(APY) is the projected interest on your deposit after one year',
                    value: 'apy'
                }
            ],
            // 排序字段
            sortVal: 'apy',
            // 排序方式
            sortWay: 'down',
            // 排序后的列表数据
            sortTableData: [],
            activeNames: ['2_Ethereum']
        })

        // web3连接信息
        const _web3 = computed(() => store.state._web3)
        const bgColor = computed(() => store.state.style.primary + '0D')

        const fildterMarket = computed(() => {
            let temp = []
            // 测试模式数据过滤
            const testnetMode = _web3.value.testnetMode ? 2 : 1

            if (state.activeMarket === 'all') {
                temp = state.marketList.filter(el => el.networkType === testnetMode)
            } else {
                temp = state.marketList.filter(el => el.marketName === state.activeMarket.marketName && el.networkType === state.activeMarket.networkType && el.networkType === testnetMode)
            }

            // 排序
            if ((state.sortVal || state.sortWay) && temp[0]?.arr) {
                temp[0].arr.sort((a, b) => {
                    let firstEl = a
                    let secondEl = b
                    if (state.sortWay === 'down') {
                        firstEl = b
                        secondEl = a
                    }
                    if (state.sortVal === 'assets') {
                        return firstEl['thirdCoinCode'].localeCompare(secondEl['thirdCoinCode'])
                    }
                    if (state.sortVal === 'apy') {
                        return Number(firstEl['apy']) - Number(secondEl['apy'])
                    }
                    if (state.sortVal === 'balance') {
                        return Number(firstEl['balance']) - Number(secondEl['balance'])
                    }
                })
            }

            return temp.filter(el => el.arr.length > 0 && el.arr.filter(ar => ar.balance > 0).length > 0)
        })

        // ref元素
        const aavePurchaseDialogRef = ref(null)
        const aaveWithdrawDialogRef = ref(null)

        const handleConnect = () => {
            executeConnect()
        }

        const handleGoList = () => {
            if (state.activeType === 'Earning') {
                router.push({
                    path: '/Staking',
                    query: {
                    }
                })
            }
            if (state.activeType === 'IndexFunds') {
                router.push({
                    path: '/IndexFunds',
                    query: {
                    }
                })
            }
        }

        // 打开申购弹窗
        const openPurchaseDialog = (row) => {
            aavePurchaseDialogRef.value.open(row)
        }

        // 打开提现弹窗
        const openWithdrawDialog = (row) => {
            aaveWithdrawDialogRef.value.open(row)
        }
        const handleChangeTab = (type) => {
            state.active = type
        }

        const toMarkets = () => {
            router.push('/earning')
        }

        const getBalance = async () => {
            state.marketList = []
            await state.marketListData.forEach(async (el) => {
                el.usd = 0
                el.balance = 0

                // 组装市场数据
                const flag = state.marketList.find(item => el.marketName === item.marketName && el.networkType === item.networkType)

                if (flag) {
                    state.marketList.find(ml => ml.marketName === el.marketName && ml.networkType === el.networkType).arr.push(el)
                } else {
                    const mlObj = {
                        networkType: el.networkType,
                        marketName: el.marketName,
                        networkName: el.networkName,
                        arr: [el]
                    }
                    state.marketList.push(mlObj)
                }

                // 查询链上余额
                if (_web3.value.userAddress) {
                    const networkName = networkConfigs[el.chainId].infuraName
                    if (!networkName) return
                    const baseUrl = getBaseUrl(networkName)
                    const web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
                    var myContract = new web3.eth.Contract(abi_token, el.aTokenAddress)

                    try {
                        const balance = await myContract.methods
                            .balanceOf(_web3.value.userAddress)
                            .call()

                        const bal = divide(balance, pow(10, el.decimals))
                        el.usd = toNonExponential(mul(bal, el.price))
                        el.balance = toNonExponential(bal)
                    } catch (error) {
                        console.log('error', error)
                    }
                }
            })
            state.loading = false
        }

        const filterData = data => {
            return data.arr.filter(el => el.balance > 0)
        }

        const switchMarket = obj => {
            state.activeMarket = obj
        }

        const aaveProducts = computed(() => store.state._web3.aaveProducts)

        watch(() => aaveProducts.value, val => {
            if (val.length > 0) {
                state.marketListData = []
                state.marketListData = val
                getBalance()
            }
        })

        watch(() => _web3.value.userAddress, val => {
            if (val) {
                store.dispatch('_web3/getAAVEMarkets')
            }
        })

        const getCoinUrl = (code) => {
            if (!code) return ''
            const coinName = code.split('.')
            if (coinName[0]) {
                return '/images/tokens/' + coinName[0].toLowerCase() + '.svg'
            } else {
                return '/images/tokens/' + coinName.toLowerCase() + '.svg'
            }
        }

        const handleClick = row => {
            router.push({
                path: '/earning/detail',
                query: {
                    platformCode: row.platformCode,
                    assetId: row.assetId,
                    marketId: row.marketId,
                    chainId: row.chainId,
                    decimals: row.decimals,
                    version: row.version
                }
            })
        }
        const setSession = row => {
            sessionSet('AAVE_productActived', JSON.stringify(row))
        }

        const collapseChange = val => {
            console.log(val)
        }
        const isFold = data => {
            return state.activeNames.indexOf(data.networkType + '_' + data.marketName)
        }

        onMounted(async () => {
            if (localGet('walletProvider')) {
                // await executeConnect()
                store.dispatch('_web3/getAAVEMarkets')
            }
        })

        return {
            ...toRefs(state),
            handleGoList,
            toFixed,
            switchMarket,
            fildterMarket,
            filterData,
            _web3,
            aavePurchaseDialogRef,
            aaveWithdrawDialogRef,
            openPurchaseDialog,
            openWithdrawDialog,
            handleConnect,
            handleChangeTab,
            handleClick,
            setSession,
            toMarkets,
            bodyWidth,
            getCoinUrl,
            formatAmount,
            collapseChange,
            isFold,
            bgColor
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../table.scss';
@import '../fundDEX.scss';
</style>
