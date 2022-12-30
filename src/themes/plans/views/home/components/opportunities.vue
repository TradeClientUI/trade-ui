<!--投资机会-->
<template>
    <div class='opportunities-module'>
        <h2 class='title'>
            {{ $t('homeJD.tradingIdeas') }}
        </h2>
        <p class='title-label'>
            {{ $t('homeJD.tradingIdeasDesc') }}
        </p>
        <Swiper
            class='Swiper'
            :long-swipes-ratio='0.1'
            :modules='modules'
            :pagination='true'
            slides-per-view='auto'
            :space-between='32'
        >
            <SwiperSlide v-for='item in list' :key='item.idIndex' style='width: 80%;' @click='detailHandle(item)'>
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
    // store.dispatch('_quote/fundNetValue', { fundId })
}

// 获取AAVE产品
const getAAVEMarkets = () => {
    // store.dispatch('_web3/getEarningMarkets')
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

const list = ref([{ 'idIndex': 1, 'title': 'V10 Index Fund', 'icon': '/images/banner2-center.png', 'dataValue': '--', 'label': 'Fund Size(USDT)', 'desc': 'Most reassuring', 'detailPath': '/fundV10/index' }, { 'idIndex': 2, 'title': 'USDC', 'icon': '/images/tokens/usdc.svg', 'label': 'APY', 'desc': 'Most popular', 'detailPath': '/earning/detail', 'listPath': '/earning' }, { 'idIndex': 3, 'title': 'DPI', 'icon': 'https://assets.coingecko.com/coins/images/12465/large/defi_pulse_index_set.png?1600051053', 'dataValue': '$19.91M', 'label': 'Market Cap', 'desc': 'Best-selling', 'detailPath': '/indexFunds/detail', 'listPath': '/indexFunds', 'networkName': 'Ethereum', 'detailSource': null, 'experimental': null, 'maxDrawdown': null, 'source': null, 'currentSupply': '302003.277097545', 'type': '4', 'operator': null, 'methodologist': null, 'redeemFee': null, 'score': null, 'createdAt': null, 'displayMarketName': 'Ethereum', 'holderCount': null, 'dailyPercentChange': '-0.0240', 'price': '65.95', 'id': 'DPI', 'weekPercentChange': '0.0499', 'image': 'https://assets.coingecko.com/coins/images/12465/large/defi_pulse_index_set.png?1600051053', 'marketCap': '19912435', 'streamingFee': '0.0095', 'apy': null, 'version': null, 'extend': null, 'volume': '74250', 'chainId': 1, 'name': 'DPI', 'operatorContribution': null, 'monthPercentChange': '-0.2576', 'threeMonthPercentChange': '-0.2726', 'platformCode': 'indexcoop', 'tradeCoins': [{ 'image': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880', 'thirdCoinCode': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Ethereum', 'extend': null, 'rate': null, 'assetId': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 'stable': true, 'decimals': 18, 'name': 'ETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'image': 'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png?1608607546', 'thirdCoinCode': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'stETH', 'extend': null, 'rate': null, 'assetId': '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', 'stable': false, 'decimals': 18, 'name': 'stETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'thirdCoinCode': 'defipulse-index', 'buyEnabled': null, 'components': [{ 'image': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Uniswap', 'totalPriceUsd': '19.00143580390162157898', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'UNI', 'percentOfSet': '28.73', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png?1601374110', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'AAVE', 'totalPriceUsd': '12.55723915838087913036', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'AAVE', 'percentOfSet': '18.99', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png?1585191826', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Maker', 'totalPriceUsd': '8.36573998285773810648', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'MKR', 'percentOfSet': '12.65', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/3406/small/SNX.png?1598631139', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Synthetix Network Token', 'totalPriceUsd': '5.77223680527482541858', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'SNX', 'percentOfSet': '8.73', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/913/small/LRC.png?1572852344', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'LoopringCoin V2', 'totalPriceUsd': '4.2347857554616369668728', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'LRC', 'percentOfSet': '6.40', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/10775/small/COMP.png?1592625425', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Compound', 'totalPriceUsd': '3.65883532345586556308', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'COMP', 'percentOfSet': '5.53', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a/logo.png', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'SushiToken', 'totalPriceUsd': '3.62751742749524229204', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'SUSHI', 'percentOfSet': '5.48', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Balancer', 'totalPriceUsd': '3.1807005475662288592', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'BAL', 'percentOfSet': '4.81', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png?1598325330', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'yearn.finance', 'totalPriceUsd': '2.83809463254982914459', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'YFI', 'percentOfSet': '4.29', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/3139/small/REN.png?1589985807', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Republic', 'totalPriceUsd': '1.639612039486262416532787', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'REN', 'percentOfSet': '2.48', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped Ether', 'totalPriceUsd': '0.00413566827226329333', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'WETH', 'percentOfSet': '0.01', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': null, 'isInterestBearing': null, 'issueFee': null, 'description': 'The DeFi Pulse Index (DPI) is a capitalization-weighted index that tracks the performance of decentralized financial assets across the market.', 'contractLink': 'https://etherscan.io/address/0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', 'yearPercentChange': null, 'cumulativeChange': null, 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', 'debtPositionHealth': null, 'networkType': 1, 'platformName': 'Index Coop', 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://indexcoop.com', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': 'DeFi Pulse Index', 'catsImage': null, 'sixMonthPercentChange': null, 'labelList': null, 'liquidityPoolType': null, 'marketName': 'ethereum', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'DPI', 'nav': '65.95', 'marketLinkType': 'ethereum', 'address': '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b' }, { 'idIndex': 4, 'title': 'iBTC-FLI-P', 'icon': 'https://assets.coingecko.com/coins/images/24177/large/iBTC-FLI-P_pulse_red.png?1646749712', 'dataValue': '13.83%', 'label': '3M Chg%', 'desc': 'Most potential', 'detailPath': '/indexFunds/detail', 'listPath': '/indexFunds', 'networkName': 'Polygon', 'detailSource': null, 'experimental': null, 'maxDrawdown': null, 'source': null, 'currentSupply': '774.0', 'type': '4', 'operator': null, 'methodologist': null, 'redeemFee': '0.001', 'score': null, 'createdAt': null, 'displayMarketName': 'Polygon', 'holderCount': null, 'dailyPercentChange': '-0.0282', 'price': '182.52', 'id': 'iBTC-FLI-P', 'weekPercentChange': '-0.0521', 'image': 'https://assets.coingecko.com/coins/images/24177/large/iBTC-FLI-P_pulse_red.png?1646749712', 'marketCap': '141174', 'streamingFee': '0.0195', 'apy': null, 'version': null, 'extend': null, 'volume': '274.7', 'chainId': 137, 'name': 'iBTC-FLI-P', 'operatorContribution': null, 'monthPercentChange': '0.1797', 'threeMonthPercentChange': '0.1383', 'platformCode': 'indexcoop', 'tradeCoins': [{ 'image': 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734', 'thirdCoinCode': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Dai', 'extend': null, 'rate': null, 'assetId': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 'stable': false, 'decimals': 18, 'name': 'DAI', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'image': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389', 'thirdCoinCode': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'USDC Coin', 'extend': null, 'rate': null, 'assetId': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'image': 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295', 'thirdCoinCode': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped Ether', 'extend': null, 'rate': null, 'assetId': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 'stable': false, 'decimals': 18, 'name': 'WETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'thirdCoinCode': 'inverse-btc-flexible-leverage-index', 'buyEnabled': null, 'components': [{ 'image': 'https://assets.coingecko.com/coins/images/17249/small/amUSDC_2x.png?1626941306', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Aave Matic Market USDC', 'totalPriceUsd': '369.491618377', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'amUSDC', 'percentOfSet': '203.49', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'image': 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6/logo.png', 'thirdCoinCode': null, 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped BTC', 'totalPriceUsd': '-179.3217685946', 'extend': null, 'fullAmountInSet': null, 'rate': null, 'assetId': null, 'stable': null, 'decimals': null, 'name': 'WBTC', 'percentOfSet': '-98.76', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': null, 'isInterestBearing': null, 'issueFee': '0.001', 'description': 'The Inverse BTC Flexible Leverage Index on Polygon (iBTC-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt. iBTC-FLI-P targets a short -1x exposure to BTC and employs a flexible leverage mechanism for optimal rebalancing outcomes.', 'contractLink': 'https://polygonscan.com/address/0x130ce4e4f76c2265f94a961d70618562de0bb8d2', 'yearPercentChange': null, 'cumulativeChange': null, 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x130ce4e4f76c2265f94a961d70618562de0bb8d2', 'debtPositionHealth': null, 'networkType': 1, 'platformName': 'Index Coop', 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://indexcoop.com', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': 'Inverse BTC Flexible Leverage Index', 'catsImage': null, 'sixMonthPercentChange': null, 'labelList': null, 'liquidityPoolType': null, 'marketName': 'polygon', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'iBTC-FLI-P', 'nav': '182.52', 'marketLinkType': 'polygon', 'polygonAddress': '0x130ce4e4f76c2265f94a961d70618562de0bb8d2' }])

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
    // getIndexDetail({
    //     platformCode: 'indexcoop',
    //     networkName: 'Ethereum',
    //     assetId: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
    //     marketName: 'ethereum',
    // }).then(res => {
    //     if (res.check() && res.data) {
    //         const resData = res.data
    //         resData.icon = resData.image
    //         resData.dataValue = '$' + formatAmount(resData.marketCap)
    //         Object.assign(list.value[2], resData)
    //     }
    // })

    // // fullName: "iBTC-FLI-P"
    // getIndexDetail({
    //     platformCode: 'indexcoop',
    //     networkName: 'Polygon',
    //     assetId: '0x130ce4e4f76c2265f94a961d70618562de0bb8d2',
    //     marketName: 'polygon',
    // }).then(res => {
    //     if (res.check() && res.data) {
    //         const resData = res.data
    //         resData.icon = resData.image
    //         resData.dataValue = formatChg(resData.threeMonthPercentChange)
    //         Object.assign(list.value[3], res.data)
    //     }
    // })
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
    width: 100%;
    padding: 0 rem(32px);
    font-weight: 500;

    --swiper-pagination-bullet-inactive-color: var(--minorColor);
    .title {
        text-align: center;
        color: var(--color);
        font-size: rem(48px);
        font-weight: bold;
        margin: rem(96px) 0 rem(16px);
        line-height: rem(72px);
        &-label {
            text-align: center;
            color: var(--color);
            font-size: rem(28px);
        }
    }
    .Swiper {
        margin-top: rem(96px);
        padding-bottom: rem(40px);
    }
    .list-item {
        background: var(--primaryAssistColor);
        border-radius: rem(20px);
        padding: rem(32px);
        margin-bottom: rem(32px);
        display: flex;
        flex-direction: column;
        .item-hd {
            color: var(--color);
            font-size: rem(28px);
            font-weight: 600;
            line-height: rem(48px);
            margin-bottom: rem(40px);
            .icon {
                display: inline-block;
                width: rem(60px);
                height: rem(60px);
                vertical-align: middle;
                margin-right: rem(24px);
            }
        }
        .info {
            color: var(--color);
            font-size: rem(64px);
            font-weight: 600;
            padding: rem(120px) 0 rem(88px);
            min-height: rem(225px);
            .unit {
                font-size: 30px;
                font-weight: 500;
            }
            .label {
                color: var(--mutedColor);
                font-weight: 400;
                font-size: rem(28px);
                margin-top: rem(8px);
            }
            .data {
                min-height: rem(84px);
            }
        }
        .info-text {
            height: rem(88px);
            font-size: rem(32px);
            color: var(--color);
            line-height: rem(48px);
            border-bottom: rem(2px) solid rgba(0, 0, 0, 0.15);
        }
        .more {
            color: var(--primary);
            font-size: rem(28px);
            font-weight: 600;
        }
    }
    :deep(.swiper-pagination) {
        bottom: 0;
    }
}
</style>
