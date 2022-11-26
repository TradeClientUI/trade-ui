<template>
    <div class='page-wrap'>
        <section class='registerSuccess'>
            <div class='icon'>
                <i class='icon_success'></i>
            </div>
            <div class='container'>
                <h2>{{ $t('register.openSuccess') }}</h2>
                <p>
                    {{ $t('common.customerNo') + $t('common.colon') }}<span class='accountNo'>
                        {{ accountNo }}
                    </span>
                </p>
            </div>
        </section>
        <!--
        <p class='tips'>
            {{ $t('register.tips1') }}
        </p>
        -->
        <div class='btnBox'>
            <button class='highBtn' @click='toExperience'>
                {{ $t('register.experienceNow') }}
            </button>
            <!-- <button class='highBtn' @click='toDesposit'>
                {{ $t('register.goDeposit') }}
            </button> -->
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
            return router.replace({ name: 'Quote' })
        }
        const toDesposit = () => {
            return router.replace({ name: 'Deposit' })
        }

        return {
            ...onceState,
            toExperience,
            toDesposit
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    background-color: var(--bgColor);
    .registerSuccess {
        padding: rem(80px) rem(40px)  rem(40px);
        .icon {
            color: var(--success);
            font-size: rem(120px);
            text-align: center;
            .icon_success{
                color: var(--primary);
            }
        }
        .container{
            text-align: center;
            h2 {
                margin: rem(15px) 0 rem(20px);
                font-weight: normal;
                font-size: rem(32px);
            }
        }
        
        .accountNo {
            color: var(--primary);
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
        .btn,
        .highBtn {
            @include active();
            flex: 1;
            height: rem(100px);
            margin-right: rem(20px);
            color: var(--primary);
            line-height: 1.5;
            background: #F3F8FE;
            border-radius: rem(10px);
        }
        .highBtn {
            color: #FFF;
            background: var(--primary);
        }
        .smallRow {
            font-size: rem(20px);
            i {
                color: #FFFC00;
            }
        }
    }
}

</style>
