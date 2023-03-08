<template>
    <div v-if='state.listNotice.length' class='new-notice-module'>
        <p class='left'>
        </p>
        <div class='notice'>
            <div class='notice-container'>
                <ul class='notice-wrap'>
                    <li class='notice-row' :class="{ 'animation-row':state.listNotice.length > 2 }">
                        <template v-if='state.listNotice[0]'>
                            <p class='row-cont' @click='goNoticeDetails(state.listNotice[0].id)'>
                                <span class='text'>
                                    {{ state.listNotice[0].title }}
                                </span>
                                <span class='time'>
                                    {{ state.listNotice[0].timeText }}
                                </span>
                            </p>
                        </template>

                        <div class='row-cont'>
                            <p v-if='state.listNotice[1]' @click='goNoticeDetails(state.listNotice[1].id)'>
                                <span class='text'>
                                    {{ state.listNotice[1].title }}
                                </span>
                                <span class='time'>
                                    {{ state.listNotice[1].timeText }}
                                </span>
                            </p>
                        </div>
                    </li>
                    <template v-if='state.listNotice.length > 2'>
                        <li class='notice-row' :class="{ 'animation-row':state.listNotice.length > 2 }">
                            <template v-if='state.listNotice[2]'>
                                <p class='row-cont' @click='goNoticeDetails(state.listNotice[2].id)'>
                                    <span class='text'>
                                        {{ state.listNotice[2].title }}
                                    </span>
                                    <span class='time'>
                                        {{ state.listNotice[2].timeText }}
                                    </span>
                                </p>
                            </template>
                            <div class='row-cont'>
                                <p v-if='state.listNotice[3]' @click='goNoticeDetails(state.listNotice[3].id)'>
                                    <span class='text'>
                                        {{ state.listNotice[3].title }}
                                    </span>
                                    <span class='time'>
                                        {{ state.listNotice[3].timeText }}
                                    </span>
                                </p>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <p class='right' @click='goNotice'>
            More &nbsp; >
        </p>
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
        path: '/notice',
        query: {
            from: 'notice'
        }
    })
}
onMounted(() => {
    getNoticeData()
})

</script>

<style lang="scss" scoped>
.new-notice-module {
    @include globalFont();
    @include pagePadding();
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin:32px auto 0;
    .left {
        width:16px;
        height:14px;
        background: url('../../../images/home/new_version/notice_icon.png') left center no-repeat;
        background-size: 100%;
    }
    .notice {
        flex:1;
    }
    .notice-container{
        width: 100%;
        display: flex;
        align-items: center;
        filter:blur(0px);
        font-size:16px;
        color:rgba(53,56,61,1);
    }

    .notice-wrap{
        height:24px;
        line-height:24px;;
        overflow: hidden;
        position: relative;
        flex: 1;
        text-align: center;
        .notice-row{
            position: absolute;
            height: 100%;
            width: 100%;
            .row-cont {
                display: inline-block;
                width: 48%;
                cursor: pointer;
                text-align: left;
                &:nth-child(2) {
                    position: relative;
                    padding-left:32px;
                    &::after {
                        position: absolute;
                        top:8px;
                        left:0;
                        display: inline-block;
                        content: '';
                        height:12px;
                        width: 2px;
                        background: #C3CEE3;
                    }
                }
                .text {
                    text-align: left;
                    color:#111;
                    font-size: 16px;
                    display: inline-block;
                    width: 80%;
                    overflow:hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    -o-text-overflow:ellipsis;
                }
                .time {
                    vertical-align: 20%;
                    color:#666;
                    font-size: 16px;
                    padding-left:16px;
                }
                &:hover {
                    .text, .time {color: var(--primary)}
                }
            }

        }
    }
    @keyframes anim1{
        0% {top: 0;opacity: 1}
        45% {top: 0; opacity: 1}
        50% {top: -100%; opacity: 0}
        51%{top: 100%; opacity: 0}
        95%{top: 100%; opacity: 1}
        96%{opacity: 1}
        100%{top: 0;opacity: 1}
    }
    @keyframes anim2{
        0% {top: 100%;opacity: 0}
        45% {top: 100%; opacity: 0}
        50% {top: 0; opacity: 1}
        95% {top: 0; opacity: 1}
        100%{top: -100%;opacity: 0}
    }
    .animation-row:nth-child(1){
        animation: anim1 6s linear infinite;
    }
    .animation-row:nth-child(2){
        top: 25px;
        animation: anim2 6s linear infinite;
    }
    .right {
        color: var(--primary);
        font-size: 18px;
        cursor: pointer;
    }
}
</style>
