import { computed } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    CanvasRenderer,
    UniversalTransition,
    LineChart,
    PieChart,
    BarChart
])

// 初始化图表
export const useChart = (params = {}) => {
    const store = useStore()
    const style = computed(() => store.state.style)

    // 绘制折线图
    const newChart = (chartDom, [xData, yData], opts) => {
        // console.log(chartDom, xData, yData, opts)
        if (!chartDom) return false
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
                                <p style="padding-left: 17px;">${item.data + yAxisExt}</p>
                            </p>`
                    })
                    return str
                },
            },
            color: ['rgb(46, 186, 198)'],
            legend: {
                textStyle: {
                    color: '#888'
                },
                data: [yData[0]?.name, yData[1]?.name]
            },
            grid: {
                bottom: 0,
                left: 10,
                right: 10,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xData,
                splitNumber: 28,
                axisLabel: {
                    formatter (value, index) {
                        return xData[0].length > 12 ? value.slice(0, 11) : value
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
        newChart
    }
}
