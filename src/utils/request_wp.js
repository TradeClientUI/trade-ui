import axios from 'axios'
import { CheckAPI_wp } from './checkAPI'
import { getCookie, getQueryString } from '@/utils/util'

// create an axios instance
const service = axios.create({
    baseURL: window.wp_apiPath, // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// request interceptor
service.interceptors.request.use(
    config => {
        const queryLang = getQueryString('lang')
        const lang = getCookie('lang') || queryLang || 'en-US'
        config.baseURL = '/' + lang + config.baseURL
        // do something before request is sent
        config.responseType = config.responseType || ''

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
        return new CheckAPI_wp(response.data)
    },
    error => {
        const data = error.response.data
        const config = error.response.config
        console.log('api error', error.response) // for debug
        return Promise.reject(error)
    }
)

export default service
