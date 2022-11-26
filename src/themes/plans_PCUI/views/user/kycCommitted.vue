<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <i class='icon_success'></i>
            <p class='t1'>
                {{ $t('auth.tips0') }}
            </p>
            <p class='t2'>
                {{ $t('auth.tips1') }}
            </p>

            <!-- <p class='t2'>
                {{ $t('auth.tips2') }}
            </p> -->

            <div class='btns'>
                <van-button hairline type='success' @click='toExperience'>
                    {{ $t('compLang.close') }}
                </van-button>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    name: 'KycCommitted',
    components: {
        centerViewDialog
    },
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const backAuth = () => {
            router.push({
                path: route.path.slice(0, -13) + '/authentication'
            })
        }
        const toExperience = () => {
            // 退出登录 断开ws
            router.go(-2)
            // store.dispatch('_user/logout').then(() => {
            //     return router.push('/login')
            // }).then(() => {
            //     location.reload()
            // })
        }
        return {
            toExperience,
            backAuth
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    padding: rem(200px) rem(30px) rem(30px);
    text-align: center;
    background: var(--contentColor);
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .t1 {
        margin: rem(20px) rem(50px);
        font-weight: bold;
        font-size: rem(36px);
    }
    .t2 {
        margin: rem(100px) rem(50px);
        line-height: rem(50px);
    }
    .btns {
        display: flex;
        justify-content: space-around;
        margin-top: rem(50px);
    }
}

</style>
