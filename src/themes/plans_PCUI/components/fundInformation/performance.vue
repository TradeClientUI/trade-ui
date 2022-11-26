<template>
    <div class='fundPerformance'>
        <div class='width-limit'>
            <div class='block'>
                <h4 class='title'>
                    {{ $t('fundInfo.fundChart1') }}
                </h4>
                <div class='chartModule'>
                    <div id='marketPriceJZ_DOM' ref='marketPriceJZ_DOM' class='chartLine'></div>
                </div>
            </div>
            <!-- <div class='chartModule'>
                <div id='marketPriceJZ_DOM1' ref='marketPriceJZ_DOM1' class='chartLine'></div>
            </div> -->
            <div class='block'>
                <h4 class='title spaceLine'>
                    {{ $t('fundInfo.fundChartTitle') }}
                </h4>
                <div class='chartModule'>
                    <div id='marketAppearance_DOM' ref='marketAppearance_DOM' class='chartLine'></div>
                </div>
            </div>
            <!-- <div class='chartModule'>
                <div id='marketAppearance_DOM1' ref='marketAppearance_DOM1' class='chartLine'></div>
            </div> -->
            <BottomTip v-if='showTabs' />
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { usePerformance } from './hooks/persormanceData'
import BottomTip from './bottomTip.vue'

const marketPriceJZ_DOM = ref('')
const marketPriceJZ_DOM1 = ref('')
const marketAppearance_DOM = ref('')
const marketAppearance_DOM1 = ref('')
const { getMarketPerformanceData, getMarketPerformanceData1, getMarketPerformanceQuoteChange, getMarketPerformanceQuoteChange1, newChart } = usePerformance()
onMounted(async () => {
    await nextTick()

    // 市场价格 vs 基金净值
    getMarketPerformanceData().then(res => {
        const [data1, data2] = res
        const xData = []
        const yData = []
        const xDataSource = data1 || data2 || ['', []]
        xDataSource[1].forEach(el => {
            xData.push(el.time)
        })
        if (data1?.length) {
            yData.push({
                name: data1[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data1[1].map(el => el.value)
            })
        }

        if (data2?.length) {
            yData.push({
                name: data2[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data2[1].map(el => el.value)
            })
        }

        if (yData) {
            newChart(marketPriceJZ_DOM.value, [xData, yData])
        } else {
            marketPriceJZ_DOM.value.style.display = 'none'
        }
    })

    // 市场价格 vs 基金净值  横坐标以小时归类
    // getMarketPerformanceData1().then(res => {
    //     const [data1, data2] = res
    //     const xData = []
    //     const yData = []
    //     const xDataSource = data1 || data2 || ['', []]
    //     xDataSource[1].forEach(el => {
    //         xData.push(el.time.slice(0, 16))
    //     })
    //     if (data1?.length) {
    //         yData.push({
    //             name: data1[0],
    //             type: 'line',
    //             stack: 'Total',
    //             showSymbol: false,
    //             data: data1[1].map(el => el.value)
    //         })
    //     }

    //     if (data2?.length) {
    //         yData.push({
    //             name: data2[0],
    //             type: 'line',
    //             stack: 'Total',
    //             showSymbol: false,
    //             data: data2[1].map(el => el.value)
    //         })
    //     }
    //     if (yData.length) {
    //         newChart(marketPriceJZ_DOM1.value, [xData, yData])
    //     } else {
    //         marketPriceJZ_DOM1.value.style.display = 'none'
    //     }
    // })

    // 市场表现
    getMarketPerformanceQuoteChange().then(res => {
        const [data1, data2] = res
        const xData = []
        const yData = []
        const xDataSource = data1 || data2 || ['', []]
        xDataSource[1].forEach(el => {
            xData.push(el.time)
        })
        if (data1?.length) {
            yData.push({
                name: data1[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data1[1].map(el => el.value)
            })
        }
        if (data2?.length) {
            yData.push({
                name: data2[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data2[1].map(el => el.value)
            })
        }
        if (yData.length) {
            newChart(marketAppearance_DOM.value, [xData, yData], {
                'yAxis.ext': '%'
            })
        } else {
            marketAppearance_DOM.value.style.display = 'none'
        }
    })

    // 市场表现  横坐标以小时归类
    // getMarketPerformanceQuoteChange1().then(res => {
    //     const [data1, data2] = res
    //     const xData = []
    //     const yData = []
    //     const xDataSource = data1 || data2 || ['', []]
    //     xDataSource[1].forEach(el => {
    //         xData.push(el.time.slice(0, 16))
    //     })
    //     if (data1?.length) {
    //         yData.push({
    //             name: data1[0],
    //             type: 'line',
    //             stack: 'Total',
    //             showSymbol: false,
    //             data: data1[1].map(el => el.value)
    //         })
    //     }
    //     if (data2?.length) {
    //         yData.push({
    //             name: data2[0],
    //             type: 'line',
    //             stack: 'Total',
    //             showSymbol: false,
    //             data: data2[1].map(el => el.value)
    //         })
    //     }
    //     if (yData.length) {
    //         newChart(marketAppearance_DOM1.value, [xData, yData], {
    //             'yAxis.ext': '%'
    //         })
    //     } else {
    //         marketAppearance_DOM1.value.style.display = 'none'
    //     }
    // })
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fundPerformance{
    .title{
        font-size: rem(32px);
    }
    .chartModule{
        margin-top: rem(30px);
    }
    .spaceLine{
        margin-top: rem(40px);
        padding-top: rem(40px);
    }
}
.chartLine{
    height: rem(500px);
}
</style>
