<template>
    <div class='body-module index-funds-module'>
        <div class='table-module'>
            <div v-if='loading' class='loading-block'>
                <van-loading :color='$style.primary' />
            </div>
            <div v-else class='table-content'>
                <div class='table-header'>
                    <table-title
                        v-for='(item, index) in tableHeaders'
                        :key='index'
                        v-model:sort-val='sortVal'
                        v-model:sort-way='sortWay'
                        :class="[ item.value === 'name' ? 'pro-link' : 'pro-row', { 'last-row': tableHeaders.length - 1 === index } ]"
                        :is-sort='item.isSort'
                        :name='item.name'
                        :value='item.value'
                        :warn-text="item.warnText || ''"
                    />
                    <div class='handle-row'></div>
                </div>
                <ul v-if='sortTableData.length > 0' class='table-list'>
                    <li
                        v-for='(item, index) in sortTableData'
                        v-show='product_indexFund_show.indexOf(item.symbol) != -1'
                        :key='index'
                        @click='handleDetail(item)'
                    >
                        <div class='pro-link'>
                            <div class='pro-cell'>
                                <img
                                    class='currencyIcon'
                                    :src='item.image'
                                />
                                <img
                                    class='small'
                                    :src='item.iconOrigin'
                                />
                            </div>
                            <div class='pro-name'>
                                <b class='black'>
                                    {{ item.symbol }}
                                </b>
                                <span class='bottomText'>
                                    {{ item.marketLinkType }}
                                </span>
                            </div>
                        </div>
                        <div class='pro-row'>
                            <p class='black'>
                                <span>
                                    ${{ item.nav }}
                                </span>
                            </p>
                        </div>
                        <div class='pro-row'>
                            <span :class="Number(item._1D) > 0 ? 'primaryText' : 'red'">
                                {{ item._1D }}%
                            </span>
                        </div>
                        <div class='pro-row'>
                            <span :class="Number(item._1W) > 0 ? 'primaryText' : 'red'">
                                {{ item._1W }}%
                            </span>
                        </div>
                        <div class='pro-row'>
                            <span :class="Number(item._1M) > 0 ? 'primaryText' : 'red'">
                                {{ item._1M }}%
                            </span>
                        </div>
                        <div class='pro-row last-row'>
                            <span :class="Number(item._3M) > 0 ? 'primaryText' : 'red'">
                                {{ item._3M }}%
                            </span>
                        </div>
                    </li>
                </ul>
                <van-empty
                    v-else
                    description='no data'
                    image='https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png'
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getMarketChart_coingecko } from '@/api/fundDEX.js'
import { productTokensBySymbolList, indexCoopFavLogo } from '@/themeCommon/user/fundDEX/config/config-indexCoop.js'
import { divide, minus, toFixed } from '@/utils/calculation'
import { isEmpty } from '@/utils/util'
import tableTitle from '@/themeCommon/user/fundDEX/components/table-title.vue'

