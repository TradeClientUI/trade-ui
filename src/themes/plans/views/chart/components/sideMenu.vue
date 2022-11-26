<template>
    <div v-if='showSelf' :ref='el => componentRef = el'>
        <div class='side-menu' @click='() => showSelf=false'>
            <!-- 左侧菜单 -->
            <div class='left'>
                <template v-for='item in resolutionList' :key='item.value'>
                    <span class='item' @click='chart.setResolution(item.value)'>
                        {{ item.text }}
                    </span>
                </template>
            </div>
            <!-- 右侧菜单 -->
            <div class='right'>
                <template v-for='item in rightMenu' :key='item.value'>
                    <div class='item' @click.stop='item.method'>
                        <i class='icon' :class='item.icon'></i>
                    </div>
                </template>
            </div>
        </div>

        <!-- 指标弹出层 -->
        <van-popup v-if='componentRef' v-model:show='showIndicator' position='right' :style="{ height: '100%', width: '100%' }" :teleport='componentRef'>
            <Indicator v-if='showIndicator' @back='onBack' />
        </van-popup>

        <!-- 设置弹出层 -->
        <van-popup v-if='componentRef' v-model:show='showSetting' position='right' :style="{ height: '100%', width: '100%' }" :teleport='componentRef'>
            <ChartSetting v-if='showSetting' @back-event='onBackEvent' />
        </van-popup>
    </div>
</template>

<script>
import { localGet, localSet } from '@/utils/util'
import { onMounted, ref, watch, unref } from 'vue'
import { resolutionToKlineType, resolutionToText } from '@/components/tradingview/datafeeds/userConfig/config.js'
import ChartSetting from '@/themeCommon/user/chartSetting.vue'
import Indicator from './indicator'

export default {
    components: {
        Indicator,
        ChartSetting
    },
    props: {
        chart: {
            type: Object,
            default: null
        },
    },
    setup (props, context) {
        const { chart } = props
        // 显示当前模块
        const showSelf = ref(false)

        const chartConfig = ref({})

        // 周期列表
        const resolutionList = Object.keys(resolutionToKlineType).map(value => ({
            text: resolutionToText[value],
            value
        }))

        // 是否显示指标弹出层
        const showIndicator = ref(false)
        // 指标弹出层事件：关闭
        const onBack = () => {
            showIndicator.value = false
        }

        watch(showIndicator, (bool) => {
            if (!bool) {
                chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
                // 更新指标
                chart.updateIndicator(unref(chartConfig).indicators)
            }
        })
        // 显示设置弹出层
        const showSetting = ref(false)
        const onBackEvent = () => {
            showSetting.value = false
        }
        watch(showSetting, (bool) => {
            if (!bool) {
                chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
                // 更新图表
                chart.setChartType(unref(chartConfig).chartType)
                chart.updateProperty(unref(chartConfig))
            }
        })

        const updateChartType = (chartType) => {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
            unref(chartConfig).chartType = chartType
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
            chart.updateProperty({
                chartType
            })
        }

        // 右侧菜单列表
        const rightMenu = [
            {
                icon: 'icon_yinyangzhu',
                method: () => updateChartType(1)

            },
            {
                icon: 'icon_zhuxingtu',
                method: () => updateChartType(0)
            },
            {
                icon: 'icon_tubiaoxian',
                method: () => updateChartType(2)
            },
            {
                icon: 'icon_f',
                method: () => {
                    showIndicator.value = true
                }
            },

            {
                icon: 'icon_maimai',
                method: () => {
                    context.emit('togglePriceBox')
                }
            },

            {
                icon: 'icon_shezhi',
                method: () => { showSetting.value = true }
            },
        ]

        onMounted(() => {
            // 点击时
            chart.subscribe('click', () => {
                showSelf.value = true
            })
        })

        const componentRef = ref(null)

        return {
            resolutionList,
            showIndicator,
            onBack,
            rightMenu,
            onBackEvent,
            showSetting,
            showSelf,
            componentRef,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.side-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    filter: invert(100%);
    .left,
    .right {
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        font-weight: 700;
        font-size: 12px;
        text-align: center;
        background: #FFF;
        box-shadow: #DEDEDE 0 0 5px 0;
        .item {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 100%;
            padding: 0 17px;
        }
    }
    .left {
        left: 0;
    }
    .right {
        right: 0;
        .icon {
            font-size: 20px;
        }
    }
}
</style>
