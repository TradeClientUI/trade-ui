<template>
    <div v-if='state.listNotice.length' class='new-notice-module'>
        <van-swipe autoplay='4000' :show-indicators='false' style='height: 40px;' :touchable='false' vertical>
            <van-swipe-item v-if='state.listNotice[0]'>
                <p class='row-cont' @click='goNoticeDetails(state.listNotice[0].id)'>
                    <img alt='' src='../../../images/home/new_version/notice_icon.png' />
                    <span class='text'>
                        {{ state.listNotice[0].title }}
                    </span>
                </p>
                <p class='date'>
                    {{ state.listNotice[0].timeText }}
                </p>
                <p class='right' @click='goNotice'>
                    More &nbsp; >
                </p>
            </van-swipe-item>
            <van-swipe-item v-if='state.listNotice[1]'>
                <p class='row-cont' @click='goNoticeDetails(state.listNotice[0].id)'>
                    <img alt='' src='../../../images/home/new_version/notice_icon.png' />
                    <span class='text'>
                        {{ state.listNotice[1].title }}
                    </span>
                </p>
                <p class='date'>
                    {{ state.listNotice[1].timeText }}
                </p>
                <p class='right' @click='goNotice'>
                    More  >
                </p>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script setup>
import { getNoticeList } from '@/api/user'
import { computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'

const state = reactive({
    listNotice: [],
    lang: getCookie('lang') || 'zh-CN',
    errorTip: '',
})
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const store = useStore()
// 获取账户信息
const customInfo = computed(() => store.state._user.customerInfo)
// 获取公告列表
const getNoticeData = () => {
    state.errorTip = ''
    getNoticeList({
        current: 1,
        lang: state.lang,
        size: 4,
        companyId: customInfo.value.companyId,
        customerNo: customInfo.value.customerNo
    }).then(res => {
        if (res.check()) {
            if (res.data.records && res.data.records.length > 0) {
                res.data.records.map(item => {
                    const date = new Date(item.updateTime)
                    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                    item.timeText = M + '/' + D
                    return item
                })
                state.listNotice = res.data.records
            }
        }
    }).catch(err => {
        state.errorTip = t('c.loadError')
    })
}

// 跳转到公告详情页
const goNoticeDetails = (id) => {
    router.push({
        path: '/noticeDetail',
        query: {
            id: id,
            type: 'notice'
        }
    })
}

// 跳转到公告
const goNotice = () => {
    router.push({
        path: '/msg'
    })
}
onMounted(() => {
    getNoticeData()
})

</script>

<style lang="scss" scoped>
.new-notice-module {
    @include globalFont();
    font-weight: 500;
    margin:rem(40px) auto 0;
    .van-swipe-item{
        height: rem(42px);
        display: flex;
        padding: 0 rem(32px);
        font-size: rem(28px);
        font-weight: 600;
        align-items: center;
        img{
            margin-right: rem(14px);
        }
    }
    .row-cont{
        display: flex;
        align-items: center;
        img{
            margin-right: rem(32px);
            height: rem(26px);
        }
        .text{
            width: rem(390px);
            overflow: hidden;
            white-space:nowrap;
            text-overflow: ellipsis;
        }
    }
    .date{
        font-size: rem(28px);
        font-weight: 400;
        color: #666;
        margin-left: rem(16px);
    }
    .right {
        color: #0062FF;
        cursor: pointer;
        flex: 1;
        text-align: right;
    }
}
</style>
