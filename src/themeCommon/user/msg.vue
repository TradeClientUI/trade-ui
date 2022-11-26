<template>
    <div class='publicPage'>
        <LayoutTop :back='true' :custom-back='true' :menu='false' :title='$t("route.noticeTitle")' @back='back' />
        <!-- <Loading :show='pageLoading' /> -->
        <van-tabs v-model:active='activeIndex' class='msgTab' sticky @change='onClickTab'>
            <van-tab name='public' :title='$t("route.notice")'>
                <div class='msg-list'>
                    <van-pull-refresh

                        v-model='loadingNt'
                        :loading-text="$t('compLang.loading')"
                        :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                        :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                        @refresh='onRefreshNotice'
                    >
                        <div v-if='listNotice.length === 0'>
                            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                        </div>
                        <van-list
                            v-else
                            v-model='loadingNt'
                            v-model:error='isError'
                            :error-text='errorTip'
                            :finished='finishedNt'
                            :finished-text='$t("common.noMore")'
                            :loading-text="$t('compLang.loading')"
                            @load='onLoadNotice'
                        >
                            <div v-for='(item,index) in listNotice' :key='index' class='msg-item' @click="goNoticeDetails(item.id,'notice')">
                                <p class='msg-title'>
                                    {{ item.title === 'null'? '': item.title }}
                                </p>
                                <p class='msg-time'>
                                    {{ formatTime(item.pubTime) }}
                                </p>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
            </van-tab>
            <van-tab v-if='isUser' name='msg' :title='$t("route.msg")'>
                <div class='msg-list'>
                    <div class='operate'>
                        <van-row>
                            <van-col span='12'>
                                <van-dropdown-menu :active-color='$style.primary' class='msg-filter'>
                                    <van-dropdown-item v-model='type' :options='options' @change='changeType' />
                                </van-dropdown-menu>
                            </van-col>
                        </van-row>
                    </div>

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
                            v-model='loading'
                            v-model:error='isError'
                            :error-text='errorTip'
                            :finished='finished'
                            :finished-text='$t("common.noMore")'
                            :loading-text="$t('compLang.loading')"
                            @load='onLoad'
                        >
                            <div v-for='(item,index) in list' :key='index' class='msg-item'>
                                <p class='msg-title'>
                                    <span v-if='item.readStatus === "2"'>
                                        {{ item.title === 'null'? '': item.title }}
                                    </span>
                                    <b v-if='item.readStatus === "1"'>
                                        {{ item.title === 'null'? '': item.title }}
                                    </b>
                                </p>
                                <p class='msg-content'>
                                    {{ computeHtmlTime(item.content) }}
                                </p>
                                <p class='msg-time'>
                                    {{ formatTime(item.createTime) }}
                                </p>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
            </van-tab>

            <!-- 个人消息 展示白标后台给客户发布的指定站内信 -->
            <van-tab v-if='isUser' name='msgps' :title='$t("route.msgCustomer")'>
                <div class='msg-list'>
                    <van-pull-refresh

                        v-model='loadingPs'
                        :loading-text="$t('compLang.loading')"
                        :loosing-text="$t('compLang.vanPullRefresh.loosing')"
                        :pulling-text="$t('compLang.vanPullRefresh.pulling')"
                        @refresh='onRefreshPs'
                    >
                        <div v-if='listCustomer.length === 0'>
                            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                        </div>
                        <van-list
                            v-else
                            v-model='loadingPs'
                            v-model:error='isError'
                            :error-text='errorTip'
                            :finished='finishedPs'
                            :finished-text='$t("common.noMore")'
                            :loading-text="$t('compLang.loading')"
                            @load='onLoadPs'
                        >
                            <div class='operate'>
                                <van-row>
                                    <van-col align='right' span='24'>
                                        <span class='all-read' @click='setAllMsgReaded'>
                                            {{ $t('notice.readAll') }}
                                        </span>
                                    </van-col>
                                </van-row>
                            </div>

                            <div v-for='(item,index) in listCustomer' :key='index' class='msg-item' @click="goNoticeDetails(item.id, 'msgcustomer',item)">
                                <p class='msg-title'>
                                    <span v-if='item.readStatus === 2'>
                                        {{ item.title === 'null'? '': item.title }}
                                    </span>
                                    <b v-if='item.readStatus === 1'>
                                        {{ item.title === 'null'? '': item.title }}
                                    </b>
                                </p>
                                <p class='msg-time'>
                                    {{ formatTime(item.createTime) }}
                                </p>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>

