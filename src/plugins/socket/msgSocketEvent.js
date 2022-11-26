import { guid, getDevice, getToken } from '@/utils/util'
import { positionsTickToObj } from './socketUtil'

// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.seq_id = 0
        this.timeOut = 60 * 1000
        this.timer = null
        this.$store = null
        this.$router = null
        this.requests = new Map()
        this.subscribedList = []
        this.loginStatus = 0 // websocket登录状态， 0未登录 1登录中 2已登录
        this.connectNum = 0 // websocket链接连接次数
        this.preSetTime = 1 // 上一次保存价格的时间
        this.newPrice = {}
        this.newPriceTimer = null
    }

    // 初始化
    init (ws, $store, $router) {
        this.ws = ws
        this.$store = $store
        this.$router = $router
    }

    // ws发送数据格式
    getParam (msgType, data = {}) {
        this.seq_id++
        const token = getToken()
        const param = {
            head: {
                msgType,
                token,
                sendTime: Date.now(),
                lang: 'zh-CN',
            },
            data,
            device: getDevice(),
            seqId: this.seq_id,
            trace: guid(),
        }

        return param
    }

    // 发送消息
    send (msgType, data, timeOut) {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        const param = this.getParam(msgType, data)
        this.ws.send(JSON.stringify(param))

        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const nowTime = new Date().getTime()
                this.requests.forEach((item, key, map) => {
                    // 请求超时
                    if (nowTime - item.sendTime > item.timeOut) {
                        item.reject({
                            errorType: 'TimeOut',
                            remark: `timeOut: seq_id-${item.request.seq_id}, msgType-${item.request.msgType}`
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

    // 收取到消息
    onMessage (data) {
        this.requests.forEach((item, key) => {
            if (data.seq_id === key) {
                item.resolve(data)
            }
        })
        const msgCode = data.msgCode
        if (typeof (this[msgCode]) === 'function') {
            this[msgCode](data)
        }
    }

    // 登录
    login () {
        if (this.loginStatus !== 0) return false
        this.loginStatus = 1
        return this.send('login')
    }

    // 登出
    logout () {
        return this.send('logout')
    }

    // 跳转到登录页面刷新
    handlerLogout () {
        return this.$store.dispatch('_user/logout').then(() => {
            return this.$router.push('/login')
        }).then(() => {
            location.reload()
        })
    }

    // 新增订阅动作，如果websocket已经建立好，则直接请求，否则先缓存在subscribedList中
    subscribedListAdd (fn) {
        if (this.ws.readyState === 1) {
            fn && fn()
        } else {
            this.subscribedList.push(fn)
        }
    }

    // websocket连接成功
    onOpen () {
        const token = getToken()
        this.connectNum++
        if (token) this.login() // 重连后自动登录
        const executeFn = () => {
            const fn = this.subscribedList.shift()
            fn && fn()
            if (this.subscribedList.length) executeFn()
        }
        executeFn()
    }

    // websocket 断开
    onDisconnect () {
        this.loginStatus = 0
    }

    // websocket 登录成功
    subscribe_success () {
        this.loginStatus = 2
    }

    // websocket 登录登录失败，登录失败只能是token失效，这时可直接给用户退出登录
    subscribe_fail () {
        this.handlerLogout()
    }

    // 心跳机制
    initPing () {
        const ws = this.ws
        if (ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', ws.readyState)
        let param = this.getParam('ping')
        // ws.send(JSON.stringify(param))
        if (this.ping) clearInterval(this.ping)
        this.ping = setInterval(() => {
            param = this.getParam('ping')
            if (ws.readyState === 1) ws.send(JSON.stringify(param))
        }, 30000)
    }

    // 处理玩法1CFD全仓的：持仓盈亏浮动数据和账户数据
    positionsTick (str, tradeType) {
        // f(profitLoss,occupyMargin,availableMargin,marginRadio,netWorth,balance);(positionId,profitLoss);(positionId,profitLoss);(positionId,profitLoss)
        if (this.newPriceTimer) clearTimeout(this.newPriceTimer)
        const curPriceData = positionsTickToObj(str)
        if (!this.newPrice[tradeType]) this.newPrice[tradeType] = []
        const newPrice = this.newPrice[tradeType]
        const now = new Date().getTime()
        if (this.preSetTime + 125 <= now) { // 控制计算频率
            this.preSetTime = now
            newPrice.push(curPriceData)
            this.floatProfitLoss(newPrice, tradeType)
            this.newPrice[tradeType] = []
        } else {
            newPrice.push(curPriceData)
        }

        // 500毫秒后更新最后一组报价数据
        this.newPriceTimer = setTimeout(() => {
            if (newPrice.length > 0) {
                this.floatProfitLoss(newPrice, tradeType)
                this.newPrice[tradeType] = []
            }
        }, 500)
    }

    floatProfitLoss (dataArr, tradeType) {
        const $store = this.$store
        if (!dataArr?.length) return false
        const last = dataArr[dataArr.length - 1]
        $store.commit('_user/Update_accountAssets', { tradeType, data: last.content })
        dataArr.forEach(({ content }) => {
            if (content.positionProfitLossMessages.length > 0) {
                $store.commit('_trade/Update_positionProfitLossList', { tradeType, list: content.positionProfitLossMessages })
            }
        })
    }

    // 处理异地登录踢出
    disconnect (data) {
        document.body.dispatchEvent(new Event('GotMsg_disconnect'))
    }

    // 消息通知
    notice (data) {
        const { tradeType, updateType, show, bizType } = data.content
        // 刷新字段：updateType
        // NO_MOVEMENT(0 ,"无动作"),
        // POSITION(1 ,"刷新仓位"),
        // ORDER(2 ,"刷新挂单"),
        // AMOUNT(3 ,"刷新资金"),
        // LOGOUT(4 ,"踢出"),
        // POSITION_AND_ORDER(5, "同时刷新挂单、仓位"),
        // POSITION_AND_ORDER(6, "同时刷新挂单、资金"),
        const store = this.$store
        const accountIds = store.state._user.customerInfo?.accountList.filter(el => el.tradeType === Number(tradeType)).map(el => el.accountId)
        if (updateType === 1) {
            store.dispatch('_trade/queryPositionPage', {
                tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
            })
        } else if (updateType === 2) {
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                accountIds: accountIds + ''
            })
            store.dispatch('_trade/tradeRecordList')
        } else if (updateType === 3 && [3, 5, 9].includes(tradeType)) {
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType })
        } else if (updateType === 4) {
            setTimeout(() => {
                this.handlerLogout()
            }, 2000)
        } else if (updateType === 5) {
            store.dispatch('_trade/queryPositionPage', {
                tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
            })
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                accountIds: accountIds + ''
            })
        } else if (updateType === 6) { // 同时刷新资金和委托列表
            if ([3, 5, 9].includes(tradeType)) store.dispatch('_user/queryCustomerAssetsInfo', { tradeType })
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                accountIds: accountIds + ''
            })
        }

        // kyc审核通过或失败刷新客户信息
        if (['AUDIT_CUSTOMER_SUCCESS', 'AUDIT_CUSTOMER_REFUSE'].includes(bizType)) {
            store.dispatch('_user/findCustomerInfo', false)
            store.dispatch('_user/findAllBizKycList')
        }

        // 展示字段：show
        // NO_MOVEMENT(0 ,"无动作"),
        // POPUP(1 ,"弹窗"), // 显示顶部消息
        if (show === 1) {
            const event = new CustomEvent('GotMsg_notice', { detail: data })
            document.body.dispatchEvent(event)
        }
    }

    // 踢出消息
    UserForceLogoutRet () {
        const detail = {}
        document.body.dispatchEvent(new CustomEvent('GotMsg_UserForceLogoutRet', { detail }))
    }

    // 订阅资产数据
    subscribeAsset (tradeTypes) {
        this.subscribedListAdd(() => {
            this.send('subscribe_asset', {
                tradeTypes
            })
        })
    }

    // 取消订阅资产数据
    cancelSubscribeAsset (tradeTypes = '1,2') {
        this.subscribedListAdd(() => {
            this.send('cancel_subscribe_asset', {
                tradeTypes
            })
        })
    }
}

export default SocketEvent
