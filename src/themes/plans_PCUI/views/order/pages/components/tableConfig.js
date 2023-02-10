import ETF from '@planspc/components/etfIcon'
import { unref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { minus } from '@/utils/calculation'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { closePboOrder, closeTradePboOrder } from '@/api/trade'
import { getCookie } from '@/utils/util'

const formatTime = val => window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
const locale = getCookie('lang') === 'zh-CN' ? 'zh' : 'en'

// 成交量/额
const getFormatExecuteNum = t => (val, tradeType, row) => {
    const { numberStatisticMode, direction, inCurrency, outCurrency, accountCurrency } = row
    switch (Number(tradeType)) {
    case 1:
    case 2: {
        return val + t('trade.volumeUnit')
    }
    case 3:
    case 5: {
        if (numberStatisticMode === 1) {
            return val + (direction === 1 ? inCurrency : outCurrency)
        } else if (numberStatisticMode === 2) {
            return val + (direction === 1 ? outCurrency : inCurrency)
        }
        break
    }
    default: {
        return numberStatisticMode === 1 ? val + t('trade.volumeUnit') : val + accountCurrency
    }
    }
}

const getnumberStatisticModeMap = (t) => ({
    1: t('transRecords.orderbyAuantity'),
    2: t('transRecords.orderByAmount')
})

// 获取委托/挂单列表配置
export const getPendingColumns = tradeType => {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + row.tradeType]
    }
    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'

    const expireTypeMap = {
        1: t('trade.expireType1'),
        2: t('trade.expireType2'),
    }
    const numberStatisticModeMap = getnumberStatisticModeMap(t)

    const cancelOrder = (row) => {
        const params = {
            customerNo: row.customerNo,
            customerId: row.customerId,
            accountId: row.accountId,
            tradeType: row.tradeType,
            bizType: row.bizType
        }

        if ([5, 9].includes(Number(row.tradeType))) {
            return closeTradePboOrder({
                orderId: row.id,
                ...params,
            })
                .then(res => res.check())
                .catch(err => {
                    console.log(err)
                })
        } else {
            return closePboOrder({
                pboId: String(row.id),
                ...params,
            })
                .then(res => res.check())
                .catch(err => {
                    console.log(err)
                })
        }
    }
    // 撤单
    const handleCancelOrder = (row) => {
        ElMessageBox.confirm(t('trade.cancelPendingOrder'), t('tip'), {
            cancelButtonText: t('cancel'),
            confirmButtonText: t('confirm'),
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    cancelOrder(row)
                        .then((bool) => {
                            if (bool) {
                                ElMessage({
                                    type: 'success',
                                    message: t('trade.cancelSuccess'),
                                })
                                store.dispatch('_trade/queryPBOOrderPage', {
                                    tradeType: row.tradeType,
                                    sortFieldName: 'orderTime',
                                    sortType: 'desc',
                                })
                            } else {
                                ElMessage({
                                    type: 'error',
                                    message: t('trade.cancelFail'),
                                })
                            }
                        })
                        .finally(() => {
                            done()
                            instance.confirmButtonLoading = false
                        })
                } else {
                    done()
                }
            },
        })
            .then(action => {

            },)
    }

    const columnsMap = computed(() => ({
        1: [
            {
                name: t('trade.name'),
                prop: 'symbolName',
                className: 'symbolName',
                align: 'left',
                minWidth: 150,
                formatter: row => <span >
                    {<div class="van-ellipsis">{row.symbolName}</div>}
                    {<span class="crossLevelNum marginleft0" v-show={row.crossLevelNum}>{ row.crossLevelNum }x</span>}
                </span>
            },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.pendingUnit') + ' (' + t('trade.volumeUnit') + ')',
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                // formatter: row => row.requestNum + `(${row.numberStatisticMode === 2 ? row.accountCurrency : t('trade.volumeUnit')})`
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right', minWidth: 100 },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                minWidth: 100,
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 100,
                prop: 'stopLossTarget'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 100,
                prop: 'takeProfitTarget'
            },
            {
                name: t('trade.expireTime'),
                align: 'right',
                minWidth: 180,
                formatter: row => expireTypeMap[row.expireType]
            },
            { name: t('trade.pendingTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.orderTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right', minWidth: 200 },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                className: 'operate',
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                { t('trade.cancelOrder') }
                            </span>
                        )
                    }
                }
            },
        ],
        2: [
            { name: t('trade.name'), prop: 'symbolName', align: 'left', minWidth: 100 },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('transRecords.byAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => numberStatisticModeMap[row.entryType]
            },
            {
                name: t('transRecords.entrustedAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + (row.entryType === 2 ? row.accountCurrency : t('trade.volumeUnit'))
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right', minWidth: 120 },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                minWidth: 120,
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 100,
                formatter: row => (row.stopLoss / Math.pow(10, row.digits)).toFixed(row.digits)
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 100,
                formatter: row => (row.takeProfit / Math.pow(10, row.digits)).toFixed(row.digits)
            },
            {
                name: t('trade.expireTime'),
                align: 'right',
                minWidth: 180,
                formatter: row => expireTypeMap[row.expireType]
            },
            { name: t('trade.pendingTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.orderTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right', minWidth: 200 },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                { t('trade.cancelOrder') }
                            </span>
                        )
                    }
                }
            },
        ],
        3: [
            { name: t('trade.name'), prop: 'symbolName', align: 'left' },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('transRecords.byAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => numberStatisticModeMap[row.entryType]
            },
            {
                name: t('transRecords.entrustedAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + row.accountCurrency
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right' },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            {
                name: t('trade.loan'),
                align: 'right',
                formatter: row => row.loanAmount + row.accountCurrency
            },
            { name: t('trade.trustTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.trustTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right', minWidth: 200 },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                { t('trade.cancelOrder') }
                            </span>
                        )
                    }
                }
            },
        ],
        5: [
            {
                name: t('trade.name'),
                align: 'left',
                formatter: row => (<div>
                    <span class='name'>
                        { row.symbolName }
                    </span>
                    <ETF v-show={getVal(row.symbolId + '_5', 'etf') === true} />
                </div>)
            },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                minWidth: 150,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                // formatter: row => row.requestNum + (row.numberStatisticMode === 2 ? row.outCurrency : t('trade.volumeUnit'))
                formatter: row => row.requestNum + row.outCurrency
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right' },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                formatter: row => (Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price) || '- -'
            },
            { name: t('trade.trustTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.trustTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                { t('trade.cancelOrder') }
                            </span>
                        )
                    }
                }
            },
        ]
    }))
    return unref(columnsMap)[tradeType]
}

