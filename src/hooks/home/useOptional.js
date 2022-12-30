// 添加自选
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { ElMessage } from 'element-plus'
import { isEmpty, localGet } from '@/utils/util'

export default function hooks (state) {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    const customerInfo = computed(() => store.state._user.customerInfo)

    /** 添加自选逻辑 */
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList || {})

    /** 添加自选逻辑 标星状态 */
    const isCollect = (tradeType, symbolId) => {
        if (isEmpty(customerInfo.value)) {
            const newId = symbolId + '_' + tradeType
            if (localGet('localSelfSymbolList')) {
                if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                    return true
                } else {
                    return false
                }
            }
        } else {
            return userSelfSymbolList.value[tradeType]?.find(id => parseInt(id) === parseInt(symbolId))
        }
    }

    const addOptional = ({ symbolId, tradeType, callback }) => {
        if (customerInfo.value) {
            if (isCollect(tradeType, symbolId)) {
                removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        ElMessage.success(t('trade.removeOptionalOk'))
                    }
                }).catch(err => {
                })
            } else {
                addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                    if (res.check()) {
                    // 手动修改optional值
                        store.commit('_user/Update_optional', 1)
                        store.dispatch('_user/queryCustomerOptionalList')
                        ElMessage.success(t('trade.addOptionalOk'))
                    }
                }).catch(err => {
                })
            }
        } else {
            // 未登录 缓存到本地
            var localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
            const newId = symbolId + '_' + tradeType
            if (localSelfSymbolList.find(el => el === newId)) {
                localSelfSymbolList.map((it, index) => {
                    if (it === newId) {
                        localSelfSymbolList.splice(index, 1)
                        ElMessage.success(t('trade.removeOptionalOk'))
                    }
                })
            } else {
                localSelfSymbolList.push(newId)
                ElMessage.success(t('trade.addOptionalOk'))
            }
            store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
        }
        callback && callback()
    }

    return {
        isCollect,
        addOptional
    }
}
