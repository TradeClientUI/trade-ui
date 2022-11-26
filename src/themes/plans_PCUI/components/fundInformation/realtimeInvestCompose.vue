<template>
    <div class='realtimeInvestCompose'>
        <div class='width-limit'>
            <div class='block'>
                <h4 class='title switch-title'>
                    <span>{{ title || $t('fundInfo.realtimeInvestCompose') }}</span>
                    <span v-if='!allShow && showSwitch' class='rightSwitch icon_chouti1' @click='switchAction'></span>
                    <div v-if='!showSwitch' class='more-tabs'>
                        <div class='box' :class="{ 'active': showBlock === 'list' }">
                            <img class='icon icon1' src='../../images/chart-icon1.png' @click="switchAction('list')" />
                        </div>
                        <div class='box' :class="{ 'active': showBlock === 'chart' }">
                            <img class='icon icon2' src='../../images/chart-icon2.png' @click="switchAction('chart')" />
                        </div>
                    </div>
                </h4>
                <div class='merge-case'>
                    <div v-if="showBlock==='list' || allShow" class='case-list'>
                        <div class='assetsTitle cellflex'>
                            <p class='hd'>
                                {{ $t('fundInfo.assets') }}
                            </p>
                            <p class='bd'>
                                {{ $t('fundInfo.ranking') }}
                                <br v-if='symbolId' />
                                <span class='small'>
                                    ({{ symbolId ? $t('fundInfo.comparePrev') : '24H' }})
                                </span>
                            </p>
                            <p class='ft'>
                                {{ $t('fundInfo.weight') }}
                                <br v-if='symbolId' />
                                <span class='small'>
                                    ({{ symbolId ? $t('fundInfo.comparePrev') : '24H' }})
                                </span>
                            </p>
                        </div>
                        <ul class='assetsList'>
                            <li v-for='item in rangList' :key='item.asset' class='cellflex'>
                                <p class='hd'>
                                    <!-- <i class='currencyIcon'></i> -->
                                    <currency-icon :currency='item.asset' :size='20' />
                                    <span class='name'>
                                        {{ item.asset }}
                                    </span>
                                </p>
                                <p class='bd'>
                                    {{ item.range }}
                                    ( <i v-if="item.previousPeriodRangeCompare!=='-'" :class='{ "downArrow":item.previousPeriodRangeCompare<0, "upArrow":item.previousPeriodRangeCompare>0 }'></i>
                                    {{ item.previousPeriodRangeCompare==='-' ? '-' : Math.abs(item.previousPeriodRangeCompare) }}
                                    )
                                </p>
                                <p class='ft'>
                                    <van-popover v-model:show='item.popover' placement='bottom-end' theme='dark'>
                                        <p
                                            style='padding: 5px 10px;
white-space: nowrap;'
                                        >
                                            {{ item.weightRealValue }}({{ item.previousPeriodWeightCompare }})
                                        </p>
                                        <template #reference>
                                            <span>
                                                {{ item.weight }}
                                                (
                                                <i v-if="item.previousPeriodWeightCompare!=='-'" :class='[item.arrow]'></i>
                                                {{ item.previousPeriodWeightCompare==='-' ? '-' : item.previousPeriodWeightCompare.replace(/[\+-]/,'') }}
                                                )
                                            </span>
                                        </template>
                                    </van-popover>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div v-if="showBlock==='chart' || allShow" class='case-chart'>
                        <div ref='chartPieDOM' class='chartPieDOM' :style='{ height:chartPieDOMHeight }'></div>
                    </div>
                </div>
            </div>
            <div class='block'>
                <h4 class='title singleAssetTitle'>
                    <span>{{ $t('fundInfo.singleAsset') }}</span>
                    <el-tooltip
                        :content="symbolId ? $t('fundInfo.assetIndexQquestionTip') : $t('fundInfo.assetQquestionTip')"
                        effect='light'
                        placement='bottom'
                        trigger='hover'
                    >
                        <van-icon class='question' name='question-o' />
                    </el-tooltip>
                </h4>
                <div ref='chartBarDOM' class='chartBarDOM'></div>
            </div>

            <BottomTip v-if='showBottomTip' />
        </div>
    </div>
</template>

<script setup>
import { delayAwaitTime } from '@/utils/util'
import { computed, nextTick, onMounted, ref, defineProps } from 'vue'
import { useInvestCompose } from './hooks/realtimeInvestCompose'
import currencyIcon from '@/components/currencyIcon'
import BottomTip from './bottomTip.vue'

