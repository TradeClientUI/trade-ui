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
                                ${yAxisExt + item.data}
                                <br />
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
                right: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xData,
                interval: 168,
                axisLabel: {
                    formatter (value, index) {
                        // return value // xData[0].length > 12 ? value.slice(11, 16) : value
                        if (opts?.type === '1D') {
                            return value.slice(11, 16)
                        } else {
                            return value
                        }
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true
            },
            series: yData
        }
        if (opts && opts['yAxis.ext']) {
            option.yAxis.axisLabel = {
                formatter: opts['yAxis.ext'] + '{value} '
            }
        }
        option && myChart.setOption(option)
        setTimeout(() => {
            myChart._dom.childNodes[1].style.display = 'none'
        }, 0)

        return myChart
    }

    return {
        newChart
    }
}
