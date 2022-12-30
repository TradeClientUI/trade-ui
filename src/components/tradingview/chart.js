import { isEmpty, localSet, localGet } from '@/utils/util'
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { portraitOptions, landscapeOptions, styleNameMap } from './datafeeds/userConfig/config.js'

// 创建Chart实例
export function createChart (...args) {
    return new Chart(...args)
}

/**
    产品数据结构
    initial = {
        description: '欧元美元' || '123',// 图表左上角名称显示
        symbolId: 1,  //产品id
        digits: '4', //小数点
    }
 */

/**
    图表属性-默认值
    property = {
        chartType: '1', // 图表类型
        showLastPrice: true, // 现价线
        showBuyPrice: false, // 买价线
        showSellPrice: false, // 卖价线
        showPositionPrice: false, // 持仓线
        showSeriesOHLC: false, // 高开低收
        showBarChange: false, // 涨跌幅
        showPriceBox: false, // 价格框
        showSeriesTitle: false // K线标题
    }
 */

/**
    扩展字段-默认值
    extension = {
        theme: 'Light' // 主题
        fullScreen: false // 全屏功能（右上角缩放按钮、横屏监听等）
        orientation: 'portrait' // 非必填，默认值portrait，可选值: 'portrait' ｜ 'landscape' (竖屏｜横屏)
    }
 */

class Chart {
    constructor ({ containerId, initial, property = {}, indicators = [], extension = {} }, chartReadyCallback = () => {}) {
        // 产品初始值
        this.initial = {
            description: initial.description, // 图表左上角名称显示
            symbolId: initial.symbolId, // 产品id
            digits: initial.digits, // 小数点
        }
        this.interval = initial.interval || '1'
        this.buyPrice = '' // 买价
        this.sellPrice = '' // 卖价
        // 产品id
        this.symbolId = initial.symbolId
        // 图表属性
        this.property = property
        // 扩展
        this.extension = extension
        // 容器id
        this.containerId = containerId
        // 容器节点
        this.elm = document.querySelector(containerId)
        // 容器高度
        this.containerHeight = this.elm.offsetHeight
        // 图表渲染后回调
        this.chartReadyCallback = chartReadyCallback
        // 数据适配器
        this.datafeed = new UDFCompatibleDatafeed('', {
            symbolInfo: initial
        })
        // 指标列表
        this.indicators = indicators
        // 已创建指标实体(指标实体id和指标名称的映射关系，用于图表直接删除指标时，及时更新)
        this._indicatorsEntity = []

        // 默认竖屏
        this._orientation = extension.orientation || 'portrait'
        // 价格线实例
        this._linesMap = {}
        // 持仓线实例
        this._positionLines = []
        // 事件订阅,通过实例方法subscribe订阅
        this._listener = {
            isLandscape: [], // 是否横屏
            click: [], // 短按
        }
        // 存储图表订阅事件
        this._nativeListener = []

        // 离开图表前必须执行的事件队列
        this._destroyedFns = []

        // 第一次执行
        this._firstInit = true

        this._init()
    }

    _init () {
        this.destroyed()
        const { initial, containerHeight, datafeed, containerId } = this
        if (!containerHeight || !initial) {
            return
        }

        console.log(`%c当前产品: ${[initial.description, initial.symbolId, initial.digits].join(',')}`, 'color:#2196f3')

        // 获取横竖屏配置项
        const options = { ...this._options }

        if (!this._firstInit) {
            // 还原上一次用户操作（例如绘图）
            this.widget.save((data) => (options.saved_data = data))
        }

        // eslint-disable-next-line new-cap
        this.widget = window.tvWidget = new window.TradingView.widget({
            ...options,
            datafeed: datafeed,
            container: containerId.slice(1),
            symbol: this.symbolId,
            interval: this.interval,
        })

        this.widget.onChartReady(() => {
            this.updateIndicator(this.indicators)
            this.updateProperty(this.property)
            this._addPriceBox()
            this._bindEvent()
            if (this._firstInit && this._orientation === 'portrait' && [90, -90].includes(window.orientation)) {
                // 横屏，但是默认值是竖屏时
                this._setStyle('landscape')
            }
            this._firstInit = false
            // 执行图表创建成功的回调函数
            this.chartReadyCallback()
        })
    }

