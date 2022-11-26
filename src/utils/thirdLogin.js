/*
    处理三方登录
*/

import { googleLoginVerify, thirdRegist, thirdLogin } from '@/api/user'
// 处理与cats系统交互
export function handleCBLogin (id_token) {
    console.log('login come in ')
    store.commit('_user/Update_loginLoading', true)
    googleLoginVerify({
        idToken: id_token,
        companyId: companyId.value
    }).then(res => {
        store.commit('_user/Update_loginLoading', false)
        if (res.check()) {
            var { action } = res.data
            state.userId = res.data.userId
            state.thirdSource = res.data.thirdSource

            if (action === 'register') {
                state.bindAddShow = true
            } else if (action === 'login') {
                handleThirdLogin()
            } else if (action === 'bind') {
                Dialog.confirm({
                    title: t('tip'),
                    message: '您的谷歌邮箱已注册了账号，请登录账号',
                    confirmButtonText: t('common.sure'),
                    cancelButtonText: t('common.cancel')
                }).then(() => {
                    router.push({
                        path: '/login',
                        query: {
                            bindThirdUserId: state.userId,
                            thirdSource: state.thirdSource
                        }
                    })
                }).catch(() => {})
            }
        }
    }).catch(err => {
        state.loading = false
    })
}
