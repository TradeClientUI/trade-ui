<template>
    <div class='financialData'>
        <div class='page-content'>
            <p class='h1'>
                <img alt='' class='overview' src='../../../../images/business/openAccount/overview.jpg' />
                {{ $t('JG_referral.overview') }}
            </p>
            <div class='filter'>
                <span class='desc'>
                    {{ $t('JG_referral.referText') }}
                </span>
                <span class='btn' :class="{ 'active':statsType == 1 }" @click='setStatstype(1)'>
                    {{ $t('JG_referral.all') }}
                </span>
                <span class='btn' :class="{ 'active':statsType == 2 }" @click='setStatstype(2)'>
                    {{ $t('JG_referral.yesteday') }}
                </span>
                <span class='btn' :class="{ 'active':statsType == 3 }" @click='setStatstype(3)'>
                    {{ $t('JG_referral.week') }}
                </span>
                <span class='btn' :class="{ 'active':statsType == 4 }" @click='setStatstype(4)'>
                    {{ $t('JG_referral.month') }}
                </span>
            </div>
            <el-row class='row'>
                <el-col class='col' :span='8'>
                    <p class='desc'>
                        {{ $t('JG_referral.OverviewText1') }}
                    </p>
                    <p class='h2'>
                        {{ commissionData.income || 0 }}  {{ $t('JG_referral.usdt') }}
                    </p>
                </el-col>
                <el-col class='col' :span='8'>
                    <p class='desc'>
                        {{ $t('JG_referral.OverviewText2') }}
                    </p>
                    <p class='h2'>
                        {{ commissionData.recommendedCount || 0 }}
                    </p>
                </el-col>
                <el-col class='col' :span='8'>
                    <p class='desc'>
                        {{ $t('JG_referral.OverviewText3') }}
                    </p>
                    <p class='h2'>
                        {{ commissionData.recommendedTradeCount || 0 }}
                    </p>
                </el-col>
            </el-row>
            <el-table v-loading='loading' :data='listData' empty-text='No data' :header-cell-style="{ background:'#F5F5F5' }" style='width: 100%'>
                <el-table-column align='center' label='User Account' prop='recommenderCustomerNo' />
                <el-table-column align='center' label='Referees Account' prop='recommendedCustomerNo' />
                <el-table-column align='center' label='Product' prop='dealCode' />
                <el-table-column align='center' label='Fee Currency' prop='dealFeeCurrency' />
                <el-table-column align='center' label='Fee Amount' prop='dealFee' />
                <el-table-column align='center' label='Referral Rate' prop='commissionRatio' />
                <el-table-column align='center' label='Referral Amount' prop='commissionAmount' />
            </el-table>
            <el-pagination
                v-model:currentPage='current'
                :background='true'
                layout='prev, pager, next'
                :total='total'
                @current-change='changePage'
            />
            <div class='export'>
                <!-- 导出功能等待接口 -->
                <!-- <span class="btn active">Export</span> -->
                <span class='desc'>
                    Disclaimer: Due to the complexity of financial data, there may be slight deviations and delays. The above data is for reference only. We apologize for any inconvenience caused.
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue'
import { commissionSummary, commissionRecords } from '@planspc/api/activity'
import { useStore } from 'vuex'

export default {
    setup () {
        const store = useStore()
        const statsType = ref(1) // 统计类型 1:全部 2:日 3:周 4:月
        const total = ref(0) // 列表总数据量
        const current = ref(1) // 列表当前页
        const loading = ref(false) // 加载状态
        const listData = ref([]) // 列表数据
        const customerNo = computed(() => store.state._user.customerInfo.customerNo) // 获取账户信息

        const commissionData = reactive({ // 推荐统计数据
            income: '',
            recommendedCount: '',
            recommendedTradeCount: ''
        })

        // 改变当前页数
        const changePage = (value) => {
            current.value = value
            getListData()
        }

        // 获取列表数据
        const getListData = () => {
            loading.value = true
            const params = {
                size: 10,
                current: current.value,
                queryParam: {
                    statsType: statsType.value,
                    customerNo: customerNo.value
                },
                customerNo: customerNo.value,
                timestamp: new Date().getTime().toString(),
            }
            commissionRecords(params).then(res => {
                loading.value = false
                if (res.check()) {
                    const { data } = res
                    listData.value = data?.list || []
                    total.value = data?.total || 0
                }
            })
        }

        // 获取推荐统计数据
        const getCommissionSummary = () => {
            const params = {
                statsType: statsType.value,
                customerNo: customerNo.value,
                timestamp: new Date().getTime().toString(),
            }
            commissionSummary(params).then(res => {
                if (res.ok) {
                    commissionData.income = res.data.income
                    commissionData.recommendedCount = res.data.recommendedCount
                    commissionData.recommendedTradeCount = res.data.recommendedTradeCount
                }
            })
        }

        // 筛选数据
        const setStatstype = (value) => {
            statsType.value = value
            getListData()
        }

        onMounted(() => {
            getListData()
            getCommissionSummary()
        })

        return {
            statsType,
            total,
            loading,
            listData,
            commissionData,
            getCommissionSummary,
            getListData,
            current,
            changePage,
            setStatstype
        }
    }
}

</script>

<style lang="scss" scoped>
.financialData{
    background-color: #ffffff;
}
.page-content{
    width: 1200px;
    margin: 0 auto;
    padding: 60px 0;
}
.h1{
    height: 45px;
    font-size: 30px;
    font-weight: 600;
    color: #333333;
    line-height: 45px;
}
.filter{
    height: 85px;
    display: flex;
    align-items: center;
    .desc{
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        margin-right: 28px;
    }
}
.btn{
    display: block;
    height: 29px;
    line-height: 29px;
    padding: 0px 24px;
    margin-right: 14px;
    border-radius: 29px;
    font-size: 14px;
    background: rgba(0, 98, 255, 0.1);
    color: #0062FF;
    cursor: pointer;
    &.active{
        color: #ffffff;
        background:#0062FF ;
    }
}
.row{
    width: 1200px;
    height: 99px;
    background: #F5F5F5;
    border-radius: 5px 5px 5px 5px;
    .col{
        text-align: center;
        padding: 24px 0;
        .desc{
            height: 21px;
            font-size: 14px;
            color: #999999;
            line-height: 21px;
        }
        .h2{
            height: 30px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 30px;
        }
    }
}

.el-table{
    margin-top: 28px;
    border-radius: 5px 5px 0 0;
}

.el-pagination{
    justify-content: center;
    margin: 28px 0;
    :deep(li){
        height: 40px;
        width: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-left:1px solid rgba(0, 0, 0, 0.15) !important;
    }
    :deep(.btn-prev){
        border-radius: 5px 5px 5px 5px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        height: 40px;
        width: 40px;
        margin-right: 8px;
        text-align: center;
        padding: 0;
    }
    :deep(.btn-next){
        border-radius: 5px 5px 5px 5px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        height: 40px;
        width: 40px;
        text-align: center;
        padding: 0;
    }
}

.export{
    padding-top: 28px;
    border-top: 1px solid rgb(238, 238, 238);
    .btn{
        margin-bottom: 14px;
        margin-left: auto;
        width: 112px;
        height: 36px;
        font-size: 16px;
        line-height: 36px;
        text-align: center;
    }
    .desc{
        font-size: 14px;
        color: #999999;
        line-height: 16px;
    }
}
.overview{
    height: 18px;
    margin-right: 10px;
}

</style>
