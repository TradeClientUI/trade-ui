import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { shiftedBy, plus, retainDecimal } from '@/utils/calculation'
import { deepClone } from '@/utils/deepClone'
export default function ({ showPending = false } = {}) {
    const store = useStore()
    const product = computed(() => store.getters.productActived)

    // 获取产品的深度小数位
    const deepthDigits = computed(() => {
        if (parseFloat(store.state._quote?.deepthDigits) === 1) {
            return 0
        } else if (parseFloat(store.state._quote?.deepthDigits) > 1) {
            return -(store.state._quote?.deepthDigits.length - 1)
        } else {
            return store.state._quote?.deepthDigits?.toString().split('.')?.[1].length
        }
    })

    // 当前玩法挂单列表
    const pendingList = computed(() => store.state._trade?.pendingList[product.value?.tradeType])

    const handicapList = computed(() => store.state._quote.handicapList.find(item => item.symbol_id === String(product.value?.symbolId)))

    const handicapResult = computed(() => {
        if (handicapList.value) {
            const result = JSON.parse(JSON.stringify(handicapList.value))
            const tempArr = [] // 总量
            if (result?.ask_deep.length > 0) {
                result.ask_deep.forEach(ask => {
                    tempArr.push(ask.volume_ask)
                })
            }

            if (result?.bid_deep.length > 0) {
                result.bid_deep.forEach(bid => {
                    tempArr.push(bid.volume_bid)
                })
            }

            const maxValue = Math.max(...tempArr)

            // 计算买入报价长度
            if (result?.ask_deep.length > 0) {
                const buyPendingList = deepClone(pendingList.value && pendingList.value.filter(item => Number(item.direction === 2)))

                result.ask_deep.forEach(ask => {
                    // 盘口每一档量的长度 barLength = 当前档量/max(盘口所有档) *100%
                    ask.width = maxValue === 0 ? 0 : parseFloat(ask.volume_ask) / maxValue * 100
                    ask.unitNum = 0
                    // 计算合并挂单数量
                    if (buyPendingList?.length > 0 && showPending) {
                        buyPendingList.forEach(bl => {
                            if (deepthDigits.value >= 0) {
                                bl.requestPrice = parseFloat(retainDecimal(bl.requestPrice, deepthDigits.value))
                            } else {
                                const tempNum = retainDecimal(bl.requestPrice, 0)
                                bl.requestPrice = tempNum - parseInt(tempNum.substr(deepthDigits.value))
                            }

                            if (bl.requestPrice === parseFloat(ask.price_ask)) {
                                ask.unitNum = plus(bl.requestNum, ask.unitNum)
                            }
                        })
                    }
                })
            }

            // 计算卖出报价长度
            if (result?.bid_deep.length > 0) {
                const sellPendingList = deepClone(pendingList.value && pendingList.value.filter(item => Number(item.direction === 1)))
                result.bid_deep.forEach(bid => {
                    // 盘口每一档量的长度 barLength = 当前档量/max(盘口所有档) *100%
                    bid.width = maxValue === 0 ? 0 : parseFloat(bid.volume_bid) / maxValue * 100
                    bid.unitNum = 0
                    // 计算合并挂单数量
                    if (sellPendingList?.length > 0 && showPending) {
                        sellPendingList.forEach(sl => {
                            if (deepthDigits.value >= 0) {
                                sl.requestPrice = parseFloat(retainDecimal(sl.requestPrice, deepthDigits.value))
                            } else {
                                const tempNum = retainDecimal(sl.requestPrice, 0)
                                sl.requestPrice = tempNum - parseInt(tempNum.substr(deepthDigits.value))
                            }

                            if (sl.requestPrice === parseFloat(bid.price_bid)) {
                                bid.unitNum = plus(sl.requestNum, bid.unitNum)
                            }
                        })
                    }
                })
            }
            return result
        }
        return {
            ask_deep: [],
            bid_deep: [],
            price_digits: 0,
            seq: Date.now().toString(),
            symbol_id: String(product.value?.symbolId),
            trade_info: [],
            trade_type: product.value?.tradeType,
        }
    })

    return {
        handicapResult

    }
}

export const toolHooks = function () {
    // 成交模式: 1:MM(不展示盘口和成交记录)，2:蝴蝶（不显示挂单tab），3:撮合
    const store = useStore()
    const dealModeShowMap = computed(() => {
        const product = store.getters.productActived
        return {
            '1': {
                handicap: false,
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            },
            '2': {
                handicap: true && !product.isIndex, // 非指数产品才显示盘口
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: false, // 限价单是否显示
                }
            },
            '3': {
                handicap: true && !product.isIndex,
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            },
            '4': {
                handicap: true && !product.isIndex,
                pendingTab: {
                    tradeType: [5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            }
        }
    })

    return {
        dealModeShowMap
    }
}
