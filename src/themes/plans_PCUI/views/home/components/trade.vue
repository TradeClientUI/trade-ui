<template>
    <div class='fullWidth'>
        <div class='trade-module auto-width'>
            <div class='trade-header'>
                <strong class='title'>
                    {{ $t('home.marketTrend') }}
                </strong>
                <a class='more' href='javascript:;' @click='examineMore'>
                    <span>{{ $t('examineMore') }}</span>
                    <i class='el-icon-arrow-right'></i>
                </a>
            </div>
            <!-- 产品列表 -->
            <div class='product-module'>
                <ul class='header-block'>
                    <li>
                        <span>{{ $t('trade.name') }}</span>
                    </li>
                    <li>
                        <span>{{ $t('trade.newPrice') }}</span>
                    </li>
                    <li>
                        <span>{{ $t('trade.changePrice') }}</span>
                    </li>
                    <li>
                        <span>{{ $t('trade.changePercent') }}</span>
                    </li>
                    <li>
                        <span>{{ $t('c.handle') }}</span>
                    </li>
                </ul>
                <ul class='product-list'>
                    <li v-for='item in productList' :key='item.symbolKey'>
                        <div class='row'>
                            <currency-icon class='currency-icon' :currency='item.baseCurrency' :size='32' />
                            <div class='name'>
                                <span>{{ item.symbolName }}</span>
                                <etf-icon v-if='item.etf' />
                            </div>
                        </div>
                        <div>
                            <span :class='item.cur_color'>
                                {{ item.cur_price || '--' }}
                            </span>
                        </div>
                        <div>
                            <strong :class='item.upDownColor'>
                                {{ item.upDownAmount || '--' }}
                            </strong>
                        </div>
                        <div class='upDownWidth'>
                            <strong :class='item.upDownColor'>
                                {{ item.upDownWidth || '--' }}
                            </strong>
                        </div>
                        <div class='handle'>
                            <button v-if='item.etf' class='trade active' @click='toFund(item)'>
                                {{ $t('fundInfo.buy') }}
                            </button>
                            <button class='trade' @click='toOrder(item)'>
                                {{ $t('route.trade') }}
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import currencyIcon from '@/components/currencyIcon.vue'
import etfIcon from '@planspc/components/etfIcon.vue'
import { findFundPage } from '@/api/fund.js'

export default {
    components: {
        currencyIcon,
        etfIcon
    },
    emits: ['update'],
    setup (props, context) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
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

        // 去基金页面
        const toFund = item => {
            const fund = fundList.value.find(el => el.shareTokenCode === item.baseCurrency)
            if (fund) {
                router.push(`/fund?fundId=${item.fundId}`)
            } else {
                Toast(t('trade.noFeature'))
            }
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
            examineMore
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.fullWidth {
    margin-top: 20px;
    padding-top: 50px;
    padding-bottom: 50px;
    background: #fff;
}
.trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        letter-spacing: 2px;
        font-size: 30px;
        font-weight: bold;
        color: var(--color);
    }
    .more {
        display: inline-flex;
        align-items: center;
        color: var(--minorColor);
        i {
            font-weight: bold;
        }
        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 5px;
        }
    }
}
.product-module {
    margin-top: 30px;
    .header-block {
        display: flex;
        align-items: center;
        height: 56px;
        background: var(--contentColor);
        li {
            display: flex;
            align-items: center;
            flex: 1;
            height: 100%;
            span {
                font-size: 14px;
                color: var(--minorColor);
            }
            &:first-child {
                min-width: 320px;
                span {
                    margin-left: 16px;
                }
            }
            &:last-child {
                justify-content: flex-end;
                span {
                    margin-right: 16px;
                }
            }
        }
    }
}
.product-list {
    li {
        display: flex;
        align-items: center;
        height: 64px;
        background: var(--contentColor);
        cursor: pointer;
        div {
            flex: 1;
            color: var(--primary);
            &:first-of-type {
                min-width: 320px;
            }
            span,strong {
                font-size: 16px;
            }
            &:first-of-type {
                span {
                    margin-left: 16px;
                }
            }
        }
        .row {
            display: inline-flex;
            align-items: center;
            .currency-icon {
                margin-left: 10px;

            }
            .name {
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
            justify-content: flex-end;
            button {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 30px;
                margin-right: 16px;
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
                }
            }
        }
        &:hover {
            background: var(--bgColor);
            border-radius: 10px;
        }
    }
}
</style>
