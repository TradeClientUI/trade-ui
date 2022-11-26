import { createRouter, createWebHistory } from 'vue-router'
import { delayAwait, getToken, getCookie } from '@/utils/util'
import store from '../store'
import routes from './routes'

const lang = getCookie('lang') || 'zh-CN'
const basePath = '/' + (location.pathname.split('/')[1] || lang) + '/'
const router = createRouter({
    history: createWebHistory(basePath),
    scrollBehavior: () => ({ top: 0 }),
    routes
})

router.beforeEach((to, from, next) => {
    const token = getToken()
    const keepAlive = to.meta?.keepAlive ?? false
    const query = to.query
    const nocache = query.hasOwnProperty('nocache') && !query.nocache ? true : query.nocache
    if (keepAlive && nocache) {
        store.commit('del_cacheViews', to.name)
    }
    const roles = to.meta?.roles ?? []
    const customerInfo = store.state._user.customerInfo
    const unKYCPages = ['Authentication', 'Home', 'Register', 'RegisterSuccess', 'RegKyc', 'AddBank', 'Personal', 'AuthForm', 'BankList', 'Setting', 'KycCommitted']
    if (customerInfo && customerInfo?.kycAuditStatus !== 2 && to.name && unKYCPages.indexOf(to.name) === -1) {
        // 未审核通过的用户直接跳转到KYC页面
        next('/home/authentication')
    } else if (token && roles.length && roles.includes('Guest')) {
        // 仅游客访问，登录用户访问时跳转到行情页面
        next({ name: 'Quote' })
    } else if (!token && roles.length && roles.includes('User')) {
        // 仅登录用户访问，游客访问时跳转到登录页面
        next({ name: 'Login', query: { back: encodeURIComponent(to.fullPath) } })
    } else if (token && store.state._user.loginLoading) {
        delayAwait(() => {
            return !store.state._user.loginLoading
        }).then(next)
    } else {
        next()
    }
})
router.afterEach((to, from) => {
    const keepAlive = to.meta?.keepAlive ?? false
    if (keepAlive) {
        store.commit('add_cacheViews', to.name)
    }
})
export default router
