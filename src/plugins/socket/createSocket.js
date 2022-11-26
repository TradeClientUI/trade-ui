import ReconnectingWebSocket from 'reconnectingwebsocket'
export default function (wsURL) {
    const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
    const url = wsURL.startsWith('ws') ? wsURL : protocol + location.host + wsURL
    const ws = new ReconnectingWebSocket(url, null, { automaticOpen: false })
    return ws
}
