<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.proposalNoList' clearable :placeholder="$t('fundManager.ransom.orderNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.customerCompanyId'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.ransom.woName')"
                >
                    <el-option v-for='item in companyList' :key='item.id' :label='item.name' :value='item.id' />
                </el-select>
            </div>
            <div class='item'>
                <el-input v-model='searchParams.customerNoList' clearable :placeholder="$t('fundManager.ransom.customerNo')" />
            </div>
            <div class='item fixedWidth'>
                <el-select
                    v-model='searchParams.currencyRedeem'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.ransom.receiveCurrency')"
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
            <el-table-column :label="$t('fundManager.ransom.orderNo')" :min-width='140' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.ransom.woName')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.ransom.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.ransom.lot')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }}{{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.receiveCurrency')" :min-width='150'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyRedeem==='self'">
                        {{ $t('fundInfo.basketAssets') }}
                    </span>
                    <span v-else>
                        {{ scope.row.currencyRedeem }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.networth')" :min-width='150'>
                <template #default='scope'>
                    <span>{{ scope.row.sharesNet }}{{ scope.row.currencyNet }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.fees')" :min-width='150'>
                <template #default='scope'>
                    <a v-if="scope.row.currencyRedeem==='self'" class='link' href='javascript:;' @click='showSelfFeesDialog(scope.row, "fee")'>
                        {{ $t('common.look') }}
                    </a>
                    <span v-else>
                        {{ scope.row.fees }}{{ scope.row.currencyRedeem }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.moneyTotal')" :min-width='150'>
                <template #default='scope'>
                    <a v-if="scope.row.currencyRedeem==='self'" class='link' href='javascript:;' @click='showSelfFeesDialog(scope.row, "amount")'>
                        {{ $t('common.look') }}
                    </a>
                    <span v-else>
                        {{ scope.row.amountRedeem }}{{ scope.row.currencyRedeem }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.status')" :min-width='160'>
                <template #default='scope'>
                    <span>{{ $t('fundManager.confirmStatus.' + scope.row.sharesStatus) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.applyTime')" :min-width='156' prop='createTime'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.lastTime')" :min-width='156' prop='updateTime'>
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
        <div v-if='tableData.length > 0' class='handle-action'>
            <span></span>
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
    <!-- 一篮子手续费弹窗 -->
    <ransomSelfFeesDialog
        ref='buyDialogRef'
        v-model='selfFeesDialogShow'
        :data='selfFeesDialogData'
        :th-list='selfFeesDialogTHList'
        :title='selfFeesDialogTitle'
        :type='selfFeesDialogType'
    />
</template>

<script setup>
import ransomSelfFeesDialog from './ransom-selfFees-dialog.vue'
import { getCompanyList, getCompanyAssets, getFundRedeemList, getFundInfoByCustomerNo } from '@/api/fund'
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
    // 赎回状态
    sharesStatus: 1,
    // 订单号
    proposalNoList: '',
    // 白标名称
    customerCompanyId: null,
    // 客户编号
    customerNoList: '',
    // 客户接受资产
    currencyRedeem: '',
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
// 获取基金赎回列表
const queryFundRedeemList = () => {
    const params = Object.assign({}, searchParams)
    params.proposalNoList = params.proposalNoList ? params.proposalNoList.split(',') : null
    params.customerNoList = params.customerNoList ? params.customerNoList.split(',') : null
    params.customerCompanyId = params.customerCompanyId || null
    isLoading.value = true
    getFundRedeemList(params).then(res => {
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
        searchParams.startTime = ''
        searchParams.endTime = ''
    }
}
// 改变当前页数
const changePage = (value) => {
    searchParams.current = value
    queryFundRedeemList()
}
// 改变分页数量
const changeSize = (value) => {
    searchParams.size = value
    searchParams.current = 1
    queryFundRedeemList()
}
// 点击搜索
const onSearch = () => {
    searchParams.current = 1
    queryFundRedeemList()
}
// 获取一篮子基金的申购手续费
const showSelfFeesDialog = (item, type = 'fee') => {
    selfFeesDialogData.value = item
    selfFeesDialogType.value = type
    selfFeesDialogShow.value = true
    selfFeesDialogTitle.value = t('fundManager.buy.redeemDetail')
    if (type === 'fee') {
        selfFeesDialogTHList.value = [t('fundInfo.assets'), t('fundManager.ransom.moneyTotal'), t('fundManager.ransom.fees')]
    } else {
        selfFeesDialogTHList.value = [t('fundInfo.assets'), t('fundManager.ransom.moneyTotal'), t('fundManager.ransom.fees')]
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
    // 获取基金赎回列表
    queryFundRedeemList()
    // 获取基金产品详情
    getFundInfo()
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
