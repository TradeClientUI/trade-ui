import axios from 'axios'
import CheckAPI from './checkAPI'
import { guid, getCookie } from '@/utils/util'
import { setServiceDate } from '@/components/registerActivity'
import { v4 } from 'uuid'
export const token = v4()
const baseURL = process.env.NODE_ENV === 'development' ? '/activity' : '/api/activity'

// create an axios instance
const service = axios.create({
    baseURL: baseURL, // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request interceptor
service.interceptors.request.use(
    config => {
        const headers = config.headers
        const companyId = sessionStorage.getItem('companyId')
        const timestamp = Date.now()
        config.toastErr = config.toastErr ?? true
        headers.trace = guid()
        headers.timestamp = timestamp
        headers.lang = getCookie('lang')
        headers.token = token
        headers.companyId = companyId
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            if (!postData.timestamp) {
                config.data = Object.assign({ timestamp: new Date().getTime() }, postData)
            }
        }

        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const { data, config } = response
        // 设置获取的服务器时间
        setServiceDate(response.headers.date)
        const result = new CheckAPI(data)
        if (!result.check() && config.toastErr) {
            result.toast()
        }
        return result
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
