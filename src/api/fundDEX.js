import request from '@/utils/request_fundDEX'
const isProduction = process.env.NODE_ENV === 'production'
const coingockoAPI = isProduction ? '/coingecko' : 'https://api.coingecko.com'
const chain = {
    '1': 'ethereum',
    '137': 'polygon-pos',
}

// coingecko获取各个基金详情，图标、合约地址等
export function getMarketDetail_coingecko (data = {}) {
    return request({
        url: `${coingockoAPI}/api/v3/coins/${data.id}`,
        method: 'GET',
        params: data
    })
}

// coingecko获取基金行情列表，市场
export function getMarketList (data = {}) {
    return request({
        url: `${coingockoAPI}/api/v3/coins/markets`,
        method: 'GET',
        params: data
    })
}

// coingecko获取基金行情价格 统计
export function getMarketChart_coingecko (data = {}) {
    return request({
        url: `${coingockoAPI}/api/v3/coins/${data.id}/market_chart`,
        method: 'GET',
        params: data
    })
}

// 查询ETH价格
export function getETHPrice (data = {}) {
    // 代理地址： https://uatwppc-5.cmfbl.com/coingecko/api/v3/simple/price?ids=ethereum&vs_currencies=usd
    // 原地址： https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
    return request({
        url: `${coingockoAPI}/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
        method: 'GET',
        params: data
    })
}

/**
 * indexcoop获取交易报价
 * @param {Object} data
 * @param {Object} data.chainId 链ID
 * @param {Object} data.sellToken 需要支付的token
 * @param {Object} data.buyToken 需要购买的token
 * @param {Object} data.sellAmount 支付的数量
 * @param {Object} data.slippagePercentage 滑点
 * @param {Object} data.affilliateAddress 保障价格
 * @returns
 */
export function getSwapQuote (data = {}) {
    // https://api.indexcoop.com/0x/polygon/swap/v1/quote?sellToken=MATIC&buyToken=0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369&sellAmount=12000000000000000000&slippagePercentage=0.01&affilliateAddress=0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF
    const url = data.chainId === 1 ? 'https://api.0x.org' : 'https://polygon.api.0x.org'
    delete data.chainId
    return request({
        url: `${url}/swap/v1/quote`,
        method: 'GET',
        params: data
    })
}

/**
 * 查询代币与usd的汇率
 * @param {String, Number} chainId 链ID
 * @param {String} address 代币地址， eth可以直接传ethereum
 * @returns {String}
 */
export function getDaiPrice (chainId, address = 'ethereum') {
    let url = `${coingockoAPI}/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    if (address.toLowerCase() !== 'ethereum') {
        url = `${coingockoAPI}/api/v3/simple/token_price/${chain[chainId]}/?contract_addresses=${address}&vs_currencies=usd`
    }
    return request({
        url: url,
        method: 'GET',
        params: {}
    })
}

/**
 * 获取基金最新价格
 * @param {String, Number} chainId 链ID
 * @param {String} contract_id 地址
 * @returns {String}
 */
export function getFundPrice (chainId, contract_id) {
    return request({
        url: `${coingockoAPI}/api/v3/simple/token_price/${chain[chainId]}/?contract_addresses=${contract_id}&vs_currencies=usd`,
        method: 'GET',
        params: {}
    })
}
