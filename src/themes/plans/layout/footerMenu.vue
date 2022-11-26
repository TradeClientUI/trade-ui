<template>
    <van-tabbar v-model='active' :active-color='primaryColor' class='footerMenu'>
        <van-tabbar-item v-for='item in menuList' :key='item.href' :name='item.href' @click='menuHandler(item)'>
            <template #icon>
                <i class='icon' :class='item.icon'></i>
            </template>
            <p class='title'>
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
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        const state = reactive({
            active: route.name,
            menuList: [
                {
                    title: t('route.home'),
                    href: '/home',
                    icon: 'icon_icon_home',
                },
                // {
                //     title: t('route.selfSymbol'),
                //     href: '/selfSymbol',
                //     icon: 'icon_zixuan',
                // },
                {
                    title: t('route.quote'),
                    href: '/quote',
                    icon: 'icon_icon_quotes',
                },
                {
                    title: t('route.trade'),
                    href: '/order',
                    icon: 'icon_jiaoyi1',
                },
                {
                    title: t('route.assets'),
                    href: '/assets',
                    icon: 'icon_zichan',
                },
                {
                    title: t('route.mine'),
                    href: '/mine',
                    icon: 'icon_icon_mine',
                },
            ]
        })
        watchEffect(() => (state.active = route.path))

        // 切换导航
        const menuHandler = (item) => {
            let href = item.href
            if (href === '/order') {
                const [symbolId, tradeType] = symbolKey.value?.split('_')
                href = `/order?symbolId=${symbolId}&tradeType=${tradeType}`
            }
            router.push(href).catch(err => {
                console.log(err)
                state.active = route.path
            })
        }
        return {
            ...toRefs(state),
            menuHandler,
            primaryColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.footerMenu {
    background: var(--contentColor);
    .van-tabbar-item--active {
        color: var(--primary);
        background: var(--contentColor);
    }
    .van-tabbar-item {
        color: var(--placeholdColor);
    }
}
:deep(.van-tabbar-item__icon) {
    font-size: rem(46px);
}
:deep(.van-tabbar-item__text) {
    font-size: rem(20px);
}
.title {
    text-align: center;
}
</style>
