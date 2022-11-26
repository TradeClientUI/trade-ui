import pako from 'pako'

export const mobileReg = /^(13|14|15|16|17|18|19)\d{9}$/
export const emailReg = new RegExp('^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$')
export const bankNoReg = /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/

export const randomId = () => {
    const r = Math.random() + Math.random() + Math.random()
    return r.toString().slice(2)
}

export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    }) + '-' + Date.now()
}

// Gzip解压 对应wp接口数据
window['unzip'] = unzip
export function unzip (str) {
    let strData = atob(str)
    const charData = strData.split('').map((t) => (t.charCodeAt(0)))
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = String.fromCharCode.apply(null, new Uint16Array(data))
    strData = decodeURIComponent(strData)
    try {
        console.warn('解压字符', JSON.parse(strData))
    } catch (error) {}
    return strData
}
window['zip'] = zip
// Gzip数据压缩
export function zip (str) {
    var binaryString = pako.gzip(encodeURIComponent(str), { to: 'string' })
    return btoa(binaryString)
}
// 获取设备类型
export function getDevice () {
    let openFrom = 1 // h5
    const checkUA = navigator.userAgent.match(/(\(.+?\))/)
    if (!checkUA) {
        openFrom = 1 // H5
    } else if (/iPhone/i.test(checkUA[0])) {
        openFrom = 1 // H5
    } else if (/windows/i.test(checkUA[0])) {
        openFrom = 4 // PCUI_Windows
    } else if (/Mac OS/i.test(checkUA[0])) {
        openFrom = 5 // PCUI_Mac
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        openFrom = 6 // APP_Andorid
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        openFrom = 7 // APP_IOS
    } else if (window.JsHook && JsHook.appOpenBrower) {
        openFrom = 2 // H5_Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        openFrom = 3 // H5_IOS
    }
    return openFrom
}

// 获取连接参数
export function getQueryVariable (variable, search = location.search) {
    if (!search) {
        return undefined
    }
    var query = search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return undefined
}

// 获取登录参数
export function getLoginParams () {
    return JSON.parse(localStorage.getItem('loginParams'))
}
// 删除登录参数
export function removeLoginParams () {
    localStorage.removeItem('loginParams')
    sessionStorage.removeItem('token')
}
// 设置登录token
export function setToken (token) {
    return sessionStorage.setItem('token', token)
}
// 获取登录token
export function getToken () {
    return sessionStorage.getItem('token')
}
export function localSet (key, val) {
    return localStorage.setItem(key, val)
}
export function localGet (key) {
    return localStorage.getItem(key)
}
// 获取本地存储json字符串类型
export function localGetJSON (key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key)
        return JSON.parse(value) || defaultValue
    } catch (e) {
        return defaultValue
    }
}
export function localRemove (key) {
    return localStorage.removeItem(key)
}
export function sessionSet (key, val) {
    return sessionStorage.setItem(key, val)
}
export function sessionGet (key) {
    return sessionStorage.getItem(key)
}

// 格式化价格
export function priceFormat (price, digits) {
    const _price = price / Math.pow(10, digits)
    return _price.toFixed(digits)
}

