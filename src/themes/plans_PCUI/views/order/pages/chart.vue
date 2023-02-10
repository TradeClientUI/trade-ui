<template>
    <div id='chartContent' class='chart-content' :class='{ full: isFull }'>
        <div class='symbol-info'>
            <div v-if='currencyList.length' class='item symbol-icon'>
                <div class='icon'>
                    <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
                    <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
                </div>
            </div>
            <div class='item symbol-name'>
                <p class='name'>
                    <span>{{ product?.symbolName }}</span>
                    <van-popover v-model:show='showEtfPopover' theme='dark'>
                        <p class='etfTip'>
                            {{ $t('trade.etfTip') }}
                        </p>
                        <template #reference>
                            <EtfIcon v-if='product?.etf' @mouseenter='showEtfPopover=true' @mouseleave='showEtfPopover=false' />
                        </template>
                    </van-popover>
                </p>
                <p :class='dealLastPrice?.price_color'>
                    {{ dealLastPrice?.price ? parseFloat(dealLastPrice?.price).toFixed(product.symbolDigits) : '--' }}
                </p>
            </div>
            <div class='item range'>
                <p class='muted'>
                    {{ product.isCryptocurrency ? $t('common.24hChange') : $t('common.updown') }}
                </p>
                <p>
                    <span :class='product?.rolling_upDownColor'>
                        {{ product?.rolling_upDownAmount ? product?.rolling_upDownAmount : '--' }}
                    </span>&nbsp;
                    <span :class='product?.rolling_upDownColor'>
                        {{ product?.rolling_upDownWidth ? product?.rolling_upDownWidth : '--' }}
                    </span>
                </p>
            </div>

            <template v-if='product.isCryptocurrency'>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('common.24hHigh') }}
                    </p>
                    <p>
                        {{ product?.rolling_high_price || '--' }}
                    </p>
                </div>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('common.24hLow') }}
                    </p>
                    <p>
                        {{ product?.rolling_low_price || '--' }}
                    </p>
                </div>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('common.24hNumber') }}
                    </p>
                    <p>
                        {{ product?.rolling_transactions_number ? formatAmount(product.rolling_transactions_number) : '--' }}
                    </p>
                </div>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('common.24hAmount') }}
                    </p>
                    <p>
                        {{ product?.rolling_amount ? formatAmount(product.rolling_amount) : '--' }}
                    </p>
                </div>
            </template>
            <template v-else>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('trade.todayOpen') }}
                    </p>
                    <p>
                        {{ product?.open_price || '--' }}
                    </p>
                </div>

                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('trade.yesterdayClosed') }}
                    </p>
                    <p>
                        {{ product?.yesterday_close_price || '--' }}
                    </p>
                </div>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('trade.high') }}
                    </p>
                    <p>
                        {{ product?.high_price || '--' }}
                    </p>
                </div>
                <div class='item ohlc'>
                    <p class='muted'>
                        {{ $t('trade.low') }}
                    </p>
                    <p>
                        {{ product?.low_price || '--' }}
                    </p>
                </div>
            </template>

            <div v-if='product.etf' class='item ohlc'>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.realtimeJZ') }}({{ product.fundCurrency }})
                    </span>  {{ product.currentNav || '--' }}
                </p>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.premiumRate') }}({{ product.fundCurrency }})
                    </span>  {{ product.premiumRate || '--' }}
                </p>
            </div>

            <div class='item collect'>
                <i
                    v-preventReClick
                    class='icon'
                    :class="[isOptional ? 'icon_hangqingliebiaoyijiazixuan' : 'icon_zixuankongxin']"
                    @click='addOptional'
                ></i>
                <i v-if='[1, 2].includes(product?.tradeType)' class='icon icon_heyuexiangqing' @click='$router.push(contractRoute)'></i>
            </div>
        </div>
        <div class='tv-head'>
            <div class='tabs-wrap'>
                <van-tabs
                    v-model:active='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    :color='$style.primary'
                    line-height='2'
                    line-width='20'
                    title-active-color='$style.primary'
                >
                    <van-tab
                        v-for='(item) in candleKTypeList'
                        :key='item.ktype'
                        :name='item.ktype'
                        :title='item.title'
                    />
                </van-tabs>
                <div class='tv-right'>
                    <span v-if='isFull' class='fullIcon' @click='fullHandler'>
                        <svg height='24' viewBox='0 0 24 24' width='22' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                            <g fill='none'>
                                <path d='M8.5 3.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.25 2.25 0 0 0 8.5 6.25v-2.5zm0 16.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 1 0-1.5h2.5a2.25 2.25 0 0 1 2.25 2.25v2.5zM16.25 3a.75.75 0 0 0-.75.75v2.5a2.25 2.25 0 0 0 2.25 2.25h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75zm-.75 17.25a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 0 0-1.5h-2.5a2.25 2.25 0 0 0-2.25 2.25v2.5z' fill='currentColor' />
                            </g>
                        </svg>
                    </span>
                    <span v-else class='fullIcon' @click='fullHandler'>
                        <svg height='28' viewBox='0 0 28 28' width='22' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z' fill='currentColor' />
                        </svg>
                    </span>

                    <!-- 图表类型 -->
                    <div class='dropdown'>
                        <el-dropdown :teleported='false' trigger='click'>
                            <KIcon class='kIcon' :value='klineTypeIndex' />
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-for='(item, i) in klineTypeList'
                                        :key='item.name'
                                        :class="{ 'mainColor':klineType === item.value }"
                                        @click='setChartType(item.value)'
                                    >
                                        <KIcon class='kIcon' :value='i+1' />
                                        <span class='type-text'>
                                            {{ item['title_zh'] }}
                                        </span>
                                        <van-icon v-if='klineType===item.value' name='success' size='12' />
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>

                    <div class='setting' @click='settingStatus = !settingStatus'>
                        <van-icon class='icon' name='setting-o' />

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
                        :color='$style.primary'
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
        <div class='chart'>
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

        <StudyList
            :prop-main-study='mainStudy'
            :prop-sub-study='subStudy'
            :show='showStudyDialog'
            @update:show='updateShow'
            @updateStudy='updateStudy'
        />
    </div>

    <Loading :show='loading' />
