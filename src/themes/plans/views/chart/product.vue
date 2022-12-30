
<template>
    <div class='page-wrap' :class='{ isIframe: isUniapp }'>
        <LayoutTop v-if='!isUniapp' :back='true' :menu='false'>
            <p class='symbolName'>
                <span v-if='product?.symbolName' class='sortIconSpan' @click='showSidebar=true'>
                    <i class='sortIcon icon_quanrejiaohuan-'></i>
                </span>
                <!-- <i v-if='product?.symbolName' class='icon_chouti1' @click='showSidebar=true'></i> -->
                {{ product?.symbolName }}
            </p>
            <!-- <p class='infomation'>
                {{ product?.symbolCode }} {{ $t('trade.update') }}:{{ formatTime(product?.tick_time) }}
            </p> -->

            <template #right>
                <div class='right-wrap'>
                    <button v-preventReClick class='collectIcon' @click='addOptional'>
                        <i
                            ref='collect'
                            :class="[!isSelfSymbol?'icon_zixuan11':'icon_zixuan2']"
                        ></i>
                    </button>
                    <div v-if='![3, 5, 9].includes(product?.tradeType)' class='ft'>
                        <span
                            @click='toContractInfo'
                        >
                            <i class='icon_guanyu1'></i>
                        </span>
                    </div>
                </div>
            </template>
        </LayoutTop>
        <Loading :show='loading' />

        <div class='productInfo'>
            <div v-if='product?.symbolDigits' class='hd'>
                <div class='hd-left'>
                    <p v-if='dealLastPrice' class='cur_price' :class='dealLastPrice?.price_color'>
                        {{ dealLastPrice.price ? parseFloat(dealLastPrice.price).toFixed(product?.symbolDigits) :'' }}
                    </p>
                </div>
                <div class='others'>
                    <span v-if='[1,2].includes(product?.tradeType)' :class='product?.rolling_upDownColor'>
                        {{ product.rolling_upDownAmount }}
                        <span>
                            ({{ product?.rolling_upDownAmount_pip }} {{ $t('trade.dot') }})
                        </span>
                    </span>
                    <div class='others-bottom'>
                        <span class='upDownAmount' :class='product.rolling_upDownColor'>
                            {{ product.rolling_upDownWidth }}
                        </span>
                    </div>
                </div>
                <div v-if='product.etf' class='ft'>
                    <ETF @click='etfTip' />
                </div>
            </div>
            <div v-if='product' class='bd'>
                <div class='item'>
                    <template v-if='product.isCryptocurrency'>
                        <p class='priceBottom'>
                            <span class='label'>
                                {{ $t('common.24hHigh') }}
                            </span>
                            <span>
                                {{ product.rolling_high_price }}
                            </span>
                        </p>
                        <p>
                            <span class='label'>
                                {{ $t('common.24hLow') }}
                            </span>
                            <span>
                                {{ product.rolling_low_price }}
                            </span>
                        </p>
                    </template>
                    <template v-else>
                        <p class='priceBottom'>
                            <span class='label'>
                                {{ $t('trade.todayOpen') }}
                            </span>
                            <span>
                                {{ product.open_price }}
                            </span>
                        </p>
                        <p>
                            <span class='label'>
                                {{ $t('trade.yesterdayClosed') }}
                            </span>
                            <span>
                                {{ product.yesterday_close_price }}
                            </span>
                        </p>
                    </template>
                    <p v-if='product.etf' class='priceTop'>
                        <span class='label'>
                            {{ $t('fundInfo.realtimeJZ') }}({{ product.fundCurrency }})
                        </span>
                        <span>
                            {{ product.currentNav || '--' }}
                        </span>
                    </p>
                </div>
                <div class='item'>
                    <template v-if='product.isCryptocurrency'>
                        <p class='priceBottom'>
                            <span class='label'>
                                {{ $t('common.24hNumber') }}({{ product.baseCurrency }})
                            </span>
                            <span>
                                {{ formatAmount(product.rolling_transactions_number) }}
                            </span>
                        </p>
                        <p>
                            <span class='label'>
                                {{ $t('common.24hAmount') }}({{ product.profitCurrency }})
                            </span>
                            <span>
                                {{ formatAmount(product.rolling_amount) }}
                            </span>
                        </p>
                    </template>
                    <template v-else>
                        <p class='priceBottom'>
                            <span class='label'>
                                {{ $t('trade.high') }}
                            </span>
                            <span>
                                {{ product.high_price }}
                            </span>
                        </p>
                        <p>
                            <span class='label'>
                                {{ $t('trade.low') }}
                            </span>
                            <span>
                                {{ product.low_price }}
                            </span>
                        </p>
                    </template>

                    <p v-if='product.etf' class='priceTop'>
                        <span class='label'>
                            {{ $t('fundInfo.premiumRate') }}({{ product.fundCurrency }})
                        </span>
                        <span>
                            {{ product.premiumRate || '--' }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class='placeholder'></div>
        <div class='tv-head'>
            <div class='tabs-wrap'>
                <van-tabs
                    v-model:active='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    :color='primaryColor'
                    line-height='2'
                    line-width='20'
                    :title-active-color='primaryColor'
                >
                    <van-tab
                        v-for='(item) in candleKTypeList.slice(0,6)'
                        :key='item.ktype'
                        :name='item.ktype'
                        :title='item.title'
                    />
                    <van-tab name='moreKTypes'>
                        <template #title class='other-time-tab'>
                            {{ moreKType.title }}
                        </template>
                    </van-tab>
                </van-tabs>

                <div class='more-time' :class='{ opened: moreTimeIsOpened }'>
                    <div v-show='moreTimeIsOpened' class='options van-hairline--surround'>
                        <div
                            v-for='(item,i) in candleKTypeList.slice(6)'
                            :key='i'
                            class='option'
                            :class='{ active: moreKType.title === item.title }'
                            @click='onClickMoreTime(item)'
                        >
                            {{ item.title }}
                        </div>
                    </div>
                    <div
                        v-show='moreTimeIsOpened'
                        class='mask'
                        @click.stop='moreTimeIsOpened = false'
                        @touchmove.stop='moreTimeIsOpened = false'
                    ></div>
                    <i class='icon_icon_arrow'></i>
                </div>

                <!-- 图表类型 -->
                <div class='flex-right'>
                    <van-dropdown-menu class='kIcon-wrap'>
                        <van-dropdown-item ref='klineTypeDropdown' v-model='klineType'>
                            <template #title>
                                <KIcon class='kIcon' :value='klineTypeIndex' />
                            </template>
                            <van-cell
                                v-for='(item, i) in klineTypeList'
                                :key='item.name'
                                :class="{ 'mainColor':klineType === item.value }"
                                is-link
                                @click='setChartType(item.value)'
                            >
                                <template #title>
                                    <span class='custom-title'>
                                        <KIcon class='kIcon' :value='i+1' />
                                        {{ item['title_zh'] }}
                                    </span>
                                </template>
                                <template #right-icon>
                                    <van-icon v-if='klineType===item.value' class='klineTypeRightIcon' name='success' />
                                </template>
                            </van-cell>
                        </van-dropdown-item>
                    </van-dropdown-menu>
                    <div class='setting' @click='settingStatus = !settingStatus'>
                        <i class='icon icon_shezhi'></i>
                        <div v-show='settingStatus' class='content van-hairline--surround' @click.stop=''>
                            <van-checkbox-group ref='checkboxGroup' v-model='settingList' @change='handleLineChange'>
                                <van-checkbox
                                    v-for='item in computedLineList'
                                    :key='item.value'

                                    class='item'
                                    icon-size='16px'
                                    :name='item.value'
                                >
                                    {{ item.title }}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                        <div
                            v-show='settingStatus'
                            class='mask'
                            @click.stop='settingStatus = false'
                            @touchmove.stop='settingStatus = false'
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show='studyVis' ref='mainStudyArea' class='study-area'>
            <div class='main-study'>
                <div class='content'>
                    <div
                        v-for='(item, i) in mainStudyList'
                        :key='i'
                        class='item'
                        :class='{ active: mainStudy === item.name }'
                        :color='primaryColor'
                    >
                        <span
                            class='inner-label'
                            @click='onClickStudy("main", item.name)'
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <span class='item more' @click='showStudyDialog = true'>
                        <span class='inner-label'>
                            {{ $t('chart.more') }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div v-if='firstDetail' class='chart-wrap'>
            <tv
                v-if='initialValue'
                ref='chartRef'
                :initial-value='initialValue'
                :options='initConfig'
                @indicatorRemoved='indicatorRemoved'
                @onChartReady='onChartReady'
                @orientationChanged='orientationChanged'
            />
        </div>
        <div v-show='studyVis' ref='mainStudyArea' class='study-area'>
            <div class='main-study'>
                <div class='content'>
                    <div
                        v-for='(item, i) in sideStudyList'
                        :key='i'
                        class='item'
                        :class='{ active: subStudy === item.name }'
                    >
                        <span
                            class='inner-label'
                            @click='onClickStudy("sub", item.name)'
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <span class='item more' @click='showStudyDialog = true'>
                        <span class='inner-label'>
                            {{ $t('chart.more') }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <StallsAndDeal
            v-if='product && product.tradeEnable===1 && dealModeShowMap[product.dealMode]?.handicap'
            :cur-price='product?.cur_price'
            :symbol-id='product?.symbolId'
            :trade-type='tradeType'
        />
        <div v-else-if='product && product.isIndex ' class='composeBox'>
            <realtime-invest-compose :symbol-id='product?.symbolId' :title='$t("fundInfo.indexSample")' />
        </div>

        <div v-if='product && product.tradeEnable===1' class='footerBtnBox'>
            <div class='trade-btn-wrap'>
                <div class='buy fallColorBg' @click="toOrder('buy')">
                    <i class='icon icon_mairu'></i>
                    <span class='text'>
                        {{ $t('trade.buyText') }}
                    </span>
                    <!-- <p class='price'>
                        {{ product.buy_price }}
                    </p> -->
                </div>
                <div class='sell riseColorBg' @click="toOrder('sell')">
                    <i class='icon icon_maichu'></i>
                    <span class='text'>
                        {{ $t('trade.sellText') }}
                    </span>
                    <!-- <p class='price '>
                        {{ product.sell_price }}
                    </p> -->
                </div>
                <div v-if='product.etf' class='fundTradeBtn' :class='[lang]' @click='fundtokenLink'>
                    <span class='text'>
                        {{ $t('trade.purchaseRedeemBtn') }}
                    </span>
                </div>

                <!-- <span class='spread_text'>
                    {{ product.spread_text }}
                </span> -->
            </div>
        </div>
    </div>

    <StudyList
        :prop-main-study='mainStudy'
        :prop-sub-study='subStudy'
        :show='showStudyDialog'
        @update:show='updateShow'
        @updateStudy='updateStudy'
    />

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct v-model='showSidebar' :default-trade-type='product?.tradeType' :hide-trade-type='plansLen<=1' @select='onSelect' />
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import StudyList from './components/studyList.vue'
import { useI18n } from 'vue-i18n'
import { computed, reactive, toRefs, ref, unref, watch, onUnmounted, onMounted, nextTick, onBeforeUnmount } from 'vue'
import KIcon from './icons/kIcon.vue'
import { MAINSTUDIES, SUBSTUDIES, VolumeStudy } from '@/components/tradingview/datafeeds/userConfig/config'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { isEmpty, localSet, localGet, getCookie, setCookie } from '@/utils/util'
import { formatAmount, pow } from '@/utils/calculation'
import tv from '@/components/tradingview/tv'
import { QuoteSocket } from '@/plugins/socket/socket'
import StallsAndDeal from './components/StallsAndDeal'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import Loading from '@/components/loading.vue'
import ETF from '@plans/components/etfIcon.vue'
import sidebarProduct from '@plans/components/sidebarProduct.vue'
import Base from '@/store/modules/base'
import realtimeInvestCompose from '@plans/modules/fundInformation/realtimeInvestCompose.vue'
import { toolHooks } from '@plans/hooks/handicap'
import i18n, { loadLocaleMessages } from '@plans/i18n/i18n.js'
import Colors, { setRootVariable } from '@plans/colorVariables'
import { findFundPage } from '@/api/fund'

export default {
    components: { KIcon, StudyList, tv, StallsAndDeal, Loading, sidebarProduct, ETF, realtimeInvestCompose },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const symbolId = ref(route.query.symbolId)
        const tradeType = ref(route.query.tradeType)
        const getSymbolId = () => unref(symbolId)
        const getTradeType = () => unref(tradeType)
        const { dealModeShowMap } = toolHooks()
        const originTitle = document.title

        // uniapp传参
        const { customerGroupId, theme, isUniapp } = route.query
        const lang = route.query.lang || getCookie('lang')

        const chartLocaleJSON = {
            'zh-CN': 'zh',
            'en-US': 'en',
            'zh-HK': 'zh_TW',
            'th-TH': 'th',
        }
        const chartLocale = chartLocaleJSON[lang] || chartLocaleJSON['en-US']

        const { t, locale } = useI18n({ useScope: 'global' })
        const klineTypeDropdown = ref(null)
        const collect = ref(null)
        const firstDetail = ref(false)
        const store = useStore()
        const candleKTypeList = [
            // {
            //     title: t('chart.timeSharing'),
            //     value: '1min',
            //     ktype: 'timeSharing',
            // },
            {
                title: t('chart.1min'),
                value: '1min',
                ktype: '1',
            }, {
                title: t('chart.15min'),
                value: '15min',
                ktype: '15',
            }, {
                title: t('chart.30min'),
                value: '30min',
                ktype: '30',
            }, {
                title: t('chart.1hour'),
                value: '1hour',
                ktype: '60',
            }, {
                title: t('chart.day'),
                value: 'day',
                ktype: '1D',
            }, {
                title: t('chart.week'),
                value: 'week',
                ktype: '1W',
            }, {
                title: t('chart.5min'),
                value: '5min',
                ktype: '5',
            }, {
                title: t('chart.2hour'),
                value: '2hour',
                ktype: '120',
            }, {
                title: t('chart.4hour'),
                value: '4hour',
                ktype: '240',
            }, {
                title: t('chart.month'),
                value: 'month',
                ktype: '1M',
            }
        ]

        const klineTypeList = [{
            name: 'kIcon1',
            title_zh: t('chart.bars'),
            title_en: 'Bars',
            value: 0,
        }, {
            name: 'kIcon2',
            title_zh: t('chart.candles'),
            title_en: 'Candles',
            value: 1,
        }, {
            name: 'kIcon3',
            title_zh: t('chart.hollowCandles'),
            title_en: 'Hollow Candles',
            value: 9,
        }, {
            name: 'kIcon4',
            title_zh: t('chart.heikinAshi'),
            title_en: 'Heikin Ashi',
            value: 8,
        }, {
            name: 'kIcon5',
            title_zh: t('chart.line'),
            title_en: 'Line',
            value: 2,
        }, {
            name: 'kIcon6',
            title_zh: t('chart.area'),
            title_en: 'Area',
            value: 3,
        }, {
            name: 'kIcon7',
            title_zh: t('chart.baseLine'),
            title_en: 'Baseline',
            value: 10,
        }]

        const state = reactive({
            activeTab: 0,
            moreKType: {
                title: t('chart.more'),
                ktype: null
            },
            moreTimeIsOpened: false,
            settingStatus: false,
            mainStudyList: MAINSTUDIES.slice(0, 5), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 5), // 副图
            studyVis: true,
            mainStudy: 'Moving Average mock',
            subStudy: 'Custom MACD',
            showStudyDialog: false,
            lineList: [
                {
                    title: t('chart.lastValueLine'),
                    value: 'showLastPrice'
                },
                // {
                //     title: t('chart.positionLine'),
                //     value: 'showPositionPrice',
                // },
                {
                    title: t('chart.buyLine'),
                    value: 'showBuyPrice',
                },
                {
                    title: t('chart.sellLine'),
                    value: 'showSellPrice',
                },
                {
                    title: t('trade.buySellFive'),
                    value: 'stalls',
                },
                {
                    title: t('trade.dealData'),
                    value: 'deal',
                }
            ],
            linesData: {
                showLastPrice: {
                    status: true
                },
                showPositionPrice: {
                    status: false
                },
                showBuyPrice: {
                    status: false
                },
                showSellPrice: {
                    status: false
                },
                stalls: {
                    status: false
                },
                deal: {
                    status: false
                }
            },
            settingList: [],
            klineType: 0,
            initConfig: {},
            symbolId: getSymbolId(),
            tradeType: getTradeType(),
            onChartReadyFlag: false,
            loading: false,
            isSelfSymbol: false,
            findFundPageList: [], // 基金产品列表
        })

        if (symbolId && tradeType) {
            store.commit('_quote/Update_productActivedID', `${symbolId.value}_${tradeType.value}`)
            store.commit('_quote/Update_lastProductActivedID', `${symbolId.value}_${tradeType.value}`)
        }

        const computedLineList = computed(() => {
            if (product.value?.tradeType === 9) {
                return state.lineList
            }
            return state.lineList.filter(e => !['stalls', 'deal'].includes(e.value))
        })

        const customerInfo = computed(() => store.state._user.customerInfo)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        // 图表组件引用
        const chartRef = ref(null)
        const klineTypeIndex = computed(() => {
            const curIndex = klineTypeList.findIndex(el => el.value === state.klineType)
            return curIndex + 1
        })
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList[getTradeType()] || [])
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })

        // 颜色值
        const style = computed(() => store.state.style)

        // 业务配置
        const businessConfig = computed(() => store.state.businessConfig)

        // 订阅产品
        const subscribeToProduct = () => {
            QuoteSocket.send_subscribe([`${getSymbolId()}_${getTradeType()}`])
            QuoteSocket.send_subscribe24H([`${getSymbolId()}_${getTradeType()}`])
            const curDigits = pow(0.1, product.value?.symbolDigits)
            QuoteSocket.deal_subscribe(getSymbolId(), 1, curDigits, getTradeType(), 1) // 该页面因为要实时更新成交量，所以改成订阅deal_subscribe成交记录显示最新价
        }

        const checkIsSelfSymbol = () => {
            if (isEmpty(customerInfo.value)) {
                const newId = getSymbolId() + '_' + getTradeType()
                if (localGet('localSelfSymbolList')) {
                    if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                        state.isSelfSymbol = true
                    } else {
                        state.isSelfSymbol = false
                    }
                } else {
                    state.isSelfSymbol = false
                }
            } else {
                state.isSelfSymbol = !isEmpty(selfSymbolList.value[getTradeType()]?.find(el => el.symbolId === parseInt(getSymbolId())))
            }
        }

        const dealLastPrice = computed(() => store.state._quote.dealLastPrice)

        // 现货产品的基础货币是【基金代币】的，显示【申/赎】按钮
        const fundtoken = computed(() => {
            return state.findFundPageList.find(el => el.shareTokenCode === product.value?.baseCurrency)
        })

        // 获取基金产品列表，
        const getFundPage = () => {
            findFundPage({ customerGroupId: store.getters.customerGroupId, size: 1000 }).then(res => {
                if (res.check()) {
                    state.findFundPageList = res.data.records
                }
            })
        }

        // 选择指标
        const onClickStudy = (type, name) => {
            const obj = {
                main: 'mainStudy',
                sub: 'subStudy'
            }
            const oldStudyName = state[obj[type]]

            if (oldStudyName === name) {
                removeStudy(type)
            } else {
                removeStudy(type)
                createStudy(type, name)
            }
        }

        // 设置图表周期
        const onBeforeChange = (name, title) => {
            if (name === 'moreKTypes') {
                state.moreTimeIsOpened = !state.moreTimeIsOpened
                return
            }
            if (name === 'timeSharing') {
                state.studyVis = false
            } else {
                state.studyVis = true
            }
            state.onChartReadyFlag && unref(chartRef).setResolution(name)
            localSetChartConfig('resolution', name)
            localSetChartConfig('moreKTypes', false)
            state.moreKType = { title: t('chart.more'), ktype: null }
            return true
        }

        // 设置图表类型
        const setChartType = (klineType) => {
            var property = {}
            state.klineType = klineType

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(klineType))
            localSetChartConfig('chartType', klineType)

            property.chartType = klineType
            // state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            klineTypeDropdown.value.toggle()
        }

        // 设置图表线
        const handleLineChange = (val, v) => {
            var property = {}
            if (val.indexOf('showBuyPrice') > -1) {
                property.showBuyPrice = true
            } else {
                property.showBuyPrice = false
            }

            if (val.indexOf('showPositionPrice') > -1) {
                property.showPositionPrice = true
            } else {
                property.showPositionPrice = false
            }

            if (val.indexOf('showSellPrice') > -1) {
                property.showSellPrice = true
            } else {
                property.showSellPrice = false
            }

            if (val.indexOf('showLastPrice') > -1) {
                property.showLastPrice = true
            } else {
                property.showLastPrice = false
            }
            renderChart(product.value, property)
        }

        // 重新渲染图表
        const renderChart = (product, property) => {
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product?.buy_price,
                sellPrice: product?.sell_price
            })

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(property.chartType))
            setPositionLine()
        }

        const setPositionLine = () => {
            const positionProducts = positionList.value.filter(item => item.symbolId === Number(getSymbolId()))
            if (positionProducts.length > 0) {
                const temp = []
                positionProducts.forEach(item => {
                    temp.push({
                        text: (Number(item.direction) === 1 ? t('trade.buy') : t('trade.sell')) + item.volume + t('trade.volumeUnit'),
                        quantity: item.openNum,
                        price: item.openPrice,
                        color: item.profit < 0 ? 'green' : 'red'
                    })
                })

                state.onChartReadyFlag && unref(chartRef).updatePosition(temp)
            }
        }

        // 更新指标
        const updateStudy = list => {
            const studyList = []
            const propsList = list.filter(item => item)
            if (propsList.length > 0) {
                propsList.forEach(el => {
                    const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === el) || null))
                    if (target) {
                        studyList.push(target)
                        state[target?.type] = target?.name
                        localSetChartConfig(target.type, JSON.stringify({
                            name: target?.name,
                            params: target?.params
                        }))
                    }
                })
            } else {
                localSetChartConfig('subStudy', null)
                localSetChartConfig('mainStudy', null)
            }

            if (studyList.length === 1 && studyList.find(el => el.type === 'mainStudy')) {
                localSetChartConfig('subStudy', null)
            } else if (studyList.length === 1 && studyList.find(el => el.type === 'subStudy')) {
                localSetChartConfig('mainStudy', null)
            }
            // console.log('studyList======', studyList)
            // state.onChartReadyFlag && unref(chartRef).updateIndicator(studyList)
            initChartData()

            state.onChartReadyFlag && unref(chartRef).updateIndicator(studyList)

            chartRef.value && chartRef.value.reset({
                initialValue: initialValue.value,
                options: unref(state.initConfig)
            })
        }

        // 增加指标
        const createStudy = (type, name) => {
            const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === name) || null))
            switch (type) {
                case 'main': {
                    state.mainStudy = target?.name
                    localSetChartConfig('mainStudy', JSON.stringify({
                        name: target?.name,
                        params: target?.params
                    }))
                    break
                }
                case 'sub': {
                    state.subStudy = target?.name
                    localSetChartConfig('subStudy', JSON.stringify({
                        name: target?.name,
                        params: target?.params
                    }))
                    break
                }
            }

            const property = [
                JSON.parse(JSON.parse(localGet('chartConfig')).mainStudy),
                JSON.parse(JSON.parse(localGet('chartConfig')).subStudy)
            ]

            state.onChartReadyFlag && unref(chartRef).updateIndicator(property)
        }

        // 删除指标
        const removeStudy = (type) => {
            switch (type) {
                case 'main': {
                    state.mainStudy = ''
                    localSetChartConfig('mainStudy', null)
                    break
                }
                case 'sub': {
                    state.subStudy = ''
                    localSetChartConfig('subStudy', null)
                    break
                }
            }

            const property = [
                JSON.parse(JSON.parse(localGet('chartConfig')).mainStudy),
                JSON.parse(JSON.parse(localGet('chartConfig')).subStudy)
            ]
            state.onChartReadyFlag && unref(chartRef).updateIndicator(property)
        }

        // 缓存图表设置
        const localSetChartConfig = (key, value) => {
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                chartConfig[key] = value
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({
                    [key]: value
                }))
            }
        }

        const updateShow = (val) => {
            state.showStudyDialog = val
        }

        const showTips = () => {
            Dialog.alert({
                title: t('trade.descTitle'),
                message: t('trade.nonStocksAndnonBullPointDesc'),
                confirmButtonColor: '#477fd3'
            }).then(() => {})
        }

        // 更多周期
        const onClickMoreTime = ({ title, ktype }) => {
            state.activeTab = 'moreKTypes'
            initOtherTime(title, ktype)
            state.onChartReadyFlag && unref(chartRef).setResolution(ktype)
            localSetChartConfig('resolution', ktype)
            localSetChartConfig('moreKTypes', true)
            state.moreTimeIsOpened = false
        }

        const initOtherTime = (title = this.$t('chart.more'), ktype = null) => {
            localSetChartConfig('resolution', ktype)
            state.moreKType = { title, ktype }
        }

        const orientationChanged = () => {

        }

        // 指标移除回调
        const indicatorRemoved = (name, val) => {
            if (name === state.subStudy) {
                removeStudy('sub')
            }
            if (name === state.mainStudy) {
                removeStudy('main')
            }
        }

        // 图表创建完成回调
        const onChartReady = (tv) => {
            state.onChartReadyFlag = true

            // 自动更新指标
            // const chart = tv.widget.activeChart()
            // setTimeout(() => {
            //     const allStudies = chart.getAllStudies()
            //     const chartConfig = JSON.parse(localGet('chartConfig'))
            //     if (!chartConfig) return false
            //     if (allStudies.length === 0 && (chartConfig.mainStudy || chartConfig.subStudy)) {
            //         if (chartConfig.mainStudy) {
            //             createStudy('mainStudy', JSON.parse(chartConfig.mainStudy).name)
            //         } else if (chartConfig.subStudy) {
            //             createStudy('subStudy', JSON.parse(chartConfig.subStudy).name)
            //         }
            //     }
            // }, 1000)
        }

        // 实时更新买卖价线
        watch(() => [dealLastPrice.value?.price], (newValues) => {
            if (newValues) {
                state.onChartReadyFlag && unref(chartRef).setTick(dealLastPrice.value.price, dealLastPrice.value.dealTime, dealLastPrice.value.volume)
            }

            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product.value?.buy_price,
                sellPrice: product.value?.sell_price
            })
        })

        watch(() => [state.settingList], (newValues) => {
            if (state.settingList.indexOf('showBuyPrice') > -1) {
                localSetChartConfig('showBuyPrice', true)
            } else {
                localSetChartConfig('showBuyPrice', false)
            }

            if (state.settingList.indexOf('showPositionPrice') > -1) {
                localSetChartConfig('showPositionPrice', true)
            } else {
                localSetChartConfig('showPositionPrice', false)
            }

            if (state.settingList.indexOf('showSellPrice') > -1) {
                localSetChartConfig('showSellPrice', true)
            } else {
                localSetChartConfig('showSellPrice', false)
            }

            if (state.settingList.indexOf('showLastPrice') > -1) {
                localSetChartConfig('showLastPrice', true)
            } else {
                localSetChartConfig('showLastPrice', false)
            }

            localSetChartConfig('lineSetList', state.settingList)
        })

        // 设置图表设置缓存
        let locChartConfig = JSON.parse(localGet('chartConfig'))
        const initChartData = () => {
            locChartConfig = JSON.parse(localGet('chartConfig'))
            let invertColor
            if (isUniapp) {
                loadLocaleMessages(i18n, lang).then(() => {
                    locale.value = lang // change!
                    setCookie('lang', lang, 'y10')
                    store.commit('del_cacheViews', 'Product')
                })
                invertColor = theme === 'light' ? 'Light' : 'Dark'
                setRootVariable(theme)
            } else {
                invertColor = localGet('invertColor') === 'light' ? 'Light' : 'Dark'
            }

            // 红 #ef5350  绿 #26a69a  chartColorType 1 绿涨红跌 2 红涨绿跌
            let upColor, downColor
            if (isEmpty(locChartConfig) || Number(locChartConfig?.chartColorType) === 1) {
                upColor = '#26a69a'
                downColor = '#ef5350'
            } else {
                upColor = '#ef5350'
                downColor = '#26a69a'
            }

            // 当前产品是否可以显示成交量，外汇、商品、指数类产品不显示成交量
            const canUseVolume = !product.value?.isFX && !product.value?.isCommodites && !product.value?.isIndex
            // 如果当前可以展示成交量，则显示在副图指标第一位，否则不显示成交量指标
            if (canUseVolume && SUBSTUDIES[0].name !== 'Volume') {
                SUBSTUDIES.unshift(VolumeStudy)
            } else if (!canUseVolume) {
                const volumeIndex = SUBSTUDIES.findIndex(el => el.name === 'Volume')
                if (volumeIndex > -1) SUBSTUDIES.splice(volumeIndex, 1)
            }
            state.sideStudyList = SUBSTUDIES.slice(0, 5)

            if (isEmpty(locChartConfig)) {
                localSetChartConfig('showLastPrice', false)
                localSetChartConfig('mainStudy', JSON.stringify(MAINSTUDIES[0]))
                localSetChartConfig('subStudy', JSON.stringify(SUBSTUDIES[0]))
                localSetChartConfig('resolution', 1)
                localSetChartConfig('lineSetList', [])
                localSetChartConfig('chartType', 1)
                if (isEmpty(locChartConfig?.chartColorType)) {
                    localSetChartConfig('chartColorType', '1')
                }

                localSetChartConfig('upColor', upColor)
                localSetChartConfig('downColor', downColor)
                // 默认选中现价线
                state.settingList = ['showLastPrice', 'stalls', 'deal']

                // 图表配置
                state.initConfig = ref({
                    property: {
                        showLastPrice: true, // 现价线
                        showPositionPrice: false, // 持仓线
                        showBuyPrice: false, // 买价线
                        showSellPrice: false, // 卖价线
                        showSeriesOHLC: true, // 高开低收
                        showBarChange: true, // 涨跌幅
                        chartType: '1', // 图表类型
                        showSeriesTitle: false, // K线标题
                        upColor: upColor,
                        downColor: downColor
                    },
                    indicators: [
                        {
                            name: 'Moving Average mock',
                            params: [true, false, [26, 2]]
                        },
                        {
                            name: 'Custom MACD',
                            params: [false, false, [12, 26, 'close', 9]]
                        }

                    ],
                    extension: {
                        theme: invertColor, // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'portrait',
                        locale: chartLocale
                    }
                })
            } else {
                state.mainStudy = JSON.parse(locChartConfig.mainStudy)?.name
                state.subStudy = JSON.parse(locChartConfig.subStudy)?.name
                if (state.subStudy === 'Volume' && !canUseVolume) {
                    state.subStudy = SUBSTUDIES[0].name
                    localSetChartConfig('subStudy', JSON.stringify(SUBSTUDIES[0]))
                    locChartConfig.subStudy = JSON.stringify(SUBSTUDIES[0])
                }

                state.klineType = locChartConfig.chartType
                state.settingList = locChartConfig.lineSetList

                const resolutionText = candleKTypeList.find(el => String(el.ktype) === String(locChartConfig?.resolution)).title || t('chart.1min')
                state.moreKType.title = resolutionText
                if (locChartConfig.moreKTypes) {
                    state.activeTab = 'moreKTypes'
                } else {
                    state.activeTab = candleKTypeList.find(item => String(item.ktype) === String(locChartConfig.resolution)).ktype
                    state.moreKType = { title: t('chart.more'), ktype: null }
                }
                state.initConfig = ref({
                    property: {
                        showLastPrice: locChartConfig.showLastPrice, // 现价线
                        showPositionPrice: locChartConfig.showPositionPrice, // 持仓线
                        showBuyPrice: locChartConfig.showBuyPrice, // 买价线
                        showSellPrice: locChartConfig.showSellPrice, // 卖价线
                        showSeriesOHLC: true, // 高开低收
                        showBarChange: true, // 涨跌幅
                        chartType: locChartConfig.chartType, // 图表类型
                        showSeriesTitle: false, // K线标题
                        upColor: upColor,
                        downColor: downColor

                    },
                    indicators: [
                        JSON.parse(locChartConfig.mainStudy),
                        JSON.parse(locChartConfig.subStudy)

                    ],
                    extension: {
                        theme: invertColor, // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'portrait',
                        locale: chartLocale
                    }
                })
            }
            firstDetail.value = true
            checkIsSelfSymbol()
        }

        // 图表初始值
        const initialValue = computed(() => {
            const resolution = JSON.parse(localGet('chartConfig'))?.resolution || 1
            if (product.value?.symbolName) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                    dealMode: product.value.dealMode, // 成交模式
                    tradeType: getTradeType(), // 玩法
                    interval: resolution // 周期
                }
            }
            return null
        })

        // 添加自选
        const addOptional = () => {
            if (isEmpty(customerInfo.value)) {
                // 未登录 缓存到本地
                var localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
                const newId = getSymbolId() + '_' + getTradeType()
                if (localSelfSymbolList.find(el => el === newId)) {
                    localSelfSymbolList.map((it, index) => {
                        if (it === newId) {
                            localSelfSymbolList.splice(index, 1)
                            state.isSelfSymbol = false
                            Toast(t('trade.removeOptionalOk'))
                        }
                    })
                } else {
                    localSelfSymbolList.push(newId)
                    state.isSelfSymbol = true
                    Toast(t('trade.addOptionalOk'))
                }
                // localSet('localSelfSymbolList', JSON.stringify(localSelfSymbolList))
                store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
                // Toast(t('common.noLogin'))
                // return router.push('/login')
            } else {
                state.loading = true
                if (state.isSelfSymbol) {
                    removeCustomerOptional({ symbolList: [getSymbolId()], tradeType: getTradeType() }).then(res => {
                        if (res.check()) {
                            state.loading = false
                            store.dispatch('_user/queryCustomerOptionalList')
                            state.isSelfSymbol = false
                            Toast(t('trade.removeOptionalOk'))
                        // collect.value.classList.remove('icon_zixuan2')
                        }
                    }).catch(err => {
                        state.loading = false
                    })
                } else {
                    addCustomerOptional({ symbolList: [getSymbolId()], tradeType: getTradeType() }).then(res => {
                        if (res.check()) {
                            state.loading = false
                            // 手动修改optional值
                            store.commit('_user/Update_optional', 1)
                            store.dispatch('_user/queryCustomerOptionalList')
                            // collect.value.classList.add('icon_zixuan2')
                            state.isSelfSymbol = true
                            Toast(t('trade.addOptionalOk'))
                        }
                    }).catch(err => {
                        state.loading = false
                    })
                }
            }
        }

        // 跳转下单页
        const toOrder = (direction) => {
            // eslint-disable-next-line no-undef
            if (isUniapp && uni) {
                // uni.navigateTo({
                //     url: `/pages/order/index?symbolId=${getSymbolId()}&direction=${direction}&tradeType=${getTradeType()}`
                // })
                // eslint-disable-next-line no-undef
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'order',
                        params: {
                            tradeType: getTradeType(),
                            symbolId: getSymbolId(),
                            direction: direction
                        }
                    }
                })
                return
            }
            router.push({
                path: '/order',
                query: {
                    symbolId: getSymbolId(), direction, tradeType: getTradeType()
                }
            })
        }

        // 格式化时间
        const formatTime = (val) => {
            if (val) { return window.dayjs(Number(val)).format('HH:mm:ss') }
        }

        // 跳转到基金的产品详情
        const fundtokenLink = () => {
            if (unref(businessConfig)?.v10Link) {
                router.push(unref(businessConfig).v10Link)
            } else {
                if (!unref(fundtoken)) {
                    return Toast(t('trade.noFeature'))
                }
                if (isUniapp && uni) {
                    return uni.postMessage({
                        data: {
                            action: 'message',
                            type: 'fund',
                            params: {
                                fundId: fundtoken.value.fundId
                            }
                        }
                    })
                }
                router.replace('/fundProductInfo??fundId=' + fundtoken.value.fundId)
            }
        }

        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', { symbolId: getSymbolId(), tradeType: getTradeType() }).then(() => {
            // 初始化图表配置
            initChartData()
        })

        // 获取基金列表
        getFundPage()

        const showSidebar = ref(false)

        const toContractInfo = () => {
            router.push({ path: '/contract', query: { symbolId: getSymbolId(), tradeType: getTradeType() } })
        }

        // 侧边栏-切换产品
        const onSelect = (product, close) => {
            router.replace({
                query: {
                    ...route.query,
                    symbolId: product.symbolId,
                    tradeType: product.tradeType,
                }
            }).then(() => {
                close()
            })
        }

        // 点击etf图标的提示
        const etfTip = () => {
            Dialog.alert({
                message: t('trade.productEtfTip'),
            })
        }

        // 切换产品时重新初始化数据
        watch(
            () => route.query.symbolId,
            async () => {
                state.onChartReadyFlag = false
                await nextTick()
                const query = route.query
                if (query.symbolId) {
                    symbolId.value = parseInt(query.symbolId)
                    tradeType.value = parseInt(query.tradeType)
                    store.dispatch('_quote/querySymbolInfo', { symbolId: getSymbolId(), tradeType: getTradeType() })
                    store.commit('_quote/Update_productActivedID', `${query.symbolId}_${query.tradeType}`)
                    store.commit('_quote/Update_lastProductActivedID', `${query.symbolId}_${query.tradeType}`)
                    await nextTick()
                    const product = store.getters.productActived
                    subscribeToProduct()
                    initChartData()
                    renderChart(product, state.initConfig.property)
                    chartRef.value.reset()
                }
            }
        )

        // 价格跳动修改页面title
        const unWatchPrice = watch(
            () => product.value?.cur_price,
            (newval, oldval) => {
                if (newval) {
                    document.title = `${newval} | ${product.value.symbolCode} | ${originTitle}`
                }
            },
            { immediate: true }
        )

        onMounted(() => {
            subscribeToProduct()
            checkIsSelfSymbol()
        })

        onBeforeUnmount(() => {
            unWatchPrice()
            QuoteSocket.cancel_subscribe(3)
            document.title = originTitle
        })

        return {
            ...toRefs(state),
            candleKTypeList,
            klineTypeList,
            onBeforeChange,
            onClickStudy,
            showTips,
            checkIsSelfSymbol,
            updateShow,
            onClickMoreTime,
            setChartType,
            klineTypeDropdown,
            klineTypeIndex,
            product,
            initialValue,
            indicatorRemoved,
            chartRef,
            handleLineChange,
            orientationChanged,
            positionList,
            onChartReady,
            addOptional,
            toOrder,
            collect,
            formatTime,
            showSidebar,
            toContractInfo,
            onSelect,
            computedLineList,
            style,
            primaryColor,
            dealModeShowMap,
            updateStudy,
            etfTip,
            fundtoken,
            fundtokenLink,
            formatAmount,
            plansLen,
            isUniapp,
            firstDetail,
            dealLastPrice,
            lang
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.page-wrap {
    width: 100%;
    //height: 100%;
    margin-top: rem(110px);
    margin-bottom: rem(140px);
    overflow: auto;
    background: var(--bgColor);
    .symbolName {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: rem(48px);
        .icon_chouti1 {
            margin-right: rem(20px);
            font-size: rem(26px);
        }
        .sortIconSpan {
            margin-right: 3px;
            padding-top: 5px;
        }
        .sortIcon {
            font-size: rem(50px);
            transform: rotate(90deg);
        }
    }
    &.isIframe {
        margin-top: 0;
    }
    .infomation {
        padding-top: rem(5px);
        color: var(--minorColor);
        font-size: rem(20px);
        line-height: rem(24px);
    }
    .right-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: rem(32px);
        .ft {
            margin-left: rem(30px);
            a {
                display: inline-block;
            }
            .icon_guanyu1 {
                //font-size: rem(36px);
                color: var(--normalColor);
            }
        }
        .collectIcon {
            width: rem(40px);
            height: 100%;
            color: var(--normalColor);
            vertical-align: top;
            //font-size: rem(36px);
            background-color: var(--contentColor);
            .icon_zixuan11 {
                font-weight: normal !important;
            }
            .icon_zixuan2 {
                color: #FC822F;
                animation: heartBeat 1.3s ease-in-out forwards;
            }
            .loading {
                position: relative;
                &::before {
                    position: absolute;
                    animation: loading 0.6s linear infinite;
                }
            }
            .zoomIn {
                position: relative;
                &::before {
                    position: absolute;
                    animation: zoomIn 0.6s linear forwards;
                }
            }
            &.disabled {
                background-color: #F00;
            }
        }
    }
    .productInfo {
        padding: rem(10px) rem(20px) rem(10px) rem(20px);
        background: var(--contentColor);
        .hd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-width: rem(265px);
            font-size: rem(24px);
            line-height: 1;
            .others {
                flex: 1;
                margin-left: rem(10px);
                > span {
                    display: block;
                    margin: rem(5px) 0;
                }
                .others-bottom {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                }
            }
            .expire-date {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                align-self: flex-end;
                justify-content: flex-end;
                color: #646566;
                font-size: rem(24px);
                white-space: nowrap;
                .value {
                    min-width: rem(153px);
                    text-align: right;
                }
            }
            .account-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: rem(14px) rem(17px) rem(10px);
                color: #FF8400;
                font-weight: 500;
                font-size: rem(21px);
                border: 2px solid #FF8400;
                border-radius: rem(10px);
                .text {
                    display: block;
                    margin-bottom: rem(5px);
                    font-size: rem(22px);
                    line-height: rem(24px);
                }
                .balance {
                    font-weight: 400;
                    font-size: rem(30px);
                    line-height: rem(32px);
                }
            }
            .hd-left {
                &.flex-auto {
                    flex: 1;
                }
                .hd-left-others {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    .others-bottom {
                        margin-left: rem(20px);
                    }
                }
            }
        }
        .bd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            width: 100%;
            padding-top: rem(20px);
            color: var(--normalColor);
            font-size: rem(24px);
            .item {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: rem(40px);
                &:first-child {
                    flex: none;
                    width: 43%;
                    margin-left: 0;
                }
                &:first-child {
                    margin-right: rem(5px);
                }
                > p {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: space-between;
                    white-space: nowrap;
                    color: var(--color);
                    &.priceBottom {
                        margin-bottom: rem(10px);
                    }
                    &.priceTop {
                        margin-top: rem(10px);
                    }
                    .label {
                        color: var(--minorColor);
                    }
                }
            }
            .point-value {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                .van-icon {
                    padding: 0 rem(5px);
                }
            }
        }
        .priceTime {
            position: absolute;
            top: rem(35px);
            right: rem(20px);
            color: #777;
        }
        .cur_price {
            font-size: rem(60px);
            // padding-bottom: rem(13px);
        }
        .upDownAmount {
            // padding-left: rem(20px);
        }
        .icon_icon_prompt {
            @include active();
            font-size: rem(40px);
            vertical-align: middle;
        }
    }
    .placeholder {
        height: rem(10px);
        background: var(--bgColor);
    }
    .tv-head {
        box-sizing: border-box;
        // 若高度调整，需同时处理vant-tab组件内的高度和行高等
        width: 100%;
        height: rem(60px);
        background-color: var(--contentColor);
    }
    .tabs-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100%;
        .van-popup {
            @include scroll();
        }
        .tabs {
            flex: 1;
            :deep(.van-tab) {
                flex: 1;
                flex-basis: auto !important;
                padding: 0;
                font-size: rem(24px);
                line-height: rem(60px);
                white-space: nowrap;
            }
            :deep(.van-tabs__wrap) {
                height: rem(60px);
                .van-tabs__nav--line {
                    padding-right: 0;
                    padding-bottom: 0;
                }
                .van-tabs__line {
                    bottom: 0;
                    width: auto;
                }
            }
        }
        .other-time-tab {
            min-width: rem(61px);
            white-space: nowrap;
            text-align: center;
        }
        .more-time {
            position: relative;
            height: 100%;
            padding: 0 4px 0 0;
            color: #646566;
            font-size: rem(24px);
            line-height: rem(60px);
            background-color: var(--contentColor);
            &.opened {
                &::after {
                    margin-top: -1px;
                    // border-color: transparent transparent currentColor currentColor;
                    transform: rotate(135deg);
                }
            }
            .options {
                position: absolute;
                top: rem(71px);
                left: rem(-100px);
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: rem(1px);
                background: var(--contentColor);
                //box-shadow: 0 0 2px 0 #EBEDF0;
                .option {
                    padding: rem(20px) rem(50px) rem(10px);
                    color: var(--normalColor);
                    line-height: rem(30px);
                    white-space: nowrap;
                    &.active {
                        color: var(--primary);
                    }
                }
            }
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            .icon_icon_arrow {
                color: var(--minorColor);
                font-size: rem(20px);
            }
        }
        .loadingIcon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: rem(80px);
            text-align: center;
            background: #FFF;
        }
        .flex-right {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .study-wrap,
        .kIcon-wrap {
            height: auto;
            :deep(.van-dropdown-menu__title) {
                padding-right: 0;
                padding-left: rem(28px);
                color: #646566;
                font-size: rem(24px);
            }
            :deep(.van-dropdown-menu__bar) {
                width: 100%;
                height: 100%;
                box-shadow: none;
            }
            .mainColor {
                color: var(--primary);
            }
        }
        .chartPositinLine {
            font-size: rem(40px);
        }
        .study-wrap {
            width: rem(120px);
            :deep(.van-dropdown-menu__bar) {
                .van-dropdown-menu__bar {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    padding-right: 13px;
                }
            }
        }
        .kIcon-wrap {
            width: rem(80px);
            padding-right: 0;
            :deep(.van-dropdown-menu__item) {
                background-color: var(--contentColor);
                .van-dropdown-menu__title::after {
                    display: none;
                }
            }
        }
        .kIcon {
            display: inline-block;
            width: rem(60px);
            color: var(--normalColor);
            text-align: center;
            vertical-align: middle;
        }
        .klineTypeRightIcon {
            padding-top: rem(10px);
            font-size: rem(36px);
        }
        .setting {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: rem(80px);
            background: var(--contentColor);
            .icon {
                color: var(--normalColor);
                font-size: rem(28px);
            }
            .content {
                position: absolute;
                top: rem(72px);
                right: 0;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                align-items: flex-start;
                justify-content: center;
                background: var(--contentColor);
                box-shadow: 0 0 2px 0 var(--contentColor);
                .item {
                    padding: rem(20px) rem(50px) rem(10px);
                    line-height: rem(30px);
                    white-space: nowrap;
                    &.active {
                        :deep(&.van-checkbox__icon--disabled) {
                            .van-icon {
                                background-color: #EBEDF0;
                                border-color: #C8C9CC;
                            }
                        }
                        .van-icon {
                            background-color: red;
                            border-color: red;
                        }
                        .van-checkbox__label {
                            color: red;
                            &.van-checkbox__label--disabled {
                                color: #C8C9CC;
                            }
                        }
                    }
                    :deep(.van-checkbox__label) {
                        color: var(--color);
                    }
                }
            }
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }
    .study-area {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: rem(60px);
        line-height: rem(60px);
        background: var(--contentColor);
        .main-study,
        .side-study {
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-end;
            justify-content: flex-start;
            height: 100%;
            overflow-x: auto;
            .content {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                white-space: nowrap;
                .item {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0 rem(10px);
                    color: #646566;
                    font-size: rem(24px);
                    text-align: center;
                    &.active {
                        color: var(--primary);
                        .inner-label {
                            color: var(--primary);
                        }
                    }
                    &.disabled {
                        color: var(--minorColor);
                    }
                    .inner-label {
                        flex: 1;
                        height: rem(50px);
                        color: var(--normalColor);
                        line-height: rem(45px);
                    }
                }
            }
        }
        .more {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            margin: 0 rem(10px);
            .inner-label {
                flex: 1;
                height: rem(50px);
                line-height: rem(45px);
            }
        }
    }

    // 底部按钮
    .footerBtnBox {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        width: 100%;
        //height: rem(100px);
        text-align: center;
        background: var(--contentColor);
        .watch {
            @include active();
            width: rem(110px);
            padding-top: rem(20px);
            line-height: 1;
            background-color: #FFF;
            .icon {
                font-size: rem(40px);
            }
            .text {
                padding-top: rem(8px);
                font-size: rem(20px);
            }
        }
        .trade-btn-wrap {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: rem(20px);
            font-weight: bold;
            white-space: nowrap;
            .buy {
                margin-right: rem(20px);
            }
            .fundTradeBtn {
                flex: none;
                width: rem(140px);
                margin-left: rem(20px);
                color: var(--primary);
                white-space: normal;
                text-align: center;
                word-break: break-word;
                background: none;
                border: 1px solid var(--primary);
                &.en-US {
                    .text {
                        font-size: rem(26px);
                    }
                }
            }
        }
        .sell,
        .fundTradeBtn,
        .buy {
            @include active();
            position: relative;
            flex: 1;
            color: #FFF;
            line-height: rem(100px);
            background-color: #858C9A;
            border-radius: 3px;
            &.fallColorBg {
                background-color: var(--riseColor);
            }
            &.riseColorBg {
                background-color: var(--fallColor);
            }
            .icon {
                margin-right: rem(20px);
                font-size: rem(20px);
                vertical-align: middle;
                opacity: 0.5;
            }
            .text {
                font-size: rem(34px);
                vertical-align: middle;
            }
        }
        .sell::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.15);
            content: '';
        }
        .text {
            font-size: rem(28px);
            vertical-align: middle;
        }
        .price {
            padding-top: rem(12px);
            font-size: rem(32px);
            vertical-align: middle;
            &.fallColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e674';
            }
            &.riseColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e675';
            }
        }
        .spread_text {
            position: absolute;
            top: 50%;
            left: 50%;
            height: rem(44px);
            padding: 0 rem(14px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(46px);
            background: var(--contentColor);
            border-radius: 3px;
            transform: translate(-50%, -50%);
        }
        .scrollToPosition {
            display: flex;
            flex: 0 0 rem(140px);
            flex-direction: row;
            align-content: center;
            justify-content: center;
            margin-right: rem(20px);
            color: #333;
            font-weight: 500;
            font-size: rem(28px);
            line-height: rem(100px);
            background: #EEE;
            border-radius: 3px;
        }
    }
    .chart-wrap {
        height: rem(720px);
    }
}
:deep(.van-checkbox__icon--checked .van-icon) {
    color: var(--van-white) !important;
    background-color: var(--primary) !important;
    border-color: var(--primary) !important;
}
.composeBox {
    box-sizing: content-box;
    margin-top: rem(30px);
    padding: rem(20px) rem(20px);
    background: var(--contentColor);
}
</style>
