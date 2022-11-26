import pako from 'pako'

export function randomStr (num) {
    var _num = num || 4
    var _trackArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var _track = ''
    for (var i = 0; i < _num; i++) {
        _track += _trackArr[Math.floor(Math.random() * (_trackArr.length - 1))]
    }
    _track += Date.now()
        .toString()
        .substring(6)
    return _track
}

/**
 *  获取url参数
 *
 * @export
 * @param {string} [character='&'] url路径和参数分割符
 * @param {string} [objChart='='] 参数key-value的分割符
 * @returns {object} 所有参数
 */
export function getQuery (_search = location.search, character = '&', objChart = '=') {
    ; /([^?]+)/.test(decodeURIComponent(_search))
    const result = RegExp.$1
        .split(character)
        .map(str => {
            const [key, val] = str.split(objChart)
            return {
                [key]: val
            }
        })
        .reduce((result, cur) => {
            Object.assign(result, cur)
            return result
        }, {})

    return result
}

/* 获取URL参数 （兼容hash模式） */
export function getQueryString (name, search) {
    search = search || window.location.search.substr(1) || window.location.hash.split('?')[1] || ''
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = search.match(reg)
    if (r != null) return decodeURI(r[2]); return null
}

export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    }) + '-' + Date.now()
}
export function zip (str) {
    const binaryString = pako.gzip(encodeURIComponent(str), { to: 'string' })
    return btoa(binaryString)
}
window.zip = zip
export function unzip (str) {
    let strData = atob(str)
    const charData = strData.split('').map((t) => (t.charCodeAt(0)))
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = handleCodePoints(new Uint16Array(data))
    return decodeURIComponent(strData)
}
window.unzip = unzip
export function handleCodePoints (array) {
    const CHUNK_SIZE = 0x8000 // arbitrary number here, not too small, not too big
    let index = 0
    const length = array.length
    let result = ''
    let slice
    const arr = []
    for (let i = 0, _i = array.length; i < _i; i++) {
        arr[i] = array[i]
    }
    while (index < length) {
        slice = arr.slice(index, Math.min(index + CHUNK_SIZE, length)) // `Math.min` is not really necessary here I think
        result += String.fromCharCode.apply(null, slice)
        index += CHUNK_SIZE
    }
    return result
}
export function localSet (key, val) {
    return localStorage.setItem(key, val)
}
export function localGet (key) {
    return localStorage.getItem(key)
}
export function sessionSet (key, val) {
    return sessionStorage.setItem(key, val)
}
export function sessionGet (key) {
    return sessionStorage.getItem(key)
}
