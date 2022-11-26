import ETF from '@planspc/components/etfIcon'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, unref, ref, inject } from 'vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { findFundPage } from '@/api/fund.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import SortIcon from '@planspc/components/sortIcon.vue'
import { sortFieldFn, sortTypeFn, sortFunc } from '@planspc/hooks/useProduct'
import { isEmpty, localSet, localGet, getCookie, setCookie } from '@/utils/util'

export const getColumns = tradeTypeValue => {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const productMap = computed(() => store.state._quote.productMap)

    const sortField = sortFieldFn()
    const sortType = sortTypeFn()
    const customerInfo = computed(() => store.state._user.customerInfo)

    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'
    // 基金列表
    const fundList = ref([])

    // 业务配置
    const businessConfig = computed(() => store.state.businessConfig)

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

    const isReLoadProductList = inject('isReLoadProductList')

    const addOptional = (event, { symbolId, tradeType }) => {
        event.stopPropagation()
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
            isReLoadProductList(true, newId)
        }
    }
    /** 添加自选逻辑 */

    // 获取基金产品列表，
    const getFundPage = () => {
        findFundPage({ customerGroupId: store.getters.customerGroupId, size: 1000 }).then(res => {
            if (res.check()) {
                fundList.value = res.data.records
            }
        })
    }
    getFundPage()

    // 去交易
    const gotoOrder = (event, product) => {
        event.stopPropagation()
        router.push({
            name: 'Order',
            query: {
                name: product?.symbolName?.replace(/ /g, '_'),
                symbolId: product.symbolId,
                tradeType: product.tradeType
            }
        })
    }

    // 去基金
    const gotoFund = (event, product) => {
        event.stopPropagation()
        if (unref(businessConfig)?.v10Link) {
            router.push(unref(businessConfig).v10Link)
        } else {
            const fund = fundList.value.find(el => el.shareTokenCode === product.baseCurrency)
            if (fund) {
                router.push({
                    name: 'Fund',
                    query: {
                        fundId: product.fundId
                    }
                })
            } else {
                Toast(t('trade.noFeature'))
            }
        }
    }

    const commonBtns = ({ row }) => (
        <>
            {/* <span class='btn' onclick={(event) => gotoOrder(event, row)}>
                { t('trade.buy') }
            </span>
            <span class='btn' onclick={(event) => gotoOrder(event, row)}>
                { t('trade.sell') }
            </span> */}
            <span class='btn active' onclick={(event) => gotoFund(event, row)} v-show={row.etf}>
                { t('fundInfo.buy') }
            </span>
            <span class='btn' onclick={(event) => gotoOrder(event, row)}>
                { t('route.trade') }
            </span>
        </>
    )

    // 列表label的名称
    const headerCommonName = ({ row }) => (
        <>
            <span class="pointer" onclick={() => sortFunc('symbolName')}>
                {t('trade.name')}
                <SortIcon name='symbolName' sort-field={sortField.value} sort-type={sortType.value} />
            </span>
        </>
    )

    // 列表label的最新价
    const headerCommonLasPrice = ({ row }) => (
        <>
            <span class="pointer" onclick={() => sortFunc('rolling_last_price')}>
                {t('trade.newPrice')}
                <SortIcon name='rolling_last_price' sort-field={sortField.value} sort-type={sortType.value} />
            </span>
        </>
    )

    // 列表label的涨跌额
    const headerCommonUpDownAmount = ({ row }) => (
        <>
            <span class="pointer" onclick={() => sortFunc('rolling_upDownAmount')}>
                {t('trade.changePrice')}
                <SortIcon name='rolling_upDownAmount' sort-field={sortField.value} sort-type={sortType.value} />
            </span>
        </>
    )

    // 列表label的涨跌幅
    const headerCommonUpDownWidth = ({ row }) => (
        <>
            <span class="pointer" onclick={() => sortFunc('rolling_upDownWidth')}>
                {t('trade.changePercent')}
                <SortIcon name='rolling_upDownWidth' sort-field={sortField.value} sort-type={sortType.value} />
            </span>
        </>
    )

    const columnsMap = {
        1: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolName }
                        </span>
                    </div>
                </div>),
                slots: {
                    header: headerCommonName
                }
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.last_color}>
                        { getVal(row.symbolKey, 'rolling_last_price')}
                    </span>
                ),
                slots: {
                    header: headerCommonLasPrice,
                }
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        { getVal(row.symbolKey, 'rolling_upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'rolling_upDownAmount')}
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownAmount
                }
            },
            {
                name: t('trade.changePercent'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_upDownWidth')}
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownWidth,
                }
            },
            {
                name: t('trade.24highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_high_price')
            },
            {
                name: t('trade.24lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                slots: {
                    default: commonBtns
                }
            },
        ],
        2: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolName }
                        </span>
                    </div>
                </div>),
                slots: {
                    header: headerCommonName
                }
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.last_color}>
                        { getVal(row.symbolKey, 'rolling_last_price')}
                    </span>
                ),
                slots: {
                    header: headerCommonLasPrice,
                }
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        { getVal(row.symbolKey, 'rolling_upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'rolling_upDownAmount')}
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownAmount
                }
            },
            {
                name: t('trade.changePercent'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_upDownWidth')}
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownWidth,
                }

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                slots: {
                    default: commonBtns
                }
            }
        ],
        3: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolName }
                        </span>
                    </div>
                </div>),
                slots: {
                    header: headerCommonName
                }
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_last_price')}
                    </span>
                ),
                slots: {
                    header: headerCommonLasPrice,
                }
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        { getVal(row.symbolKey, 'rolling_upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'rolling_upDownAmount') }
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownAmount
                }

            },
            {
                name: t('trade.changePercent'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_upDownWidth')}
                    </span>
                ),
                slots: {
                    header: headerCommonUpDownWidth,
                }

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'rolling_low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                slots: {
                    default: commonBtns
                }
            }
        ],
        5: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 220,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolName }
                        </span>
                        <ETF v-show={getVal(row.symbolKey, 'etf') === true} />
                    </div>
                </div>),
                slots: {
                    header: headerCommonName
                }
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 150,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_last_price')}
                    </span>
                ),
                slots: {
                    header: headerCommonLasPrice,
                }
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 150,
                formatter: row => (
                    <strong className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        { getVal(row.symbolKey, 'rolling_upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'rolling_upDownAmount') }
                    </strong>
                ),
                slots: {
                    header: headerCommonUpDownAmount
                }

            },
            {
                name: t('trade.changePercent'),
                align: 'left',
                minWidth: 150,
                className: 'upDownWidth',
                formatter: row => (
                    <strong className={unref(productMap)[row.symbolKey]?.rolling_upDownColor}>
                        {getVal(row.symbolKey, 'rolling_upDownWidth')}
                    </strong>
                ),
                slots: {
                    header: headerCommonUpDownWidth,
                }

            },
            {
                name: t('trade.24highPrice'),
                align: 'left',
                minWidth: 150,
                className: 'primaryText',
                formatter: row => getVal(row.symbolKey, 'rolling_high_price')
            },
            {
                name: t('trade.24lowPrice'),
                align: 'left',
                minWidth: 150,
                className: 'primaryText',
                formatter: row => getVal(row.symbolKey, 'rolling_low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                slots: {
                    default: commonBtns
                }
            }
        ]
    }

    return columnsMap[tradeTypeValue]
}
