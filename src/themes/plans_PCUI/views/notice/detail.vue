<template>
    <router-view />
    <div class='wrapper' :style='"min-height:" + wrapperHeight'>
        <div class='page-title'>
            <span class='back-icon' @click='back'>
                <van-icon name='arrow-left' />
            </span>

            <span v-if="type === 'notice'">
                {{ $t('route.notice') }}{{ $t('notice.detailTxt') }}
            </span>
            <span v-if="type === 'msgcustomer'">
                {{ $t('route.msgCustomer') }}{{ $t('notice.detailTxt') }}
            </span>
        </div>
        <div class='detailContainer'>
            <div class='sideBar'>
                <ul>
                    <li :class="type === 'notice' ? 'active': ''" @click="goPage('notice')">
                        <van-icon name='volume-o' />{{ $t('route.notice') }}
                    </li>
                    <li v-if='isUser' :class="type === 'msg' ? 'active': ''" @click="goPage('msg')">
                        <i class='icon icon_xiaoxizhongxin'></i> {{ $t('route.msg') }}
                    </li>
                    <li v-if='isUser' :class="type === 'msgcustomer' ? 'active': ''" @click="goPage('msgcustomer')">
                        <van-icon name='envelop-o' />{{ $t('route.msgCustomer') }}
                    </li>
                </ul>
            </div>
            <div class='notice-detail'>
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
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { getCookie } from '@/utils/util'
import { getNoticeDetail, getCustomerMsgDetail } from '@/api/user'

export default {
    components: {

    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            lang: getCookie('lang') || 'zh-CN',
            query: {
                purview: [],
                tag: '',
                id: '',
                whiteIps: ''
            },
            type: null,
            isUser: false,
            detailData: {},
            wrapperHeight: 0,
        })

        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 初始获取详情
        const initData = () => {
            const { id, type } = route.query
            state.noticeId = id
            state.type = type
            getNoticeDetial(type)
        }

        const goPage = (type) => {
            router.push({
                path: '/notice',
                query: {
                    from: type
                }
            })
        }

        // 获取公告详情
        const getNoticeDetial = (type) => {
            state.loading = true
            state.errorTip = ''

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

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag ? '' : tag,
                originPage: 'apiEdit'
            }
        })

        // 跳转返回
        const back = (id) => {
            router.push({
                path: '/notice',
                query: {
                    from: state.type
                }
            })
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        const setMinHeight = () => {
            const heightFooter = document.querySelectorAll("div[class='footer-nav']")
            const headerFooter = document.querySelectorAll("div[class='nav-left']")
            const calcHeight = heightFooter[0].clientHeight + headerFooter[0].clientHeight
            state.wrapperHeight = 'calc(100vh - ' + calcHeight + 'px)'
        }

        onMounted(() => {
            initData()
            if (customInfo.value) {
                state.isUser = true
            } else {
                state.isUser = false
            }
            setMinHeight()
        })

        return {
            initData,
            setMinHeight,
            handRoutTo,
            getNoticeDetial,
            showApiHelp,
            inviteVis,
            back,
            goPage,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper {
    min-height: calc(100% - 257px);
    .page-title {
        padding: 20px 20px 0;
        font-weight: bold;
        font-size: 32px;
    }
    .back-icon {
        cursor: pointer;
    }
    .detailContainer {
        display: flex;
        margin-top: 20px;
        padding: 0;
        overflow: hidden;
        background: var(--contentColor);
        .sideBar {
            width: 200px;
            li {
                display: block;
                width: 100%;
                padding: 15px 0;
                padding-left: 20px;
                color: var(--minorColor);
                font-size: 16px;
                line-height: 28px;
                text-align: left;
                background: none;
                border-radius: 0;
                cursor: pointer;
                transition: ease 0.2s;
                &.active {
                    color: var(--mainColor);
                    background: var(--lineColor);
                }
                &:hover {
                    color: var(--mainColor);
                    background: var(--primaryAssistColor);
                }
                .van-icon,
                .icon {
                    margin-right: 10px;
                    font-size: 24px;
                    vertical-align: -5px;
                }
            }
        }
        .notice-detail {
            flex: 1;
            min-height: calc(100vh - 354px);
            background: var(--contentColor);
            border-left: 1px solid var(--lineColor);
        }
    }
    .pageWrap {
        .detailTop {
            padding: 15px 20px 0;
            font-weight: 600;
            font-size: 28px;
            text-align: left;
        }
        .time {
            padding: 0 20px;
            color: var(--minorColor);
            text-align: left;
        }
        .content {
            // min-height: 400px;
            margin-top: 0;
            padding: 20px;
            color: var(--normalColor);
            line-height: 30px;
            white-space: normal;
            word-break: break-all;
        }
    }
}

@media screen and (max-width: 1200px) {
    .wrapper {
        width: 100%;
    }
}

@media screen and (max-width: 980px) {
    .wrapper {
        width: 100%;
    }
}
</style>
