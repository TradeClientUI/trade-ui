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
        <el-skeleton v-if='!list.length' animated class='skeleton-wrap'>
            <template #template>
                <div v-for='item in 15' :key='item' class='skeleton-fild'>
                    <el-skeleton-item class='filed text' variant='text' />
                    <el-skeleton-item class='filed circle' variant='circle' />
                    <el-skeleton-item class='filed name' variant='p' />
                    <el-skeleton-item class='filed value' variant='p' />
                </div>
            </template>
        </el-skeleton>
        <template v-else>
            <div class='list list-header'>
                <p v-for='i in 3' :key='i' class='header-item'>
                    <span>#</span>
                    <span class='center'>
                        Fund name
                    </span>
                    <template v-if='curTab == 1'>
                        <el-tooltip
                            effect='light'
                            placement='top'
                        >
                            <template #content>
                                <div class='tooltip-cont'>
                                    {{ warnText }}
                                </div>
                            </template>
                            <span class='warnTabs'>
                                APY
                                <van-icon name='info' />
                            </span>
                        </el-tooltip>
                    </template>
                    <span v-else class='warnTabs'>
                        24h Change%
                    </span>
                </p>
            </div>
            <ul class='list'>
                <li v-for='(item, index) in list' :key='index' class='list-item'>
                    <div class='left'>
                        <p class='sequence'>
                            {{ index+1 }}
                        </p>
                        <div class='funds-info' @click='detailHandle(item)'>
                            <div class='info'>
                                <div class='logo-wrap'>
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

                    <div class='right'>
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
        </template>
        <p class='more-btn' @click='moreHandle'>
            View more rankings
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { productTokensBySymbolList } from '@/themeCommon/user/fundDEX/config/config-indexCoop.js'
import { getMarketChart_coingecko } from '@/api/fundDEX.js'
import { divide, minus, toFixed, mul } from '@/utils/calculation'
import { generateIcon } from '@/plugins/web3/tools/icon'

const router = useRouter()
const store = useStore()
const list = ref([])
const curTab = ref(1)
const warnText = ref('Annual Percentage Yield(APY) is the projected interest on your deposit after one year.') // 提示文案

// 获取APY排行榜
const testnetMode = computed(() => store.state._web3.testnetMode)
const apyList = computed(() => {
    let list = []
    // if (testnetMode.value) list = store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
    // else list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
    list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1 && el.marketName === 'ethereum') // 首页数据与testnetMode无关
    const newList = list.sort((a, b) => {
        const firstEl = b
        const secondEl = a
        return Number(firstEl['apy']) - Number(secondEl['apy'])
    })
    if (newList.length > 15) newList.length = 15
    return newList
})

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
                    }
                    if (item.address) {
                        proList.push({
                            ...data,
                            marketLinkType: 'Ethereum',
                            chainId: 1,
                        })
                    }
                    if (item.polygonAddress) {
                        if (item.symbol === 'DATA') {
                            console.log('222222', item.polygonAddress)
                        }
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
                    _3M: '--',
                    Operta: '',
                })
                resolve()
            })
        })
        promiseList.push(promise)
    })

    Promise.all(promiseList).then(() => {
        let newList = []
        console.log('proList', proList.length)
        if (proList.length) {
            newList = proList.sort((a, b) => {
                const firstEl = b
                const secondEl = a
                return Number(firstEl['_1D']) - Number(secondEl['_1D'])
            })
        }
        if (newList.length > 15) newList.length = 15
        list.value = newList
    }).catch(() => {

    })
}

const tabHandle = async (index) => {
    curTab.value = index
    list.value = []
    if (index === 1) {
        await store.dispatch('_web3/getAAVEMarkets')
        list.value = apyList.value
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
        size: 15,
        sortFieldName: 'dailyPercentChange',
        sortType: 'desc',
    }).then(res => {
        list.value = store.state._web3.indexfundsProducts
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
    @include pagePadding();
    font-weight: 500;
    .title {
        color:#111;
        font-size: 48px;
        line-height: 56px;
        margin:80px 0 58px;
        text-align: center;
        font-weight: 700;
    }
    .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        margin-bottom: 8px;
        &-item {
            padding-bottom: 16px;
            font-weight: 600;
            color:#666;
            font-size: 20px;
            vertical-align: middle;
            margin: 0 40px;
            .tips-icon {
                display: inline-block;
                vertical-align: middle;
                margin-left: 10px;
            }
            &:hover {
                cursor: pointer;
                color:var(--primary);
            }
        }
        .active {
            position: relative;
            color:var(--color);
            &::after {
                display: block;
                position: absolute;
                right:0;
                bottom: -1px;
                left:0;
                content: '';
                width:100%;
                height:1px;
                background: #000;
            }
        }
    }
    .list {
        // column-count:3;
        // column-gap:48px;
        // column-fill: auto;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        height: 412px;
        gap: 32px;
        &-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // width:352px;
            // border-bottom: 1px solid rgba(0,0,0,0.15);
            padding: 0 16px;
            height: 50px;
            break-inside: avoid; //指定每个容器只能完整的显示，不分裂
            .left {
                display: flex;
                align-items: center;
                .sequence {
                    font-size: 16px;
                    color:#999;
                    // padding-right: 8px;
                    font-weight: 600;
                    width: 20px;
                }
                .funds-info {
                    .info {
                        display: flex;
                        cursor: pointer;
                        .fund-icon {
                            display: block;
                            width:50px;
                            border-radius: 100%;
                        }
                        .text {
                            font-size: 14px;
                            color:#666;
                            font-weight: 400;
                            .name {
                                color: #111;
                                font-weight: 600;
                            }
                        }
                    }
                }
            }
            .right {
                color:var(--color);
                font-size: 14px;
                font-weight: 600;
                .pk-btn {
                    cursor: pointer;
                    font-size: 14px;
                    width: 56px;
                    height: 28px;
                    line-height: 28px;
                    background: #E7F2FF;
                    border-radius: 8px;
                    color:var(--primary);
                    text-align: center;
                }
            }
        }
        &-header{
            height: 34px;
            margin-bottom: 16px;
            .header-item{
                padding: 16px;
                width: calc((100% - 64px ) / 3);
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #999;
                font-weight: 600;
                .center{
                    flex: 1;
                    padding-left: 24px;
                }
            }
        }
    }
    .more-btn {
        width: 200px;
        line-height: 46px;
        color:var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid rgba(0,0,0,0.1);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
.logo-wrap{
    position: relative;
    padding: 0 8px;
    .logo{
        position: absolute;
        width: 16px;
        right: 8px;
        top: 0;
        background: var(--contentColor);
        border-radius: 100%;
        border: 1px solid var(--contentColor);
    }
}
.skeleton-wrap{
    column-count:3;
    column-gap:48px;
    margin-top: 36px;
}
.skeleton-fild{
    display: flex;
    justify-content: space-between;
    padding: 16px;
    .filed{
        height: 30px;
    }
    .text{
        width: 30px;
    }
    .circle{
        min-width: 30px;
        margin: 0 8px;
    }
    .name{
        margin-right: 64px;
    }
    .value{
        min-width: 40px;
        width: 40px;
        margin-left: auto;
    }
}
.warnTabs{
    cursor: pointer;
}
.tooltip-cont{
    max-width: 200px;
}
</style>
