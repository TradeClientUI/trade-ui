<template>
    <div class='IndexFunds'>
        <div class='fund-list'>
            <el-skeleton v-if='isLoading' animated class='skeleton-wrap'>
                <template #template>
                    <div v-for='item in 5' :key='item' class='skeleton-fild'>
                        <el-skeleton-item class='filed1' style='' variant='circle' />
                        <el-skeleton-item class='filed2' variant='text' />
                        <el-skeleton-item class='filed3' variant='text' />
                        <el-skeleton-item class='filed4' variant='text' />
                        <el-skeleton-item class='filed5' variant='button' />
                        <el-skeleton-item class='filed5' variant='button' />
                    </div>
                </template>
            </el-skeleton>
            <el-table
                v-else
                class='fundsTable'
                :data='proList'
                :default-sort="{ prop: 'nav', order: 'descending' }"
                empty-text='No data'
            >
                <template #empty>
                    <div class='empty'>
                        <img alt='' class='emptyImg' src='https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png' />
                        <span class='emptyText'>
                            No data
                        </span>
                    </div>
                </template>
                <el-table-column label='Fund name' prop='Name' :sort-method='sortByName' sortable width='200'>
                    <template #default='scope' class='pro-link'>
                        <div class='proCell alink' @click='handleDetail(scope.row)'>
                            <img alt='' class='currencyIcon' :src='scope.row.image' />
                            <img alt='' class='currencyIcon small' :src='scope.row.iconOrigin' />
                        </div>
                        <div class='pro-name alink' @click='handleDetail(scope.row)'>
                            <strong>
                                {{ scope.row.symbol }}
                            </strong>
                            <span class='smallTxt'>
                                {{ scope.row.marketLinkType }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label='NAV' prop='nav' :sort-method='sortByNum' :sortable='true'>
                    <template #header>
                        <el-tooltip
                            content='Net Asset Value (NAV) is the unit price of a mutual fund scheme.'
                            effect='dark'
                            placement='top'
                        >
                            <span class='tooltip_title'>
                                NAV
                                <i class='el-icon-info'></i>
                            </span>
                        </el-tooltip>
                    </template>
                    <template #default='scope'>
                        <span class='black'>
                            ${{ scope.row.nav }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1D' prop='_1D' :sort-method='sortByDay' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1D)>0?'txtPrimary':'txtRed' ]">
                            {{ scope.row._1D }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1W' prop='_1W' :sort-method='sortByWeek' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1W)>0?'txtPrimary':'txtRed' ]">
                            {{ scope.row._1W }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1M' prop='_1M' :sort-method='sortByMonth' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1M)>0?'txtPrimary':'txtRed' ]">
                            {{ scope.row._1M }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='3M' prop='_3M' :sort-method='sortBy3Month' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._3M)>0?'txtPrimary':'txtRed' ]">
                            {{ scope.row._3M }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='Operate' prop='operta' width='100'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button class='trade' @click='handleDetail(scope.row)'>
                                Details
                            </button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { productTokensBySymbolList, indexCoopFavLogo } from '@/themeCommon/user/fundDEX/config/config-indexCoop.js'
import { divide, minus, toFixed } from '@/utils/calculation'
import { getMarketChart_coingecko } from '@/api/fundDEX.js'
import { useStore } from 'vuex'

export default {
    props: {
        isFilter: { // 是否过滤数据
            type: Boolean,
            default: true
        }
    },
    setup (props, context) {
        const router = useRouter()
        const store = useStore()
        const testnetMode = computed(() => store.state._web3.testnetMode)
        // 跳转详情页
        const handleDetail = (row) => {
            console.log(row)
            router.push({
                path: '/indexFunds/detail',
                query: {
                    id: row.id,
                    address: row.address,
                    // polygonAddress: row.polygonAddress,
                    linkType: row.marketLinkType,
                    chainId: row.chainId
                }
            })
        }

        // index fund需要展示的数据
        const product_indexFund_show = ['DPI', 'ETH2x-FLI', 'icETH', 'MVI', 'BTC2x-FLI', 'BED']
        const proList = ref([])
        const tradeFundstate = reactive({
            vs_currency: 'usd',
            isLoading: true,
            tempData: [],
            linkType: 'All',
        })

        const initData = () => {
            tradeFundstate.isLoading = true
            const count = productTokensBySymbolList.length
            let count_then = 0
            let pushObj = {}
            // 重新按产品列表组装显示的列表数据
            productTokensBySymbolList.map((item, index) => {
                let prices = 0.00
                // 获取90天的币种历史行情图表数据[时间戳,价格]
                getMarketChart_coingecko({
                    vs_currency: tradeFundstate.vs_currency,
                    id: item.coingeckoId,
                    days: 90,
                    // interval: 'daily'
                }).then(res => {
                    // console.log(res)
                    if (res) {
                        const dataArr = res.prices
                        const _length = dataArr.length // 记录数据总条数,避免总条数不够90天的按最多条数计数
                        prices = res.prices[_length - 1][1] // 最后一天,最近的价格
                        const _1D_val = dataArr[_length - 24][1]
                        const _1W_val = dataArr[_length - (24 * 7)][1]
                        const _1M_val = dataArr[_length - (24 * 30)][1]
                        const _3M_val = dataArr[0][1]

                        pushObj = {
                            ...item,
                            id: item.coingeckoId,
                            NameSmall: item.name,
                            nav: toFixed(prices, 2),
                            _1D: (_1D_val ? toFixed(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                            _1W: (_1W_val ? toFixed(divide(minus(prices, _1W_val), _1W_val) * 100, 2) : '0.00'),
                            _1M: (_1M_val ? toFixed(divide(minus(prices, _1M_val), _1M_val) * 100, 2) : '0.00'),
                            _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                            Operta: '',
                            iconOrigin: indexCoopFavLogo
                        }
                        if (item.address) {
                            if (props.isFilter && product_indexFund_show.indexOf(item.symbol) !== -1) { // 如果开启筛选数据 push符合筛选条件数据
                                proList.value.push({
                                    ...pushObj,
                                    marketLinkType: 'Ethereum',
                                    chainId: 1
                                })
                            } else if (!props.isFilter) { // 如果没有开启筛选数据  push数据全部数据
                                proList.value.push({
                                    ...pushObj,
                                    marketLinkType: 'Ethereum',
                                    chainId: 1
                                })
                            }
                        }

                        if (item.polygonAddress) {
                            if (props.isFilter && product_indexFund_show.indexOf(item.symbol) !== -1) { // 如果开启筛选数据 push符合筛选条件数据
                                proList.value.push({
                                    ...pushObj,
                                    marketLinkType: 'Polygon',
                                    chainId: 137
                                })
                            } else if (!props.isFilter) { // 如果没有开启筛选数据  push数据全部数据
                                proList.value.push({
                                    ...pushObj,
                                    marketLinkType: 'Polygon',
                                    chainId: 137
                                })
                            }
                        }
                    }
                    count_then = count_then + 1
                    if (count_then === count) { tradeFundstate.isLoading = false }
                }).catch(err => {
                    const pushErr = {
                        ...item,
                        id: item.coingeckoId,
                        NameSmall: item.name,
                        nav: 0,
                        _1D: '--',
                        _1W: '--',
                        _1M: '--',
                        _3M: '--',
                        Operta: '',
                        iconOrigin: indexCoopFavLogo
                    }

                    if (props.isFilter && product_indexFund_show.indexOf(item.symbol) !== -1) { // 如果开启筛选数据 push符合筛选条件数据
                        proList.value.push(pushErr)
                    } else if (!props.isFilter) { // 如果没有开启筛选数据  push数据全部数据
                        proList.value.push(pushErr)
                    }
                    console.log(err)
                })
            })
        }

        // 按产品名首字母排序
        const sortByName = (obj1, obj2) => {
            return obj1['symbol'].substr(0, 1).toLowerCase().localeCompare(obj2['symbol'].substr(0, 1).toLowerCase())
        }

        // 按nav价格排序
        const sortByNum = (obj1, obj2) => {
            const val1 = obj1.nav
            const val2 = obj2.nav
            return val1 - val2
        }

        const sortByDay = (obj1, obj2) => {
            const val1 = obj1._1D
            const val2 = obj2._1D
            return val1 - val2
        }

        const sortByWeek = (obj1, obj2) => {
            const val1 = obj1._1W
            const val2 = obj2._1W
            return val1 - val2
        }

        const sortByMonth = (obj1, obj2) => {
            const val1 = obj1._1M
            const val2 = obj2._1M
            return val1 - val2
        }

        const sortBy3Month = (obj1, obj2) => {
            const val1 = obj1._3M
            const val2 = obj2._3M
            return val1 - val2
        }

        onMounted(() => {
            if (testnetMode.value) {
                proList.length = []
                tradeFundstate.isLoading = false
            } else {
                initData()
            }
        })

        return {
            handleDetail,
            sortByName,
            sortByNum,
            sortByDay,
            sortByWeek,
            sortByMonth,
            sortBy3Month,
            ...toRefs(tradeFundstate),
            proList
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/themeCommon/user/fundDEX/fundDEX.scss';
.IndexFunds{
    .txtRed {
        color: var(--warn);
        font-weight: 700;
    }
    .txtPrimary {
        color: var(--primary);
        font-weight: 700;
    }
    .fundsTable{
        :deep(.el-table__header-wrapper){
            .is-leaf{
                border: 0px!important;
                .cell{
                    font-size: 14px;
                    color: #999;
                    padding-left: 10px;
                }
            }
        }
        :deep(.el-table__body-wrapper){
            color:var(--color);
            .el-table__cell{
                border: 0px;
                .cell{
                   padding-left: 10px;
                }
            }
            .el-table__empty-block{
                height: 100px;
                min-height: 100px!important;
                margin-top: 32px;
                .emptyImg{
                    width: 80px;
                    height: 80px
                }
                .emptyText{
                    display: block;
                    height: 20px;
                    line-height: 20px;
                }
            }
        }
        &::before{
            height: 0px!important;
        }
        .handle{
            margin-right: 0px;
            button{
                margin-left: 0px;
            }
        }
        .black{
            color:var(--color);
        }
    }
    .trade {
        width: 80px;
        height: 30px;
        background: none;
        border: 1px solid var(--primary);
        border-radius: 5px;
        color: var(--primary);
        cursor: pointer;
        &:hover,&.active{
            background: var(--primary);
            color: #fff;
        }
    }
    .skeleton-wrap{
        .filed4,.filed3{
            width: 25%;
        }
    }
    .tooltip_title{
        display: inline-flex;
        align-items: center;
        .el-icon-info{
            font-size: 14px;
            margin-left: 3px;
        }
    }
}
</style>
