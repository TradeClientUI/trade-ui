import request from '@utils/request'
export function getPageConfig (params) {
    return request({
        url: '/wp-json/wp/v2/vi_page/',
        params,
        method: 'get'
    })
}
export function modifyPageConfig (data) {
    return request({
        url: '/wp-json/wp/v2/vi_page',
        method: 'post',
        data: data
    })
}
export function pageList (data) {
    return request({
        url: '/wp-json/wp/v2/vi_list',
        params: data,
        method: 'get'
    })
}
export function accountGroup (data) {
    return request({
        url: '/wp-json/wp/v2/queryAccountGroup',
        method: 'get'
    })
}
export function querySymbolGroup (data) {
    return request({
        url: '/wp-json/wp/v2/querySymbolGroup',
        method: 'get'
    })
}
export function accountGroupSymbol (id) {
    return request({
        url: '/wp-json/wp/v2/queryAccountGroupSymbol',
        params: {
            accountGroupIds: id
        },
        method: 'get'
    })
}
// 获取玩法板块
export function tradeTypeAccountGroupSymbol () {
    return request({
        url: '/wp-json/wp/v2/queryAllTradeAccountGroupSymbol',
        params: {},
        method: 'get'
    })
}
// 获取玩法账户币种
export function tradeTypeAccountAssets () {
    return request({
        url: '/wp-json/wp/v2/queryAllCatsTradeTypeAssets',
        params: {},
        method: 'get'
    })
}
// 发布
export function pushPage (data) {
    return request({
        url: '/wp-json/wp/v2/pushPage',
        data: data,
        method: 'post'
    })
}
export function getPushPageList (data) {
    return request({
        url: '/wp-json/wp/v2/getPushPageList',
        data: data,
        method: 'post'
    })
}

export function openAccountViewSet () {
    return request({
        url: '/wp-json/wp/v2/openAccountViewSett',
        method: 'get'
    })
}
export function checkEnvironment () {
    return request({
        url: '/wp-json/wp/v2/checkEnvironment',
        method: 'get'
    })
}
export function reloadSymbol () {
    return request({
        url: '/wp-json/wp/v2/reloadSymbol',
        method: 'get'
    })
}
export function reloadAccountGroup () {
    return request({
        url: '/wp-json/wp/v2/reloadAccountGroup',
        method: 'get'
    })
}
export function reloadAccountGroupByGroupId (data) {
    return request({
        url: '/wp-json/wp/v2/reloadAccountGroupByGroupId',
        method: 'get',
        params: data
    })
}

export function reloadSymbolGroup (data) {
    return request({
        url: '/wp-json/wp/v2/reloadSymbolGroup',
        method: 'get',
        params: data
    })
}

export function getInitPageCodeList (data) {
    return request({
        url: '/wp-json/wp/v2/getInitPageCodeList',
        method: 'get',
        params: data
    })
}
export function initPageByPageCode (data) {
    return request({
        url: '/wp-json/wp/v2/initPageByPageCode',
        data: data,
        method: 'post'
    })
}
export function updateDataToH5Index (data) {
    return request({
        url: '/wp-json/wp/v2/updateDataToH5Index',
        method: 'get'
    })
}
export function updateDataToH5IndexView (data) {
    return request({
        url: '/wp-json/wp/v2/updateDataToH5IndexView',
        method: 'get'
    })
}

// 回滚版本
export function rollBackReleasePage (data) {
    return request({
        url: '/wp-json/wp/v2/rollBackReleasePage',
        data: data,
        method: 'post'
    })
}
export function getCompanyInfo (data) {
    return request({
        url: '/wp-json/wp/v2/getCompanyInfo',
        data: data,
        method: 'get'
    })
}

// 获取国家区号列表
export function queryCountryList (data) {
    return request({
        url: '/wp-json/wp/v2/queryCountryList',
        data: data,
        method: 'get'
    })
}

// 获取客户组玩法列表
export function getAccountGroupTradeAssetsList (data) {
    return request({
        url: '/wp-json/wp/v2/getAccountGroupTradeAssetsList',
        data: data,
        method: 'get'
    })
}

// 查询渠道基础配置
export function getViChannel (data) {
    return request({
        url: '/wp-json/wp/v2/vi_channel?id=' + data,
        params: {},
        method: 'get'
    })
}

// 保存渠道基础配置
export function saveViChannel (data) {
    return request({
        url: '/wp-json/wp/v2/vi_channel',
        data: data,
        method: 'post'
    })
}

// 初始化
export function initChannel (data) {
    return request({
        url: '/wp-json/wp/v2/init_channel',
        data: data,
        method: 'post'
    })
}

// 自动同步国家信息
export function reloadCountry (data) {
    return request({
        url: '/wp-json/wp/v2/reloadCountry',
        params: {},
        method: 'get'
    })
}

// 自动同步资产信息
export function reloadCatsTradeTypeAssets (data) {
    return request({
        url: '/wp-json/wp/v2/reloadCatsTradeTypeAssets',
        params: {},
        method: 'get'
    })
}

// 获取支付通道列表
export function queryPaymentArray (data) {
    return request({
        url: '/wp-json/wp/v2/queryPaymentArray',
        params: {},
        method: 'get'
    })
}

// 初始化支付通道
export function reloadPaymentList (data) {
    return request({
        url: '/wp-json/wp/v2/reloadPaymentList',
        params: {},
        method: 'get'
    })
}