    get _options () {
        let options = null
        if (this.fullScreen && this._firstInit && this._orientation === 'portrait' && [90, -90].includes(window.orientation)) {
            // 横屏，但是默认值是竖屏时
            options = landscapeOptions()
        } else {
            options = this._orientation === 'portrait' ? portraitOptions() : landscapeOptions()
        }

        ['theme', 'locale'].forEach(key => {
            if (this.extension[key]) {
                options[key] = this.extension[key]
            }
        })

        // 覆盖图表属性
        Object.assign(options.overrides, this._setProperty(this.property))

        return options
    }

    _bindEvent () {
        this._bindResize()
        this._bindClick()
        this._addSubscribeEvents()
    }

    // 监听窗口变化
    _bindResize () {
        if (!this.extension.fullScreen) return

        this._addFullScreenBtn()
        const handleResize = debounce(() => {
            // 火狐的orientation延迟超过200ms以上
            if (window.orientation === 0 && this._orientation !== 'portrait') {
                this._toggleFullScreen('portrait')
            } else if ((window.orientation === 90 || window.orientation === -90) && this._orientation !== 'landscape') {
                this._toggleFullScreen('landscape')
            }
        }, 300)
        window.addEventListener('resize', handleResize)
        this._destroyedFns.push(() => {
            window.removeEventListener('resize', handleResize)
        })
    }

    /**
     *  添加点击事件，显示两侧菜单
     *  在图表上点击显示菜单或其他事件与图表有冲突（图表自身已有点击/长按事件，指标/画图实体的交互等）
     *  通过订阅图表多个事件（mouse_down/mouse_up/drawing_event/drawingundo_redo_state_changed）以及延迟触发
     *  维护非图表的自定义点击状态
     */
    _bindClick () {
        const iframeWindow = this.elm.querySelector('iframe').contentWindow
        // 绘图状态
        let isDrawing = false
        // 交互状态 mouseDown => mouseMove => mouseUp
        let touchStatus = ''

        // touchmove
        const handleTouchmove = () => {
            if (touchStatus === 'mouseDown') {
                touchStatus = 'mouseMove'
            }
        }
        iframeWindow.addEventListener('touchmove', handleTouchmove)
        this._destroyedFns.push(() => {
            iframeWindow.removeEventListener('touchmove', handleTouchmove)
        })
        // mouseDown
        const handleMouseDown = () => {
            touchStatus = 'mouseDown'
        }
        // mouseUp
        const handleMouseUp = (e) => {
            setTimeout(() => {
                const oldStatus = touchStatus
                touchStatus = 'mouseUp'
                // 绘图/长按/平移均不触发
                if (isDrawing || oldStatus === 'mouseMove') {
                    return
                }
                this._listener['click'].forEach(f => f())
            }, 0)
        }

        this.widget.subscribe('mouse_down', handleMouseDown)
        this.widget.subscribe('mouse_up', handleMouseUp)

        // 隐藏，显示，移动，移除或单击绘图(hide，show、move、remove、click)
        this.widget.subscribe('drawing_event', (a, type) => {
            switch (type) {
            case 'remove': {
                isDrawing = false
                break
            }
            case 'click': {
                isDrawing = true
                break
            }
            default: {
                isDrawing = false
            }
            }
        })

        // 绘图将添加到图表中
        this.widget.subscribe('drawing', () => {
            isDrawing = true
        })

        // Undo/Redo状态已更改
        this.widget.subscribe('undo_redo_state_changed', () => {
            setTimeout(() => {
                isDrawing = false
            }, 50)
        })

        // 订阅指标属性修改
        this.widget.subscribe('study_properties_changed', id => {
            const studyObj = this.widget.activeChart().getStudyById(id)
            const { _metaInfo, _properties } = studyObj._study
            const _inputs = studyObj.getInputValues().map(el => el.value)

            const allStyle = {}
            const _childs = _properties.palettes._childs.join()
            const styleObj = {
                styles: _properties?.styles,
                filledAreasStyle: _properties?.filledAreasStyle,
                filledAreas: _properties?.filledAreas,
                bands: _properties?.bands,
                // [`palettes.${_childs}.colors`]: _properties?.palettes?.[_childs]?.colors
                // metaInfo: _metaInfo
            }

            if (_childs) {
                styleObj[`palettes.${_childs}.colors`] = _properties?.palettes?.[_childs]?.colors
            }

            // 缓存最后一次修改的类型 1: 系统设置 2 TradingView 设置
            if (_metaInfo.shortId === 'Volume') {
                localSet('lastModifyType', 2)
            }

            for (const key in styleObj) {
                if (Object.hasOwnProperty.call(styleObj, key)) {
                    const element = styleObj[key]
                    for (const k in element) {
                        if (Object.hasOwnProperty.call(element, k)) {
                            const val = element[k]
                            for (const v in val) {
                                if (Object.hasOwnProperty.call(val, v)) {
                                    const element = val[v]
                                    const styleKey = `${key}.${k}.${v}`
                                    if (!isEmpty(element._value)) allStyle[styleKey] = element._value
                                }
                            }
                        }
                    }
                }
            }

            const tvStudyConfig = JSON.parse(localGet('tvStudyConfig')) || {}
            tvStudyConfig[_metaInfo.description] = {}
            tvStudyConfig[_metaInfo.description].styles = allStyle
            tvStudyConfig[_metaInfo.description].inputs = _inputs

            localSet('tvStudyConfig', JSON.stringify(tvStudyConfig))
        })
    }

