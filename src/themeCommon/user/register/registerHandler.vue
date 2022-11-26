<template>
    <div class='page-wrap'>
        <section class='registerSuccess'>
            <div class='icon'>
                <i class='icon_success'></i>
            </div>
            <div class='container'>
                <h2>{{ $t('register.openHandler') }}</h2>
                <p class='muted'>
                    {{ $t('register.servicePlease') }}
                </p>
            </div>
        </section>
        <div class='btnBox'>
            <button class='highBtn' @click='toExperience'>
                {{ $t('common.sure') }}
            </button>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDevice, setToken } from '@/utils/util'
export default {
    setup () {
        const RegisterData = JSON.parse(sessionStorage.getItem('RegisterData')) ?? {}
        const RegisterParams = JSON.parse(sessionStorage.getItem('RegisterParams')) ?? {}
        const store = useStore()
        const router = useRouter()
        const onceState = reactive({
            accountNo: RegisterData.data?.customerNo
        })
        const token = RegisterData.data?.token
        if (token) setToken(token)
        const toExperience = () => {
            return router.replace('/')
        }

        return {
            ...onceState,
            toExperience,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    background-color: var(--contentColor);
    .registerSuccess {
        padding: rem(100px) rem(60px) rem(40px) rem(50px);
        .icon {
            color: var(--primary);
            font-size: rem(120px);
            text-align: center;
            margin-top: rem(10px);
        }
        .container{
            text-align: center;
            h2 {
                margin: rem(15px) 0 rem(10px);
                font-weight: normal;
                font-size: rem(32px);
            }
        }
       
        .accountNo {
            color: var(--success);
        }
    }
    .tips {
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(26px);
        text-align: center;
    }
    .btnBox {
        display: flex;
        margin: rem(60px) rem(80px);
        text-align: center;
        .highBtn {
            @include active();
            flex: 1;
            height: rem(100px);
            color: var(--primary);
            line-height: 1.5;
            background: #F3F8FE;
            border-radius: rem(10px);
        }
        .highBtn {
            color: #FFF;
            background: var(--primary);
        }
    }
}

</style>
