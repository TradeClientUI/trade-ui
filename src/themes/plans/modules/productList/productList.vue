<template>
    <div ref='productListEl' class='productListWrap'>
        <productItem v-for='item in productList' :key='item' :product='productMap[item.symbolKey]' @open='openProduct(item)' />
    </div>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import productItem from './productItem'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        productItem,
    },
    props: ['productList'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const productListEl = ref(null)
        const state = reactive({
            list: [...new Array(10)],
            show: false,
        })
        // 产品列表
        const productMap = computed(() => store.state._quote.productMap)

        // 订阅当前屏和上半屏、下半屏的产品报价，给上层组件使用
        const calcSubscribeProducts = () => {
            const el = productListEl.value
            if (!el || el.children.length === 0) return []
            const elHeight = el.clientHeight
            const scrollTop = el.scrollTop
            const itemHeight = el.firstElementChild.offsetHeight
            const productsScreen = Math.ceil(elHeight / itemHeight) // 一屏显示的产品数
            let start = Math.floor(scrollTop / itemHeight) // 显示的第一个产品
            start -= productsScreen / 2
            start = Math.max(start, 0)
            const end = Math.round(start + productsScreen * 2)
            const subscribeArr = props.productList.slice(start, end).map(({ symbolKey }) => symbolKey)
            // console.log('订阅产品', subscribeArr)
            return subscribeArr
        }
        const calcProductsDebounce = debounce(() => {
            const subscribList = calcSubscribeProducts()
            if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
        })

        const stop = watch(
            () => props.productList.length,
            async () => {
                await nextTick()
                // const subscribList = calcSubscribeProducts()
                // if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)

                if (props.productList.length) {
                    stop()
                }
            },
            { immediate: true }
        )

        const openProduct = (data) => {
            // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
            router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
        }

        // 全量订阅产品报价
        const subscribeAll = () => {
            const list = props.productList.map(({ symbolKey }) => symbolKey)
            if (list.length > 0) QuoteSocket.send_subscribe24H(list)
        }

        onMounted(() => {
            subscribeAll()
            // productListEl.value.addEventListener('scroll', calcProductsDebounce, false)
        })

        return {
            ...toRefs(state),
            productListEl,
            subscribeAll,
            calcProductsDebounce,
            calcSubscribeProducts,
            productMap,
            openProduct,

        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productListWrap {
    width: 100%;
}
</style>
