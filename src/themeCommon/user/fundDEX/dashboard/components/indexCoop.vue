<template>
    <div>
        <template v-if='loading'>
            <div v-for='item in 3' :key='item' class='skeleton-wrap'>
                <van-skeleton avatar :row='3' title />
            </div>
        </template>
        <div v-else-if='tableData.length>0' class='dashboard-Indexcoop dashboardTable'>
            <p class='header-title'>
                Your portfolio
            </p>
            <van-empty
                v-if='testnetMode'
                description='no data'
                image='https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png'
            />
            <van-collapse v-else v-model='activeNames'>
                <van-collapse-item v-for='(chain,i) in chainClassList' :key='i' :name='chain.chainId'>
                    <template #title>
                        <div class='title'>
                            <img alt='' class='currencyIcon symbolCurrencyIcon' :src='"/images/markets/"+(chain.name.toLowerCase())+".svg"' />
                            {{ chain.name }} Market
                        </div>
                    </template>
                    <template #right-icon>
                        <div class='collapseItem'>
                            <span v-if='isFold(chain)===-1'>
                                Show <van-icon name='plus' />
                            </span>
                            <span v-else>
                                Hide <van-icon name='minus' />
                            </span>
                        </div>
                    </template>
                    <!-- PC端 -->
                    <div v-if='chain.list.length > 0' class='table-module'>
                        <div class='table-header'>
                            <table-title
                                v-for='(item, index) in tableHeaders'
                                :key='index'
                                v-model:sort-val='sortVal[chain.name]'
                                v-model:sort-way='sortWay[chain.name]'
                                :class="[ item.value === 'name' ? 'pro-link' : 'pro-row', { 'last-row': tableHeaders.length - 1 === index } ]"
                                :is-sort='item.isSort'
                                :name='item.name'
                                :value='item.value'
                                :warn-text="item.warnText || ''"
                            />
                            <div class='handle-row'></div>
                        </div>
                        <ul class='table-list'>
                            <li v-for='(item, index) in chain.list' :key='index' @click='handleDetail(item)'>
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
                                            {{ toFixed(item.balance, 5) }}
                                        </span>
                                    </p>
                                </div>
                                <div class='pro-row'>
                                    <p class='black'>
                                        <span>
                                            ${{ item.nav }}
                                        </span>
                                    </p>
                                </div>
                                <div class='handle'>
                                    <button class='default' @click.stop='handleShowDialog(item, "purchase")'>
                                        Purchase
                                    </button>
                                    <button class='easy' @click.stop='handleShowDialog(item, "redeem")'>
                                        Redeem
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
        <div v-if='tableData.length === 0 && !loading' class='all-no-data'>
            <div class='empty-icon-wrap'>
                <img alt='' src='/images/question.svg' srcset='' />
            </div>
            <h2 class='text'>
                No holding yet
            </h2>
            <button class='button' @click='toMarkets'>
                Purchase now
            </button>
        </div>
        <SupplyDialog ref='supplyDialogRef' v-model='dialogShow' :fund-data='fundActived' @swapSuccess='swapSuccess' />
    </div>
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref, toRefs, unref, watchEffect } from 'vue'
import { productTokensBySymbolList, indexCoopFavLogo } from '../../config/config-indexCoop.js'
import tableTitle from '../../components/table-title.vue'
import { getMarketChart_coingecko } from '@/api/fundDEX.js'
import { div, divide, minus, pow, toFixed } from '@/utils/calculation.js'
import { isEmpty } from '@/utils/util.js'
import { useStore } from 'vuex'
import { indexCoopHooks } from '@/plugins/web3/indexCoop'
import SupplyDialog from '../../components/indexCoop/supply-dialog.vue'
import { useRouter } from 'vue-router'
export default {
    components: {
        tableTitle,
        SupplyDialog,
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const testnetMode = computed(() => store.state._web3.testnetMode)
        const { getBalanceOf } = indexCoopHooks()

        const supplyDialogRef = ref(null)
        const state = reactive({
            activeNames: [1, 137],
            // 加载状态
            loading: false,
            dialogShow: false,
            fundActived: '',
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
                    name: 'Balance',
                    isSort: true,
                    value: 'balance',
                },
                {
                    name: 'NAV',
                    isSort: true,
                    value: 'nav',
                    warnText: 'Net Asset Value (NAV) is the unit price of a mutual fund scheme.'
                },
            ],
            // 排序字段
            sortVal: {
                'Ethereum': 'nav',
                'Polygon': 'nav',
            },
            // 排序方式
            sortWay: {
                'Ethereum': 'down',
                'Polygon': 'down',
            },
            // 排序后的列表数据
            sortTableData: [],
        })

        const isFold = data => {
            return state.activeNames.indexOf(data.chainId)
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

        // 跳转到行情列表
        const toMarkets = () => {
            router.push('/indexFunds')
        }

        // 申购 弹窗
        const handleShowDialog = async (item, type) => {
            state.fundActived = item
            state.dialogShow = true
            if (type === 'redeem') {
                await nextTick()
                supplyDialogRef.value.switchSwapHandler()
            }
        }

        // 申购赎回成功更新列表数据
        const swapSuccess = () => {
            initData()
        }

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
                    }).then(async res => {
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
                                balance: toFixed(0, 2),
                                nav: toFixed(prices, 2),
                                _1D: (_1D_val ? toFixed(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                                _1W: (_1W_val ? toFixed(divide(minus(prices, _1W_val), _1W_val) * 100, 2) : '0.00'),
                                _1M: (_1M_val ? toFixed(divide(minus(prices, _1M_val), _1M_val) * 100, 2) : '0.00'),
                                _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                                Operta: '',
                                iconOrigin: indexCoopFavLogo
                            }
                            if (item.address) {
                                const newItem = {
                                    ...data,
                                    marketLinkType: 'Ethereum',
                                    chainId: 1,
                                }
                                const balance = await getBalanceOf(newItem.chainId, item.address)
                                newItem.balance = div(balance, pow(10, 18))
                                proList.push(newItem)
                            }
                            if (item.polygonAddress) {
                                const newItem = {
                                    ...data,
                                    marketLinkType: 'Polygon',
                                    chainId: 137,
                                }
                                const balance = await getBalanceOf(newItem.chainId, item.polygonAddress)
                                newItem.balance = div(balance, pow(10, 18))
                                proList.push(newItem)
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
                state.tableData = proList.filter(el => el.balance > 0)
                store.commit('_web3/Update_indexcoopProducts', proList)
                state.loading = false
            }).catch(() => {
                state.loading = false
            })
        }

        // 基金分类列表
        const chainClassList = computed(() => {
            const list = store.state._web3.indexcoopProducts.slice(0).filter(el => el.balance > 0)
            const classList = [{
                chainId: 1,
                name: 'Ethereum',
                list: []
            }, {
                chainId: 137,
                name: 'Polygon',
                list: []
            }]
            classList.forEach((chain, chainIndex) => {
                list.forEach(el => {
                    if (el.chainId === chain.chainId) {
                        chain.list.push(el)
                    }
                })
            })
            classList.forEach((chain) => {
                const sortVal = state.sortVal[chain.name]
                const sortWay = state.sortWay[chain.name]
                if (sortVal && sortWay) {
                    chain.list.sort((a, b) => {
                        let firstEl = a
                        let secondEl = b
                        if (sortWay === 'down') {
                            firstEl = b
                            secondEl = a
                        }
                        if (sortVal === 'name') {
                            return firstEl['symbol'].localeCompare(secondEl['symbol'])
                        }
                        return Number(firstEl[sortVal]) - Number(secondEl[sortVal])
                    })
                }
            })

            return classList.filter(chain => {
                return chain.list.length > 0
            })
        })

        onMounted(() => {
            initData()
        })

        return {
            ...toRefs(state),
            chainClassList,
            supplyDialogRef,
            toFixed,
            toMarkets,
            handleDetail,
            swapSuccess,
            isFold,
            handleShowDialog,
            testnetMode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../table.scss';
@import '../../fundDEX.scss';

</style>
