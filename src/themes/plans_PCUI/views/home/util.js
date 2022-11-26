// 倒序时间(刚刚，几分钟前，几个小时前，几天前，几周前，几个月前等)
export function beforeTime (dateTimeStamp, t) {
    var minute = 1000 * 60 // 把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60
    var day = hour * 24
    var week = day * 7
    // var halfamonth = day * 15
    var month = day * 30
    var year = day * 365
    var now = new Date().getTime() // 获取当前时间毫秒
    // console.log(now);
    var diffValue = now - dateTimeStamp // 时间差

    if (diffValue < 0) {
        return
    }
    var minC = diffValue / minute // 计算时间差的分，时，天，周，月
    var hourC = diffValue / hour
    var dayC = diffValue / day
    var weekC = diffValue / week
    var monthC = diffValue / month
    var yearC = diffValue / year
    var result
    if (yearC >= 1) {
        result = ' ' + parseInt(yearC) + t('information.yearAgo')
    } else if (monthC >= 1 && monthC <= 12) {
        result = ' ' + parseInt(monthC) + t('information.monthAgo')
    } else if (weekC >= 1 && weekC <= 4) {
        result = ' ' + parseInt(weekC) + t('information.weekAgo')
    } else if (dayC >= 1 && dayC <= 7) {
        result = ' ' + parseInt(dayC) + t('information.daysAgo')
    } else if (hourC >= 1 && hourC <= 24) {
        result = ' ' + parseInt(hourC) + t('information.hoursAgo')
    } else if (minC >= 1 && minC <= 60) {
        result = ' ' + parseInt(minC) + t('information.minutesAgo')
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = t('information.now')
    } else {
        var datetime = new Date()
        datetime.setTime(dateTimeStamp)
        var Nyear = datetime.getFullYear()
        var Nmonth =
            datetime.getMonth() + 1 < 10
                ? '0' + (datetime.getMonth() + 1)
                : datetime.getMonth() + 1
        var Ndate =
            datetime.getDate() < 10
                ? '0' + datetime.getDate()
                : datetime.getDate()
        result = Nyear + '-' + Nmonth + '-' + Ndate
    }
    return result
}
