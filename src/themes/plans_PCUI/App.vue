<template>
    <Suspense>
        <template #default>
            <router-view v-if='isRouterAlive' v-slot='{ Component, route }'>
                <!-- <transition mode='out-in' :name="route.meta.transition || 'fade'"> -->
                <keep-alive :include='cacheViews'>
                    <component :is='Component' :key='route.meta.usePathKey ? route.path : undefined' />
                </keep-alive>
                <!-- </transition> -->
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <Notice />
    <!-- <router-view />  -->
</template>

<script>
import { useStore } from 'vuex'
import { computed, nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { getQueryVariable, sessionSet, unzip, computeHtmlTime, localSet } from '@/utils/util'
import { configSystem } from '@/api/base'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const cacheViews = computed(() => store.state.cacheViews)
        const googleAnalytics = computed(() => store.state._base.wpCompanyInfo.googleAnalytics)
        const tipTextCountDown = ref(t('confirm') + '(3s)')
        const noticeContent = ref(null)
        if (getQueryVariable('b_superiorAgent')) {
            sessionSet('b_superiorAgent', getQueryVariable('b_superiorAgent'))
        }

        // 跳转到登录页面刷新
        const handlerLogout = () => {
            return store
                .dispatch('_user/logout')
                .then(() => {
                    return router.push('/home') // 创建一个访问首页的浏览器历史记录
                })
                .then(() => {
                    return router.push('/login')
                })
                .then(() => {
                    location.reload()
                })
        }

        // 用户被踢出消息
        const kickOut = () => {
            return handlerLogout()
        }

        // 用户异地登录
        const disconnect = () => {
            if (MsgSocket?.ws) MsgSocket.ws.close() // 断开msg ws链接
            let countNum = 3
            const countTimer = setInterval(() => {
                countNum--
                tipTextCountDown.value = `${t('confirm')}(${countNum}s)`
                if (countNum === 0) {
                    Dialog.close()
                    handlerLogout()
                    clearInterval(countTimer)
                }
            }, 1000)
            Dialog.alert({
                title: t('tip'),
                message: t('c.otherPlaceLogin'),
                confirmButtonText: tipTextCountDown
            }).then(() => {
                handlerLogout()
            })
        }

        // 全局通知
        const gotMsg = (res) => {
            noticeContent.value = res.detail.content
            ElNotification({
                title: noticeContent.value.title || t('c.biaoTi'),
                dangerouslyUseHTMLString: true,
                message: `<div class='content'>${computeHtmlTime(noticeContent.value.text)}</div>`
            })
        }

        // 检查系统是否在维护
        configSystem()
            .then(res => {
                // "exception":[11,13,16,360,362,387,388,1,2,9,10]
                // "domain:"["cmfbl.com"]
                const isProduction = process.env.NODE_ENV === 'production'
                if (isProduction && res && res.maintenance === true) {
                    const { exception, domain } = res
                    const host = location.host
                    const companyId = window['companyId']
                    const isQA = domain.find(el => host.includes(el)) && exception.indexOf(Number(companyId)) > -1
                    if (!isQA) {
                        location.href = `/upgrading.html?back=${encodeURIComponent(location.href)}`
                    }
                }
            })
            .catch(() => {
                // location.href = `/upgrading.html?back=${encodeURIComponent(location.href)}`
            })

        const isRouterAlive = ref(true)
        const routerReload = () => {
            isRouterAlive.value = false
            nextTick(() => {
                isRouterAlive.value = true
            })
        }

        // 插入谷歌统计代码
        onMounted(() => {
            try {
                if (googleAnalytics.value) {
                    var result = ''
                    const reg = /<?script[^>]*>[^<]*<\/script>/gi
                    const analyticsScript = unzip(googleAnalytics.value).match(reg)
                    for (var i in analyticsScript) result += analyticsScript[i] + '\n'
                    result = result.replace(/<\/?script>/g, '')
                    eval(result)
                }
            } catch (error) {

            }
        })

        // 给body添加pc类，给/src/components下的功能组件区分
        document.body.classList.add('pc')

        // 监听ws全局事件
        document.body.addEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
        document.body.addEventListener('GotMsg_disconnect', disconnect, false)
        document.body.addEventListener('GotMsg_notice', gotMsg, false)

        // 跳珠新路由滚动到顶部
        router.afterEach((to, from, next) => {
            window, scrollTo(0, 0)
        })

        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
            document.body.removeEventListener('GotMsg_disconnect', disconnect, false)
            document.body.removeEventListener('GotMsg_notice', gotMsg, false)
        })

        provide('routerReload', routerReload)
        return {
            cacheViews,
            isRouterAlive,
            routerReload
        }
    },
    created () {
        window.vm = this
    }
}
</script>

<style lang="scss">
@import '~@planspc/font/iconfont.css';
@import '~@/sass/mixin.scss';
@import './style.scss';

</style>
