import { getErrorMessage, logMessage, } from './helpers';
import { HistoryProvider, } from './history-provider';
import { DataPulseProvider } from './data-pulse-provider';
import { QuotesPulseProvider } from './quotes-pulse-provider';
import { SymbolsStorage } from './symbols-storage';
import { resolutionToKlineType } from '../../userConfig/config.js'

function extractField(data, field, arrayIndex) {
    var value = data[field];
    return Array.isArray(value) ? value[arrayIndex] : value;
}
/**
 * This class implements interaction with UDF-compatible datafeed.
 * See UDF protocol reference at https://github.com/tradingview/charting_library/wiki/UDF
 */
var UDFCompatibleDatafeedBase = /** @class */ (function () {
    function UDFCompatibleDatafeedBase(datafeedURL, quotesProvider, requester, updateFrequency, otherConfig) {
        var _this = this;
        if (updateFrequency === void 0) { updateFrequency = 10 * 1000; }
        this.otherConfig = otherConfig || {} // 传入其他配置
        this._configuration = defaultConfiguration();
        this._symbolsStorage = null;
        this._datafeedURL = datafeedURL;
        this._requester = requester;
        this._historyProvider = new HistoryProvider(datafeedURL, this._requester);
        this._quotesProvider = quotesProvider;
        this._dataPulseProvider = new DataPulseProvider(this._historyProvider, updateFrequency);
        this._quotesPulseProvider = new QuotesPulseProvider(this._quotesProvider);
        this._configurationReadyPromise = this._requestConfiguration()
            .then(function (configuration) {
            if (configuration === null) {
                configuration = defaultConfiguration();
            }
            _this._setupWithConfiguration(configuration);
        });
    }
    UDFCompatibleDatafeedBase.prototype.onReady = function (callback) {
        var _this = this;
        this._configurationReadyPromise.then(function () {
            callback(_this._configuration);
        });
    };
    UDFCompatibleDatafeedBase.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
        this._quotesProvider.getQuotes(symbols).then(onDataCallback).catch(onErrorCallback);
    };
    UDFCompatibleDatafeedBase.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
        this._quotesPulseProvider.subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid);
    };
    UDFCompatibleDatafeedBase.prototype.unsubscribeQuotes = function (listenerGuid) {
        this._quotesPulseProvider.unsubscribeQuotes(listenerGuid);
    };
    UDFCompatibleDatafeedBase.prototype.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        if (!this._configuration.supports_marks) {
            return;
        }
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            from: from,
            to: to,
            resolution: resolution,
        };
        this._send('marks', requestParams)
            .then(function (response) {
            if (!Array.isArray(response)) {
                var result = [];
                for (var i = 0; i < response.id.length; ++i) {
                    result.push({
                        id: extractField(response, 'id', i),
                        time: extractField(response, 'time', i),
                        color: extractField(response, 'color', i),
                        text: extractField(response, 'text', i),
                        label: extractField(response, 'label', i),
                        labelFontColor: extractField(response, 'labelFontColor', i),
                        minSize: extractField(response, 'minSize', i),
                    });
                }
                response = result;
            }
            onDataCallback(response);
        })
            .catch(function (error) {
            logMessage("UdfCompatibleDatafeed: Request marks failed: " + getErrorMessage(error));
            onDataCallback([]);
        });
    };
    UDFCompatibleDatafeedBase.prototype.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        if (!this._configuration.supports_timescale_marks) {
            return;
        }
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            from: from,
            to: to,
            resolution: resolution,
        };
        this._send('timescale_marks', requestParams)
            .then(function (response) {
            if (!Array.isArray(response)) {
                var result = [];
                for (var i = 0; i < response.id.length; ++i) {
                    result.push({
                        id: extractField(response, 'id', i),
                        time: extractField(response, 'time', i),
                        color: extractField(response, 'color', i),
                        label: extractField(response, 'label', i),
                        tooltip: extractField(response, 'tooltip', i),
                    });
                }
                response = result;
            }
            onDataCallback(response);
        })
            .catch(function (error) {
            logMessage("UdfCompatibleDatafeed: Request timescale marks failed: " + getErrorMessage(error));
            onDataCallback([]);
        });
    };
    UDFCompatibleDatafeedBase.prototype.getServerTime = function (callback) {
        if (!this._configuration.supports_time) {
            return;
        }
        this._send('time')
            .then(function (response) {
            var time = parseInt(response);
            if (!isNaN(time)) {
                callback(time);
            }
        })
            .catch(function (error) {
            logMessage("UdfCompatibleDatafeed: Fail to load server time, error=" + getErrorMessage(error));
        });
    };
    UDFCompatibleDatafeedBase.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
        if (this._configuration.supports_search) {
            var params = {
                limit: 30 /* SearchItemsLimit */,
                query: userInput.toUpperCase(),
                type: symbolType,
                exchange: exchange,
            };
            this._send('search', params)
                .then(function (response) {
                if (response.s !== undefined) {
                    logMessage("UdfCompatibleDatafeed: search symbols error=" + response.errmsg);
                    onResult([]);
                    return;
                }
                onResult(response);
            })
                .catch(function (reason) {
                logMessage("UdfCompatibleDatafeed: Search symbols for '" + userInput + "' failed. Error=" + getErrorMessage(reason));
                onResult([]);
            });
        }
        else {
            if (this._symbolsStorage === null) {
                throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)');
            }
            this._symbolsStorage.searchSymbols(userInput, exchange, symbolType, 30 /* SearchItemsLimit */)
                .then(onResult)
                .catch(onResult.bind(null, []));
        }
    };
    UDFCompatibleDatafeedBase.prototype.resolveSymbol = function (symbolName, onResolve, onError, extension) {
        logMessage('Resolve requested');
        var currencyCode = extension && extension.currencyCode;
        var resolveRequestStartTime = Date.now();
        function onResultReady(symbolInfo) {
            logMessage("Symbol resolved: " + (Date.now() - resolveRequestStartTime) + "ms");
            onResolve(symbolInfo);
        }

        // 这里需要异步返回结果
        setTimeout(() => {
            onResultReady({
                ...querySymbolInfo(symbolName, this.otherConfig.symbolInfo),
            })
        }, 0)
        return
        // if (!this._configuration.supports_group_request) {
        //     var params = {
        //         symbol: symbolName,
        //     };
        //     if (currencyCode !== undefined) {
        //         params.currencyCode = currencyCode;
        //     }
        //     this._send('symbols', params)
        //         .then(function (response) {
        //         if (response.s !== undefined) {
        //             onError('unknown_symbol');
        //         }
        //         else {
        //             onResultReady(response);
        //         }
        //     })
        //         .catch(function (reason) {
        //         logMessage("UdfCompatibleDatafeed: Error resolving symbol: " + getErrorMessage(reason));
        //         onError('unknown_symbol');
        //     });
        // }
        // else {
        //     if (this._symbolsStorage === null) {
        //         throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)');
        //     }
        //     this._symbolsStorage.resolveSymbol(symbolName, currencyCode).then(onResultReady).catch(onError);
        // }
    };
    UDFCompatibleDatafeedBase.prototype.getBars = function (symbolInfo, resolution, periodParams, onResult, onError) {
        this._historyProvider.getBars(symbolInfo, resolution, periodParams)
            .then(function (result) {
            onResult(result.bars, result.meta);
        })
            .catch(onError);
    };
    UDFCompatibleDatafeedBase.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {
        this._dataPulseProvider.subscribeBars(symbolInfo, resolution, onTick, listenerGuid);
    };
    UDFCompatibleDatafeedBase.prototype.unsubscribeBars = function (listenerGuid) {
        this._dataPulseProvider.unsubscribeBars(listenerGuid);
    };
    UDFCompatibleDatafeedBase.prototype._requestConfiguration = function () {
        return Promise.resolve(otherDefaultConfiguration())
        // const a = {"supports_search":true,"supports_group_request":false,"supports_marks":true,"supports_timescale_marks":true,"supports_time":true,"exchanges":[{"value":"","name":"All Exchanges","desc":""},{"value":"NasdaqNM","name":"NasdaqNM","desc":"NasdaqNM"},{"value":"NYSE","name":"NYSE","desc":"NYSE"},{"value":"NCM","name":"NCM","desc":"NCM"},{"value":"NGM","name":"NGM","desc":"NGM"}],"symbols_types":[{"name":"All types","value":""},{"name":"Stock","value":"stock"},{"name":"Index","value":"index"}],"supported_resolutions":["D","2D","3D","W","3W","M","6M"]}
        // return Promise.resolve(a)
        // return this._send('config')
        //     .catch(function (reason) {
        //     logMessage("UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=" + getErrorMessage(reason));
        //     return null;
        // });
    };
    UDFCompatibleDatafeedBase.prototype._send = function (urlPath, params) {
        return this._requester.sendRequest(this._datafeedURL, urlPath, params);
    };
    UDFCompatibleDatafeedBase.prototype._setupWithConfiguration = function (configurationData) {
        this._configuration = configurationData;
        if (configurationData.exchanges === undefined) {
            configurationData.exchanges = [];
        }
        if (!configurationData.supports_search && !configurationData.supports_group_request) {
            throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
        }
        if (configurationData.supports_group_request || !configurationData.supports_search) {
            this._symbolsStorage = new SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester);
        }
        logMessage("UdfCompatibleDatafeed: Initialized with " + JSON.stringify(configurationData));
    };

    // 用于提供给用户修改产品属性
    UDFCompatibleDatafeedBase.prototype.setSymbolInfo = function(info){
        this.otherConfig.symbolInfo = Object.assign({}, info)
    }

    return UDFCompatibleDatafeedBase;
}());
export { UDFCompatibleDatafeedBase };
function defaultConfiguration() {
    return {
        supports_search: false,
        supports_group_request: true,
        supported_resolutions: [
            '1',
            '5',
            '15',
            '30',
            '60',
            '1D',
            '1W',
            '1M',
        ],
        supports_marks: false,
        supports_timescale_marks: false,
    };
}



