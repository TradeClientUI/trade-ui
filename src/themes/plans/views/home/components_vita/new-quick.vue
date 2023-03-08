<template>
    <div class='full'>
        <div class='new-quick-module'>
            <h2 class='title'>
                Earn crypto by funds
            </h2>
            <p class='banner-text'>
                CATS is the world's first and largest crypto funds platform, gathering and recommending high-quality funds
            </p>

            <!-- <p class='describe'>
                <img alt='' class='gift_img' src='../../../images/home/gift.png' />
                <span v-if='isLogin' class='active' @click='goActive(45)'>
                    Trade V10 for free  >
                </span>
                <span v-else class='active' @click='goActive(44)'>
                    Register & verify to get V10 for free  >
                </span>
            </p> -->
            <div v-if='!$store.state._user.customerInfo' class='register-box'>
                <input v-model.trim='registerAccount' class='input' placeholder='Email/Phone number' />
            </div>
            <div v-if='isLogin' class='register-btn'>
                <button class='btn' @click='$router.push("/quote")'>
                    Trade
                </button>
            </div>
            <p v-if='!$store.state._user.customerInfo' class='learn-more' @click='goRegister'>
                {{ $t('home.getStarted') }}
            </p>
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
        const goActive = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice'
                }
            })
        }
        // 去入金
        const goDeposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    type: 2
                }
            })
        }
        // 去V10
        const goV10Detail = () => {
            router.push('/fundV10/index')
        }

        return {
            registerAccount,
            goRegister,
            goActive,
            isLogin,
            goDeposit,
            goV10Detail
        }
    }
}
</script>

<style lang="scss" scoped>
.full{
    color: #fff;
    @include globalFont();
    width: 100%;
}
.new-quick-module {
    display: flex;
    flex-direction: column;
    text-align: center;
    .title {
        font-size: rem(56px);
        font-weight: bold;
        color: #111;
        line-height: rem(84px);
        margin-bottom: rem(40px);
    }
    .banner-text {
        color: #333333;
        font-weight:500;
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
            color:#EBB650;
            font-size: 24px;
        }
        .active:hover{
            color: var(--primary);
            cursor: pointer;
        }
        .gift_img{
            width: rem(40px);
            margin-right: rem(14px);
        }
    }
    .register-box {
        width: 100%;
        display: flex;
        align-items: center;
        margin: rem(40px) 0;
        .labelText{
            margin-right: 30px;
            font-size: 16px;
        }
        input {
            @include globalFont();
            width: 100%;
            height: rem(90px);
            padding: rem(24px);
            font-size: rem(32px);
            background: #fff;
            border-radius:rem(16px);
            border: 1px solid rgba(0,0,0,0.15);
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 50px;
            font-size: 16px;
            color: #fff;
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
        line-height:  rem(86px);
        background: #0062FF;
        border-radius: rem(16px);
        font-size: rem(28px);
        color: #fff;
    }
}
.register-btn{
    // display: flex;
    // justify-content: space-between;
    .btn{
        height: rem(86px);
        line-height:  rem(86px);
        background: #0062FF;
        color: #fff;
        border-radius: rem(20px);
        width: 100%;
        margin-top: rem(40px);
    }
    .detail-btn{
        background: #fff;
        color: #0062FF;
        border: rem(1px) solid #0062FF;
    }
}
</style>
