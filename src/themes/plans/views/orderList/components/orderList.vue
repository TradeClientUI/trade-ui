<template>
    <div class='filter-wrap'>
        <van-dropdown-menu :active-color='primaryColor' :overlay='true'>
            <van-dropdown-item
                v-model='directionVal'
                :options='direction'
                @change='dirdctionChange'
            />
            <van-dropdown-item
                ref='productDropdown'
                v-model='productVal'
                :options='product'
                @change='productChange'
                @click='openProductDropdown'
            />
            <van-dropdown-item
                v-if='[1,2].indexOf(Number(tradeType)) > -1'
                v-model='positionTypeVal'
                :options='positionType'
                @change='positionTypeChange'
            />
            <van-dropdown-item
                v-if='[3, 5, 9].indexOf(Number(tradeType)) > -1'
                v-model='positionTypeVal'
                :options='priceTypeList'
                @change='positionTypeChange'
            />
            <van-dropdown-item
                ref='timeDropdown'
                v-model='timeVal'
                :options='timeList'
                @change='timeChange'
            >
                <template #title v-if='timeVal === 5'>
                    {{ customDate }}
                </template>
                <template #default>
                    <dateRange :is-selected='timeVal === 5' @change='onRangeChange' />
                </template>
            </van-dropdown-item>
        </van-dropdown-menu>
    </div>
    <div class='list-wrap'>
        <div v-if='recordList.length === 0'>
            <van-empty :description='$t("trade.noDealData")' image='/images/empty.png' />
        </div>
        <van-list
            :finished='finished'
            :finished-text='finishedText'
            :immediate-check='false'
            :loading-text="$t('compLang.loading')"
            @load='onLoad'
        >
            <dealItem
                v-for='(item, index) in recordList'
                :key='index'
                :biz-type-text='bizTypeText'
                :item='item'
                :trade-type='tradeType'
            />
        </van-list>
    </div>

    <Loading :show='loading' />

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct
        v-model='switchProductVisible'
        :default-trade-type='tradeType'
        :hide-trade-type='true'
        @select='onSelectProduct'
    />
</template>

