import { tickFormat, tickToObj, tick24HToObj, formatSubscribe } from './socketUtil'
import { guid } from '@/utils/util'
import { mul } from '@/utils/calculation'

// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.seq_id = 0
        this.timeOut = 60 * 1000
        this.timer = null
        this.$store = null
        this.requests = new Map()
        this.subscribedMap = {} // 根据不同模块增量订阅
        this.subscribed24HMap = {} // 根据不同模块增量订阅24H
        this.subscribedList = [] // 上一次报价订阅记录
        this.subscribed24HList = [] // 上一次报价订阅记录
        this.subscribeDeal = [] // 上一次盘口订阅记录
        this.preSetTime = 1 // 上一次保存价格的时间
        this.newPrice = []
        this.newPriceTimer = null
    }

    // 初始化
    init (ws, $store) {
        this.ws = ws
        if ($store) this.$store = $store
    }

    // ws发送数据格式
    getParam (cmd_id, data) {
        this.seq_id++
        const param = {
            cmd_id,
            data,
            seq_id: this.seq_id, // 发送端的索引编号，类型：uint32
            ext: guid(), // track 跟踪号，类型：string，谁请求，谁生成，回包的ext也不变，每次请求就要变化，最大长度64
        }
        return param
    }

    // 发送消息
    send (cmd_id, data, timeOut) {
        if (this.ws.readyState !== 1) return console.warn('行情websocket连接未准备好  readyState：', this.ws.readyState)
        const param = this.getParam(cmd_id, data)
        this.ws.send(JSON.stringify(param))
        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const nowTime = new Date().getTime()
                this.requests.forEach((item, key, map) => {
                    // 请求超时
                    if (nowTime - item.sendTime > item.timeOut) {
                        item.reject({
                            errorType: 'TimeOut',
                            remark: `timeOut: seq_id-${item.request.seq_id}, cmd_id-${item.request.cmd_id}`
                        })
                        this.requests.delete(key)
                    }
                })
                if (this.requests.size === 0) {
                    window.clearInterval(this.timer)
                    this.timer = null
                }
            }, 500)
        }
        return new Promise((resolve, reject) => {
            this.requests.set(param.seq_id, {
                sendTime: Date.now(),
                timeOut: timeOut ?? this.timeOut,
                request: param,
                resolve,
                reject,
            })
        })
    }

    /* 订阅产品报价 支持两种数据格式，
    * symbolKey的形式：['1_2','2_2']
    * object的形式：[{symbol_id: "37", trade_type: 3}]
    */
    send_subscribe (productIds = []) {
        if (!productIds || productIds.length === 0) return false
        const productMap = this.$store.state._quote.productMap

        // 拿到产品精简信息后，根据交易模式进行订阅产品行情
        this.$store.dispatch('_quote/querySymbolBaseInfoList', null).then((res) => {
            this.subscribedList = productIds
            const subscribeList = formatSubscribe(productIds, productMap)
            this.send(14000, { symbol_list: subscribeList })
        })
    }

    /* 24小时滚动报价订阅 支持两种数据格式，
    * symbolKey的形式：['1_2','2_2']
    * object的形式：[{symbol_id: "37", trade_type: 3}]
    */
    send_subscribe24H (productIds = []) {
        if (!productIds || productIds.length === 0) return false
        const productMap = this.$store.state._quote.productMap

        // 拿到产品精简信息后，根据交易模式进行订阅产品行情
        this.$store.dispatch('_quote/querySymbolBaseInfoList', null).then((res) => {
            this.subscribed24HList = productIds
            const subscribeList = formatSubscribe(productIds, productMap)
            this.send(14016, { symbol_list: subscribeList, update_speed: 1000 })
        })
    }

    /** 增量订阅产品
        @param Object {} 需要订阅的数据, moduleId 模块ID，symbolKeys 模块ID里面需要订阅的产品
     */
    add_subscribe ({ moduleId, symbolKeys }) {
        this.subscribedMap[moduleId] = symbolKeys
        const symbolkeyAll = Object.values(this.subscribedMap).flat()
        this.send_subscribe(symbolkeyAll)

        // 返回取消改模块订阅的方法
        const del_subscribe = () => {
            delete this.subscribedMap[moduleId]
        }
        return del_subscribe
    }

    /** 增量订阅24H的产品
        @param Object {} 需要订阅的数据, moduleId 模块ID，symbolKeys 模块ID里面需要订阅的产品
     */
    add_subscribe24H ({ moduleId, symbolKeys }) {
        this.subscribed24HMap[moduleId] = symbolKeys
        const symbolkeyAll = Object.values(this.subscribed24HMap).flat()
        this.send_subscribe24H(symbolkeyAll)

        // 返回取消改模块订阅的方法
        const del_subscribe = () => {
            delete this.subscribed24HMap[moduleId]
            if (Object.keys(this.subscribed24HMap).length === 0) {
                this.cancel_subscribe(3)
            }
        }
        return del_subscribe
    }

    /** 删除订阅产品
        @param Object {} 需要删除订阅的数据, moduleId 模块ID
     */
    del_subscribe (moduleId) {
        return delete this.subscribedMap[moduleId]
    }

    /** 删除订阅24H的产品
        @param Object {} 需要删除订阅的数据, moduleId 模块ID
     */
    del_subscribe24H (moduleId) {
        return delete this.subscribed24HMap[moduleId]
    }

    // 盘口成交报价订阅
    deal_subscribe (symbol_id, depth_level = 10, merge_accuracy, trade_type, trade_info_count = 20) {
        this.$store.commit('_quote/Delete_dealList') // 删除成交数据
        this.$store.commit('_quote/Delete_handicapList') // 删除盘口数据
        const productMap = this.$store.state._quote.productMap
        this.$store.dispatch('_quote/querySymbolBaseInfoList', null).then(() => {
            const product = productMap[`${symbol_id}_${trade_type}`]
            this.subscribeDeal = [{ symbol_id, depth_level, merge_accuracy, trade_type, trade_info_count, trade_mode: product.dealMode }]
            const list = [{
                symbol_id: Number(symbol_id), // 产品ID ，类型：uint64
                trade_mode: product.dealMode, // 成交模式
                trade_type, // 交易类型，类型：uint32，1：cfd，2：me
                depth_level, // 深度层级，类型：uint32，该字段有效范围1到10之间
                merge_accuracy,
                trade_info_count
            }]
            this.send(14010, { symbol_list: list })
        })
    }

    // 批量产品的K线获取
    batchGetKlineData (list) {
        this.send(14014, { data_list: list })
    }

    // websocket连接成功
    onOpen () {
        if (this.subscribedList.length) this.send_subscribe(this.subscribedList)
        if (this.subscribed24HList.length) this.send_subscribe24H(this.subscribed24HList)
        if (this.subscribeDeal.length) {
            const { symbol_id, depth_level, merge_accuracy, trade_type, trade_info_count, trade_mode } = this.subscribeDeal[0]
            this.deal_subscribe(symbol_id, depth_level, merge_accuracy, trade_type, trade_info_count, trade_mode)
        }
    }

    // 收取到消息
    onMessage (data) {
        this.requests.forEach((item, key) => {
            if (data.seq_id === key) {
                item.resolve(data)
            }
        })
        const cmdID = `cmd_id_${data.cmd_id}`
        if (typeof (this[cmdID]) === 'function') {
            this[cmdID](data)
        }
    }

    // 处理报价快照
    ['cmd_id_14001'] (data) {
        const list = data.data?.tick_list ?? []
        const $store = this.$store
        const newData = list.map(el => tickFormat(el))
        $store.commit('_quote/Update_productTick', newData)
    }

    // 处理24H报价快照
    ['cmd_id_14017'] (data) {
        const list = data.data?.tick_list ?? []
        const $store = this.$store
        const newData = list.map(el => tickFormat(el))
        $store.commit('_quote/Update_productTick24H', newData)
    }

    // 处理盘口成交数据快照
    ['cmd_id_14011'] (data) {
        const list = data.data?.tick_list ?? []
        const $store = this.$store
        if (list) {
            $store.commit('_quote/Update_handicapList', {
                list,
                type: 1
            })
        }

        const lastData = list[0]
        const dealList = list[0]?.trade_info

        if (lastData && dealList.length > 0) {
            dealList.reverse().forEach(el => {
                const dealData = {
                    symbolKey: `${lastData.symbol_id}_${lastData.trade_type}`,
                    symbolId: lastData.symbol_id,
                    dealTime: mul(el.trade_time, 1000),
                    trade_direction: el.trade_direction,
                    price: el.price,
                    volume: el.volume,
                }
                this.$store.commit('_quote/Update_dealList', dealData)
            })
        }
    }

    // 处理批量获取K线数据
    ['cmd_id_14015'] (data) {
        const productMap = this.$store.state._quote.productMap
        const list = data.data?.data_list ?? []
        const that = this
        list.forEach(el => {
            const product = productMap[el.symbol_id + '_' + el.trade_type]
            product.kline_list = el.kline_list.map(el => el.close_price) ?? []
            that.$store.commit('_quote/Update_product', product)
        })
    }

    // 实时报价
    tick (p) {
        // p(symbol_id,trade_type,trade_mode,seq,tick_time,price,price_bid1,price_ask1,volume_bid1,volume_ask1);
        // p(产品ID，报价交易类型，成交模式，报价序号，报价时间戳，当前价，第一档bid价，第一档ask价, 第一档bid量, 第一档ask量);

        if (this.newPriceTimer) clearTimeout(this.newPriceTimer)
        const $store = this.$store
        const curPriceData = tickToObj(p)
        const now = new Date().getTime()
        if (this.preSetTime + 125 <= now) {
            this.preSetTime = now
            this.newPrice.push(curPriceData)
            $store.commit('_quote/Update_productTick', this.newPrice)
            this.newPrice = []
        } else {
            this.newPrice.push(curPriceData)
        }

        // 500毫秒后更新最后一组报价数据
        this.newPriceTimer = setTimeout(() => {
            if (this.newPrice.length > 0) {
                $store.commit('_quote/Update_productTick', this.newPrice)
                this.newPrice = []
            }
        }, 500)
    }

    // 24H实时报价
    tick24H (p) {
        // pr(symbol_id,trade_type,trade_mode,rolling_last_price,rolling_first_price,rolling_high_price,rolling_low_price,rolling_transactions_number,rolling_amount);
        // pr(产品ID，报价交易类型，成交模式，24小时里最后一口价，24小时里第一口价，24小时里最高价，24小时里最低价，24小时成交量，24小时成交金额);

        const $store = this.$store
        const curPriceData = tick24HToObj(p)
        $store.commit('_quote/Update_productTick24H', curPriceData)
    }

    // 实时成交数据
    deal_tick (p) {
        const priceStr = p.split(';')[0].match(/\((.+)\)/)
        const price = priceStr[1] ?? ''
        const priceArr = price.split(',')
        const [{ symbol_id, trade_type }] = this.subscribeDeal // 订阅的产品数据
        // console.log(symbol_id, trade_type)
        // 如果推送的是当前订阅的产品，则使用改数据
        if (parseInt(symbol_id) === parseInt(priceArr[0]) && parseInt(trade_type) === parseInt(priceArr[1])) {
            const dealData = {
                symbolKey: `${priceArr[0]}_${priceArr[1]}`,
                symbolId: priceArr[0],
                dealTime: priceArr[4],
                trade_direction: priceArr[7], // Math.floor(Math.random() * 2) + 1,
                price: priceArr[5], // priceArr[4],
                volume: priceArr[6] // priceArr[5]

            }
            this.$store.commit('_quote/Update_dealList', dealData)
        }
    }

    // 实时盘口深度报价
    handicap_tick (p) {
        const result = p.split(';')
        const tickList = {
            bid_deep: [],
            ask_deep: []
        }

        if (result.length > 2) {
            const bidList = result[1].match(/[^\\(\\)]+(?=\))/g)
            if (bidList && bidList.length > 0) {
                bidList.forEach(item => {
                    const bidOjb = {}
                    bidOjb.price_bid = item.split(',')[0]
                    bidOjb.volume_bid = item.split(',')[1]
                    tickList.bid_deep.push(bidOjb)
                })
            }

            const askList = result[2].match(/[^\\(\\)]+(?=\))/g)
            if (askList && askList.length > 0) {
                askList.forEach(item => {
                    const askOjb = {}
                    askOjb.price_ask = item.split(',')[0]
                    askOjb.volume_ask = item.split(',')[1]
                    tickList.ask_deep.push(askOjb)
                })
            }

            this.$store.commit('_quote/Update_handicapList', {
                tickList,
                type: 2
            })
        }
    }

    // 取消订阅
    cancel_subscribe (cancel_type = 0) {
        this.send(14006, { cancel_type })
    }

    // 心跳机制
    initPing () {
        const ws = this.ws
        if (ws.readyState !== 1) return console.warn('quote websocket连接未准备好  readyState：', ws.readyState)
        if (this.ping) clearInterval(this.ping)
        this.ping = setInterval(() => {
            const param = this.getParam(14008, {})
            if (ws.readyState === 1) ws.send(JSON.stringify(param))
            else if (ws.readyState !== 0) {
                console.warn('quote websocket断开 readyState：', ws.readyState)
                // 如果3s后还没有连接上，重新发起行情连接
                setTimeout(() => {
                    if (this.ws.readyState !== 0 && this.ws.readyState !== 1) ws.open()
                }, 3000)
            } else {
                console.warn('quote websocket断开 readyState：', ws.readyState)
            }
        }, 10000)
    }
}

export default SocketEvent
