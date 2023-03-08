<template>
    <div class='full'>
        <div class='quick-module'>
            <p class='title'>
                Earn crypto by funds
            </p>
            <p class='describe'>
                <img alt='' class='gift_img' src='../../../images/home/gift.png' />
                <span class='active' @click='goActive'>
                    {{ isLogin ? 'Trade V10 for free >':'Register & verify to get V10 for free >' }}
                </span>
            </p>
            <div v-if='!$store.state._user.customerInfo' class='register-box'>
                <input v-model.trim='registerAccount' :placeholder="$t('home.quick.emailOrPhone')" />
                <button @click='goRegister'>
                    Get Started
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
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
        const goActive = () => {
            // 游客去到公告详情，登录去V10
            if (isLogin.value) {
                router.push('/fundV10/index')
            } else {
                router.push({
                    path: '/noticeDetail',
                    query: {
                        id: 35,
                        type: 'notice'
                    }
                })
            }
        }

        return {
            registerAccount,
            goRegister,
            goActive,
            isLogin
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.full{
    color: #fff;
}
.quick-module {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    .title {
        @include font();
        font-size: 54px;
        font-weight: bold;
        color: var(--color);
        margin-bottom: 60px;
    }
    .describe {
        margin-bottom: 14px;
        font-size: 26px;
        color: var(--color);
        display: flex;
        align-items: center;
        .active:hover{
            color: var(--primary);
            cursor: pointer;
        }
        .gift_img{
            width: 28px;
            margin-right: 12px;
        }
    }
    .register-box {
        display: flex;
        align-items: center;
        .labelText{
            margin-right: 30px;
            font-size: 16px;
        }
        input {
            width: 400px;
            height: 40px;
            padding: 0 19px;
            margin-right: 30px;
            font-size: 16px;
            background: var(--bgColor);
            border-radius: 4px;
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 128px;
            height: 40px;
            font-size: 16px;
            color: #fff;
            background: var(--primary);
            border-radius: 4px;
            cursor: pointer;
            @include hover();
        }
    }
}
</style>
