<!--投资机会-->
<template>
    <div class='opportunities-module'>
        <h2 class='title'>
            Investment selection
        </h2>
        <p class='title-label'>
            CATS selections boutique
        </p>
        <ul v-if='list.length' class='list'>
            <li v-for='item in list' :key='item.idIndex' class='list-item' @click='detailHandle(item)'>
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
                        <template v-if='item.idIndex == 1'>
                            {{ formatAmount(fund.totalBalance) }}
                        </template>
                        <template v-else-if='item.idIndex == 2'>
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
            </li>
        </ul>
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

const getCoinUrl = (code) => {
    if (!code) return ''
    const coinName = code.split('.')
    if (coinName[0]) {
        return '/images/tokens/' + coinName[0].toLowerCase() + '.svg'
    } else {
        return '/images/tokens/' + coinName.toLowerCase() + '.svg'
    }
}

const list = ref([
    { idIndex: 1, title: 'V10 Index Fund', icon: require('../../../images/home/bannerIcon/banner2-center.png'), dataValue: '--', label: 'Fund Size(USDT)', desc: 'Most reassuring', detailPath: '/fundV10/index' },
    { idIndex: 2, title: 'USDC', icon: getCoinUrl('USDC'), label: 'APY', desc: 'Most popular', detailPath: '/earning/detail', listPath: '/earning' },
    { idIndex: 3, title: 'DPI', icon: '', dataValue: '--', label: 'Market Cap', desc: 'Best-selling', detailPath: '/indexFunds/detail', listPath: '/indexFunds' },
    { idIndex: 4, title: 'iBTC-FLI-P', icon: 'https://assets.coingecko.com/coins/images/24177/small/iBTC-FLI-P_pulse_red.png', dataValue: '--', label: '3M Chg%', desc: 'Most potential', detailPath: '/indexFunds/detail', listPath: '/indexFunds' },
])

// 获取AMPL基金详情
// const queryfundDetail = (params) => {
//     marketDetail_AVVE(params).then(res => {
//         console.log('queryfundDetail-----', res.data)
//     })
// }

const router = useRouter()

const detailHandle = (item) => {
    if (item.idIndex === 1) {
        router.push({
            path: item.detailPath
        })
    }
    if (item.idIndex === 2) {
        // 如果funds页面开启测试模式，跳转到对应列表
        if (testnetMode.value) {
            router.push({
                path: item.listPath
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
    if (item.idIndex > 2) {
        // 如果funds页面开启测试模式，跳转到对应列表
        if (testnetMode.value) {
            router.push({
                path: item.listPath
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

onMounted(() => {
    queryFundNetValue()
    getAAVEMarkets()
    // getIndexFunds()
    queryIndexDetail()
})

</script>

<style lang="scss" scoped>
.opportunities-module {
    margin:80px auto;
    @include globalFont();
    @include pagePadding();
    font-weight: 500;
    .title {
        text-align: center;
        color:#111;
        font-size: 48px;
        line-height: 56px;
        font-weight: 700;
        &-label {
            text-align: center;
            color: var(--color);
            font-size: 16px;
            line-height: 20px;
            margin-top: 16px;
        }
    }
    .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 48px;
        &-item {
            background: #F2F4F8;
            border-radius: 8px;
            padding: 32px;
            flex:1;
            height: 368px;
            display:flex;flex-direction:column;
            cursor: pointer;
            margin-right:28px;
            &:last-child {
                margin-right:0;
            }
            &:hover {
                box-shadow: 0 0 5px 5px rgba(0,0,0,.1);
            }
            .item-hd {
                color:#111;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .icon {
                    display: block;
                    width:36px;
                    height:36px;
                    margin-right: 12px;
                }
            }
            .info {
                color:#111;
                font-size: 32px;
                font-weight: 600;
                padding: 64px 0 40px;
                line-height: 38px;
                .label {
                    color:#666;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    margin-top: 8px;
                }
            }
            .info-text {
                font-size: 20px;
                color: #333333;
                line-height: 30px;
                font-weight: 600;
                position: relative;
                padding-bottom: 20px;
                &::after{
                    display: block;
                    position: absolute;
                    right:0;
                    bottom: 0;
                    left:0;
                    content: '';
                    width:100%;
                    height:1px;
                    background:rgba(0,0,0,0.15);
                }
            }
            .more {
                color: var(--primary);
                font-size: 16px;
                margin-top:auto;
                font-weight: 600;
            }
        }
    }

}
</style>
