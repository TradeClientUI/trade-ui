<template>
    <div class='full'>
        <div class='new-quick-module'>
            <h2 class='title'>
                <span>{{ $t('homeJD.signalsTrade') }}</span>
                <div class='wifi'>
                    <bannerWifi />
                </div>
            </h2>
            <p class='banner-text'>
                {{ $t('homeJD.signalsTradeDesc') }}
            </p>
            <banner-register />
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import bannerRegister from './bannerRegister'
import bannerWifi from '@/themeCommon/components/signalWifi.vue'

export default {
    components: {
        bannerRegister,
        bannerWifi
    },
    setup () {
        const router = useRouter()
        const registerAccount = ref('')

        const store = useStore()
        const isLogin = computed(() => store.state._user.customerInfo)

        // 去注册
        const goRegister = () => {
            const query = {}
            query[registerAccount.value.includes('@') ? 'email' : 'mobile'] = registerAccount.value
            router.push({ name: 'Register', query })
        }

        const goActive = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
            })
        }

        const toQuote = () => {
            router.push('/quote')
        }

        return {
            registerAccount,
            goRegister,
            goActive,
            isLogin,
            toQuote
        }
    }
}
</script>

<style lang="scss" scoped>
.full {
    color: #FFF;
    width: 100%;
}
.new-quick-module {
    display: flex;
    flex-direction: column;
    text-align: center;
    .title {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        span {
            font-size: rem(56px);
            font-weight: bold;
            color: var(--color);
            line-height: rem(84px);
            margin-bottom: rem(40px);
            text-align: center;
            white-space: pre;
        }
        .wifi {
            position: relative;
            :deep(.wifi-symbol) {
                position: absolute;
                top: 0;
                margin-top: -30px;
            }
        }
    }
    :deep(.register-box) {
        flex-direction: column;
        padding-top: rem(50px);
        .btn {
            margin-right: 0;
            font-size: 14px;
        }
        .third-login {
            width: 100%;
        }
    }
    .banner-text {
        color: var(--color);
        font-weight: 500;
        font-size: rem(32px);
    }
    .describe {
        margin-top: rem(68px);
        font-size: rem(28px);
        color: var(--color);
        display: flex;
        align-items: center;
        font-weight: 500;
        .usdt-num {
            color: #EBB650;
            font-size: 24px;
        }
        .active:hover {
            color: var(--primary);
            cursor: pointer;
        }
        .gift_img {
            width: rem(40px);
            margin-right: rem(14px);
        }
        .active {
            color: var(--color);
        }
    }
    .register-box {
        width: 100%;
        display: flex;
        align-items: center;
        margin: rem(40px) 0;
        .labelText {
            margin-right: 30px;
            font-size: 16px;
        }
        input {
            width: 100%;
            height: rem(90px);
            padding: rem(24px);
            font-size: rem(32px);
            background: var(--contentColor);
            border-radius: rem(16px);
            border: 1px solid rgba(0, 0, 0, 0.15);
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 50px;
            font-size: 16px;
            color: #FFF;
            background: var(--primary);
            border-radius: 0 4px 4px 0;
            border: 1px solid var(--primary);
            cursor: pointer;
            @include hover();
        }
    }
    .learn-more {
        display: block;
        font-weight: 500;
        height: rem(86px);
        line-height: rem(86px);
        background: var(--primary);
        border-radius: rem(16px);
        font-size: rem(28px);
        color: #FFF;
    }
}
.register-btn {
    // display: flex;
    // justify-content: space-between;
    .btn {
        height: rem(86px);
        line-height: rem(86px);
        background: var(--primary);
        color: #FFF;
        border-radius: rem(8px);
        width: 100%;
        margin-top: rem(40px);
        border: 1px solid var(--primary);
    }
    .detail-btn {
        border-color: var(--primary);
        background: transparent;
        color: var(--primary);
    }
}
body.night {
    .new-quick-module .register-box input {
        border-color: var(--mainColor);
        background-color: initial;
    }
}
</style>
