import request from '@/utils/request'

/* 获取公司列表 */
export function getCompanyList (data = {}) {
    return request({
        url: '/global/admin.app.AppCompanyService.listAll',
        method: 'post',
        data
    })
}

/* 获取公司资产列表 */
export function getCompanyAssets (data) {
    return request({
        url: '/global/config.app.AppAssetsDubboService.getAssetsList',
        method: 'post',
        data
    })
}

/* 获取所有可设置的下单执行标准的产品 */
export function getAllOrderProducts (data) {
    return request({
        url: '/global/fund.app.FundsOrderExecuteStandardService.getOrderExecuteStandardConfigSymbolList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取下单执行标准 */
export function getOrderStandard (data) {
    return request({
        url: '/global/fund.app.FundsOrderExecuteStandardService.getOrderExecuteStandardConfigs',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 保存下单执行标准 */
export function saveOrderStandard (data) {
    return request({
        url: '/global/fund.app.FundsOrderExecuteStandardService.saveOrderExecuteStandardConfigs',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-查询基金产品申购列表 */
export function getFundApplyList (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.page',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-获取基金产品申购执行信息 */
export function getFundApplyInfo (data) {
    return request({
        url: '/global/fund.app.FundsApplyExecuteService.getFundsApplyExecuteInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-确认基金产品申购执行 */
export function confirmFundApply (data) {
    return request({
        url: '/global/fund.app.FundsApplyExecuteService.confirmFundsApplyExecuteInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-查询基金产品赎回列表 */
export function getFundRedeemList (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.queryManagerPage',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-获取基金产品赎回总金额 */
export function getFundRedeemMoney (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.calShares',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理-确认基金产品赎回 */
export function confirmFundRedeem (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.checkShares',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}
/* 基金相关接口 */

/* 基金详情 */
export function getFundInfo (data) {
    return request({
        url: '/global/config.app.AppSymbolDubboService.getFundInfo',
        method: 'post',
        data
    })
}

/* 分页获取基金产品列表 */
export function findFundPage (data) {
    return request({
        url: '/global/config.app.AppSymbolDubboService.findFundPage',
        method: 'post',
        data
    })
}

/* 分页获取基金产品列表（带实时信息） */
export function findFundPageRealTime (data) {
    return request({
        url: '/global/config.app.AppSymbolDubboService.findFundPageWithRealTimeInfo',
        method: 'post',
        data
    })
}

/* 基金净值涨跌比 */
export function fundNetValueChangeQuote (data) {
    return request({
        url: '/global/report.app.ReportDatadDubboService.fundNetValueChangeQuote',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 客户赎回基金 */
export function fundRedeem (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.createFundRedeem',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 客户申购基金 */
export function fundApply (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.apply',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 客户申购-计算手续费、份额 */
export function fundCalcApplyShares (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.calcApplyShares',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 客户获取基金申购列表 */
export function fundApplyRecord (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.customerPage',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 查询基金赎回列表 */
export function fundRedeemRecord (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.page',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 分页获取基金管理手续费列表 */
export function getManagementFeesList (data) {
    return request({
        url: '/global/fund.app.FundManagementFeesAppDubboService.page',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金管理费 手动扣费 */
export function getManagementFeesDeduct (data) {
    return request({
        url: '/global/fund.app.FundManagementFeesAppDubboService.deduct',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金管理费 计算总和 */
export function getManagementFeesCalc (data) {
    return request({
        url: '/global/fund.app.FundManagementFeesAppDubboService.calcDeduct',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取指数样本 基金净值涨跌比 */
export function getIndexSample (data) {
    return request({
        url: '/global/report.app.ReportDatadDubboService.indexSample',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取指数单资产表现柱状图 */
export function getIndexSimplePerformance (data) {
    return request({
        url: '/global/report.app.ReportDatadDubboService.indexSimplePerformance',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 基金经理 获取一篮子资产列表 */
export function getFundCurrencyList (data) {
    return request({
        url: '/global/fund.app.FundApplyAppDubboService.getFundCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 根据提按号获取赎回的金额、手续费等信息 */
export function getFundRedeemCurrencyList (data) {
    return request({
        url: '/global/fund.app.FundRedeemAppDubboService.getFundRedeemCurrencyList',
        method: 'post',
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* 基金经理获取基金产品详情 */
export function getFundInfoByCustomerNo (data = {}) {
    return request({
        url: '/global/config.app.AppSymbolDubboService.getFundInfoByCustomerNo',
        method: 'post',
        headers: {},
        data
    })
}

/* AAVE市场基金列表 */
export function marketList_AAVE (data) {
    return request({
        url: '/global/fundmarket.app.FundMarketAppService.marketList',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* AVVE市场基金详情 */
export function marketDetail_AVVE (data) {
    return request({
        url: '/global/fundmarket.app.FundMarketAppService.marketDetail',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}

/* AVVA市场基金历史行情 */
export function ratesHistory_AVVE (data) {
    return request({
        url: '/global/fundmarket.app.FundMarketAppService.ratesHistory',
        method: 'post',
        toastErr: false,
        headers: {
            version: '0.0.1'
        },
        data
    })
}
