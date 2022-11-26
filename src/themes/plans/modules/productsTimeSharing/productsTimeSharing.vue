<template>
    <div class='swipe-wrap' :style='data.styleObj'>
        <div v-if='h5Preview' class='default-wrap'>
            <img alt='' src='./productsTimeSharing.png' />
        </div>
        <van-swipe
            v-else
            :autoplay='0'
            class='my-swipe'
            indicator-color='white'
            :show-indicators='false'
            @change='onChangeSwipe'
        >
            <van-swipe-item
                v-for='(item,i ) in swiperList'
                :key='i'
            >
                <div class='products-wrap'>
                    <div
                        v-for='product in item'
                        :key='product.symbolId'
                        class='product-item'
                        @click='openProduct(product)'
                    >
                        <p class='text1'>
                            {{ product.symbolName }}
                        </p>
                        <p class='text2' :class='[product.last_color]'>
                            {{ product.rolling_last_price || '--' }}
                        </p>
                        <p class='text3' :class='[product.rolling_upDownColor]'>
                            {{ product.rolling_upDownWidth || '--' }}
                        </p>
                        <klineSvg :data='product?.kline_list' :height='30' :product='product' :width='90' />
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import { computed, unref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import klineSvg from '@plans/components/klineSvg.vue'
export default {
    components: { klineSvg },
    props: {
        data: {
            type: Object,
            default () { return {} }
        },
    },
    setup (props) {
        const h5Preview = process.env.VUE_APP_h5Preview
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { isUniapp } = route.query
        // 产品map数据
        const productMap = computed(() => store.state._quote.productMap)

        const customerGroupId = computed(() => store.getters.customerGroupId)

        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat()
        const products = symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el)

        const getSubscribeData = (index) => {
            return swiperList[index] && swiperList[index].map(item => {
                return {
                    symbol_id: item.symbolId,
                    trade_type: item.tradeType,
                    trade_mode: item.dealMode,
                    kline_type: 4,
                    query_kline_num: 50,
                    kline_timestamp_end: Math.round(new Date().getTime() / 1000).toString()
                }
            })
        }

        const getQuoteDate = index => {
            return swiperList[index] && swiperList[index].map(item => {
                return `${item.symbolId}_${item.tradeType}`
            })
        }

        // 产品列表数据
        const productList = symbolKeys.map(key => productMap[key]).filter(elem => elem)
        const swiperList = []
        products.forEach((el, i) => { // 将产品分成3个一组，显示成swiper轮播
            if (i % 3 === 0) swiperList.push([])
            const lastItem = swiperList[swiperList.length - 1]
            lastItem.push(el)
        })

        const openProduct = (data) => {
            if (isUniapp && uni) {
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'product_click',
                        params: {
                            tradeType: data.tradeType,
                            symbolId: data.symbolId,
                            symbolName: data.symbolName,
                            price_digits: data.price_digits,
                            symbolCode: data.symbolCode
                        }
                    }
                })
            } else {
                router.push({ name: 'Product', query: { symbolId: data.symbolId, tradeType: data.tradeType } })
            }
        }

        const onChangeSwipe = (index) => {
            QuoteSocket.batchGetKlineData(getSubscribeData(index))
        }

        store.dispatch('_quote/querySymbolBaseInfoList').then(res => {
            if (!h5Preview && getSubscribeData(0)) {
                QuoteSocket.batchGetKlineData(getSubscribeData(0))
            }
        })

        return {
            productList,
            openProduct,
            swiperList,
            symbolKeys,
            onChangeSwipe
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.swipe-wrap{
    background: var(--contentColor);
    padding:0 rem(30px);
    .products-wrap{
        display: flex;
        justify-content: flex-start;
        .product-item{
            overflow: hidden;
            // width: 100%;
            // flex: 1;
            padding: rem(23px);
            margin-right: rem(30px);
            .text1{
                @include ellipsis();
                width: 98%;
            }
            .text1,.text3{
                font-size: rem(24px);
                margin-bottom: rem(8px);
            }
            .text2{
                font-size: rem(40px);
            }

        }
    }
}
</style>
