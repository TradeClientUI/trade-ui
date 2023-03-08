<template>
    <div class='topFunds-module'>
        <h2 class='title'>
            Top funds ranking
        </h2>
        <ul class='tab'>
            <li class='tab-item' :class="{ 'active': curTab == 1 }" @click='tabHandle(1)'>
                <span>Annual Percentage Yield(APY)</span>
            </li>
            <li class='tab-item' :class="{ 'active': curTab == 2 }" @click='tabHandle(2)'>
                Change
            </li>
        </ul>
        <van-skeleton v-if='skeletonShow' :row='5' row-width='100%' />
        <ul v-else class='list'>
            <li class='list-item header'>
                <span class='sequence'>
                    #
                </span>
                <span class='flex1'>
                    Fund name
                </span>
                <template v-if='curTab == 1'>
                    <van-popover v-model:show='showPopover' placement='left'>
                        <div class='tooltip-cont'>
                            {{ warnText }}
                        </div>
                        <template #reference>
                            <span>
                                APY
                                <van-icon name='info' />
                            </span>
                        </template>
                    </van-popover>
                </template>
                <span v-else>
                    24h Change%
                </span>
            </li>
            <li v-for='(item, index) in list' :key='item.id' class='list-item' @click='detailHandle(item)'>
                <div class='left'>
                    <p class='sequence'>
                        {{ index+1 }}
                    </p>
                    <div class='funds-info'>
                        <div class='info'>
                            <div class='logo-warp'>
                                <img
                                    v-if='curTab == 1'
                                    :alt='item.thirdCoinCode'
                                    class='fund-icon'
                                    :src='generateIcon(item.image, item.assetId)'
                                />
                                <img
                                    v-if='curTab == 2'
                                    :alt='item.thirdCoinCode'
                                    class='fund-icon'
                                    :src='generateIcon(item.image, item.assetId)'
                                />
                                <img alt='' class='logo' :src='"/images/platformIco/"+ item.platformCode +".ico"' />
                            </div>
                            <div v-if='curTab == 1' class='text'>
                                <p class='name'>
                                    {{ item.thirdCoinCode }}
                                </p>
                                <p>{{ item.displayMarketName }}</p>
                            </div>
                            <div v-if='curTab == 2' class='text'>
                                <p class='name'>
                                    {{ item.symbol }}
                                </p>
                                <p>{{ item.displayMarketName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='center'>
                    <template v-if='curTab == 1'>
                        <p v-if='parseFloat(item.apy) > 0 && parseFloat(item.apy) < 0.01'>
                            &lt; 0.01%
                        </p>
                        <p v-else-if='parseFloat(item.apy) === 0'>
                            0%
                        </p>
                        <p v-else>
                            {{ toFixed(item.apy) + '%' }}
                        </p>
                    </template>
                    <template v-if='curTab == 2'>
                        <p :class="parseFloat(item._1D) > 0 ? 'riseColor' : 'fallColor'">
                            {{ formatChg(item._1D) }}
                        </p>
                    </template>
                </div>
            </li>
        </ul>
        <p class='more-btn' @click='moreHandle'>
            View more rankings
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { productTokensBySymbolList, indexCoopFavLogo } from '@/themeCommon/user/fundDEX/config/config-indexCoop.js'
import { getMarketChart_coingecko } from '@/api/fundDEX.js'
import { divide, minus, toFixed, mul } from '@/utils/calculation'
import { generateIcon } from '@/plugins/web3/tools/icon'

const router = useRouter()
const store = useStore()

const list = ref([])
const curTab = ref(1)
const warnText = ref('Annual Percentage Yield(APY) is the projected interest on your deposit after one year.') // 提示文案
const showPopover = ref(false)
// 获取APY排行榜
const testnetMode = computed(() => store.state._web3.testnetMode)
const apyList = computed(() => {
    let list = []
    // if (testnetMode.value) list = store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
    // else list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1 )
    list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1 && el.marketName === 'ethereum') // 首页数据与testnetMode无关
    const newList = list.sort((a, b) => {
        const firstEl = b
        const secondEl = a
        return Number(firstEl['apy']) - Number(secondEl['apy'])
    })
    if (newList.length > 5) newList.length = 5
    return newList
})

// 是否显示骨架屏
const skeletonShow = ref(true)

// 获取24小时涨幅排行榜
const getIndexFunds = () => {
    // if (testnetMode.value) return list.value = []
    const promiseList = []
    const proList = []
    // 重新按产品列表组装显示的列表数据
    productTokensBySymbolList.map((item, index) => {
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
                    const _1D_val = dataArr[_length - 24][1]
                    const data = {
                        ...item,
                        id: item.coingeckoId,
                        NameSmall: item.name,
                        nav: toFixed(prices, 2),
                        _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                        _1D: (_1D_val ? toFixed(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                        Operta: '',
                        iconOrigin: indexCoopFavLogo
                    }
                    if (item.address) { // 只展示Ethereum  不要Polygon
                        proList.push({
                            ...data,
                            marketLinkType: 'Ethereum',
                            chainId: 1,
                        })
                    }
                    // if (item.polygonAddress) {
                    //     proList.push({
                    //         ...data,
                    //         marketLinkType: 'Polygon',
                    //         chainId: 137,
                    //     })
                    // }
                    resolve()
                }
            }).catch(err => {
                proList.push({
                    ...item,
                    id: item.coingeckoId,
                    NameSmall: item.name,
                    nav: 0,
                    _3M: '--',
                    Operta: '',
                    iconOrigin: indexCoopFavLogo
                })
                resolve()
            })
        })
        promiseList.push(promise)
    })

    Promise.all(promiseList).then(() => {
        let newList = []
        if (proList.length) {
            newList = proList.sort((a, b) => {
                return Number(b['_1D']) - Number(a['_1D'])
            })
        }
        list.value = newList.slice(0, 5)
        skeletonShow.value = false
    }).catch(() => {

    })
}
const tabHandle = async (index) => {
    skeletonShow.value = true
    curTab.value = index
    if (index === 1) {
        await store.dispatch('_web3/getAAVEMarkets')
        list.value = apyList.value
        skeletonShow.value = false
        warnText.value = 'Annual Percentage Yield(APY) is the projected interest on your deposit after one year.'
    }
    if (index === 2) {
        // getIndexFunds()
        getIndexfundsProducts()
        warnText.value = 'Total supplied is the total amount of a cryptocurrency that is supplied to the corresponding platform.'
    }
}

