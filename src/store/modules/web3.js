import { localSet, localGet, setToken, removeLoginParams, sessionSet, localRemove } from '@/utils/util'
import { marketList_AAVE } from '@/api/fund'

export default {
    namespaced: true,
    state: {
        operate: '', // 当前操作的代币标识，marketName和networkName组成, eg: "Polygon Mumbai"，用来跟marketsConfig的配置做关联映射
        chainId: '', // 当前链ID
        networkId: '', // 当前网络ID
        networkType: '', // 当前网络类型
        userAddress: '', // 当前链地址
        userBalance: '', // 当前链余额
        testnetMode: JSON.parse(localGet('isTestMode')), // 是否开启测试模式
        aaveProducts: [],
        indexcoopProducts: [],
    },
    // getters: {
    //     userAccountType (state) {
    //     }
    // },
    mutations: {
        Empty_data (state, data) { // 清空用户信息
            state.chainId = ''
            state.networkId = ''
            state.userBalance = ''
            state.userAddress = ''
            state.networkType = ''
        },
        Update_chainId (state, data) {
            state.chainId = data
        },
        Update_networkId (state, data) {
            state.networkId = data
        },
        Update_networkType (state, data) {
            state.networkType = data
        },
        Update_userBalance (state, data) {
            state.userBalance = data
        },
        Update_testnetMode (state, data) {
            state.testnetMode = data
        },
        Update_userAddress (state, data) {
            state.userAddress = data
        },
        Update_operate (state, data) {
            state.operate = data
        },
        Update_aaveProducts (state, data) {
            state.aaveProducts = data
        },
        Update_indexcoopProducts (state, data) {
            state.indexcoopProducts = data
        },
    },
    actions: {
        // 查询AAVE市场列表
        getAAVEMarkets ({ dispatch, commit, rootState }) {
            return marketList_AAVE().then((res) => {
                if (res.check()) {
                    commit('Update_aaveProducts', res.data || [])
                    return res
                }
            })
        },
    }
}
