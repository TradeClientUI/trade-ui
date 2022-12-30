import request from '@/utils/request'
import { getDevice } from '@/utils/util'

/* 登录 */
export function login (data) {
    if (data.isThird) {
        return request({
            url: '/third/login/customer.app.CustomerThirdLoginService.login',
            method: 'post',
            toastErr: false,
            headers: {
                version: '0.0.1'
            },
            data
        })
    } else {
        return request({
            url: '/login/customer.app.CustomerWebApiService.login',
            method: 'post',
            // toastErr: false,
            headers: {
                version: '0.0.1',
            },
            data: {
                device: getDevice(),
                ...data,
            }
        })
    }
}

/* 登出 */
export function logout (data) {
    return request({
        url: '/logout',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 注册 */
export function register (data) {
    return request({
        url: '/register/customer.app.CustomerWebApiService.register',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1',
        },
        data: {
            registerSource: getDevice(),
            ...data,
        }
    })
}
/* 开交易账户 */
export function openAccount (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.openAccount',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}
/* 检测客户信息是否存在 */
export function checkCustomerExist (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.checkCustomerExist',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data: {
            ...data,
        }
    })
}
/* 查询客户信息 */
export function findCustomerInfo (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.findCustomerInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 找回密码 */
export function findPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.forgetLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 修改密码 */
export function modifyPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.updateLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 创建存款提案 */
export function handleDesposit (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.createDepositProposal',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 创建取款提案 */
export function handleWithdraw (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.createWithdrawProposal',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取取款、提币额度限制配置 */
export function queryWithdrawLimitInfo (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawAmountLimitInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取取款限制配置 */
export function queryWithdrawConfig (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.queryWithdrawLimitConfig',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取客户取款货币对汇率 */
export function queryWithdrawRate (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawExchangeRate',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取所有支付通道列表 */
export function queryAllPayType (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getPayChannelsV2',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data,
        toastErr: false
    })
}

/* 按账户币种获取支付通道列表 */
export function queryPayType (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getPayChannels',
        method: 'post',
        headers: {
            version: '0.0.2',
        },
        data
    })
}

/* 获取pay8支付通道类型 */
export function queryPay8Type (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.queryPayChannelType',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取直充支付通道支持币种信息 */
export function getCryptoBlockchainInfo (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getCryptoBlockchainInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取直充支付钱包地址 */
export function getBindRechargeAddress (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getBindRechargeAddress',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data,
        toastErr: false
    })
}

/* 申请绑定直充支付钱包地址 */
export function applyRechargeBindAddress (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.applyRechargeBindAddress',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取客户存款货币对汇率 */
export function queryDepositExchangeRate (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getDepositExchangeRate',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 查询客户出金银行卡列表 */
export function queryBankList (data) {
    return request({
        url: '/global/customer.app.WithdrawBankWebApiService.bankList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 新增出金银行卡 */
export function addBank (data) {
    return request({
        url: '/global/customer.app.WithdrawBankWebApiService.add',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 新增国际银行卡 */
export function addInternationalBank (data) {
    return request({
        url: '/global/customer.app.WithdrawBankWebApiService.addV1v2v8',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 取款提案列表 */
export function queryWithdrawPageList (data) {
    return request({
        url: '/global/fund.app.CustomerProposalQueryService.queryWithdrawPageList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 存款提案列表 */
export function queryDepositPageList (data) {
    return request({
        url: '/global/fund.app.CustomerProposalQueryService.queryDepositPageList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 资金明细查询 */
export function queryCapitalFlowList (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.queryCapitalFlowList',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

/* 获取取款手续费 */
export function computeWithdrawFee (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.computeWithdrawFee',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置登录密码 */
export function setLoginPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 修改登录密码 */
export function modifyLoginPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.updateLoginPwd',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取指定公司下平台信息列表 */
export function queryPlatFormMessageLogList (data) {
    return request({
        url: '/global/message.app.PlatFormMessageLogApiService.queryPlatFormMessageLogByPage',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 切换交易账户信息 */
export function switchAccount (data) {
    return request({
        url: '/global/switch.trade.account',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 指定客户的身份认证信息 */
export function findAllBizKycList (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.findAllBizKycList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 判断指定KYC等级是否要KYC认证 */
export function findAllLevelKyc (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.findAllLevelKyc',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* KYC证申请 */
export function kycLevelApply (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.kycLevelApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 指定业务场景是否KYC通过 */
export function checkKycApply (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.checkKycApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* KYC业务场景认证申请 */
export function kycApply (data) {
    return request({
        url: '/global/customer.app.KycWebApiService.kycApply',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 绑定手机号码 */
export function bindPhone (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindPhone',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 绑定邮箱 */
export function bindEmail (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindEmail',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 判断用户是否已入金 */
export function judgeIsAlreadyDeposit (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.judgeIsAlreadyDeposit',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询存款提案 */
export function queryDepositProposal (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.queryDepositProposal',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 客户自选产品列表 */
export function queryCustomerOptionalList (data) {
    return request({
        url: '/global/customer.app.CustomerOptionalWebApiService.optionalList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 添加自选 */
export function addCustomerOptional (data) {
    return request({
        url: '/global/customer.app.CustomerOptionalWebApiService.add',
        method: 'post',
        headers: {
            // group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}
/* 批量添加自选 */
export function addCustomerOptionalBatch (data) {
    return request({
        url: '/global/customer.app.CustomerOptionalWebApiService.addBatch',
        method: 'post',
        headers: {
            // group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}

/* 更换手机 */
export function changePhone (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changePhone',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 更换手机 MFA */
export function changePhoneV1v1v2 (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changePhoneV1v1v2',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 更换邮箱 */
export function changeEmail (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changeEmail',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 更换邮箱(MFA) */
export function changeEmailV1v1v2 (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changeEmailV1v1v2',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 检测客户信息是否存在,不需要区号信息 */
export function checkUserStatus (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.checkStatus',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户提现方式 */
export function getWithdrawMethodList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawMethodList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户提币币种和链名称 */
export function getWithdrawCurrencyList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户可用的钱包类提币币种和链名称列表 */
export function getAllWithdrawCurrencyList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getAllWithdrawCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取钱包列表 */
export function getWalletAddressList (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.walletList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 添加钱包 */
export function addWalletAddress (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.add',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 新增钱包(MFA) */
export function addWalletAddressV1v1v2 (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.addV1v1v2',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 删除钱包 */
export function deleteWalletAddress (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.delete',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置默认钱包 */
export function setDefaultWallet (data) {
    return request({
        url: '/global/customer.app.CustomerWalletWebApiService.updateWallet',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询客户总资产信息 */
export function queryCustomerAssetsInfo (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryCustomerAssetsInfo',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    }).catch(err => {
        return {

        }
    })
}

/* 查询账户资产信息 */
export function queryAccountAssetsInfo (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryAccountAssetsInfo',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

// 手动还款
export function manualRepayment (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.manualRepayment',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

// 修改仓位占用保证金
export function updateOccupyTheMargin (data) {
    return request({
        url: '/global/tradeapi.app.PositionApiService.updateOccupyTheMargin',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        toastErr: false,
        data
    })
}

// 获取下单还币汇率(杠杆)
export function previewOrder (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.previewOrder',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

// 下单还币(杠杆)
export function addRepaymentOrder (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.addRepaymentOrder',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

// 手动借款
export function manualLoan (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.manualLoan',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询借还款流水列表 */
export function queryLiabilitiesWaterByPage (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryLiabilitiesWaterByPage',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 成交记录 */
export function tradeRecordList (data) {
    return request({
        url: '/global/tradeapi.app.OrderApiService.queryTradeRecordPage',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}

/* 取款货币列表 */
export function withdrawCurrencyList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.withdrawCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 资金划转 */
export function capitalTransfer (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.capitalTransfer',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 划转记录 */
export function capitalTransferRecord (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.capitalTransferRecord',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 实时账户资金信息 */
export function queryAccountById (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryAccountById',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}
/* 批量增加玩法账户信息 */
export function increasAccount (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.openAccount',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询客户总资产 */
export function queryCustomerAssets (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.queryCustomerAssets',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 谷歌登录token校验 */
export function googleLoginVerify (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.googleVerify',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 谷歌登录校验token有效性 */
export function facebookLoginVerify (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.facebookVerify',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* twitter登录校验token有效性 */
export function twitterLoginVerify (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.twitterVerify',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* apple登录token校验 */
export function appleLoginVerify (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.appleVerify',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* telegram 登录校验token有效性 */
export function telegramLoginVerify (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.telegramVerify',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 第三方登录 */
export function thirdLogin (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.login',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 第三方注册 */
export function thirdRegist (data) {
    return request({
        url: '/third/login/customer.app.CustomerThirdLoginService.register',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置资金密码 */
export function bindAssertsPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.bindAssertsPwd',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}
/* 修改资金密码 */
export function updateAssertsPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.updateAssertsPwd',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 忘记资金密码 */
export function forgetAssertsPwd (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.forgetAssertsPwd',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 忘记资金密码 MFA */
export function forgetAssertsPwdV1v1v2 (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.forgetAssertsPwdV1v1v2',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户支持的存款币种列表 */
export function getDepositCoinList (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getDepositCoinList',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户支持的取款账户币种列表 */
export function getWithdrawAccountCurrencyList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.getWithdrawAccountCurrencyList',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 检测客户是否开启GoogleMFA */
export function checkGoogleMFAStatus (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.checkGoogleMFAStatus',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}
/* 生成谷歌验证账号 */
export function generateGoogleAccount (data) {
    return request({
        url: '/global/customer.app.GoogleVerifyApiService.generateGoogleAccount',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 谷歌验证码绑定与解除 */
export function enableOrForbidMFA (data) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.enableOrForbidMFA',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 保存用户扩展信息 */
export function saveCustomerExtend (data) {
    return request({
        url: '/global/customer.app.CustomerExtendWebApiService.saveCustomerExtend',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询用户扩展信息 */
export function findCustomerExtend (data) {
    return request({
        url: '/global/customer.app.CustomerExtendWebApiService.findCustomerExtend',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户API列表 */
export function getCustomerApiList (data) {
    return request({
        url: '/global/customer.app.CustomerApiWebService.page',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 创建客户API */
export function createCustomerApi (data) {
    return request({
        url: '/global/customer.app.CustomerApiWebService.applyApi',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取客户API详情 */
export function createCustomerApiDetail (data) {
    return request({
        url: '/global/customer.app.CustomerApiWebService.queryApi',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 删除客户API */
export function delCustomerApi (data) {
    return request({
        url: '/global/customer.app.CustomerApiWebService.delApi',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 编辑客户API保存 */
export function editCustomerApiSave (data) {
    return request({
        url: '/global/customer.app.CustomerApiWebService.editApiPermission',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取个人消息列表 */
export function getCustomerMsgList (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.customerViewMsgPage',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取个人消息详情 */
export function getCustomerMsgDetail (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.customerViewMsgDetail',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取公告列表 */
export function getNoticeList (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.customerViewNoticePage',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 设置消息已读 */
export function setMsgReaded (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.msgRead',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 消息全部已读 */
export function setMsgAllReaded (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.msgAllRead',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取公告详情 */
export function getNoticeDetail (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.customerViewNoticeDetail',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取公告弹窗 */
export function getNoticePop (data) {
    return request({
        url: '/global/message.app.CompanyNoticeApiService.customerViewNoticePopup',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 查询第三方取款银行列表（pay8） */
export function queryPayWithdrawBankList (data) {
    return request({
        url: '/global/fund.app.WithdrawAppDubboService.queryPayWithdrawBankList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取MC900收银台地址 */
export function queryMC900Url (data) {
    return request({
        url: '/global/fund.app.DepositMc900AppDubboService.getCashierUrl',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 获取支付通道支持的账户币种信息列表 */
export function getDepositAccountCurrencyList (data) {
    return request({
        url: '/global/fund.app.DepositAppDubboService.getDepositAccountCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 真实模拟账户切换 */
export function switchUserAccount (data) {
    return request({
        url: '/thirdExt/switchAccount',
        method: 'post',
        data
    })
}

// 重置模拟账户
export function resetAccount (data) {
    return request({
        url: '/global/customer.app.CustomerDubboApiService.resetAccount',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}
