/* 监听外部窗口传来的postmessage消息服务 */

import { getAuth2Code } from '@/api/auth2'
import { modifybaseURL } from '@/utils/request_auth2'
import { useStore } from 'vuex'

class OnMessage {
    constructor () {
        this.store = useStore()
        this.targetOrigin = '*' // 指定哪些窗口能接收到消息事件
        this.targetWindow = window
        this.msgMap = {} // 接收到的消息列表
        this.code = '' // 授权码
    }

    // 分发处理接受到的消息
    receiveMessage (event) {
        // console.log(event)
        this.targetOrigin = event.origin || event.originalEvent?.origin
        this.targetWindow = event.source.window
        const dataStr = event.data
        let msgData = {}
        try {
            msgData = JSON.parse(dataStr)
        } catch (error) {
            msgData = { data: dataStr }
        }
        this.resolveMsg(msgData)
    }

    resolveMsg (msgData = {}) {
        if (msgData.type === 'cats-init') {
            this.init(msgData.data)
        } else if (msgData.type === 'cats-auth2Code') {
            this.requestAuth2Code(msgData)
        }
    }

    // 初始化环境域名配置
    init (data = {}) {
        if (data.domain) modifybaseURL(data.domain)
    }

    // 获取auth2获取授权码
    requestAuth2Code ({ type, key, data }) {
        if (this.code) {
            this._postMessage(type, key, {
                code: this.code
            })
            return
        }

        // 请求接口获取授权码
        getAuth2Code(data).then(res => {
            this.code = res.data
            this._postMessage(type, key, {
                code: res.data
            })
        }).catch(err => {
            // console.log(err)
            this._postMessage(type, key, { err })
        })
    }

    // 向targetOrigin窗口发送postmessage消息
    _postMessage (type, key, data = {}) {
        const message = {
            type,
            key,
            data
        }
        this.targetWindow.postMessage(JSON.stringify(message), this.targetOrigin)
    }
}

const OnMsg = new OnMessage()

export default function (evt) {
    OnMsg.receiveMessage(evt)
}