<script>
import dealItem from '@plans/modules/deal/dealItem.vue'
import sidebarProduct from '@plans/components/sidebarProduct.vue'
import { tradeRecordList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { useRoute, } from 'vue-router'
import { computed, ref, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import dateRange from '@plans/components/dateRange'
import Base from '@/store/modules/base'

export default {
    components: {
        dealItem,
        sidebarProduct,
        dateRange
    },
    setup (props) {
        const route = useRoute()
        const store = useStore()
        const productDropdown = ref(null)
        const timeDropdown = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            switchProductVisible: false,
            directionVal: -1,
            positionTypeVal: -1,
            timeVal: 2,
            productVal: 0,
            curProduct: {},
            customDate: '',
            direction: [
                { text: t('trade.direction'), value: -1 },
                { text: t('trade.buy'), value: 1 },
                { text: t('trade.sell'), value: 2 },
            ],
            positionType: [
                { text: t('trade.openClose'), value: -1 },
                { text: t('trade.openPosition'), value: 1 },
                { text: t('trade.closePosition'), value: 2 },
            ],
            timeList: [
                // { text: t('common.allDate'), value: 0 },
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMonth'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 }

            ],
            priceTypeList: [
                { text: t('trade.priceOrLimit'), value: -1 },
                { text: t('trade.orderTypeShort1'), value: 3 },
                { text: t('trade.orderTypeShort2'), value: 4 },
            ],
            product: [
                { text: t('common.allProduct'), value: 0 },
                { text: t('common.chooseProduct'), value: 1, },
            ],
            recordList: [],
            bizTypeText: {},
            params: {
                current: 1,
                size: 20,
                executeStartTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
                executeEndTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf()
            },
            tradeType: route.query.tradeType,
            loading: false,
            finished: false,
            finishedText: t('common.noMore'),
            loadingMore: false,

        })

        const account = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        // 价格标签
        const priceLabel = (bizType) => {
            if ([1, 2, 3].indexOf(Number(bizType)) > -1) {
                return t('trade.dealPrice')
            } else if ([4, 5, 6, 7, 8].indexOf(Number(bizType)) > -1) {
                return t('trade.positionPrice')
            }
        }

        // 产品选择品选择产品回调
        const onSelectProduct = (p) => {
            state.curProduct = p
            state.product[1].text = p.symbolName
            state.switchProductVisible = false
            resetParams()
            state.params.symbolId = p.symbolId
            queryRecordList()
        }

        // 重置参数
        const resetParams = () => {
            state.params.current = 1
            state.finished = false
            state.loadingMore = true
            // state.params.symbolId = ''
            state.recordList = []
        }

        const queryRecordList = () => {
            state.loading = true
            const accountIds = []
            if (account.value.length > 0) {
                account.value.forEach(element => {
                    accountIds.push(element.accountId)
                })
            }

            const params = {
                accountIds: accountIds.toString(),
                tradeType: Number(state.tradeType),
                sortFieldName: 'executeTime',
                sortType: 'desc',
                ...state.params
            }

            tradeRecordList(params).then(res => {
                state.loading = false
                state.loadingMore = false

                if (res.check()) {
                    state.recordList = state.recordList.concat(res.data.list)
                    state.bizTypeText = res.data.bizTypeText

                    // 数据全部加载完成
                    if (state.params.current >= res.data.totalPage) {
                        state.finished = true
                        state.loadingMore = true
                        state.finishedText = t('common.noMore')
                    }
                    if (state.recordList.length === 0) {
                        state.finishedText = ''
                    }
                }
            }).catch(err => {
                state.loadingMore = false
                state.loading = false
            })
        }

        // 底部加载更多
        const onLoad = () => {
            if (!state.loadingMore) {
                state.params.current++
                queryRecordList()
                state.loadingMore = true
            }
        }

        const openProductSwitch = () => {
            productDropdown.value.toggle(false)
            state.switchProductVisible = true
        }

        // 方向筛选
        const dirdctionChange = (val) => {
            state.params.direction = val
            resetParams()
            queryRecordList()
        }
        // 开平仓筛选
        const positionTypeChange = (val) => {
            state.params.orderType = val
            resetParams()
            queryRecordList()
        }
        // 时间筛选
        const timeChange = (timeType) => {
            if (timeType === 0) {
                state.params.executeStartTime = -1
                state.params.executeEndTime = -1
            } else if (timeType === 1) {
                state.params.executeStartTime = window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 00:00:00')).valueOf()
            } else if (timeType === 2) {
                state.params.executeStartTime = window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 3) {
                state.params.executeStartTime = window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 4) {
                state.params.executeStartTime = window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf()
            }
            resetParams()
            queryRecordList()
        }

        const productChange = (val) => {
            if (val === 0) {
                resetParams()
                delete state.params.symbolId
                state.product[1].text = t('common.chooseProduct')
                queryRecordList()
            } else {
                state.switchProductVisible = true
            }
        }
        const openProductDropdown = (val) => {
            if (state.productVal === 1) { state.switchProductVisible = true }
        }

        const onRangeChange = (timeList) => {
            state.timeVal = 5
            resetParams()
            if (timeList.length > 1) {
                state.params.executeStartTime = timeList[0]
                state.params.executeEndTime = timeList[1]
                state.customDate = window.dayjs(timeList[0]).format('YYYY/MM/DD HH:mm:ss') + '-' + window.dayjs(timeList[1]).format('YYYY/MM/DD HH:mm:ss')
            }
            queryRecordList()
        }
        queryRecordList()

        return {
            ...toRefs(state),
            openProductSwitch,
            productDropdown,
            onSelectProduct,
            dirdctionChange,
            positionTypeChange,
            timeChange,
            productChange,
            priceLabel,
            isEmpty,
            onLoad,
            openProductDropdown,
            timeDropdown,
            onRangeChange,
            resetParams,
            queryRecordList,
            primaryColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filter-wrap {
    position: fixed;
    width: 100%;
    :deep(.van-dropdown-menu) {
        //background-color: var(--bgColor);
        .van-dropdown-menu__bar {
            align-items: center;
            padding: 0 rem(10px);
            background: var(--bgColor);
            box-shadow: none;
            .van-dropdown-menu__item {
                position: relative;
                justify-content: space-between;
                height: rem(48px);
                margin: 0 rem(10px);
                padding: 0 rem(5px);
                background: var(--contentColor);
                border-radius: rem(6px);
                .van-dropdown-menu__title {
                    position: static;
                    color: var(--color);
                    font-size: rem(20px);
                    &::after {
                        right: rem(10px);
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
.list-wrap {
    padding-top: rem(100px);
}
</style>