export default {
    components: {
        tableTitle,
    },
    setup (props, context) {
        const store = useStore()
        const style = computed(() => store.state.style)
        const testnetMode = computed(() => store.state._web3.testnetMode)
        // const { executeConnect } = web3Hooks()
        const state = reactive({
            // 加载状态
            loading: false,
            dialogShow: false,
            // 列表源数据
            tableData: [],
            // 表格头字段数据
            tableHeaders: [
                {
                    name: 'Fund name',
                    isSort: true,
                    value: 'name'
                },
                {
                    name: 'NAV',
                    isSort: true,
                    value: 'nav',
                    warnText: 'Net Asset Value (NAV) is the unit price of a mutual fund scheme.'
                },
                {
                    name: '1D',
                    isSort: true,
                    value: '_1D'
                },
                {
                    name: '1W',
                    isSort: true,
                    value: '_1W'
                },
                {
                    name: '1M',
                    isSort: true,
                    value: '_1M'
                },
                {
                    name: '3M',
                    isSort: true,
                    value: '_3M'
                }
            ],
            // 排序字段
            sortVal: 'nav',
            // 排序方式
            sortWay: 'down',
            // 排序后的列表数据
            sortTableData: [],
            linkTypeOptions: [
                {
                    value: 'All',
                    label: 'All Markets',
                    iconSrc: ''
                },
                {
                    value: 'Ethereum',
                    label: 'Ethereum',
                    iconSrc: '/images/markets/ethereum.svg'
                },
                {
                    value: 'Polygon',
                    label: 'Polygon',
                    iconSrc: '/images/markets/polygon.svg'
                }
            ],
            fundActived: '',
            // 市场列表数据
            marketTypeList: ['Ethereum', 'Polygon'],
            // 当前选择的市场
            linkType: 'all'
        })
        const router = useRouter()

        const initData = () => {
            const promiseList = []
            const proList = []
            state.loading = true
            // 重新按产品列表组装显示的列表数据
            productTokensBySymbolList.map((item, index) => {
                // 获取90天的币种历史行情图表数据[时间戳,价格]
                const promise = new Promise((resolve) => {
                    getMarketChart_coingecko({
                        vs_currency: 'usd',
                        id: item.coingeckoId,
                        days: 90
                    }).then(res => {
                        if (res) {
                            const dataArr = res.prices
                            const _length = dataArr.length // 记录数据总条数,避免总条数不够90天的按最多条数计数
                            const prices = res.prices[_length - 1][1] // 最后一天,最近的价格
                            const _1D_val = dataArr[_length - 24][1]
                            const _1W_val = dataArr[_length - (24 * 7)][1]
                            const _1M_val = dataArr[_length - (24 * 30)][1]
                            const _3M_val = dataArr[0][1]
                            const data = {
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
                                proList.push({
                                    ...data,
                                    marketLinkType: 'Ethereum',
                                    chainId: 1,
                                })
                            }
                            if (item.polygonAddress) {
                                proList.push({
                                    ...data,
                                    marketLinkType: 'Polygon',
                                    chainId: 137,
                                })
                            }
                            resolve()
                        }
                    }).catch(err => {
                        proList.push({
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
                        })
                        resolve()
                    })
                })
                promiseList.push(promise)
            })

            Promise.all(promiseList).then(() => {
                state.tableData = proList
                state.loading = false
            }).catch(() => {
                state.loading = false
            })
        }

        // 跳转详情页
        const handleDetail = (row) => {
            router.push({
                path: '/indexFunds/detail',
                query: {
                    id: row.id,
                    address: row.address,
                    chainId: row.chainId,
                    linkType: row.marketLinkType
                }
            })
        }
        // index fund需要展示的数据
        const product_indexFund_show = ['DPI', 'ETH2x-FLI', 'icETH', 'MVI', 'BTC2x-FLI', 'BED']

        // 筛选排序后的数据
        watchEffect(() => {
            const keys = ['nav', '_1D', '_1W', '_1M', '_3M']
            let arr = []
            // 过滤当前选择的市场数据
            if (state.linkType === 'all') {
                arr = state.tableData.slice(0)
            } else {
                arr = state.tableData.filter(el => el.marketLinkType === state.linkType)
            }

            // 开启测试后数据设置为空
            if (testnetMode.value) {
                state.sortTableData = []
            } else if (isEmpty(state.sortVal) || isEmpty(state.sortWay)) {
                // 不需要排序
                state.sortTableData = arr
            } else {
                // 排序后的数据
                arr.sort((a, b) => {
                    let firstEl = a
                    let secondEl = b
                    if (state.sortWay === 'down') {
                        firstEl = b
                        secondEl = a
                    }
                    if (state.sortVal === 'name') {
                        return firstEl['symbol'].localeCompare(secondEl['symbol'])
                    }
                    if (keys.includes(state.sortVal)) {
                        return Number(firstEl[state.sortVal]) - Number(secondEl[state.sortVal])
                    }
                })
                state.sortTableData = arr
            }
        })

        onMounted(() => {
            // 初始化数据
            initData()
        })

        return {
            ...toRefs(state),
            router,
            style,
            initData,
            handleDetail,
            product_indexFund_show
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/themeCommon/user/fundDEX/table.scss';
.red {
    color: var(--warn);
    font-weight: bold;
}
.primaryText {
    color: #0062ff;
    font-weight: bold;
}
.body-module{
    margin-top: 0px;
}
.pro-link,.pro-row{
    border-top:0px!important;
}
.table-module{
    :deep(.table-header){
        .name{
            color: #999;
        }
    }
    .pro-row{
        text-align: center;
    }
    .black{
        color: #333!important;
    }
    .bottomText{
        color: #999!important;
    }
}

</style>
