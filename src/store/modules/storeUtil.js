import BigNumber from 'bignumber.js'

/** 价格转点数  点数=价差/（Point*大点比率）
 * 点差小数位显示规则：
    根据大点比率进行显示，大点比率的值一般为1（10的0次方）、10（10的1次方）、100（10的2次方）、1000（10的3次方）
    则点差的小数位分别对应为0位、1位、2位、3位
    例如：EURUSD卖价：1.19323 ，买价：1.19341，大点比率为10，则点差=（1.19341-1.19323）/10*0.00001=1.8
 */
export function priceToPip (price, product) {
    if (product && product.hasOwnProperty('pointRatio')) {
        const spDigit = String(product.pointRatio || 0).length - 1 // 点差小数位
        const pip = BigNumber(0.1).pow(product.price_digits).times(product.pointRatio) // 1pip=point*大点比率
        if (!parseFloat(pip)) return ''
        return BigNumber(price).div(pip).toFixed(spDigit)
    } else {
        return ''
    }
}

// 根据玩法板块创建产品列表
export function createListByPlans (plans) {
    const planMap = {}
    const symbolList = []
    plans.forEach(symbolKey => {
        const [symbolId, tradeType] = symbolKey.split('_')
        symbolList.push({ symbolId, tradeType, symbolKey })
        if (!planMap[tradeType]) planMap[tradeType] = []
        planMap[tradeType].push(symbolId)
    })
    Object.keys(planMap).forEach(tradeType => {
        planMap[tradeType] = [...new Set(planMap[tradeType])]
    })
    return {
        symbolList,
        planMap,
    }
}

// 玩法map数据转换成list数组
export function planMapToArray (params) {
    const result = Object.keys(params).map(tradeType => {
        const symbolList = params[tradeType].symbolList || params[tradeType]
        return {
            symbolIds: symbolList.join(),
            tradeType
        }
    })
    return result
}

// 缓存本次挂单列表、持仓列表的请求参数
export function cachePendingParams (params, cacheConfig) {
    const { tradeType } = params
    const curType = cacheConfig[tradeType]
    if (curType) {
        Object.assign(curType, params)
    } else {
        cacheConfig[tradeType] = params
    }
}
// 玩法列表排序和别名
export function formatPlans (plans) {
    plans.forEach(item => {
        if (item.alias) item.name = item.alias
    })
    plans.sort((a, b) => a.sort - b.sort > 0)
    return plans
}

/* 将当前用户的玩法资产和wp配置的玩法资产对比，找出wp多出的玩法资产
 * @param {Object} customerInfo 登录接口返回的data信息
 * @param {Array} registList wp配置的registList客户组列表以及玩法
*/
export function compareAssets (customerInfo = {}, registList) {
    const { accountList = [], customerGroupId } = customerInfo

    // 用户信息的资产根据玩法tradeType将资产分类
    const userPlans = {}
    if (accountList) {
        accountList.forEach(el => {
            const { currency, tradeType } = el
            if (userPlans[tradeType]) {
                userPlans[tradeType].push(currency)
            } else {
                userPlans[tradeType] = [currency]
            }
        })
    }
    Object.keys(userPlans).forEach(el => {
        userPlans[el] = userPlans[el].sort((a, b) => a && a.localeCompare(b)).join()
    })

    // wp配置的玩法资产
    const defaultGroupConfig = registList.find(el => el.registCountry.isOther)
    const customerGroupConfig = registList.find(el => parseInt(el.customerGroupId) === customerGroupId) || defaultGroupConfig
    const customerGroupConfigPlans = customerGroupConfig.plans.filter(el => [1, 2].indexOf(el.tradeType) === -1).map(el => {
        const { allCurrency, tradeType } = el
        const currencyArray = Array.isArray(allCurrency) ? allCurrency : allCurrency.split(',')
        const allCurrencySort = currencyArray.sort((a, b) => a.localeCompare(b)).join()
        return {
            allCurrency: allCurrencySort,
            tradeType: String(tradeType)
        }
    })

    // 将wp配置的资产和用户信息的资产对比
    let different = false
    if (Object.keys(userPlans).length > customerGroupConfigPlans.length) {
        different = true
    } else {
        customerGroupConfigPlans.forEach(el => {
            const { allCurrency, tradeType } = el // 客户组配置的资产
            const userCurrency = userPlans[tradeType] // 用户资产
            if (!userPlans[tradeType]) {
                return (different = true)
            } else if (!assetsIncludes(userCurrency, allCurrency)) {
                return (different = true)
            }
        })
    }
    return different ? customerGroupConfigPlans : null
}
// 判断a组资产是否包含b组资产的所有成员
function assetsIncludes (a, b) {
    a = a.split(',')
    b = b.split(',')
    return b.every(cur => a.includes(cur))
}

// 处理产品标签
export const fillProductLabel = (product) => {
    const labelsArr = product.labels?.split(',') ?? []
    product.isIndex = labelsArr.includes('index') // 指数产品
    product.isCryptocurrency = labelsArr.includes('cryptocurrency') // 加密货币
    product.isFX = labelsArr.includes('FX') // 外汇产品
    product.isCommodites = labelsArr.includes('commodites') // 商品
}

// 处理成交记录的最新价
export const handlerDealLastPrice = (data, dataPrev, product) => {
    const yesterday_close_price = product.yesterday_close_price
    const upDownAmount = BigNumber(data.price).minus(yesterday_close_price).toFixed(product.symbolDigits) // 涨跌额
    const upDownAmount_pip = priceToPip(upDownAmount, product) // 涨跌额(点)
    const upDownWidthTemp = BigNumber(upDownAmount).div(yesterday_close_price).times(100).toFixed(2)
    const upDownWidth = upDownWidthTemp > 0 ? '+' + upDownWidthTemp + '%' : upDownWidthTemp + '%' // 涨跌幅
    const upDownColor = parseFloat(upDownAmount) === 0 ? 'grayColor' : (parseFloat(upDownAmount) > 0 ? 'riseColor' : 'fallColor')
    const price_color = BigNumber(data.price).eq(dataPrev.price) ? (dataPrev.price_color || 'grayColor') : BigNumber(data.price).lt(dataPrev.price) ? 'fallColor' : 'riseColor'
    return {
        ...data,
        price_color,
        upDownAmount,
        upDownAmount_pip,
        upDownWidth,
        upDownColor,
        price_pre: dataPrev.price,
        // dealTime: "1653963451717"
        // price: "325.33"
        // symbolId: "15"
        // trade_direction: "1"
        // volume: "12.244"
    }
}
