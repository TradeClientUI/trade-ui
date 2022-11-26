import { resolutionToKlineType } from '../../userConfig/config.js'
import {  RequestKData }from '../../userConfig/requestKData'
class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._requestKData = new RequestKData()
        this._onTick = null

        this._previousResolve = () => {}
        // 最近一根k线
        this._previousBar = null
    }
    // 获取历史k线
    async getBars (symbolInfo, resolution, periodParams) {
        const { countBack, firstDataRequest, from, to } = periodParams
        this.symbolParams = {
            symbolId: symbolInfo.symbolId,
            dealMode: symbolInfo.dealMode,
            klineType: resolutionToKlineType[resolution],
            startTime: from,
            endTime: to,
            resolution,
            tradeType: symbolInfo.tradeType,
            countBack: countBack
        }

        if(typeof firstDataRequest === 'boolean'){
            if(firstDataRequest){
                this._previousBar = null
            }
            const barData = await this._requestKData.getKline(this.symbolParams, firstDataRequest)
            if(firstDataRequest && barData.bars.length){
                this._previousBar = barData.bars[barData.bars.length - 1]
            }
            logMessageForKline(barData.bars, this.symbolParams)
            return barData
        }
    }
    // 实时更新k线
    async onTick(price, time, volume=0){
        if(!(this._previousBar && this._onTick)){
            return
        }
        let ticks = []
        const {_previousBar} = this
        if (isSameTime( this.symbolParams.resolution, _previousBar.time, time)) {
            _previousBar.volume = parseFloat(volume) + parseFloat(_previousBar.volume || 0)
            ticks = [
                {
                    time: parseFloat(_previousBar.time),
                    open: _previousBar.open,
                    high: Math.max(_previousBar.high, price),
                    low: Math.min(_previousBar.low, price),
                    close: Number(price),
                    volume: parseFloat(_previousBar.volume),
                }
            ]
        } else {
            ticks = await this.getTick()
        }
        this.updateLastLine(ticks)
    }

    updateLastLine(ticks){
        if(!(this._previousBar && ticks.length && this._onTick)) {
            return
        }
        this._previousBar = ticks[ticks.length-1]
        ticks.forEach(t => this._onTick(t))

        // logMessageForTick(ticks)
    }

    // 用于存储udf获取的tick函数
    setTick(cb){
        this._previousResolve([])
        this._onTick = cb
    }
    // 切换周期却不重新调用getBars时（快速切换周期时，图表会缓存最近几个周期的数据）
    setResolution(resolution){
        this.symbolParams.resolution = resolution
        this._requestKData.setProduct({
            klineType: resolutionToKlineType[resolution]
        })
    }

    // 对异步获取两根K线的包装，方便随时中断操作
    getTick()  {
        this._previousResolve([])
        return new Promise( async(resolve) => {
            this._previousResolve= resolve
            resolve (await this._requestKData.getTwoLines())
        })
    }
}


// 校验两个时间是否属于同一根K线
function isSameTime(resolution, latestTime, tickTime) {
    latestTime = latestTime * 1
    tickTime = tickTime * 1
    if (latestTime > tickTime) return true

    let oldTime = window.dayjs(latestTime)
    let newTime = window.dayjs(tickTime)

    if (/^[0-9]+$/.test(resolution)) {
        // 小于日k
        const oldMinutes = oldTime.hour() * 60 + oldTime.minute()
        const newMinutes = newTime.hour() * 60 + newTime.minute()
        // console.log(oldMinutes, newMinutes)
        return newMinutes - oldMinutes < resolution
    } else {
        switch(resolution){
            case '1D':{
                return oldTime.startOf('day').valueOf() ===newTime.startOf('day').valueOf()
            }
            case '1W':{
                return oldTime.startOf('week').valueOf() ===newTime.startOf('week').valueOf()
            }
            case '1M':{
                return oldTime.startOf('month').valueOf() ===newTime.startOf('month').valueOf()
            }
        }
    }
}

function logMessageForTick(ticks) {
    if (ticks.length === 1) {
        console.groupCollapsed('%c实时报价:⬇', 'color:rgba(0,0,0,0.2)')
    } else {
        console.groupCollapsed('%c获取最新两根数据:⬇', 'color:green')
    }
    console.log(JSON.stringify(ticks), ticks.map(e => window.dayjs(e.time).format('YYYY/MM/DD HH:mm:ss')))
    console.groupEnd()
}

function logMessageForKline(bars, params) {
    if(!bars.length){
        console.log('%c----当前周期的历史K线已全部请求，不再继续请求----', 'color:green')
    } else {
        console.groupCollapsed(`%c请求历史k线:⬇`, `color:green`)

        console.log(
            `区间[${[bars[0], bars[bars.length-1]].filter(e => e).map(e => [window.dayjs(e.time).format('YYYY/MM/DD HH:mm:ss')])}], ${bars.length}条数据`
        )
        console.log('参数:', JSON.stringify(params, null, ' '))
        console.log('数据:', bars)
        console.groupEnd()
    }
}

export { HistoryProvider };