function otherDefaultConfiguration() {
    return {
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: [
            '1',
            '5',
            '15',
            '30',
            '60',
            '1D'
        ],
        supports_marks: false,
        supports_timescale_marks: false,
    };
}

/* 商品信息结构 */
function querySymbolInfo (code_id, symbolInfo) {
    if(!code_id){
        console.error('产品symbolId不存在')
    }
    const result = {
        // name: 'asfd',
        // ticker: '888', // 商品代码
        // 'exchange-traded': product.short_name,   不需要这两个字段
        // 'exchange-listed': product.short_name,   不需要这两个字段
        timezone: 'Etc/UTC', // 交易所时区
        minmov: 1, // 最小波动
        minmov2: 0, // 这是一个神奇的数字来格式化复杂情况下的价格
        pointvalue: 1,
        session: '24x7', // 交易时段
        has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
        has_no_volume: false, // 布尔表示商品是否拥有成交量数据
        description: '', // 商品说明。这个商品说明将被打印在图表的标题栏中。
        type: 'stock', // 仪表的可选类型 stock, index, forex, futures, bitcoin,  expression,  spread, cfd 或其他字符串
        supported_resolutions: Object.keys(resolutionToKlineType),
        pricescale: 100000000000000000, // 价格精度
        has_weekly_and_monthly: true, // 允许周期：周/月
        ...normalizeInfo(symbolInfo)
    }

    return result
}


function normalizeInfo(info){
    const result = {
        name: info.description,
        description: info.description,
        symbolId: info.symbolId,
        pricescale:  Math.pow(10, info.digits),
        tradeType: info.tradeType,
        dealMode: info.dealMode,
    }
    return result
}
