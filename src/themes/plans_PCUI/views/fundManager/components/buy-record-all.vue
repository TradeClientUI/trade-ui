<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.proposalNo' clearable :placeholder="$t('fundManager.buy.orderNo')" />
            </div>
            <div class='item'>
                <el-input v-model='searchParams.executeId' clearable :placeholder="$t('fundManager.buy.executeNo')" />
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
                    <el-option v-for='item in purchaseCurrencySetting' :key='item.currencyCode' :label='item.currencyName' :value='item.currencyCode' />
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
        <el-table ref='tableRef' :cell-style="{ background:'none' }" :data='tableData' :empty-text="$t('c.noData')">
            <el-table-column :label="$t('fundManager.buy.orderNo')" :min-width='140' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.buy.woName')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.buy.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.buy.money')" :min-width='180'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyPay==='self'">
                        --
                    </span>
                    <span v-else>
                        {{ scope.row.amountPay }}{{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.payCurrency')" :min-width='180'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyPay==='self'">
                        {{ $t('fundManager.buy.basketAssets') }}
                    </span>
                    <span v-else>
                        {{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.netWorth')" :min-width='150'>
                <template #default='scope'>
                    <span>{{ scope.row.sharesNet }}{{ scope.row.currencyNet }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.lot')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }}{{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.fees')" :min-width='150'>
                <template #default='scope'>
                    <a v-if="scope.row.currencyPay==='self'" class='link' href='javascript:;' @click='showSelfFeesDialog(scope.row, "fee")'>
                        {{ $t('trade.check') }}
                    </a>
                    <span v-else>
                        {{ scope.row.fees }}{{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.finalMoney')" :min-width='150'>
                <template #default='scope'>
                    <a v-if="scope.row.currencyPay==='self'" class='link' href='javascript:;' @click='showSelfFeesDialog(scope.row, "amount")'>
                        {{ $t('trade.check') }}
                    </a>
                    <span v-else>
                        {{ scope.row.finalAmount }}{{ scope.row.currencyPay }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.sharesConfirmStatus')" :min-width='162'>
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
            <span></span>
            <el-pagination
                v-model:currentPage='searchParams.page'
                layout='prev, pager, next, sizes'
                :page-size='searchParams.size'
                :page-sizes='[10, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>
    <!-- 一篮子手续费弹窗 -->
    <selfFeesDialog
        ref='buyDialogRef'
        v-model='selfFeesDialogShow'
        :data='selfFeesDialogData'
        :th-list='selfFeesDialogTHList'
        :title='selfFeesDialogTitle'
        :type='selfFeesDialogType'
    />
</template>

<script setup>
import selfFeesDialog from './selfFees-dialog.vue'
import { getCompanyList, getCompanyAssets, getFundApplyList, getFundInfoByCustomerNo } from '@/api/fund'
import { ElInput, ElDatePicker } from 'element-plus'
import { useStore } from 'vuex'
import { onMounted, ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 加载状态
const isLoading = ref(false)
// 公司列表
const companyList = ref([])
// 资产列表
const assetsList = ref([])
// 选择的区间
const timeRange = ref(null)
// 一篮子手续费弹窗是否显示
const selfFeesDialogShow = ref(false)
const selfFeesDialogData = ref({})
const selfFeesDialogType = ref('fee') // fee 手续费   amount 最终申购金额
const selfFeesDialogTitle = ref('') // 弹窗标题
const selfFeesDialogTHList = ref([]) // 弹窗的table列表表头

// 搜索参数
const searchParams = reactive({
    // 类型
    type: 3,
    // 用户组id
    customerGroupId: customerInfo.value.customerGroupId,
    // 订单号
    proposalNo: '',
    // 申购执行id
    executeId: '',
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
    params.proposalNo = params.proposalNo ? params.proposalNo.split(',') : []
    params.customerSelfNo = params.customerSelfNo ? params.customerSelfNo.split(',') : []
    params.executeId = params.executeId ? params.executeId.split(',') : []
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
// 格式化下单执行标准数据
const formatStandard = (list) => {
    if (!list) return '--'
    let result = ''
    list.map(elem => {
        result += `${elem.symbolName} ${elem.rate}%、`
    })
    return result.substring(0, result.length - 1)
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
// 获取一篮子基金的申购手续费
const showSelfFeesDialog = (item, type = 'fee') => {
    selfFeesDialogData.value = item
    selfFeesDialogType.value = type
    selfFeesDialogShow.value = true
    selfFeesDialogTitle.value = t('fundManager.buy.subscriptionDetail')
    if (type === 'fee') {
        selfFeesDialogTHList.value = [t('fundInfo.assets'), t('fundManager.buy.finalMoney'), t('fundManager.buy.fees')]
    } else {
        selfFeesDialogTHList.value = [t('fundInfo.assets'), t('fundManager.buy.finalMoney'), t('fundManager.buy.fees')]
    }
}

const purchaseCurrencySetting = ref([]) // 申购资产设置
// 获取基金产品详情
const getFundInfo = () => {
    getFundInfoByCustomerNo().then(res => {
        if (res.check()) {
            purchaseCurrencySetting.value = res.data.purchaseCurrencySetting.map(el => {
                return {
                    ...el,
                    currencyName: el.currencyCode === 'self' ? t('fundManager.buy.basketAssets') : el.currencyName
                }
            })
        }
    })
}

onMounted(() => {
    // 获取公司列表
    queryCompanyList()
    // 获取公司资产列表
    queryAssetsList()
    // 获取基金申购列表
    queryApplyList()
    // 获取基金产品详情
    getFundInfo()
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
.standard-btn {
    @include ellipsis;
    cursor: pointer;
}
</style>
