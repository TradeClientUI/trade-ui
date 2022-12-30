<template>
    <div class='msgDetail'>
        <LayoutTop v-if='!isUniapp' :custom-back='true' :menu='false' :title='$t("route.noticeTitle")' @back='back' />
        <Loading :show='loading' />
        <div class='pageWrap'>
            <div class='detailTop'>
                {{ detailData.title }}
            </div>
            <div class='time'>
                {{ detailData.pubTime?formatTime(detailData.pubTime):'' }}
            </div>
            <div class='content' v-html='detailData.content'></div>
        </div>
    </div>
</template>

<script>

import { onBeforeMount, computed, reactive, toRefs, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import Top from '@/components/top'
import { isEmpty, getCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { getNoticeDetail, getCustomerMsgDetail } from '@/api/user'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: {
        Top,
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const { isUniapp } = route.query
        const state = reactive({
            list: [],
            listNotice: [],
            loading: false,
            lang: getCookie('lang') || 'zh-CN',
            noticeId: 0,
            type: '',
            errorTip: '',
            detailData: {}
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 初始获取详情
        const initData = () => {
            const { id, type } = route.query
            state.noticeId = id
            state.type = type
            getNoticeDetial(type)
        }

        // 获取公告详情
        const getNoticeDetial = (type) => {
            state.loading = true
            state.errorTip = ''
            console.log(customInfo.value)

            if (type === 'notice') {
                getNoticeDetail({
                    current: state.currentNt,
                    id: state.noticeId,
                    lang: state.lang,
                    companyId: customInfo.value.companyId
                }).then(res => {
                    state.loading = false
                    console.log(res)
                    if (res.check()) {
                        state.detailData = res.data
                    }
                }).catch(err => {
                    state.errorTip = t('c.loadError')
                })
            }

            if (type === 'msgcustomer') {
                getCustomerMsgDetail({
                    current: state.currentNt,
                    id: state.noticeId,
                    lang: state.lang,
                    companyId: customInfo.value.companyId
                }).then(res => {
                    state.loading = false
                    console.log(res)
                    if (res.check()) {
                        state.detailData = res.data
                    }
                }).catch(err => {
                    state.errorTip = t('c.loadError')
                })
            }
        }

        const back = (type) => {
            router.back()
        }

        onBeforeMount(() => {
            initData()
        })
        onUnmounted(() => {

        })

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            initData,
            getNoticeDetial,
            formatTime,
            back,
            ...toRefs(state),
            isUniapp
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    max-height: 100%;
    padding-top: rem(120px);
    padding-bottom: 0;
    overflow: auto;
    .detailTop {
        padding: rem(15px);
        font-size: rem(32px);
        text-align: center;
    }
    .time {
        padding: rem(15px);
        color: var(--minorColor);
        text-align: center;
    }
    .content {
        min-height: rem(600px);
        margin-top: rem(20px);
        padding: rem(20px) rem(30px);
        line-height: rem(42px);
        white-space: normal;
        word-break: break-all;
        background: var(--contentColor);
    }
}

</style>
