<template>
    <el-space v-if='productList && productList.length > 0' alignment='flex-start' class='w-full' direction='vertical' fill>
        <h3>{{ t('latestTradingOpportunities') }}</h3>
        <el-table class='product-table w-full' :data='productList' @row-click='goDetail'>
            <el-table-column :label="$t('common.symbolName')" prop='symbolName' width='180'>
                <template #default='scope'>
                    <el-space>
                        <CurrencyIcon
                            v-if='scope.row.isCryptocurrency'
                            class='symbolCurrencyIcon'
                            :currency='scope.row.baseCurrency'
                            :size='24'
                        />
                        <span>
                            {{
                                scope.row.isCryptocurrency
                                    ? scope.row.baseCurrency
                                    : scope.row.symbolName
                            }}
                        </span>
                    </el-space>
                </template>
            </el-table-column>
            <el-table-column :label="$t('latestPrice')" prop='rolling_last_price' />
            <el-table-column label="$t('24Hchange')" prop='rolling_upDownWidth'>
                <template #default='scope'>
                    <span
                        :class='[scope.row.rolling_upDownColor]'
                    >
                        {{ scope.row.rolling_upDownWidth }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align='right' width='50'>
                <template #default>
                    <el-icon>
                        <DArrowRight />
                    </el-icon>
                </template>
            </el-table-column>
        </el-table>
    </el-space>
</template>

<script setup >
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import CurrencyIcon from '@/components/currencyIcon'
import { DArrowRight } from '@element-plus/icons'

const store = useStore()
const router = useRouter()

const businessConfig = computed(() => store.state.businessConfig)

// 获取配置的需要展示的产品
const productList = computed(() => {
    const productKeys = []
    const ids = businessConfig.value.registerSuccessProductIds || []
    // businessConfig文件配置需要展示的产品
    const list = store.state._quote.productList.filter(item => ids.includes(item.symbolId)).map(item => {
        productKeys.push(item.symbolId + '_' + item.tradeType)
        return item
    })
    // 订阅产品数据
    QuoteSocket.send_subscribe24H(productKeys)
    return list
})

// 跳转到产品交易页面
const goDetail = (rows) => {
    router.push(`/order?symbolId=${rows.symbolId}&tradeType=${rows.tradeType}`)
}

</script>

<style scoped lang="scss">
.w-full {
    width: 100%;
}
.product-table {
    margin-bottom: 20px;
    border: 1px solid var(--lineColor);
    border-radius: 6px;
    :deep(.el-table__row:last-of-type) {
        td.el-table__cell {
            border: none;
        }
    }
    :deep(.el-table__inner-wrapper) {
        &::before {
            display: none;
        }
        tr {
            cursor: pointer;
        }
    }
}
</style>