// 获取成交记录列表配置
export const getTransactionColumns = (tradeType) => {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const productMap = computed(() => store.state._quote.productMap)
    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'

    // 判断是否是平仓
    const isCloseType = (bizType) => {
        if ([4, 5, 6, 7, 8].includes(Number(bizType))) {
            return true
        } else {
            return false
        }
    }

    const formatExecuteNum = getFormatExecuteNum(t)
    const numberStatisticModeMap = getnumberStatisticModeMap(t)
    const columnsMap = computed(() => ({
        1: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 170,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 180,
                prop: 'symbolName'
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 85,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                minWidth: 120,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('trade.pendingUnit') + ' (' + t('trade.volumeUnit') + ')',
                prop: 'requestNum',
                align: 'right',
                minWidth: 150
            },
            // {
            //     name: t('transRecords.byAmount'),
            //     align: 'right',
            //     minWidth: 150,
            //     formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            // },
            // {
            //     name: t('transRecords.entrustedAmount'),
            //     align: 'right',
            //     minWidth: 150,
            //     formatter: row => row.requestNum + (row.numberStatisticMode === 2 ? row.accountCurrency : t('trade.volumeUnit'))
            // },
            {
                name: t('trade.dealVolume') + ' (' + t('trade.volumeUnit') + ')',
                prop: 'executeNum',
                align: 'right',
                minWidth: 120,
                // formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 120,
                formatter: row => (Number(row.bizType) === 1 || isCloseType(row.bizType)) ? '- -' : row.requestPrice
            },
            {
                name: t('trade.positionPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 120,
                formatter: row => isCloseType(row.bizType) ? row.requestPrice : '- -'
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'stopLoss',
                formatter: row => row.stopLoss * 1 !== 0 ? row.stopLoss : '- -'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'takeProfit',
                formatter: row => row.takeProfit * 1 !== 0 ? row.takeProfit : '- -'
            },
            {
                name: t('trade.profit'),
                align: 'right',
                prop: 'profitLoss',
                minWidth: 100,
            },
            { name: t('trade.fee'), prop: 'commission', align: 'right', minWidth: 120 },
            { name: t('trade.pendingNo'), minWidth: 100, prop: 'dealId', align: 'right' },
        ],
        2: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 120,
                prop: 'symbolName'
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 80,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                width: 100,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                minWidth: 160,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + `(${row.numberStatisticMode === 2 ? row.accountCurrency : t('trade.volumeUnit')})`
            },
            {
                name: t('trade.dealVolume'),
                prop: 'executeNum',
                align: 'right',
                minWidth: 100,
                formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
            },
            {
                name: t('trade.trustPrice'),
                align: 'right',
                minWidth: 120,
                formatter: row => isCloseType(row.bizType) ? '- -' : row.requestPrice
            },
            {
                name: t('trade.positionPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 120,
                formatter: row => isCloseType(row.bizType) ? row.requestPrice : '- -'
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'stopLoss',
                formatter: row => row.stopLoss * 1 !== 0 ? row.stopLoss : '- -'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'takeProfit',
                formatter: row => row.takeProfit * 1 !== 0 ? row.takeProfit : '- -'
            },
            {
                name: t('trade.profit'),
                align: 'right',
                prop: 'profitLoss',
                minWidth: 120,
            },
            { name: t('trade.fee'), prop: 'commission', align: 'right', minWidth: 120 },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        3: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 120,
                prop: 'symbolName'
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 80,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                width: 100,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                width: 160,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + row.outCurrency
            },
            {
                name: t('transRecords.volumeAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 120,
                formatter: row => (Number(row.bizType) === 1 || isCloseType(row.bizType)) ? '- -' : row.requestPrice
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.loan'),
                prop: 'loanAmount',
                align: 'right',
                minWidth: 150,
                formatter: row => row.loanAmount + row.outCurrency
            },
            {
                name: t('trade.fee'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.commission + row.inCurrency
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        5: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 120,
                formatter: row => (<div>
                    <span class='name'>
                        { row.symbolName }
                    </span>
                    <ETF v-show={getVal(row.symbolId + '_5', 'etf') === true} />
                </div>)
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 80,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                minWidth: 100,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                minWidth: 160,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode] || '- -'
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                // formatter: row => row.requestNum + `(${row.numberStatisticMode === 2 ? row.accountCurrency : t('trade.volumeUnit')})`
                formatter: row => row.requestNum + row.outCurrency

            },
            {
                name: t('transRecords.volumeAmount'),
                align: 'right',
                minWidth: 150,
                // formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
                formatter: row => row.executeNum + row.outCurrency
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 150,
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.fee'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.commission + row.inCurrency
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
    }))

    return unref(columnsMap)[tradeType]
}

