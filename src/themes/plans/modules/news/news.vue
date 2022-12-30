<template>
    <div class='m-infoflow' :style='data.styleObj'>
        <div class='container'>
            <van-tabs v-model:active='state.activeTab' :color='$style.primary' :title-inactive-color='$style.primary' @click='tabClick'>
                <van-tab v-for='(tab,index) in state.newsTypes' :key='tab.id' class='extra-tabpanel' :name='index' :title='tab.name'>
                    <template v-if='state.activeTab===0'>
                        <van-pull-refresh
                            v-model='state.focusNews.refreshing'
                            :loading-text="$t('compLang.loading')"
                            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                            :success-text="$t('information.refresh')"
                            @refresh='onFocusNewsRefresh'
                        >
                            <van-list
                                v-model:loading='state.focusNews.loading'
                                :finished='state.focusNews.finished'
                                :finished-text="$t('information.noMore')"
                                :loading-text="$t('compLang.loading')"
                                @load='onLoadFocusNews'
                            >
                                <van-cell v-for='news in state.focusNews.list' :key='news.id' class='new'>
                                    <template #title>
                                        <div class='new-con' @click="openOuterUrl({ orgid: data.orgid, newsArea: data.newsArea, id: news.id, title: $t('information.details') })">
                                            <div class='new-left'>
                                                <div class='new-desc'>
                                                    <a href='javascript:void(0)'>
                                                        <span v-if="news.top==='1'">
                                                            {{ $t('information.top') }}
                                                        </span>
                                                        {{ news.title }}
                                                    </a>
                                                </div>
                                                <div class='new-source'>
                                                    <span>{{ news.resource }}</span>
                                                    <span>{{ news.updatetimeStr }}</span>
                                                </div>
                                            </div>
                                            <div class='new-right'>
                                                <img alt='' :src='news.image' />
                                            </div>
                                        </div>
                                    </template>
                                </van-cell>
                            </van-list>
                        </van-pull-refresh>
                    </template>
                    <template v-if='state.activeTab===1'>
                        <van-pull-refresh
                            v-model='state.newsFlash.refreshing'
                            :loading-text="$t('compLang.loading')"
                            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                            :success-text="$t('information.refresh')"
                            @refresh='onNewsFlashRefresh'
                        >
                            <van-list
                                v-model:loading='state.newsFlash.loading'
                                :finished='state.newsFlash.finished'
                                :finished-text="$t('information.noMore')"
                                :loading-text="$t('compLang.loading')"
                                @load='onLoadNewsFlash'
                            >
                                <div class='story-date'>
                                    {{ today }}
                                </div>
                                <van-cell v-for='flash in state.newsFlash.list' :key='flash.id'>
                                    <template #title>
                                        <div class='story-item'>
                                            <div class='iconfont icon-yuandianxiao'></div>
                                            <div class='story-time'>
                                                {{ flash.shotTime }}
                                            </div>
                                            <div class='story-desc' @click='()=>flash.ellipsis=!flash.ellipsis'>
                                                <div class='story-text' :class="{ 'story-ellipsis':flash.ellipsis }">
                                                    {{ flash.title }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-cell>
                            </van-list>
                        </van-pull-refresh>
                    </template>
                    <template v-if='state.activeTab===2'>
                        <div class='canlendar'>
                            <div class='self-tab'>
                                <div @click='changeCanlendarType(1)'>
                                    <span class='t1' :class='{ actived:state.canlendarType===1 }'>
                                        {{ $t('information.data') }}
                                    </span>
                                </div>
                                <div @click='changeCanlendarType(2)'>
                                    <span class='t2' :class='{ actived:state.canlendarType===2 }'>
                                        {{ $t('information.event') }}
                                    </span>
                                </div>
                            </div>
                            <div class='week-container'>
                                <div class='prev' :class='{ actived:state.direction===-1 }' @click='showExtraWeekDays(-1)'>
                                    <van-icon name='arrow-left' />
                                </div>
                                <div class='week-wrap'>
                                    <div class='week'>
                                        <div v-for='week in state.weekdays' :key='week.timeAxis' :class='{ actived:state.timeAxis===week.timeAxis }' @click='getCalendar(week.timeAxis)'>
                                            <div>{{ week.weekday }}</div>
                                            <div>{{ week.date }}</div>
                                        </div>
                                    </div>
                                    <div v-if='state.extraWeekVisible' class='extra-week'>
                                        <div v-for='week in state.extraWeekDays' :key='week.timeAxis' :class='{ actived:state.timeAxis===week.timeAxis }' @click='renderCalendar(week.timeAxis)'>
                                            <div>{{ week.weekday }}</div>
                                            <div>{{ week.date }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class='next' :class='{ actived:state.direction===1 }' @click='showExtraWeekDays(1)'>
                                    <van-icon name='arrow' />
                                </div>
                            </div>

                            <div class='self-container'>
                                <div class='self-content'>
                                    <div v-for='calendar in state.filterCalendarList' :key='calendar.id' class='item'>
                                        <div class='flag'>
                                            <img alt='' :src='`http://cdn.jin10.com/assets/img/commons/flag/flash/${calendar.country}.png`' />
                                        </div>
                                        <div class='info'>
                                            <div class='top'></div>
                                            <div class='middle'>
                                                {{ calendar.text }}
                                            </div>
                                            <div class='bottom'>
                                                <span>{{ $t('information.previous') }}：{{ calendar.prev_value }}</span>
                                                <span>{{ $t('information.expect') }}：{{ calendar.expect }}</span>
                                                <span>{{ $t('information.publish') }}：{{ calendar.public_value }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { newsListByTypeByPage, canlendarListByDate, articleDetail } from '@/api/information'
import { getCookie, getQueryString } from '@/utils/util'
const h5Preview = process.env.VUE_APP_h5Preview
export default {
    props: ['data'],
    setup (props) {
        const state = reactive({
            count: 0,
            isLoading: false,
            loading: false,
            finished: false,
            refreshing: false,
            extraWeekVisible: false,
            lange: 'cn',
            canlendarType: 1,
            direction: 0,
            activeTab: 0,
            newsTypes: [
            ],
            newsList: [],
            lastWeek: [],
            weekdays: [],
            nextWeek: [],
            extraWeekDays: [],
            timeAxis: 0,
            firstFocusNewsParams: {},
            firstNewsFlashParams: {},
            focusNews: { // 要闻
                list: [],
                page: 1,
                pages: 1,
                refreshing: false,
                loading: false,
                finished: false,
                timeAxis: 0 // 记录最新一条的时间轴
            },
            newsFlash: { // 7x24
                list: [],
                page: 1,
                pages: 1,
                refreshing: false,
                loading: false,
                finished: false,
                timeAxis: 0 // 记录最新一条的时间轴
            },
            calendarList: [],
            filterCalendarList: [],
            lang: getCookie('lang') || getQueryString('lang') || 'en-US'
        })
        const { t } = useI18n({ useScope: 'global' })
        state.newsTypes = [
            {
                id: 7,
                name: t('information.focusNews')
            },
            {
                id: 8,
                name: t('information.newsFlash')
            },
            {
                id: 10,
                name: t('information.calendar')
            }
        ]
        state.firstFocusNewsParams = {
            page: 1,
            pageSize: h5Preview ? 2 : 10,
            type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
            orgid: props.data.orgid // 机构id
        }
        state.firstNewsFlashParams = {
            page: 1,
            pageSize: h5Preview ? 2 : 10,
            type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
            orgid: props.data.orgid // 机构id
        }
        const today = window.dayjs().format('YYYY年MM月DD日')
        // 倒序时间(刚刚，几分钟前，几个小时前，几天前，几周前，几个月前等)
        const beforeTime = (dateTimeStamp) => {
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
                // var Nhour =
                //     datetime.getHours() < 10
                //         ? '0' + datetime.getHours()
                //         : datetime.getHours()
                // var Nminute =
                //     datetime.getMinutes() < 10
                //         ? '0' + datetime.getMinutes()
                //         : datetime.getMinutes()
                // var Nsecond =
                //     datetime.getSeconds() < 10
                //         ? '0' + datetime.getSeconds()
                //         : datetime.getSeconds()
                result = Nyear + '-' + Nmonth + '-' + Ndate
            }
            return result
        }
        // const getNewsListByTypeByPage = (record) => {
        //     newsListByTypeByPage({
        //         page: 1,
        //         pageSize: 10,
        //         type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
        //         orgid: 2 // 机构id
        //     }, props.lang).then(({ data, page, pageSize, total }) => {
        //         if (Array.isArray(data) && data.length > 0) {
        //             state.newsList = data
        //             // getNewsListByTypeByPage(data[0])
        //         }
        //     })
        // }
        const getNewsListByType = (params, callback) => {
            newsListByTypeByPage(params, state.lang, props.data.newsArea).then(
                ({ data, pages, page }) => {
                    typeof (callback) === 'function' && callback({ data, pages, page })
                })
        }
        // const getNewsFlash = (callback) => {
        //     newsListByTypeByPage({
        //         page: 1,
        //         pageSize: 10,
        //         type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
        //         orgid: 2 // 机构id
        //     }, props.lang).then(({ data }) => {
        //         typeof (callback) === 'function' && callback()
        //         if (Array.isArray(data) && data.length > 0) {
        //             const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text.slice(11, 16) }))
        //             if (state.newsFlash.timeAxis > 0) {
        //                 const filterData = tempData.filter(el => el.addtime > state.newsFlash.timeAxis)
        //                 state.newsFlash.list = [...filterData, ...state.newsFlash.list]
        //             } else {
        //                 state.newsFlash.list = [...tempData]
        //             }
        //             state.newsFlash.timeAxis = data[0].addtime
        //         }
        //     })
        // }
        const onLoadFocusNews = () => { // 要闻上拉加载
            if (h5Preview && state.focusNews.list.length) {
                state.focusNews.finished = true
                return false
            }
            if (state.focusNews.list.length > 0) {
                state.focusNews.page++
            }
            getNewsListByType({ ...state.firstFocusNewsParams, page: state.focusNews.page }, ({ data, page, pages }) => {
                state.focusNews.loading = false
                if (state.focusNews.page >= pages) {
                    state.focusNews.finished = true
                }
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, updatetimeStr: beforeTime(el.updatetime * 1000) }))
                    state.focusNews.list = Number(page) > 1 ? [...state.focusNews.list, ...tempData] : tempData
                }
            })
        }
        const onLoadNewsFlash = () => { // 快讯上拉加载
            if (h5Preview && state.newsFlash.list.length) {
                state.newsFlash.finished = true
                return false
            }
            if (state.newsFlash.list.length > 0) {
                state.newsFlash.page++
            }
            getNewsListByType({ ...state.firstNewsFlashParams, page: state.newsFlash.page }, ({ data, page, pages }) => {
                state.newsFlash.loading = false
                if (state.newsFlash.page >= pages) {
                    state.newsFlash.finished = true
                }
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, ellipsis: true, shotTime: el.addtime_text.slice(11, 16) }))
                    state.newsFlash.list = Number(page) > 1 ? [...state.newsFlash.list, ...tempData] : tempData
                }
            })
        }
        const onFocusNewsRefresh = () => { // 要闻下拉刷新
            getNewsListByType(state.firstFocusNewsParams, ({ data }) => {
                state.focusNews.refreshing = false
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text }))
                    // if (state.focusNews.timeAxis > 0) {
                    //     const filterData = tempData.filter(el => el.addtime > state.focusNews.timeAxis)
                    //     state.focusNews.list = [...filterData, ...state.focusNews.list]
                    // } else {
                    //     state.focusNews.list = [...tempData]
                    // }
                    state.focusNews.list = [...tempData]
                    state.focusNews.timeAxis = data[0].addtime
                }
            })
        }
        const onNewsFlashRefresh = () => { // 快讯下拉刷新
            getNewsListByType(state.firstNewsFlashParams, ({ data }) => {
                state.newsFlash.refreshing = false
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text.slice(11, 16) }))
                    // if (state.newsFlash.timeAxis > 0) {
                    //     const filterData = tempData.filter(el => el.addtime > state.newsFlash.timeAxis)
                    //     state.newsFlash.list = [...filterData, ...state.newsFlash.list]
                    // } else {
                    //     state.newsFlash.list = [...tempData]
                    // }
                    state.newsFlash.list = [...tempData]
                    state.newsFlash.timeAxis = data[0].addtime
                }
            })
        }

        const getCalendar = (timeAxis) => {
            state.timeAxis = timeAxis
            canlendarListByDate({
                timestamp: timeAxis
            }, state.lang, props.data.newsArea).then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    state.calendarList = data
                    changeCanlendarType(state.canlendarType)
                }
            })
        }
        const tabClick = (name) => {
            if (name === 1 && state.newsFlash.list.length === 0) {
                onLoadNewsFlash()
            }
            if (name === 2 && state.calendarList.length === 0) {
                renderCalendar()
            }
        }
        const getArticleDetail = ({ id, orgid }) => {
            articleDetail({
                id,
                orgid
            }).then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    state.calendarList = data
                }
            })
        }
        const showExtraWeekDays = (dir) => {
            if (state.extraWeekVisible) {
                state.extraWeekVisible = false
                state.direction = 0
            } else {
                state.extraWeekVisible = true
                state.direction = dir
            }
            state.extraWeekDays = dir === -1 ? state.lastWeek : state.nextWeek
        }
        const renderCalendar = (time) => {
            const weekLang = [
                t('information.monday'),
                t('information.tuesday'),
                t('information.wednesday'),
                t('information.thursday'),
                t('information.friday'),
                t('information.saturday'),
                t('information.sunday')
            ]
            // 星期几

            const dayOfWeek = window.dayjs(time).day()
            const computeTime = dayOfWeek === 0 ? (time - 86400000) : time
            const startWeek = window.dayjs(computeTime).startOf('week')
            const computeDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek
            const tempTimeAxis = startWeek.add(computeDayOfWeek, 'day').valueOf()
            state.lastWeek = [-6, -5, -4, -3, -2, -1, 0].map((item, index) => ({ weekday: weekLang[index], timeAxis: startWeek.add(item, 'day').valueOf(), date: startWeek.add(item, 'day').format('MM/DD') }))
            state.weekdays = [1, 2, 3, 4, 5, 6, 7].map((item, index) => ({ weekday: weekLang[index], timeAxis: startWeek.add(item, 'day').valueOf(), date: startWeek.add(item, 'day').format('MM/DD') }))
            state.nextWeek = [8, 9, 10, 11, 12, 13, 14].map((item, index) => ({ weekday: weekLang[index], timeAxis: startWeek.add(item, 'day').valueOf(), date: startWeek.add(item, 'day').format('MM/DD') }))
            state.extraWeekVisible = false
            getCalendar(tempTimeAxis)
        }
        const changeCanlendarType = (val) => {
            state.canlendarType = val
            state.filterCalendarList = state.calendarList.filter(el => el.type === val)
        }

        renderCalendar()
        return {
            state,
            today,
            getNewsListByType,
            getCalendar,
            getArticleDetail,
            tabClick,
            renderCalendar,
            changeCanlendarType,
            showExtraWeekDays,
            onNewsFlashRefresh,
            onFocusNewsRefresh,
            onLoadFocusNews,
            onLoadNewsFlash
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.m-infoflow_title {
    padding: rem(20px) rem(30px);
    color: var(--color);
    font-size: rem(34px);
}
.container {
    :deep(.van-tabs__wrap) {
        position: sticky;
        top: -1px;
        right: 0;
        left: 0;
        z-index: 100;
        height: rem(80px);
        background: var(--contentColor);
        border: none;
        border-bottom: 1px solid var(--lineColor);
    }
    :deep(.van-tab) {
        color: var(--placeholdColor);
        font-size: rem(30px);
        line-height: 40px;
    }
}
.extra-tabpanel {
    padding: 0 rem(28px);
}
.new {
    padding: 0 rem(26px);
    .new-con {
        display: flex;
        flex-direction: row;
        padding: rem(26px) 0;
        border-color: var(--lineColor);
        border-bottom-width: 1px;
        border-bottom-style: solid;
        .new-left {
            flex: 1;
        }
        .new-desc {
            display: -webkit-box;
            min-height: rem(106px);
            max-height: rem(160px);
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            a {
                display: block;
                color: var(--color);
                font-size: rem(30px);
                line-height: rem(54px);
                span {
                    height: rem(34px);
                    margin-right: 5px;
                    padding: rem(4px);
                    color: var(--placeholdColor);
                    font-size: rem(18px);
                    background-color: var(--riseColor);
                    border: 1px solid var(--riseColor);
                    border-radius: 2px;
                }
            }
        }
        .new-source {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            height: rem(54px);
            span {
                color: var(--placeholdColor);
                font-size: rem(26px);
            }
        }
        .new-right {
            margin-left: rem(26px);
            img {
                width: rem(240px);
                height: rem(160px);
                border-radius: rem(14px);
            }
        }
    }
}
.story-date {
    padding: 0 rem(26px);
    color: var(--placeholdColor);
    font-weight: 700;
    font-size: rem(26px);
    line-height: rem(80px);
}
.story-item {
    position: relative;
    padding-left: rem(32px);
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background-color: var(--lineColor);
        content: '';
    }
    &::after {
        position: absolute;
        top: rem(32px);
        left: rem(-6px);
        width: rem(14px);
        height: rem(14px);
        background-color: var(--lineColor);
        border-radius: rem(14px);
        content: '';
    }
    .icon-yuandianxiao {
        position: absolute;
        top: rem(14px);
        left: rem(-18px);
        color: var(--assistColor);
        font-size: rem(40px);
    }
    .story-time {
        padding-top: rem(22px);
        padding-bottom: rem(6px);
        color: var(--placeholdColor);
        font-size: rem(26px);
    }
    .story-text {
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(52px);
        &.story-ellipsis {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }
}
.self-container {
    padding: 0.2rem 0;
    .self-content {
        display: flex;
        flex-direction: column;
        .item {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: space-between;
            justify-items: center;
            margin-bottom: 15px;
            .flag {
                width: rem(96px);
                height: rem(96px);
                overflow: hidden;
                border-radius: 50%;
                img {
                    display: block;
                    max-width: 100%;
                    border: none;
                    outline: none;
                }
            }
            .info {
                display: flex;
                flex: 0 0 83%;
                flex-direction: column;
                justify-content: space-between;
                min-height: rem(160px);
                padding-bottom: 15px;
                color: var(--minorColor);
                border-bottom: 1px solid var(--lineColor);
                .top {
                    display: flex;
                    align-items: center;
                    margin-bottom: rem(14px);
                }
                .middle {
                    margin-bottom: 10px;
                    color: var(--normalColor);
                    font-size: rem(28px);
                    line-height: rem(52px);
                    text-align: justify;
                }
                .bottom {
                    display: flex;
                    font-size: rem(18px);
                    line-height: rem(28px);
                    span {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
.canlendar {
    .self-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0.93333rem;
        background-color: var(--bgColor);
        span {
            display: block;
            height: 0.53333rem;
            padding: 0 10px;
            color: var(--color);
            font-size: 0.32rem;
            line-height: 0.53333rem;
            border: 1px solid var(--contentColor);
            &.t1 {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }
            &.t2 {
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
            }
            &.actived {
                color: var(--primary);
                background-color: var(--contentColor);
            }
        }
    }
    .week-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 1.06667rem;
        margin: 15px 0;
        .prev,
        .next {
            align-self: center;
            width: 0.56rem;
            height: 0.56rem;
            font-style: normal;
            line-height: 0.56rem;
            text-align: center;
            transition: all 0.3s ease;
            i {
                vertical-align: middle;
            }
            &.actived {
                background-color: var(--primary);
                border-radius: 50%;
                transform: rotate(270deg);
                i {
                    color: var(--contentColor);
                }
            }
        }
        .next {
            &.actived {
                transform: rotate(90deg);
            }
        }
    }
    .week-wrap {
        position: relative;
        display: flex;
        flex: 1;
        .week,
        .extra-week {
            display: flex;
            justify-content: space-between;
            width: 100%;
            &>div {
                padding: rem(10px) rem(6px);
                border-radius: rem(6px);
            }
            .actived {
                color: var(--primary);
                background-color: var(--bgColor);
            }
        }
        .extra-week {
            position: absolute;
            top: 100%;
            width: 100%;
            background-color: var(--bgColor);
            border-radius: 0.26667rem;
        }
    }
}
:deep(.van-checkbox__icon--checked .van-icon) {
    color: var(--van-white)!important;
    background-color: var(--primary)!important;
    border-color: var(--primary)!important;
}
</style>
