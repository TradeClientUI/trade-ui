import { marketPerformance, marketPerformanceQuoteChange } from '@/api/trade'
import { localGet } from '@/utils/util'
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'

import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
])

// 基金表现
export const usePerformance = () => {
    const store = useStore()
    const fundId = inject('fundId')
    const style = computed(() => store.state.style)

    // 市场价格 vs 基金净值的图表数据
    function mockData () {
        let size = 100
        let today = window.dayjs()
        const list = []
        while (size > 0) {
            const time = today.format('YYYY-MM-DD')
            list.unshift({
                time: time,
                value: randomNum(0, 200)
            })
            today = today.subtract(1, 'day')
            size--
        }
        return list
    }

    // 市场表现走势图
    const getMarketPerformanceData = () => {
        return marketPerformance({ fundId, days: 60, type: 1 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1, data2]
            }
            return []
        })
    }
    const getMarketPerformanceData1 = () => {
        return marketPerformance({ fundId, days: 60, type: 2 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1, data2]
            }
            return []
        })
    }

    // 市场表现走势图
    const getMarketPerformanceQuoteChange = () => {
        return marketPerformanceQuoteChange({ fundId, days: 60, type: 1 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1, data2]
            }
            return []
        })
    }
    const getMarketPerformanceQuoteChange1 = () => {
        return marketPerformanceQuoteChange({ fundId, days: 60, type: 2 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1, data2]
            }
            return []
        })
    }

    // 创建市场价格 vs 基金净值的图表
    const newChart = (chartDom, [xData, yData], opts) => {
        // console.log(chartDom, xData, yData, opts)
        if (!chartDom || !xData?.length) return false
        const myChart = echarts.init(chartDom)
        const option = {
            backgroundColor: style.contentColor,
            tooltip: {
                trigger: 'axis',
                extraCssText: 'z-index:99',
                textStyle: {
                    fontSize: 12,
                },
                formatter: function (params) {
                    const yAxisExt = opts && opts['yAxis.ext'] ? opts['yAxis.ext'] : ''
                    let str = `<p style="padding-bottom:10px;">${params[0].name}</p>`
                    params.forEach((item) => {
                        str += `<p style="padding-bottom:5px;">
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:${item.color}"></span>
                                ${item.seriesName}: <br />
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;"></span>
                                ${item.data + yAxisExt}
                                <br />
                            </p>`
                    })
                    return str
                },
            },
            color: ['#F1A21A', '#2B70AE'],
            legend: {
                textStyle: {
                    color: '#888'
                },
                data: [yData[0]?.name, yData[1]?.name], // ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            grid: {
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                // boundaryGap: false,
                data: xData, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                axisLabel: {
                    formatter (value, index) {
                        return xData[0].length > 12 ? value.slice(11, 16) : value
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: yData
        }
        if (opts && opts['yAxis.ext']) {
            option.yAxis.axisLabel = {
                formatter: '{value} ' + opts['yAxis.ext']
            }
        }
        option && myChart.setOption(option)

        return myChart
    }
    return {
        getMarketPerformanceData,
        getMarketPerformanceData1,
        getMarketPerformanceQuoteChange,
        getMarketPerformanceQuoteChange1,
        newChart
    }
}

// 随机数
function randomNum (minNum, maxNum) {
    switch (arguments.length) {
    case 1:
        return parseInt(Math.random() * minNum + 1, 10)
        break
    case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        break
    default:
        return 0
        break
    }
}
