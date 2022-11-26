<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='tradeName' />
        <Loading :show='loading' />
        <van-tabs v-model:active='active' class='tabs'>
            <van-tab name='pending' :title="[1, 2].includes(Number(tradeType)) ? $t('trade.curPending') : $t('trade.curTrust')">
                <div v-if='pendingList.length === 0'>
                    <van-empty :description='$t("trade.pendingEmpty")' image='/images/empty.png' />
                </div>
                <div v-else class='trust-wrap'>
                    <van-pull-refresh
                        v-model='loading'
                        :loading-text="$t('compLang.loading')"
                        :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                        :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                        @refresh='onRefresh'
                    >
                        <trustItem
                            v-for='item in pendingList'
                            :key='item.id'
                            :product='item'
                        />
                    </van-pull-refresh>
                </div>
            </van-tab>
            <van-tab name='deal' :title='$t("trade.dealList")'>
                <orderList ref='orderListRef' />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>

import trustItem from '@/themes/plans/modules/trust/trustItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, nextTick, reactive, toRefs, watch } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import orderList from './components/orderList.vue'
export default {
    components: {
        trustItem,
        orderList
    },
    setup (props, context) {
        const { t } = useI18n({ useScope: 'global' })
        const loading = ref(false)
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { tradeType, active } = route.query
        const orderListRef = ref()

        const state = reactive({
            active: active || 'pending',
            loading: false,
            switchProductVisible: false
        })

        const tradeName = computed(() => t('tradeType[' + tradeType + ']'))

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[tradeType] || [])

        const product = computed(() => store.getters.productActived)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const account = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType)))

        const onRefresh = () => {
            queryPendingList()
        }

        watch(
            () => pendingList.value?.length,
            async (newval) => {
                await nextTick()
                if (!newval) return false
                const subscribList = pendingList.value.map(el => {
                    return {
                        symbolId: el.symbolId,
                        tradeType: el.tradeType
                    }
                })

                if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
            },
            { immediate: true }
        )

        watch(() => state.active, newVal => {
            if (Number(newVal) === 0) {
                queryPendingList()
            } else if (Number(newVal) === 1 && orderListRef.value) {
                orderListRef.value.resetParams()
                orderListRef.value.queryRecordList()
            }
        })

        const queryPendingList = () => {
            // 获取委托列表
            const accountIds = []
            if (account.value.length > 0) {
                account.value.forEach(element => {
                    accountIds.push(element.accountId)
                })
            }

            state.loading = true
            store.dispatch('_trade/queryPBOOrderPage', {
                customerNo: customInfo.value.customerNo,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                tradeType: route.query.tradeType,
                accountIds: accountIds + ''
            }).then(res => {
                state.loading = false
            })
        }

        queryPendingList()

        return {
            pendingList,
            loading,
            tradeName,
            onRefresh,
            tradeType,
            orderListRef,
            product,
             ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    padding-top: rem(90px);
    overflow: auto;
    background-color: var(--bgColor);
    .tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        :deep(.van-tabs__wrap) {
            flex: 0 0 44px;
        }
        :deep(.van-tabs__content) {
            height: 100%;
            overflow-y: auto;
        }
        :deep(.van-tab__text) {
            font-size: rem(28px);
        }
        :deep(.van-tabs__line) {
            width: 50%;
            background-color: var(--primary);
        }
        .van-dropdown-menu__item {
            background-color: var(--contentColor);
        }
    }
    .trust-item {
        margin-top: rem(20px);
    }
}
</style>
