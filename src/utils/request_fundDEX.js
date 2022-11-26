import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: '', // url = base url + request url
    timeout: 60000 // request timeout
})
service.interceptors.request.use(
    config => {
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
            return Promise.resolve(res)
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
