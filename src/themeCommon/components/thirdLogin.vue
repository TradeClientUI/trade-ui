<template>
    <div v-if='thirdLoginArr.length > 0' class='three-way-login'>
        <p class='title'>
            <span style='padding: 0 20px;'>
                {{ $t('login.otherLogin') }}
            </span>
        </p>
        <div class='otherLogin'>
            <LoginByGoogle v-if="thirdLoginArr.includes('google')" />
            <LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />
            <LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />
            <LoginByTelegram v-if="thirdLoginArr.includes('telegram')" />
            <LoginByApple v-if="thirdLoginArr.includes('apple')" />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import LoginByApple from '@/themeCommon/user/login/components/LoginByApple'

const store = useStore()
// 获取三方登录配置
store.dispatch('_base/getLoginConfig')

const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.three-way-login {
    margin-top: 50px;
    .title {
        margin-bottom: 10px;
        color: var(--placeholdColor);
        text-align: center;
        display: flex;
        align-items: center;
        padding: 0 10px;
        &::after {
            background: #E9EBF2;
            content: '';
            flex: 1;
            height: 1px;
        }
        &::before {
            background: #E9EBF2;
            content: '';
            flex: 1;
            height: 1px;
        }
    }
    .otherLogin {
        display: flex;
        justify-content: space-evenly;
        width: 330px;
        margin: 15px auto 0;
        text-align: center;
    }
}
body.night {
    .three-way-login {
        .title {
            color: var(--minorColor);
            &::before,
            &::after {
                background: var(--lineColor);
            }
        }
    }
}
</style>