</template>

<script>
import { reactive, toRefs, computed, unref, ref, watch, onMounted, onUnmounted, provide, inject } from 'vue'
import { Dialog, Toast } from 'vant'
import tv from '@/components/tradingview/tv'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { isEmpty, localSet, localGet, getCookie } from '@/utils/util'
import { formatAmount } from '@/utils/calculation'
import EtfIcon from '@planspc/components/etfIcon.vue'
import KIcon from './components/icons/kIcon.vue'
import StudyList from './studyList.vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { MAINSTUDIES, SUBSTUDIES, VolumeStudy } from '@/components/tradingview/datafeeds/userConfig/config'
import Loading from '@/components/loading.vue'
import { ElMessage } from 'element-plus'
import useSymbolIcon from '@/hooks/useSymbolIcon'

export default {
    components: { tv, KIcon, EtfIcon, StudyList },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const { tradeType, symbolId } = route.query
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
            },
            {
                title: t('chart.5min'),
                value: '5min',
                ktype: '5',
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
            },
            {
                title: t('chart.2hour'),
                value: '2hour',
                ktype: '120',
            }, {
                title: t('chart.4hour'),
                value: '4hour',
                ktype: '240',
            },
            {
                title: t('chart.day'),
                value: 'day',
                ktype: '1D',
            },
            {
                title: t('chart.week'),
                value: 'week',
                ktype: '1W',
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

        // 图表组件引用
        const chartRef = ref(null)

        const state = reactive({
            activeName: 'first',
            studyVis: true,
            mainStudyList: MAINSTUDIES.slice(0, 10), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 10), // 副图
            mainStudy: 'Moving Average mock',
            subStudy: 'Custom MACD',
            activeTab: 0,
            settingStatus: false,
            settingList: [],
            initConfig: {},
            onChartReadyFlag: false,
            showEtfPopover: false,
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
            showStudyDialog: false,
            loading: false,
            klineType: 1,
            isOptional: false, // 是否自选
            isFull: false, // 是否全屏
        })

        // 是否是自选
        // const isSelfSymbol = computed(() => store.getters.userSelfSymbolList[product.value.tradeType]?.find(id => parseInt(id) === parseInt(product.value.symbolId)))

        // 产品信息
        const product = computed(() => store.getters.productActived)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const includeSymbol = computed(() => store.state._user.localSelfSymbolList.find(el => el === (parseInt(product.value.symbolId) + '_' + product.value.tradeType)))
        const isSelfSymbol = computed({
            get: () => {
                if (isEmpty(customerInfo.value)) {
                    const newId = parseInt(product.value.symbolId) + '_' + product.value.tradeType
                    if (localGet('localSelfSymbolList')) {
                        if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                } else if (product.value) {
                    return store.getters.userSelfSymbolList[product.value.tradeType]?.find(id => parseInt(id) === parseInt(product.value.symbolId))
                } else {
                    return false
                }
            },
            set: (val) => {
                state.isOptional = val
            },
        })
        const dealLastPrice = computed(() => store.state._quote.dealLastPrice)

        watch(() => isSelfSymbol.value, val => {
            state.isOptional = !!val
        }, { immediate: true })

        watch(() => includeSymbol.value, val => {
            state.isOptional = !!val
        }, { immediate: true })

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

        // 图表类型
        const klineTypeIndex = computed(() => {
            const curIndex = klineTypeList.findIndex(el => el.value === state.klineType)
            return curIndex + 1
        })

        // 图表初始值
        const initialValue = computed(() => {
            const resolution = JSON.parse(localGet('chartConfig'))?.resolution || 1
            if (product.value.symbolName) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                    dealMode: product.value.dealMode, // 成交模式
                    tradeType: product.value.tradeType, // 玩法
                    interval: resolution // 周期
                }
            }
            return null
        })
        const computedLineList = computed(() => {
            if (product.value.tradeType === 9) {
                return state.lineList
            }
            return state.lineList.filter(e => !['stalls', 'deal'].includes(e.value))
        })

        const orientationChanged = () => {

        }

        // 颜色值
        const style = computed(() => store.state.style)

        // const customerInfo = computed(() => store.state._user.customerInfo)

        // 重新渲染图表
        const renderChart = (product, property) => {
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product.buy_price,
                sellPrice: product.sell_price
            })

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(property.chartType))
            // setPositionLine()
        }
        // 合约属性路由
        const contractRoute = computed(() => (`${route.path}/contract?symbolId=${product.value?.symbolId}&tradeType=${product.value?.tradeType}`))

        // 实时更新买卖价线
        watch(() => [product.value?.buy_price, product.value?.sell_price, product.value?.cur_price, product.value?.tick_time], (newValues) => {
            state.onChartReadyFlag && unref(chartRef).setTick(product.value.cur_price, product.value.tick_time, dealLastPrice.value.volume)

            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product.value.buy_price,
                sellPrice: product.value.sell_price
            })
            checkIsSelfSymbol()
        })

        const handleClick = () => {

        }

        const checkIsSelfSymbol = () => {
            // 自选星标状态
            if (isEmpty(customerInfo.value)) {
                const newId = parseInt(product.value.symbolId) + '_' + product.value.tradeType
                if (localGet('localSelfSymbolList')) {
                    if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                        state.isOptional = true
                    } else {
                        state.isOptional = false
                    }
                }
            } else if (product.value) {
                state.isOptional = store.getters.userSelfSymbolList[product.value.tradeType]?.find(id => parseInt(id) === parseInt(product.value.symbolId))
            } else {
                state.isOptional = false
            }
        }

        // 添加自选
        const addOptional = () => {
            if (isEmpty(customerInfo.value)) {
                // ElMessage.warning(t('common.noLogin'))
                // return router.push('/login')

                // 未登录 缓存到本地
                var localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
                const newId = parseInt(product.value.symbolId) + '_' + product.value.tradeType
                if (localSelfSymbolList.find(el => el === newId)) {
                    localSelfSymbolList.map((it, index) => {
                        if (it === newId) {
                            localSelfSymbolList.splice(index, 1)
                            isSelfSymbol.value = false
                            ElMessage.success(t('trade.removeOptionalOk'))
                            state.isOptional = false
                        }
                    })
                } else {
                    localSelfSymbolList.push(newId)
                    isSelfSymbol.value = true
                    state.isOptional = true
                    ElMessage.success(t('trade.addOptionalOk'))
                }
                store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
            } else {
                if (isSelfSymbol.value) {
                    removeCustomerOptional({
                        symbolList: [product.value.symbolId],
                        tradeType: product.value.tradeType
                    }).then(res => {
                        if (res.check()) {
                            isSelfSymbol.value = false
                            store.dispatch('_user/queryCustomerOptionalList')
                            ElMessage.success(t('trade.removeOptionalOk'))
                        }
                    }).catch(err => {
                    })
                } else {
                    addCustomerOptional({
                        symbolList: [product.value.symbolId],
                        tradeType: product.value.tradeType
                    }).then(res => {
                        if (res.check()) {
                            isSelfSymbol.value = true
                            // 手动修改optional值
                            store.commit('_user/Update_optional', 1)
                            store.dispatch('_user/queryCustomerOptionalList')
                            ElMessage.success(t('trade.addOptionalOk'))
                        }
                    }).catch(err => {
                    })
                }
            }
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

        // 更新指标
        const updateStudy = list => {
            const studyList = []
            if (list.length > 0) {
                list.forEach(el => {
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
            }
            if (studyList.length === 1 && studyList.find(el => el.type === 'mainStudy')) {
                localSetChartConfig('subStudy', null)
            } else if (studyList.length === 1 && studyList.find(el => el.type === 'subStudy')) {
                localSetChartConfig('mainStudy', null)
            }
            initChartData()
            state.onChartReadyFlag && unref(chartRef).updateIndicator(studyList)
            chartRef.value && chartRef.value.reset({
                initialValue: initialValue.value,
                options: unref(state.initConfig)
            })
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

        // 设置图表周期
        const onBeforeChange = (name, title) => {
            if (name === 'timeSharing') {
                state.studyVis = false
            } else {
                state.studyVis = true
            }
            state.onChartReadyFlag && unref(chartRef).setResolution(name)
            localSetChartConfig('resolution', name)
            return true
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

        // 指标弹窗
        const updateShow = (val) => {
            state.showStudyDialog = val
        }

        // 设置图表设置缓存
        let locChartConfig = JSON.parse(localGet('chartConfig'))
        const initChartData = () => {
            locChartConfig = JSON.parse(localGet('chartConfig'))
            const invertColor = localGet('invertColor')
            const lang = route.query.lang || getCookie('lang')
            const chartLocaleJSON = {
                'zh-CN': 'zh',
                'en-US': 'en',
                'zh-HK': 'zh_TW',
                'th-TH': 'th',
            }
            const locale = chartLocaleJSON[lang] || chartLocaleJSON['en-US']

            // 当前产品是否可以显示成交量，外汇、商品、指数、贵金属、能源类产品不显示成交量
            const canUseVolume = unincludeLable(['FX', 'commodites', 'index', 'Metal', 'Energy'], product.value.labels)
            // 如果当前可以展示成交量，则显示在副图指标第一位，否则不显示成交量指标
            if (canUseVolume && SUBSTUDIES[0].name !== 'Volume') {
                SUBSTUDIES.unshift(VolumeStudy)
            } else if (!canUseVolume) {
                const volumeIndex = SUBSTUDIES.findIndex(el => el.name === 'Volume')
                if (volumeIndex > -1) SUBSTUDIES.splice(volumeIndex, 1)
            }
            state.sideStudyList = SUBSTUDIES.slice(0, 10)
            if (isEmpty(locChartConfig)) {
                localSetChartConfig('showLastPrice', false)
                localSetChartConfig('mainStudy', JSON.stringify(MAINSTUDIES[0]))
                localSetChartConfig('subStudy', JSON.stringify(SUBSTUDIES[0]))
                localSetChartConfig('resolution', 1)
                localSetChartConfig('lineSetList', [])
                localSetChartConfig('chartType', 1)
                localSetChartConfig('chartColorType', 1)
                localSetChartConfig('upColor', style.value.riseColor)
                localSetChartConfig('downColor', style.value.fallColor)
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
                        showSeriesTitle: false // K线标题
                    },
                    indicators: [
                        {
                            name: 'Moving Average mock',
                            params: [true, false, [26, 2]]
                        },
                        {
                            name: 'Volume',
                            params: [false, false, [20]],
                        }

                    ],
                    extension: {
                        theme: invertColor === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）,
                        orientation: 'portrait',
                        locale
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

                state.activeTab = candleKTypeList.find(item => String(item.ktype) === String(locChartConfig.resolution)).ktype

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
                        upColor: style.value.riseColor,
                        downColor: style.value.fallColor,

                    },
                    indicators: [
                        JSON.parse(locChartConfig.mainStudy),
                        JSON.parse(locChartConfig.subStudy)

                    ],
                    extension: {
                        theme: invertColor === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: true, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'landscape',
                        locale
                    }
                })
            }

            // 自选星标状态
            checkIsSelfSymbol()
        }

        // 排除某些标签的产品
        function unincludeLable (arr = [], labels) {
            if (!labels) return false
            const labelsArr = labels.split(',')
            for (const label of arr) {
                const item = labelsArr.find(el => el === label)
                if (item) return false
            }
            return true
        }

        // 设置图表类型
        const setChartType = (klineType) => {
            var property = {}
            state.klineType = klineType

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(klineType))
            localSetChartConfig('chartType', klineType)

            property.chartType = klineType
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
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

        // 监听主题修改回调
        const changeTheme = (val) => {
            const theme = val.detail === 'light' ? 'Light' : 'Dark'
            chartRef.value.changeTheme(theme)
        }

        // 监听图表颜色修改
        const changeChartColor = () => {
            initChartData()
            renderChart(product, state.initConfig.property)
            chartRef.value && chartRef.value.reset({
                initialValue: initialValue.value,
                options: unref(state.initConfig)
            })
        }

        // 监听路由变化
        const changeRoute = () => {
            QuoteSocket.add_subscribe({ moduleId: 'order_productActivited', symbolKeys: [`${product.value.symbolId}_${product.value.tradeType}`] })
            // const invertColor = localGet('invertColor')
            initChartData()
            chartRef.value && chartRef.value.reset({
                initialValue: initialValue.value,
                options: unref(state.initConfig)
            })

            QuoteSocket.deal_subscribe(product.value.symbolId, 1, '1', product.value.tradeType.toString(), 1)
            // changeTheme({ 'detail': invertColor })
            // renderChart(product, state.initConfig.property)
        }

        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', { symbolId: product.value.symbolId, tradeType: product.value.tradeType }).then(() => {
            // 初始化图表配置
            initChartData()
        })

        // 图表创建完成回调
        const onChartReady = () => {
            state.onChartReadyFlag = true
        }

        // 监听路由变化
        watch(
            () => route.query, (val, oval) => {
                changeRoute()
            }, {
                immediate: true
            }
        )

        // QuoteSocket.send_subscribe([`${product.value.symbolId}_${product.value.tradeType}`])

        // 图表全屏
        const fullHandler = () => {
            const fullEl = document.querySelector('#chartContent')
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                fullEl.requestFullscreen()
            }
        }

        // 全屏的回调事件
        const fullscreenchangeCallback = e => {
            console.log(e, document.fullscreenElement)
            state.isFull = !!document.fullscreenElement
        }

        const symbolKey = computed(() => {
            return product.value.symbolId + '_' + product.value.tradeType
        })
        const { currencyList } = useSymbolIcon(symbolKey)

        // 监听主题修改
        document.body.addEventListener('Launch_theme', changeTheme, false)
        // 监听设置图表颜色
        document.body.addEventListener('Launch_chartColor', changeChartColor, false)

        onMounted(() => {
            // 全屏触发事件
            const fullEl = document.querySelector('#chartContent')
            fullEl.addEventListener('fullscreenchange', fullscreenchangeCallback, false)
        })

        onUnmounted(() => {
            document.body.removeEventListener('Launch_theme', changeTheme, false)
            document.body.addEventListener('Launch_chartColor', changeChartColor, false)

            const fullEl = document.querySelector('#chartContent')
            if (fullEl) fullEl.removeEventListener('fullscreenchange', fullscreenchangeCallback, false)
        })

        return {
            ...toRefs(state),
            handleClick,
            onClickStudy,
            onBeforeChange,
            klineTypeList,
            candleKTypeList,
            klineTypeIndex,
            indicatorRemoved,
            chartRef,
            onChartReady,
            initialValue,
            orientationChanged,
            setChartType,
            product,
            computedLineList,
            handleLineChange,
            updateShow,
            updateStudy,
            addOptional,
            isSelfSymbol,
            formatAmount,
            checkIsSelfSymbol,
            dealLastPrice,
            contractRoute,
            fullHandler,
            includeSymbol,
            currencyList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.chart-content {
    margin-bottom: 8px;
    background: var(--contentColor);
    border-radius: 10px;
    &.full {
        display: flex;
        flex-direction: column;
        overflow: auto;
        .chart {
            flex: 1;
        }
    }
}
.symbol-info {
    display: flex;
    align-items: center;
    padding: 11px 16px;
    >div {
        flex: 1;
        &.item {
            margin-right: 15px;
            &.range {
                flex: 0 1 220px;
            }
            &.ohlc {
                flex: 0 1 120px;
            }
            .etfTip {
                width: 400px;
                padding: 10px;
            }
            &.symbol-name {
                flex: none;
            }
            &.symbol-icon {
                flex: none;
                .icon {
                    display: flex;
                    align-items: center;
                    height: rem(80px);
                    img {
                        width: rem(52px);
                        height: rem(52px);
                        border: 1px solid #FFF;
                        border-radius: 100%;
                        &:last-child {
                            margin-left: -10px;
                        }
                    }
                }
            }
            .name {
                display: flex;
                align-items: center;
                font-weight: bold;
                font-size: 16px;
                span {
                    margin-right: rem(20px);
                }
            }
            .code {
                color: var(--minorColor);
            }
            &.range,
            &.ohlc {
                color: var(--mainColor);
                font-size: 12px;
                line-height: 2;
                white-space: nowrap;
            }
            &.collect {
                flex: 1;
                color: var(--normalColor);
                text-align: right;
                cursor: pointer;
                .icon {
                    margin-left: 16px;
                    font-size: 20px;
                    &.icon_hangqingliebiaoyijiazixuan {
                        animation: heartBeat 1.3s ease-in-out forwards;
                    }
                }
            }
        }
    }
}
.tv-head {
    box-sizing: border-box;
    // 若高度调整，需同时处理vant-tab组件内的高度和行高等
    width: 100%;
    background-color: var(--contentColor);
}
.tabs-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 100%;
    padding-top: 3px;
    padding-right: 10px;
    border-top: solid 1px var(--lineColor);
    border-bottom: solid 1px var(--lineColor);
    .van-popup {
        @include scroll();
    }
    .tabs {
        //flex: 1;
        width: 530px;
        :deep(.van-tab) {
            flex: 1;
            flex-basis: auto !important;
            padding: 0;
            padding-bottom: 5px;
            font-size: 12px;
            white-space: nowrap;
        }
        :deep(.van-tabs__wrap) {
            height: 30px;
            .van-tabs__nav--line {
                padding-bottom: 0;
            }
            .van-tabs__line {
                bottom: 0;
                width: 27px !important;
                height: 2px !important;
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
        &::after {
            position: absolute;
            top: 50%;
            right: 1px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent var(--normalColor) var(--normalColor);
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            opacity: 0.8;
            content: '';
        }
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
    .tv-right {
        display: flex;
        align-items: center;
        z-index: 1;
        .fullIcon {
            line-height: 1;
            vertical-align: middle;
            cursor: pointer;
            color: var(--normalColor);
            &:hover {
                opacity: 0.7;
            }
        }
        .dropdown {
            margin: 0 10px;
            height: 30px;
            :deep(.el-dropdown-menu__item) {
                &.mainColor {
                    color: var(--primary);
                }
            }
        }
        .setting {
            margin: 0 10px;
            height: 30px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -5px;
            background: var(--contentColor);
            cursor: pointer;
            .icon {
                color: var(--normalColor);
                font-size: rem(32px);
            }
            .content {
                position: absolute;
                top: rem(72px);
                right: 0;
                z-index: 99;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: var(--contentColor);
                box-shadow: 0 0 2px 0 var(--contentColor);
                .item {
                    padding: rem(20px) rem(50px) rem(10px);
                    line-height: rem(30px);
                    white-space: nowrap;
                    cursor: pointer;
                    background: var(--contentColor);
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
    .study-wrap,
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
    .kIcon {
        display: inline-block;
        color: var(--normalColor);
        vertical-align: middle;
        cursor: pointer;
    }
    .type-text {
        margin: 0 8px;
    }
}
.study-area {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: var(--contentColor);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    .main-study,
    .side-study {
        width: 100%;
        font-size: 12px;
        padding: 0 8px;
        .content {
            display: inline-flex;
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
                padding: 0 10px;
                color: #646566;
                text-align: center;
                cursor: pointer;
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
                    height: 25px;
                    color: var(--normalColor);
                    line-height: 25px;
                }
            }
        }
    }
    .more {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        .inner-label {
            flex: 1;
            height: 25px;
            line-height: 25;
        }
    }
}
.more-time {
    position: relative;
    height: 100%;
    padding: 0 4px 0 0;
    color: #646566;
    font-size: rem(24px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    &::after {
        position: absolute;
        top: 50%;
        right: 1px;
        margin-top: -5px;
        border: 3px solid;
        border-color: transparent transparent var(--normalColor) var(--normalColor);
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        opacity: 0.8;
        content: '';
    }
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
    color: var(--normalColor);
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
    background: var(--contentColor);
    cursor: pointer;
    .icon {
        color: var(--normalColor);
        font-size: rem(32px);
    }
    .content {
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
.chart {
    height: 405px;
}

</style>
