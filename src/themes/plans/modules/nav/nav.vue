<template>
    <van-tabbar
        v-if='!isUniapp'
        v-model='active'
        :active-color='primaryColor'
        class='footerMenu'
        :class='{ h5Preview }'
        z-index='102'
    >
        <van-tabbar-item v-for='item in data.items' :key='item.href' :name='item.href.name' @click='menuHandler(item)'>
            <template #icon>
                <img
                    v-if='item.src'
                    class='imgIcon'
                    :src='item.src'
                />
                <i v-else-if='item.icon' class='icon' :class='item.icon'></i>
            </template>
            <p v-if='item.title' class='title'>
                {{ item.title }}
            </p>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { reactive, toRefs, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import Base from '@/store/modules/base'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data () {
        return {
            active: '',
            menuList: [
                {
                    title: this.$t('route.home'),
                    href: '/home',
                    icon: 'icon_icon_home',
                },
                {
                    title: this.$t('route.quote'),
                    href: '/quote',
                    icon: 'icon_icon_quotes',
                },
                {
                    title: this.$t('route.trade'),
                    href: '/order',
                    icon: 'icon_jiaoyi1',
                },
                {
                    title: this.$t('route.assets'),
                    href: '/assets',
                    icon: 'icon_zichan',
                },
                {
                    title: this.$t('route.mine'),
                    href: '/mine',
                    icon: 'icon_icon_mine',
                },
            ],
            // 是否为app页面
            isUniapp: false
        }
    },
    computed: {
        symbolKey () {
            return this.$store.state._quote.productActivedID
        },
        primaryColor () {
            return Base.state.wpCompanyInfo?.themeColor || '#2B70AE'
        }
    },
    created () {
        const route = useRoute()
        const { isUniapp } = route.query
        this.isUniapp = isUniapp
        if (!this.h5Preview) {
            this.active = this.$route.name
            this.$watch('$route.name', function (newval) {
                this.active = newval
            })
        }
    },
    methods: {
        menuHandler (item) {
            if (this.h5Preview) return false
            let href = item.href
            if (href?.name === 'Order') {
                const [symbolId, tradeType] = this.symbolKey.split('_')
                href = `/order?symbolId=${symbolId}&tradeType=${tradeType}`
            }
            this.$router.push(href).catch(err => {
                this.active = this.$route.name
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.footerMenu {
    background: var(--contentColor);
    &.h5Preview {
        position: relative;
        padding-top: 140%;
        &::after {
            display: none;
        }
    }
    .van-tabbar-item--active {
        color: var(--primary);
        background: var(--contentColor);
    }
    .van-tabbar-item {
        color: var(--placeholdColor);
    }
    .imgIcon {
        height: 26px;
        opacity: 0.6;
        filter: grayscale(1);
    }
    .van-tabbar-item--active .imgIcon {
        opacity: 1;
        filter: grayscale(0);
    }
}
:deep(.van-tabbar-item__icon) {
    margin-bottom: 0;
    font-size: rem(46px);
}
:deep(.van-tabbar-item__text) {
    font-size: rem(20px);
}
.title {
    margin-top: rem(5px);
    text-align: center;
}
</style>
