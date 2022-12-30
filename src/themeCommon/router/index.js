import { createRouter, createWebHistory, beforeEnter } from 'vue-router'
import store from '../../store'
const routes = [{

    path: '/login',
    name: 'Login',
    component: () =>
        import(/* webpackChunkName: "login" */ '../user/login/login.vue'),
    meta: {
        title: 'cRoute.login',
        roles: ['Guest'], // Guest 仅游客访问 User 仅登录用户访问
    }

},
{

    path: '/register',
    name: 'Register',
    component: () =>
        import(/* webpackChunkName: "login" */ '../user/register/register.vue'),
    meta: {
        title: 'cRoute.register',
        roles: ['Guest'],
    }

},
{
    path: '/appRegister',
    name: 'AppRegister',
    component: () => import(/* webpackChunkName: "login" */ '../user/register/appRegister.vue'),
    meta: {
        title: 'cRoute.register',
        roles: ['Guest'],
    }
},
{
    path: '/register/success',
    name: 'RegisterSuccess',
    component: () =>
        import(/* webpackChunkName: "register" */ '../user/register/registerSuccess.vue'),
    meta: {
        title: 'cRoute.registerSuccess'
    }
},
{
    path: '/register/handler',
    name: 'RegisterHandler',
    component: () =>
        import(/* webpackChunkName: "Register" */ '../user/register/registerHandler.vue'),
    meta: {
        title: 'route.registerHandler',
        roles: [],
    }
},
{
    path: '/forgot',
    name: 'Forgot',
    component: () =>
        import(/* webpackChunkName: "forgot" */ '../user/forgot/forgot.vue'),
    meta: {
        title: 'cRoute.forgot'
    }
},
{
    path: '/resetLoginPwd',
    name: 'ResetLoginPwd',
    component: () =>
        import(/* webpackChunkName: "resetPwd" */ '../user/forgot/resetLoginPwd.vue'),
    meta: {
        title: 'cRoute.resetPwd'
    }
},
{
    path: '/resetFundPwd',
    name: 'ResetFundPwd',
    component: () =>
        import(/* webpackChunkName: "resetPwd" */ '../user/forgot/resetFundPwd.vue'),
    meta: {
        title: 'cRoute.resetPwd'
    }
},
{
    path: '/resetSuccess',
    name: 'ResetSuccess',
    component: () =>
        import(/* webpackChunkName: "resetSuccess" */ '../user/forgot/resetSuccess.vue'),
    meta: {
        title: 'cRoute.resetPwdSuccess'
    }
},
{
    path: '/resetFail',
    name: 'ResetFail',
    component: () =>
        import(/* webpackChunkName: "resetFail" */ '../user/forgot/resetFail.vue'),
    meta: {
        title: 'cRoute.resetPwdFaid'
    }
},
{
    path: '/regKyc',
    name: 'RegKyc',
    component: () =>
        import(/* webpackChunkName: "regKyc" */ '../user/register/regKyc.vue'),
    meta: {
        title: 'cRoute.regKyc'
    }
},
{
    path: '/withdrawAccount',
    name: 'WithdrawAccount',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/withdraw/withdrawAccount.vue'),
    meta: {
        title: 'cRoute.withdrawAccount',
        footerMenu: false,
    }
},
{
    path: '/depositChoose',
    name: 'DepositChoose',
    component: () =>
        import(/* webpackChunkName: "deposit" */ '@/themeCommon/user/deposit/choose.vue'),
    meta: {
        title: 'cRoute.deposit',
        footerMenu: false,
    }
},
{
    path: '/withdrawMoney',
    name: 'WithdrawMoney',
    component: () =>
        import(/* webpackChunkName: "withdraw" */ '../user/withdraw/withdrawMoney.vue'),
    meta: {
        title: 'cRoute.withdraw',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/withdrawCoin',
    name: 'WithdrawCoin',
    component: () =>
        import(/* webpackChunkName: "withdraw" */ '../user/withdraw/withdrawCoin.vue'),
    meta: {
        title: 'cRoute.withdraw',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/withdrawRedeem',
    name: 'WithdrawRedeem',
    component: () =>
        import(/* webpackChunkName: "withdraw" */ '../user/withdraw/withdrawRedeem.vue'),
    meta: {
        title: 'cRoute.withdraw',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/pay8Account',
    name: 'Pay8Account',
    component: () =>
        import(/* webpackChunkName: "withdraw" */ '../user/withdraw/pay8Account.vue'),
    meta: {
        title: 'cRoute.withdraw',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/pay8Bank',
    name: 'Pay8Bank',
    component: () =>
        import(/* webpackChunkName: "withdraw" */ '../user/withdraw/pay8Bank.vue'),
    meta: {
        title: 'cRoute.withdraw',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/withdrawRecord',
    name: 'WithdrawRecord',
    component: () =>
        import(/* webpackChunkName: "withdrawRecord" */ '../user/withdraw/withdrawRecord.vue'),
    meta: {
        title: 'cRoute.withdrawRecord',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/walletAddress',
    name: 'WalletAddress',
    component: () =>
        import(/* webpackChunkName: "walletAddress" */ '../user/walletAddress.vue'),
    meta: {
        title: 'cRoute.walletAddress',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/walletAdd',
    name: 'WalletAdd',
    component: () =>
        import(/* webpackChunkName: "walletAdd" */ '../user/walletAdd.vue'),
    meta: {
        title: 'cRoute.walletAdd',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/addBank',
    name: 'AddBank',
    component: () =>
        import(/* webpackChunkName: "addBank" */ '../user/addBank.vue'),
    meta: {
        title: 'cRoute.addBank',
        footerMenu: false,
        roles: ['User'],
    }
},
{
    path: '/msg',
    name: 'Msg',
    component: () =>
        import(/* webpackChunkName: "msg" */ '../user/msg.vue'),
    meta: {
        title: 'cRoute.msg',
        footerMenu: false,
        // keepAlive: true,
        // roles: ['User'],
    }
},
{
    path: '/noticeDetail',
    name: 'NoticeDetail',
    component: () =>
        import(/* webpackChunkName: "msg" */ '../user/noticeDetail.vue'),
    meta: {
        title: 'route.noticeTitle',
        footerMenu: false,
        // roles: ['User'],
    }
},
{
    path: '/fundLog',
    name: 'FundLog',
    component: () =>
        import(/* webpackChunkName: "fundDetail" */ '../user/fundLog.vue'),
    meta: {
        title: 'cRoute.fundLog',
        footerMenu: false,
        roles: ['User']
    }
},
// {
//     path: '/fund',
//     name: 'Fund',
//     component: () => import(/* webpackChunkName: "fundDetail" */ '../user/fund.vue'),
//     meta: {
//         title: 'cRoute.fund',
//         footerMenu: false,
//         roles: ['User']
//     }
// },
{
    path: '/personal',
    name: 'Personal',
    component: () =>
        import(/* webpackChunkName: "personal" */ '../user/personal.vue'),
    meta: {
        title: 'cRoute.personal',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/authentication',
    name: 'Authentication',
    component: () =>
        import(/* webpackChunkName: "authentication" */ '../user/authentication.vue'),
    meta: {
        title: 'cRoute.authentication',
        footerMenu: false,
        roles: ['User']
    },
    beforeEnter: (to, from, next) => {
        next()
    }
},
{
    path: '/authForm',
    name: 'AuthForm',
    component: () =>
        import(/* webpackChunkName: "authentication" */ '../user/authForm.vue'),
    meta: {
        title: 'cRoute.authForm',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/bankList',
    name: 'BankList',
    component: () =>
        import(/* webpackChunkName: "bankList" */ '../user/bankList.vue'),
    meta: {
        title: 'cRoute.bankList',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/setting',
    name: 'Setting',
    component: () =>
        import(/* webpackChunkName: "bankList" */ '../user/setting.vue'),
    meta: {
        title: 'cRoute.setting',
        footerMenu: false
    }
},
{
    path: '/setLoginPwd',
    name: 'SetLoginPwd',
    component: () =>
        import(/* webpackChunkName: "setLoginPwd" */ '../user/setLoginPwd.vue'),
    meta: {
        title: 'cRoute.setLoginPwd',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/setFundPwd',
    name: 'setFundPwd',
    component: () =>
        import(/* webpackChunkName: "setLoginPwd" */ '../user/setFundPwd.vue'),
    meta: {
        title: 'cRoute.setFundPwd',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/page',
    name: 'Page',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/page.vue'),
    meta: {
        title: 'cRoute.page',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/bindMobile',
    name: 'BindMobile',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/bindMobile.vue'),
    meta: {
        title: 'cRoute.bindMobile',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/bindEmail',
    name: 'BindEmail',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/bindEmail.vue'),
    meta: {
        title: 'cRoute.bindEmail',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/kycCommitted',
    name: 'KycCommitted',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/kycCommitted.vue'),
    meta: {
        title: 'cRoute.kycCommitted',
        footerMenu: false,
    }
},
{
    path: '/depositCb',
    name: 'DepositCb',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/deposit/depositCb.vue'),
    meta: {
        title: 'cRoute.depositCb',
        footerMenu: false,
    }
},
{
    path: '/changeBindEmail',
    name: 'ChangeEmail',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/changeBindEmail.vue'),
    meta: {
        title: 'cRoute.changeBindEmail',
        footerMenu: false,
    }
},
{
    path: '/changeBindMobile',
    name: 'ChangeMobile',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/changeBindMobile.vue'),
    meta: {
        title: 'cRoute.changeBindMobile',
        footerMenu: false,
    }
},
{
    path: '/chartSetting',
    name: 'ChartSetting',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/chartSetting.vue'),
    meta: {
        title: 'cRoute.chartSetting',
        footerMenu: false,
    }
},
{
    path: '/chooseAccount',
    name: 'chooseAccount',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/chooseAccount.vue'),
    meta: {
        title: 'cRoute.chooseCurrency',
        footerMenu: false,
    }
},
{
    path: '/faceDetect',
    name: 'FaceDetect',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/faceDetect.vue'),
    meta: {
        title: 'faceAuth.faceDetect',
        footerMenu: false,
    }
},
{
    path: '/securitySetting',
    name: 'SecuritySetting',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/securitySetting.vue'),
    meta: {
        title: 'cRoute.securitySetting',
        footerMenu: false,
        roles: ['User']
    }
},
{
    path: '/commonSetting',
    name: 'CommonSetting',
    component: () =>
        import(/* webpackChunkName: "page" */ '../user/commonSetting.vue'),
    meta: {
        title: 'cRoute.commonSetting',
        footerMenu: false,
    }
},
{
    path: '/googleMFA/status',
    name: 'MFA_status',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/google_MFA/status.vue'),
    meta: {
        title: 'cRoute.MFA_status',
        roles: ['User'],
    }
},
{
    path: '/googleMFA/install',
    name: 'MFA_install',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/google_MFA/install.vue'),
    meta: {
        title: 'cRoute.MFA_status',
        roles: ['User'],
    }
},
{
    path: '/googleMFA/secretKey',
    name: 'MFA_secretKey',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/google_MFA/secretKey.vue'),
    meta: {
        title: 'cRoute.MFA_bind',
        roles: ['User'],
    }
},
{
    path: '/googleMFA/bind',
    name: 'MFA_bind',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/google_MFA/bind.vue'),
    meta: {
        title: 'cRoute.MFA_bind',
        roles: ['User'],
    }
},
{
    path: '/invite',
    name: 'Invite',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/invite/invite.vue'),
    meta: {
        title: 'cRoute.invite'
    }
},
{
    path: '/invite/rule',
    name: 'rule',
    component: () =>
        import(/* webpackChunkName: "google_MFA" */ '../user/invite/rule.vue'),
    meta: {
        title: 'cRoute.rule'
    }
},
{
    path: '/apiManage/create',
    name: 'Api_create',
    component: () =>
        import(/* webpackChunkName: "api_Manage" */ '../user/api_Manage/create.vue'),
    meta: {
        title: 'api.createHeader'
    }
},
{
    path: '/apiManage/edit',
    name: 'Api_edit',
    component: () =>
        import(/* webpackChunkName: "api_Manage" */ '../user/api_Manage/edit.vue'),
    meta: {
        title: 'api.editHeader'
    }
},

]

export default routes
