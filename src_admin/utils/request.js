import axios from 'axios'
import { guid } from '@utils/index'
const service = axios.create({
    baseURL: '',
    // baseURL: 'http://wp2.wangzhangshun.com',
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000,
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'authorization': 'Basic YWRtaW46YWExMjM0NTY='
        }
    }
})
// request interceptor
service.interceptors.request.use(
    config => {
        const headers = config.headers
        headers.trace = guid()
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
