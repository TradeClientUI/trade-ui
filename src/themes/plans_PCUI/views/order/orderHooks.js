import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { gt, lt, mul } from '@/utils/calculation'

export default function hooks (state) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
    const product = computed(() => store.getters.productActived)
    const account = computed(() => {
        let account = {}
        if (!product.value) return account
        const accountList = customerInfo.value?.accountList || []
        const tradeType = parseInt(product.value?.tradeType)
        if ([1, 2].includes(tradeType)) {
            let accountTemp = accountList.find(el => el.tradeType === tradeType)
            account = {
                buy: accountTemp,
                sell: accountTemp
            }
        } else {
            const buyCurrency = product.value?.profitCurrency
            const sellCurrency = product.value?.baseCurrency
            account = {
                buy: (buyCurrency && customerInfo.value)  ? customerInfo?.value?.accountMap[`${tradeType}_${buyCurrency}`] : {},
                sell: (sellCurrency && customerInfo.value)  ? customerInfo?.value?.accountMap[`${tradeType}_${sellCurrency}`] : {}
            }
        }
        return account
    })
    // CFD全仓和CFD逐仓 手数区分10-限价预埋单；11-停损预埋单，按额下单固定bizType 14
    const bizTypeByPendingCFD =  ()=>{
        const requestPrice = state[state.submitType].pendingPrice
        // let bizType=''
        // if (state.submitType === 'buy') {
        //     bizType = lt(requestPrice, product.value.buy_price) ? 10 : 11
        // } else {
        //     bizType = gt(requestPrice, product.value.sell_price) ? 10 : 11
        // }
        return 12;
    }
    const bizType = computed(() => {
        let bizType = state.orderType   // 1市价单  10挂单
        let entryType = state[state.submitType].entryType   // 1按数量下单 2按成交额下单
        const tradeType = product.value?.tradeType

        if([1,2].includes(tradeType)){
            if(state.orderType===1){
                bizType = 1
            }else{
                bizType = bizTypeByPendingCFD()
            }
        }else if([3].includes(tradeType) ){
            if(state.orderType===1){
                bizType = entryType=== 1 ? 1 : 12;
            }else{
                bizType = entryType=== 1 ? 13 : 14;
            }
        }else if([5].includes(tradeType) ){ // 现货撮合玩法 市价填写12,限价填写13
            bizType = state.orderType===1 ? 12:13

        }else if([9].includes(tradeType) ){
            bizType = state.orderType===1 ? 1:13

        }
        return bizType
    })
    // 查找板块分类下第一个有效的产品
    const findProductInCategory = (tradeType) => {
        const category = store.getters.userProductCategory[tradeType]
        if (!category) return false
        let resultProduct = null
        for (let i = 0; i < category.length; i++) {
            const item = category[i]
            item.listByUser.forEach(el => {
                if (resultProduct) return
                const symbolKey = `${el}_${tradeType}`
                if (productMap.value[symbolKey]?.symbolName) resultProduct = symbolKey
            })
            if (resultProduct) return resultProduct
        }
    }
    // 切换产品
    const switchProduct = (symbolId, tradeType) => {
        return router.replace({
            query: {
                ...route.query,
                symbolId,
                tradeType,
            }
        }).then(() => {
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        })
    }

    return {
        account,
        bizType,
        findProductInCategory,
        switchProduct,
    }
}
