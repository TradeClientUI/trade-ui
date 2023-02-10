import axios from 'axios'
import CheckAPI from './checkAPI'
import { login } from '@/api/user'
import { guid, getLoginParams, getToken, removeLoginParams, getCookie, localRemoveKey } from '@/utils/util'
import { encryptParams } from '@/utils/requestEncrypt'
import { apiDomain } from '@/config'
let router = null
export const setRouter = r => (router = r)

let store = null
export const setStore = s => (store = s)

let pk = null
export const setPk = s => (pk = s)

// const baseURL = 'http://18.162.240.170:10000/cats-gateway'
const realApiDomain = apiDomain && apiDomain.startsWith('http') ? apiDomain : apiDomain
const baseURL = `${realApiDomain}/cats-gateway`
const development = process.env.NODE_ENV === 'development'

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
        const token = getToken()
        const timestamp = Date.now()
        config.toastErr = config.toastErr ?? true
        headers.trace = pk ? 'x-' + guid() : guid()
        headers.timestamp = timestamp
        headers.lang = getCookie('lang')
        if (token) headers.token = token
        headers.companyId = companyId
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data

            if (!config.isUpload) {
                // config.data = Object.assign({}, postData)
                if (development) { console.warn('%c 请求原参数 %c ' + config.url, 'background-color:#5e5', 'background-color:#fe6', config.data) }
                config.data = pk ? { data: encryptParams(config.data, timestamp, pk) } : Object.assign({}, postData)
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
        // token失效重新登录
        const loginParams = getLoginParams()
        const routeName = router?.currentRoute?.value?.name
        const switchAccounting = store.state._user.switchAccounting
        // const isUserRoute = router?.currentRoute?.value?.meta?.roles?.includes('User')
        if (!switchAccounting && ['GATEWAY_CODE_001', 'GATEWAY_CODE_005'].includes(data.code) && router && routeName && routeName !== 'Login') {
            localRemoveKey('mockAccount', 'accountType')
            removeLoginParams()
            let backPath = location.pathname.split('/')
            backPath.splice(1, 1)
            backPath = backPath.join('/')
            router.push({ name: 'Login', query: { back: encodeURIComponent(backPath + location.search) } }).then(() => {
                location.reload()
            })
            // return login(loginParams).then(res => {
            //     setToken(res.data.token)
            //     config.headers.token = res.data.token
            //     return service({ ...config, data: JSON.parse(config.data) })
            // })
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

// 修改请求地址
export const modifybaseURL = (baseURL) => {
    console.log(baseURL)
    if (development) baseURL = '/api'
    service.defaults.baseURL = baseURL + '/cats-gateway'
}

export default service
