<template>
    <router-view />
    <Loading :show='loading' />
    <div class='header-tabs'>
        <div :class="['item', { 'item-active': activeName === 'overview' }]" @click="switchTabs('overview')">
            <span>Overview</span>
        </div>
        <div :class="['item', { 'item-active': activeName === 'info' }]" @click="switchTabs('info')">
            <span>Your info</span>
        </div>
    </div>
    <div v-if='!loading' class='detail-module'>
        <div class='info-case'>
            <div v-if="activeName === 'overview' || bodyWidth > 768" class='info-case-1'>
                <div class='chain-info'>
                    <div class='left'>
                        <img class='icon' :src='"/images/tokens/"+ fund.thirdCoinCode?.toLowerCase() +".svg"' />
                        <span class='name'>
                            {{ fund.thirdCoinCode }}
                        </span>
                    </div>
                    <div class='right'>
                        <img
                            :src='"/images/markets/"+ fund.marketName?.toLowerCase() +".svg"'
                        />
                        <span>{{ fund.marketName + (fund.networkName ? (' ' + fund.networkName) : '') }} Market</span>
                    </div>
                </div>
                <ul class='chain-row'>
                    <li>
                        <div class='inline'>
                            <span class='label'>
                                Platform
                            </span>
                            <div class='box' @click='toPlatform'>
                                <img class='icon' :src='"/images/tokens/"+ fund.platformName?.toLowerCase() +".svg"' />
                                <span class='value'>
                                    {{ fund.platformName }}
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Annual Percentage Yield (APY) is the projected interest on your deposit after one year.'
                                    :offset='[-10, 8]'
                                    title='APY'
                                />
                            </div>
                            <span class='value'>
                                <span v-if='parseFloat(fund.apy) > 0 && parseFloat(fund.apy) < 0.01'>
                                    &lt; 0.01%
                                </span>
                                <span v-else-if='parseFloat(fund.apy) === 0'>
                                    0%
                                </span>
                                <span v-else>
                                    {{ toFixed(fund.apy) + '%' }}
                                </span>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Total supplied: Total supplied is the total amount of a cryptocurrency that is supplied to the corresponding platform.'
                                    :offset='[50, 8]'
                                    title='Total supplied'
                                />
                            </div>
                            <span class='value'>
                                <large-number :offset='[50, 8]' :value='fund.savingsScale' />
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Reserve Size is the total value of a cryptocurrency that is reserved for borrowing.'
                                    :offset='[-30, 8]'
                                    title='Reserve size'
                                />
                            </div>
                            <span class='value'>
                                $<large-number :offset='[-50, 8]' :value='fund.reserveSize' />
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Available liquidity is the value of a cryptocurrency that is available for borrowing.'
                                    :offset='[40, 8]'
                                    title='Available liquidity'
                                />
                            </div>
                            <span class='value'>
                                $<large-number :offset='[50, 8]' :value='fund.availableFlowUsd' />
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Utilization rate is being calculated by Total Borrows / Total Liquidity and shows the share of reserve’s total capital that is borrowed.'
                                    :offset='[-30, 8]'
                                    title='Utilization rate'
                                />
                            </div>
                            <span class='value'>
                                {{ toFixed(fund.capitalUseRatio) }}%
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Oracle Price is the price feed of a cryptocurrency that is provided by Chainlink.'
                                    :offset='[50, 8]'
                                    title='Oracle price'
                                />
                            </div>
                            <span class='value'>
                                ${{ fund.price !='' ? formatAmount(fund.price) : '--' }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-if="bodyWidth > 768 || activeName === 'info'" class='info-case-2'>
                <h3 class='title'>
                    Your info
                </h3>
                <!-- 已连接钱包 -->
                <div v-if='userAddress' class='have-wallet'>
                    <div v-if='Number(assetBalance) <= 0 && !assetBalanceLoading' class='warn'>
                        Your Ethereum wallet is empty. Purchase or transfer assets
                    </div>
                    <div class='assets'>
                        <div class='label'>
                            <span>Wallet balance</span>
                        </div>
                        <div class='count'>
                            <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='16' />
                            <b v-else>
                                {{ formatAmount(walletBalance, 5) }}
                            </b>
                            <span>{{ fund.thirdCoinCode }}</span>
                        </div>
                    </div>
                    <p class='usd-count'>
                        <span>$ {{ toFixed(usdCount) }}</span>
                    </p>
                    <div class='assets'>
                        <div class='label'>
                            <span>Available to purchase</span>
                            <van-popover v-model:show='showAmountPopover' placement='top'>
                                <div class='popover-content'>
                                    <p>This is the total amount that you are able to purchase to in this reserve. You are able to purchase your wallet balance up until the purchase cap is reached.</p>
                                </div>
                                <template #reference>
                                    <van-icon class='info' :color="showAmountPopover ? '#0062FF' : style.normalColor" name='info-o' />
                                </template>
                            </van-popover>
                        </div>
                        <div class='count'>
                            <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='16' />
                            <b v-else>
                                {{ formatAmount(assetBalance, 5) }}
                            </b>
                            <span>{{ fund.thirdCoinCode }}</span>
                        </div>
                    </div>
                    <div class='handle'>
                        <button class='default' @click='openPurchaseDialog'>
                            Purchase
                        </button>
                    </div>
                </div>
                <!-- 未连接钱包 -->
                <div v-else class='not-wallet'>
                    <p class='warn'>
                        Please connect a wallet to view your personal information here.
                    </p>
                    <div class='connect-wallet'>
                        <button @click='startConnect'>
                            Connect wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 图表 -->
        <div v-show="chartShow && activeName === 'overview'">
            <div class='chart-case'>
                <h3 class='chart-title'></h3>
                <div ref='chartDom' class='chart-box'></div>
            </div>
        </div>
    </div>
    <div v-if='!loading' class='footer-handle'>
        <button v-if='userAddress' class='purchase' @click='openPurchaseDialog'>
            Purchase
        </button>
        <button v-else class='connect' @click='startConnect'>
            Connect wallet
        </button>
    </div>

    <!-- 申购弹窗组件 -->
    <aave-purchase-dialog ref='aavePurchaseDialogRef' @purchaseSuccess='purchaseSuccess' />
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useChart } from './hooks.js'
import { formatAmount, toFixed, mul, pow } from '@/utils/calculation'
import { marketDetail_AVVE, ratesHistory_AVVE } from '@/api/fund'
import { web3Hooks } from '@/plugins/web3/index'
import * as echarts from 'echarts'
import { localGet } from '@/utils/util'
import { useViewport } from '@/utils/hooks/useViewport'
import aavePurchaseDialog from '../components/aave-purchase-dialog.vue'
import largeNumber from '../components/large-number.vue'
import fieldPopover from '../components/field-popover.vue'

