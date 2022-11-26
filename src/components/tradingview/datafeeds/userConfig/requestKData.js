import { QuoteSocket } from '@/plugins/socket/socket'
let isLog = true // 是否输出日志

export class RequestKData {
    constructor() {
        // 产品信息
        this._product = {}
    }

    setProduct(productInfo){
        Object.assign(this._product, productInfo)
    }
    getKline(params, firstDataRequest) {
        if (firstDataRequest) {
            // 第一次调用此商品/周期的历史记录
            this.setProduct({
                symbolId: params.symbolId,
                klineType: params.klineType,
                tradeType: params.tradeType,
                trade_mode: params.dealMode,
            })
        }

        const _params = {
            "trade_type": params.tradeType,
            "symbol_id": params.symbolId,
            "trade_mode": params.dealMode,
            "kline_type": params.klineType,
            "kline_timestamp_end": params.endTime,
            "query_kline_num": params.countBack
        }

        return requestKline(_params, 'history')
            .then(res => {
                if(!res.data.bars.length){
                    Object.assign(res.data, {
                        meta: {
                            noData: true
                        }
                    })
                }
                return res.data
            })
    }

    // 请求最新两根数据
    getTwoLines() {
        const params = {
            "trade_type": this._product.tradeType,
            "symbol_id": this._product.symbolId,
            "kline_type": this._product.klineType,
            "query_kline_num": 2,
            "trade_mode": this._product.trade_mode
        }

        return requestKline(params)
            .then(res => {
                return res.data.bars
            })
    }

}


// 历史k线
function requestKline(params, type) {
    return new Promise((resolve) => {
        const fn = () => {
            if (QuoteSocket.ws.readyState === 1) {
                resolve()
            } else {
                setTimeout(fn, 1000)
            }
        }
        fn()
    })
        .then(() => {
            return QuoteSocket.send(14012, params)
                .then(res => {
                    const checkResult = validateRes(res)
                    if (checkResult) {
                        return checkResult
                    }
                    const { kline_list, price_digits } = res.data
                    // const pow = Math.pow(10, price_digits)
                    const bars = kline_list.map(e => ({
                        time: parseFloat(e.timestamp * 1000),
                        close: parseFloat(e.close_price),
                        open: parseFloat(e.open_price),
                        high: parseFloat(e.high_price),
                        low: parseFloat(e.low_price),
                        volume: parseFloat(e.transactions_number),
                    }))

                    return {
                        data: {
                            bars
                        }
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
}

function validateRes(res) {
    if (res.ret !== 200) {
        return {
            bars: [],
            meta: {
                noData: true,
            }
        }
    }
    return null
}





