<template>
    <div v-if='!customerInfo' class='quick-module' :style='data.styleObj'>
        <h3 class='title'>
            {{ $t('home.quick.title') }}
        </h3>
        <p class='describe'>
            {{ $t('home.quick.describe') }}
        </p>
        <div class='register-box'>
            <input v-model.trim='registerAccount' :placeholder="$t('signIn.mobileEmailPlaceholder')" />
            <button @click='goRegister'>
                {{ $t('c.register') }}
            </button>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const registerAccount = ref('')

        // 去注册
        const goRegister = () => {
            const query = {}
            query[registerAccount.value.includes('@') ? 'email' : 'mobile'] = registerAccount.value
            router.push({ name: 'Register', query })
        }

        return {
            customerInfo,
            registerAccount,
            goRegister,
        }
    }
}
</script>

<style lang="scss" scoped>
.quick-module {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: auto !important;
    margin-right: auto !important;
    .title {
        font-size: 32px;
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
        margin-top: 30px;
        input {
            width: 400px;
            height: 48px;
            padding: 0 19px;
            margin-right: 8px;
            font-size: 16px;
            background: var(--bgColor);
            border-radius: 4px;
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 104px;
            height: 48px;
            font-size: 20px;
            color: #fff;
            background: var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>
