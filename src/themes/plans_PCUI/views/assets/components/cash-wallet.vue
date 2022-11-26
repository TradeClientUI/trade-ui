<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <p class='all'>
                <span class='label'>
                    {{ $t('trade.totalAssets') }}({{ assetsInfo?.currency }})
                </span>
            </p>
            <p class='total-money'>
                {{ assetsInfo?.totalBalance }}
            </p>
            <div class='assets-handle'>
                <button class='btn' @click='goDesposit'>
                    {{ $t('trade.desposit') }}
                </button>
                <button class='btn' @click='goWithdraw'>
                    {{ $t('trade.withdraw') }}
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
            <AssetFilter
                @changeState='changeState'
                @searchAsset='searchAsset'
            />

            <el-table :cell-style="{ background:'none' }" :data='accountList' :empty-text="$t('c.noData')">
                <el-table-column :label="$t('assets.asset')" min-width='150' prop='currency' />
                <el-table-column :label="$t('trade.totalAssets')" min-width='150' prop='balance' />
                <el-table-column :label="$t('trade.free')" min-width='150' prop='available' />
                <el-table-column :label="$t('trade.frozen')" min-width='150' prop='frozen' />
                <el-table-column :label="$t('trade.carry')" min-width='150' prop='withdrawAmount' />
                <el-table-column v-if='customerInfo?.isFund === 1' :label="$t('fundInfo.weight')" min-width='150' prop='weight' />
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
                return list.filter(item => item.balance > 0 && item.currency.toUpperCase().includes(searchText.value.toUpperCase()))
            }
            return list.filter(item => item.currency.toUpperCase().includes(searchText.value.toUpperCase())) || []
        })

        // 账户信息
        const accountInfo = computed(() => accountList?.value[0])

        // 跳转充值页面
        const goDesposit = () => {
            router.push({
                path: '/assets/depositChoose',
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
            goDesposit,
            goWithdraw,
            goTransfer,
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
