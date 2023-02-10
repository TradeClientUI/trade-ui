import { getEnableAct, getActFinishStatus } from '@/api/activity'

export default {
    namespaced: true,
    state: {
        /** 进行中的新客活动信息 */
        info: {
            beginTime: null,
            endTime: null,
            finishVolume: null,
            // 充值金额
            rechargeAmount: null,
            // 注册到充值的或者时间间隔，单位小时
            rechargeGapHour: null,
            // 奖励金额
            rewardAmount: null,
            rewardCurrency: null,
            // 活动状态 1:未开启;2:开启;3:禁用;4:删除
            status: 1,
        },
        getEnableActLoading: false,
        getActFinishStatusLoading: false,
        /** 活动完成状态，null:未参与 1:待完成 3:已结束 */
        finishStatus: undefined
    },
    mutations: {
        Update_activityInfo (state, data) {
            state.info = data
        },
        Update_finishStatus (state, data) {
            state.finishStatus = data
        },
        Update_getEnableActLoading (state, data) {
            state.getEnableActLoading = data
        },
        Update_getActFinishStatusLoading (state, data) {
            state.getActFinishStatusLoading = data
        },
    },
    actions: {
        // 获取进行中的新客活动信息
        getEnableAct ({ dispatch, commit, rootState }) {
            commit('Update_getEnableActLoading', true)
            return getEnableAct().then((res) => {
                if (res.code === '0') {
                    commit('Update_activityInfo', res.data || { status: 1 })
                    return res
                }
            }).finally(() => {
                commit('Update_getEnableActLoading', false)
            })
        },
        getActFinishStatus ({ dispatch, commit, rootState }) {
            const customerNo = rootState._user.customerInfo.customerNo
            if (!customerNo) return
            commit('Update_getActFinishStatusLoading', true)
            return getActFinishStatus({ customerNo: customerNo }).then((res) => {
                if (res.code === '0') {
                    commit('Update_finishStatus', res.data?.activityFinishStatus || null)
                    return res
                }
            }).finally(() => {
                commit('Update_getActFinishStatusLoading', false)
            })
        }
    }
}
