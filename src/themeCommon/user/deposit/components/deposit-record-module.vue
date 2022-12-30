<template>
    <div class='module-record'>
        <div class='header-case'>
            <span>{{ currency }} {{ $t('deposit.depositRecord') }}</span>
            <i class='icon icon_mingxi1' @click='toRecord'></i>
        </div>
        <van-empty v-if='tableData.length === 0' :description="$t('deposit.noneRecordTip')" image='/images/empty.png' />
        <deposit-record-list v-else :list='tableData' :type='type' />
    </div>
</template>

<script setup>
import depositRecordList from './deposit-record-list.vue'
import { queryDepositPageList } from '@/api/user'
import { ref, reactive, watch, defineProps, defineExpose } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    // 是否显示筛选项
    showFilter: {
        type: Boolean,
        default: false
    },
    // 当前选择的币种
    currency: {
        type: String,
        default: ''
    },
    // 充值类型 1. 直充 2.汇兑
    type: {
        type: String,
        default: ''
    }
})

// 列表数据
const tableData = ref([])
// 账户列表
const state = reactive({
    // 加载状态
    loading: false,
    // 玩法类型
    tradeType: 5,
    // 账户列表
    accountList: [],
    // 开始时间
    startTime: window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf(),
    // 结束时间
    endTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
    // 总数量
    total: 0,
    // 当前分页
    current: 1,
    // 每页数据量
    size: 3
})

// 刷新数据
const refresh = () => {
    state.current = 1
    state.size = 3
    queryDepositList()
}

// 获取存款提案列表
const queryDepositList = () => {
    queryDepositPageList({
        startTime: state.startTime,
        endTime: state.endTime,
        rechargeType: props.type,
        depositCurrency: props.currency,
        current: state.current,
        size: state.size
    }).then(res => {
        tableData.value = res.data.records
        state.total = res.data.total
    })
}

// 跳转到存款记录页面
const toRecord = () => {
    router.push({
        path: '/depositRecord',
        query: {
            type: props.type,
            currency: props.currency
        }
    })
}

// 监听当前选择的币种
watch(() => props.currency, () => {
    if (props.currency) {
        refresh()
    }
}, { immediate: true })

defineExpose({
    refresh
})
</script>

<style lang="scss" scoped>
.module-record {
    margin-top: rem(30px);
    background-color: var(--contentColor);
    border-radius: rem(16px);
    border: 1px solid var(--lineColor);
    overflow: hidden;
}
.header-case {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: rem(80px);
    padding: 0 rem(30px);
    border-bottom: 1px solid var(--lineColor);
    .icon {
        font-size: rem(34px);
    }
}
</style>
