<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <ul class='assets-ul'>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.freeMargin') }}</span>
                        <van-icon class='question' name='question-o' @click='showExplain(5)' />
                    </p>
                    <p class='value'>
                        <strong>{{ userAccount?.availableMargin || '--' }}</strong>
                    </p>
                </li>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.allOriginalMargin') }}</span>
                        <van-icon class='question' name='question-o' @click='showExplain(6)' />
                    </p>
                    <p class='value'>
                        <strong>{{ userAccount?.occupyMargin || '--' }}</strong>
                    </p>
                </li>
                <li>
                    <p class='muted'>
                        <span>{{ $t('trade.positionProfit') }}</span>
                    </p>
                    <p class='value'>
                        <strong :class="{ 'riseColor': userAccount?.profitLoss > 0 , 'fallColor': userAccount?.profitLoss < 0 }">
                            {{ userAccount?.profitLoss || '--' }}
                        </strong>
                    </p>
                </li>
            </ul>
            <div class='assets-handle'>
                <template v-if='businessConfig?.tradeTypeShowCash.includes(Number(tradeType)) && customerInfo.companyType === "real"'>
                    <button class='btn pc_assets_deposit_ga' @click='goDesposit'>
                        {{ $t('trade.desposit') }}
                    </button>
                    <button class='btn' @click='goWithdraw'>
                        {{ $t('trade.withdraw') }}
                    </button>
                </template>
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
                <el-table-column :label="$t('common.symbolName')" :min-width='minWidth' prop='symbolName' />
                <el-table-column :label="$t('trade.profit') + '('+ assetsInfo.currency +')'" :min-width='minWidth'>
                    <template #default='scope'>
                        <span :class="{ 'riseColor': parseFloat(scope.row.profitLoss) > 0 , 'fallColor': parseFloat(scope.row.profitLoss) < 0 }">
                            {{ scope.row.profitLoss }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.swap_2') + '('+ assetsInfo.currency +')'" :min-width='minWidth' prop='interest' />
                <el-table-column :label="$t('trade.direction')" :min-width='minWidth'>
                    <template #default='scope'>
                        <span :class="Number(scope.row.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(scope.row.direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('trade.myPosition') + '(' + $t('trade.volumeUnit') + ')'" :min-width='minWidth'>
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
                <el-table-column :min-width='160'>
                    <template #header>
                        <div class='header-cell'>
                            <span>{{ $t('trade.prospectMandatory') }}</span>
                            <van-icon class='question' name='question-o' @click='showExplain(7)' />
                        </div>
                    </template>
                    <template #default='scope'>
                        <span>{{ scope.row.previewStopPrice || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width='160'>
                    <template #header>
                        <div class='header-cell'>
                            <span>{{ $t('trade.originalMargin') }}</span>
                            <van-icon class='question' name='question-o' @click='showExplain(8)' />
                        </div>
                    </template>
                    <template #default='scope'>
                        <span> {{ scope.row.occupyTheMargin || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width='160'>
                    <template #header>
                        <div class='header-cell'>
                            <span>{{ $t('trade.holdMargin') }}</span>
                            <van-icon class='question' name='question-o' @click='showExplain(9)' />
                        </div>
                    </template>
                    <template #default='scope'>
                        <span>{{ scope.row.maintenanceMargin || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width='minWidth'>
                    <template #header>
                        <div class='header-cell'>
                            <span>风险状态</span>
                            <van-icon class='question' name='question-o' @click='showExplain(10)' />
                        </div>
                    </template>
                    <template #default='scope'>
                        <span :class='["riskLevel", "riskLevel" + scope.row.riskStatus]'>
                            {{ riskLevelMap[scope.row.riskStatus] }}
                        </span>
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
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" min-width='220'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button @click='openAdjustMargin(scope.row)'>
                                {{ $t('trade.modifyMargin') }}
                            </button>
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
                    <div class='none-data'>
                        <button @click='onTrade'>
                            {{ $t('common.startTrade') }}
                        </button>
                        <p class='tip'>
                            {{ $t('trade.positionEmpty') }}
                        </p>
                    </div>
                </template>
            </el-table>
        </div>
    </div>

    <!-- 调整保证金组件 -->
    <adjust-margin ref='adjustMargin' />
    <!-- 平仓组件 -->
    <close-position ref='closePosition' />
    <!-- 止盈止损 -->
    <sltp ref='sltp' />
    <!-- 说明弹窗 -->
    <explain-popup
        v-model='isExplain'
        :explain-type='explainType'
        :user-account='userAccount'
    />
</template>

<script>
// compontens
import adjustMargin from './adjust-margin.vue'
import closePosition from './close-position.vue'
import sltp from './sltp.vue'
import explainPopup from './explain-popup.vue'

import { computed, ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { minus } from '@/utils/calculation'

export default {
    components: {
        adjustMargin,
        closePosition,
        sltp,
        explainPopup
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
        const { t } = useI18n({ useScope: 'global' })
        const adjustMargin = ref(null)
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

        // 配置文件
        const businessConfig = computed(() => store.state.businessConfig)

        // 账户列表
        const accountList = computed(() => {
            return store.state._user?.customerInfo?.accountList && store.state._user?.customerInfo?.accountList.filter(item => Number(item.tradeType) === Number(props.tradeType))
        })

        // 账户信息
        const accountInfo = computed(() => accountList?.value[0])

        // 获取当产品数据
        const currentProduct = (row) => {
            return productMap.value[row.symbolId + '_' + row.tradeType]
        }
        const state = reactive({
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0
        })
        // 风险状态等级文案
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger')
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

        // 调整保证金弹窗
        const openAdjustMargin = (row) => {
            adjustMargin.value.open(row)
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

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
        }

        // 跳转充值页面
        const goDesposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    tradeType: props.tradeType
                }
            })
        }

        // 跳转提现页面
        const goWithdraw = () => {
            router.push({
                path: '/assets/withdrawAccount',
                query: {
                    accountId: accountInfo.value.accountId,
                    tradeType: props.tradeType
                }
            })
        }

        // 去交易
        const onTrade = () => {
            router.push('quote')
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
            adjustMargin,
            openAdjustMargin,
            closePosition,
            openClosePosition,
            sltp,
            openSltp,
            minWidth,
            ...toRefs(state),
            showExplain,
            riskLevelMap,
            customerInfo,
            businessConfig,
            goDesposit,
            goWithdraw,
            onTrade
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>
