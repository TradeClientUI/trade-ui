<template>
    <div class='IndexFunds'>
        <div class='fund-list'>
            <el-skeleton v-if='loading' animated class='skeleton-wrap'>
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
                :data='listData'
                :default-sort="{ prop: 'apy', order: 'descending' }"
                @row-click='handleClick'
                @row-contextmenu='setSession'
            >
                <el-table-column
                    label='Fund name'
                    prop='Name'
                    sortable
                >
                    <template #default='scope' class='pro-link'>
                        <div class='proCell alink' @click='handleClick(scope.row)'>
                            <img
                                alt=''
                                class='currencyIcon'
                                onerror="this.src='/images/tokens/default.png'"
                                :src='getCoinUrl(scope.row.thirdCoinCode)'
                            />
                            <img
                                alt=''
                                class='currencyIcon small'
                                src='/images/tokens/aave.svg'
                            />
                        </div>
                        <div class='pro-name alink' @click='handleClick(scope.row)'>
                            <strong>
                                <span>
                                    {{ scope.row.thirdCoinCode }}
                                </span>
                            </strong>
                            <span class='smallTxt'>
                                {{ scope.row.displayMarketName }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label='APY'
                    prop='apy'
                    :sort-method='(a,b)=>{return a.apy - b.apy}'
                    sortable
                >
                    <template #header>
                        <el-tooltip
                            content='Annual Percentage Yield(APY) is the projected interest on your deposit after one year'
                            effect='dark'
                            placement='top'
                        >
                            <span class='tooltip_title'>
                                APY
                                <i class='el-icon-info'></i>
                            </span>
                        </el-tooltip>
                    </template>
                    <template #default='scope' class='pro-balance'>
                        <p class='black'>
                            <span v-if='parseFloat(scope.row.apy) > 0 && parseFloat(scope.row.apy) < 0.01'>
                                &lt; 0.01%
                            </span>
                            <span v-else-if='parseFloat(scope.row.apy) === 0'>
                                0%
                            </span>
                            <span v-else>
                                {{ toFixed(scope.row.apy)+'%' }}
                            </span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label='Total supplied'
                    prop='savingsScale'
                    :sort-method='(a,b)=>{return a.savingsScale - b.savingsScale}'
                    sortable
                >
                    <template #default='scope' class='pro-balance'>
                        <p class='black'>
                            {{ formatAmount(toFixed(scope.row.savingsScale)) }}
                        </p>
                        <p class='bottomText'>
                            $ {{ formatAmount(toFixed(scope.row.savingsScaleUsd)) }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label='Operate' prop='operta' width='100px'>
                    <template #default='scope'>
                        <div class='handle'>
                            <!-- <button class='default' @click.stop='openPurchaseDialog(scope.row)'>
                                Purchase
                            </button> -->
                            <button class='trade' @click='handleClick(scope.row)'>
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
import { ref, computed, onMounted, toRefs, reactive } from 'vue'
import { sessionSet } from '@/utils/util'
import { toFixed, formatAmount, mul } from '@/utils/calculation'
import { useRouter } from 'vue-router'
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
        const state = reactive({
            loading: true
        })
        // Earning需要展示的数据
        const product_Earning_show = ref([
            {
                thirdCoinCode: 'USDC'
            },
            {
                thirdCoinCode: 'USDT'
            },
            {
                thirdCoinCode: 'DAI'
            },
            {
                thirdCoinCode: 'TUSD'
            },
            {
                thirdCoinCode: 'FEI'
            },
            {
                thirdCoinCode: 'BUSD'
            }
        ])

        const filterData = (filter, data) => {
            const res = []
            filter.map(item => {
                data.map(items => {
                    if (items.thirdCoinCode === item.thirdCoinCode) {
                        res.push(items)
                    }
                })
            })
            return res
        }

        const setSession = row => {
            sessionSet('AAVE_productActived', JSON.stringify(row))
        }

        const handleClick = row => {
            router.push({
                path: '/earning/detail',
                query: {
                    platformCode: row.platformCode,
                    assetId: row.assetId,
                    marketId: row.marketId,
                    chainId: row.chainId,
                    decimals: row.decimals,
                    version: row.version,
                    marketName: row.marketName.toLowerCase(),
                    networkName: row.networkName
                }
            })
        }
        // ref元素
        const aavePurchaseDialogRef = ref(null)

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

        // 获取行情数据
        const testnetMode = computed(() => store.state._web3.testnetMode)
        const tableData = computed(() => {
            if (testnetMode.value) {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
            } else {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
            }
        })
        const listData = computed(() =>
            props.isFilter ? filterData(product_Earning_show.value, tableData.value) : tableData.value
        )

        onMounted(async () => {
            // 获取列表数据
            await store.dispatch('_web3/getEarningMarkets')
            state.loading = false
        })

        return {
            ...toRefs(state),
            tableData,
            handleClick,
            setSession,
            getCoinUrl,
            openPurchaseDialog,
            toFixed,
            formatAmount,
            mul,
            filterData,
            listData,
            product_Earning_show
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/themeCommon/user/fundDEX/fundDEX.scss';
.IndexFunds{
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