// 获取资产列表配置
export const getAssetColumns = (tradeType) => {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const router = useRouter()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + row.tradeType]
    }
    const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === tradeType) || {})

    // 平仓调窗
    const openClosePosition = (row, closePosition) => {
        // store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
        unref(closePosition).open(row)
    }

    // 止盈止损弹窗
    const openSltp = (row, sltp) => {
        // store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
        store.dispatch('_quote/querySymbolInfo', row.symbolId)
        store.commit('Update_stopLossPprofitProductID', row.symbolId + '_' + row.tradeType)
        store.commit('_trade/Update_modifyPositionId', row.positionId + '_' + row.tradeType)
        unref(sltp).open(row)
    }

    // 调整保证金弹窗
    const openAdjustMargin = (row, adjustMargin) => {
        unref(adjustMargin).open(row)
    }

    // 杠杆倍数弹窗
    const openMultipleSet = (row, multipleSet) => {
        if (Number(row.marginSetType) === 2) { unref(multipleSet).open(row) }
    }

    // 跳转到借款页面
    const goLoan = (row) => {
        if (row.accountId) {
            router.push({
                path: '/order/loan',
                query: {
                    currency: row.currency,
                    accountId: row.accountId,
                    tradeType
                }
            })
        } else {
            router.push({
                path: '/order/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType,
                    type: 1
                }
            })
        }
    }

    // 跳转到还款页面
    const goRepayment = (row) => {
        if (row.accountId) {
            router.push({
                path: '/order/returnMoney',
                query: {
                    currency: row.currency,
                    accountId: row.accountId,
                    tradeType
                }
            })
        } else {
            router.push({
                path: '/order/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType,
                    type: 3
                }
            })
        }
    }

    const columnsMap = computed(() => ({
        1: [
            {
                name: t('trade.name'),
                prop: 'symbolName',
                align: 'left',
                className: 'symbolName',
                minWidth: 150,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (

                            <>
                                {<div class="van-ellipsis">{row.symbolName}</div>}
                                { row.crossLevelNum ? <p class='multipleVal marginleft0' onclick={
                                    openMultipleSet.bind(null, row, refs.multipleSetCross)
                                }>
                                    <i>{ row.crossLevelNum }x</i>
                                    {Number(row.marginSetType) === 2 ? <i class='icon_icon_arrow'></i> : ''}
                                </p> : '' }

                            </>
                        )
                    }
                }
            },
            {
                name: `${t('trade.profit')}${assetsInfo.value?.currency ? '(' + assetsInfo.value.currency + ')' : ''}`,
                align: 'right',
                minWidth: 150,
                formatter: row => {
                    return <span className={[parseFloat(row.profitLoss) > 0 ? 'riseColor' : 'fallColor']}>{row.profitLoss || '+0'}</span>
                }
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 100,
                formatter: row => {
                    return <span className={[parseFloat(row.direction) === 1 ? 'riseColor' : 'fallColor']}>
                        { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                    </span>
                }
            },
            {
                name: t('trade.pendingUnit') + '(' + t('trade.volumeUnit') + ')',
                align: 'right',
                minWidth: 150,
                formatter: row => minus(row.openVolume, row.closeVolume)
            },
            {
                name: t('trade.positionPrice'),
                prop: 'openPrice',
                align: 'right',
                minWidth: 100,
            },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                minWidth: 100,
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'stopLossDecimal',
                formatter: row => row.stopLossDecimal * 1 !== 0 ? row.stopLossDecimal : '- -'
                // formatter: row => parseFloat(row.stopLossDecimal) ? row.stopLossDecimal : '--'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 120,
                // prop: 'takeProfitDecimal',
                formatter: row => row.takeProfitDecimal * 1 !== 0 ? row.takeProfitDecimal : '- -'
                // formatter: row => parseFloat(row.takeProfitDecimal) ? row.takeProfitDecimal : '--'
            },
            {
                name: t('trade.openTime'),
                align: 'right',
                minWidth: 200,
                formatter: row => formatTime(row.openTime)
            },
            {
                name: t('trade.positionId'),
                prop: 'positionId',
                minWidth: 130,
                align: 'right',
            },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: 130,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (
                            <>
                                <span className='link' onclick={openSltp.bind(null, row, refs.sltp)} type='text'>
                                    { t('trade.tackStopSetup') }
                                </span>
                                <span className='link' onclick={openClosePosition.bind(null, row, refs.closePosition)} type='text'>
                                    { t('trade.closed') }
                                </span>
                            </>
                        )
                    }
                }
            },
        ],
        2: [
            {
                name: t('trade.name'),
                prop: 'symbolName',
                className: 'symbolName',
                align: 'left',
                width: '200',
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (

                            <>
                                {<div class="van-ellipsis">{row.symbolName}</div>}
                                { row.crossLevelNum ? <span class='multipleVal' onclick={
                                    openMultipleSet.bind(null, row, refs.multipleSet)
                                }>
                                    <i>{ row.crossLevelNum }x</i>
                                    {Number(row.marginSetType) === 2 ? <i class='icon_icon_arrow'></i> : ''}
                                </span> : '' }

                            </>
                        )
                    }
                }

            },
            {
                name: `${t('trade.profit')}${assetsInfo.value?.currency ? '(' + assetsInfo.value.currency + ')' : ''}`,
                prop: 'direction',
                align: 'right',
                minWidth: 100,
                formatter: row => <span class={parseFloat(row.profitLoss) > 0 ? 'riseColor' : 'fallColor'}>
                    { row.profitLoss || '+0' }
                </span>
            },
            { name: t('trade.swap_2') + '(' + unref(assetsInfo).currency + ')', prop: 'interest', align: 'right', minWidth: 100, },
            {
                name: t('trade.direction'),
                prop: 'requestNum',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.pendingUnit') + '(' + t('trade.volumeUnit') + ')',
                prop: 'requestPrice',
                align: 'right',
                formatter: row => minus(row.openVolume, row.closeVolume),
                minWidth: 150,
            },
            { name: t('trade.positionPrice'), prop: 'openPrice', align: 'right', minWidth: 100, },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                minWidth: 100,
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            { name: t('trade.prospectMandatory'), prop: 'previewStopPrice', align: 'right', minWidth: 100, },
            { name: t('trade.originalMargin'), prop: 'occupyTheMargin', align: 'right', minWidth: 100, },
            { name: t('trade.holdMargin'), prop: 'maintenanceMargin', align: 'right', minWidth: 100, },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                minWidth: 100,
                // prop: 'stopLossDecimal',
                formatter: row => row.stopLossDecimal * 1 !== 0 ? row.stopLossDecimal : '- -'
                // formatter: row => parseFloat(row.stopLossDecimal) ? row.stopLossDecimal : '--'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                minWidth: 100,
                // prop: 'takeProfitDecimal',
                formatter: row => row.takeProfitDecimal * 1 !== 0 ? row.takeProfitDecimal : '- -'
                // formatter: row => parseFloat(row.takeProfitDecimal) ? row.takeProfitDecimal : '--'
            },
            {
                name: t('trade.openTime'),
                align: 'right',
                minWidth: 200,
                formatter: row => formatTime(row.openTime)
            },
            { name: t('trade.positionId'), prop: 'positionId', align: 'right', minWidth: 150 },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: locale === 'zh' ? 210 : 225,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (
                            <>
                                <span className='link' onclick={openAdjustMargin.bind(null, row, refs.adjustMargin)} type='text'>
                                    { t('trade.modifyMargin') }
                                </span>
                                <span className='link' onclick={openSltp.bind(null, row, refs.sltp)} type='text'>
                                    { t('trade.tackStopSetup') }
                                </span>
                                <span className='link' onclick={openClosePosition.bind(null, row, refs.closePosition)} type='text'>
                                    { t('trade.closed') }
                                </span>
                            </>
                        )
                    }
                }
            },
        ],
        3: [
            { name: t('trade.name'), prop: 'currency', align: 'left' },
            { name: t('trade.totalAssets'), prop: 'balance', align: 'right' },
            { name: t('trade.free'), prop: 'available', align: 'right' },
            { name: t('trade.frozen'), prop: 'frozen', align: 'right' },
            { name: t('trade.loan'), prop: 'liabilitiesPrincipal', align: 'right' },
            { name: t('trade.swap_2'), prop: 'interest', align: 'right' },
            // { name: t('assets.maxLoan'), prop: 'availableLoan', align: 'right' },
            { name: t('trade.carry'), prop: 'withdrawAmount', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: locale === 'zh' ? 100 : 145,
                slots: {
                    default: ({ row }) => {
                        return (
                            <>
                                {/* <span className='link' onclick={goLoan.bind(null, row)} type='text'>
                                    { t('trade.loan') }
                                </span> */}
                                <span className='link' onclick={goRepayment.bind(null, row)} type='text'>
                                    { t('trade.repayment') }
                                </span>
                            </>
                        )
                    }
                }
            },
        ],
        5: [
            { name: t('trade.name'), prop: 'currency', align: 'left' },
            { name: t('trade.totalAssets'), prop: 'balance', align: 'right' },
            { name: t('trade.free'), prop: 'available', align: 'right' },
            { name: t('trade.frozen'), prop: 'frozen', align: 'right' },
            { name: t('trade.carry'), prop: 'withdrawAmount', align: 'right' },
        ]
    }))

    return unref(columnsMap)[tradeType]
}