const store = useStore()
const route = useRoute()
const style = computed(() => store.state.style)
const userAddress = computed(() => store.state._web3.userAddress)
const { platformCode, assetId, marketId, chainId, decimals, version } = route.query
const {
    executeConnect,
    getUserBalance,
    getWalletBalance
} = web3Hooks()
const { newChart } = useChart()
const { bodyWidth } = useViewport()

// 当前申购数量转换成USD的数量
const usdCount = computed(() => {
    return walletBalance.value > 0 ? mul(walletBalance.value, fund.value.price) : 0
})
// 监听userAddress
watch(() => userAddress.value, () => {
    getAssetBalance()
})

// ref元素
const aavePurchaseDialogRef = ref(null)
// 详情数据加载状态
const loading = ref(true)
// 基金详情数据
const fund = ref({})
// 图表元素
const chartDom = ref(null)
// 图表加载状态
const chartLoading = ref(true)
// 钱包连接中
const connectLoading = ref(false)
// 是否使用ETH申购
const isPurchaseETH = ref(false)
// 代币余额
const assetBalance = ref(0)
// 代币余额获取中
const assetBalanceLoading = ref(true)
// 是否显示金额说明
const showAmountPopover = ref(false)
// 钱包余额
const walletBalance = ref(0)
// 当前选择的模块名称
const activeName = ref('overview')

