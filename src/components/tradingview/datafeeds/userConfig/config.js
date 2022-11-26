import { genBaseConfig } from './base.config.js'

// 横屏配置
export function landscapeOptions () {
    const options = genBaseConfig()
    options.disabled_features = options.disabled_features.filter(e => !['left_toolbar', 'vert_touch_drag_scroll'].includes(e))
    return options
}

// 竖屏配置
export function portraitOptions () {
    const options = genBaseConfig()
    options.disabled_features.push('left_toolbar', 'vert_touch_drag_scroll')
    return options
}

export const resolutionToKlineType = {
    '1': '1',
    '5': '2',
    '15': '3',
    '30': '4',
    '60': '5',
    '120': '6',
    '240': '7',
    '1D': '8',
    '1W': '9',
    '1M': '10'
}

export const resolutionToText = {
    '1': 'M1',
    '5': 'M5',
    '15': 'M15',
    '30': 'M30',
    '60': 'H1',
    '240': 'H4',
    '1D': 'D1',
    '1W': 'W1',
    '1M': 'MN'
}

// 主图指标
export const MAINSTUDIES = [
    {
        label: 'MA',
        name: 'Moving Average mock',
        params: [true, false, [5, 20, 30, 60, 250, 'close', 0]],
        type: 'mainStudy'
    },
    {
        label: 'BOLL',
        name: 'Bollinger Bands',
        params: [true, false, [26, 2]],
        type: 'mainStudy'
    },
    {
        label: 'EMA',
        name: 'Custom Moving Average Exponential',
        params: [true, false, [12,26, 'close']],
        type: 'mainStudy'
    },
    {
        label: 'SAR',
        name: 'Parabolic SAR',
        params: [true, false, [0.02, 0.02, 0.2]],
        type: 'mainStudy'
    },
    {
        label: 'Alligator',
        name: 'Williams Alligator',
        params: [true, false, [13, 8, 5]],
        type: 'mainStudy'
    },
    {
        label: 'TEMA',
        name: 'Triple EMA',
        params: [true, false, [9]],
        type: 'mainStudy'
    },

    {
        label: 'DEMA',
        name: 'Double EMA',
        params: [true, false, [9]],
        type: 'mainStudy'
    },
    {
        label: 'SMMA',
        name: 'Smoothed Moving Average',
        params: [true, false, [7]],
        type: 'mainStudy'
    },
    {
        label: 'Ichimoku',
        name: 'Ichimoku Cloud',
        params: [true, false, [9,26,52,26]],
        type: 'mainStudy'
    },
    {
        label: 'ENV',
        name: 'Envelopes',
        params: [true, false, [20,10,10]],
        type: 'mainStudy'
    }
]

// 副图指标
export const SUBSTUDIES = [
    {
        label: 'MACD',
        name: 'Custom MACD',
        params: [false, false, [12, 26, 'close', 9]],
        type: 'subStudy'
    },
    {
        label: 'KDJ',
        name: 'Custom KDJ',
        params: [false, false, [9, 3, 3]],
        type: 'subStudy'
    },
    {
        label: 'RSI',
        name: 'Custom Relative Strength Index',
        params: [false, false, [6,12,24]],
        type: 'subStudy'
    },
    {
        label: 'ATR',
        name: 'Average True Range',
        params: [false, false, [14]],
        type: 'subStudy'
    },
    {
        label: 'CCI',
        name: 'Commodity Channel Index',
        params: [false, false, [14]],
        type: 'subStudy'
    },
    {
        label: 'WR',
        name: 'Custom Williams %R',
        params: [false, false, [14]],
        type: 'subStudy'
    },
    {
        label: 'DMI',
        name: 'Directional Movement',
        params: [false, false, [14,14]],
        type: 'subStudy'
    },
    {
        label: 'TRIX',
        name: 'TRIX',
        params: [false, false, [18]],
        type: 'subStudy'
    },
    {
        label: 'ASI',
        name: 'Accumulative Swing Index',
        params: [false, false, [10]],
        type: 'subStudy'
    },
    {
        label: 'Momentum',
        name: 'Momentum',
        params: [false, false, [10]],
        type: 'subStudy'
    },
    {
        label: 'DPO',
        name: 'Detrended Price Oscillator',
        params: [false, false, [21]],
        type: 'subStudy'
    },

    {
        label: 'Aroon',
        name: 'Aroon',
        params: [false, false, [14]],
        type: 'subStudy'
    },
    {
        label: 'KST',
        name: 'Know Sure Thing',
        params: [false, false, [10,15,20,30,10,10,10,15,9]],
        type: 'subStudy'
    },
    {
        label: 'ROC',
        name: 'Rate Of Change',
        params: [false, false, [9]],
        type: 'subStudy'
    },
    {
        label: 'CRSI',
        name: 'Connors RSI',
        params: [false, false, [3, 2, 100]],
        type: 'subStudy'
    },

    {
        label: 'SMII',
        name: 'SMI Ergodic Indicator/Oscillator',
        params: [false, false, [5,20,5]],
        type: 'subStudy'
    },
    {
        label: 'HV',
        name: 'Historical Volatility',
        params: [false, false, [10]],
        type: 'subStudy'
    },
    {
        label: 'Stoch',
        name: 'Stochastic',
        params: [false, false, [14, 1, 3]],
        type: 'subStudy'
    },
]

// 副图成交量指标，产品标签为非【外汇】【贵金属】的产品支持
export const VolumeStudy = {
        label: 'Volume',
        name: 'Volume',
        params: [false, false, [20]],
        type: 'subStudy'
    }

//图表样式名称对应关系
export const styleNameMap = {
    0: 'barStyle',
    1: 'candleStyle',
    2:'lineStyle',
    3:'areaStyle',
    8: 'haStyle',
    9: 'hollowCandleStyle',
    10:'baselineStyle',
}
