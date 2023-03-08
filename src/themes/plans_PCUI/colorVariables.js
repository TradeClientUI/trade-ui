import { localGet } from '@/utils/util'
import store from './store'

export const colors = {
    common: {
        primary: '#0062FF',
        primaryBg: '#0062FF1A',
        riseColor: '#ef5353',
        fallColor: '#03A66D',
        warn: '#ef5353',
        success: '#03A66D',
        focusColor: '#f2a11b'
    },
    night: {
        primaryAssistColor: '#2c2e3b',
        color: '#eaebee',
        normalColor: '#9294a3',
        minorColor: '#9294a3',
        placeholdColor: '#515366',
        contentColor: '#21262f',
        bgColor: '#191e24',
        assistColor: '#2c2e3b',
        lineColor: '#2c2e3b',
        mainColor: '#ffffff'
    },
    light: {
        primaryAssistColor: '#f4f7fc',
        color: '#333333',
        normalColor: '#656667',
        minorColor: '#999999',
        placeholdColor: '#c2c2c2',
        contentColor: '#ffffff',
        bgColor: '#f4f4f4',
        assistColor: '#f4f4f4',
        lineColor: '#eeeeee',
        mainColor: '#000000'
    },
    // disable: '#eeeeee'

    /* 'color': '#333',
    'mutedColor': '#989898',
    'placeholder': '#c2c2c2',
    'tabColor': '#333',
    'tabLine': '#333',
    'bdColor': '#e5e5e5',
    'btnColor': '#f6f6f6',
    'btnLine': '#e5e5e5',
    'btnText': '#333',
    'btnText2': '#989898',
    'btnSelected': '#ff7418',
    'btnInterval': '#e5e5e5',
    'iconColor': '#333',
    'iconColor2': '#333',
    'white': '#fff',
    'bgColor': '#f6f6f6',
    'riseColor': '#e3525c',
    'fallColor': '#10b873',
    'sellColor': '#E3525C',
    'buyColor': '#007AFF',
    'primary': '#477fd3',
    'lightenPrimary': '#f3f8ff',
    'success': '#10B873', */
}

// 更新body类
function updateBodyClass (themeColor) {
    const classList = document.body.classList
    const htmlClassList = document.documentElement.classList
    if (!themeColor) return false
    classList.remove('light')
    classList.remove('night')
    classList.add(themeColor)

    htmlClassList.remove('light')
    htmlClassList.remove('night')
    htmlClassList.remove('dark')
    htmlClassList.add(themeColor)
    if (themeColor === 'night') htmlClassList.add('dark')
}

// 设置root变量
export function setRootVariable (themeColor) {
    const invertColor = themeColor || localGet('invertColor')
    const chartColorType = JSON.parse(localGet('chartConfig'))?.chartColorType || 1
    const colorsArr = Object.assign(colors[invertColor], colors.common)
    updateBodyClass(invertColor)
    const { riseColor, fallColor } = colorsArr

    if (Number(chartColorType) === 1) {
        colorsArr.riseColor = fallColor
        colorsArr.fallColor = riseColor
    } else {
        colorsArr.riseColor = riseColor
        colorsArr.fallColor = fallColor
    }

    const style = document.body.style
    for (const key in colorsArr) {
        if (Object.hasOwnProperty.call(colorsArr, key)) {
            const el = colorsArr[key]
            style.setProperty(`--${key}`, el)
        }
    }
    store.commit('Update_style', colorsArr)
    sessionStorage.setItem('themeColors', JSON.stringify(colors))
}

export default colors
