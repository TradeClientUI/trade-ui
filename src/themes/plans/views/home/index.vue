<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <!-- <topNav /> -->
        <!-- 公告 -->
        <!-- <div class='topp-public'>
            <van-notice-bar class='top-notice' left-icon='volume-o' :scrollable='false'>
                <van-row>
                    <van-col span='22'>
                        <van-swipe
                            :autoplay='3000'
                            class='notice-swipe'
                            :show-indicators='false'
                            vertical
                        >
                            <van-swipe-item v-for='(item,index) in noticeData' :key='index' @click='goNoticeDetail(item.id)'>
                                {{ item.title }}
                            </van-swipe-item>
                        </van-swipe>
                    </van-col>
                    <van-col v-if='!isUniapp' align='center' span='2'>
                        <van-icon name='more-o' @click='publicLink' />
                    </van-col>
                </van-row>
            </van-notice-bar>
        </div> -->
        <PageComp :class="isUniapp ? '' : 'marginbottom'" :data='pageModules' />
        <!-- 统一公告弹窗 -->
        <NoticePublic />
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { onActivated, computed, ref, toRefs, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { NoticeBar } from 'vant' // vant公告组件
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getNoticeList } from '@/api/user'
import { isEmpty, getCookie } from '@/utils/util'
import NoticePublic from '@plans/components/noticePublic'

export default {
    name: 'Home',
    components: {
        NoticePublic,
    },
    setup () {
        const store = useStore()
        const pageModules = ref([])
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const { isUniapp } = route.query
        const customerGroupId = computed(() => store.getters.customerGroupId)
        // 暂时只在319公司显示
        const isCompanyIdShow = computed(() => Number(store.state._base.wpCompanyInfo.companyId) === 319)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            data: {
                loop: true,
                items: [
                    {
                        src: require('@plans/images/banner/banner1.jpg'),
                        href: { 'name': 'Quote' }
                    },
                    {
                        src: require('@plans/images/banner/banner2.jpg'),
                        href: { 'name': 'Quote' }
                    },
                    {
                        src: require('@plans/images/banner/banner3.jpg'),
                        href: { 'name': 'Quote' }
                    }
                ]
            },
            lang: getCookie('lang') || 'zh-CN',
            currentNt: 1,
            noticeData: []
        })
        const products = []

        // 产品订阅
        const sendSubscribe = () => {
            if (products.length > 0) QuoteSocket.send_subscribe24H(products)
        }

        const publicLink = () => {
            router.push('/msg')
        }

        // 获取公告列表
        const getNoticeData = () => {
            getNoticeList({
                current: state.currentNt,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 3,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        // state.listNotice = state.listNotice.concat(res.data.records)
                        state.noticeData = res.data.records
                    }

                    // // 数据全部加载完成
                    // if (res.data.size * res.data.current >= res.data.total) {
                    //     state.finishedNt = true
                    // }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        const goNoticeDetail = (id) => {
            if (isUniapp && uni) {
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'notice_click',
                        params: {
                            path: `/noticeDetail?id=${id}&type=notice`
                        }
                    }
                })
            } else {
                router.push({
                    path: '/noticeDetail',
                    query: {
                        id: id,
                        type: 'notice'
                    }
                })
            }
        }

        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            pageModules.value = res
            // 找到行情模块的产品，并开始订阅
            const productModule = res.filter(el => ['productsSwipe', 'productsTimeSharing'].includes(el.tag))
            if (productModule.length > 0) {
                productModule.forEach(el => {
                    const symbolKeys = Object.entries(el.data.product || {}).map(([tradeType, item]) => {
                        const list = item[customerGroupId.value] || []
                        return list.map(symbolId => `${symbolId}_${tradeType}`)
                    }).flat()
                    products.push(...symbolKeys)
                })
                sendSubscribe()
            }
        })

        onActivated(() => {
            // 订阅产品
            sendSubscribe()
        })
        onMounted(() => {
            getNoticeData()
        })
        return {
            pageModules,
            customInfo,
            goNoticeDetail,
            publicLink,
            getNoticeData,
            isCompanyIdShow,
            ...toRefs(state),
            isUniapp
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.home {
    height: 100%;
    overflow: auto;
    //overflow: auto;
    //background: var(--contentColor);
    .marginbottom {
        padding-bottom: rem(100px);
    }
    .top-notice {
        width: 100%;
        color: var(--color);
        background: var(--primaryAssistColor);
        .van-icon {
            margin-top: rem(15px);
            font-size: rem(36px);
            vertical-align: middle;
        }
        .van-row {
            font-size: rem(24px);
        }
    }
    .notice-swipe {
        height: 36px;
        line-height: 38px;
    }
    :deep(.van-notice-bar__content) {
        width: 100%;
    }
}
.noticeBar,
.newBar {
    margin-top: rem(20px);
}

</style>
