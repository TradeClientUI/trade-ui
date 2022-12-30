import request from '@/utils/request_information'

export const baseLangURL = {
    // 1 中国大陆地区 2 非中国大陆地区
    1: {
        'zh-CN': 'https://prodcn.displore.com.cn', // 中文
        'en-US': 'https://proden.displore.com.cn', // 英文
        'zh-HK': 'https://prodcn.displore.com.cn', // 中文
        'in': 'https://prodin.displore.com.cn', // 印尼
    },
    2: {
        'zh-CN': 'https://abcn.displore.com.cn', // 中文
        'zh-HK': 'https://abcn.displore.com.cn', // 中文
        'en-US': 'https://aben.displore.com.cn', // 英文
        'in': 'https://abin.displore.com.cn', // 印尼
    }
}

export function newsListByType (data, lang = 'en-US', newsArea = 1) {
    const baseURL = baseLangURL[newsArea][lang] || baseLangURL[newsArea]['en-US']
    return request({
        url: baseURL + '/api/article/newsListByType',
        data
    })
}
export function newsListByTypeByPage (data, lang = 'en-US', newsArea = 1) {
    const baseURL = baseLangURL[newsArea][lang] || baseLangURL[newsArea]['en-US']
    return request({
        url: baseURL + '/api/article/newsListByTypeByPage',
        data
    })
}
export function canlendarListByDate (data, lang = 'en-US', newsArea = 1) {
    const baseURL = baseLangURL[newsArea][lang] || baseLangURL[newsArea]['en-US']
    return request({
        url: baseURL + '/api/canlendar/listByDate',
        data
    })
}
export function articleDetail (data, lang = 'en-US', newsArea = 1) {
    const baseURL = baseLangURL[newsArea][lang] || baseLangURL[newsArea]['en-US']
    return request({
        url: baseURL + '/api/article/detail',
        data
    })
}
