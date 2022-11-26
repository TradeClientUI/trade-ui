// PCUI 首页的store

export default {
    namespaced: true,
    state: {
        subscribeBannerList: [], // 首页订阅的产品banner模块， 缓存symbolKey
        subscribeQuoteList: [], //  首页订阅的产品行情模块， 缓存symbolKey
    },
    mutations: {
        Update_subscribeBannerList (state, data) {
            state.subscribeBannerList = data
        },
        Update_subscribeQuoteList (state, data) {
            state.subscribeQuoteList = data
        },
    }
}