    // 订阅图表事件
    _addSubscribeEvents () {
        // 监听周期改变
        let timer = null
        let _interval = this.interval
        this.widget.activeChart().onIntervalChanged()
            .subscribe(null, (interval) => {
                _interval = interval
                this.datafeed._historyProvider.setTick(null)
                this.datafeed._historyProvider._previousBar = null
                const rec = () => {
                    clearTimeout(timer)
                    timer = setTimeout(() => {
                        const { _subscribers } = this.datafeed._dataPulseProvider
                        const listenerGuid = Object.keys(_subscribers).find(key => new RegExp(`_#_${_interval}$`).test(key))
                        if (listenerGuid) {
                            // 切换周期后，修改产品信息
                            this.datafeed._historyProvider.setResolution(_interval)
                            this.datafeed._historyProvider.setTick(_subscribers[listenerGuid].listener)

                            // 更新最新价为当前周期数据的最后一根k线
                            this._setLastPriceFromLastBar()
                        } else {
                            rec()
                        }
                    }, 300)
                }

                rec()
            })

        // 监听数据加载
        this.widget.activeChart().onDataLoaded()
            .subscribe(null,
                () => {
                    this._setLastPriceFromLastBar()
                },
                true)
    }

    // 批量创建指标
    _createStudies (info) {
        this.indicators.forEach(e => {
            this.widget.activeChart().createStudy(e.name, ...e.params, {
                precision: info.digits
            })
        })
    }

    // 添加买卖价节点（左上角）
    _addPriceBox () {
        const contentWindow = this.elm.querySelector('iframe').contentWindow
        this.priceBox = appendPriceBoxToIframe(contentWindow, this.sellPrice, this.buyPrice, this.property.showPriceBox)
    }

    togglePriceBox (bool) {
        if (bool) {
            this.priceBox.show()
        } else {
            this.priceBox.hide()
        }
    }

    _addFullScreenBtn () {
        const len = this.sellPrice ? this.sellPrice.length : 10
        appendBtnToIframe({
            el: this.elm.querySelector('iframe'),
            type: 'landscape',
            style: {
                right: 11 * len + 'px'
            }
        }, () => {
            this._toggleFullScreen(this._orientation === 'portrait' ? 'landscape' : 'portrait')
        })
    }

    _toggleFullScreen (type) {
        this._orientation = type
        this._init()
        this._setStyle(type)
    }

    _setStyle (type) {
        this._orientation = type
        if (type === 'landscape') {
            this._setLandscape()
            this._listener['isLandscape'].forEach(f => f(true))
        } else {
            this._setPortrait()
            this._listener['isLandscape'].forEach(f => f(false))
        }
    }

