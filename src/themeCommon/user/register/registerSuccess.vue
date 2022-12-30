<template>
    <div class='page-wrap'>
        <section class='registerSuccess'>
            <div class='icon'>
                <i class='icon_success'></i>
            </div>
            <div class='container'>
                <h2>{{ $t('register.openSuccess') }}</h2>
                <!-- <p>
                    {{ $t('common.customerNo') + $t('common.colon') }}<span class='accountNo'>
                        {{ accountNo }}
                    </span>
                </p> -->
            </div>
        </section>
        <div class='success-handle'>
            <button class='btn state-2' @click='toQuote'>
                {{ $t('register.tradingOpportunity') }}
            </button>
            <button class='btn state-1' @click='toDesposit'>
                {{ $t('deposit.immediateRecharge') }}
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
        const store = useStore()
        const router = useRouter()
        
        // 跳转到行情页面
        const toQuote = () => {
            return router.replace({ name: 'Quote' })
        }

        // 跳转到充值页面
        const toDesposit = () => {
            return router.replace({ name: 'DepositChoose' })
        }

        return {
            toQuote,
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
}
.registerSuccess {
    padding: rem(200px) rem(40px) rem(40px);
    .icon {
        color: var(--success);
        font-size: rem(120px);
        text-align: center;
        .icon_success {
            color: var(--primary);
        }
    }
    .container {
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
.success-handle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: rem(20px);
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: rem(600px);
        height: rem(100px);
        margin: 0 rem(30px) rem(50px);
        border-radius: rem(10px);
        &.state-1 {
            background: var(--primary);
            color: #FFF;
        }
        &.state-2 {
            color: var(--primary);
            background-color: #F3F8FE;
        }
    }
}
</style>