// 更多btn
const moreHandle = () => {
    curTab.value === 1 ? router.push('/earning') : router.push('/indexFunds')
}
// 去详情
const detailHandle = (item) => {
    if (curTab.value === 1) {
        if (testnetMode.value) {
            router.push('/earning')
        } else {
            router.push({
                path: '/earning/detail',
                query: {
                    platformCode: item.platformCode,
                    assetId: item.assetId,
                    marketId: item.marketId,
                    chainId: item.chainId,
                    decimals: item.decimals,
                    version: item.version,
                    marketName: item.marketName.toLowerCase(),
                    networkName: item.networkName
                }
            })
        }
    }
    if (curTab.value === 2) {
        if (testnetMode.value) {
            router.push('/indexFunds')
        } else {
            router.push({
                path: '/indexFunds/detail',
                query: {
                    id: item.id,
                    address: item.address,
                    chainId: item.chainId,
                    linkType: item.marketLinkType,
                    platformCode: item.platformCode,
                    networkName: item.networkName,
                    assetId: item.assetId,
                    marketName: item.marketName,
                }
            })
        }
    }
}

// 获取产品列表
const getIndexfundsProducts = () => {
    store.dispatch('_web3/getIndexfundsProducts', {
        // platformCode: 'indexcoop',
        // marketName: 'ethereum',
        networkType: 1,
        current: 1,
        size: 5,
        sortFieldName: 'dailyPercentChange',
        sortType: 'desc',
    }).then(res => {
        list.value = store.state._web3.indexfundsProducts
        skeletonShow.value = false
    }).catch(err => {
        skeletonShow.value = false
    })
}
// 格式化涨幅数据
const formatChg = (n) => {
    return toFixed(mul(n, 100), 2) + '%'
}

