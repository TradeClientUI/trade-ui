<template>
    <!-- <router-view /> -->
    <Top v-if='!isUniapp' />
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <keep-alive :include='cacheViews'>
                    <component
                        :is='Component'
                        :key='
                            route.meta.usePathKey ? route.path : undefined
                        '
                    />
                </keep-alive>
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <Bottom v-if='route.meta?.showFooter' />
    <!-- <footerMenu v-if='navData' id='footerMenu' class='footerMenu' :data='navData.data' /> -->
</template>

<script>
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import footerMenu from '../modules/nav/nav'
import { localRemove } from '@/utils/util'
import Top from './layoutTop.vue'
import Bottom from './layoutBottom.vue'

export default {
    name: 'Layout',
    components: {
        Top,
        footerMenu,
        Bottom
    },
    setup () {
        const route = useRoute()
        const { isUniapp } = route.query
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)
        const navData = computed(() => store.state._base.wpNav.find(el => el.tag === 'nav'))
        store.dispatch('_base/getPageConfig', 'Nav').then(res => {
            store.commit('_base/UPDATE_wpNav', res)
        })
        onUnmounted(() => {
            console.log("localRemove('noticeParams')")
            // localRemove('noticeParams')
        })
        return {
            cacheViews,
            navData,
            isUniapp,
            route
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
#app {
    display: flex;
    flex-flow: column;
}
.pageWrap {
    flex: 1;
    padding-bottom: rem(100px);
    overflow-y: auto;
    &.noFoot {
        z-index: 2;
        padding-bottom: 0;
        background: var(--contentColor);
    }
}
</style>