const props = defineProps({
    // 标题
    title: {
        type: String,
        default: ''
    },
    // symbolId
    symbolId: {
        type: String,
        default: ''
    },
    // 是否全部显示
    allShow: {
        type: Boolean,
        default: false
    },
    // 图表文字旋转
    rotate: {
        type: Number,
        default: 90
    },
    // 是否显示切换按钮
    showSwitch: {
        type: Boolean,
        default: true
    },
    // 是否显示底部提示
    showBottomTip: {
        type: Boolean,
        default: true
    }
})

// 显示数据列表还是显示环形图
const showBlock = ref('list')
// 切换数据列表和环形图的显示
const switchAction = async (value) => {
    if (['chart', 'list'].includes(value)) {
        showBlock.value = value
    } else {
        showBlock.value = showBlock.value === 'list' ? 'chart' : 'list'
    }
    if (showBlock.value === 'chart') {
        await nextTick()
        if (chartPieDOM.value) {
            newPieDoughnutChart(chartPieDOM.value, chartData.value)
        }
    }
}

const rangList = ref([]) // 实时投资组合排名列表
const chartData = computed(() => {
    return rangList.value.map(el => {
        return {
            value: parseFloat(el.weight),
            name: el.asset + ' ' + el.weight,
        }
    })
})

// 饼图高度
const chartPieDOMHeight = computed(() => {
    // return 200 + 'px'
    return 200 + rangList.value.length * 18 + 'px'
})
const assetPerformanceList = ref([]) // 实时投资组合排名
const chartPieDOM = ref('')
const chartBarDOM = ref('')

const { newBarChart, newPieDoughnutChart, getInvestCombination, getAssetPerformance } = useInvestCompose()
onMounted(async () => {
    await nextTick()
    await delayAwaitTime(200)

    // 实时投资组合排名
    getInvestCombination(props.symbolId).then(async data => {
        rangList.value = data.map(el => {
            el.popover = false
            el.arrow = parseFloat(el.previousPeriodWeightCompare) < 0 ? 'downArrow' : 'upArrow'
            return el
        })
        await nextTick()
        if (chartPieDOM.value) {
            newPieDoughnutChart(chartPieDOM.value, chartData.value)
        }
    })

    // 单资产表现柱状图
    getAssetPerformance(props.symbolId).then(data => {
        const chartXData = []
        const chartYData = []
        data.forEach(el => {
            chartYData.push({
                value: el.quoteChange,
                itemStyle: {
                    color: el.quoteChange < 0 ? '#a90000' : '#2b70ae'
                }
            })
            chartXData.push(el.xAxisName)
        })
        assetPerformanceList.value = data
        if (chartBarDOM.value) {
            newBarChart(chartBarDOM.value, [chartXData, chartYData], props)
        }
    })
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.title {
    display: flex;
    align-items: center;
    font-size: rem(32px);
}
.switch-title {
    justify-content: space-between;
    .more-tabs {
        display: flex;
        .box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            margin-left: 10px;
            border-radius: 5px;
            cursor: pointer;
            &.active {
                background: var(--lineColor);
            }
            &:hover {
                background: var(--lineColor);
            }
        }
        .icon {
            &.icon1 {
                width: 36px;
                height: 36px;
            }
            &.icon2 {
                width: 28px;
                height: 28px;
            }
        }
    }
}
.rightSwitch {
    font-size: rem(28px);
    line-height: 1.5;
    cursor: pointer;
}
.assetsTitle {
    margin-top: rem(30px);
    color: var(--minorColor);
    font-size: rem(24px);
}
.assetsList {
    margin-top: rem(20px);
    margin-bottom: rem(20px);
    font-size: rem(28px);
    li {
        margin-bottom: 10px;
    }
}
.cellflex {
    display: flex;
    align-items: center;
    text-align: right;
    .hd {
        display: inline-flex;
        align-items: center;
        text-align: left;
        .name {
            margin-left: 10px;
            line-height: 1;
        }
    }
    .bd {
        flex: 1;
    }
    .ft {
        width: rem(280px);
    }
    .small {
        font-size: rem(22px);
    }
}
.block {
    .question {
        margin-top: -4px;
        margin-left: 5px;
        color: var(--minorColor);
        font-size: 18px;
        cursor: pointer;
    }
}
.chartPieDOM {
    height: rem(400px);
}
.singleAssetTitle {
    padding: rem(30px) 0;
    font-size: rem(32px);
}
.chartBarDOM {
    height: rem(500px);
}
.downArrow {
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    border: 0 solid transparent;
    border-width: 5px 5px 0;
    border-top-color: var(--fallColor);
    border-radius: 3px;
}
.upArrow {
    border-width: 0 5px 5px;
    border-top-color: transparent;
    border-bottom-color: var(--riseColor);
    @extend .downArrow;
}
</style>
