<template>
    <div class='assetsWrapper' :class='{ mt: plans.length <= 1 }'>
        <plansType v-if='plans.length > 1' class='plansType' :list='plans' :value='tradeType' @change='handleTradeType' />
        <van-swipe
            ref='assetsSwipe'
            :duration='duration'
            :initial-swipe='0'
            :show-indicators='false'
            :touchable='false'
            @change='onChange'
        >
            <van-swipe-item v-for='item in plans' :key='item.id'>
                <div v-if='Number(item.id) === 1' class='plans-item'>
                    <TotalAssetsFullPosition
                        class='block'
                    />
                    <PositionList />
                </div>
                <div v-if='Number(item.id) === 2' class='plans-item'>
                    <TotalAssetsBywarehouse class='block' />
                    <PositionList />
                </div>
                <div v-if='[3,9,5].indexOf(Number(item.id)) > -1' class='plans-item'>
                    <TotalAssets class='block' />
                    <AssetFilter
                        :hide-asset='hideAsset'
                        @changeState='changeState'
                        @searchAsset='searchAsset'
                    />
                    <div v-if='accountList.length > 0'>
                        <AssetsItem
                            v-for='account in accountList'
                            :key='account.accountId'
                            class='block'
                            :data='account'
                        />
                    </div>
                    <van-empty v-else :description="$t('trade.noAssets')" />
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import TotalAssets from './components/totalAssets.vue'
import TotalAssetsFullPosition from './components/totalAssetsFullPosition.vue'
import TotalAssetsBywarehouse from './components/totalAssetsBywarehouse.vue'
import AssetFilter from '@plans/components/assetFilter.vue'
import AssetsItem from '@plans/modules/assets/assetsItem.vue'
import PositionList from '@plans/modules/positionList/positionList'
import { reactive, toRefs, nextTick, ref, onMounted, unref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { computed, watchEffect, watch, onUnmounted } from '@vue/runtime-core'
import { isEmpty, localSet, localGet } from '@/utils/util'
import { QuoteSocket, MsgSocket } from '@/plugins/socket/socket'
import plansType from '@/themes/plans/components/plansType.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        PositionList,
        AssetsItem,
        TotalAssets,
        TotalAssetsBywarehouse,
        TotalAssetsFullPosition,
        plansType,
        AssetFilter
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const assetsSwipe = ref(null)
        const curIndex = ref(0)

        const hideAsset = ref(JSON.parse(localGet('hideAsset')))
        const tradeSearchMap = ref({})
        const state = reactive({
            duration: 0,
            alreadySub: false
        })

        // 获取账户列表
        const accountList = computed(() => {
            const list = store.state._user?.customerInfo?.accountList && store.state._user?.customerInfo?.accountList.filter(item => Number(item.tradeType) === Number(tradeType.value))
            const searchText = tradeSearchMap.value[tradeType.value] || ''
            if (hideAsset.value) {
                if (Number(tradeType.value) === 3) {
                    return list.filter(item => (item.balance > 0 || item.liabilitiesPrincipal > 0) && item.currency.toUpperCase().includes(searchText.toUpperCase()))
                } else if (Number(tradeType.value) === 5) {
                    return list.filter(item => item.balance > 0 && item.currency.toUpperCase().includes(searchText.toUpperCase()))
                }
            }
            return list.filter(item => item.currency.toUpperCase().includes(searchText.toUpperCase())) || []
        })

        const customerInfo = computed(() => store.state._user.customerInfo)

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)

        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)

        // 获取持仓列表
        const positionList = computed(() => store.state._trade.positionList[tradeType.value] || [])

        // 获取当前 tab 下标
        const tabIndex = computed(() => plans.value.findIndex(item => {
            return (Number(item.id) === Number(tradeType.value))
        }))

        // 获取持仓列表
        const queryPositionList = (tradeType) => {
            if (isEmpty(customerInfo.value)) {
                return
            }
            const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(tradeType))?.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId
            }).then(res => {
                if (res.check()) {
                    if (!state.alreadySub) {
                        sendSubscribe(res.data)
                    }
                }
            }).catch(() => {
            }).finally(() => {
                // 订阅资产数据
                MsgSocket.subscribedListAdd(function () {
                    MsgSocket.subscribeAsset(tradeType)
                })
            })
        }

        const sendSubscribe = (data) => {
            if (data.length > 0) {
                const subscribList = data.map(el => {
                    return {
                        symbolId: el.symbolId,
                        tradeType: el.tradeType
                    }
                })
                QuoteSocket.send_subscribe(subscribList)
            }
        }

        // 点击tab事件
        const handleTradeType = (val) => {
            state.alreadySub = false
            const curIndex = plans.value.findIndex(item => item.id === val)
            assetsSwipe.value.swipeTo(curIndex)
            store.commit('_quote/Update_tradeType', val)
            initData(val)
        }

        const initData = (val) => {
            if ([1, 2].indexOf(Number(val)) > -1) {
                queryPositionList(val)
            } else if ([3, 5, 9].indexOf(Number(val)) > -1) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: val })
            }
        }

        // swipwe 滑动组件
        const onChange = (index) => {
            const tradeType = plans.value[index].id
            store.commit('_quote/Update_tradeType', tradeType)
        }

        // 路由变化取消订阅
        watch(() => route.path, (newVal) => {
            if (newVal !== '/positionDetail') {
                MsgSocket.cancelSubscribeAsset()
            }
        })

        // 持仓列表数据变化重新订阅
        watch(() => positionList.value, (newVal, oldVal) => {
            if (newVal.length > 0 && newVal.length !== oldVal.length) {
                state.alreadySub = true
                sendSubscribe(newVal)
            }
        })

        // 隐藏0资产事件
        const changeState = val => {
            hideAsset.value = val
        }

        // 搜索资产
        const searchAsset = val => {
            tradeSearchMap.value[tradeType.value] = val
        }

        onMounted(() => {
            const index = tabIndex.value === -1 ? 0 : tabIndex.value
            assetsSwipe.value && assetsSwipe.value.swipeTo(index)

            if (plans.value.length === 1) {
                const tradeType = plans.value[0]?.id
                store.commit('_quote/Update_tradeType', tradeType)
            }
            initData(tradeType.value)

            // 每次切换资产页面拉取用户信息
            store.dispatch('_user/findCustomerInfo', false)
        })

        return {
            accountList,
            onChange,
            curIndex,
            assetsSwipe,
            tradeType,
            plans,
            handleTradeType,
            changeState,
            searchAsset,
            hideAsset,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsWrapper {
    overflow: auto;
    .plans-item {
        padding: 0 rem(20px);
    }
    &.mt {
        margin-top: rem(20px);
    }
    .block {
        margin-bottom: rem(20px);
        border-radius: 4px;
    }
    .playType {
        background-color: var(--bgColor);
    }
    .plansType {
        position: sticky;
        top: 0;
        z-index: 9;
    }
}
</style>
