<template>
    <div class='fund-content'>
        <div class='fund-info-wrap'>
            <fundInfo :fund='fund' />
        </div>
        <div class='fundInformation'>
            <fundInformation
                :key='key'
                all-show
                :fund-id='fund.fundId'
                jump='push'
                :show-tabs='false'
            />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineAsyncComponent, watch } from 'vue'
import fundInfo from './fundInfo.vue'
import LoadingComponent from '@/components/loadingComponent'

const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})

// 组件key值
const key = ref('')
// 监听fundId
watch(() => props.fund.fundId, () => {
    key.value = Date.now()
})

const fundInformation = defineAsyncComponent({
    loader: () => import('@planspc/components/fundInformation'),
    loadingComponent: LoadingComponent,
    delay: 0, // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
    suspensible: false
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fund-content {
    :deep .width-limit {
        max-width: 1200px;
        min-width: 600px;
        margin: 0 auto;
    }
}
.fund-info-wrap {
    padding: 20px 25px;
    background: var(--contentColor);
    border-radius: 10px 10px 0 0;
}
.fundInformation {
    :deep {
        .base {
            padding: 0 25px 20px;
            background: var(--contentColor);
            border-radius: 0 0 10px 10px;
            .fundBaseList {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .item {
                    width: calc(50% - 20px);
                    font-size: 14px;
                }
            }
        }
        .fundPerformance {
            padding: 20px 25px;
            margin-top: 10px;
            background: var(--contentColor);
            border-radius: 10px;
        }
        .realtimeInvestCompose {
            padding: 20px 25px;
            margin-top: 10px;
            background: var(--contentColor);
            border-radius: 10px;
            .assetsTitle {
                font-size: 14px;
                .small {
                    font-size: 12px;
                }
            }
            .assetsList {
                .cellflex {
                    font-size: 12px;
                }
                .currencyIcon {
                    width: 32px;
                }
            }
            .merge-case {
                display: flex;
                .case-list {
                    flex: 1;
                    margin-right: 30px;
                    min-width: 300px;
                }
                .case-chart {
                    flex: 1;
                }
            }
        }
        .cellTitle, .title, .singleAssetTitle {
            font-size: 20px !important;
        }
        .chartLine {
            height: 400px;
        }
        .chartBarDOM {
            height: 400px;
        }
        .minorTip {
            font-size: 15px;
            margin-bottom: 20px;
        }
    }
}
</style>
