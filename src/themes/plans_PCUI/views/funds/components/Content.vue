<template>
    <div class='content'>
        <customTable
            v-model:currentPage='currentPage'
            :data='tableData'
            :options='tableOptions'
            :pagination='pagination'
            :raw-response='rawResponse'
        />
    </div>
</template>

<script setup>
import { computed, unref, watch, ref } from 'vue'
import customTable from '@planspc/views/order/pages/components/customTable.vue'
import { getTransactionColumns } from '@planspc/views/order/pages/components/tableConfig'
import { useStore } from 'vuex'
import { tradeRecordList } from '@/api/user'

const props = defineProps({
    commonOptions: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
})

const contentHeight = document.body.offsetHeight - 118
const store = useStore()
// table配置和数据
const rawResponse = ref({})
const tableData = ref([])
const tableOptions = computed(() => {
    return {
        ...props.commonOptions,
        columns: getTransactionColumns(props.params.tradeType),
        height: '100%',
    }
})

// 分页
const currentPage = ref(1)
const pagination = computed(() => {
    const val = unref(rawResponse)
    if (!val || !val.totalPage) return {}
    return {
        pageSize: val.size,
        pageCount: val.totalPage
    }
})

const queryData = () => {
    const account = store.state._user.customerInfo.accountList?.filter(el => Number(el.tradeType) === Number(props.params.tradeType)) || []
    const accountIds = account.map(e => e.accountId).toString()
    const params = {
        accountIds,
        sortFieldName: 'executeTime',
        sortType: 'desc',
        executeEndTime: -1,
        tradeType: props.params.tradeType,
        current: unref(currentPage),
        size: 20,
        ...props.params,
    }
    tradeRecordList(params)
        .then(res => {
            if (res.check()) {
                rawResponse.value = res.data || {}
                tableData.value = res.data?.list || []
            }
        })
        .catch(err => console.error(err))
}

watch(() => [props.params, unref(currentPage)], queryData, { deep: true, immediate: true })

</script>

<style lang="scss" scoped>
.content{
    padding:  0 20px;
    :deep{
        td.el-table__cell{
            padding: 20px 0!important;
        }
        .el-table__body-wrapper {
            height: auto !important;
        }
    }
}
</style>
