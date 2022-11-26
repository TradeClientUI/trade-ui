<template>
    <div>
        <div class='tabs'>
            <span :class="{ 'active': params.sharesStatus === 0 }" @click='switchActive(0)'>
                {{ $t('fundInfo.currentRedeem') }}
            </span>
            <span :class="{ 'active': params.sharesStatus === 1 }" @click='switchActive(1)'>
                {{ $t('fundInfo.historyRedeem') }}
            </span>
        </div>
        <el-table v-loading='loading' :cell-style="{ background:'none' }" :data='list' :max-height='maxHeight'>
            <el-table-column :label="$t('fundInfo.orderNo')" :min-width='minWidth' prop='proposalNo' />
            <el-table-column :label="$t('fundInfo.fundName')" :min-width='minWidth' prop='fundName' />
            <el-table-column :label="$t('fundInfo.shareCurrency')" :min-width='100' prop='currencyShares' />
            <el-table-column :label="$t('fundInfo.redeemShare')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }} {{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if='params.sharesStatus === 0' :label="$t('fundInfo.receiveCurrency')" :min-width='minWidth' prop='currencyRedeem'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyRedeem === 'self'">
                        {{ $t('fundInfo.basketAssets') }}
                    </span>
                    <span v-else>
                        {{ scope.row.currencyRedeem }}
                    </span>
                </template>
            </el-table-column>
            <template v-if='params.sharesStatus === 1'>
                <el-table-column :label="$t('fundInfo.realtimeJZ')" :min-width='minWidth' prop='sharesNet'>
                    <template #default='scope'>
                        <span>{{ scope.row.sharesNet }} {{ scope.row.currencyNet }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.redeemFee')" :min-width='minWidth' prop='fees'>
                    <template #default='scope'>
                        <span v-if="scope.row.currencyRedeem === 'self'" class='href' @click='showDetail(scope.row)'>
                            {{ $t('common.look') }}
                        </span>
                        <span v-else>
                            {{ scope.row.fees }} {{ scope.row.currencyRedeem }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fundInfo.redeemMoney')" :min-width='minWidth' prop='amountRedeem'>
                    <template #default='scope'>
                        <span v-if="scope.row.currencyRedeem === 'self'" class='href' @click='showDetail(scope.row)'>
                            {{ $t('common.look') }}
                        </span>
                        <span v-else>
                            {{ scope.row.amountRedeem }} {{ scope.row.currencyRedeem }}
                        </span>
                    </template>
                </el-table-column>
            </template>
            <el-table-column :label="$t('fundInfo.shareConfirmStatus')" :min-width='120'>
                <template #default='scope'>
                    <span>{{ $t(`fundInfo.sharesStatus.${scope.row.sharesStatus}`) }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if='params.sharesStatus === 0' :label="$t('fundInfo.applyTime')" :min-width='160'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if='params.sharesStatus === 1' :label="$t('fundInfo.confirmTime')" :min-width='160'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.updateTime) }}</span>
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

    <van-dialog v-model:show='show' :title='$t("fundInfo.redeemDetail")' width='30%'>
        <div class='info-wrap'>
            <p class='info-item header'>
                <span> {{ $t('fundInfo.redeemAssetsTitle') }}</span>
                <span> {{ $t('fundInfo.redeemAmount') }}</span>
                <span> {{ $t('fundInfo.redeemFees') }}</span>
            </p>
            <p v-for='item in showInfo' :key='item.currency' class='info-item'>
                <span> {{ item.currency }}</span>
                <span>{{ item.amount }}</span>
                <span>{{ item.fees }} </span>
            </p>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits, computed } from 'vue'
import { useStore } from 'vuex'
import { fundRedeemRecord, getFundRedeemCurrencyList } from '@/api/fund.js'

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

const show = ref(false)
// 一篮子申购记录弹窗内容
const showInfo = ref('')
const emits = defineEmits(['setSharesStatus'])
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
    currencyRedeem: '',
    sharesStatus: 0,
    startTime: '',
    updateStartTime: ''
})

// 切换赎回状态
const switchActive = (value) => {
    if (params.value.sharesStatus === value) return
    params.value.sharesStatus = value
    params.value.current = 1
    params.value.startTime = ''
    params.value.updateStartTime = ''
    getData()
}
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
    emits('setSharesStatus', params.value.sharesStatus)
    params.value = Object.assign(params.value, data)
    const result = Object.assign({}, params.value)
    result.currencyShares = result.currencyShares || null
    result.currencyRedeem = result.currencyRedeem || null
    result.sharesStatus = result.sharesStatus === '' ? null : result.sharesStatus
    result.startTime = result.startTime || null
    result.updateStartTime = result.updateStartTime || null
    loading.value = true
    fundRedeemRecord(result).then(res => {
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
    getFundRedeemCurrencyList({
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
.tabs {
    display: flex;
    align-items: center;
    padding-top: 10px;
    span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        padding: 3px 7px;
        font-size: 12px;
        border: 1px solid var(--lineColor);
        cursor: pointer;
        &:hover {
            color: var(--primary);
        }
    }
    .active {
        color: #FFF;
        background: var(--primary);
        border-color: var(--primary);
        &:hover {
            color: #FFF;
        }
    }
}
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
