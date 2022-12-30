<template>
    <div class='tv'>
        <!-- slot头部渲染 -->
        <slot
            v-if='chart'
            name='top'
            :resolutionList='resolutionList'
            :setSymbol='setSymbol'
        ></slot>
        <!-- 图表承载节点 -->
        <div id='tv-chart-container' :class='{ landscape: isLandscape }'></div>

        <!-- slot横屏菜单渲染 -->
        <slot
            v-if='chart'
            :chart='chart'
            name='sideMenu'
        ></slot>

        <div v-show='!chartReady' class='chartLoading loadIcon'></div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref, unref } from 'vue'
import { resolutionToKlineType, resolutionToText } from './datafeeds/userConfig/config.js'
import { createChart } from './chart'

export default {
    props: {
        // 产品初始值
        initialValue: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, context) {
        // 是否横屏
        const isLandscape = ref([90, -90].includes(window.orientation))

        /** 图表相关-start */
        // 周期列表
        const resolutionList = Object.keys(resolutionToKlineType).map(value => ({
            text: resolutionToText[value],
            value
        }))

        // 图表实例
        const chart = ref(null)
        // 图表实例化状态
        const chartReady = ref(false)

        const initChart = (_props = props, cb = () => {}) => {
            chartReady.value = false
            const { options, initialValue } = _props
            chart.value = createChart({
                // 容器id
                containerId: '#tv-chart-container',
                // 产品初始值
                initial: {
                    ...initialValue
                },
                // 图表属性
                property: options.property,
                // 指标
                indicators: options.indicators,
                // 扩展
                extension: options.extension
            }, () => {
                chartReady.value = true

                // 监听是否横屏
                unref(chart).subscribe('isLandscape', (bool) => {
                    isLandscape.value = bool
                    context.emit('orientationChanged', bool)
                })

                // 监听指标从图表内直接移除
                unref(chart).nativeSubscribe('study_event', (name, event) => {
                    if (event === 'remove' && name) {
                        context.emit('indicatorRemoved', name)
                    }
                })
                // 图表实例创建完成后回调
                context.emit('onChartReady', chart.value)
                cb()
            })
        }

        // 对方法增加判断
        const withMethod = (fn) => {
            return (...args) => {
                if (unref(chartReady)) {
                    // console.log(fn.name, '图表未准备好')
                    return fn(...args)
                }
            }
        }

        onMounted(() => {
            initChart()
        })
        onUnmounted(() => {
            unref(chart).destroyed()
        })

        // 设置图表类型
        const setChartType = (...args) => {
            unref(chart).setChartType(...args)
        }
        // 切换产品, 执行symbolChanged回调
        const setSymbol = (info) => {
            unref(chart).setSymbol(info)
                .then(id => {
                    context.emit('symbolChanged', id)
                })
        }
        // 设置周期
        const setResolution = (...args) => {
            unref(chart).setResolution(...args)
        }
        // 设置指标
        const updateIndicator = (...args) => {
            unref(chart).updateIndicator(...args)
        }
        // 更新买卖价线（若左上角/买卖价框设置显示，则同步更新）
        const updateLineData = (...args) => {
            unref(chart).updateLineData(...args)
        }
        // 更新持仓线
        const updatePosition = (...args) => {
            unref(chart).updatePosition(...args)
        }
        // 覆盖图表配置
        const updateProperty = (...args) => {
            unref(chart).updateProperty(...args)
        }
        // 实时更新tick
        const setTick = (price, time, volume) => {
            unref(chart).setTick(price, time, volume)
        }
        // 重新初始化图表
        const reset = (newProps, cb) => {
            unref(chart) && unref(chart).destroyed()
            initChart(newProps, cb)
        }

        // 更改图表主题
        const changeTheme = (name) => {
            unref(chart) && unref(chart).changeTheme(name)
        }

        /** 图表相关-end */

        return {
            resolutionList,
            isLandscape,
            chart,
            chartReady,
            setSymbol: withMethod(setSymbol),
            setResolution: withMethod(setResolution),
            updateIndicator: withMethod(updateIndicator),
            updatePosition: withMethod(updatePosition),
            setChartType: withMethod(setChartType),
            updateLineData: withMethod(updateLineData),
            updateProperty: withMethod(updateProperty),
            setTick: withMethod(setTick),
            changeTheme: withMethod(changeTheme),
            reset
        }
    }
}
</script>

<style lang="scss" scoped>
.tv {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .chartLoading {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: var(--contentColor);
    }
    #tv-chart-container {
        flex: 1;
        background: var(--contentColor);
        &.landscape {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #FFF;
            transform: rotate(90deg);
        }
    }
    @media screen and (orientation: landscape) {
        #tv-chart-container {
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
        }
    }
}
</style>
