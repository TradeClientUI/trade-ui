import { ref, computed, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 基金详情
export function useFundInfo () {
    const store = useStore()
    const router = useRouter()
    const fundInfo = ref(null)
    const fundId = inject('fundId')
    const jump = inject('jump')
    const productMap = computed(() => store.state._quote.productMap)
    const symbolKey = computed(() => store.state._quote.productActivedID)
    const getFundInfoData = () => {
        store.dispatch('_quote/queryFundInfo', fundId).then(res => {
            if (res.check()) {
                const data = res.data || {}
                if (data.trackIndex) data.trackProduct = productMap.value[`${data.trackIndex}_5`]
                fundInfo.value = data
            }
        })
    }

    // 跳转到指数产品
    const toTrackProduct = () => {
        if (fundInfo.value.trackIndex && fundInfo.value.trackProduct) {
            const { symbolId, tradeType } = fundInfo.value.trackProduct
            const params = { name: 'Order', query: { symbolId, tradeType } }
            if (jump === 'push') {
                router.push(params)
            } else {
                router.replace(params)
            }
        }
    }

    // 每次切换产品的时候重新获取基金信息
    watch(
        () => symbolKey.value,
        (newval) => {
            getFundInfoData()
        },
        { immediate: true }
    )

    return { fundInfo, toTrackProduct }
}
