<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <p v-if='assetsInfo' class='all'>
                <span class='label'>
                    {{ $t('trade.totalAssets') }}({{ assetsInfo?.currency }})
                </span>
                <span v-if='Number(tradeType) === 3' :class='["riskLevel", "riskLevel" + assetsInfo.riskLevel]'>
                    {{ riskLevelMap[assetsInfo.riskLevel] }}
                </span>
                <span v-else-if='Number(tradeType) !== 5' class='risk'>
                    {{ $t('trade.riskLevel') }} {{ assetsInfo?.closeProportion }}
                </span>
            </p>
            <p class='total-money'>
                {{ assetsInfo?.totalBalance || '--' }}
            </p>
            <ul class='assets-ul'>
                <li>
                    <span>{{ $t('trade.netAssets') }}</span>
                    <strong>{{ assetsInfo?.totalNetAssets }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.totalLoan') }}</span>
                    <strong>{{ assetsInfo?.totalLiabilitiesPrincipal }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.swap_2') }}</span>
                    <strong>{{ assetsInfo?.totalInterest }}</strong>
                </li>
            </ul>
            <div class='assets-handle'>
                <!-- 暂时屏蔽借款 -->
                <!-- <button class='btn' @click='goLoan'>
                    {{ $t('trade.loan') }}
                </button> -->
                <button class='btn' @click='goRepayment'>
                    {{ $t('trade.repayment') }}
                </button>
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
            <!-- 资产搜索 -->
            <AssetFilter @changeState='changeState' @searchAsset='searchAsset' />
            <el-table :cell-style="{ background: 'none' }" :data='accountList' :empty-text="$t('c.noData')">
                <el-table-column :label="$t('assets.asset')" min-width='150' prop='currency' />
                <el-table-column :label="$t('trade.totalAssets')" min-width='150' prop='balance' />
                <el-table-column :label="$t('trade.free')" min-width='150' prop='available' />
                <el-table-column :label="$t('trade.frozen')" min-width='150' prop='frozen' />
                <el-table-column :label="$t('trade.loan')" min-width='150' prop='liabilitiesPrincipal' />
                <el-table-column :label="$t('trade.swap_2')" min-width='150' prop='interest' />
                <el-table-column :label="$t('trade.carry')" min-width='150' prop='withdrawAmount' />
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" min-width='120'>
                    <template #default='scope'>
                        <div class='handle'>
                            <!-- <button @click='goLoan(scope.row)'>
                                {{ $t('trade.loan') }}
                            </button> -->
                            <button @click='goRepayment(scope.row)'>
                                {{ $t('trade.repayment') }}
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
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AssetFilter from '@planspc/components/assetFilter.vue'
import { localGet, debounce, localSet, isEmpty } from '@/utils/util'

export default {
    components: {
        AssetFilter
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

        const hideAsset = ref(JSON.parse(localGet('hideAsset')))
        const searchText = ref('')

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 资产信息
        const assetsInfo = computed(() => store.state._user.assetsInfo[props.tradeType])

        // 账户列表
        const accountList = computed(() => {
            const list = store.state._user?.customerInfo?.accountList && store.state._user?.customerInfo?.accountList.filter(item => Number(item.tradeType) === Number(props.tradeType))

            if (hideAsset.value) {
                return list.filter(item => (item.balance > 0 || item.liabilitiesPrincipal > 0) && item.currency.toUpperCase().includes(searchText.value.toUpperCase()))
            }
            return list.filter(item => item.currency.toUpperCase().includes(searchText.value.toUpperCase())) || []
        })

        // 账户信息
        const accountInfo = computed(() => accountList?.value[0])

        // 跳转到借款页面
        const goLoan = (row) => {
            if (row.accountId) {
                router.push({
                    path: '/assets/loan',
                    query: {
                        currency: row.currency,
                        accountId: row.accountId,
                        tradeType: props.tradeType
                    }
                })
            } else {
                router.push({
                    path: '/assets/chooseAccount',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        tradeType: props.tradeType,
                        type: 1
                    }
                })
            }
        }

        // 跳转到还款页面
        const goRepayment = (row) => {
            if (row.accountId) {
                router.push({
                    path: '/assets/returnMoney',
                    query: {
                        currency: row.currency,
                        accountId: row.accountId,
                        tradeType: props.tradeType
                    }
                })
            } else {
                router.push({
                    path: '/assets/chooseAccount',
                    query: {
                        accountId: accountInfo.value.accountId,
                        tradeType: props.tradeType,
                        type: 3
                    }
                })
            }
        }

        // 跳转到划转页面
        const goTransfer = () => {
            router.push({
                path: '/assets/transfer',
                query: {
                    tradeType: props.tradeType
                }
            })
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            router.push({
                path: '/assets/record',
                query: {
                    accountId: accountInfo.value.accountId,
                    tradeType: props.tradeType
                }
            })
        }

        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger')
        }

        // 隐藏0资产事件
        const changeState = val => {
            hideAsset.value = val
        }

        // 搜索资产
        const searchAsset = val => {
            searchText.value = val
        }

        return {
            assetsInfo,
            accountList,
            goLoan,
            goRepayment,
            goTransfer,
            riskLevelMap,
            goRecord,
            customerInfo,
            changeState,
            searchAsset
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>
