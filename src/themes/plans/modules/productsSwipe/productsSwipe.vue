<template>
    <div class='productsList' :style='data.styleObj'>
        <div v-if='h5Preview' class='default-wrap'>
            <img alt='' :src='defaultImg' />
        </div>
        <div v-else>
            <van-swipe class='productsSwipeWrapper'>
                <van-swipe-item v-for='(item,i ) in swiperList' :key='i'>
                    <ul class='productsSwipe'>
                        <li
                            v-for='product in item'
                            :key='product.symbolId'
                            class='item'
                            :class='product.bgClass'
                            @click='handlerItem(product)'
                        >
                            <div class='name'>
                                {{ product.symbolName }}
                            </div>
                            <div class='price' :class='[product.last_color]'>
                                {{ product.rolling_last_price || '--' }}
                            </div>
                            <div class='change' :class='[product.rolling_upDownColor]'>
                                {{ product.rolling_upDownAmount || '--' }} &nbsp; {{ product.rolling_upDownWidth }}
                            </div>
                        </li>
                    </ul>
                </van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { localGet, getQueryString } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
const defaultImg = require('./productSwipe.png')
export default {
    props: {
        data: {
            type: Object,
            default () { return {} }
        },
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { isUniapp } = route.query
        const productMap = computed(() => store.state._quote.productMap)
        const customerGroupId = computed(() => store.getters.customerGroupId)

        // 涨跌颜色类型
        const chartColorType = computed(() => Number(getQueryString('chartColorType')) || Number(JSON.parse(localGet('chartConfig'))?.chartColorType) || 1)

        const symbolKeys = Object.entries(props.data.product || {}).map(([tradeType, item]) => {
            const list = item[customerGroupId.value] || []
            return list.map(symbolId => `${symbolId}_${tradeType}`)
        }).flat()
        const products = symbolKeys.map(symbolKey => productMap.value[symbolKey]).filter(el => el)
        const swiperList = []
        products.forEach((el, i) => { // 将产品分成3个一组，显示成swiper轮播
            if (i % 3 === 0) swiperList.push([])
            const lastItem = swiperList[swiperList.length - 1]
            lastItem.push(el)
        })

        // 点击进入产品详情页面
        const handlerItem = data => {
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

        watch(() => products, val => {
            if (val.length > 0) {
                val.forEach(product => {
                    let price = 0
                    if (price === 0) {
                        if ((product?.last_color === 'riseColor' && chartColorType.value === 1) || (product?.last_color === 'fallColor' && chartColorType.value === 2)) {
                            product.bgClass = 'riseColorBgAni'
                        } else if ((product.last_color === 'fallColor' && chartColorType.value === 1) || (product.last_color === 'riseColor' && chartColorType.value === 2)) {
                            product.bgClass = 'fallColorBgAni'
                        }
                        price = product.rolling_last_price
                    } else {
                        if (product.rolling_last_price - price > 0) {
                            product.bgClass = 'riseColorBgAni'
                        } else if (product.rolling_last_price - price < 0) {
                            product.bgClass = 'fallColorBgAni'
                        }
                        price = product.rolling_last_price
                    }
                })
            }
        }, {
            deep: true
        })

        return {
            productMap,
            handlerItem,
            swiperList,
            defaultImg
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productsList{
    border-radius: 0!important;
}
.productsSwipeWrapper {
    :deep(.van-swipe__indicators) {
        bottom: 3px;
        --van-swipe-indicator-inactive-opacity: 1;
        --van-swipe-indicator-inactive-background-color: var(--lineColor);
    }
}
.productsSwipe {
    display: flex;
    width: 100%;
    line-height: 1.5;
    text-align: center;
    .item {
        flex: 1;
        padding: rem(20px) 0;
        &.riseColor{
            background: var(--riseColor);
        }
        &.fallColor{
            background: var(--fallColor);
        }
    }
    .name {
        margin: 0 auto;
        font-size: rem(32px);
        max-width: rem(220px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .price {
        padding: rem(10px) 0 rem(3px);
        font-size: rem(38px);
        line-height: 1.2;
    }
    .change {
        font-size: rem(24px);
    }
}
.default-wrap {
    img {
        width: 100%;
    }
}
</style>