    // 设置横屏
    _setLandscape () {
        const { elm } = this
        let width = window.innerWidth
        let height = window.innerHeight

        if (window.orientation === 90 || window.orientation === -90) {
            [width, height] = [height, width]
        }

        const temp = {
            width: height + 'px',
            height: width + 'px',
            top: (height - width) / 2 + 'px',
            left: -(height - width) / 2 + 'px'
        }

        document.body.scrollTop = 0
        elm.style.width = temp.width
        elm.style.height = temp.height
        elm.style.top = temp.top
        elm.style.left = temp.left
    }

    // 设置竖屏
    _setPortrait () {
        const { elm } = this
        elm.style.width = null
        elm.style.height = null
        elm.style.top = null
        elm.style.left = null
    }

    // 修改现有指标价格精度
    _setPrecisionForStudies (precision) {
        const chart = this.widget.activeChart()
        chart.getAllStudies().forEach(e => {
            chart.getStudyById(e.id)
                .applyOverrides({
                    precision
                })
        })
    }

    // 价格线
    _setLine (config = {}) {
        const { _linesMap, symbolId } = this
        !_linesMap[symbolId] && (_linesMap[symbolId] = {})
        const target = _linesMap[symbolId]
        const isShowBuyPrice = typeof config.showBuyPrice === 'boolean' ? config.showBuyPrice : this.property.showBuyPrice
        const showSellPrice = typeof config.showSellPrice === 'boolean' ? config.showSellPrice : this.property.showSellPrice
        const upColor = config.upColor || this.property.upColor
        const downColor = config.downColor || this.property.downColor

        if (typeof isShowBuyPrice === 'boolean') {
            if (isShowBuyPrice) {
                if (target.buyPriceLine) {
                    target.buyPriceLine.setPrice(this.buyPrice)
                } else {
                    target.buyPriceLine = this.widget.activeChart().createOrderLine()
                        .setPrice(this.buyPrice)
                        .setText('')
                        .setLineStyle(0)
                        .setLineColor(upColor)
                        .setQuantity(false)
                }
            } else if (target.buyPriceLine) {
                target.buyPriceLine.remove()
                target.buyPriceLine = null
            }
        }
        if (typeof showSellPrice === 'boolean') {
            if (showSellPrice) {
                if (target.sellPriceLine) {
                    target.sellPriceLine.setPrice(this.sellPrice)
                } else {
                    target.sellPriceLine = this.widget.activeChart().createOrderLine()
                        .setPrice(this.sellPrice)
                        .setText('')
                        .setLineStyle(0)
                        .setLineColor(downColor)
                        .setQuantity(false)
                }
            } else if (target.sellPriceLine) {
                target.sellPriceLine.remove()
                target.sellPriceLine = null
            }
        }
    }

    // 对部分订阅事件进行二次封装
    _resolveFn (type, callback) {
        let fn = callback
        switch (type) {
        case 'study_event': {
            // 默认返回指标实体id改为返回指标名称
            fn = (id, event) => {
                const target = this._indicatorsEntity.find(e => e.id === id)
                callback(target ? target.name : '', event)
            }
            break
        }
        }
        return fn
    }

    // 覆盖图表属性
    _applyOverrides (config) {
        const options = this._setProperty(config)
        this.widget.applyOverrides(options)
    }

    _setProperty (property, overrides = {}) {
        Object.keys(property || {}).forEach(key => {
            switch (key) {
            case 'showSeriesTitle':
            case 'showSeriesOHLC':
            case 'showBarChange': {
                overrides[`paneProperties.legendProperties.${key}`] = property[key]
                break
            }
            case 'upColor':
            case 'downColor': {
                const styleName = styleNameMap[property.chartType]
                if (['barStyle', 'candleStyle', 'haStyle', 'hollowCandleStyle'].includes(styleName)) {
                    overrides['mainSeriesProperties.' + styleName + '.upColor'] = property.upColor
                    overrides['mainSeriesProperties.' + styleName + '.downColor'] = property.downColor
                }
                if (['candleStyle', 'haStyle', 'hollowCandleStyle'].includes(styleName)) {
                    overrides['mainSeriesProperties.' + styleName + '.borderUpColor'] = property.upColor
                    overrides['mainSeriesProperties.' + styleName + '.borderDownColor'] = property.downColor
                }
                break
            }
            case 'chartType': {
                overrides['mainSeriesProperties.style'] = Number(property.chartType)
                break
            }
            }
        })
        return overrides
    }

