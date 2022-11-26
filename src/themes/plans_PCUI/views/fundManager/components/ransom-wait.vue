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
        <el-table ref='tableRef' :cell-style="{ background:'none' }" :data='tableData' :empty-text="$t('c.noData')" @selection-change='selectionChange'>
            <el-table-column type='selection' width='50' />
            <el-table-column :label="$t('fundManager.ransom.orderNo')" :min-width='140' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.ransom.woName')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.ransom.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.ransom.lot')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ scope.row.shares }}{{ scope.row.currencyShares }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.ransom.receiveCurrency')" :min-width='160'>
                <template #default='scope'>
                    <span v-if="scope.row.currencyRedeem==='self'">
                        {{ $t('fundInfo.basketAssets') }}
                    </span>
                    <span v-else>
                        {{ scope.row.currencyRedeem }}
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
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='tableData.length > 0' class='handle-action'>
            <div class='left'>
                <button :class="['btn', { 'disable': disableBtn }]" @click='openLotDialog("preview")'>
                    {{ $t('fundManager.ransom.preview') }}
                </button>
                <button :class="['btn', { 'disable': disableBtn }]" @click='openLotDialog("confirm")'>
                    {{ $t('fundManager.ransom.confirmLot') }}
                </button>
                <!-- <template v-if='!disableBtn'>
                    <span>{{ $t('fundManager.ransom.totalLot') }}: {{ totalLot }} {{ currency }}</span>
                    <span>{{ $t('assets.free') }}: {{ usable }} {{ currency }}</span>
                </template> -->
            </div>
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

    <!-- 确认份额弹窗 -->
    <lot-dialog ref='lotDialogRef' :type='lotDialogType' @confirm='onConfirm' />
</template>

<script setup>
import lotDialog from './lot-dialog.vue'
import { getCompanyList, getCompanyAssets, getFundRedeemList, getFundRedeemMoney, getFundInfoByCustomerNo } from '@/api/fund'
import { ElInput, ElDatePicker } from 'element-plus'
import { Toast } from 'vant'
import { onMounted, ref, reactive, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 可用
const usable = computed(() => {
    if (currency.value && currency.value !== 'self') {
        const accountList = customerInfo.value?.accountList.filter(el => Number(el.tradeType) === 5)
        const account = accountList.find(el => el.currency === currency.value)
        return Number(account.available)
    }
    return ''
})
// 加载状态
const isLoading = ref(false)
// 公司列表
const companyList = ref([])
// 资产列表
const assetsList = ref([])
// 表格元素
const tableRef = ref(null)
// 批量下单元素
const lotDialogRef = ref(null)
// 弹窗类型
const lotDialogType = ref('preview') // preview 预览  confirm 确认份额
// 选择的区间
const timeRange = ref(null)
// 搜索参数
const searchParams = reactive({
    // 赎回状态
    sharesStatus: 0,
    // 订单号
    proposalNoList: '',
    // 白标名称
    customerCompanyId: '',
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
const minWidth = ref(130)
// 列表总数据量
const total = ref(100)
// 选择的列表数据
const selectList = ref([])
// 是否禁用批量下单按钮
const disableBtn = ref(true)
// 总赎回份额
const totalLot = ref(0)
// 当前货币
const currency = ref('')

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
// 获取基金产品赎回总金额
const queryFundRedeemMoney = () => {
    const ids = selectList.value.map(elem => elem.id)
    getFundRedeemMoney({
        fundIdList: ids
    }).then(res => {
        if (res.check()) {
            const { data } = res
            totalLot.value = Number(data.sharesTotal)
        }
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
    queryFundRedeemList()
}
// 改变分页数量
const changeSize = (value) => {
    searchParams.current = 1
    searchParams.size = value
    queryFundRedeemList()
}
// 点击搜索
const onSearch = () => {
    searchParams.current = 1
    queryFundRedeemList()
}
// 选择列表
const selectionChange = (list) => {
    selectList.value = list
    if (list.length > 0) {
        // 获取基金产品赎回总金额
        // queryFundRedeemMoney()
        currency.value = list[0].currencyRedeem
    } else {
        totalLot.value = 0
        currency.value = ''
    }
}
// 打开确认份额弹窗
const openLotDialog = async (type = 'preview') => {
    if (disableBtn.value) return
    // if (Number(totalLot.value) > Number(usable.value)) {
    //     return Toast(t('fundManager.ransom.tip1'))
    // }
    const ids = selectList.value.map(elem => elem.id)
    lotDialogType.value = type
    await nextTick()
    lotDialogRef.value.open(ids)
}
// 确认份额
const onConfirm = () => {
    selectList.value = []
    tableRef.value.clearSelection()
    searchParams.current = 1
    queryFundRedeemList()
    // 查询用户信息
    store.dispatch('_user/findCustomerInfo', false)
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
