<template>
    <div class='productList' :style='{ minHeight: contentHeight + "px" }'>
        <customTable
            v-model:currentPage='currentPage'
            :data='computedList'
            :options='tableOptions'
            :pagination='pagination'
        />
    </div>
</template>

<script setup>
import { watch, computed, ref, unref, onUnmounted } from 'vue'
import customTable from '@planspc/views/order/pages/components/customTable.vue'
import { getColumns } from './tableConfig.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'
import { isEmpty, localSet, localGet, getCookie, setCookie } from '@/utils/util'

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    tradeType: {
        type: String,
        default: ''
    }
})
const router = useRouter()
const contentHeight = document.body.offsetHeight - 342
const tableOptions = computed(() => ({
    columns: getColumns(props.tradeType),
    // height: '100%',
    '@rowClick': row => {
        router.push({
            name: 'Order',
            query: {
                name: row?.symbolName?.replace(/ /g, '_'),
                symbolId: row.symbolId,
                tradeType: row.tradeType
            }
        })
    }
}))

// 分页
const currentPage = ref(1)
const size = 20
const pagination = computed(() => {
    return {
        pageSize: size,
        pageCount: Math.ceil(props.list.length / size)
    }
})
const computedList = computed(() => {
    return props.list.slice((unref(currentPage) - 1) * size, unref(currentPage) * size)
})

// watch(
//     () => computedList.value, list => {
//         console.log(list)
//     }
// )

// const moduleId = 'quote_' + Date.now()
// let unSubscribe = () => {}

// watch(() => unref(computedList), () => {
//     const symbolKeys = unref(computedList).map(e => e.symbolKey)
//     unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys })
// }, {
//     immediate: true
// })

// onUnmounted(() => {
//     unSubscribe()
// })

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productList {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 12px;
    overflow: hidden;
    :deep {
        .el-table__row {
            cursor: pointer;
        }
        .el-table td.el-table__cell {
            padding: 12px 0;
        }
        .el-table__empty-block {
            margin-top: 80px;
        }
        .star {
            align-self: self-start;
            margin-right: 5px;
            cursor: pointer;
        }
        // tbody td.el-table__cell.primaryText{
        //     color: var(--primary);
        // }
        .btn {
            @include hover();
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 80px;
            height: 28px;
            margin-right: 10px;
            overflow: hidden;
            color: var(--primary);
            font-weight: 400;
            font-size: 14px;
            line-height: 28px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid var(--primary);
            border-radius: 4px;
            cursor: pointer;
            &.active {
                color: #FFF;
                background: var(--primary);
            }
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                color: #FFF;
                background: var(--primary);
            }
        }
    }

}

</style>
