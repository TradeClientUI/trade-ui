import dayjs from 'dayjs'
/* 全局mixin */
export default {
    data () {
        return {
            h5Preview: false
        }
    },
    computed: {
        $style () {
            return this.$store.state.style
        },
        accountCurrency () {
            return this.$store.state._user.customerInfo?.currency
        }
    },
    methods: {
        // 用wp配置的URL
        openUrl (toRoute) {
            if (toRoute.href.name === 'Nest') {
                toRoute.href.params.type = 'otherPage'
                // this.$router.push(toRoute.href)
                if (toRoute.href.query?.url) window.open(toRoute.href.query.url)
            } else {
                this.$router.push({ name: toRoute.href.name })
            }
        },
        // 日期时间格式化
        formatTime (val, fmt = 'YYYY-MM-DD HH:mm:ss') {
            return dayjs(val).format(fmt)
        }
    }
}
