import { Dialog } from 'vant'
import { checkUserKYC } from '@/utils/util'

let router = null
let store = null
let I18n = null

export default {
    install: (app, { $store, $router, $I18n } = {}) => {
        router = $router
        store = $store
        I18n = $I18n
        const findCustomerInfo = () => {
            return store.dispatch('_user/findCustomerInfo').then(res => {
                if (typeof (res.check) === 'function' && res.check()) {
                    checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
                }
                return res
            })
        }
        app.config.globalProperties.$findCustomerInfo = findCustomerInfo
    }
}
