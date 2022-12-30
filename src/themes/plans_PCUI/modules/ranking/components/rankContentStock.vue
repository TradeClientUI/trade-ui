<template>
    <div class='rankContent'>
        <div class='item'>
            <RankingItemStock
                ref='increaseListRef'
                v-model:currency='increaseCurrency'
                :currency-list='profitCurrencyList'
                :icon-size='iconSize'
                :index-column='indexColumn'
                :label-index='activeTab'
                :max='max'
                :title='$t("ranking.increaseRanking")'
                type='increaseRanking'
            />
        </div>
        <div class='item'>
            <RankingItemStock
                ref='declineListRef'
                v-model:currency='declineCurrency'
                :currency-list='profitCurrencyList'
                :icon-size='iconSize'
                :index-column='indexColumn'
                :label-index='activeTab'
                :max='max'
                :title='$t("ranking.declineRanking")'
                type='declineRanking'
            />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import RankingItemStock from './rankingItemStock'
import { formatAmount } from '@/utils/calculation'
export default {
    components: {
        RankingItemStock,
    },
    props: {
        indexColumn: {
            type: Boolean,
            default: false
        },
        profitCurrencyList: {
            type: Array,
            default: () => ([])
        },
        type: {
            type: String,
            default: 'module'
        },
        max: {
            type: Number,
            default: 3
        },
        activeTab: {
            type: String,
            default: '0'
        },
        activeLabelCode: {
            type: String,
            default: ''
        },
    },
    setup (props) {
        const iconSize = props.type === 'module' ? '24px' : '20px'
        const increaseListRef = ref(null)
        const declineListRef = ref(null)
        const increaseCurrency = ref('') // 涨幅榜币种
        const declineCurrency = ref('') // 跌幅榜币种
        const amountCurrency = ref('') // 成交额榜币种

        // 给父级调用
        const refreshSort = () => {
            increaseListRef.value.sortFunc()
            declineListRef.value.sortFunc()
        }

        return {
            iconSize,
            formatAmount,
            refreshSort,
            increaseListRef,
            declineListRef,
            increaseCurrency,
            declineCurrency,
            amountCurrency,
        }
    }
}
</script>

<style lang="scss" scoped>
.rankContent {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .item {
        flex: 1;
        margin-right: 50px;
        &:last-child {
            margin-right: 0;
        }
    }
    .label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.lastLabel {
    text-align: right;
}
.symbolCurrencyIcon {
    margin-right: 8px;
}
.symbolCurrency {
    display: inline-block;
    line-height: 16px;
    vertical-align: middle;
    font-size: 14px;
}
</style>
