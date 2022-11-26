<template>
    <top v-if='!isUniapp' left-icon='arrow-left' :right-action='false' :title='title'>
        <template #right>
            <van-loading v-if='loading' class='loadingIcon' :color='primaryColor' size='20px' />
        </template>
    </top>
    <my-iframe
        ref='contentIframe'
        :class="{ 'hasheader': !$route.query.hidehead }"
        page-url='about:blank'
        @onerror='pageOnLoad'
        @onload='pageOnLoad'
    />
    <div>
    </div>
</template>

<script>
import top from '@/components/top'
import myIframe from '@plans/components/iframe'
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
import Base from '@/store/modules/base'
export default {
    components: {
        top,
        myIframe,
    },
    setup () {
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        const route = useRoute()
        const contentIframe = ref(null)
        const { isUniapp } = route.query
        const state = reactive({
            loading: true,
            title: route.query.title || '',
        })

        // 给子页面发送消息
        const launchMessage = (data) => {
            contentIframe.value.iframe.contentWindow.postMessage(data, '*')
        }

        // 处理iframe子页面的postmessage消息
        const fnPostMessage = (ev) => {
            // console.log(ev)
            const { type } = ev.data
            if (type === 'getAppToken') {
                const _data = {
                    authorization: window.sessionStorage.getItem('token'),
                    appKey: window.sessionStorage.getItem('companyId'),
                    userId: window.sessionStorage.getItem('customerNo'),
                    cats2: true,
                }
                launchMessage({
                    type: 'appToken',
                    data: _data
                })
            }
        }

        let timer = null
        onMounted(() => {
            contentIframe.value.setIframeUrl(decodeURIComponent(route.query.url))
            timer = window.setTimeout(() => {
                state.loading = false
            }, 8000)
        })
        window.addEventListener('message', fnPostMessage, false)
        onBeforeUnmount(() => {
            window.removeEventListener('message', fnPostMessage)
        })
        const pageOnLoad = () => {
            if (timer) window.clearTimeout(timer)
            state.loading = false
        }
        return {
            ...toRefs(state),
            pageOnLoad,
            contentIframe,
            primaryColor,
            isUniapp
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loadingIcon {
    margin-right: rem(20px);
}
</style>
