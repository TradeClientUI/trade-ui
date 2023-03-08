import axios from 'axios'
import CheckAPI from '../../../utils/checkAPI'
import { v4 } from 'uuid'
import { guid, removeLoginParams, getCookie } from '@/utils/util'
let router = null
export const setRouter = r => (router = r)
export const token = v4()

const companyId = sessionStorage.getItem('companyId')
const development = process.env.NODE_ENV === 'development'

let baseURL = ''
if (companyId === '360') {
    baseURL = 'https://act-pre.jswlr.com' // 360公司的接口地址
} else if (companyId === '368') {
    baseURL = 'https://activity.aatest.online/prod-apis' // 368公司的接口地址
} else if (companyId === '14') {
    baseURL = 'https://ac.Cats.io/prod-apis' // 14公司的接口地址 生产环境
} else if (companyId === '11') {
    baseURL = 'https://act.jswlr.com' // 常用测试的公司
}
// create an axios instance
const service = axios.create({
    baseURL: baseURL, // url = base url + request url
    timeout: 60000, // request timeout
    headers: {}
})

// request interceptor
service.interceptors.request.use(
    config => {
        const headers = config.headers
        const companyId = sessionStorage.getItem('companyId')
        // const timestamp = Date.now()
        // const SysSetting = JSON.parse(window['wp_SysSetting'])
        headers.token = token
        config.toastErr = config.toastErr ?? true
        headers.trace = guid()
        headers.lang = getCookie('lang')
        headers.companyId = companyId
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            if (!config.isUpload) {
                config.data = Object.assign({}, postData)
                if (development) { console.warn('%c 请求原参数 %c ' + config.url, 'background-color:#5e5', 'background-color:#fe6', config.data) }
                // config.data = SysSetting.pk ? { data: encryptParams(config.data, timestamp, SysSetting.pk) } : Object.assign({}, postData)
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
        const routeName = router?.currentRoute?.value?.name
        if (['GATEWAY_CODE_001', 'GATEWAY_CODE_005'].includes(data.code) && router && routeName && routeName !== 'Login') {
            removeLoginParams()
            let backPath = location.pathname.split('/')
            backPath.splice(1, 1)
            backPath = backPath.join('/')
            router.push({ name: 'Login', query: { back: encodeURIComponent(backPath + location.search) } }).then(() => {
                location.reload()
            })
        }

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
