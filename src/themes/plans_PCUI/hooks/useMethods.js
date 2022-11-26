import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { localGetJSON } from '@/utils/util.js'

export default function () {
    const store = useStore()
    const router = useRouter()

    // 根据tradeType获取默认品种
    const getDefaultProduct = (tradeType) => {
        tradeType = Number(tradeType)
        const arr = store.state._quote.productList.filter(el => Number(el.tradeType) === tradeType)
        let product = null
        // 优先进入上一次访问的产品
        const lastProductSymbolKey = (localGetJSON('lastProductActived', {})[tradeType]) || ''
        if (lastProductSymbolKey) {
            const lastProduct = store.state._quote.productMap[lastProductSymbolKey]
            if (lastProduct?.symbolName && lastProduct?.symbolId) {
                return lastProduct
            }
        }
        console.log('productList', JSON.stringify(arr))
        const symbolKyes = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT']
        for (let i = 0; i < symbolKyes.length; i++) {
            if (product) break
            for (let j = 0; j < arr.length; j++) {
                const el = arr[j]
                console.log({ el })
                const key = el.baseCurrency + '/' + el.profitCurrency
                // console.log({ key })
                if (symbolKyes[i] === key) {
                    product = el
                    break
                }
            }
        }
        if (!product && arr.length) product = arr[0]
        return product
    }

    // 跳转到下单页面并优先显示指定产品
    const toOrderPriority = (tradeType) => {
        const product = getDefaultProduct(tradeType)
        if (product) {
            const symbolId = product.symbolId
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            router.push({
                path: '/order',
                query: {
                    name: product?.symbolName?.replace(/ /g, '_'),
                    symbolId,
                    tradeType
                }
            })
        } else {
            console.log("can't find default product")
        }
    }

    return {
        toOrderPriority,
        getDefaultProduct
    }
}
