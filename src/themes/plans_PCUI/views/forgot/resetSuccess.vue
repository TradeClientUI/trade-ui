<template>
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <div class='wrap'>
                    <i class='icon_success'></i>
                    <p class='t1'>
                        {{ $t('forgot.newPwdSuccess') }}
                    </p>
                    <p class='t2'>
                        {{ $t('forgot.newPwdLogin') }}
                    </p>
                </div>
                <van-button class='confirmBtn' @click='toLogin'>
                    <span>{{ $t('forgot.goLogin') }}</span>
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import { useRouter } from 'vue-router'
import { removeLoginParams } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    name: 'ResetSuccess',
    components: {
        topNav
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const toLogin = () => {
            removeLoginParams()
            store.dispatch('_user/logout').then(() => {
                return router.push('/login')
            }).then(() => {
                location.reload()
            })
        }

        return {
            toLogin
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        flex: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .content{
            width:520px;
            padding: 60px;
            border-radius: 10px;
            background-color: var(--contentColor);
        }
    }
}
.wrap {
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: 64px;
    }
    .t1 {
        margin-top: 20px;
        color: var(--color);
        font-size: 32px;
        font-weight: bold;
    }
    .t2 {
        margin-top: rem(20px);
        color: var(--color);
        font-size: 16px;
    }
    .t3 {
        margin-top: rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
    }
}
.confirmBtn {
    width: 100%;
    background: var(--primary);
    margin-top: 72px;
    color: #fff;
    border-color: var(--primary);
    font-size: 20px;
    border-radius: 4px;
    height: 48px;
}
</style>