    // 重置K线可视区域
    _resetVisibleRange () {
        try {
            // 重置图表（包括缩放/刻度等）
            this.widget.activeChart().executeActionById('chartReset')
        } catch (error) {
            console.error('_resetVisibleRange: ', error)
        }
    }

    // 判断是否存在历史数据
    _hasBars () {
        return !!this.widget.activeChart().getSeries().barsCount()
    }

    // 手动更新现价线
    _setLastPrice (price, isShowLastPrice = this.property.showLastPrice) {
        const { _linesMap, symbolId } = this
        !_linesMap[symbolId] && (_linesMap[symbolId] = {})
        const target = _linesMap[symbolId]

        if (isShowLastPrice && !target.lastPriceLine) {
            target.lastPriceLine = this.widget.activeChart().createOrderLine()
                .setPrice(price)
                .setText('')
                .setLineStyle(1)
                .setLineColor('#467fd3')
                .setQuantity(false)
        }

        if (isShowLastPrice) {
            target.lastPriceLine.setPrice(price)
        } else {
            target.lastPriceLine && target.lastPriceLine.remove()
            target.lastPriceLine = null
        }
    }

    // 更新最新价为当前周期数据的最后一根k线
    _setLastPriceFromLastBar (bool) {
        const lastBar = this.widget.activeChart().getSeries().data().last()
        if (lastBar) {
            this._setLastPrice(lastBar.value[4], bool)
            this.datafeed._historyProvider._previousBar = {
                time: lastBar.value[6],
                close: lastBar.value[4],
                open: lastBar.value[1],
                high: lastBar.value[2],
                low: lastBar.value[3],
                volume: lastBar.value[5],
            }
        }
    }

    /** ---------------------------- 分割线 ------------------------------------------------------------------------------------------- */
    /** ---------------------------- 以下是公开方法 ------------------------------------------------------------------------------------ */
    // 切换产品
    setSymbol = info => {
        this.symbolId = info.symbolId
        // 修改产品属性
        this.datafeed.setSymbolInfo(info)

        return new Promise((resolve, reject) => {
            // 修改图表产品
            this.widget.activeChart()
                .setSymbol(this.symbolId + '', () => {
                    this._setPrecisionForStudies(info.digits)
                    this.updateProperty(this.property)
                    resolve(this.symbolId)
                    console.log(`%c切换产品: ${JSON.stringify(info)}`, 'color:green')
                })
        })
    }

    // 切换图表类型
    setChartType = (chartType) => {
        if (typeof chartType === 'number' && !isNaN(chartType)) {
            // 0:Bar 1:Candle 2:Line 3:Area ,8:Heikin-Ashi ,9: Hollow Candle 10: Baseline 12 10Hi-Lo
            this._applyOverrides({
                chartType
            })
        }
    }

    // 切换周期
    setResolution = (val) => {
        console.log(`%c开始切换周期: ${val}`, 'color:rgba(0,0,0,0.3)')
        this.widget.activeChart()
            .setResolution(val, () => {
                this.interval = val
                console.log(`%c周期切换成功: ${val}`, 'color:rgba(0,0,0,0.6)')
                this._resetVisibleRange()
            })
    }

    // 更新买/卖价格线
    updateLineData = ({ buyPrice, sellPrice }) => {
        if (!this._hasBars()) {
            return
        }
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice

        this._setLine()
        if (this.priceBox) {
            this.priceBox.setSellPrice(sellPrice)
            this.priceBox.setBuyPrice(buyPrice)
        }
    }

