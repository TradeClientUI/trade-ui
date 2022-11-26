<template>
    <a id='my-sign-twitter' class='loginByGoogle' @click="login_twitter('twitter')">
        <i class='icon'></i>
    </a>
    <Loading :show='loading' />
    <!-- 请补充您所在国家信息 -->
    <van-action-sheet
        v-model:show='bindAddShow'
        :actions='areaActions'
        class='loginAreaActionsheet'
        teleport='#app'
        :title='$t("login.inputCountry")'
        @close='loading = false'
        @select='onSelectCountry'
    />
</template>

<script>
import { reactive, onMounted, watch, toRefs, computed } from 'vue'
import hello from 'hellojs/dist/hello.all.min.js'
import hooks from '../loginHooks'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false,
            loginType: 'twitter'
        })
        const store = useStore()
        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'twitter')?.clientId)
        const login_twitter = (network) => { // 登录方法，并将twitter 作为参数传入
            var twitter = hello(network)
            // Login
            twitter.login().then(function (res) {
                // Get Profile
                handleCBLogin(res.authResponse)
                return twitter.api('/me')
            }, function (err) {
            }).then(function (p) {
            })
        }

        watch(
            () => appId.value, (val) => {
                if (val) {
                    hello.init({
                        'twitter': val
                    })
                }
            }
        )

        return {
            login_twitter,
            onSelectCountry,
            areaActions,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByGoogle {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    border: 1px solid var(--lineColor);
    border-radius: 50%;
    .icon {
        display: inline-block;
        width: rem(46px);
        height: rem(46px);
        background-image:  url('/images/twitter.png');
        background-size: 100%;
    }
}
</style>
