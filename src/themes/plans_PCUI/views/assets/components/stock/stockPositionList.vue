<template>
    <el-table :cell-style="{ background:'none' }" :data='positionList' :empty-text="$t('c.noData')" height='100%'>
        <el-table-column :label="$t('common.symbolName')" prop='symbolName' width='120' />
        <el-table-column :label="$t('trade.code')" prop='symbolCode' width='80' />
        <el-table-column :label="$t('trade.profit')" :min-width='minWidth'>
            <template #default='scope'>
                <span :class="parseFloat(scope.row.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                    {{ scope.row.profitLoss }}
                </span>
            </template>
        </el-table-column>
        <el-table-column :label="$t('trade.direction')" :min-width='minWidth'>
            <template #default='scope'>
                <span :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                    {{ Number(scope.row.direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                </span>
            </template>
        </el-table-column>
        <el-table-column :label='$t("trade.positionNumber")' min-width='120'>
            <template #default='scope'>
                <span>{{ scope.row.openNum }}</span>
            </template>
        </el-table-column>
        <el-table-column :label='$t("trade.cost")' :min-width='minWidth'>
            <template #default='scope'>
                <span>{{ scope.row.costPrice }}</span>
            </template>
        </el-table-column>
        <el-table-column :label='$t("trade.marketValue")' :min-width='minWidth'>
            <template #default='scope'>
                <span>{{ getMarketValue(scope.row, productMap[scope.row.symbolId+'_'+scope.row.tradeType]) }}</span>
            </template>
        </el-table-column>
        <el-table-column :label='$t("assets.currentPrice")' :min-width='minWidth'>
            <template #default='scope'>
                <span :class='[currentProduct(scope.row).cur_color]'>
                    {{ currentProduct(scope.row)?.cur_price }}
                </span>
            </template>
        </el-table-column>
        <el-table-column align='right' fixed='right' :label="$t('c.handle')" min-width='130'>
            <template #default='scope'>
                <div class='handle'>
                    <button @click='toOrder(scope.row)'>
                        {{ $t('route.trade') }}
                    </button>
                </div>
            </template>
        </el-table-column>
        <template #empty>
            <span class='emptyText'>
                {{ $t('c.noData') }}
            </span>
        </template>
    </el-table>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { minus, mul, toFixed } from '@/utils/calculation'
import { useRouter } from 'vue-router'

defineProps({
    positionList: {
        type: Array,
        default: () => []
    }
})

const minWidth = 130
const router = useRouter()
const store = useStore()
const productMap = computed(() => store.state._quote.productMap)

// 获取当产品数据
const currentProduct = (row) => {
    return productMap.value[row.symbolId + '_' + row.tradeType] || {}
}
const getMarketValue = (row, product) => {
    if (!product) return ''
    const val = mul(product.cur_price, row.openNum)
    return toFixed(val, 2)
}

// 去交易
const toOrder = (row) => {
    // console.log(row, `/order?name=${row.symbolName}&symbolId=${row.symbolId}&tradeType=${row.tradeType}`)
    router.push(`/order?name=${row.symbolName}&symbolId=${row.symbolId}&tradeType=${row.tradeType}`)
}

</script>

<style lang="scss" scoped>
.handle {
    text-align: right;
    button {
        position: relative;
        z-index: 0;
        display: inline-block;
        width: 80px;
        height: 28px;
        margin-right: 10px;
        overflow: hidden;
        color: var(--primary);
        font-weight: 400;
        font-size: 14px;
        line-height: 26px;
        text-align: center;
        vertical-align: middle;
        border: 1px solid var(--primary);
        background: #FFF;
        border-radius: 4px;
        cursor: pointer;
        &:last-of-type {
            margin-right: 0;
        }
        &:hover {
            color: #FFF;
            background: var(--primary);
        }
    }
}
</style>
