<!--投资机会-->
<template>
    <div class='opportunities-module'>
        <h2 class='title'>
            Investment selection
        </h2>
        <p class='title-label'>
            CATS selections boutique
        </p>
        <Swiper
            class='Swiper'
            :long-swipes-ratio='0.1'
            :modules='modules'
            :pagination='true'
            slides-per-view='auto'
            :space-between='32'
        >
            <SwiperSlide v-for='item in list' :key='item.idIndex' style='width:80%' @click='detailHandle(item)'>
                <div class='list-item'>
                    <div class='swipe-cont'>
                        <p class='info-text'>
                            {{ item.desc }}
                        </p>
                        <div class='info'>
                            <p class='item-hd'>
                                <img class='icon' :src='item.icon' />
                                <span>
                                    {{ item.title }}
                                </span>
                            </p>
                            <p class='data'>
                                <template v-if='item.idIndex == 0'>
                                    {{ formatAmount(fund.totalBalance) }}
                                </template>
                                <template v-else-if='item.idIndex == 1'>
                                    {{ AaveProductsData ? toFixed(AaveProductsData.apy) + '%' : '--' }}
                                </template>
                                <template v-else>
                                    {{ item.dataValue }}
                                </template>
                            </p>
                            <p class='label'>
                                {{ item.label }}
                            </p>
                        </div>
                        <p class='more'>
                            <span>Details ></span>
                        </p>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatAmount, toFixed, divide, minus, mul } from '@/utils/calculation.js'
import { getIndexDetail } from '@/api/fund.js'
import { getMarketChart_coingecko, getMarketDetail_coingecko } from '@/api/fundDEX.js'
import { Matic2xFLIP, DefiPulseIndex } from '@/themeCommon/user/fundDEX/config/config-indexCoop.js'
import { generateIcon } from '@/plugins/web3/tools/icon'
import { Pagination } from 'swiper'
import { Swiper } from 'swiper/vue/swiper'
import { SwiperSlide } from 'swiper/vue/swiper-slide'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.css'
const store = useStore()
const testnetMode = computed(() => store.state._web3.testnetMode)

// 当前基金id
const fundId = window['V10'] || 368
// // v10基金信息
const fund = computed(() => store.state._quote.fundInfo || {})
// 获取v10基金净值等数据
const queryFundNetValue = () => {
    store.dispatch('_quote/fundNetValue', { fundId })
}

// 获取AAVE产品
const getAAVEMarkets = () => {
    store.dispatch('_web3/getEarningMarkets')
}

// USDC产品
const AaveProductsData = computed(() => {
    if (store.state._web3?.aaveProducts.length) {
        let list = []
        // 不管是否开启测试模式都真实真实数据
        // if (testnetMode.value) {
        //     list = store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
        // } else {
        //     list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
        // }
        list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
        const AaveList = list.filter(item => {
            return item.thirdCoinCode === 'USDC' && Number(item.chainId) === 1
        })
        if (AaveList.length) {
            const newList = AaveList.map((item, index) => ({ ...item, index }))
            return newList[0]
        } else return {}
    }
    return {}
})

// 获取MATIC2x-FLI-P 和 Defi Pulse Index
const getIndexFunds = () => {
    const promiseList = []
    const proList = []
    // 重新按产品列表组装显示的列表数据
    const newProductTokensBySymbolList = [Matic2xFLIP, DefiPulseIndex]
    newProductTokensBySymbolList.map((item, index) => {
        // 获取90天的币种历史行情图表数据[时间戳,价格]
        const promise = new Promise((resolve) => {
            getMarketChart_coingecko({
                vs_currency: 'usd',
                id: item.coingeckoId,
                days: 90
            }).then(res => {
                if (res) {
                    const dataArr = res.prices
                    const _length = dataArr.length // 记录数据总条数,避免总条数不够90天的按最多条数计数
                    const prices = res.prices[_length - 1][1] // 最后一天,最近的价格
                    const _3M_val = dataArr[0][1]
                    const data = {
                        ...item,
                        id: item.coingeckoId,
                        NameSmall: item.name,
                        nav: toFixed(prices, 2),
                        _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                        Operta: '',
                    }
                    if (item.address) {
                        proList.push({
                            ...data,
                            marketLinkType: 'Ethereum',
                            chainId: 1,
                        })
                    }
                    if (item.polygonAddress) {
                        proList.push({
                            ...data,
                            marketLinkType: 'Polygon',
                            chainId: 137,
                        })
                    }
                    resolve()
                }
            }).catch(err => {
                proList.push({
                    ...item,
                    id: item.coingeckoId,
                    NameSmall: item.name,
                    nav: 0,
                    _1D: '--',
                    _1W: '--',
                    _1M: '--',
                    _3M: '--',
                    Operta: '',
                })
                resolve()
            })
        })
        promiseList.push(promise)
    })

    Promise.all(promiseList).then(() => {
        if (proList.length) {
            proList.forEach(item => {
                if (item.symbol === 'MATIC2x-FLI-P') {
                    list.value[3].icon = item.image
                    list.value[3].dataValue = item._3M + '%'
                    list.value[3] = Object.assign({}, list.value[3], item)
                }
                if (item.symbol === 'DPI' && item.marketLinkType === 'Ethereum') {
                    list.value[2].icon = item.image
                    list.value[2] = Object.assign({}, list.value[2], item)
                    // 获取详情中的Market cap值
                    getMarketDetail_coingecko({
                        id: item.coingeckoId
                    }).then(res => {
                        list.value[2].dataValue = '$' + formatAmount(res.market_data.market_cap.usd)
                        console.log('res', res)
                    }).catch(() => {
                    })
                }
            })
        }
    })
}

