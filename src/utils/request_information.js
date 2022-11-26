import axios from 'axios'
// import { CheckAPI_wp } from './checkAPI'

// create an axios instance
const service = axios.create({
    baseURL: '', // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// request interceptor
service.interceptors.request.use(
    config => {
        config.method = 'POST'
        config.header = {
            ...config.header
        }
        config.data = {
            ...config.data
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            const res = response.data
            return Promise.resolve(res.data)
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
