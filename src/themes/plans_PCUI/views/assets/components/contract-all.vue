<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <p class='all'>
                <span class='label'>
                    {{ $t('trade.balance') }}({{ assetsInfo?.currency }})
                </span>
            </p>
            <p class='total-money'>
                {{ userAccount?.balance || '--' }}
            </p>
            <ul class='assets-ul'>
                <li>
                    <span>{{ $t('trade.jingzhi') }}</span>
                    <strong>{{ userAccount?.netWorth || '--' }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.marginLevel') }}</span>
                    <strong>{{ userAccount?.marginRadio || '--' }}%</strong>
                </li>
                <li>
                    <span>{{ $t('trade.freeMargin') }}</span>
                    <strong>{{ userAccount?.availableMargin || '--' }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.originalMargin') }}</span>
                    <strong>{{ userAccount?.occupyMargin || '--' }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.positionProfit') }}</span>
                    <strong :class="userAccount?.profitLoss > 0 ? 'riseColor': 'fallColor'">
                        {{ userAccount?.profitLoss || '--' }}
                    </strong>
                </li>
            </ul>
            <div class='assets-handle'>
                <button v-if='$store.state._base.plans.length>1' class='btn' @click='goTransfer'>
                    {{ $t('trade.transfer') }}
                </button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinjilu'></i>
                    <span>{{ $t('trade.fundRecord') }}</span>
                </div>
            </div>
        </div>
        <div class='assets-body'>
            <el-table :cell-style="{ background:'none' }" :data='positionList' :empty-text="$t('c.noData')" height='100%'>
                <el-table-column :label="$t('common.symbolName')" prop='symbolName' width='120' />
                <el-table-column :label="$t('trade.profit') + '('+ assetsInfo.currency +')'" :min-width='minWidth'>
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
                <el-table-column :label="$t('trade.myPosition') + '(' + $t('trade.volumeUnit') + ')'" min-width='120'>
                    <template #default='scope'>
                        <span>{{ minus(scope.row.openVolume, scope.row.closeVolume) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.positionPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ scope.row.openPrice }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.currentPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ Number(scope.row.direction) === 1 ? currentProduct(scope.row)?.sell_price : currentProduct(scope.row)?.buy_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.stopLossPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.stopLossDecimal) ? scope.row.stopLossDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.stopProfitPrice')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span>{{ parseFloat(scope.row.takeProfitDecimal) ? scope.row.takeProfitDecimal : '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.openTime')" :min-width='160'>
                    <template #default='scope'>
                        <span>{{ formatTime(scope.row.openTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.positionId')" :min-width='160'>
                    <template #default='scope'>
                        <span>{{ scope.row.positionId }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" min-width='130'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button @click='openSltp(scope.row)'>
                                {{ $t('trade.tackStopSetup') }}
                            </button>
                            <button @click='openClosePosition(scope.row)'>
                                {{ $t('trade.closed') }}
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
        </div>
    </div>

    <!-- 平仓组件 -->
    <close-position ref='closePosition' />
    <!-- 止盈止损 -->
    <sltp ref='sltp' />
</template>

<script>
// compontens
import closePosition from './close-position.vue'
import sltp from './sltp.vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { minus } from '@/utils/calculation'

export default {
    components: {
        closePosition,
        sltp
    },
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const closePosition = ref(null)
        const sltp = ref(null)
        const minWidth = 130
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 账户资产
        const userAccount = computed(() => store.state._user.accountAssets[props.tradeType])
        // 资产信息
        const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === props.tradeType))
        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[props.tradeType])
        // 获取当产品数据
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }

        // 跳转到划转页面
        const goTransfer = () => {
            router.push({
                path: '/assets/transfer',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: props.tradeType
                }
            })
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            router.push({
                path: '/assets/record',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: props.tradeType
                }
            })
        }

        // 平仓调窗
        const openClosePosition = (row) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            closePosition.value.open(row)
        }

        // 止盈止损弹窗
        const openSltp = (row) => {
            store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
            store.commit('_trade/Update_modifyPositionId', row.positionId + '_' + row.tradeType)
            sltp.value.open(row)
        }

        return {
            minus,
            productMap,
            userAccount,
            assetsInfo,
            positionList,
            currentProduct,
            goTransfer,
            goRecord,
            closePosition,
            openClosePosition,
            sltp,
            openSltp,
            minWidth
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>
