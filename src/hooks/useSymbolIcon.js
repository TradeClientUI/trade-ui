// 通过symbolkey获取品种图片
import { useStore } from 'vuex'
import { computed, unref } from 'vue'

const conditionCurrency = ['USOIL', 'UKOIL', 'XAGUSD', 'XPDUSD', 'XPTUSD', 'NGAS', 'XAUUSD', 'COPPER']

export default function hooks (symbolKey) {
    const store = useStore()

    const currencyList = computed(() => {
        const currentProduct = store.state._quote.productMap[unref(symbolKey)]
        if (currentProduct?.symbolCode && currentProduct?.baseCurrency) {
            const list = [currentProduct?.baseCurrency, currentProduct?.profitCurrency]
            const index = conditionCurrency.indexOf(`${currentProduct?.symbolCode}`.toUpperCase())
            if (index !== -1) {
                list[0] = conditionCurrency[index]
            }
            return list
        }
        return []
    })

    return {
        currencyList
    }
}
