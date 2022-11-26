<template>
    <a id='my-sign-google' class='loginByGoogle'>
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
    <!-- <van-button type='primary' @click='login_google("google")'>
        测试google
    </van-button> -->
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, getCurrentInstance } from 'vue'
import loadScript from '@/utils/loadScript'
import { useI18n } from 'vue-i18n'
import hello from 'hellojs/dist/hello.all.min.js'
import { useStore } from 'vuex'
import hooks from '../loginHooks'
export default {
    setup (props, context) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        var auth2 = ''
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'google')?.clientId)
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            loading: false,
            idToken: '',
            loginType: 'google'
        })

        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        const renderBtn = () => {
            loadScript('https://apis.google.com/js/api:client.js').then(() => {
                startApp()
            })
        }

        const attachSignin = (element) => {
            auth2.attachClickHandler(element, {}, function (googleUser) {
                var id_token = googleUser.getAuthResponse().id_token
                // 处理与cats系统交互
                handleCBLogin(id_token)
            }, function (error) {
                console.log(error)
            })
        }

        const startApp = () => {
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                auth2 = gapi.auth2.init({
                    client_id: appId.value, // 客户端ID
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile' // 可以请求除了默认的'profile' and 'email'之外的数据
                })
                attachSignin(document.getElementById('my-sign-google'))
            })
        }

        // const login_google = (network) => {
        //     state.loading = true
        //     var google = hello(network)
        //     // Login
        //     google.login().then(function (res) {
        //         state.loading = false
        //         // Get Profile
        //         handleCBLogin(res.authResponse)
        //         return google.api('/me')
        //     }, function (err) {
        //         state.loading = false
        //     }).then(function (p) {
        //         state.loading = false
        //     })
        // }

        watch(
            () => appId.value, (val) => {
                if (val) {
                    renderBtn()
                    // hello.init({
                    //     'google': val,
                    // }, { redirect_uri: window.location.href })
                }
            }, {
                immediate: true
            }
        )

        return {
            areaActions,
            onSelectCountry,
            // login_google,
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
        background-image:  url('/images/google.png');
        background-size: 100%;
    }
}
</style>
