import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { PieChart, BarChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { assetPerformance, investCombination, queryIndexSample, indexSimplePerformance } from '@/api/trade'
import { localGet } from '@/utils/util'
import { computed, inject } from 'vue'
import { useStore } from 'vuex'

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
    GridComponent,
    BarChart,
])

export const useInvestCompose = (params) => {
    const store = useStore()
    const fundId = inject('fundId')
    const style = computed(() => store.state.style)

    const getInvestCombination = (symbolId) => {
        // 实时投资组合排名
        if (fundId) {
            return investCombination({ fundId, statisticType: 1 }).then(res => {
                if (res.check()) {
                    const list = res.data
                    return list
                }
                return []
            })
        } else {
            // 指数产品指数样本
            return queryIndexSample({ indexId: symbolId }).then(res => {
                if (res.check()) {
                    const list = res.data
                    return list
                }
                return []
            })
        }
    }

    // 获取单资产表现柱状图数据
    const getAssetPerformance = (symbolId) => {
        // 获取基金产品柱状图数据
        if (fundId) {
            return assetPerformance({ fundId }).then(res => {
                if (res.check()) {
                    return res.data
                }
                return []
            })
        } else {
            // 获取指数产品柱状图数据
            return indexSimplePerformance({ indexId: symbolId }).then(res => {
                if (res.check()) {
                    return res.data
                }
                return []
            })
        }
    }

    // 绘制环形图
    const newPieDoughnutChart = (chartDom, chartData) => {
        const myChart = echarts.init(chartDom)
        const option = {
            backgroundColor: style.contentColor,
            color: ['#B72122', '#E9393A', '#FF762C', '#FF9E2C', '#FFC62C', '#F1DE3F', '#D2C02A', '#B6A622', '#9E9123', '#648319', '#198351', '#2AA46B', '#41CE8D', '#6BF1B3', '#56F5DD', '#82ECFF', '#82D7FF', '#7BBCF6', '#589EDC', '#2B70AE'],
            legend: {
                top: 10,
                bottom: '0',
                right: 0,
                // left: '60%',
                // orient: 'vertical',
                // type: 'scroll',
                textStyle: {
                    color: '#888',
                }
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    top: '25%',
                    bottom: 0,
                    // right: '30%',
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        }

        option && myChart.setOption(option)
        return myChart
    }

    // 绘制柱状图
    const newBarChart = (chartDom, [xData, yData], props) => {
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
                    const yAxisExt = '%'
                    let str = `<p style="padding-bottom:10px;">${params[0].name}</p>`
                    params.forEach((item) => {
                        str += `<p style="padding-bottom:5px;">
                                <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:${item.color}"></span>
                                ${item.value + yAxisExt}
                                <br />
                            </p>`
                    })
                    return str
                },
            },
            xAxis: {
                type: 'category',
                axisLabel: { interval: 0, rotate: props.rotate },
                data: xData, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            grid: {
                left: '0',
                top: '20',
                bottom: '5',
                right: '0',
                containLabel: true
            },
            series: [
                {
                    itemStyle: {
                        color: '#2b70ae'
                    },
                    data: yData,
                    type: 'bar'
                }
            ]
        }

        option && myChart.setOption(option)
        return myChart
    }

    return {
        getInvestCombination,
        getAssetPerformance,
        newPieDoughnutChart,
        newBarChart,
    }
}
