<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.proposalNo' clearable :placeholder="$t('fundManager.buy.orderNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.customerCompanyId'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.buy.woName')"
                >
                    <el-option v-for='item in companyList' :key='item.id' :label='item.name' :value='item.id' />
                </el-select>
            </div>
            <div class='item'>
                <el-input v-model='searchParams.customerSelfNo' clearable :placeholder="$t('fundManager.buy.customerNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.currencyPay'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.buy.payCurrency')"
                >
                    <el-option v-for='item in assetsList' :key='item.code' :label='item.code' :value='item.code' />
                </el-select>
            </div>
            <div class='item-date'>
                <el-date-picker
                    v-model='timeRange'
                    :end-placeholder="$t('compLang.endTime')"
                    range-separator='-'
                    :start-placeholder="$t('compLang.startTime')"
                    type='datetimerange'
                    value-format='YYYY-MM-DD HH:mm:ss'
                    @change='selectTime'
                />
            </div>
            <button class='btn' @click='onSearch'>
                {{ $t('compLang.search') }}
            </button>
        </div>
    </div>
    <div v-loading='isLoading' class='body-case'>
        <el-table
            ref='tableRef'
            :cell-style="{ background:'none' }"
            :data='tableData'
            :empty-text="$t('c.noData')"
            @selection-change='selectionChange'
        >
            <el-table-column type='selection' width='50' />
            <el-table-column :label="$t('fundManager.buy.orderNo')" :min-width='140' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.buy.woName')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.buy.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.buy.money')" :min-width='180'>
                <template #default='scope'>
                    <span>{{ scope.row.amountPay }}{{ scope.row.currencyPay }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.payCurrency')" :min-width='minWidth' prop='currencyPay' />
            <el-table-column :label="$t('fundManager.buy.netWorth')" :min-width='150'>
                <template #default='scope'>
                    <span>{{ scope.row.sharesNet }}{{ scope.row.currencyNet }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.fees')" :min-width='150'>
                <template #default='scope'>
                    <span>{{ scope.row.fees }}{{ scope.row.currencyPay }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.finalMoney')" :min-width='150'>
                <template #default='scope'>
                    <span>{{ scope.row.finalAmount }}{{ scope.row.currencyPay }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.lot')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }}{{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.status')" :min-width='160'>
                <template #default='scope'>
                    <span>{{ $t('fundManager.confirmStatus.' + scope.row.sharesStatus) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.applyTime')" :min-width='156' prop='createTime'>
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
        <div v-if='tableData.length > 0' class='handle-action'>
            <button :class="['btn', { 'disable': disableBtn }]" @click='openBuyDialog'>
                {{ $t('fundManager.buy.executeOrder') }}
            </button>
            <el-pagination
                v-model:currentPage='searchParams.current'
                layout='prev, pager, next, sizes'
                :page-size='searchParams.size'
                :page-sizes='[10, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>

    <!-- 申购执行下单弹窗 -->
    <buy-dialog ref='buyDialogRef' @confirm='onConfirm' />
</template>

<script setup>
import buyDialog from './buy-dialog.vue'
import { getCompanyList, getCompanyAssets, getFundApplyList } from '@/api/fund'
import { ElInput, ElDatePicker } from 'element-plus'
import { useStore } from 'vuex'
import { onMounted, ref, reactive, watch, computed } from 'vue'

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 加载状态
const isLoading = ref(false)
// 公司列表
const companyList = ref([])
// 资产列表
const assetsList = ref([])
// 表格元素
const tableRef = ref(null)
// 批量下单元素
const buyDialogRef = ref(null)
// 选择的区间
const timeRange = ref(null)
// 搜索参数
const searchParams = reactive({
    // 类型
    type: 1,
    // 用户组id
    customerGroupId: customerInfo.value.customerGroupId,
    // 订单号
    proposalNo: '',
    // 白标名称
    customerCompanyId: '',
    // 客户编号
    customerSelfNo: '',
    // 申购支付资产
    currencyPay: '',
    // 开始时间
    startTime: null,
    // 结束时间
    endTime: null,
    // 当前分页页数
    current: 1,
    // 分页数量
    size: 10
})
// 列表数据
const tableData = ref([])

// 列表最小宽度
const minWidth = ref(120)
// 列表总数据量
const total = ref(100)
// 选择的列表数据
const selectList = ref([])
// 是否禁用批量下单按钮
const disableBtn = ref(true)

// 监听选择的列表数据
watch(selectList, () => {
    disableBtn.value = selectList.value.length === 0
})

// 获取公司列表
const queryCompanyList = () => {
    getCompanyList().then(res => {
        companyList.value = res.data
    })
}
// 获取公司资产列表
const queryAssetsList = () => {
    getCompanyAssets({
        companyId: customerInfo.value.companyId
    }).then(res => {
        assetsList.value = res.data
    })
}
// 获取基金申购列表
const queryApplyList = () => {
    const params = Object.assign({}, searchParams)
    params.customerSelfNo = params.customerSelfNo ? params.customerSelfNo.split(',') : []
    params.proposalNo = params.proposalNo ? params.proposalNo.split(',') : []
    params.customerCompanyId = params.customerCompanyId || null
    isLoading.value = true
    getFundApplyList(params).then(res => {
        isLoading.value = false
        if (res.check()) {
            const { data } = res
            tableData.value = data.records
            total.value = data.total
        }
    }).catch(() => {
        isLoading.value = false
    })
}
// 选择时间
const selectTime = () => {
    const value = timeRange.value
    if (value) {
        searchParams.startTime = window.dayjs(value[0]).valueOf()
        searchParams.endTime = window.dayjs(value[1]).valueOf()
    } else {
        searchParams.startTime = null
        searchParams.endTime = null
    }
}
// 改变当前页数
const changePage = (value) => {
    searchParams.current = value
    queryApplyList()
}
// 改变分页数量
const changeSize = (value) => {
    searchParams.size = value
    searchParams.current = 1
    queryApplyList()
}
// 点击搜索
const onSearch = () => {
    searchParams.current = 1
    queryApplyList()
}
// 选择列表
const selectionChange = (list) => {
    selectList.value = list
}
// 打开批量下单弹窗
const openBuyDialog = () => {
    if (disableBtn.value) return
    const ids = selectList.value.map(elem => elem.id)
    buyDialogRef.value.open(ids)
}
// 确定批量下单
const onConfirm = () => {
    selectList.value = []
    tableRef.value.clearSelection()
    searchParams.current = 1
    queryApplyList()
}

onMounted(() => {
    // 获取公司列表
    queryCompanyList()
    // 获取公司资产列表
    queryAssetsList()
    // 获取基金申购列表
    queryApplyList()
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
