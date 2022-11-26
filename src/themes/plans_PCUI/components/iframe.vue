<template>
    <div class='iframe'>
        <iframe
            ref='iframe'
            frameborder='0'
            height='100%'
            leftmargin='0'
            marginheight='0'
            marginwidth='0'
            :name='name'
            scrolling='auto'
            topmargin='0'
            width='100%'
        ></iframe>
    </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { getCookie } from '@/utils/util'
// import { encrypt } from '@/utils/index'
export default {
    name: 'Iframe',
    props: {
        pageName: {
            default: '',
            type: String
        },
        pageUrl: {
            default: '',
            type: String
        }
    },
    setup (props) {
        const state = reactive({
            name: 'iframe' + new Date().getTime(),
            iframeDom: null,
            historyLength: -1,
            pageWidth: document.body.clientWidth,
            appScheme: '',
            loginSuccessCallback: []
        })
        const iframe = ref(null)

        const showUrl = url => {
            let sourceParams = window.sessionStorage.getItem('sourceParams') ? window.sessionStorage.getItem('sourceParams').substring(1) : ''
            sourceParams = sourceParams.replace('pagewidth', 'pagewidth11') // 废弃缓存里面sourceParams中的pagewidth字段，使用下面新的字段
            const lang = getCookie('lang')
            if (url && url !== 'about:blank') {
                return `${url}${url.indexOf('?') > 0 ? '&' : '?'}pagewidth=${this.pageWidth}&isprd=${isPRD}&${sourceParams}&lang=${lang}`
            } else {
                return url
            }
        }
        const setIframeUrl = url => {
            iframe.value.src = url
        }
        onMounted(() => {
            iframe.value.src = showUrl(props.pageUrl)
        })
        return {
            ...toRefs(state),
            iframe,
            setIframeUrl,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.iframe {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
    iframe {
        @include scroll();
    }
}
</style>
