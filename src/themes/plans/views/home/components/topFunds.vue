<template>
    <div class='topFunds-module'>
        <h2 class='title'>
            Top ranking
        </h2>
        <ul class='tab'>
            <li class='tab-item' :class="{ 'active': curTab == 1 }" @click='tabHandle(1)'>
                <span>Annual Percentage Yield(APY)</span>
            </li>
            <li class='tab-item' :class="{ 'active': curTab == 2 }" @click='tabHandle(2)'>
                Change
            </li>
        </ul>
        <van-skeleton v-if='(skeletonShow)' :row='5' row-width='100%' />
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
    list = [{ 'symbol': 'LUSD', 'thirdCoinCode': 'LUSD', 'availableFlowUsd': '228943.921157053556352177927573310847216436', 'riskLevel': null, 'apyBd': 0.19541238, 'marketDataLastTime': 1668772079000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.19541238, 'availableFlow': '221271.263992562642618574', 'contractLink': 'https://etherscan.io/address/0x5f98805a4e8be255a32880fdec7f6728c6568ba0', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '19.541238', 'savingsScale': '2344090.075247508219736759', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x5f98805a4e8be255a32880fdec7f6728c6568ba0', 'price': '1.034675343856438614', 'id': 562, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 2344090.075247508, 'aTokenAddress': '0xce1871f791548600cb59efbefFC9c38719142079', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_cd60aea6-f79e-4e43-8a6e-dfb023f6f718.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '2431559.70264176406872022844', 'catsCoinCode': null, 'savingsScaleUsd': '2431559.70264176406872022844', 'apy': '19.541238', 'liquidityRate': '178491220565833783709856144', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '90.560462', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_cd60aea6-f79e-4e43-8a6e-dfb023f6f718.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'CRV', 'thirdCoinCode': 'CRV', 'availableFlowUsd': '54054153.80910480902532046705218863973695832', 'riskLevel': null, 'apyBd': 0.05523722, 'marketDataLastTime': 1668775811000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.05523722, 'availableFlow': '95916790.44821238746694372', 'contractLink': 'https://etherscan.io/address/0xd533a949740bb3306d119cc777fa900ba034cd52', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '5.523722', 'savingsScale': '178861443.451126359557774463', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xd533a949740bb3306d119cc777fa900ba034cd52', 'price': '0.563552570478156806', 'id': 567, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 178861443.45112637, 'aTokenAddress': '0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_cd91f051-7aa0-48a9-aca0-d32a6bce4a78.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '101054976.99399322858916863135', 'catsCoinCode': null, 'savingsScaleUsd': '101054976.99399322858916863135', 'apy': '5.523722', 'liquidityRate': '53765597970486620412826512', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '46.37369', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_cd91f051-7aa0-48a9-aca0-d32a6bce4a78.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'AAVE', 'thirdCoinCode': 'Aave Token', 'availableFlowUsd': '559312.225999150479584694448695', 'riskLevel': null, 'apyBd': 0.05032751733416628, 'marketDataLastTime': null, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.020320324804163074, 'availableFlow': '9317.377749058207942845', 'contractLink': 'https://etherscan.io/address/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', 'detailSource': null, 'source': null, 'type': '5', 'marketId': null, 'aTokenApy': '0.020320324804163075', 'savingsScale': '16258.59540723967978017154251625', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', 'price': '60.028931', 'id': 508, 'networkType': 1, 'platformName': 'Compound', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 16258.59540723968, 'aTokenAddress': '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c', 'image': 'https://compound.finance/compound-components/assets/asset_AAVE.svg', 'platformUrl': 'https://app.compound.finance/', 'reserveSize': '213.4409805925902035362500000', 'catsCoinCode': null, 'savingsScaleUsd': '975986.10185810763798601269387153762875', 'apy': '5.0327517334166282809952567', 'liquidityRate': '0.020320324804163075', 'aTokenDecimals': 8, 'version': 'v2', 'capitalUseRatio': '0.8942038580901195', 'catsImage': null, 'cacheTime': 0, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'compound' }, { 'symbol': 'SNX', 'thirdCoinCode': 'SNX', 'availableFlowUsd': '3401973.536478830400412444896895445166148434', 'riskLevel': null, 'apyBd': 0.04114931, 'marketDataLastTime': 1668772043000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.04114931, 'availableFlow': '1979165.226841756723839838', 'contractLink': 'https://etherscan.io/address/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '4.114931', 'savingsScale': '4406402.26173228267537525', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', 'price': '1.718893142594018343', 'id': 583, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 4406402.261732283, 'aTokenAddress': '0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_27ced93e-afe2-4c99-98c3-bc3846ebbf3e.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '7593457.41507342487137250448', 'catsCoinCode': null, 'savingsScaleUsd': '7593457.41507342487137250448', 'apy': '4.114931', 'liquidityRate': '40325217451914131152278584', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '55.084327', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_27ced93e-afe2-4c99-98c3-bc3846ebbf3e.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'USDT', 'thirdCoinCode': 'USDT', 'availableFlowUsd': '74165178.756559', 'riskLevel': null, 'apyBd': 0.03454324, 'marketDataLastTime': 1668775403000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.03454324, 'availableFlow': '74165178.756559', 'contractLink': 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '3.454324', 'savingsScale': '350851440.462168', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xdac17f958d2ee523a2206206994597c13d831ec7', 'price': '1', 'id': 590, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 350851440.462168, 'aTokenAddress': '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_4d41f902-3545-435d-845e-5e286bc3f549.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '351746516.518376716833074821', 'catsCoinCode': null, 'savingsScaleUsd': '351746516.518376716833074821', 'apy': '3.454324', 'liquidityRate': '33960016855604135070785997', 'aTokenDecimals': 6, 'version': 'v2', 'capitalUseRatio': '78.861372', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_4d41f902-3545-435d-845e-5e286bc3f549.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 6, 'platformCode': 'aave' }, { 'symbol': 'GUSD', 'thirdCoinCode': 'GUSD', 'availableFlowUsd': '2167153.8174', 'riskLevel': null, 'apyBd': 0.02879536, 'marketDataLastTime': 1668763163000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02879536, 'availableFlow': '2189044.26', 'contractLink': 'https://etherscan.io/address/0x056fd409e1d7a124bd7017459dfea2f387b6d5cd', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '2.879536', 'savingsScale': '10640266.58', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd', 'price': '0.99', 'id': 577, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 10640266.58, 'aTokenAddress': '0xD37EE7e4f452C6638c96536e68090De8cBcdb583', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_93f0b403-0eb6-4b31-bec4-f930df316658.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '10640266.57999999157908666062', 'catsCoinCode': null, 'savingsScaleUsd': '10640266.57999999157908666062', 'apy': '2.879536', 'liquidityRate': '28388573793018488631775974', 'aTokenDecimals': 2, 'version': 'v2', 'capitalUseRatio': '79.426791', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_93f0b403-0eb6-4b31-bec4-f930df316658.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 2, 'platformCode': 'aave' }, { 'symbol': 'renFIL', 'thirdCoinCode': 'renFIL', 'availableFlowUsd': '110013.448834774811677215271822974742807412', 'riskLevel': null, 'apyBd': 0.02859172, 'marketDataLastTime': 1668712811000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02859172, 'availableFlow': '25074.801976111169062094', 'contractLink': 'https://etherscan.io/address/0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '2.859172', 'savingsScale': '84728.336147096392948933', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5', 'price': '4.387410474451001398', 'id': 570, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 84728.33614709639, 'aTokenAddress': '0x514cd6756CCBe28772d4Cb81bC3156BA9d1744aa', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_8a95e61b-376a-4816-bc61-49a6a5377aa5.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '372686.3503539229124486357', 'catsCoinCode': null, 'savingsScaleUsd': '372686.3503539229124486357', 'apy': '2.859172', 'liquidityRate': '28190611002329763742870480', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '70.405648', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_8a95e61b-376a-4816-bc61-49a6a5377aa5.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'TUSD', 'thirdCoinCode': 'TrueUSD', 'availableFlowUsd': '2758634.836361186283815452000000', 'riskLevel': null, 'apyBd': 0.02693342477217233, 'marketDataLastTime': null, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.020561014496923623, 'availableFlow': '2758634.836361186283815452', 'contractLink': 'https://etherscan.io/address/0x0000000000085d4780b73119b644ae5ecd22b376', 'detailSource': null, 'source': null, 'type': '5', 'marketId': null, 'aTokenApy': '0.020561014496923623', 'savingsScale': '7969356.22399009124594157818976636', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x0000000000085d4780b73119b644ae5ecd22b376', 'price': '1.000000', 'id': 499, 'networkType': 1, 'platformName': 'Compound', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 7969356.223990091, 'aTokenAddress': '0x12392f67bdf24fae0af363c24ac620a2f67dad86', 'image': 'https://compound.finance/compound-components/assets/asset_TUSD.svg', 'platformUrl': 'https://app.compound.finance/', 'reserveSize': '192390.2433740375994181521000', 'catsCoinCode': null, 'savingsScaleUsd': '7969356.22399009124594157818976636000000', 'apy': '2.6933424772172330454957556', 'liquidityRate': '0.020561014496923623', 'aTokenDecimals': 8, 'version': 'v2', 'capitalUseRatio': '1.3940079154590225', 'catsImage': null, 'cacheTime': 0, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'compound' }, { 'symbol': 'FRAX', 'thirdCoinCode': 'FRAX', 'availableFlowUsd': '4973575.86712042093009874839792457396553564', 'riskLevel': null, 'apyBd': 0.02487077, 'marketDataLastTime': 1668774347000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02487077, 'availableFlow': '4989291.649594778570628566', 'contractLink': 'https://etherscan.io/address/0x853d955acef822db058eb8505911ed77f175b99e', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '2.487077', 'savingsScale': '23065055.750362735353543546', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x853d955acef822db058eb8505911ed77f175b99e', 'price': '0.99685009745308554', 'id': 545, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 23065055.750362735, 'aTokenAddress': '0xd4937682df3C8aEF4FE912A96A74121C0829E664', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_7db62bd4-21ce-40fc-a255-f0787418a745.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '23051060.23360865244501598697', 'catsCoinCode': null, 'savingsScaleUsd': '23051060.23360865244501598697', 'apy': '2.487077', 'liquidityRate': '24566530668502667847384061', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '78.368612', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_7db62bd4-21ce-40fc-a255-f0787418a745.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'sUSD', 'thirdCoinCode': 'sUSD', 'availableFlowUsd': '960183.48023452609360506377833055436060024', 'riskLevel': null, 'apyBd': 0.02295443, 'marketDataLastTime': 1668763367000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02295443, 'availableFlow': '955698.197660942196153956', 'contractLink': 'https://etherscan.io/address/0x57ab1ec28d129707052df4df418d58a2d46d5f51', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '2.295443', 'savingsScale': '3873065.526218308183893904', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x57ab1ec28d129707052df4df418d58a2d46d5f51', 'price': '1.00469319978269454', 'id': 553, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 3873065.526218308, 'aTokenAddress': '0x6C5024Cd4F8A59110119C56f8933403A539555EB', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_d88cafe4-0d11-4605-9b5d-19c2f204bfa6.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '3901169.75562454939667403161', 'catsCoinCode': null, 'savingsScaleUsd': '3901169.75562454939667403161', 'apy': '2.295443', 'liquidityRate': '22694948467411738975884317', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '75.324502', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_d88cafe4-0d11-4605-9b5d-19c2f204bfa6.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'BAL', 'thirdCoinCode': 'BAL', 'availableFlowUsd': '1678728.90978435758553845423437054500279376', 'riskLevel': null, 'apyBd': 0.02152552, 'marketDataLastTime': 1668770963000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02152552, 'availableFlow': '302672.624830930647919708', 'contractLink': 'https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '2.152552', 'savingsScale': '516233.545389475576012061', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xba100000625a3754423978a60c9317c58a424e3d', 'price': '5.54635197260431372', 'id': 539, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 516233.5453894756, 'aTokenAddress': '0x272F97b7a56a387aE942350bBC7Df5700f8a4576', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_098f2195-7bd4-4ace-8d85-215960144f38.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '2870517.4399511191097957691', 'catsCoinCode': null, 'savingsScaleUsd': '2870517.4399511191097957691', 'apy': '2.152552', 'liquidityRate': '21297126342800202785570068', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '41.369051', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_098f2195-7bd4-4ace-8d85-215960144f38.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'USDP', 'thirdCoinCode': 'Pax Dollar', 'availableFlowUsd': '10481.410248332136928679000000', 'riskLevel': null, 'apyBd': 0.020858880609523022, 'marketDataLastTime': null, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02020008856669577, 'availableFlow': '10481.410248332136928679', 'contractLink': 'https://etherscan.io/address/0x8e870d67f660d95d5be530380d0ec0bd388289e1', 'detailSource': null, 'source': null, 'type': '5', 'marketId': null, 'aTokenApy': '0.020200088566695771', 'savingsScale': '29759.73012245865958467179932305', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x8e870d67f660d95d5be530380d0ec0bd388289e1', 'price': '1.000000', 'id': 510, 'networkType': 1, 'platformName': 'Compound', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 29759.73012245866, 'aTokenAddress': '0x041171993284df560249b57358f931d9eb7b925d', 'image': 'https://compound.finance/compound-components/assets/asset_USDP.svg', 'platformUrl': 'https://app.compound.finance/', 'reserveSize': '470.1998070365752492822500000', 'catsCoinCode': null, 'savingsScaleUsd': '29759.73012245865958467179932305000000', 'apy': '2.0858880609523022602044758', 'liquidityRate': '0.020200088566695771', 'aTokenDecimals': 8, 'version': 'v2', 'capitalUseRatio': '1.3404753503445795', 'catsImage': null, 'cacheTime': 0, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'compound' }, { 'symbol': 'USDT', 'thirdCoinCode': 'USDT', 'availableFlowUsd': '115557954.581189000000', 'riskLevel': null, 'apyBd': 0.016373419422731243, 'marketDataLastTime': null, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.02205233018003883, 'availableFlow': '115557954.581189', 'contractLink': 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7', 'detailSource': null, 'source': null, 'type': '5', 'marketId': null, 'aTokenApy': '0.022052330180038831', 'savingsScale': '238775931.24705531730723727811563776', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0xdac17f958d2ee523a2206206994597c13d831ec7', 'price': '1.000000', 'id': 515, 'networkType': 1, 'platformName': 'Compound', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 238775931.24705532, 'aTokenAddress': '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', 'image': 'https://compound.finance/compound-components/assets/asset_USDT.svg', 'platformUrl': 'https://app.compound.finance/', 'reserveSize': '3330909.956006750000000000000', 'catsCoinCode': null, 'savingsScaleUsd': '238775931.24705531730723727811563776000000', 'apy': '1.637341942273124188878123', 'liquidityRate': '0.022052330180038831', 'aTokenDecimals': 8, 'version': 'v2', 'capitalUseRatio': '1.1687517318545724', 'catsImage': null, 'cacheTime': 0, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 6, 'platformCode': 'compound' }, { 'symbol': 'MANA', 'thirdCoinCode': 'MANA', 'availableFlowUsd': '4264963.06346217787107733886981068564766637', 'riskLevel': null, 'apyBd': 0.01554613, 'marketDataLastTime': 1668770987000, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.01554613, 'availableFlow': '10092333.884704970000038555', 'contractLink': 'https://etherscan.io/address/0x0f5d2fb29fb7d3cfee444a200298f468908cc942', 'detailSource': null, 'source': null, 'type': '5', 'marketId': '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5', 'aTokenApy': '1.554613', 'savingsScale': '16699041.496123988998979678', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', 'price': '0.422594328743500134', 'id': 544, 'networkType': 1, 'platformName': 'Aave', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 16699041.496123988, 'aTokenAddress': '0xa685a61171bb30d4072B338c80Cb7b2c865c873E', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_fc0cf567-5ef2-4555-b2da-1cfa63a2b47d.svg', 'platformUrl': 'https://aave.com', 'reserveSize': '7074923.52200060148437726519', 'catsCoinCode': null, 'savingsScaleUsd': '7074923.52200060148437726519', 'apy': '1.554613', 'liquidityRate': '15426533695358619696661170', 'aTokenDecimals': 18, 'version': 'v2', 'capitalUseRatio': '39.563394', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/aave_fc0cf567-5ef2-4555-b2da-1cfa63a2b47d.svg', 'cacheTime': 1668776402765, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'aave' }, { 'symbol': 'SUSHI', 'thirdCoinCode': 'SushiToken', 'availableFlowUsd': '2988720.760511153093817409650528', 'riskLevel': null, 'apyBd': 0.015113100722859053, 'marketDataLastTime': null, 'networkName': 'Ethereum', 'description': null, 'aTokenApyBd': 0.020475113999845782, 'availableFlow': '2231534.370267087201352194', 'contractLink': 'https://etherscan.io/address/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', 'detailSource': null, 'source': null, 'type': '5', 'marketId': null, 'aTokenApy': '0.020475113999845782', 'savingsScale': '2876129.70312643900938579220703544', 'trace': null, 'displayMarketName': 'Ethereum', 'whiteBookUrl': null, 'recharge': true, 'assetId': '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', 'price': '1.339312', 'id': 507, 'networkType': 1, 'platformName': 'Compound', 'class': 'com.cats.fundmarket.api.vo.eraning.EarningFundVo', 'savingsScaleBd': 2876129.703126439, 'aTokenAddress': '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7', 'image': 'https://compound.finance/compound-components/assets/asset_SUSHI.svg', 'platformUrl': 'https://app.compound.finance/', 'reserveSize': '5080.106407853914928470750000', 'catsCoinCode': null, 'savingsScaleUsd': '3852035.02495367728253850413238904921728', 'apy': '1.5113100722859052866598688', 'liquidityRate': '0.020475113999845782', 'aTokenDecimals': 8, 'version': 'v2', 'capitalUseRatio': '0.4625027399646148', 'catsImage': null, 'cacheTime': 0, 'extend': null, 'labelList': null, 'marketName': 'ethereum', 'chainId': 1, 'decimals': 18, 'platformCode': 'compound' }]
    // if (testnetMode.value) list = store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
    // else list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1 )
    // list = store.state._web3?.aaveProducts.filter(el => el.networkType === 1 && el.marketName === 'ethereum') // 首页数据与testnetMode无关
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
        // list.value = newList.slice(0, 5)
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
        list.value = [{ 'networkName': 'Polygon', 'maxDrawdown': null, 'experimental': null, 'detailSource': null, 'source': null, 'currentSupply': '0.31', 'type': null, 'operator': { 'image': null, 'lastName': null, 'website': null, 'description': null, 'full_company_name': null, 'lastActivityAt': '1664210256000', 'createdAt': null, 'firstName': 'dmitri', 'twitter': null, 'company': null, 'walletAddress': '0x23c5c19d2ad460b7cd1ea5d6a2274a3c53733238', 'class': 'com.cats.fundmarket.api.vo.index.IndexFundUserVo', 'username': null }, 'methodologist': null, 'redeemFee': null, 'score': '74.2445', 'createdAt': '1659013263000', 'holderCount': null, 'displayMarketName': 'Polygon', 'dailyPercentChange': '14778.9331', 'price': '2.02', 'id': 'J4F', 'weekPercentChange': '16178.2119', 'image': null, 'marketCap': '0.63', 'streamingFee': null, 'apy': '0.0604', 'version': null, 'volume': null, 'extend': null, 'chainId': 137, 'name': 'J4F', 'operatorContribution': null, 'monthPercentChange': '17598.7112', 'threeMonthPercentChange': '1.5663', 'platformCode': 'dhedge', 'thirdCoinCode': '4fun', 'tradeCoins': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0E-8', 'assetId': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'buyEnabled': null, 'components': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/matic.705ec800.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped Matic', 'totalPriceUsd': '-0.01', 'extend': null, 'fullAmountInSet': '0.202471375447655758', 'rate': '-0.06414900', 'assetId': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 'stable': null, 'decimals': 18, 'name': 'WMATIC', 'percentOfSet': '-1.5900', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'USD Coin', 'totalPriceUsd': '0.00', 'extend': null, 'fullAmountInSet': '0.439687', 'rate': '0E-8', 'assetId': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'stable': null, 'decimals': 6, 'name': 'USDC', 'percentOfSet': '0.0000', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': '5/5', 'isInterestBearing': null, 'issueFee': null, 'description': null, 'contractLink': 'https://polygonscan.com/address/0x56b1de29a0ace3df61f8e300a1458a4010b1f6c3', 'yearPercentChange': '1.2463', 'cumulativeChange': '', 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x56b1de29a0ace3df61f8e300a1458a4010b1f6c3', 'debtPositionHealth': null, 'platformName': 'dHEDGE', 'networkType': 1, 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://www.dhedge.org/', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': '4fun', 'catsImage': null, 'sixMonthPercentChange': '1.2463', 'liquidityPoolType': null, 'labelList': null, 'marketName': 'polygon', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'J4F', 'nav': '2.02', '_1D': 14778.9331, 'polygonAddress': '0x56b1de29a0ace3df61f8e300a1458a4010b1f6c3' }, { 'networkName': 'Polygon', 'maxDrawdown': null, 'experimental': null, 'detailSource': null, 'source': null, 'currentSupply': '1397.57', 'type': null, 'operator': { 'image': null, 'lastName': null, 'website': null, 'description': null, 'full_company_name': null, 'lastActivityAt': '1663072765000', 'createdAt': null, 'firstName': 'Mr. Wave', 'twitter': null, 'company': null, 'walletAddress': '0xe9f7eff2abe0e82516146e7a2d46072a906f179b', 'class': 'com.cats.fundmarket.api.vo.index.IndexFundUserVo', 'username': null }, 'methodologist': null, 'redeemFee': null, 'score': '134.1769', 'createdAt': '1645798780000', 'holderCount': null, 'displayMarketName': 'Polygon', 'dailyPercentChange': '0.3414', 'price': '0.79', 'id': 'WLC', 'weekPercentChange': '0.3507', 'image': 'svg', 'marketCap': '1107.81', 'streamingFee': null, 'apy': '0.0505', 'version': null, 'volume': null, 'extend': null, 'chainId': 137, 'name': 'WLC', 'operatorContribution': null, 'monthPercentChange': '-0.1269', 'threeMonthPercentChange': '0.2168', 'platformCode': 'dhedge', 'thirdCoinCode': 'Wavelet Capital', 'tradeCoins': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0.00153525', 'assetId': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'buyEnabled': null, 'components': [{ 'thirdCoinCode': null, 'image': 'data:image/png;base64,UklGRlYDAABXRUJQVlA4TEoDAAAvMUAMENfmIJIkRarqhbsH/34XNQgEkgj2tx1i20aS5Bjl6vvPQSRJipT+bZ4ChocptW3bMMja6JwB/v2HCEQgEARBMHvfteC7+uCAgSD4Hw747xT4DcZmPDbBwEAQDKwQDAQDwbuE8C4HLDttw8F/9B12uCAIgmdylm6PogYRiKIgOUgcgSgapf5JVJ9ikBikfDQxSgxSfpSYOEocBfn8r/1FIN238omjaJT2l+KJUcpP9an74lM8cTSi/Cia4lE0Aul/qb7E5EGKE0cTo3CEgmhixiNXFERAorZtZyN9adNvbNu2bdu2ba3atW3btm1rPHM6bf78f44gov8TAKLXrWgpjnW3M9LVNbJ3jytpXbEOGCs787zNtZFQ29wnv0vFQlkXbYEULWLqVbTW9SeZIGWTlIF1VFZXOqJIXi6E6FS1hsJ4pj6Sy+X7jpCgftaEqJEQLSTm1h+6+fEeT4JaYaMiRgKRfPPJB59nl++TIQaNEo2HIrns+NeF2ekFURg+QbAmC0Vyp39PT9PA7DVCVfriflEyqBbod0apoMugBlUqSgfT1qrVm0rJrBEAVLEoJYxfC9BlKS3rHoB8ZCUTgYWwwpfR5qtnt3AKIv+VrRaMtrz49fjcNo7Esr1Ym9WzxYWfT89vINAui0VmC9Mzy2938kIY7yaG52hMz7/fReJhS8Zzuy7u52m8I7LXJ+G5PZdffzvBsTLUIlDsvfLm/8KP48x0SGTXZ+enZ6SgT8DdWZiWhKEtyW2J2LtJzyNWevHFWlLTLm2xoLf4gI5l25QPrdmFf7fo+K2EPDp/5748urALEbe8WBJTANBpSePUqxuHN3I8Iq6/9mlulsiqG0AVQwG375bJUPDg3S/LHwjiVABQZ0K08P2YDFHBI6Ecjz58vlvAtAEAQJUstLjw5+Xl7QoULdt0YDNqTlWpQZ+Tpjs/n1zawSmQphw1Ow+A5go9Nf70ma0cj0z1q0BwdYYa8jJknbVGCMaC1diHjgPpUIAUAkeAfCiYmVbIMIgdS9djo58xBuJXlTuwcKhYDTTX9SYY0zJO7FsHlJU1EeY0zCNrlcBQ2ZHjaaZFomXmlduhBMbrJpuKolxt9LW0DGxco4uap9aBaA==', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'dHEDGE DAO', 'totalPriceUsd': '-73.47', 'extend': null, 'fullAmountInSet': '82.660000000000000000', 'rate': '-0.88880501', 'assetId': '0x8c92e38eca8210f4fcbf17f0951b198dd7668292', 'stable': null, 'decimals': 18, 'name': 'DHT', 'percentOfSet': '-6.6300', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/bear_token_icon.4ca7e0f8.png|https://app.dhedge.org/static/media/eth.093b3f87.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Toros Ethereum Bear 2X', 'totalPriceUsd': '107.00', 'extend': null, 'fullAmountInSet': '961.907390730270861062', 'rate': '0.11123219', 'assetId': '0x027da30fadab6202801f97be344e2348a2a92842', 'stable': null, 'decimals': 18, 'name': 'ETHBEAR2X', 'percentOfSet': '9.6600', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': '5/5', 'isInterestBearing': null, 'issueFee': null, 'description': null, 'contractLink': 'https://polygonscan.com/address/0x65c433dfa00d6219bd94b66628530970c8a5a45b', 'yearPercentChange': '-0.2269', 'cumulativeChange': '', 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x65c433dfa00d6219bd94b66628530970c8a5a45b', 'debtPositionHealth': null, 'platformName': 'dHEDGE', 'networkType': 1, 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://www.dhedge.org/', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': 'Wavelet Capital', 'catsImage': null, 'sixMonthPercentChange': '-0.3607', 'liquidityPoolType': null, 'labelList': null, 'marketName': 'polygon', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'WLC', 'nav': '0.79', '_1D': 0.3414, 'polygonAddress': '0x65c433dfa00d6219bd94b66628530970c8a5a45b' }, { 'networkName': 'Optimism', 'maxDrawdown': null, 'experimental': null, 'detailSource': null, 'source': null, 'currentSupply': '16.11', 'type': '4', 'operator': { 'image': null, 'lastName': null, 'website': null, 'description': null, 'full_company_name': null, 'lastActivityAt': '1653617436000', 'createdAt': null, 'firstName': 'ConvexMonster', 'twitter': null, 'company': null, 'walletAddress': '0x092314c3c7aab1f890facd3cec28cb3a4295d67d', 'class': 'com.cats.fundmarket.api.vo.index.IndexFundUserVo', 'username': null }, 'methodologist': null, 'redeemFee': null, 'score': '0.0', 'createdAt': '1652820795000', 'holderCount': null, 'displayMarketName': 'Optimism', 'dailyPercentChange': '0.1726', 'price': '0.62', 'id': 'CM69420', 'weekPercentChange': '-0.1282', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/dhedge_4d088eb6-5402-445b-aac7-8684235a99af.jpg', 'marketCap': '10.13', 'streamingFee': null, 'apy': '0.0476', 'version': null, 'volume': null, 'extend': null, 'chainId': 10, 'name': 'CM69420', 'operatorContribution': null, 'monthPercentChange': '-0.0127', 'threeMonthPercentChange': '-0.2956', 'platformCode': 'dhedge', 'thirdCoinCode': 'ConvexStrategies', 'tradeCoins': [{ 'thirdCoinCode': null, 'image': 'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/master/synths/sUSD.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '0.00279367', 'assetId': '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', 'stable': false, 'decimals': 18, 'name': 'sUSD', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '0.00085588', 'assetId': '0x7f5c764cbc14f9669b88837ca1490cca17c31607', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/dai.b262ea99.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '0.00089027', 'assetId': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', 'stable': false, 'decimals': 18, 'name': 'DAI', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdt.b8dd2f54.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '-0.00250000', 'assetId': '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', 'stable': false, 'decimals': 6, 'name': 'USDT', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/eth.093b3f87.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '1298.36178691', 'assetId': '0x4200000000000000000000000000000000000006', 'stable': false, 'decimals': 18, 'name': 'WETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/btc.93237c24.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '17558.28657425', 'assetId': '0x68f180fcce6836688e9084f035309e29bf0a2095', 'stable': false, 'decimals': 8, 'name': 'WBTC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/master/synths/sETH.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '1301.99177495', 'assetId': '0xe405de8f52ba7559f9df3c368500b6e6ae6cee49', 'stable': false, 'decimals': 18, 'name': 'sETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/master/synths/sBTC.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'optimism', 'fullName': null, 'extend': null, 'rate': '17607.34142637', 'assetId': '0x298b9b95708152ff6968aafd889c6586e9169f1d', 'stable': false, 'decimals': 18, 'name': 'sBTC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'buyEnabled': null, 'components': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/dai.b262ea99.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Dai', 'totalPriceUsd': '0.00', 'extend': null, 'fullAmountInSet': '0.001896132714643715', 'rate': '0.00089027', 'assetId': '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', 'stable': null, 'decimals': 18, 'name': 'DAI', 'percentOfSet': '0.0000', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/eth.093b3f87.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped Ethereum', 'totalPriceUsd': '5.59', 'extend': null, 'fullAmountInSet': '0.004305675087792885', 'rate': '1298.36178691', 'assetId': '0x4200000000000000000000000000000000000006', 'stable': null, 'decimals': 18, 'name': 'WETH', 'percentOfSet': '55.1800', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/btc.93237c24.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Wrapped Bitcoin', 'totalPriceUsd': '4.37', 'extend': null, 'fullAmountInSet': '0.00024903', 'rate': '17558.28657425', 'assetId': '0x68f180fcce6836688e9084f035309e29bf0a2095', 'stable': null, 'decimals': 8, 'name': 'WBTC', 'percentOfSet': '43.1400', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': '3/5', 'isInterestBearing': null, 'issueFee': null, 'description': null, 'contractLink': 'https://optimistic.etherscan.io/address/0x5f5642c2adc1fd6d995d1876de7469f9cdbfac24', 'yearPercentChange': '-0.3712', 'cumulativeChange': '', 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x5f5642c2adc1fd6d995d1876de7469f9cdbfac24', 'debtPositionHealth': null, 'platformName': 'dHEDGE', 'networkType': 1, 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://www.dhedge.org/', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': 'ConvexStrategies', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/dhedge_4d088eb6-5402-445b-aac7-8684235a99af.jpg', 'sixMonthPercentChange': '-0.3712', 'liquidityPoolType': null, 'labelList': null, 'marketName': 'optimism', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'CM69420', 'nav': '0.62', '_1D': 0.1726 }, { 'networkName': 'Polygon', 'maxDrawdown': null, 'experimental': null, 'detailSource': null, 'source': null, 'currentSupply': '0.00', 'type': '4', 'operator': { 'image': null, 'lastName': null, 'website': null, 'description': null, 'full_company_name': null, 'lastActivityAt': '0', 'createdAt': null, 'firstName': 'Marc O. Schmoeger', 'twitter': null, 'company': null, 'walletAddress': '0x2a87ef1811b888aabc899a51775f90c83795e23c', 'class': 'com.cats.fundmarket.api.vo.index.IndexFundUserVo', 'username': null }, 'methodologist': null, 'redeemFee': null, 'score': '0.0', 'createdAt': '1630880073000', 'holderCount': null, 'displayMarketName': 'Polygon', 'dailyPercentChange': '0.1226', 'price': '1.00', 'id': 'VBF', 'weekPercentChange': '0.1363', 'image': 'svg', 'marketCap': '59.66', 'streamingFee': null, 'apy': '0.0478', 'version': null, 'volume': null, 'extend': null, 'chainId': 137, 'name': 'VBF', 'operatorContribution': null, 'monthPercentChange': '0.3459', 'threeMonthPercentChange': '0.1712', 'platformCode': 'dhedge', 'thirdCoinCode': '(VBF) Vision Beyond Fund', 'tradeCoins': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0.00097424', 'assetId': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/eth.093b3f87.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '1344.69010339', 'assetId': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 'stable': false, 'decimals': 18, 'name': 'WETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/matic.705ec800.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0.14030472', 'assetId': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 'stable': false, 'decimals': 18, 'name': 'WMATIC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/sushi.53f796c4.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0.28581221', 'assetId': '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', 'stable': false, 'decimals': 18, 'name': 'SUSHI', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'buyEnabled': null, 'components': [], 'riskLevel': '5/5', 'isInterestBearing': null, 'issueFee': null, 'description': null, 'contractLink': 'https://polygonscan.com/address/0x90b11fce10a5dfbb9984b13460b912ac56678fac', 'yearPercentChange': '-0.4191', 'cumulativeChange': '', 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0x90b11fce10a5dfbb9984b13460b912ac56678fac', 'debtPositionHealth': null, 'platformName': 'dHEDGE', 'networkType': 1, 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://www.dhedge.org/', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': '(VBF) Vision Beyond Fund', 'catsImage': null, 'sixMonthPercentChange': '0.6995', 'liquidityPoolType': null, 'labelList': null, 'marketName': 'polygon', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'VBF', 'nav': '1.00', '_1D': 0.1226, 'polygonAddress': '0x90b11fce10a5dfbb9984b13460b912ac56678fac' }, { 'networkName': 'Polygon', 'maxDrawdown': null, 'experimental': null, 'detailSource': null, 'source': null, 'currentSupply': '100.06', 'type': '4', 'operator': { 'image': null, 'lastName': null, 'website': null, 'description': null, 'full_company_name': null, 'lastActivityAt': '1668040403000', 'createdAt': null, 'firstName': 'MN', 'twitter': null, 'company': null, 'walletAddress': '0x203444add0835d95aabbf7ab92b18a69e1f640f1', 'class': 'com.cats.fundmarket.api.vo.index.IndexFundUserVo', 'username': null }, 'methodologist': null, 'redeemFee': null, 'score': '0.0', 'createdAt': '1661939506000', 'holderCount': null, 'displayMarketName': 'Polygon', 'dailyPercentChange': '0.1006', 'price': '0.63', 'id': 'MNETH', 'weekPercentChange': '-0.2135', 'image': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/dhedge_135c9151-b277-496e-b1f4-2c89f8b75987.jpg', 'marketCap': '62.42', 'streamingFee': null, 'apy': '0.0474', 'version': null, 'volume': null, 'extend': null, 'chainId': 137, 'name': 'MNETH', 'operatorContribution': null, 'monthPercentChange': '-0.2127', 'threeMonthPercentChange': '-0.3754', 'platformCode': 'dhedge', 'thirdCoinCode': 'ETH Buy the Dip', 'tradeCoins': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/eth.093b3f87.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '1206.47581996', 'assetId': '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 'stable': false, 'decimals': 18, 'name': 'WETH', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }, { 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/usdc.c8fcab48.svg', 'priceUsd': null, 'positionType': null, 'networkName': 'polygon', 'fullName': null, 'extend': null, 'rate': '0.00017944', 'assetId': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 'stable': false, 'decimals': 6, 'name': 'USDC', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundTradeCoinVo' }], 'buyEnabled': null, 'components': [{ 'thirdCoinCode': null, 'image': 'https://app.dhedge.org/static/media/bear_token_icon.4ca7e0f8.png|https://app.dhedge.org/static/media/eth.093b3f87.svg', 'quantity': null, 'priceUsd': null, 'positionType': null, 'networkName': null, 'fullName': 'Toros Ethereum Bear 2X', 'totalPriceUsd': '7.75', 'extend': null, 'fullAmountInSet': '55.225588615156320140', 'rate': '0.14036868', 'assetId': '0x027da30fadab6202801f97be344e2348a2a92842', 'stable': null, 'decimals': 18, 'name': 'ETHBEAR2X', 'percentOfSet': '12.4200', 'networkType': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundComponentsVo', 'status': null }], 'riskLevel': '4/5', 'isInterestBearing': null, 'issueFee': null, 'description': null, 'contractLink': 'https://polygonscan.com/address/0xd186faadc5b25ba891f4a58e3baf4e2a6a2bfb23', 'yearPercentChange': '-0.3754', 'cumulativeChange': '', 'marketId': null, 'trace': null, 'sellEnabled': null, 'whiteBookUrl': null, 'assetId': '0xd186faadc5b25ba891f4a58e3baf4e2a6a2bfb23', 'debtPositionHealth': null, 'platformName': 'dHEDGE', 'networkType': 1, 'streamingFeePercentage': null, 'class': 'com.cats.fundmarket.api.vo.index.IndexFundVo', 'followerCount': null, 'aTokenAddress': null, 'platformUrl': 'https://www.dhedge.org/', 'catsCoinCode': null, 'currentLeverageRatio': null, 'fullName': 'ETH Buy the Dip', 'catsImage': 'https://cats2.s3.ap-east-1.amazonaws.com/fundMarket/dhedge_135c9151-b277-496e-b1f4-2c89f8b75987.jpg', 'sixMonthPercentChange': '-0.3754', 'liquidityPoolType': null, 'labelList': null, 'marketName': 'polygon', 'decimals': 18, 'targetLeverageRatio': null, 'symbol': 'MNETH', 'nav': '0.63', '_1D': 0.1006, 'polygonAddress': '0xd186faadc5b25ba891f4a58e3baf4e2a6a2bfb23' }]
        skeletonShow.value = false
        // getIndexFunds()
        // getIndexfundsProducts()
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
    /* store.dispatch('_web3/getIndexfundsProducts', {
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
    }) */
}
// 格式化涨幅数据
const formatChg = (n) => {
    return toFixed(mul(n, 100), 2) + '%'
}

onMounted(() => {
    // 获取APY列表数据
    // store.dispatch('_web3/getEarningMarkets')
    tabHandle(1)
})
</script>

<style lang="scss" scoped>
.topFunds-module {
    font-weight: 500;
    width: 100%;
    margin: 0 auto;
    padding: 0 rem(32px);

    --van-skeleton-row-background-color: var(--assistColor);
    .title {
        line-height: rem(72px);
        color: var(--color);
        font-size: rem(48px);
        margin: rem(96px) 0;
        text-align: center;
        font-weight: bold;
    }
    .tab {
        display: flex;
        align-items: center;
        border-bottom: rem(2px) solid rgba(0, 0, 0, 0.15);
        &-item {
            padding: rem(16px) 0 rem(32px);
            color: var(--normalColor);
            font-size: rem(28px);
            font-weight: 600;
            vertical-align: middle;
            flex: 1;
            text-align: center;
            &:first-child {
                min-width: rem(440px);
            }
        }
        .active {
            color: var(--color);
            position: relative;
            &::after {
                display: block;
                position: absolute;
                right: 0;
                bottom: rem(-2px);
                left: 0;
                content: '';
                width: 100%;
                height: rem(2px);
                background: #000;
            }
        }
    }
    .list {
        column-count: 1;
        column-gap: 44px;
        &-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: auto;
            height: rem(164px);
            padding: 0 rem(24px);
            .left {
                display: flex;
                align-items: center;
                .sequence {
                    font-size: rem(32px);
                    color: var(--mutedColor);
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
                            color: var(--mutedColor);
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
            .flex1 {
                flex: 1;
            }
            .center {
                font-size: rem(28px);
                font-weight: bold;
                color: var(--color);
            }
            .right {
                color: var(--color);
                font-size: 16px;
                font-weight: bold;
                .pk-btn {
                    font-size: rem(28px);
                    width: rem(112px);
                    line-height: rem(55px);
                    background: #E7F2FF;
                    border-radius: 8px;
                    color: #0062FF;
                    text-align: center;
                }
            }
            &.header {
                height: rem(98px);
                justify-content: flex-start;
                color: var(--color);
                border-bottom: rem(2px) solid rgba(0, 0, 0, 0.15);
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
        border: rem(4px) solid rgba(0, 0, 0, 0.2);
        margin: rem(80px) auto;
    }
    .logo-warp {
        position: relative;
        padding: 0 rem(16px);
        margin-right: rem(16px);
        .logo {
            position: absolute;
            width: rem(33px);
            right: 0;
            top: 0;
            background: var(--contentColor);
            border-radius: 100%;
            border: 1px solid var(--contentColor);
        }
    }
    .van-skeleton {
        margin-top: rem(32px);
        padding: 0;
        :deep(.van-skeleton__row) {
            width: 100% !important;
            height: rem(64px);
        }
    }
}
.tooltip-cont {
    width: rem(400px);
    padding: rem(16px);
}
body.night {
    .topFunds-module {
        .more-btn {
            background: var(--color);
        }
    }
}
</style>