onMounted(() => {
    // 获取APY列表数据
    store.dispatch('_web3/getEarningMarkets')
    tabHandle(1)
})
</script>

<style lang="scss" scoped>
.topFunds-module {
    @include globalFont();
    font-weight: 500;
    width:100%;
    margin: 0 auto;
    padding: 0 rem(32px);
    .title {
        line-height: rem(72px);
        color:#111;
        font-size: rem(48px);
        margin: rem(96px) 0;
        text-align: center;
        font-weight: bold;
    }
    .tab {
        display: flex;
        align-items: center;
        border-bottom: rem(2px) solid rgba(0,0,0,0.15);
        &-item {
            padding: rem(16px) 0 rem(32px) ;
            color:#666666;
            font-size: rem(28px);
            font-weight: 600;
            vertical-align: middle;
            flex: 1;
            text-align: center;
            &:first-child{
                min-width: rem(440px);
            }
        }
        .active {
            color: #333;
            position: relative;
            &::after{
                display: block;
                position: absolute;
                right: 0;
                bottom: rem(-2px);
                left: 0;
                content: "";
                width: 100%;
                height: rem(2px);
                background: #000;
            }
        }
    }
    .list {
        column-count:1;
        column-gap:44px;
        &-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width:auto;
            height: rem(164px);
            padding: 0 rem(24px);
            .left {
                display: flex;
                align-items: center;
                .sequence {
                    font-size: rem(32px);
                    color:#999;
                    font-weight: 600;
                    margin-right: rem(16px);
                }
                .funds-info {
                    .info {
                        display: flex;
                        cursor: pointer;
                        .fund-icon {
                            display: block;
                            width: rem(100px);
                            border-radius: 100%;
                        }
                        .text {
                            font-size: rem(28px);
                            color:#999;
                            .name {
                                color: var(--color);
                                font-size: rem(32px);
                                font-weight: bold;
                                line-height: rem(48px);
                            }
                        }
                    }
                }
            }
            .flex1{
                flex: 1;
            }
            .center{
                font-size: rem(28px);
                font-weight: bold;
                color:#111;
            }
            .right {
                color:#111;
                font-size: 16px;
                font-weight: bold;
                .pk-btn {
                    font-size: rem(28px);
                    width: rem(112px);
                    line-height: rem(55px);
                    background: #E7F2FF;
                    border-radius: 8px;
                    color:#0062FF;
                    text-align: center;
                }
            }
            &.header{
                height: rem(98px);
                justify-content: flex-start;
                color: #333;
                border-bottom: rem(2px) solid rgba(0,0,0,0.15);
                .sequence {
                    font-size: rem(32px);
                    font-weight: 600;
                    margin-right: rem(16px);
                }
            }
        }
    }
    .more-btn {
        width: rem(350px);
        line-height: rem(78px);
        font-size: rem(28px);
        font-weight: 600;
        color: #0062FF;
        text-align: center;
        border-radius: rem(24px);
        border: rem(4px) solid rgba(0,0,0,0.2);
        margin: rem(80px) auto;
    }
    .logo-warp{
        position: relative;
        padding: 0 rem(16px);
        margin-right:rem(16px);
        .logo{
            position: absolute;
            width: rem(33px);
            right: 0;
            top: 0;
            background: var(--contentColor);
            border-radius: 100%;
            border: 1px solid var(--contentColor);
        }
    }
    .van-skeleton{
        margin-top: rem(32px);
        padding: 0;
        :deep(.van-skeleton__row){
            width: 100%!important;
            height: rem(64px);
        }
    }
}
.tooltip-cont{
    width: rem(400px);
    padding: rem(16px);
}
</style>
