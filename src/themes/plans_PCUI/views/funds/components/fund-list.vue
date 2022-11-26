<template>
    <div class='fund-list'>
        <el-table :cell-style="{ background:'none' }" :data='fundProductList'>
            <el-table-column>
                <el-table-column :label="$t('fundInfo.fundName')" :min-width='minWidth'>
                    <template #default='scope'>
                        <strong>{{ scope.row.fundName }}</strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.fundIcon')" :min-width='minWidth'>
                    <template #default='scope'>
                        <currency-icon class='currency' :currency='scope.row.shareTokenCode' size='20px' />
                        <strong>{{ scope.row.shareTokenCode }}</strong>
                    </template>
                </el-table-column>
            </el-table-column>
            <!-- 基金申购赎回 -->
            <el-table-column align='center' :label="$t('funds.buyRedeem')">
                <el-table-column :label="$t('funds.trend')" :min-width='minWidth'>
                    <template #default='scope'>
                        <kline-svg
                            v-if='netValueArrs[scope.$index]?.length > 0'
                            :data='netValueArrs[scope.$index]'
                            :height='20'
                            :width='80'
                        />
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.realtimeJZ')" :min-width='120' prop='netValue'>
                    <template #default='scope'>
                        <strong>{{ scope.row.netValue }} {{ scope.row.currencyCode }}</strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.dayUpDown')" :min-width='minWidth' prop='netValueChangeQuote'>
                    <template #default='scope'>
                        <strong :class="{ 'riseColor': scope.row.netValueChangeQuote.replace('%', '') > 0, 'fallColor': scope.row.netValueChangeQuote.replace('%', '') < 0 }">
                            {{ scope.row.netValueChangeQuote }}
                        </strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('funds.applyStatus')" :min-width='120'>
                    <template #default='scope'>
                        <strong v-if='scope.row.canPurchase === 1'>
                            {{ $t('funds.canApply') }}
                        </strong>
                        <strong v-else>
                            {{ $t('funds.notApply') }}
                        </strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('funds.redeemStatus')" :min-width='120'>
                    <template #default='scope'>
                        <strong v-if='scope.row.canRedemption === 1'>
                            {{ $t('funds.canRedeem') }}
                        </strong>
                        <strong v-else>
                            {{ $t('funds.notRedeem') }}
                        </strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.operating')" :min-width='160'>
                    <template #default='scope'>
                        <div class='handle'>
                            <span @click="goDeal(scope.row.fundId, 'apply')">
                                {{ $t('fundInfo.buy') }}
                            </span>
                            <span @click="goDeal(scope.row.fundId, 'redeem')">
                                {{ $t('fundInfo.sell') }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
            <!-- 现货买卖 -->
            <el-table-column align='center' :label="$t('funds.cashDeal')">
                <el-table-column :label="$t('funds.trend')" :min-width='minWidth'>
                    <template #default='scope'>
                        <kline-svg
                            v-if='marketPriceArrs[scope.$index]?.length > 0'
                            :data='marketPriceArrs[scope.$index]'
                            :height='20'
                            :width='80'
                        />
                        <span v-else>
                            -
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('funds.newPrice')" :min-width='120' prop='marketPrice'>
                    <template #default='scope'>
                        <strong>{{ scope.row.marketPrice }} {{ scope.row.currencyCode }}</strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.dayUpDown')" :min-width='minWidth' prop='marketPriceChangeQuote'>
                    <template #default='scope'>
                        <strong :class="{ 'riseColor': scope.row.marketPriceChangeQuote.replace('%', '') > 0, 'fallColor': scope.row.marketPriceChangeQuote.replace('%', '') < 0 }">
                            {{ scope.row.marketPriceChangeQuote }}
                        </strong>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.operating')" :min-width='minWidth'>
                    <template #default='scope'>
                        <div class='handle'>
                            <span @click="goDeal(scope.row.fundId, 'trade')">
                                {{ $t('funds.deal') }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'
import klineSvg from '@planspc/components/klineSvg.vue'

const selectFund = inject('selectFund')
// 基金列表基金净值数据
const netValueArrs = inject('netValueArrs')
// 基金列表市场价格数据
const marketPriceArrs = inject('marketPriceArrs')
// 基金产品列表
const { fundProductList } = useFund()
// 列表最小宽度
const minWidth = ref(100)

// 去交易
const goDeal = (fundId, active) => {
    selectFund(fundId, active)
}
</script>

<style lang='scss' scoped>
@import "@/sass/mixin.scss";
.fund-list {
    margin: 16px 0;
    background: var(--contentColor);
    .currency {
        margin-right: 5px;
    }
    .handle {
        display: flex;
        span {
            margin-right: 10px;
            text-decoration: underline;
            color: var(--primary);
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
// el-table
:deep(.el-table) {
    background-color: transparent;
    &::before {
        background: none;
    }
    .el-checkbox {
        height: auto;
        position: relative;
        top: 3px;
    }
    .el-table__fixed-right::before {
        background: none;
    }
    .el-table__cell.is-right {
        background: var(--contentColor) !important;
    }
    .cell {
        line-height: 16px;
    }
    thead {
        tr {
            font-size: 13px;
            color: var(--color);
            background: transparent;
            th {
                font-weight: normal;
                border-bottom: 1px solid var(--lineColor) !important;
                background: transparent !important;
            }
        }
    }
    tbody {
        tr {
            font-size: 13px;
            color: var(--color);
            background: transparent;
            td {
                border-bottom: 1px solid var(--lineColor);
                background: transparent;
            }
        }
    }
    .el-table__body-wrapper {
        @include scroll-pc();
    }
}
</style>
