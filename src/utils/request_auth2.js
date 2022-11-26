import axios from 'axios'
import CheckAPI from './checkAPI'
import { guid, getToken } from '@/utils/util'

// create an axios instance
const service = axios.create({
    baseURL: 'https://uatauth2.cmfbl.com/cats-gateway-auth2', // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// request interceptor
service.interceptors.request.use(
    config => {
        const headers = config.headers
        const token = getToken()
        if (token) headers.token = token
        headers.trace = guid()

        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            config.data = Object.assign({}, postData)
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
        // if the custom code is not 20000, it is judged as an error.
        return new CheckAPI(response.data)
    },
    error => {
        // const data = error.response.data
        // const config = error.response.config
        console.log('api error', error.response) // for debug
        return Promise.reject(error)
    }
)

// 配置不同环境的请求地址
export const modifybaseURL = (domain) => {
    service.defaults.baseURL = domain + '/cats-gateway-auth2'
}

export default service
