<template>
    <div v-if='!$store.state._user.customerInfo' class='full'>
        <div class='quick-module auto-width'>
            <div class='register-box'>
                <span class='labelText'>
                    {{ $t('home.quick.title') }}
                </span>
                <input v-model.trim='registerAccount' :placeholder="$t('home.quick.emailOrPhone')" />
                <button @click='goRegister'>
                    {{ $t('home.getStarted') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup () {
        const router = useRouter()
        const registerAccount = ref('')

        // 去注册
        const goRegister = () => {
            const query = {}
            query[registerAccount.value.includes('@') ? 'email' : 'mobile'] = registerAccount.value
            router.push({ name: 'Register', query })
        }

        return {
            registerAccount,
            goRegister,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.full{
    background: #181A20;
    color: #fff;
}
.quick-module {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
        @include font();
        font-size: 32px;
        font-weight: bold;
        color: var(--color);
    }
    .describe {
        margin-top: 10px;
        font-size: 16px;
        color: var(--color);
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
