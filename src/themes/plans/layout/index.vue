<template>
    <!-- <router-view /> -->
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
    <footerMenu v-if='navData' id='footerMenu' class='footerMenu' :data='navData.data' />
</template>

<script>
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import footerMenu from '../modules/nav/nav'
import { localRemove } from '@/utils/util'

export default {
    name: 'Layout',
    components: {
        footerMenu
    },
    setup () {
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
            navData
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
