import pako from 'pako'
import { toFixed, mul } from '@/utils/calculation'
import { priceFormat } from '@/utils/util'

export function tickFormat (data) {
    data.symbolKey = `${data.symbol_id}_${data.trade_type}`
    data.symbolId = parseInt(data.symbol_id)
    const digits = data.price_digits
    if (digits) {
        const tick_deep = data.tick_deep || []
        tick_deep.forEach(el => {
            el.price_ask = toFixed(el.price_ask, digits)
            el.price_bid = toFixed(el.price_bid, digits)
        })
        const firstTick = tick_deep[0] || {}
        data.close_price = toFixed(data.close_price, digits)
        data.high_price = toFixed(data.high_price, digits)
        data.low_price = toFixed(data.low_price, digits)
        data.open_price = toFixed(data.open_price, digits)
        data.cur_price = toFixed(data.price, digits)
        data.sell_price = toFixed(firstTick.price_bid, digits)
        data.buy_price = toFixed(firstTick.price_ask, digits)
        if (data.yesterday_close_price) data.yesterday_close_price = toFixed(data.yesterday_close_price, digits)
    }

    return data
}

export function ungzip (blod) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // const startTime = Date.now()
        reader.onload = () => {
            const charData = reader.result.split('').map(x => x.charCodeAt(0))
            const data = pako.inflate(new Uint8Array(charData))
            let strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            const chunk = 8 * 1024
            let i
            const uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            const result = JSON.parse(decodeURIComponent(strData))
            resolve(result)
        }
        reader.readAsBinaryString(blod)
        reader.onerror = () => reject()
    })
}

// 实时行情tick字符串转Object对象
export function tickToObj (p) {
    const priceStr = p.split(';')[0].match(/\((.+)\)/)
    const price = priceStr[1] ?? ''
    const priceArr = price.split(',')

    const curPriceData = {
        symbolKey: `${priceArr[0]}_${priceArr[1]}`,
        symbolId: priceArr[0] * 1,
        trade_type: priceArr[1],
        tick_time: priceArr[4] * 1,
        cur_price: priceArr[5],
        sell_price: priceArr[6],
        buy_price: priceArr[7],
    }
    return curPriceData
}
// 实时24H行情tick字符串转Object对象
// pr(symbol_id,trade_type,trade_mode,rolling_last_price,rolling_first_price,rolling_high_price,rolling_low_price,rolling_transactions_number,rolling_amount);
// pr(产品ID，报价交易类型，成交模式，24小时里最后一口价，24小时里第一口价，24小时里最高价，24小时里最低价，24小时成交量，24小时成交金额);
export function tick24HToObj (pMultiple) {
    const resultArr = pMultiple.split(';').filter(p => p).map(p => {
        const str = p.match(/\((.+)\)/)
        const price = str[1] ?? ''
        const priceArr = price.split(',')
        const priceData = {
            symbol_id: parseInt(priceArr[0]),
            trade_type: parseInt(priceArr[1]),
            trade_mode: parseInt(priceArr[2]),
            symbolKey: `${priceArr[0]}_${priceArr[1]}`,
            symbolId: parseInt(priceArr[0]),
            rolling_last_price: priceArr[3],
            rolling_first_price: priceArr[4],
            rolling_high_price: priceArr[5],
            rolling_low_price: priceArr[6],
            rolling_transactions_number: priceArr[7],
            rolling_amount: priceArr[8],
        }
        return priceData
    })
    return resultArr
}

// 账户持仓浮动盈亏tick字符串转Object对象
export function positionsTickToObj (str) {
    const dataArr = str.split(';')
    const accountData = dataArr[0].match(/\((.+)\)/)[1].split(',')
    const positionsProfitLoss = dataArr.slice(1).map(el => {
        const elData = el.replace(/\(|\)/g, '').split(',')
        return {
            positionId: elData[0], // 持仓id
            profitLoss: elData[1] < 0 ? elData[1] : '+' + elData[1], // 盈亏
            previewStopPrice: elData[2], // 预估强平价
            riskStatus: elData[6] // 风险状态
        }
    })
    const result = {
        content: {
            availableMargin: accountData[2],
            balance: accountData[5],
            marginRadio: accountData[3],
            netWorth: accountData[4],
            occupyMargin: accountData[1],
            profitLoss: accountData[0],
            riskStatus: accountData[6],
            closePositionProportion: toFixed(mul(accountData[7], 100), 2),
            earlyWarningProportion: toFixed(mul(accountData[8], 100), 2),
            positionProfitLossMessages: positionsProfitLoss,
            withdrawAmount: accountData[9]
        }
    }
    return result
}

/** 格式化产品订阅数据列表
 *  productIds: symbolKey形式的数组 ['1_2','2_2']
 */
export function formatSubscribe (productIds, productMap) {
    if (!productIds || productIds.length === 0) return []
    productIds = productIds.filter(el => {
        if (!el) {
            return false
        } else if (typeof (el) === 'string') {
            return !!productMap[el]?.dealMode
        } else if(el.dealMode) {
            return true
        } else {
            return !!productMap[`${el.symbolId}_${el.tradeType}`]?.dealMode
        }
    })
    let subscribedList = []
    if (typeof (productIds[0]) === 'number') {
        console.warn('产品报价订阅的参数格式错误')
        return []
    }
    if (typeof (productIds[0]) === 'string' && productIds[0].includes('_')) {
        subscribedList = [...new Set(productIds)].map(el => {
            const data = el.split('_')
            const product = productMap[el]
            return {
                symbol_id: Number(data[0]),
                trade_type: Number(data[1]),
                trade_mode: product?.dealMode,
            }
        })
    } else {
        const symbolKeys = productMapToSymbolKey(productIds)
        return formatSubscribe(symbolKeys, productMap)
    }
    return subscribedList
}
/** 格式化产品订阅数据列表
 *  productIds: object的形式：[{symbol_id: "37", trade_type: 3}]
 */
export function productMapToSymbolKey (productMaps = []) {
    const symbolKey = new Set()
    if (!productMaps || productMaps.length === 0) return []
    productMaps.forEach(el => {
        const symbol_id = el.symbol_id || el.symbolId
        const trade_type = el.trade_type || el.tradeType
        symbolKey.add(`${symbol_id}_${trade_type}`)
    })
    return [...symbolKey]
}
