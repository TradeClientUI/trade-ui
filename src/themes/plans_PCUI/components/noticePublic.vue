<template>
    <van-popup
        v-model:show='publicShow'
        class='public-pop'
        close-icon-position='top-left'
        closeable
        position='center'
        round
        :style="{ width: '520px' }"
    >
        <div class='pop-top'>
            {{ $t('notice.poptitle') }}
        </div>
        <div class='pop-content'>
            <div class='public-list'>
                <div v-for='(item,index) in noticeData' :key='index' class='item' @click='goNoticeDetail(item.id)'>
                    <div class='item-tit'>
                        {{ item.title }}
                    </div>
                    <div class='item-time'>
                        {{ formatTime(item.pubTime) }}
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref, watch, reactive, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, Popup } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { localGet, getQueryVariable, sessionSet, unzip, localSet, getCookie, localRemove } from '@/utils/util'
import { configSystem } from '@/api/base'
import { getNoticeList, getNoticePop } from '@/api/user'

export default {
    props: ['noticePopShow'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const cacheViews = computed(() => store.state.cacheViews)

        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({
            publicShow: false,
            lang: getCookie('lang') || 'zh-CN',
            noticePubTime: '',
            currentNt: 1,
            noticeData: []
        })

        window.store = store
        watch(
            () => state.noticePopShow, val => {
                context.emit('update:noticePopShow', val)
            }
        )

        const getPublicData = (val) => {
            state.publicShow = val
        }

        // 公告弹窗
        const getNoticeData = () => {
            var params = {
                current: state.currentNt,
                lang: state.lang,
                size: 5,
            }
            if (customInfo.value.companyId) {
                params.companyId = customInfo.value.companyId
            }
            if (customInfo.value.customerNo) {
                params.customerNo = customInfo.value.customerNo
            }
            let noticeParams = {}
            // console.log(localGet('noticeParams'))
            // 判断是否新游客
            if (customInfo.value.customerNo) { // 不是
                var nData = JSON.parse(localGet('noticeParams')) // 提取最新的pubTime
                noticeParams = {
                    type: 'user', // 'user' ? 'guest'
                    pubTime: '',
                    popShowNum: 0,
                    userNo: customInfo.value.companyId
                }
                if (nData) {
                    if (nData.pubTime) { // 已登录用户
                        params.viewPubTime = nData.pubTime
                    }
                    noticeParams.pubTime = nData.pubTime
                    noticeParams.popShowNum = nData.popShowNum
                }
                localSet('noticeParams', JSON.stringify(noticeParams))
            } else { // 是
                // 获取当日的所有公告，显示完且缓存弹出次数
            }

            getNoticePop(params).then(res => {
                // console.log(res)
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.noticeData = res.data
                        // 获取公告列表后，再缓存最新的一条的pubTime在本地
                        let noticeParams = {}
                        // 判断是否新游客
                        console.log(localGet('noticeParams'))
                        // localGet('noticeParams')?.userNo
                        var nData = JSON.parse(localGet('noticeParams')) // 提取最新的pubTime
                        if (customInfo ? customInfo.value.customerNo : false) { // 不是
                            // console.log(nData)
                            if (customInfo.value.customerNo) { // 已登录用户
                                // if (nData.popShowNum < 1) {
                                //     getPublicData(true) // 普通游客第一次显示公告弹窗
                                // }
                                noticeParams = {
                                    type: 'user', // 'user' ? 'guest'
                                    pubTime: state.noticeData[0].pubTime, // 每次获取第一条为最新公告时间，记录到本地缓存
                                    popShowNum: nData.popShowNum + 1,
                                    userNo: customInfo.value.companyId
                                }
                                getPublicData(true)
                            } else { // 未登录
                                if (nData.popShowNum === 1) {
                                    getPublicData(true) // 普通游客第一次显示公告弹窗
                                }
                                noticeParams = {
                                    type: 'guest',
                                    pubTime: nData.pubTime,
                                    popShowNum: 1,
                                    userNo: ''
                                }
                            }
                        } else { // 是新游客
                            getPublicData(true) // 普通游客第一次显示公告弹窗
                            // 获取当日的所有公告，显示完且缓存弹出次数
                            noticeParams = {
                                type: 'guest',
                                pubTime: '',
                                popShowNum: 1,
                                userNo: ''
                            }
                            if (nData) {
                                noticeParams.pubTime = nData.pubTime
                            }
                        }
                        console.log(noticeParams)
                        // getPublicData(true)
                        localSet('noticeParams', JSON.stringify(noticeParams))
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
            })
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
            })
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onMounted(() => {
            getNoticeData()
            // localRemove('noticeParams')
        })

        onUnmounted(() => {

        })

        return {
            cacheViews,
            customInfo,
            goNoticeDetail,
            formatTime,
            getNoticeData,
            getPublicData,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.public-pop {
    border-radius: rem(10px);

    --van-popup-round-border-radius: 10px;
    .pop-top {
        padding-left: rem(30px);
        font-size: rem(36px);
        line-height: rem(120px);
        text-align: center;
    }
    .pop-content {
        min-height: rem(550px);
        max-height: rem(650px);
        margin-bottom: rem(20px);
        padding: 0 0 rem(20px) 0;
        overflow: auto;
        background: var(--bgColor);
    }
    .public-list {
        margin: 0;
        .item {
            padding: rem(15px) rem(30px) rem(25px) rem(30px);
            transition: ease-in 0.2s;
            &:hover {
                background-color: var(--contentColor);
            }
            .item-tit {
                margin-bottom: rem(10px);
                color: var(--color);
                font-size: rem(28px);
            }
            .item-time {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
</style>
