<template>
    <Top back left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true'>
        <template #right>
        </template>
    </Top>
    <Loading :show='pageLoading' />
    <div class='filter-wrap'>
        <van-dropdown-menu :active-color='style.primary' :overlay='true'>
            <!-- <van-dropdown-item
                v-model='typeVal'
                :options='typeList'
                @change='changeType'
            /> -->
            <van-dropdown-item
                v-model='currencyVal'
                :options='currencyList'
                @change='changeCurrency'
            />
            <van-dropdown-item
                ref='timeDropdown'
                v-model='timeVal'
                :options='timeList'
                @change='timeChange'
            >
                <template v-if='timeVal === 5' #title>
                    {{ customDate }}
                </template>
                <template #default>
                    <dateRange :is-selected='timeVal === 5' @change='onRangeChange' />
                </template>
            </van-dropdown-item>
        </van-dropdown-menu>
    </div>
    <div class='page-wrap'>
        <div class='record-list'>
            <van-pull-refresh
                v-model='loading'
                :loading-text="$t('compLang.loading')"
                :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                @refresh='onRefresh'
            >
                <div v-if='list.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <van-list
                    v-else
                    v-model:loading='loading'
                    :finished='finished'
                    :finished-text='finishedText'
                    :immediate-check='false'
                    :loading-text="$t('compLang.loading')"
                    @load='onLoad'
                >
                    <deposit-record-list :list='list' :type='typeVal.toString()' />
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Top from '@/components/top'
import { useStore } from 'vuex'
import { getDepositCoinList, queryDepositPageList } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import dateRange from '@plans/components/dateRange'
import depositRecordList from './components/deposit-record-list.vue'

export default {
    components: {
        Top,
        dateRange,
        depositRecordList
    },
    setup (props) {
        const route = useRoute()
        const store = useStore()
        const { type, currency } = route.query
        const { t } = useI18n({ useScope: 'global' })
        // 获取账户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        const style = computed(() => store.state.style)

        const state = reactive({
            loading: false,
            size: 20,
            current: 1,
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
            list: [],
            finishedText: t('common.noMore'),
            finished: false,
            pageLoading: false,
            customDate: '',
            timeVal: 2,
            timeList: [
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMonth'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 }
            ],
            typeVal: Number(type) || 2,
            typeList: [
                { text: '汇兑', value: 2 },
                { text: '直充', value: 1 }
            ],
            currencyVal: 0,
            currencyList: [
                { text: t('common.all'), value: 0 }
            ]
        })

        const onRefresh = () => {
            state.current = 1
            state.finished = false
            state.list = []
            getRecordList()
        }

        // 获取客户支持的存款币种列表
        const queryDepositCoinList = () => {
            getDepositCoinList({ clientType: 'mobile' }).then(res => {
                const result = []
                res.data.map((el, index) => {
                    result.push({ text: el, value: index + 1 })
                })
                if (currency) {
                    const item = result.find(el => el.text === currency)
                    if (item) state.currencyVal = item.value
                }

                state.currencyList = state.currencyList.concat(result)

                // 获取列表数据
                getRecordList()
            })
        }

        const getRecordList = () => {
            const params = {
                customerNo: customerInfo.value.customerNo,
                depositCurrency: state.currencyVal === 0 ? '' : state.currencyList[state.currencyVal].text,
                size: state.size,
                current: state.current,
                startTime: state.startTime,
                endTime: state.endTime
            }
            state.pageLoading = true
            queryDepositPageList(params).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    const resdata = res.data
                    if (resdata.records && resdata.records.length > 0) {
                        state.loading = false
                        state.list = state.list.concat(resdata.records)
                        // 数据全部加载完成
                        if (resdata.current * resdata.size >= resdata.total) {
                            state.finished = true
                        }
                        if (isEmpty(res.data.records)) {
                            state.finishedText = ''
                        }
                    }
                }
            }).catch(err => {
                state.pageLoading = false
            })
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 时间筛选
        const timeChange = (timeType) => {
            if (timeType === 0) {
                state.startTime = -1
                state.endTime = -1
            } else if (timeType === 1) {
                state.startTime = window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 00:00:00')).valueOf()
            } else if (timeType === 2) {
                state.startTime = window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 3) {
                state.startTime = window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 4) {
                state.startTime = window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf()
            }
            onRefresh()
        }

        // 选择自定义时间
        const onRangeChange = (timeList) => {
            state.timeVal = 5
            if (timeList.length > 1) {
                state.startTime = timeList[0]
                state.endTime = timeList[1]
                state.customDate = window.dayjs(timeList[0]).format('YYYY/MM/DD') + '-' + window.dayjs(timeList[1]).format('YYYY/MM/DD')
            }
            onRefresh()
        }

        // 选择类型
        const changeType = () => {
            onRefresh()
        }

        // 选择币种
        const changeCurrency = () => {
            onRefresh()
        }

        // 底部加载更多
        const onLoad = () => {
            state.current++
            getRecordList()
        }

        onMounted(() => {
            // 获取存款支持的币种
            queryDepositCoinList()
        })

        return {
            style,
            ...toRefs(state),
            onRefresh,
            formatTime,
            onLoad,
            timeChange,
            onRangeChange,
            queryDepositCoinList,
            changeType,
            changeCurrency
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: var(--bgColor);
}
.filter-wrap {
    :deep(.van-dropdown-menu) {
        .van-dropdown-menu__bar {
            align-items: center;
            padding: 0 rem(10px);
            background: var(--bgColor);
            box-shadow: none;
            .van-dropdown-menu__item {
                position: relative;
                justify-content: space-between;
                height: rem(60px);
                margin: 0 rem(10px);
                padding: 0 rem(5px);
                background: var(--contentColor);
                border-radius: rem(6px);
                .van-dropdown-menu__title {
                    position: static;
                    color: var(--color);
                    font-size: rem(20px);
                    &::after {
                        right: rem(15px);
                        border-color: transparent transparent  var(--normalColor) var(--normalColor);
                    }
                }
                .van-cell__title {
                    span {
                        color: var(--color);
                        font-size: rem(20px);
                    }
                }
            }
        }
        .van-dropdown-item__option {
            font-size: rem(20px);
        }
    }
}
</style>
