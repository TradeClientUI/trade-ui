<template>
    <Top>
        <template #center>
            <p class='topTitle'>
                {{ $t($route.meta.title) }}
            </p>
        </template>
    </Top>
    <Loading :show='loadingPage' />
    <div class='page-wrap'>
        <div class='oper-area'>
            <van-dropdown-menu>
                <van-dropdown-item ref='proDownItem' :title='proTitle || $t("fund.allItem")'>
                    <div class='condition'>
                        <p class='title'>
                            {{ $t('common.item') }}
                        </p>
                        <van-button
                            v-for='(item,val) in proBtns'
                            :key='val'
                            :class='{ active: Number(proCurr) === Number(val) }'
                            plain
                            size='small'
                            @click='onProbtn(item,val)'
                        >
                            {{ item }}
                        </van-button>
                    </div>
                    <div class='condition'>
                        <p class='title'>
                            {{ $t('fund.flow') }}
                        </p>
                        <van-button
                            v-for='item in directionBtns'
                            :key='item.value'
                            :class='{ active: directionCur === item.value }'
                            plain
                            size='small'
                            @click='onDirectbtn(item)'
                        >
                            {{ item.name }}
                        </van-button>
                    </div>
                    <div class='btns'>
                        <van-button class='reset-btn' plain size='small' type='primary' @click='reset'>
                            {{ $t('fund.reset') }}
                        </van-button>
                        <van-button size='small' type='primary' @click='handleProConfirm'>
                            {{ $t('common.complete') }}
                        </van-button>
                    </div>
                </van-dropdown-item>
                <van-dropdown-item ref='dateDownItem' :title='dateTitle || $t("fund.allDayTime")'>
                    <div class='condition'>
                        <p class='title'>
                            {{ $t('common.time') }}
                        </p>
                        <van-button
                            v-for='item in dateBtns'
                            :key='item.value'
                            :class='{ active: dateCur === item.value }'
                            plain
                            size='small'
                            @click='onDate(item)'
                        >
                            {{ item.name }}
                        </van-button>
                        <!-- <van-cell title='选择日期区间' :value='date'  /> -->
                        <van-field v-model='date' :default-date='defaultDate' :label='$t("fund.timeZone")' :placeholder='$t("fund.selectTimeZone")' @click='showCalendar = true' />
                        <van-calendar
                            v-model='dateRange'
                            v-model:show='showCalendar'
                            :allow-same-day='true'
                            :min-date='minDate'
                            type='range'
                            @confirm='onConfirm'
                        />
                    </div>
                    <div class='btns'>
                        <van-button class='reset-btn' plain size='small' type='primary' @click='dateReset'>
                            {{ $t('fund.reset') }}
                        </van-button>
                        <van-button size='small' type='primary' @click='dateConfirm'>
                            {{ $t('common.complete') }}
                        </van-button>
                    </div>
                </van-dropdown-item>
            </van-dropdown-menu>
        </div>
        <div class='list'>
            <van-pull-refresh
                v-model='loading'
                :loading-text="$t('compLang.loading')"
                :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                @refresh='onRefresh'
            >
                <van-list
                    v-model:loading='loading'
                    :finished='finished'
                    :finished-text='finishedText'
                    :immediate-check='false'
                    :loading-text="$t('compLang.loading')"
                    @load='onLoad'
                >
                    <div v-if='list.length === 0'>
                        <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                    </div>
                    <div v-for='(item,index) in list' :key='index' class='fund-item'>
                        <div class='f-left'>
                            <p class='title'>
                                {{ proBtns[item.businessType] }}
                            </p>
                            <p class='date'>
                                {{ formatTime(item.createTime) }}
                            </p>
                        </div>
                        <div class='f-right'>
                            <p class='amount'>
                                {{ item.amount }} {{ item.currency }}
                            </p>
                            <p class='balance'>
                                {{ $t('common.balance') + item.amountAfter }} {{ item.currency }}
                            </p>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, ref, computed, onBeforeMount } from 'vue'