const list = ref([
    {
        idIndex: 0,
        title: 'V10 Index Fund',
        icon: require('../../../images/home/new_version/V10.png'),
        dataValue: '--',
        label: 'Fund Size(USDT)',
        desc: 'Most reassuring',
        detailPath: '/fundV10/index'
    },
    {
        idIndex: 1,
        title: 'USDC',
        icon: generateIcon('https://app.aave.com/icons/tokens/usdc.svg', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        label: 'APY',
        desc: 'Most popular',
        detailPath: '/earning/detail'
    },

    {
        idIndex: 2,
        title: 'DPI',
        icon: '',
        dataValue: '--',
        label: 'Market Cap',
        desc: 'Best-selling',
        detailPath: '/indexFunds/detail'
    },
    {
        idIndex: 3,
        title: 'iBTC-FLI-P',
        icon: 'https://assets.coingecko.com/coins/images/24177/small/iBTC-FLI-P_pulse_red.png',
        dataValue: '--',
        label: '3M Chg%',
        desc: 'Most potential',
        detailPath: '/indexFunds/detail'
    },
])

// 获取AMPL基金详情
// const queryfundDetail = (params) => {
//     marketDetail_AVVE(params).then(res => {
//         console.log('queryfundDetail-----', res.data)
//     })
// }

const router = useRouter()

const detailHandle = (item) => {
    if (item.idIndex === 0) {
        router.push({
            path: item.detailPath
        })
    }
    if (item.idIndex === 1) {
        if (testnetMode.value) {
            router.push({
                path: '/earning'
            })
        } else {
            router.push({
                path: item.detailPath,
                query: {
                    platformCode: AaveProductsData.value.platformCode,
                    assetId: AaveProductsData.value.assetId,
                    marketId: AaveProductsData.value.marketId,
                    chainId: AaveProductsData.value.chainId,
                    decimals: AaveProductsData.value.decimals,
                    version: AaveProductsData.value.version,
                    marketName: AaveProductsData.value.marketName,
                    networkName: AaveProductsData.value.networkName
                }
            })
        }
    }
    if (item.idIndex > 1) {
        if (testnetMode.value) {
            router.push({
                path: '/indexFunds'
            })
        } else {
            router.push({
                path: item.detailPath,
                query: {
                    id: item.id,
                    address: item.address,
                    // polygonAddress: item.polygonAddress,
                    linkType: item.marketLinkType,
                    chainId: item.chainId,
                    platformCode: item.platformCode,
                    networkName: item.networkName,
                    assetId: item.assetId,
                    marketName: item.marketName,
                }
            })
        }
    }
}

// 格式化涨幅数据
const formatChg = (n) => {
    return toFixed(mul(n, 100), 2) + '%'
}

const queryIndexDetail = (params) => {
    // fullName: "DeFi Pulse Index"
    getIndexDetail({
        platformCode: 'indexcoop',
        networkName: 'Ethereum',
        assetId: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
        marketName: 'ethereum',
    }).then(res => {
        if (res.check() && res.data) {
            const resData = res.data
            resData.icon = resData.image
            resData.dataValue = '$' + formatAmount(resData.marketCap)
            Object.assign(list.value[2], resData)
        }
    })

    // fullName: "iBTC-FLI-P"
    getIndexDetail({
        platformCode: 'indexcoop',
        networkName: 'Polygon',
        assetId: '0x130ce4e4f76c2265f94a961d70618562de0bb8d2',
        marketName: 'polygon',
    }).then(res => {
        if (res.check() && res.data) {
            const resData = res.data
            resData.icon = resData.image
            resData.dataValue = formatChg(resData.threeMonthPercentChange)
            Object.assign(list.value[3], res.data)
        }
    })
}
const swipeWidth = document.body.scrollWidth * 0.75
const modules = [Pagination]
onMounted(() => {
    queryFundNetValue()
    getAAVEMarkets()
    // getIndexFunds()
    queryIndexDetail()
})

</script>

<style lang="scss" scoped>
.opportunities-module {
    width:100%;
    padding:0 rem(32px);
    @include globalFont();
    font-weight: 500;
    .title {
        text-align: center;
        color:#111;
        font-size: rem(48px);
        font-weight: bold;
        margin: rem(96px) 0 rem(16px);
        line-height: rem(72px);
        &-label {
            text-align: center;
            color: #333333;
            font-size: rem(28px);
        }
    }
    .Swiper{
        margin-top: rem(96px);
    }
    .list-item {
        background: #F2F4F8;
        border-radius: rem(20px);
        padding: rem(32px);
        margin-bottom: rem(32px);
        display:flex;
        flex-direction:column;
        .item-hd {
            color:#111;
            font-size: rem(28px);
            font-weight: 600;
            line-height: rem(48px);
            margin-bottom: rem(40px);
            .icon {
                display: inline-block;
                width:rem(60px);
                height:rem(60px);
                vertical-align: middle;
                margin-right: rem(24px);
            }
        }
        .info {
            color:#111;
            font-size: rem(64px);
            font-weight: 600;
            padding: rem(120px) 0 rem(88px);
            min-height: rem(225px);
            .unit {
                font-size: 30px;
                font-weight: 500;
            }
            .label {
                color:#999;
                font-weight: 400;
                font-size: rem(28px);
                margin-top: rem(8px);
            }
            .data{
                min-height: rem(84px);
            }
        }
        .info-text {
            height: rem(88px);
            font-size: rem(32px);
            color: #333333;
            line-height: rem(48px);
            font-weight: 600;
            border-bottom:  rem(2px) solid rgba(0,0,0,0.15);;
        }
        .more {
            color: #0062FF;
            font-size: rem(28px);
            font-weight: 600;
        }
    }
    :deep(.swiper-pagination){
        bottom:0;
    }

}
</style>
