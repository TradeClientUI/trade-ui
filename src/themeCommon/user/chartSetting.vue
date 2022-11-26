<template>
    <div class='setting-wrap'>
        <van-nav-bar
            left-arrow
            :left-text='$t("common.back")'
            :title='$t("common.chart")'
            @click-left='$attrs.onBackEvent'
        />
        <div class='page-wrap'>
            <van-cell-group class='group'>
                <van-cell :title='$t("chart.candleStick")' @click='changeType(1)'>
                    <template #icon>
                        <van-icon class='icon icon_yinyangzhu' />
                    </template>
                    <template v-if='chartSet.chartType === 1' #right-icon>
                        <van-icon color='#58C225' name='success' />
                    </template>
                </van-cell>
                <van-cell :title='$t("chart.barLine")' @click='changeType(0)'>
                    <template #icon>
                        <van-icon
                            class='icon icon_zhuxingtu'
                        />
                    </template>
                    <template v-if='chartSet.chartType === 0' #right-icon>
                        <van-icon color='#58C225' name='success' />
                    </template>
                </van-cell>
                <van-cell :title='$t("chart.chartLine")' @click='changeType(2)'>
                    <template #icon>
                        <van-icon class='icon icon_tubiaoxian' />
                    </template>
                    <template v-if='chartSet.chartType === 2' #right-icon>
                        <van-icon color='#58C225' name='success' />
                    </template>
                </van-cell>
            </van-cell-group>

            <van-cell-group class='group'>
                <!-- <van-cell title='交易量'>
                <template #right-icon>
                    <van-switch v-model='chartSet.volumeSwitch' active-color='#53C41C' size='22px' @change='handleChartSet("volumeSwitch")' />
                </template>
            </van-cell> -->
                <van-cell :title='$t("chart.buyLine")'>
                    <template #right-icon>
                        <van-switch v-model='chartSet.showBuyPrice' active-color='#53C41C' size='22px' @change='handleChartSet("showBuyPrice")' />
                    </template>
                </van-cell>
                <van-cell :title='$t("chart.sellLine")'>
                    <template #right-icon>
                        <van-switch v-model='chartSet.showSellPrice' active-color='#53C41C' size='22px' @change='handleChartSet("showSellPrice")' />
                    </template>
                </van-cell>
                <!-- <van-cell title='周期分隔符'>
                <template #right-icon>
                    <van-switch v-model='chartSet.periodSeparator' active-color='#53C41C' size='22px' @change='handleChartSet("periodSeparator")' />
                </template>
            </van-cell>-->
                <van-cell :title='$t("chart.tradeLevel")'>
                    <template #right-icon>
                        <van-switch v-model='chartSet.tradeLevel' active-color='#53C41C' size='22px' @change='handleChartSet("tradeLevel")' />
                    </template>
                </van-cell>
                <p class='notice'>
                    {{ $t('chart.noticeTips') }}
                </p>
                <van-cell :title='$t("chart.OHLC")'>
                    <template #right-icon>
                        <van-switch v-model='chartSet.showSeriesOHLC' active-color='#53C41C' size='22px' @change='handleChartSet("showSeriesOHLC")' />
                    </template>
                </van-cell>
                <van-cell :title='$t("chart.upAndDown")'>
                    <template #right-icon>
                        <van-switch v-model='chartSet.showBarChange' active-color='#53C41C' size='22px' @change='handleChartSet("showBarChange")' />
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, onBeforeMount } from 'vue'
import { localSet, localGet, isEmpty } from '@/utils/util'
export default {
    setup (props) {
        const state = reactive({
            chartSet: {
                volumeSwitch: false,
                showBuyPrice: false,
                periodSeparator: false,
                tradeLevel: false,
                showSeriesOHLC: false,
                showBarChange: false,
                showSellPrice: false,
                chartType: 1
            }

        })

        const changeType = (val) => {
            state.chartSet.chartType = val
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                chartConfig['chartType'] = val
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({ chartType: val }))
            }
        }
        const handleChartSet = (type) => {
            const chartConfig = JSON.parse(localGet('chartConfig'))

            if (!isEmpty(chartConfig)) {
                chartConfig[type] = state.chartSet[type]
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({
                    [type]: state.chartSet[type]
                }))
            }
        }
        onBeforeMount(() => {
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                state.chartSet = chartConfig
            } else {
                localSet('chartConfig', JSON.stringify({ chartType: 1 }))
            }
        })

        return {
            changeType,
            handleChartSet,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.setting-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.page-wrap {
    flex: 1;
    overflow-y: auto;
    .group {
        border-top: solid 10px #F6F6F6;
    }
    .notice {
        padding: 10px;
        font-size: 12px;
        background-color: var(--bgColor);
    }
    .icon {
        margin-right: 10px;
        color: var(--color);
        font-size: 20px;
        vertical-align: middle;
    }
}

</style>