    // 更新指标（全量更新/删除）
    updateIndicator = (value) => {
        if (!value) return []
        if (!Array.isArray(value)) {
            value = [value]
        }

        value = value.filter(e => !isEmpty(e))

        const allStudies = this.widget.activeChart().getAllStudies()
        const temp = {}
        allStudies.forEach(e => {
            temp[e.name] = true
        })

        // 新添加指标
        const addList = value.filter(e => !temp[e.name])
        // 待删除指标
        const removeList = this._indicatorsEntity.filter(item => !value.find(e => e.name === item.name))

        addList.forEach(e => {
            const params = e.params
            const tvStudyConfig = JSON.parse(localGet('tvStudyConfig'))?.[e.name]
            const styles = tvStudyConfig?.styles
            if (tvStudyConfig?.inputs) {
                params[2] = tvStudyConfig?.inputs
            }

            const property = {
                // 'palettes.plot_0_Palette.colors.0.color': this.property.upColor, // MACD指标涨的颜色
                // 'palettes.plot_0_Palette.colors.1.color': this.property.downColor, // MACD跌的颜色
                // 'palettes.volumePalette.colors.0.color': this.property.upColor, // 涨的颜色
                // 'palettes.volumePalette.colors.1.color': this.property.downColor, // 跌的颜色
                precision: e.name === 'Volume' ? 'default' : this.initial.digits, // 成交量指标不需要指定小数位
                ...styles
            }

            // 判断成交量指标是根据系统设置还是TV设置
            const lastModifyType = localGet('lastModifyType')
            if (Number(lastModifyType) === 1 || !lastModifyType) {
                property['palettes.volumePalette.colors.0.color'] = this.property.downColor
                property['palettes.volumePalette.colors.1.color'] = this.property.upColor
            }

            this.widget.activeChart().createStudy(e.name, ...params, property).then(id => {
                // 更新指标实体
                this._indicatorsEntity.push({
                    name: e.name,
                    id
                })
            })
        })

        removeList.forEach(e => {
            this.widget.activeChart().removeEntity(e.id)
            // 更新指标实体
            this._indicatorsEntity = this._indicatorsEntity.filter(item => item.id !== e.id)
        })
    }

    // 订阅事件
    subscribe = (eventName, callback) => {
        this._listener[eventName].push(function (...args) {
            try {
                return callback.apply(this, args)
            } catch (error) {
                console.error(error)
            }
        })
    }

    // 图表原生订阅
    nativeSubscribe (type, callback) {
        callback = this._resolveFn(type, callback)
        this._nativeListener[type] = [
            ...(this._nativeListener[type] || []),
            callback
        ]

        this.widget.subscribe(type, callback)
    }

    // 销毁前必须执行的方法
    destroyed = () => {
        while (this._destroyedFns.length) {
            const fn = this._destroyedFns.shift()
            fn()
        }
    }

    // 覆盖图表配置
    updateProperty (config = {}) {
        this._applyOverrides(config)
        if (typeof config.showPositionPrice === 'boolean') {
            !config.showPositionPrice && this.updatePosition()
        }
        // 现价线
        if (typeof config.showLastPrice === 'boolean' && config.showLastPrice !== this.property.showLastPrice) {
            // 更新最新价为当前周期数据的最后一根k线
            this._setLastPriceFromLastBar(config.showLastPrice)
        }

        this._setLine(config)

        // 合并属性
        Object.assign(this.property, config)
    }

    // 实时tick
    setTick (price, time, volume) {
        // console.log(this.widget)
        this.datafeed._historyProvider.onTick(price, time, volume)
        this._setLastPrice(price)
    }

    // 批量创建持仓线
    updatePosition (positions = []) {
        while (this._positionLines.length) {
            this._positionLines.pop().remove()
        }
        if (!this.property.showPositionPrice) {
            return
        }
        this._positionLines = positions.map(el => {
            const { text, quantity, price, color } = el

            const entity = this.widget.activeChart().createOrderLine()
                .setPrice(price)
                .setText(text)
                .setExtendLeft(false)
                .setLineStyle(0)
                .setQuantity(quantity)
                .setQuantityBackgroundColor(color)
                .setBodyBorderColor(color)
                .setLineColor(color)
                .setQuantityBorderColor(color)
                .setLineLength(55)
            return entity
        })
    }

    // 更改图表主题
    changeTheme (name) {
        this.widget.changeTheme(name)
        this.extension.theme = name
    }
}

function appendBtnToIframe ({ el, type, fillColor = '#ccc', style = {} }, callback) {
    const landscape = type === 'landscape'
    const div = document.createElement('div')
    div.classList.add('fullScreenBtn')
    if (landscape) {
        // 横屏
        div.innerHTML = getIconHtml({ fillColor }, 'landscape')
    } else {
        div.innerHTML = getIconHtml({ fillColor })
    }
    div.addEventListener('click', callback)

    div.style.right = style.right
    el.contentWindow.document.body.appendChild(div)
}

