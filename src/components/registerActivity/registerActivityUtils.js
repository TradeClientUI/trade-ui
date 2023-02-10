
// 行情右上角活动提示主动关闭Notification，下次进入不打开
const CLOSE_REGISTER_ACTIVITY_NOTIFICATION = 'CLOSE_REGISTER_ACTIVITY_NOTIFICATION'

// 设置是否显示行情右上角注册活动弹窗
export const closeNotification = (customerNo) => {
    window.sessionStorage.setItem(CLOSE_REGISTER_ACTIVITY_NOTIFICATION + customerNo, 'true')
}

// 清除注册活动弹窗显示隐藏的缓存状态
export const clearCloseNotificationStorage = () => {
    window.sessionStorage.removeItem(CLOSE_REGISTER_ACTIVITY_NOTIFICATION)
}

// 获取是否显示行情右上角注册活动弹窗
export const openNotification = (customerNo) => {
    return window.sessionStorage.getItem(CLOSE_REGISTER_ACTIVITY_NOTIFICATION + customerNo) !== 'true'
}

// 服务器时间缓存key
const RESPONSE_HEADERS_DATE = 'RESPONSE_HEADERS_DATE'
// 获取服务器时间缓存
export const getServiceDate = () => window.sessionStorage.getItem(RESPONSE_HEADERS_DATE)
// 设置服务器时间缓存
export const setServiceDate = (value) => window.sessionStorage.setItem(RESPONSE_HEADERS_DATE, value)
// 活动开启状态
export const REGISTER_ACTIVITY_OPEN_STATUS = 2
