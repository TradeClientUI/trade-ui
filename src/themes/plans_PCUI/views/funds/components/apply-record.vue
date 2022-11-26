<template>
    <div>
        <el-table v-loading='loading' :cell-style="{ background:'none' }" :data='list' :max-height='maxHeight'>
            <el-table-column :label="$t('fundInfo.orderNo')" :min-width='minWidth' prop='proposalNo' />
            <el-table-column :label="$t('fundInfo.fundName')" :min-width='minWidth' prop='fundName' />
            <el-table-column :label="$t('fundInfo.shareCurrency')" :min-width='100' prop='currencyShares' />
            <el-table-column :label="$t('fundInfo.buyMoney')" :min-width='minWidth'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyPay === 'self'" class='href' @click='showDetail(scope.row)'>
                        {{ $t('common.look') }}
                    </span>
                    <span v-else>
                        {{ scope.row.amountPay }}{{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundInfo.realtimeJZ')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.sharesNet }} {{ scope.row.currencyNet }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundInfo.buyFee')" :min-width='minWidth'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyPay === 'self'" class='href' @click='showDetail(scope.row)'>
                        {{ $t('common.look') }}
                    </span>
                    <span v-else>
                        {{ scope.row.fees }}{{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundInfo.buyShare')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }} {{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundInfo.shareConfirmStatus')" :min-width='120'>
                <template #default='scope'>
                    <span>{{ $t(`fundInfo.sharesStatus.${scope.row.sharesStatus}`) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundInfo.purchaseTime')" :min-width='160'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='list.length > 0 && showPage' class='handle-action'>
            <el-pagination
                v-model:currentPage='params.current'
                layout='prev, pager, next, sizes'
                :page-size='params.size'
                :page-sizes='[10, 20, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>

    <van-dialog v-model:show='show' :title='$t("fundInfo.applyDetail")' width='30%'>
        <div class='info-wrap'>
            <p class='info-item header'>
                <span> {{ $t('fundInfo.applyAssets') }}</span>
                <span> {{ $t('fundInfo.applyAmount') }}</span>
                <span> {{ $t('fundInfo.applyFees') }}</span>
            </p>
            <p v-for='item in showInfo' :key='item.currency' class='info-item'>
                <span>{{ item.currency }}</span>
                <span>{{ item.amount }}</span>
                <span>{{ item.fees }} </span>
            </p>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, defineProps, defineExpose, computed } from 'vue'
import { useStore } from 'vuex'
import { fundApplyRecord, getFundCurrencyList } from '@/api/fund.js'

defineProps({
    // table最大高度
    maxHeight: {
        type: String,
        default: 'auto'
    },
    // 是否显示分页组件
    showPage: {
        type: Boolean,
        default: false
    }
})

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 列表数据
const list = ref([])
// 加载状态
const loading = ref(false)
// 列表最小宽度
const minWidth = ref(140)
// 列表总数据量
const total = ref(0)
// 请求参数
const params = ref({
    size: 10,
    current: 1,
    currencyShares: '',
    startTime: ''
})

const show = ref(false)
// 一篮子申购记录弹窗内容
const showInfo = ref('')

// 改变当前页数
const changePage = (value) => {
    params.value.current = value
    getData()
}
// 改变分页数量
const changeSize = (value) => {
    params.value.size = value
    params.value.current = 1
    getData()
}
// 获取数据
const getData = (data = {}) => {
    if (!customerInfo.value) return
    params.value = Object.assign({}, params.value, data)
    const result = Object.assign({}, params.value)
    result.currencyShares = result.currencyShares || null
    result.startTime = result.startTime || null
    loading.value = true
    fundApplyRecord(result).then(res => {
        loading.value = false
        if (res.check()) {
            const { data } = res
            list.value = data.records
            total.value = data.total
        }
    })
}

const showDetail = row => {
    show.value = true
    getFundCurrencyList({
        customerNo: customerInfo.value.customerNo,
        proposalNo: row.proposalNo,
    }).then(res => {
        if (res.check()) {
            if (res.data?.length > 0) {
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

// 暴露子组件属性或方法
defineExpose({
    getData
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '../table.scss';
.handle-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 60px;
}
.href {
    color: var(--primary);
    cursor: pointer;
}
.info-wrap {
    padding: 15px 30px;
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
            padding: 0.2rem;
            color: var(--normalColor);
            font-size: 12px;
            border-top: 1px solid var(--minorColor);
            border-left: 1px solid var(--minorColor);
            &:nth-of-type(3n) {
                border-right: 1px solid var(--minorColor);
            }
        }
        &.header {
            span {
                color: var(--minorColor);
                font-weight: bold;
            }
        }
    }
}
</style>
