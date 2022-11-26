<template>
    <div class='recordList'>
        <tabBar v-model:active='tabActive' />
        <div v-if='tabActive===0' class='listWrap'>
            <fundApplyRecordItem v-for='(item,i) in applyRecordData' :key='item' :data='item' :index='i' />
        </div>
        <div v-else-if='tabActive===1' class='listWrap'>
            <van-tabs v-model:active='redeemActive' class='redeemTab' type='card'>
                <van-tab :title='$t("fundInfo.curRedeem")' />
                <van-tab :title='$t("fundInfo.historyRedeem")' />
            </van-tabs>
            <template v-if='redeemRecordData.length===0'>
                <van-empty :description='$t("common.noData")' image='/images/empty.png' />
            </template>
            <template v-if='redeemActive===0'>
                <fundRedeemRecordItem v-for='(item,i) in redeemRecordData' :key='item' :data='item' :index='i' />
            </template>
            <template v-else>
                <fundRedeemRecordHistoryItem v-for='(item,i) in redeemRecordData' :key='item' :data='item' :index='i' />
            </template>
        </div>
        <!-- 资产 -->
        <div v-else-if='tabActive===2'>
            <assetsItem v-for='account in accountList' :key='account.accountId' class='block' :data='account' />
        </div>
    </div>
</template>

<script>
import tabBar from './tabBar.vue'
import fundApplyRecordItem from '@plans/modules/fundApplyRecord/fundApplyRecordItem.vue'
import fundRedeemRecordItem from '@plans/modules/fundApplyRecord/fundRedeemRecordItem.vue'
import fundRedeemRecordHistoryItem from '@plans/modules/fundApplyRecord/fundRedeemRecordHistoryItem.vue'
import assetsItem from '@plans/modules/assets/assetsItem.vue'
import { ref, computed, unref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { fundApplyRecord, fundRedeemRecord } from '@/api/fund'

export default {
    components: {
        tabBar,
        fundApplyRecordItem,
        fundRedeemRecordItem,
        fundRedeemRecordHistoryItem,
        assetsItem,
    },
    setup () {
        const store = useStore()

        // 现货账户列表
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 5))
        const tabActive = ref(0)
        const redeemActive = ref(0)
        const applyRecordData = ref([])
        const redeemRecordData = ref([])

        // 获取基金申购记录
        const getFundApplyRecord = function () {
            fundApplyRecord({ size: 10, current: 1 }).then(res => {
                if (res.check()) {
                    applyRecordData.value = res.data.records
                }
            })
        }

        // 获取基金赎回记录
        const getFundRedeemRecord = function () {
            fundRedeemRecord({ size: 10, current: 1, sharesStatus: unref(redeemActive) }).then(res => {
                if (res.check()) {
                    redeemRecordData.value = res.data.records
                }
            })
        }

        // 刷新
        const refresh = () => {
            if (tabActive.value === 0) {
                getFundApplyRecord()
            } else if (tabActive.value === 1) {
                getFundRedeemRecord()
            } else if (tabActive.value === 2) {
                getFundRedeemRecord()
                store.dispatch('_user/findCustomerInfo', false)
            }
        }

        watch(
            [redeemActive, tabActive],
            () => {
                applyRecordData.value = []
                redeemRecordData.value = []
                refresh()
            }
        )

        onMounted(() => {
            getFundApplyRecord()
        })

        return {
            tabActive,
            redeemActive,
            applyRecordData,
            redeemRecordData,
            accountList,
            refresh,
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.recordList {
    margin-top: rem(30px);
    // background: var(--contentColor);
    .listWrap {
        margin-top: rem(30px);
    }
    .redeemTab {
        margin: rem(20px) 6%;

        --van-tabs-default-color: var(--primary);
        :deep(.van-tab--active .van-tab__text) {
            color: #FFF;
        }
    }
}
</style>