// 图表数据
const chartData = ref(null)
const chartShow = ref(true)

// 获取基金详情
const queryfundDetail = () => {
    marketDetail_AVVE({
        platformCode,
        assetId,
        marketId,
        chainId,
        version
    }).then(res => {
        loading.value = false
        fund.value = res.data
        isPurchaseETH.value = ['WETH', 'ETH'].includes(fund.value.thirdCoinCode)
    }).catch(() => {
        loading.value = false
    })
}

// 获取基金历史行情
const queryRatesHistory = () => {
    ratesHistory_AVVE({
        platformCode,
        assetId,
        marketId,
        chainId,
        version
    }).then(res => {
        const xData = []
        const yData = []
        const len = res.data.length
        const num = 6 * (7 * 4) // 只取6周的数据，一天有4条数据，一周28条数据，共168条数据
        const max = len > num ? len - num : 0
        chartData.value = res
        chartShow.value = true
        for (let i = len - 1; i >= max; i--) {
            const item = res.data[i]
            xData.unshift(window.dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'))
            yData.unshift(toFixed(item.liquidityRate * 100))
        }
        const series = [{
            name: 'APY',
            type: 'line',
            showSymbol: false,
            data: yData,
            smooth: true,
            areaStyle: {
                opacity: 0.5,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(129,213,220)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(234,248,249)'
                    }
                ])
            }
        }]

        // 绘制图表
        newChart(chartDom.value, [xData, series], {
            'yAxis.ext': '%'
        })

        chartLoading.value = false
    }).catch(error => {
        chartShow.value = false
        chartLoading.value = false
    })
}

// 获取代币余额
const getAssetBalance = () => {
    assetBalanceLoading.value = true
    if (isPurchaseETH.value) {
        getUserBalance().then(res => {
            console.log('获取代币余额成功', res)
            assetBalanceLoading.value = false
            walletBalance.value = res || 0
            if (Number(res)) {
                const result = Number(res) - 0.001
                assetBalance.value = result > 0 ? result : 0
            } else {
                assetBalance.value = 0
            }
        }).catch(err => {
            console.log('获取代币余额失败', err)
            assetBalanceLoading.value = false
            assetBalance.value = 0
            walletBalance.value = 0
        })
    } else {
        getWalletBalance(chainId, assetId, decimals).then(res => {
            console.log('获取代币余额成功', res)
            assetBalanceLoading.value = false
            assetBalance.value = res || 0
            walletBalance.value = res || 0
        }).catch(err => {
            console.log('获取代币余额失败', err)
            assetBalanceLoading.value = false
            assetBalance.value = 0
            walletBalance.value = 0
        })
    }
}

// 跳转到平台
const toPlatform = () => {
    // window.open(fund.value.platformUrl)
}

// 打开申购弹窗
const openPurchaseDialog = () => {
    aavePurchaseDialogRef.value.open(fund.value)
}

// 申购成功
const purchaseSuccess = () => {
    queryfundDetail()
    getAssetBalance()
}

// 连接钱包
const startConnect = () => {
    executeConnect().then(() => {
        connectLoading.value = false
        getAssetBalance()
    }).catch(() => {
        connectLoading.value = false
    })
}

// 切换选项卡
const switchTabs = (value) => {
    if (activeName.value !== value) activeName.value = value
}

onMounted(() => {
    // 连接狐狸钱包
    if (localGet('walletProvider')) {
        startConnect()
    }
    // 获取基金详情
    queryfundDetail()
    // 获取基金历史行情
    queryRatesHistory()
})
</script>

<style lang="scss" scoped>
@import '../stakingDetail.scss'
</style>
