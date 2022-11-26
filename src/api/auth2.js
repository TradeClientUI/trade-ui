
import request from '@/utils/request_auth2'

/* 获取授权码 */
export function getAuth2Code (data) {
    return request({
        url: '/auth2/code',
        method: 'post',
        data
    })
}
