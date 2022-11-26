<template>
    <div v-loading='loading' class='calendar-module'>
        <div class='tabs'>
            <span :class="{ 'active': canlendarType === 1 }" @click='changeCanlendarType(1)'>
                {{ $t('information.data') }}
            </span>
            <span :class="{ 'active': canlendarType === 2 }" @click='changeCanlendarType(2)'>
                {{ $t('information.event') }}
            </span>
        </div>
        <div class='week-case'>
            <div class='prev' @click.stop='showExtraWeekDays(-1)'>
                <i class='el-icon-arrow-left'></i>
            </div>
            <ul class='week-list'>
                <li
                    v-for='week in weekdays'
                    :key='week.timeAxis'
                    :class='{ item: true, active : timeAxis === week.timeAxis }'
                    @click='getCalendar(week.timeAxis)'
                >
                    <span>{{ week.weekday }}</span>
                    <span>{{ week.date }}</span>
                </li>
            </ul>
            <div class='next' @click.stop='showExtraWeekDays(1)'>
                <i class='el-icon-arrow-right'></i>
            </div>
            <!-- 上、下周数据弹窗 -->
            <div v-if='extraWeekVisible' class='week-dialog'>
                <ul class='week-list'>
                    <li
                        v-for='week in extraWeekDays'
                        :key='week.timeAxis'
                        :class='{ item: true, active : timeAxis === week.timeAxis }'
                        @click='getCalendar(week.timeAxis)'
                    >
                        <span>{{ week.weekday }}</span>
                        <span>{{ week.date }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if='filterCalendarList.length > 0' class='calendar-list'>
            <ul>
                <li v-for='calendar in filterCalendarList' :key='calendar.id'>
                    <img :src='`http://cdn.jin10.com/assets/img/commons/flag/flash/${calendar.country}.png`' />
                    <div class='info'>
                        <p class='title'>
                            {{ calendar.text }}
                        </p>
                        <p class='row'>
                            <span>{{ $t('information.previous') }}：{{ calendar.prev_value }}</span>
                            <span>{{ $t('information.expect') }}：{{ calendar.expect }}</span>
                            <span>{{ $t('information.publish') }}：{{ calendar.public_value }}</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <el-empty v-else :description="$t('c.noData')" />
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed, onActivated, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { canlendarListByDate } from '@/api/information'

export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
        moduleId: {
            type: String,
            default: ''
        },
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const newsArea = computed(() => props.data.newsArea)
        const state = reactive({
            // 加载状态
            loading: false,
            // 当前语言
            lang: getCookie('lang') || 'zh-CN',
            // 类型
            canlendarType: 1,
            // 全部数据
            calendarList: [],
            // 根据类型筛选后的数据
            filterCalendarList: [],
            // 上周周数据
            lastWeek: [],
            // 当周周数据
            weekdays: [],
            // 下周周数据
            nextWeek: [],
            // 弹窗周数据
            extraWeekDays: [],
            // 是否显示弹窗
            extraWeekVisible: false,
            // 当前时间戳
            timeAxis: 0,
            // 方向
            direction: 0
        })

        // 改变类型
        const changeCanlendarType = (val) => {
            state.canlendarType = val
            state.filterCalendarList = state.calendarList.filter(el => el.type === val)
        }

        // 获取数据
        const getCalendar = (timeAxis) => {
            state.loading = true
            state.timeAxis = timeAxis
            canlendarListByDate({
                timestamp: timeAxis
            }, state.lang, newsArea.value).then(data => {
                state.loading = false
                if (Array.isArray(data) && data.length > 0) {
                    state.calendarList = data
                    changeCanlendarType(state.canlendarType)
                }
            })
        }

        // 生成周数据
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
            state.lastWeek = [-6, -5, -4, -3, -2, -1, 0].map((item, index) => ({
                weekday: weekLang[index],
                timeAxis: startWeek.add(item, 'day').valueOf(),
                date: startWeek.add(item, 'day').format('MM/DD')
            }))
            state.weekdays = [1, 2, 3, 4, 5, 6, 7].map((item, index) => ({
                weekday: weekLang[index],
                timeAxis: startWeek.add(item, 'day').valueOf(),
                date: startWeek.add(item, 'day').format('MM/DD')
            }))
            state.nextWeek = [8, 9, 10, 11, 12, 13, 14].map((item, index) => ({
                weekday: weekLang[index],
                timeAxis: startWeek.add(item, 'day').valueOf(),
                date: startWeek.add(item, 'day').format('MM/DD')
            }))
            state.extraWeekVisible = false
            getCalendar(tempTimeAxis)
        }

        // 显示、隐藏周数据选择弹窗
        const showExtraWeekDays = (dir) => {
            state.extraWeekVisible = true
            state.direction = dir
            state.extraWeekDays = dir === -1 ? state.lastWeek : state.nextWeek
        }

        onMounted(() => {
            renderCalendar()
        })

        onActivated(() => {
            document.addEventListener('click', () => {
                state.extraWeekVisible = false
            })
        })

        onDeactivated(() => {
            document.removeEventListener('click', () => {})
        })

        return {
            ...toRefs(state),
            changeCanlendarType,
            getCalendar,
            renderCalendar,
            showExtraWeekDays
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.calendar-module {
    .tabs {
        display: flex;
        span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 32px;
            margin-right: 20px;
            font-size: 16px;
            color: var(--color);
            border-radius: 4px;
            cursor: pointer;
        }
        .active {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
    }
}
.week-case {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 32px;
    position: relative;
    .prev, .next {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        background: var(--bgColor);
        border-radius: 50%;
        cursor: pointer;
        i {
            color: var(--minorColor);
        }
        &:hover {
            background: var(--primaryAssistColor);
            i {
                color: var(--primary);
            }
        }
    }
}
.week-dialog {
    display: flex;
    width: 100%;
    padding: 5px 0;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: 50px;
    box-shadow: 0 0 5px rgba(0,0,0,.2);
}
.week-list {
    display: flex;
    justify-content: space-around;
    flex: 1;
    .item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
        font-size: 14px;
        color: var(--color);
        border-radius: 5px;
        cursor: pointer;
    }
    .active {
        color: var(--primary);
        background: var(--primaryAssistColor);
    }
}
.calendar-list {
    @include scroll-pc();
    height: 460px;
    margin-top: 20px;
    overflow-y: auto;
    li {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        &:last-of-type {
            margin-bottom: 0;
        }
        img {
            width: 46px;
            height: 46px;
        }
        .info {
            padding: 0 20px;
            .title {
                font-size: 16px;
                color: var(--color);
            }
            .row {
                margin-top: 4px;
                font-size: 14px;
                color: var(--minorColor);
                span {
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>