function getIconHtml ({ fillColor }, type) {
    if (type === 'landscape') {
        return `<svg t="1621511438709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10429"><path d="M625.777778 568.888889h341.333333c34.133333 0 56.888889 22.755556 56.888889 56.888889s-22.755556 56.888889-56.888889 56.888889h-199.111111l238.933333 238.933333c22.755556 22.755556 22.755556 62.577778 0 85.333333-22.755556 22.755556-62.577778 22.755556-85.333333 0L682.666667 768V967.111111c0 34.133333-22.755556 56.888889-56.888889 56.888889s-56.888889-22.755556-56.888889-56.888889v-341.333333c0-34.133333 22.755556-56.888889 56.888889-56.888889zM56.888889 341.333333h199.111111L17.066667 108.088889C-5.688889 85.333333-5.688889 45.511111 17.066667 22.755556S79.644444 0 102.4 22.755556L341.333333 256V56.888889c0-34.133333 22.755556-56.888889 56.888889-56.888889s56.888889 22.755556 56.888889 56.888889v341.333333c0 34.133333-22.755556 56.888889-56.888889 56.888889H56.888889c-28.444444 0-56.888889-22.755556-56.888889-56.888889s28.444444-56.888889 56.888889-56.888889z" fill="${fillColor}" p-id="10430"></path></svg>`
    }

    return `<svg t="1621511137390" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9915" data-spm-anchor-id="a313x.7781069.0.i9"><path d="M967.111111 1024h-342.869333a56.888889 56.888889 0 0 1-56.888889-56.888889v-0.455111a56.888889 56.888889 0 0 1 56.888889-56.888889h197.916444l-236.088889-236.088889a61.952 61.952 0 0 1 87.608889-87.608889l236.088889 236.088889v-197.916444a56.888889 56.888889 0 0 1 56.888889-56.888889H967.111111a56.888889 56.888889 0 0 1 56.888889 56.888889V967.111111a56.888889 56.888889 0 0 1-56.888889 56.888889zM398.222222 113.777778H201.045333l235.178667 235.178666a61.724444 61.724444 0 1 1-87.267556 87.267556L113.777778 201.045333V398.222222a56.888889 56.888889 0 0 1-113.777778 0V56.888889a56.888889 56.888889 0 0 1 56.888889-56.888889h341.333333a56.888889 56.888889 0 0 1 0 113.777778z" fill="${fillColor}" p-id="9916"></path></svg>`
}

function appendPriceBoxToIframe (iframeWindow, sellPrice, buyPrice, isShow) {
    const elm = iframeWindow.document.querySelector('.noWrap-ODIQgNap')
    const div = document.createElement('div')
    div.classList.add('price-box')
    !isShow && div.classList.add('hide')
    div.innerHTML = `<div class='block sell'>
                        <span class='num'>
                            ${sellPrice}
                        </span>
                        <span class='text'>
                            sell
                        </span>
                    </div>
                    <div class='block buy'>
                        <span class='num'>
                            ${buyPrice}
                        </span>
                        <span class='text'>
                            buy
                        </span>
                    </div>`
    const sellElm = div.querySelector('.sell .num')
    const buyElm = div.querySelector('.buy .num')
    if (elm) elm.appendChild(div)

    let oldSellPrice = 0
    const setSellPrice = price => {
        if (Number(oldSellPrice) < Number(price)) {
            div.classList.add('rise')
            div.classList.remove('fall')
        } else {
            div.classList.add('fall')
            div.classList.remove('rise')
        }
        sellElm.innerText = price
        oldSellPrice = price
    }
    const setBuyPrice = price => { buyElm.innerText = price }

    const show = () => {
        div.classList.remove('hide')
    }
    const hide = () => {
        div.classList.add('hide')
    }

    return {
        setSellPrice,
        setBuyPrice,
        show,
        hide
    }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce (func, wait = 200, immediate = false) {
    let timer
    return function (...rest) {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timer = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}
