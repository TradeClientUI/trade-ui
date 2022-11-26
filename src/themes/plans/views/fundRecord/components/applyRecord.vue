<template>
    <div class='applyRecord'>
        <filterBox :assets-list='assetsList' @assetChange='assetChange' @dateChange='dateChange' />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='fundApplyRecord'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundApplyRecordItem
                            :data='item'
                            @showDetail='showDetail(item)'
                        />
                    </div>
                </template>
            </listVue>
        </div>
    </div>
    <van-dialog v-model:show='show' :title="$t('fundInfo.applyDetail')">
        <div class='info-wrap'>
            <p class='info-item header'>
                <span>{{ $t('fundInfo.applyAssets') }}</span>
                <span>{{ $t('fundInfo.applyAmount') }}</span>
                <span>{{ $t('fundInfo.applyFees') }}</span>
            </p>
            <p v-for='item in showInfo' :key='item.currency' class='info-item'>
                <span>{{ item.currency }}</span>
                <span>{{ item.amount }}</span>
                <span>{{ item.fees }}</span>
            </p>
        </div>
    </van-dialog>
</template>

<script setup>
import listVue from '@plans/views/record/components/list.vue'
import fundApplyRecordItem from '@plans/modules/fundApplyRecord/fundApplyRecordItem.vue'
import filterBox from './filterBox.vue'
import { fundApplyRecord, getFundCurrencyList } from '@/api/fund'
import { hooks } from './hooks'
import { useStore } from 'vuex'
import { ref, unref, computed } from 'vue'

const params = {}
const { assetsList } = hooks()
const store = useStore()
const listRef = ref(null)
const showInfo = ref([])
const show = ref(false)
const refresh = () => {
    unref(listRef) && unref(listRef).refresh()
}
// 获取账户信息
const customerNo = computed(() => store.state._user.customerInfo.customerNo)
// 筛选日期
const assetChange = val => {
    params.currencyShares = val || ''
    refresh()
}
// 筛选日期
const dateChange = val => {
    const [startTime, endTime] = val || []
    params.startTime = startTime
    params.endTime = endTime
    refresh()
}

const showDetail = item => {
    getFundCurrencyList({
        customerNo: customerNo.value,
        proposalNo: item.proposalNo,
    }).then(res => {
        if (res.check()) {
            if (res.data?.length > 0) {
                show.value = true
                showInfo.value = []
                res.data.forEach(el => {
                    showInfo.value.push({
                        currency: el.currency,
                        amount: el.amount,
                        fees: el.fees
                    })
                })
            }
        }
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.applyRecord {
    display: flex;
    flex-flow: column;
    height: 100%;
    .listContainer {
        flex: 1;
        overflow-y: auto;
        background: var(--contentColor);
    }
}
.info-wrap {
    padding: rem(30px) rem(60px);
    .info-item {
        display: flex;
        justify-content: space-between;
        &:last-of-type {
            span {
                border-bottom: 1px solid var(--minorColor);
            }
        }
        span {
            flex: 1;
            padding: rem(12px);
            color: var(--normalColor);
            font-size: rem(24px);
            border-top: 1px solid var(--minorColor);
            border-left: 1px solid var(--minorColor);
            &:nth-of-type(3n) {
                border-right: 1px solid var(--minorColor);
            }
        }
        &.header {
            span {
                color: var(--normalColor);
                font-weight: bold;
            }
        }
    }
}
</style>
