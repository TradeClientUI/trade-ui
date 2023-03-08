<template>
    <div class='container'>
        <div id='inflow2App' ref='inflow2App'></div>
    </div>
</template>

<script>
import loadScript from '@/utils/loadScript'
import loadCSS from '@/utils/loadCSS'
import { useI18n } from 'vue-i18n'
let loaded = false
let scrollTop = 0
export default {
    name: 'News',
    activated () {
        const homeContent = document.querySelector('#homeContent')
        if (homeContent) homeContent.scrollTop = scrollTop
        // const wequickNewsListCss = [...document.querySelectorAll('link')].find(el => el.href.includes('wequickNewsList.css'))
        // if (wequickNewsListCss) wequickNewsListCss.disabled = false
    },
    deactivated () {
        // const wequickNewsListCss = [...document.querySelectorAll('link')].find(el => el.href.includes('wequickNewsList.css'))
        // if (wequickNewsListCss) wequickNewsListCss.disabled = true
    },
    mounted () {
        const _this = this
        const { t } = useI18n({ useScope: 'global' })
        window['IX_postMessage'] = (win => {
            function IX_postMessage () {
                this.domain = ''
                this.key = ''
                this.inIframe = !(window.self === window.top)
                this.callback = {}
            }
            IX_postMessage.prototype.toMiddlePage = function (data) {
                _this.openUrl(data.query.url, t('infos'))
            }
            return new IX_postMessage()
        })(window)
        this.init()
        this.writeTop()
    },
    unmounted () {
        const homeContent = document.querySelector('#homeContent')
        if (homeContent) homeContent.removeEventListener('scroll', this.scrollFn, false)
    },
    methods: {
        init () {
            const jsCode = [
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/vue.js',
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/vant.min.js',
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/prodcn/wequickNewsList.umd.min.js'
                // 'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2/proden/wequickNewsList.umd.min.js'
            ]
            const cssCode = 'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/prodcn/wequickNewsList.css'
            // const cssCode = 'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2/proden/wequickNewsList.css'
            if (loaded) {
                setTimeout(() => {
                    this.initInflow()
                }, 100)
            } else {
                const loadList = jsCode.reduce((acc, item) => {
                    acc.push(loadScript(item))
                    return acc
                }, [])
                loadList.push(loadCSS(cssCode))

                Promise.all(loadList).then(res => {
                    loaded = true
                    this.initInflow()
                })
            }
        },
        // 初始化信息流组件
        initInflow () {
            this.$refs.inflow2App.innerHTML = '<demo :orgid="1" lang="en"></demo>'
            new window.Vue({
                components: {
                    demo: window.wequickNewsList
                }
            }).$mount('#inflow2App')
        },
        // 记录信息流的滚动条，保留上次滑动的位置
        writeTop () {
            const homeContent = document.querySelector('#homeContent')
            this.scrollFn = evt => {
                scrollTop = evt.target.scrollTop
            }
            if (homeContent) homeContent.addEventListener('scroll', this.scrollFn, false)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

</style>