/* 延迟处理 */
let awaitCount = 0
export function delayAwait (fn, reset = true) {
    if (reset) awaitCount = 0
    return new Promise((resolve, reject) => {
        console.log(`>> Await count:: ${awaitCount * 200}ms`)
        const flag = fn()
        if (flag) {
            return resolve(flag)
        } else {
            return awaitCount < 100 ? reject() : resolve()
        }
    }).catch(() => {
        return new Promise(resolve => {
            awaitCount++
            setTimeout(resolve, 200)
        }).then(() => delayAwait(fn, false))
    })
}
/* 延迟一段时间 */
export function delayAwaitTime (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
/* 获取字符长度 */
export const getLen = (str = '') => str.replace(/\p{Unified_Ideograph}/ug, '01').length

/* 判断参数是否为空 */
export function isEmpty (obj) {
    try {
        if (obj == null || obj == undefined) {
            return true
        }
        // 判断数字是否是NaN
        if (typeof obj === 'number') {
            if (isNaN(obj)) {
                return true
            } else {
                return false
            }
        }
        // 判断参数是否是布尔、函数、日期、正则，是则返回false
        if (typeof obj === 'boolean' || typeof obj === 'function' || obj instanceof Date || obj instanceof RegExp) {
            return false
        }
        // 判断参数是否是字符串，去空，如果长度为0则返回true
        if (typeof obj === 'string') {
            if (obj.trim().length == 0) {
                return true
            } else {
                return false
            }
        }

        if (typeof obj === 'object') {
            // 判断参数是否是数组，数组为空则返回true
            if (obj instanceof Array) {
                if (obj.length == 0) {
                    return true
                } else {
                    return false
                }
            }

            // 判断参数是否是对象，判断是否是空对象，是则返回true
            if (obj instanceof Object) {
                // 判断对象属性个数
                if (Object.getOwnPropertyNames(obj).length == 0) {
                    return true
                } else {
                    return false
                }
            }
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

/* 获取数组里面指定key = value的对象 */
export function getArrayObj (arr, key, value) {
    let temp = {}
    if (Array.isArray(arr)) {
        arr.forEach(item => {
            if (String(item[key]) === String(value)) {
                temp = item
            }
        })
    }
    return temp
}

/* 对象排序 */
export function objArraySort (objArr, key) {
    const result = objArr.slice(0)
    return result.sort((a, b) => a[key] - b[key])
}

/* 数组对象排序 */
export function arrayObjSort (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1 < val2) {
            return -1
        } else if (val1 > val2) {
            return 1
        } else {
            return 0
        }
    }
}

/* 检测用户KYC状态 */
export function checkUserKYC ({ res, Dialog, router, store, t }) {
    // 登录KYC,0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
    // companyKycStatus 公司KYC开户状态，1开启 2未开启
    if (Number(res.data.companyKycStatus) === 1) {
        if (Number(res.data.kycAuditStatus === 0)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('login.goAuthenticate'),
                message: t('login.goAuthenticateMsg'),
            }).then(() => {
                return router.push('/home')
            }).then(() => {
                router.push('/home/authentication')
            })
        } else if (Number(res.data.kycAuditStatus === 1)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('common.close'),
                message: t('common.inReview'),
            }).then(() => {
                store.dispatch('_user/logout').then(() => {
                    return router.push('/login')
                }).then(() => {
                    location.reload()
                })
            })
        } else if (Number(res.data.kycAuditStatus === 3)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('common.reSubmit'),
                message: t('common.reviewFailed'),
            }).then(() => {
                return router.push('/home')
            }).then(() => {
                router.push('/home/authentication')
            })
        }
    }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce (func, wait = 200, immediate = false) {
    let timer
    return function (...rest) {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timer = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}

// 返回指定值之间的随机数。不小于 min（有可能等于），并且小于（不等于）max。
export function getRandom (min, max) {
    if (typeof (min) === 'undefined' || typeof (min) === 'undefined') return Math.random()
    return Math.random() * (max - min) + min
}

/*
设置cookie
time 参数
s是指秒 s20代表20秒
h是指小时，如12小时则是：h12
d是天数，30天则：d30
y是年 1年则是 1y
*/
export function setCookie (name, value, time) {
    var strsec = getsec(time)
    var exp = new Date()
    exp.setTime(exp.getTime() + strsec * 1)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

// 读取cookie
export function getCookie (cookName) {
    var cookieStr = document.cookie.split(';')
    for (var i = 0; i < cookieStr.length; i++) {
        var val = cookieStr[i].split('=')

        if (val.length && escape(cookName) === val[0].trim()) { return unescape(val[1]) }
    }
    return null
}

function getsec (str) {
    var str1 = str.substring(1, str.length) * 1
    var str2 = str.substring(0, 1)
    if (str2 === 's') {
        return str1 * 1000
    } else if (str2 === 'h') {
        return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
        return str1 * 24 * 60 * 60 * 1000
    } else if (str2 === 'y') {
        return str1 * 365 * 24 * 60 * 60 * 1000
    }
}

/* 隐藏邮箱 */
export function hideEmailInfo (email) {
    var reg = /(.{1}).+(.{2}@.+)/g
    return email.replace(reg, '$1****$2')
}

/* 隐藏 */
export function hideMobileInfo (mobile) {
    let newMobile = ''
    if (mobile.length > 5) {
        newMobile = mobile.substr(0, 2) + '****' + mobile.substr(mobile.length - 2)
        return newMobile
    } else {
        return mobile
    }
}

function isElement (node) {
    const ELEMENT_NODE_TYPE = 1
    return (
        node.tagName !== 'HTML' &&
        node.tagName !== 'BODY' &&
        node.nodeType === ELEMENT_NODE_TYPE
    )
}
// 获取父层的滚动DOM
export function getScrollParent (el, root) {
    let node = el
    const overflowScrollReg = /scroll|auto/i
    while (node && node !== root && isElement(node)) {
        const { overflowY } = window.getComputedStyle(node)
        if (overflowScrollReg.test(overflowY)) {
            return node
        }
        node = node.parentNode
    }

    return root
}

// 排序
export function compare (property) {
    return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
    }
}

// 处理公告里面的时间标签
export function computeHtmlTime (content) {
    try {
        const reg = /<?time[^>]*>[^<]*<\/time>/gi
        const tag = content.match(reg)
        let returnVal
        if (!isEmpty(tag) && tag.length > 0) {
            tag.forEach(item => {
                returnVal = content.replace(reg, function (matchStr) {
                    const time = matchStr.toString().replace(/<\/?time>/g, '')
                    return window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                })
            })
            return returnVal
        } else {
            return content
        }
    } catch (error) {
        console.log(error)
    }
}

/* 隐藏地址中间部分 */
export function hideWalletMiddleInfo (address) {
    if (!address) return ''
    var reg = /(.{4}).+(.{3}.+)/g
    return address.replace(reg, '$1****$2')
}

/**
 * @desc 获取url参数
 * @param {String} name  想要获取的参数名字
 */
export function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}
