<template>
    <topNav :class='[$route.name]' />
    <registerActivityNotification v-if="['Quote','Order'].includes($route.name)" />
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <keep-alive :include='cacheViews'>
                    <component
                        :is='Component'
                        :key='route.meta.usePathKey ? route.path : undefined'
                    />
                </keep-alive>
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <footerNav v-if='!($store.state._user.switchAccounting && $route.name==="Order")' :data='footerData' />
</template>

<script>
import { computed, reactive, toRefs, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import topNav from './topNav'
import footerNav from '../modules/footer/footer.vue'
import { registerActivityNotification } from '@/components/registerActivity'

export default {
    name: 'Layout',
    components: {
        topNav,
        footerNav,
        registerActivityNotification
    },
    computed: {
        footerData () {
            const wpFooter = this.$store.state._base.wpFooter?.find(o => o.tag === 'footer')
            return wpFooter ? wpFooter.data : {}
        }
    },
    setup () {
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)
        const state = reactive({
            noticePopShow: false
        })

        onUnmounted(() => {
            // localRemove('noticeParams')
        })
        return {
            cacheViews,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
// #app {
//     display: flex;
//     flex-flow: column;
// }
// .pageWrap {
//     flex: 1;
//     padding-bottom: rem(100px);
//     overflow-y: auto;
//     &.noFoot {
//         z-index: 2;
//         padding-bottom: 0;
//         background: var(--contentColor);
//     }
// }
</style>
