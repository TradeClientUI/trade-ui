<template>
    <el-popover
        placement='bottom'
        popper-class='infoPop-msg'
        trigger='hover'
        :width='400'
        @after-enter='showPop'
    >
        <template #reference>
            <i class='icon icon_xiaoxizhongxin1' :title="$t('header.information')"></i>
        </template>
        <div class='information_box'>
            <div class='information_head'>
                <div class='current_type' @click='dropTypeVisible = !dropTypeVisible'>
                    <span>{{ informationType }}</span><i class='icon el-icon-caret-bottom'></i>
                </div>
            </div>
            <div v-if='dropTypeVisible' class='type_list'>
                <ul>
                    <li v-for='item in options' :class='{ activeLi:type==item.value }' @click='changeType(item)'>
                        {{ item.text }}
                    </li>
                </ul>
            </div>
            <Loading :show='pageLoading' />
            <div v-loading='msgLoading' class='msg-list'>
                <div v-if='list.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <van-pull-refresh v-else v-model='loading' @refresh='onRefresh'>
                    <van-list
                        v-model:error='isError'
                        v-model:loading='loading'
                        :error-text='errorTip'
                        :finished='finished'
                        :finished-text='$t("common.noMore")'
                        @load='onLoad'
                    >
                        <div v-for='(item,index) in list' :key='index' class='msg-item'>
                            <p class='msg-title'>
                                {{ item.title === 'null'? '': item.title }}
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
        </div>
    </el-popover>
</template>

<script>
import { onBeforeMount, computed, reactive, toRefs, onUnmounted, nextTick } from 'vue'
import { queryPlatFormMessageLogList } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'

export default {
    setup () {
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            list: [],
            loading: false,
            finished: false,
            pageLoading: false,
            current: 1,
            type: '',
            errorTip: '',
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
            ],
            informationType: t('msg.all'),
            dropTypeVisible: false,
            noticeContent: '',
            msgLoading: false
        })
        const isError = computed(() => !!state.isError)

        const changeType = (item) => {
            console.log(item)
            if (state.type == item.value) {
                return
            }
            state.type = item.value
            state.informationType = item.text
            state.current = 1
            state.finished = false
            state.list = []
            state.dropTypeVisible = !state.dropTypeVisible
            state.msgLoading = true
            getMsgList()
        }
        const showPop = () => {
            state.current = 1
            state.finished = false
            state.list = []
            state.msgLoading = true
            getMsgList()
        }
        const getMsgList = () => {
            // state.pageLoading = true
            state.errorTip = ''
            queryPlatFormMessageLogList({
                current: state.current,
                parentType: state.type,
            }).then(res => {
                state.msgLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.list = state.list.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
            }).catch(err => {
                state.msgLoading = false
                state.errorTip = t('c.loadError')
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
        // 获取到顶部消息通知，notice全局通知，同时刷新消息列表
        const gotMsg = (res) => {
            // 全局通知
            state.noticeContent = res.detail.content
            ElNotification({
                title: state.noticeContent.title || $t('c.biaoTi'),
                dangerouslyUseHTMLString: true,
                message: `<div class='content'>${computeHtmlTime(state.noticeContent.text)}</div>`
            })
            // 刷新消息列表
            onRefresh()
        }
        document.body.addEventListener('GotMsg_notice', gotMsg, false)
        onBeforeMount(() => {
            // 全局消息测试代码
            // let noticeContent = {
            //     title:"这是标题",
            //     text:"按时发货卡蒂狗蓝思科技哦啊合适了复健科更换接口过分了四大金刚三打两建开会搞四六级咖啡馆来得及咖啡馆离开<time>1635822889134</time>",
            // }
            // //getMsgList()
            // setInterval(function(){
            //     ElNotification({
            //     title:  noticeContent.title || $t('c.biaoTi') ,
            //     dangerouslyUseHTMLString: true,
            //     message: `<div>${computeHtmlTime(noticeContent.text)}</div> `,
            //     duration :0
            // })
            // },5000)
        })
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_notice', gotMsg)
        })

        // 上拉刷新
        const onRefresh = () => {
            state.msgLoading = true
            state.current = 1
            state.finished = false
            state.list = []
            getMsgList()
        }
        // 底部加载更多
        const onLoad = () => {
            state.msgLoading = true
            state.current++
            getMsgList()
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            getMsgList,
            isError,
            formatTime,
            onRefresh,
            onLoad,
            changeType,
            computeHtmlTime,
            showPop,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
.el-notification{
    background-color: var(--contentColor) !important;
    .el-notification__title,.el-notification__content{
        color: var(--color) !important;
        text-align: left !important;
    }
}
.infoPop-msg {
    padding: 0 !important;
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.icon {
    font-size: 16px;
    color: #D6DAE1;
    cursor: pointer;
}
.information_box{
    width:400px;
    height:600px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    background-color:rgba(0, 0, 0, 0.2);
    .information_head{
        color: var(--color);
        border-radius: 3px 3px 0 0;
        width:100%;
        height:48px;
        background-color: var(--contentColor);
        text-align:center;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        .current_type{
            font-size: 16px;
            line-height: 48px;
            cursor:pointer;
            i{
                margin-left:4px;
                color: var(--color);
                cursor:pointer;
            }
        }
    }
    .type_list{
        ul{
            width:100%;
            position:fixed;
            top:48px;
            left:0px;
            right:0px;
            z-index:1;
            li{
                color: var(--color);
                width:100%;
                height:40px;
                line-height: 44px;
                font-size: 14px;
                text-align:center;
                background-color: var(--contentColor);
                cursor:pointer;
                &:hover {
                    color: var(--primary);
                }
            }
        }
        .activeLi{
            color: var(--primary);
        }
    }
    .msg-list {
        flex: 1;
        height: 552px;
        overflow: auto;
        background-color: var(--bgColor);
        .msg-item {
            margin: 7px;
            padding: 10px;
            background-color: var(--contentColor);
            border-top: solid 10px var(--bgColor);
            .msg-title {
                color: var(--color);
                font-weight: bold;
                font-size: 14px;
                line-height: 30px;
            }
            .msg-content {
                color: var(--color);
                font-weight: 500;
                font-size: 12px;
                line-height: 20px;
            }
            .msg-time {
                color: var(--minorColor);
                font-weight: 400;
                font-size: 12px;
                line-height: 30px;
            }
        }
    }
}
</style>
