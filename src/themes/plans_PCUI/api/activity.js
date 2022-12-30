import request from './request_activity'
import { rsaSign } from '../utils/setSign'

/* 注册 */
export function activityRegister (data) {
    console.log('---调用注册接口activityRegister----')
    let sign = ''
    try {
        sign = rsaSign(data.customerNo, data.timestamp)
        console.log('create sign success  by activityRegister')
    } catch (error) {
        console.log('create sign fail by activityRegister')
        return false
    }
    return request({
        url: '/app/recommended/customer/register',
        method: 'post',
        data: {
            ...data,
            sign: sign
        }
    })
}

/* 获取返佣总揽数据 */
export function commissionSummary (data) {
    let sign = ''
    try {
        sign = rsaSign(data.customerNo, data.timestamp)
        console.log('create sign success by commissionSummary')
    } catch (error) {
        console.log('create sign fail ')
        return false
    }
    return request({
        url: '/app/activity/fission/commissionSummary',
        method: 'post',
        data: {
            ...data,
            sign: sign
        }
    })
}

/* 返佣记录列表 */
export function commissionRecords (data) {
    let sign = ''
    try {
        sign = rsaSign(data.customerNo, data.timestamp)
        console.log('create sign success  by activityRegister')
    } catch (error) {
        console.log('create sign fail by activityRegister')
        return false
    }
    return request({
        url: '/app/activity/fission/commissionRecords',
        method: 'post',
        data: {
            ...data,
            sign: sign
        }
    })
}
