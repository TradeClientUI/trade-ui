<template>
    <div class='pending-wrap'>
        <van-empty v-if='orderList.length===0' :description='$t("trade.pendingEmpty")' image='/images/empty.png' />
        <template v-else>
            <pendingItem v-for='item in orderList' :key='item' :data='item' @showClose='showClose' />
        </template>
    </div>
    <DialogBottomTip
        v-model:show='showCancelOrderTip'
        :tips="$t('trade.cancelPendingConfirm')"
        :title="$t('trade.cancelPending')"
        @submit='cancelOrderHandler'
    />
    <Loading :show='loading' />
</template>

<script>
import { computed, reactive, toRefs, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import pendingItem from './pendingItem'
import { closePboOrder } from '@/api/trade'
import DialogBottomTip from '@plans/components/dialogBottomTip'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        pendingItem,
        DialogBottomTip,
    },
    emits: ['refresh'],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            showCancelOrderTip: false,
        })
        let cur = null

        const orderList = computed(() => store.state._trade.pendingList)

        const showClose = (data) => {
            store.commit('_quote/Update_productActivedID', data.symbolId)
            cur = data
            state.showCancelOrderTip = true
        }
        // 取消挂单
        const cancelOrderHandler = () => {
            state.showCancelOrderTip = false
            // bizType 0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
            const params = {
                pboId: cur.id.toString(),
                bizType: cur.bizType
            }
            state.loading = true
            closePboOrder(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast(t('trade.cancelSuccess'))
                    store.dispatch('_trade/queryPBOOrderPage')
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }
        return {
            ...toRefs(state),
            orderList,
            showClose,
            cancelOrderHandler,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending-wrap {
    padding-top: rem(40px);
}
</style>
