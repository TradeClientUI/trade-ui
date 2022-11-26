<template>
    <van-popup
        v-model:show='show'
        class='notice-wrap'
        close-on-popstate
        :overlay='false'
        position='top'
        :style='{ zIndex: 9999,overflow: "hidden" }'
        teleport='#app'
    >
        <div class='notice' @click="show=false;$router.push('/msg')">
            <div class='top'>
                <p class='title'>
                    {{ noticeContent.title || $t('c.biaoTi') }}
                </p>
                <van-icon name='cross' @click.stop='show = false' />
            </div>
            <div class='content'>
                {{ computeHtmlTime(noticeContent.text) }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import { isEmpty } from '@/utils/util'
import { onUnmounted, reactive, toRefs } from 'vue'
export default {
    setup (props) {
        const state = reactive({
            show: false,
            noticeContent: ''
        })
        let noticeCloseTimer
        const gotMsg = res => {
            console.log(res)
            state.show = true
            state.noticeContent = res.detail.content
            if (noticeCloseTimer) clearTimeout(noticeCloseTimer)
            noticeCloseTimer = setTimeout(() => {
                state.show = false
            }, 5000)
        }

        document.body.addEventListener('GotMsg_notice', gotMsg, false)
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_notice', gotMsg)
        })
        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                let returnVal
                if (!isEmpty(tag) && tag.length > 0) {
                    tag.forEach(item => {
                        returnVal = content.replace(reg, function (matchStr) {
                            const time = matchStr.toString().replace(/<\/?time>/g, '')
                            const timeStr = window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                            return timeStr
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

        return {
            computeHtmlTime,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '~@plans/style.scss';
.notice-wrap {
    width: 96% !important;
    height: 15%;
    margin: 2% !important;
    overflow: hidden;
    background: var(--contentColor);
    border-radius: rem(10px);
    box-shadow: rem(2px) rem(3px) rem(5px) var(--minorColor);
    .notice {
        padding: rem(30px);
        .top {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(10px);
            .title {
                font-weight: bold;
            }
        }
        .content {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
    }
}
</style>
