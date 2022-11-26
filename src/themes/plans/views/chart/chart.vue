<template>
    <div class='chartWrap' :class='{ landscape: isLandscape }'>
        <tv
            v-if='initialValue'
            ref='chartRef'
            :initial-value='initialValue'
            :options='chartConfig'
            :position-list='positionList'
            @changeOrientation='changeOrientation'
            @indicatorRemoved='indicatorRemoved'
            @symbolChanged='symbolChanged'
        >
            <!-- <template v-if='!isLandscape' #top='{ setSymbol,resolutionList }'>

            </template> -->
            <template v-if='isLandscape' #sideMenu>
                <!-- 横屏菜单 -->
                <SideMenu
                    :ref='sideMenuRef'
                    :chart='chartRef.chart'
                    class='side-menu-Component'
                    :class='{ landscape:isLandscape }'
                    @togglePriceBox='togglePriceBox'
                />
            </template>
        </tv>
    </div>

    <!-- 指标弹出层 -->
    <van-popup
        v-model:show='showIndicator'
        :duration='0.2'
        position='right'
        :style="{ height: '100%', width: '100%' }"
    >
        <Indicator v-if='showIndicator' @back='onBack' />
    </van-popup>

    <!-- 设置弹出层 -->
    <van-popup
        v-model:show='showSetting'
        :duration='0.2'
        position='right'
        :style="{ height: '100%', width: '100%' }"
    >
        <ChartSetting @back-event='onBackEvent' />
    </van-popup>
</template>

<script>
import tv from '@/components/tradingview/tv'
import { Popover } from 'vant'
import { computed, watch, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter, useRoute } from 'vue-router'
import ChartSetting from '@/themeCommon/user/chartSetting.vue'
import { localGet, localSet } from '@/utils/util'
import SideMenu from './components/sideMenu'
import Indicator from './components/indicator'

export default {
    components: {
        tv,
        [Popover.name]: Popover,
        ChartSetting,
        SideMenu,
        Indicator,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const productList = computed(() => store.state._quote.productList)
        const positionList = computed(() => store.state._trade.positionList)
        const customerInfo = computed(() => store.state._user.customerInfo)
        if (customerInfo.value) {
            store.dispatch('_trade/queryPositionPage')
        }
        // 图表配置
        const chartConfig = ref({
            property: {
                showBuyPrice: true, // 买价线
                showSellPrice: true, // 卖价线
                showSeriesOHLC: true, // 高开低收
                showBarChange: true, // 涨跌幅
                chartType: '1', // 图表类型
                showSeriesTitle: false // K线标题
            }
        })
        // 图表组件引用
        const chartRef = ref(null)
        // 是否横屏
        // const isLandscape = ref([90, -90].includes(window.orientation))
        const isLandscape = ref(false)

        // 横屏菜单ref
        const sideMenuRef = ref(null)

        const showProductPopover = ref(false)
        const showResolutionPopover = ref(false)

        // 是否显示指标弹出层
        const showIndicator = ref(false)
        // 指标弹出层事件：关闭
        const onBack = () => {
            showIndicator.value = false
        }

        watch(showIndicator, (bool) => {
            if (!bool) {
                Object.assign(chartConfig.value, JSON.parse(localGet('chartConfig')) || {})
                // 更新指标
                unref(chartRef).chart.updateIndicator(unref(chartConfig).indicators)
            }
        })

        // 设置弹出层逻辑
        const showSetting = ref(false)
        // 显示设置弹出层
        const onShowSetting = () => {
            showSetting.value = true
        }
        // 设置弹出层左上角返回
        const onBackEvent = () => {
            showSetting.value = false
        }

        watch(showSetting, (bool) => {
            if (!bool) {
                Object.assign(chartConfig.value, JSON.parse(localGet('chartConfig')) || {})
                // 更新图表
                unref(chartRef).chart.setChartType(unref(chartConfig).property.chartType)
                unref(chartRef).chart.updateProperty(unref(chartConfig))
            }
        })

        // 订阅产品
        const subscribList = productList.value.map(({ symbolId, tradeType }) => (`${symbolId}_${tradeType}`))
        QuoteSocket.send_subscribe(subscribList)

        // 产品下拉列表
        const computedProductList = computed(
            () => productList.value
                .filter(e => e.symbolName)
                .map(e => ({
                    text: e.symbolName, // 用于vant组件显示
                    description: e.symbolCode, // 显示在图表左上角
                    symbolId: e.symbolId, // 产品id
                    digits: e.symbolDigits, // 小数点
                }))
        )

        // 图表初始值
        const initialValue = computed(() => {
            if (!computedProductList.value.length) {
                return null
            }
            const symbolId = localGet('symbolIdForChart')
            if (symbolId) {
                const target = computedProductList.value.find(e => e.symbolId + '' === symbolId)
                if (target) {
                    return target
                }
            }
            return computedProductList.value[0]
        })

        // /更新图表产品缓存
        watch(initialValue, (val) => {
            val && localSet('symbolIdForChart', val.symbolId)
        })

        // 前往下单页
        const gotoOrder = () => {
            router.push({
                name: 'Order',
                query: {
                    ...route.query,
                    symbolId: localGet('symbolIdForChart') || this.initialValue.value
                },
            })
        }

        try {
            Object.assign(chartConfig.value, JSON.parse(localGet('chartConfig')) || {})
        } catch (error) {
            console.error('图表缓存出错，进行清空')
            localSet('chartConfig', '{}')
        }
        // 价格栏显隐
        const togglePriceBox = () => {
            unref(chartConfig).property.showPriceBox = !unref(chartConfig).property.showPriceBox
            unref(chartRef).chart.togglePriceBox(unref(chartConfig).property.showPriceBox)
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }
        // 产品id变化
        const symbolChanged = id => {
            localSet('symbolIdForChart', id)
        }

        // 监听是否横屏
        const changeOrientation = (bool) => {
            isLandscape.value = bool
            console.log('changeOrientation: ', bool)
        }

        // 移除指标特殊情况：图表内直接移除指标
        const indicatorRemoved = name => {
            Object.assign(chartConfig.value, JSON.parse(localGet('chartConfig')) || {})
            unref(chartConfig).indicators = unref(chartConfig).indicators.filter(e => e.name !== name)
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }

        const setResolution = value => {
            unref(chartRef).chart.setResolution(value)
        }

        return {
            computedProductList,
            initialValue,
            gotoOrder,
            onShowSetting,
            showSetting,
            onBackEvent,
            chartConfig,
            symbolChanged,
            isLandscape,
            changeOrientation,
            sideMenuRef,
            togglePriceBox,
            indicatorRemoved,
            showProductPopover,
            showResolutionPopover,
            onBack,
            showIndicator,
            chartRef,
            setResolution,
            positionList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.chartWrap {
    flex: 1;
    height: 100%;
    margin-bottom: rem(100px);
    &.landscape {
        position: relative;
        z-index: 2;
        margin-bottom: 0;
        background: #FFF;
    }
}
</style>

<style lang="scss">
.tv-product-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-resolution-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-product-popover,
.tv-resolution-popover {
    height: 70%;
    overflow-y: auto;
}
.btn-wrap {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    .btn {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        padding: 0 10px;
        background: var(--primary);
        border: 0;
        .van-button {
            padding: 0;
        }
        i {
            align-self: center;
            font-size: 22px;
        }
    }
}
.side-menu-Component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    &.landscape {
        top: -100vw;
        width: 100vh;
        height: 100vw;
        transform: rotate(90deg);
        transform-origin: bottom left;
    }
}

@media screen and (orientation: landscape) {
    .side-menu-Component {
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
    }
}

</style>
