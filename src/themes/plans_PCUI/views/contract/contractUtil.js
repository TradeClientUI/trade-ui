// 交易时间排序及按时区按天归类，返回的时间是处理完时区后的时间
export const sortTimeList = (timeList, utcOffset) => {
    timeList.sort((a, b) => a.startTime - b.startTime)
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)

    const result = new Array(7).fill('').map(() => [])
    // 时间+时区跨天的添加到下一天
    timeList.forEach(el => {
        const { dayOfWeek, endTime, startTime } = el
        const curDay = result[dayOfWeek - 1]
        const nextDay = result[dayOfWeek === 7 ? 0 : dayOfWeek]

        if (startTime + utcOffset >= 1440) { // 开始时间+时区后跨天
            const item = Object.assign({}, el, {
                dayOfWeek: dayOfWeek === 7 ? 1 : dayOfWeek + 1,
                startTime: (startTime + utcOffset - 1440).toFixed(0) * 1,
                endTime: (endTime + utcOffset - 1440).toFixed(0) * 1,
            })
            nextDay.unshift(item)
        } else if (endTime + utcOffset > 1440) { // 结束时间+时区后跨天
            const item = Object.assign({}, el, {
                dayOfWeek: dayOfWeek === 7 ? 1 : dayOfWeek + 1,
                startTime: 0,
                endTime: (endTime + utcOffset - 1440).toFixed(0) * 1
            })
            nextDay.unshift(item)
            const curDayData = Object.assign({}, el, {
                startTime: startTime + utcOffset,
                endTime: 1440,
            })
            curDay.push(curDayData)
        } else { // 不跨天
            const curDayData = Object.assign({}, el, {
                startTime: startTime + utcOffset,
                endTime: endTime + utcOffset,
            })
            curDay.push(curDayData)
        }
    })
    return result
}

// 将时间列表的分钟数格式化成时间字符串
export const timeListFormat = (data) => {
    data.forEach(el => {
        el.sort((a, b) => a.startTime - b.startTime)
        el.forEach(item => {
            const { startTime, endTime } = item
            const startTimeStr = window.dayjs().utc().startOf('day').add(startTime, 'minute').format('HH:mm')
            const endTimeStr = window.dayjs().utc().startOf('day').add(endTime, 'minute').format('HH:mm')
            let timeStr = ''
            if (endTime === Number(1440)) {
                timeStr = startTimeStr + '-' + '24:00'
            } else {
                timeStr = startTimeStr + '-' + endTimeStr
            }
            item.timeStr = timeStr
        })
    })
}

// 将时间列表排序
function timesSort (dataList = []) {
    const todayStr = window.dayjs().format('YYYY-MM-DD ')
    const list = dataList.map(el => (el.timeStr = el.timeStr.split('-'), el))
    for (let index = 1; index < list.length; index++) {
        const [prevStart, prevEnd] = list[index - 1].timeStr
        const [curStart, curEnd] = list[index].timeStr
        const isBetweenStart = window.dayjs(todayStr + curStart).isBetween(todayStr + prevStart, todayStr + prevEnd, null, '[]')
        const isBetweenEnd = window.dayjs(todayStr + curEnd).isBetween(todayStr + prevStart, todayStr + prevEnd, null, '[]')
        if (isBetweenStart && isBetweenEnd) {
            list.splice(index, 1)
            const newDataList = list.map(el => (el.timeStr = el.timeStr.join('-'), el))
            return timesSort(newDataList)
        } else if (isBetweenStart) {
            list[index - 1].timeStr[1] = curEnd
            list.splice(index, 1)
            const newDataList = list.map(el => (el.timeStr = el.timeStr.join('-'), el))
            return timesSort(newDataList)
        }
    }
    return list
}
export const timeListSort = (dataList = []) => {
    const list = timesSort(dataList)
    const result = list.map(el => (el.timeStr = el.timeStr.join('-'), el))
    console.log(result)
    return result
}
