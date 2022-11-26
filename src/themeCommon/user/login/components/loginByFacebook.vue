<template>
    <a class='loginByFacebook' @click='onLogin'>
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
import { reactive, toRefs, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import hooks from '../loginHooks'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false,
            loginType: 'facebook'
        })
        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'facebook')?.clientId)
        const renderBtn = () => {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: appId.value,
                    cookie: true, // Enable cookies to allow the server to access the session.
                    xfbml: true, // Parse social plugins on this webpage.
                    version: 'v12.0' // Use this Graph API version for this call.
                })
            };

            (function (d, s, id) {
                var js; var fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) { return }
                js = d.createElement(s); js.id = id
                js.src = 'https://connect.facebook.net/en_US/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
            }(document, 'script', 'facebook-jssdk'))
        }

        const onLogin = () => {
            FB.login(function (response) {
                console.log(response)
                if (response.status === 'connected') {
                    // Logged into your webpage and Facebook.
                    const accessToken = response.authResponse.accessToken
                    handleCBLogin(accessToken)
                } else {
                    // The person is not logged into your webpage or we are unable to tell.
                }
            }, { scope: 'public_profile,email' })
        }

        watch(
            () => appId.value, (val) => {
                if (val) {
                    renderBtn()
                }
            }
        )

        return {
            onLogin,
            areaActions,
            onSelectCountry,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByFacebook {
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
        background-image:  url('/images/facebook.png');
        background-size: 100%;
    }
}
</style>
