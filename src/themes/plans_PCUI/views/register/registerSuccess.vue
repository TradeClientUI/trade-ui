<template>
    <router-view />
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
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
                <p class='tips'>
                    {{ $t('register.tips1') }}
                </p>
                <div class='btnBox'>
                    <button class='highBtn' @click='toExperience'>
                        {{ $t('register.experienceNow') }}
                    </button>
                    <!-- <button class='highBtn' @click='toDesposit'>
                {{ $t('register.goDeposit') }}
            </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDevice, setToken } from '@/utils/util'
import topNav from '@planspc/layout/topNav'
export default {
    name: 'RegisterSuccess',
    components: {
        topNav
    },
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
.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        overflow: auto;
        .content {
            width: 520px;
            padding: 60px;
            background-color: var(--contentColor);
            border-radius: 10px;
        }
    }
    .registerSuccess {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .container {
            flex-direction: column;
        }
        .icon {
            width: rem(200px);
            color: var(--success);
            font-size: rem(120px);
            text-align: center;
        }
        h2 {
            font-weight: normal;
            font-size: 30px;
        }
        .accountNo {
            color: var(--success);
        }
    }
    .tips {
        margin-top: 28px;
        color: var(--minorColor);
        font-size: 14px;
        text-align: center;
    }
    .btnBox {
        display: flex;
        margin: 40px 0 0;
        text-align: center;
        .btn,
        .highBtn {
            @include active();
            flex: 1;
            height: 48px;
            color: var(--primary);
            line-height: 1.5;
            background: #F3F8FE;
            border-radius: 4px;
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