import { queryCapitalFlowList } from '@/api/user'
import Top from '@/components/top'
import { useStore } from 'vuex'
import { isEmpty, priceFormat } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
export default {
    components: {
        Top,
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const proDownItem = ref(null)
        const dateDownItem = ref(null)
        const { t, tm } = useI18n({ useScope: 'global' })
        const customInfo = computed(() => store.state._user.customerInfo)
        const proBtns = tm('fund.proBtns')

        const directionBtns = tm('fund.directionBtns')
        const dateBtns = tm('fund.dateBtns')

        const state = reactive({
            proCurr: 0, // 业务类型
            directionCur: 0, // 流向
            dateCur: 0, // 时间
            proTitle: t('fund.allItem'),
            dateTitle: t('fund.allDayTime'),
            date: '', // 日期
            minDate: new Date('2018-01-01'),
            showCalendar: false,
            dateRange: [],
            defaultDate: [],
            list: [],
            finished: false,
            loading: false,
            loadingMore: false,
            loadingPage: false,
            finishedText: t('common.noMore'),
            pagigation: {
                size: 20,
                current: 1,
            }
        })

        const onRefresh = () => {
            state.pagigation.current = 1
            state.finished = false
            state.loading = false
            state.loadingMore = true
            state.list = []
            queryFundDetail()
        }

        const onProbtn = (item, val) => {
            state.proCurr = val
            state.proTitle = item
        }

        const onDirectbtn = (item) => {
            state.directionCur = item.value
        }

        const onDate = (item) => {
            state.dateTitle = item.name
            if (item.value === 1) {
                state.date = window.dayjs(new Date()).format('YYYY/MM/DD 00:00:00') + '-' + window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')
            } else if (item.value === 2) {
                state.date = window.dayjs().subtract(7, 'day').format('YYYY/MM/DD') + '-' + window.dayjs(new Date()).format('YYYY/MM/DD')
                state.dateRange = [window.dayjs().subtract(7, 'day').format('YYYY/MM/DD'), window.dayjs(new Date()).format('YYYY/MM/DD')]
            } else if (item.value === 3) {
                state.date = window.dayjs().subtract(1, 'month').format('YYYY/MM/DD') + '-' + window.dayjs(new Date()).format('YYYY/MM/DD')
            } else if (item.value === 4) {
                state.date = window.dayjs().subtract(3, 'month').format('YYYY/MM/DD') + '-' + window.dayjs(new Date()).format('YYYY/MM/DD')
            } else if (item.value === 0) {
                state.date = ''
            }

            state.dateCur = item.value
        }

        const reset = () => {
            state.proCurr = 0
            state.directionCur = 0
            state.proTitle = t('fund.allItem')
        }

        const handleProConfirm = () => {
            proDownItem.value.toggle()
            state.pagigation.current = 1
            state.list = []
            state.finished = false
            state.loadingMore = true
            queryFundDetail()
        }

        const onConfirm = (values) => {
            state.dateCur = 99
            const [start, end] = values
            state.showCalendar = false
            state.date = `${formatDate(start)} - ${formatDate(end)}`
            state.dateTitle = state.date
        }

        const dateConfirm = () => {
            if (!isEmpty(state.date)) {
                state.startTime = new Date(state.date.split('-')[0]).getTime()
                state.endTime = new Date(window.dayjs(state.date.split('-')[1])).getTime()
            } else {
                state.startTime = 0
                state.endTime = 0
            }
            dateDownItem.value.toggle()
            state.pagigation.current = 1
            state.finished = false
            state.loadingMore = true
            state.list = []
            queryFundDetail()
        }

        const dateReset = () => {
            state.date = ''
            state.dateCur = 0
            state.dateTitle = t('fund.allDayTime')
        }

        const formatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

        // 底部加载更多
        const onLoad = () => {
            if (!state.loadingMore) {
                state.pagigation.current++
                queryFundDetail()
            }
        }

        const queryFundDetail = () => {
            const params = {
                size: state.pagigation.size,
                tradeType: parseInt(route.query.tradeType),
                current: state.pagigation.current,
                status: 2, // 状态。1-初始化；2-处理成功；3-处理失败；
                startTime: state.startTime,
                endTime: state.endTime,
                operate: state.directionCur, // 1.增加，2.减少；
                businessType: state.proCurr // 业务类型
            }
            state.loadingPage = true
            queryCapitalFlowList(params).then(res => {
                state.loadingPage = false
                state.loading = false
                state.loadingMore = false
                if (res.check()) {
                    if (res.data.records.length > 0) {
                        state.list = [...state.list, ...res.data.records]
                    }

                    // 数据全部加载完成
                    if (state.list.length >= res.data.total) {
                        state.finished = true
                        state.loadingMore = true
                        state.finishedText = t('common.noMore')
                    }

                    if (res.data.total === 0) {
                        state.finishedText = ''
                    }
                }
            }).catch(err => {
                state.loadingMore = false
                state.loadingPage = false
                state.loading = false
            })
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onBeforeMount(() => {
            queryFundDetail()
        })

        return {
            proBtns,
            directionBtns,
            dateConfirm,
            onProbtn,
            onDirectbtn,
            dateBtns,
            reset,
            proDownItem,
            onDate,
            onLoad,
            handleProConfirm,
            onRefresh,
            dateCur: 99,
            onConfirm,
            dateReset,
            dateDownItem,
            queryFundDetail,
            formatTime,
            customInfo,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.topTitle {
    flex: 1;
    color: var(--color);
    text-align: center;
}
.page-wrap {
    flex: 1;
    overflow: auto;
    background: var(--bgColor);
    .oper-area {
        :deep(.van-dropdown-menu__bar) {
            background-color: var(--contentColor);
            .van-ellipsis {

            }
            .van-dropdown-menu__title {
                color: var(--color);
                &.van-dropdown-menu__title--active {
                    color: var(--primary);
                }
            }
        }
        :deep(.van-popup) {
            background-color: var(--contentColor);
        }
        .condition {
            margin-top: rem(20px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            .title {
                color: var(--color);
                line-height: rem(60px);
            }
            .van-button {
                margin-right: rem(20px);
                margin-bottom: rem(20px);
                padding: 0 rem(13px);
                color: var(--color);
                background: var(--contentColor);
                &.active {
                    color: var(--primary);
                    border-color: var(--primary);
                }
            }
        }
        .btns {
            display: flex;
            justify-content: space-around;
            margin: rem(20px) 0;
            .van-button {
                flex: 1;
                margin: 0 rem(20px);
                padding: 0 rem(30px);
                background-color: var(--primary);
                &.reset-btn {
                    color: var(--color);
                    background-color: var(--primaryAssistColor);
                    border: none;
                }
            }
        }
    }
    .list {
        height: calc(100% - 50px);
        .van-pull-refresh {
            height: 100%;
            overflow: scroll;
        }
        .fund-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            //margin: rem(30px);
            padding: rem(30px);
            line-height: rem(50px);
            background: var(--contentColor);
            border-bottom: solid 1px var(--lineColor);
            .f-left {
                .title {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    font-family: PingFang SC;
                }
                .date {
                    color: var(--normalColor);
                    font-weight: 400;
                    font-family: DIN 1451 Mittelschrift;
                }
            }
            .f-right {
                .amount {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    font-family: DIN 1451 Mittelschrift;
                    text-align: right;
                }
                .balance {
                    color: var(--normalColor);
                    font-weight: 500;
                    font-family: PingFang SC;
                }
            }
        }
    }
}
</style>
