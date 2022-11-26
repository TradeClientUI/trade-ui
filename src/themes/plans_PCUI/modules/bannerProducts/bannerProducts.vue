<template>
    <div class='product-module'>
        <img v-if='h5Preview' alt='' :src='exampleImg' />
        <ul v-else>
            <li v-for='item in products' :key='item.symbloKey' @click='goOrder(item)'>
                <p class='row_1'>
                    <span>{{ item.symbolName }}</span>
                    <strong :class='item.rolling_upDownColor'>
                        {{ item.rolling_upDownWidth || '--' }}
                    </strong>
                </p>
                <p class='row_2'>
                    <span>{{ item.rolling_last_price || '--' }}</span>
                </p>
                <p class='row_3'>
                    <span :class='item.rolling_upDownColor'>
                        {{ item.rolling_upDownAmount > 0 ? '+' : '' }}{{ item.rolling_upDownAmount || '--' }}
                    </span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, onBeforeUnmount, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import exampleImg from './example.png'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
    },
    emits: ['update'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)
        const customerGroupId = computed(() => store.getters.customerGroupId)
        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat().slice(0, 5)
        const products = computed(() => {
            let resultList = []

            resultList = symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el).sort((a, b) => {
                return a.sortNum - b.sortNum
            })
            return resultList
        })

        // 跳转到下单页面
        const goOrder = (item) => {
            router.push({
                path: '/order',
                query: {
                    name: item.symbolName.replace(/ /g, '_'),
                    symbolId: item.symbolId,
                    tradeType: item.tradeType
                }
            })
        }
        // store.commit('home/Update_subscribeBannerList', symbolKeys)
        const unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'bannerProducts', symbolKeys })

        onBeforeUnmount(() => {
            unSubscribe()
        })

        return {
            products,
            exampleImg,
            goOrder
        }
    }
}
</script>

<style lang="scss" scoped>
.product-module {
    height: 120px;
    background: #000730;
    ul {
        display: flex;
        height: 100%;
    }
    li {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        padding: 0 24px;
        cursor: pointer;
        &::after {
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            height: 72px;
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-50%);
            content: '';
        }
        &:last-of-type::after {
            background-color: transparent;
        }
        .row_1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                color: #B7C0E7;
                font-size: 16px;
            }
            strong {
                font-weight: normal;
                font-size: 16px;
            }
        }
        .row_2 {
            margin-top: 3px;
            span {
                color: #B7C0E7;
                font-size: 24px;
            }
        }
        .row_3 {
            margin-top: 3px;
            span {
                color: #5B658E;
                font-size: 16px;
            }
        }
    }
}
</style>
