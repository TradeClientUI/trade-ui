<template>
    <Top
        back
        left-icon='arrow-left'
        :menu='false'
        :title="$t('cRoute.regKyc')"
    />

    <auth-condition business-code='open_account'>
        <template #notice>
            <p class='notice'>
                {{ $t('register.tips2') }}
            </p>
        </template>
    </auth-condition>
</template>

<script>
import Top from '@/components/top'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import authCondition from '@/themeCommon/components/authConditon'
import { useStore } from 'vuex'
export default {
    components: {
        authCondition,
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
    line-height: rem(40px);
}
</style>
