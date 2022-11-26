// import Vue from 'vue'
import { deepClone } from '@utils/deepClone'
export default {
    namespaced: true,
    state: {
        activated: null,
        elementList: [],
        getProducting: false,
        accountGroupProduct: [],
        tradeTypeList: [],
        tradeTypeBlockProduct: {},
        tradeTypeSelfSymbol: {},
        tradeTypeBlockCollect: [],
        activeIndex: ''
    },
    mutations: {
        /**
         * 清空页面.
         */
        RESET_ELEMENT (state, data) {
            state.elementList = data
            if (data.length > 0) {
                state.activated = data[0].id
            } else {
                state.activated = null
            }
        },
        /**
         * 删除元素.
         * @param {string} id - 元素ID.
         */
        DELETE_ELEMENT (state, id) {
            let _index = -1
            state.elementList.forEach((item, index) => {
                if (item.id === id) {
                    _index = index
                }
            })
            if (state.activated === id) {
                if (_index < 1) {
                    state.activated = state.elementList[1]
                        ? state.elementList[1].id
                        : null
                } else {
                    state.activated = state.elementList[_index - 1].id
                }
            }
            if (_index > -1) state.elementList.splice(_index, 1)
        },
        /**
         * 新增元素.
         * @param {string} data.index - 添加位置.
         * @param {string} data.config - 表单配置.
         * @param {string} data.data - 表单数据.
         */
        ADD_ELEMENT (state, data) {
            const index = data.index || 0
            delete data.index
            state.elementList.splice(index, 0, data)
            state.activated = data.id
        },
        /**
         * 挪动元素位置.
         * @param {string} data.oldIndex - 旧位置.
         * @param {string} data.newIndex - 新位置.
         */
        CHANGE_INDEX_ELEMENT (state, data) {
            if (data.oldIndex === data.newIndex) return false
            const nowItem = state.elementList.splice(data.oldIndex, 1)
            state.elementList.splice(data.newIndex, 0, nowItem[0])
        },
        /**
         * 修改当前编辑元素.
         * @param {string} id - 元素ID.
         */
        CHANGE_ACTIVATED (state, id) {
            state.activated = id
        },
        /**
         * Array类型表单新增表单元素.
         * @param {object} data.config - 新增form元素.
         * @param {object} data.data - 表单数据.
         */
        ADD_FROM_ROW (state, data) {
            data.formConfig.push(deepClone(data.formConfig[0]))
            data.data.push(deepClone(data.data[0]))
        },
        /**
         * Array类型表单删除表单元素.
         * @param {object} data.config - 删除元素配置列表.
         * @param {object} data.data - 删除元素列表.
         * @param {object} data.index - 删除元素索引.
         */
        DELETE_FROM_ROW (state, data) {
            data.formConfig.splice(data.index, 1)
            data.data.splice(data.index, 1)
        },
        /**
         * 挪动表单元素位置.
         * @param {string} data.oldIndex - 旧位置.
         * @param {string} data.newIndex - 新位置.
         * @param {string} data.key - key.
         */
        CHANGE_INDEX_FROM_ROW (state, data) {
            // 找到元素位置
            if (data.oldIndex === data.newIndex) return false
            const activeData = state.elementList.filter(
                (item) => item.id === state.activated
            )[0]
            if (activeData) {
                const arrayRow = activeData.data[data.key]
                const nowItem = arrayRow.splice(data.oldIndex, 1)
                arrayRow.splice(data.newIndex, 0, nowItem[0])
            }
        },
        /**
         * 更新当前表单值.
         * @param {string} data.key - 表单key值.
         * @param {string} data.value - 表单key对应的内容.
         */
        UPDATE_FORM_DATA (state, data) {
            const activeData = state.elementList.filter(
                (item) => item.id === state.activated
            )[0]
            // Vue.set(activeData.data, data.key, data.value);
            activeData.data[data.key] = data.value
        },
        /**
         * 更新客户组产品.
         * @param {string} data - 产品信息.
         */
        UPDATE_ACCOUNT_PRODUCT (state, data) {
            state.accountGroupProduct = data
        },
        /**
         * 更新玩法板块产品.
         * @param {string} data - 产品信息.
         */
        UPDATE_TRADETYPE_PRODUCT (state, data) {
            state.tradeTypeBlockProduct = data
        },
        /**
         * 更新玩法
         * @param {string} data - 产品信息.
         */
        UPDATE_TRADETYPE_LIST (state, data) {
            state.tradeTypeList = data
        },
        UPDATE_TRADETYPE_BLOCK_COLLECT (state, data) {
            state.tradeTypeBlockCollect = data
        },
        /**
         * 更新玩法自选产品.
         * @param {string} data - 产品信息.
         */
        UPDATE_TRADETYPE_SELFSYMBOL (state, data) {
            if (data.activatedId) {
                if (!state.tradeTypeSelfSymbol[data.activatedId]) {
                    state.tradeTypeSelfSymbol[data.activatedId] = {}
                }
                state.tradeTypeSelfSymbol[data.activatedId][data.type] = data.data
            }
        },
        /**
         * 从接口更新玩法自选产品.
         * @param {string} data - 产品信息.
         */
        UPDATE_TRADETYPE_SELFSYMBOL_ALL (state, data) {
            state.tradeTypeSelfSymbol[data.activatedId] = data.data
        },
        /**
         * 获取产品信息中.
         * @param {string} data.key - 客户组id.
         * @param {string} data.value - 产品列表.
         */
        UPDATE_GET_PRODUCTING (state, data) {
            state.getProducting = data
        },
        /**
         * 更新当前操作的对象.
         * @param {string} data.key - 当前操作右侧表单的下标.
         * @param {string} data.value - 产品列表.
         */
        UPDATE_ACTIVEINDEX (state, data) {
            state.activeIndex = data
        }
    }
}
