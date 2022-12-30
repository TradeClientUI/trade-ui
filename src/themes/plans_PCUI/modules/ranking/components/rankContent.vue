<template>
    <div class='rankContent'>
        <div class='item'>
            <RankingItem
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
            <RankingItem
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
        <div v-if="'cryptocurrency'===activeLabelCode" class='item'>
            <RankingItem
                v-model:currency='amountCurrency'
                :currency-list='profitCurrencyList'
                :icon-size='iconSize'
                :index-column='indexColumn'
                :label-index='activeTab'
                :max='max'
                :title='$t("ranking.amountRanking")'
                type='amountRanking'
            >
                <template #header>
                    <span v-if='indexColumn' class='label'></span>
                    <span class='label'>
                        {{ $t('trade.name') }}
                    </span>
                    <span class='label'>
                        {{ $t('trade.priceLabel') }}
                    </span>
                    <span class='label lastLabel'>
                        {{ $t('ranking.24hAmount') }}
                    </span>
                </template>
                <template #default='{ item,i }'>
                    <span v-if='indexColumn' class='label'>
                        {{ i + 1 }}
                    </span>
                    <span class='label'>
                        <CurrencyIcon v-if='item.isCryptocurrency' class='symbolCurrencyIcon' :currency='item.baseCurrency' :size='iconSize' />
                        <span class='symbolCurrency'>
                            {{ item.isCryptocurrency ? item.baseCurrency : item.symbolName }}
                        </span>
                    </span>
                    <span class='label' :class='[item.last_color]'>
                        {{ item.rolling_last_price }}
                    </span>
                    <span class='label lastLabel' :class='[item.rolling_upDownColor]'>
                        {{ formatAmount(item.rolling_amount) }}
                    </span>
                </template>
            </RankingItem>
        </div>
        <div v-if="'stock'===activeLabelCode" class='item'>
            <RankingItem
                v-model:currency='amountCurrency'
                :currency-list='profitCurrencyList'
                :index-column='indexColumn'
                :label-index='activeTab'
                :max='max'
                :title='$t("ranking.tradeVolumeRanking")'
                type='tradingVolume'
            >
                <template #header>
                    <span v-if='indexColumn' class='label'></span>
                    <span class='label'>
                        {{ $t('trade.name') }}
                    </span>
                    <span class='label'>
                        {{ $t('trade.priceLabel') }}
                    </span>
                    <span class='label lastLabel'>
                        {{ $t('ranking.24hTradeVolume') }}
                    </span>
                </template>
                <template #default='{ item, i }'>
                    <span v-if='indexColumn' class='label'>
                        {{ i + 1 }}
                    </span>
                    <span class='label'>
                        <CurrencyIcon v-if='item.isCryptocurrency' class='symbolCurrencyIcon' :currency='item.baseCurrency' :size='iconSize' />
                        <span class='symbolCurrency'>
                            {{ item.isCryptocurrency ? item.baseCurrency : item.symbolName }}
                        </span>
                    </span>
                    <span class='label' :class='[item.last_color]'>
                        {{ item.rolling_last_price }}
                    </span>
                    <span class='label lastLabel' :class='[item.rolling_upDownColor]'>
                        {{ formatAmount(item.rolling_transactions_number) }}
                    </span>
                </template>
            </RankingItem>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import RankingItem from './rankingItem'
import CurrencyIcon from '@/components/currencyIcon'
import { formatAmount } from '@/utils/calculation'
export default {
    components: {
        RankingItem,
        CurrencyIcon,
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
        const increaseCurrency = ref('') // 涨幅榜币种
        const declineCurrency = ref('') // 跌幅榜币种
        const amountCurrency = ref('') // 成交额榜币种

        return {
            iconSize,
            formatAmount,
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