import { onBeforeMount, computed, reactive, toRefs, onUnmounted, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Top from '@/components/top'
import { isEmpty, getCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { queryPlatFormMessageLogList, getNoticeList, getCustomerMsgList, setMsgReaded, setMsgAllReaded } from '@/api/user'

export default {
    name: 'Msg',
    components: {
        Top,
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            list: [],
            listNotice: [],
            listCustomer: [],

            lang: getCookie('lang') || 'zh-CN',

            loading: false,
            finished: false, // 消息列表
            pageLoading: false,
            current: 1,

            loadingNt: false,
            finishedNt: false, // 公告列表
            pageLoadingNt: false,
            currentNt: 1,

            loadingPs: false,
            finishedPs: false, // 个人消息列表
            pageLoadingPs: false,
            currentPs: 1,

            type: '',
            isUser: false,
            errorTip: '',
            rightAction: { title: 444 },
            activeIndex: 'public',
            options: [
                {
                    'text': t('msg.all'),
                    'value': ''
                },
                {
                    'text': t('msg.accountMsg'),
                    'value': 'USER_MESSAGE'
                },
                {
                    'text': t('msg.assetsMsg'),
                    'value': 'CASH_MESSAGE'
                },
                {
                    'text': t('msg.tradeMsg'),
                    'value': 'TRADE_MESSAGE'
                }
            ]
        })
        const isError = computed(() => !!state.isError)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // const activeIndex = ref('')
        const onClickTab = ({ title, name }) => {
            if (state.activeIndex === 'public') {
                state.currentNt = 1
                state.finishedNt = false
                state.listNotice = []
                getNoticeData()
            }
            if (state.activeIndex === 'msgps') {
                state.currentPs = 1
                state.finishedPs = false
                state.listCustomer = []
                getCustomerMsgListData()
            }
            if (state.activeIndex === 'msg') {
                state.current = 1
                state.finished = false
                state.list = []
                state.type = ''
                getMsgList()
            }
        }

        watch(
            () => customInfo.value,
            () => {
                if (customInfo.value) {
                    state.isUser = true
                } else {
                    state.isUser = false
                }
            }
        )

        const changeType = (val) => {
            state.type = val
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }

        // 跳转到公告详情页
        const goNoticeDetails = (id, type, item) => {
            // console.log(id)
            if (type === 'msgcustomer') {
                if (item.readStatus === 1) {
                    setMsgReadedFn(id)
                }
                var arr = []; var temp = {}
                state.listCustomer.map((item) => {
                    temp = item
                    if (item.id === id) {
                        if (item.readStatus === 1) {
                            temp.readStatus = 2
                        }
                    }
                    arr.push(temp)
                })
                state.listCustomer = arr
            }
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: type
                }
            })
        }

        // 获取消息列表
        const getMsgList = () => {
            state.pageLoading = true
            state.loading = true
            state.errorTip = ''
            queryPlatFormMessageLogList({
                current: state.current,
                parentType: state.type,
                size: 10,
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.current++
                        state.list = state.list.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
                console.log(state.loading)
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
                state.loading = false
            })
        }

        // 获取个人消息列表
        const getCustomerMsgListData = () => {
            state.pageLoading = true
            state.loadingPs = true
            state.errorTip = ''
            getCustomerMsgList({
                current: state.currentPs,
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loadingPs = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.listCustomer = state.listCustomer.concat(res.data.records)
                        state.currentPs++
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedPs = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
                state.loadingPs = false
            })
        }

        // 获取公告列表
        const getNoticeData = () => {
            state.pageLoading = true
            state.loadingNt = true
            state.errorTip = ''
            getNoticeList({
                current: state.currentNt,
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loadingNt = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.currentNt++
                        state.listNotice = state.listNotice.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedNt = true
                    }
                }
                console.loe(state.loadingNt)
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
                state.loadingNt = false
            })
        }

        // 设置消息已读
        const setMsgReadedFn = (id) => {
            state.pageLoading = true
            state.errorTip = ''
            setMsgReaded({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo,
                id: id
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    // getCustomerMsgListData()
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        // 设置全部已读
        const setAllMsgReaded = () => {
            state.pageLoading = true
            state.errorTip = ''
            setMsgAllReaded({
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    state.currentPs = 1
                    state.finishedPs = false
                    state.listCustomer = []
                    getCustomerMsgListData()
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                let returnVal
                if (!isEmpty(tag) && tag.length > 0) {
                    tag.forEach(item => {
                        returnVal = content.replace(reg, function (matchStr) {
                            const time = matchStr.toString().replace(/<\/?time>/g, '')
                            return window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                        })
                    })
                    return returnVal
                } else {
                    return content
                }
            } catch (error) {
                console.log(error)
            }
        }

        // msg上拉刷新
        const onRefresh = () => {
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }
        // msg底部加载更多
        const onLoad = () => {
            if (!state.loading) {
                getMsgList()
            }
        }

        // notice上拉刷新
        const onRefreshNotice = () => {
            state.currentNt = 1
            state.finishedNt = false
            state.listNotice = []
            getNoticeData()
        }
        // notice底部加载更多
        const onLoadNotice = () => {
            if (!state.loadingNt) {
                getNoticeData()
            }
        }

        // msgCustomer上拉刷新
        const onRefreshPs = () => {
            console.log('onRefreshPs')
            state.currentPs = 1
            state.finishedPs = false
            state.listCustomer = []
            getCustomerMsgListData()
        }
        // notice底部加载更多
        const onLoadPs = () => {
            console.log('onLoadPs()')
            if (!state.loadingPs) {
                getCustomerMsgListData()
            }
        }

        const initList = () => {
            state.currentNt = 1
            state.finishedNt = false
            state.listNotice = []

            state.current = 1
            state.finished = false
            state.list = []

            state.currentPs = 1
            state.finishedPs = false
            state.listCustomer = []
            if (!route.query.from) {
                getNoticeData()
            }
            // getNoticeData()
        }

        const back = () => {
            router.push('/mine')
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onMounted(() => {
            initList()
        })

        onBeforeMount(() => {
            if (customInfo.value) {
                state.isUser = true
                if (route.query.from === 'notice') {
                    state.activeIndex = ref('public')
                    state.currentNt = 1
                    state.finishedNt = false
                    state.listNotice = []
                    getNoticeData()
                }
                if (route.query.from === 'msgcustomer') {
                    // console.log('++2')
                    state.activeIndex = ref('msgps')
                    state.currentPs = 1
                    state.finishedPs = false
                    state.listCustomer = []
                    getCustomerMsgListData()
                }
                if (route.query.from === 'msg') {
                    // console.log('++3')
                    state.activeIndex = ref('msg')
                    state.current = 1
                    state.finished = false
                    state.list = []
                    getMsgList()
                }
            } else {
                state.isUser = false
                state.currentNt = 1
                state.finishedNt = false
                state.listNotice = []
                if (route.query.from) getNoticeData()
            }
        })

        onUnmounted(() => {

        })

        return {
            getMsgList,
            onRefreshNotice,
            onLoadNotice,
            back,
            isError,
            getNoticeData,
            getCustomerMsgListData,
            customInfo,
            formatTime,
            onRefresh,
            onLoad,
            onRefreshPs,
            onLoadPs,
            changeType,
            goNoticeDetails,
            computeHtmlTime,
            onClickTab,
            setMsgReadedFn,
            setAllMsgReaded,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.right-ico {
    position: absolute;
    right: rem(30px);
    color: var(--contentColor);
    font-size: rem(48px);
}
.msgTopCenter {
    position: absolute;
    width: 100%;
}
:deep(.van-dropdown-menu__bar) {
    box-shadow: none;

    --van-dropdown-menu-title-font-size: 12px;
}
.msgTab {
    --van-tabs-bottom-bar-color: var(--primary);
}
.publicPage {
    flex: 1;
    height: 100%;
    // padding-top: rem(110px);
    // overflow: auto;
    background-color: var(--bgColor);
    .operate {
        text-align: left;
        .msg-filter {
            display: inline-block;
        }
    }
    :deep(.van-tabs) {
        margin-top: rem(110px);
    }
    :deep(.van-dropdown-menu__title) {
        color: var(--color);
    }
}
.msg-list {
    // margin-bottom: rem(50px);
    .header {
        padding-bottom: rem(30px);
        padding-left: rem(30px);
        font-size: rem(48px);
        background: var(--contentColor);
    }
    .msg-item {
        margin: rem(2px) 0 rem(10px) 0;
        padding: rem(30px);
        background-color: var(--contentColor);
        //border-top: solid rem(10px) var(--bgColor);
        .msg-title {
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(60px);
        }
        .msg-content {
            display: -webkit-box;
            overflow: hidden;
            color: var(--color);
            font-weight: 500;
            font-size: rem(24px);
            line-height: rem(40px);
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .msg-time {
            color: var(--minorColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(60px);
        }
    }
}
.all-read {
    display: inline-block;
    padding: rem(30px) rem(20px);
    font-size: rem(24px);
}
</style>
