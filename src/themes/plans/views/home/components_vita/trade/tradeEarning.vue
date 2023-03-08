<template>
    <div class='body-module earning-module'>
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
                        :offset='item.offset'
                        :value='item.value'
                        :warn-text='item.warnText'
                    />
                    <div class='handle-row'></div>
                </div>
                <ul v-if='sortTableData.length > 0' class='table-list'>
                    <li
                        v-for='(item, index) in sortTableData'
                        v-show='product_Earning_show.indexOf(item.thirdCoinCode) != -1 '
                        :key='index'
                        @click='handleClick(item)'
                    >
                        <div class='pro-link'>
                            <div class='pro-cell'>
                                <img
                                    class='currencyIcon'
                                    onerror="this.src='/images/tokens/default.png'"
                                    :src='getCoinUrl(item.thirdCoinCode)'
                                />
                                <img
                                    class='small'
                                    src='/images/tokens/aave.svg'
                                />
                            </div>
                            <div class='pro-name'>
                                <b class='black'>
                                    {{ item.thirdCoinCode }}
                                </b>
                                <span class='bottomText'>
                                    {{ item.displayMarketName }}
                                </span>
                            </div>
                        </div>
                        <div class='pro-row'>
                            <p class='black'>
                                <span v-if='parseFloat(item.apy) > 0 && parseFloat(item.apy) < 0.01'>
                                    &lt; 0.01%
                                </span>
                                <span v-else-if='parseFloat(item.apy) === 0'>
                                    0%
                                </span>
                                <span v-else>
                                    {{ toFixed(item.apy) + '%' }}
                                </span>
                            </p>
                        </div>
                        <div class='pro-row last-row' @click.stop>
                            <p class='black'>
                                <large-number :offset='[-50, 8]' :value='item.savingsScale' />
                            </p>
                            <p class='bottomText'>
                                $<large-number :offset='[-50, 8]' :value='item.savingsScaleUsd' />
                            </p>
                        </div>
                        <div class='handle'>
                            <button class='default' @click.stop='openPurchaseDialog(item)'>
                                Purchase
                            </button>
                            <button class='easy'>
                                Details
                            </button>
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
import { ref, toRefs, reactive, onMounted, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toFixed, formatAmount, mul } from '@/utils/calculation'
import { sessionSet, isEmpty } from '@/utils/util'
import tableTitle from '@/themeCommon/user/fundDEX/components/table-title.vue'
import largeNumber from '@/themeCommon/user/fundDEX/components/large-number.vue'

export default {
    components: {
        tableTitle,
        largeNumber,
    },
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const style = computed(() => store.state.style)
        // ref元素
        const aavePurchaseDialogRef = ref(null)
        const state = reactive({
            // 加载状态
            loading: true,
            // 表格头字段数据
            tableHeaders: [
                {
                    name: 'Fund name',
                    isSort: true,
                    warnText: '',
                    value: 'name',
                    offset: [0, 8]
                },
                {
                    name: 'APY',
                    isSort: true,
                    warnText: 'Annual Percentage Yield(APY) is the projected interest on your deposit after one year.',
                    value: 'apy',
                    offset: [-20, 8]
                },
                {
                    name: 'Total supplied',
                    isSort: true,
                    warnText: 'Total supplied is the total amount of a cryptocurrency that is supplied to the corresponding platform.',
                    value: 'total',
                    offset: [-70, 8]
                }
            ],
            // 排序字段
            sortVal: 'apy',
            // 排序方式
            sortWay: 'down',
            // 排序后的列表数据
            sortTableData: [],
            // 市场列表数据
            marketTypeList: ['Ethereum'],
            // 当前选择的市场
            linkType: 'Ethereum',
            // 申购组件key值
            purchaseKey: Date.now()
        })

        const testnetMode = computed(() => store.state._web3.testnetMode)
        const tableData = computed(() => {
            if (testnetMode.value) {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
            } else {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
            }
        })
        // Earning需要展示的数据
        const product_Earning_show = ['USDC', 'USDT', 'DAI', 'TUSD', 'FEI', 'BUSD']

        const handleClick = row => {
            router.push({
                path: '/earning/detail',
                query: {
                    platformCode: row.platformCode,
                    assetId: row.assetId,
                    marketId: row.marketId,
                    chainId: row.chainId,
                    decimals: row.decimals,
                    version: row.version
                }
            })
        }

        // 打开申购弹窗
        const openPurchaseDialog = (row) => {
            aavePurchaseDialogRef.value.open(row)
        }

        const getCoinUrl = (code) => {
            if (!code) return ''
            const coinName = code.split('.')
            if (coinName[0]) {
                return '/images/tokens/' + coinName[0].toLowerCase() + '.svg'
            } else {
                return '/images/tokens/' + coinName.toLowerCase() + '.svg'
            }
        }
        const setSession = row => {
            sessionSet('AAVE_productActived', JSON.stringify(row))
        }

        // 排序后的数据
        watchEffect(() => {
            let arr = []
            if (isEmpty(state.sortVal) || isEmpty(state.sortWay)) {
                arr = tableData.value.slice(0)
            } else {
                arr = tableData.value.slice(0)
                arr.sort((a, b) => {
                    let firstEl = a
                    let secondEl = b
                    if (state.sortWay === 'down') {
                        firstEl = b
                        secondEl = a
                    }
                    if (state.sortVal === 'name') {
                        return firstEl['thirdCoinCode'].localeCompare(secondEl['thirdCoinCode'])
                    }
                    if (state.sortVal === 'apy') {
                        return Number(firstEl['apy']) - Number(secondEl['apy'])
                    }
                    if (state.sortVal === 'total') {
                        return Number(firstEl['savingsScale']) - Number(secondEl['savingsScale'])
                    }
                })
            }
            state.sortTableData = arr
        })

        onMounted(async () => {
            // 获取列表数据
            awaitstore.dispatch('_web3/getEarningMarkets')
            state.loading = false
        })

        return {
            ...toRefs(state),
            router,
            toFixed,
            formatAmount,
            mul,
            aavePurchaseDialogRef,
            openPurchaseDialog,
            tableData,
            handleClick,
            getCoinUrl,
            setSession,
            style,
            product_Earning_show
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/themeCommon/user/fundDEX/table.scss';
.earning-module{
    margin-top: 0px;
    .pro-link,.pro-row{
        border-top:0px!important;
    }
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
