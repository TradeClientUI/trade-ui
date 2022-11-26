<template>
    <centerViewDialog>
        <div class='registerAuthCondition'>
            <Top
                back
                left-icon='arrow-left'
                :menu='false'
            />

            <auth-condition business-code='open_account' platform='web'>
                <template #notice>
                    <p class='notice'>
                        {{ $t('register.tips2') }}
                    </p>
                </template>
            </auth-condition>
        </div>
    </centerViewDialog>
</template>

<script>
import Top from '@/components/top'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import authCondition from '@/themeCommon/components/authConditon'
import { useStore } from 'vuex'
import centerViewDialog from '@planspc/layout/centerViewDialog'

export default {
    components: {
        authCondition,
        centerViewDialog,
        Top
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        onBeforeRouteLeave((to, from) => {
            if (to.fullPath === '/login') {
                // 退出登录 断开ws
                store.dispatch('_user/logout').then(() => {
                    return router.push('/login')
                }).then(() => {
                    location.reload()
                })
            }
        })
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.notice {
    margin-top: rem(20px);
    margin-bottom: rem(20px);
    padding-left: rem(30px);
}
.registerAuthCondition {
    height: 100%;
    overflow: auto;
}
</style>
