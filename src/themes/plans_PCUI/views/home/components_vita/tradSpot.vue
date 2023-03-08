<template>
    <div class='fullWidth'>
        <div class='trade-module auto-width'>
            <div class='trade-header'>
                <strong class='title'>
                    {{ $t('JG_newHome.tradSpot') }}
                </strong>
            </div>
            <!-- 产品列表 -->
            <div class='product-module'>
                <el-table class='product-table' :data='productList' style='width: 100%'>
                    <el-table-column label='Name'>
                        <template #default='scope'>
                            <div class='row'>
                                <currency-icon class='currency-icon' :currency='scope.row.baseCurrency' :size='32' />
                                <div class='name'>
                                    <strong>
                                        <span>{{ scope.row.symbolName }}</span>
                                    </strong>
                                    <etf-icon v-if='scope.row.etf' />
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label='Last price'>
                        <template #default='scope'>
                            <strong>
                                <span :class='scope.row.last_color'>
                                    {{ scope.row.rolling_last_price || '--' }}
                                </span>
                            </strong>
                        </template>
                    </el-table-column>
                    <el-table-column label='24H Change'>
                        <template #default='scope'>
                            <strong :class='scope.row.rolling_upDownColor'>
                                {{ scope.row.rolling_upDownAmount || '--' }}
                            </strong>
                        </template>
                    </el-table-column>
                    <el-table-column label='24H Chg%'>
                        <template #default='scope'>
                            <div class='upDownWidth'>
                                <strong :class='scope.row.rolling_upDownColor'>
                                    {{ scope.row.rolling_upDownWidth || '--' }}
                                </strong>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' label='' width='200'>
                        <template #header>
                            <span class='operateText'>
                                Operate
                            </span>
                        </template>
                        <template #default='scope'>
                            <div class='handle'>
                                <button v-if='scope.row.etf' class='trade active' @click='toFund("/fundV10/index")'>
                                    {{ $t('fundInfo.buy') }}
                                </button>
                                <button class='trade right' @click='toOrder(scope.row)'>
                                    {{ $t('route.trade') }}
                                </button>
                            </div>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <div class='empty'>
                            <img alt='' class='emptyImg' src='https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png' />
                            <span class='emptyText'>
                                No data
                            </span>
                        </div>
                    </template>
                </el-table>
                <p class='more'>
                    <span class='link' @click='more'>
                        {{ $t('JG_newHome.viewMore') }}
                        <i class='el-icon-arrow-right'></i>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import currencyIcon from '@/components/currencyIcon.vue'
import etfIcon from '@planspc/components/etfIcon.vue'
import { findFundPage } from '@/api/fund.js'

export default {
    components: {
        currencyIcon,
        etfIcon
    },
    setup (props, context) {
        const router = useRouter()
        const store = useStore()
        // 产品列表map数据
        const productMap = computed(() => store.state._quote.productMap)
        // 当前要显示的产品keys
        // const productKeys = ['1564_5', '706_5', '709_5', '714_5', '720_5', '717_5'] // pre
        const productKeys = ['368_5', '328_5', '329_5', '331_5', '332_5', '323_5'] // prd
        // 产品列表数据
        const productList = computed(() => {
            const result = []
            productKeys.map(key => {
                if (productMap.value[key]) {
                    result.push(productMap.value[key])
                }
            })
            return result
        })

        // 基金列表
        const fundList = ref([])

        // 获取基金产品列表，
        const getFundPage = () => {
            findFundPage({ customerGroupId: store.getters.customerGroupId, size: 1000 }).then(res => {
                if (res.check()) {
                    fundList.value = res.data.records
                }
            })
        }

        // 去交易
        const toOrder = item => {
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }

        // 跳转到交易页页
        const more = () => {
            const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === 5 && el.symbolName)?.symbolId
            router.push({
                path: '/order',
                query: {
                    symbolId,
                    tradeType: 5
                }
            })
        }
        // 去基金页面
        const toFund = item => {
            // 0609 修改链接到fundV10/index
            router.push(item)
        }

        // 查看更多
        const examineMore = () => {
            router.push('/quote')
        }

        onMounted(() => {
            context.emit('update', productKeys)
            // 获取基金列表
            getFundPage()
        })
        return {
            productList,
            toOrder,
            toFund,
            examineMore,
            more
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.fullWidth {
    margin-top: 4px;
    padding-top: 50px;
    padding-bottom: 50px;
    background: #fff;
}
.trade-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    .title {
        letter-spacing: 2px;
        font-size: 30px;
        font-weight: bold;
        color: var(--color);
        font-family: Microsoft Yahei;
    }
}
.filter{
    margin-top: 30px;
    &_btn{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        background: var(--assistColor);
        margin-right: 16px;
        padding: 0 11px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 4px;
        cursor: pointer;
        &.active{
            color: var(--primary);
        }
    }
}
.product-module {
    margin-top: 40px;
    .row {
        display: inline-flex;
        align-items: center;
        .name {
            margin-left: 10px;
            display: inline-flex;
            flex-direction: column;
            color: var(--color);
            :deep(.etfIcon) {
                font-size: 10px;
            }
        }
    }
    .handle {
        display: flex;
        justify-content: space-between;
        button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 30px;
            font-size: 14px;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            @include hover();
            &.buy {
                background: var(--riseColor);
            }
            &.sale {
                background: var(--fallColor);
            }
            &.trade {
                background: none;
                border: 1px solid var(--primary);
                border-radius: 5px;
                color: var(--primary);
                &:hover,&.active{
                    background: var(--primary);
                    color: #fff;
                }
                &.right{
                    margin-left: auto;
                    margin-right: 0;
                }
            }
            &:first-child{
                margin-right: 16px;
            }
        }
    }
    .more {
        text-align: right;
        color: var(--minorColor);
        margin-top: 32px;
        i {
            font-weight: bold;
        }
        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 5px;
            cursor: pointer;
        }
    }
    .product-table{
        :deep(.el-table__header-wrapper){
            .is-leaf{
                border: 0px!important;
            }
            th{
                font-weight: normal;
            }
        }
        :deep(.el-table__body-wrapper){
            color:var(--color);
            .el-table__cell{
                border: 0px;
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
        .operateText{
            display: block;
            width: 80px;
            float: right;
            text-align: left;
        }
    }
    .price{
        font-weight: 700;
    }
}
</style>
