import { computed } from 'vue'
import { useStore } from 'vuex'

export const findFundList = (params) => {
    const store = useStore()

    // 获取基金产品列表
    const getFundList = () => {
        return store.dispatch('_quote/findFundPage')
    }
    const fundProductList = computed(() => store.state._quote.fundProductList)

    // 滚动时按需加载基金净值等数据
    const lazyloadData = (index) => {
        const fundProduct = fundProductList.value[index]
        if (!fundProduct) return false
        if (fundProduct.netValue) return false
        store.dispatch('_quote/fundNetValue', { fundId: fundProduct.fundId })
    }

    return {
        getFundList,
        fundProductList,
        lazyloadData,
    }
}
