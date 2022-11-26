<template>
    <router-view />
    <Loading :show='loading' />
    <div class='detail-module'>
        <div class='info-case'>
            <div class='info-case-1'>
                <div class='chain-header'>
                    <div class='chain-info'>
                        <div class='row-2'>
                            <img class='icon' :src='product.image' />
                            <div class='text'>
                                <span class='name'>
                                    {{ product.symbol }}
                                </span>
                                <span class='alias'>
                                    {{ product.name }}
                                </span>
                            </div>
                        </div>
                        <div class='row-1'>
                            <img
                                :src='"/images/markets/"+ linkType.toLowerCase() +".svg"'
                            />
                            <span>
                                {{ linkType }}
                                <b v-if='bodyWidth > 768'>
                                    Market
                                </b>
                            </span>
                        </div>
                    </div>
                    <div class='chain-handle'>
                        <!-- 已连接钱包 -->
                        <div v-if='userAddress' class='have-wallet'>
                            <button class='default purchase' @click="handleShowDialog('purchase')">
                                Purchase
                            </button>
                            <button class='default redeem' @click="handleShowDialog('redeem')">
                                Redeem
                            </button>
                        </div>
                        <div v-else class='connect-wallet'>
                            <button @click='startConnect'>
                                Connect wallet
                            </button>
                        </div>
                    </div>
                </div>
                <ul class='chain-row'>
                    <li>
                        <div class='inline'>
                            <span class='label'>
                                Platform
                            </span>
                            <div class='box' @click='toPlatform'>
                                <img class='icon' src='@/assets/fundDex_icon/index-logo-black.png' />
                                <span class='value'>
                                    Index
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Net Asset Value (NAV) is the unit price of a mutual fund scheme.'
                                    :offset='[-10, 8]'
                                    title='NAV'
                                />
                            </div>
                            <span class='value'>
                                ${{ nav }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Market Cap is the total market value of a mutual fund scheme’s shares.'
                                    :offset='[60, 8]'
                                    title='Market cap'
                                />
                            </div>
                            <span class='value'>
                                ${{ marketCap }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Volume is a measure of how much of a fund was traded within a given period of time.'
                                    :offset='[-10, 8]'
                                    title='Volume'
                                />
                            </div>
                            <span class='value'>
                                ${{ volume }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Current supply is the total amount of a fund’s shares that is available for subscription.'
                                    :offset='[50, 8]'
                                    title='Current supply'
                                />
                            </div>
                            <span class='value'>
                                {{ currentSupply }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Streaming fee is an annualized fee on the total market cap of an Index set that its creator may accrue at any time. For example, an Index set is created with a 2% streaming fee. After 6 months, the creator may claim 1% of the total market cap of the Index set as fees.'
                                    :offset='[-30, 8]'
                                    title='Streaming fee'
                                />
                            </div>
                            <span class='value'>
                                {{ product.fees?.streamingFee || 'n/a' }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Mint fee is the fee charged when minting the fund token.'
                                    :offset='[60, 8]'
                                    title='Mint fee'
                                />
                            </div>
                            <span class='value'>
                                {{ product.fees?.mintRedeemFee || 'n/a' }}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class='inline'>
                            <div class='label'>
                                <field-popover
                                    content='Redeem fee is the fee charged when redeeming the fund token.'
                                    :offset='[-30, 8]'
                                    title='Redeem fee'
                                />
                            </div>
                            <span class='value'>
                                {{ product.fees?.mintRedeemFee || 'n/a' }}
                            </span>
                        </div>
                    </li>
                </ul>
                <div v-if='product.about' class='about-block'>
                    <p class='inner'>
                        {{ product.about }}
                    </p>
                </div>
            </div>
        </div>
        <div class='chart-case'>
            <div class='switch-tabs'>
                <button
                    v-for='(item, index) in chartTabs'
                    :key='index'
                    :class="{ 'active': item.name === currentChart }"
                    @click='switchTabs(item)'
                >
                    {{ item.name }}
                </button>
            </div>
            <div ref='chartDom' class='chart-box'></div>
        </div>
        <component :is='dynamicComponent' />
    </div>
    <div v-if='!loading' class='footer-handle'>
        <div v-if='userAddress' class='group'>
            <button class='purchase' @click="handleShowDialog('purchase')">
                Purchase
            </button>
            <button class='redeem' @click="handleShowDialog('redeem')">
                Redeem
            </button>
        </div>
        <button v-else class='connect' @click='startConnect'>
            Connect wallet
        </button>
    </div>
    <SupplyDialog ref='supplyDialogRef' v-model='dialogShow' :fund-data='fundActived' />
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useChart } from './hooks.js'
import { getMarketDetail_coingecko, getMarketChart_coingecko } from '@/api/fundDEX.js'
import { formatAmount, toFixed } from '@/utils/calculation.js'
import { useViewport } from '@/utils/hooks/useViewport'
import { productTokensBySymbolList } from '../config/config-indexCoop.js'
import * as echarts from 'echarts'
import { web3Hooks } from '@/plugins/web3/index'
import { localGet } from '@/utils/util'
import fieldPopover from '../components/field-popover.vue'
import SupplyDialog from '../components/indexCoop/supply-dialog.vue'
import { Toast } from 'vant'

const {
    executeConnect
} = web3Hooks()
const { bodyWidth } = useViewport()
const { newChart } = useChart()
const store = useStore()
const route = useRoute()
const userAddress = computed(() => store.state._web3.userAddress)
// 详情加载状态
const loading = ref(true)
// 申购弹窗显示
const dialogShow = ref(false)
const fundActived = ref('')
const supplyDialogRef = ref(null)
// 基金id
const { linkType, id, chainId } = route.query
// 当前基金产品信息
const product = productTokensBySymbolList.find(el => el.coingeckoId === id)
// 图表元素
const chartDom = ref(null)
// 图表加载状态
const chartLoading = ref(true)
// 图表选项列表
const chartTabs = ref([
    { name: '1D', value: 1 },
    { name: '1W', value: 7 },
    { name: '1M', value: 30 }
])
// 当前图表选项
const currentChart = ref('1D')
// NAV
const nav = ref('')
// Market Cap
const marketCap = ref('')
// Volume
const volume = ref('')
// Current Supply
const currentSupply = ref('')
// 钱包连接中
const connectLoading = ref(true)
// 动态组件
const dynamicComponent = ref('')

// 获取详情页动态组件
const getDynamicComponent = () => import('./components/' + product.symbol + '.vue').then(res => {
    dynamicComponent.value = res.default
})

// 获取基金详情
const queryFundDetail = () => {
    getMarketDetail_coingecko({
        id
    }).then(res => {
        loading.value = false
        const { market_data } = res
        marketCap.value = formatAmount(market_data.market_cap.usd)
        volume.value = formatAmount(market_data.total_volume.usd)
        currentSupply.value = toFixed(market_data.circulating_supply)
    }).catch(() => {
        loading.value = false
    })

    // 获取最新的价格,跟列表同步显示
    getMarketChart_coingecko({
        vs_currency: 'usd',
        id: id,
        days: 90
    }).then(res => {
        nav.value = toFixed(res['prices'][res['prices'].length - 1][1])
    })
}

// 申购 弹窗
const handleShowDialog = async (type) => {
    // if (!window.isPC) {
    //     Toast('Coming Soon')
    //     return false
    // }
    fundActived.value = {
        ...product,
        chainId: parseInt(chainId),
        marketLinkType: linkType
    }
    dialogShow.value = true
    if (type === 'redeem') {
        await nextTick()
        supplyDialogRef.value.switchSwapHandler()
    }
}

// 获取基金行情图表走势图
const queryFundChart = () => {
    const { value } = chartTabs.value.find(el => el.name === currentChart.value)
    getMarketChart_coingecko({
        id,
        vs_currency: 'usd',
        days: value,
        interval: 'hourly'
    }).then(res => {
        const xData = []
        const pricesData = []

        res['prices'].map(el => {
            xData.push((window.dayjs(el[0]).format('YYYY-MM-DD HH:mm')))
            pricesData.push(toFixed(el[1]))
        })
        const series = [
            {
                name: 'NAV',
                type: 'line',
                showSymbol: false,
                data: pricesData,
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
            }
        ]

        // 绘制图表
        newChart(chartDom.value, [xData, series], {
            'yAxis.ext': '$',
            'type': currentChart.value
        })

        chartLoading.value = false
    }).catch(() => {
        chartLoading.value = false
    })
}

// 切换图表选项
const switchTabs = (item) => {
    if (currentChart.value === item.name) return
    currentChart.value = item.name
    queryFundChart()
}

// 连接钱包
const startConnect = () => {
    executeConnect().then(() => {
        connectLoading.value = false
    }).catch(() => {
        connectLoading.value = false
    })
}

// 跳转到平台
const toPlatform = () => {
    // window.open('https://indexcoop.com')
}

onMounted(() => {
    // 获取详情页动态组件
    getDynamicComponent()
    // 获取基金详情
    queryFundDetail()
    // 获取基金行情图表走势图
    queryFundChart()
    // 连接狐狸钱包
    if (localGet('walletProvider')) {
        startConnect()
    }
})
</script>

<style lang="scss" scoped>
@import '../indexFundsDetail.scss'
</style>
