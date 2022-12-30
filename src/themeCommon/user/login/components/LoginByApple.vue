<template>
    <!-- 登录按钮 -->
    <a class='loginByApple' @click='onAppleLogin'>
        <i class='icon'></i>
    </a>
    <!-- 加载效果 -->
    <Loading :show='loading' />
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, onBeforeUnmount, watch, getCurrentInstance } from 'vue'
import loadScript from '@/utils/loadScript'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import hooks from '../loginHooks'
import Loading from '@/components/loading'
import { localGet } from '@/utils/util'

export default {
    components: {
        Loading
    },
    setup (props, context) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === state.loginType)?.clientId)
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            loading: false,
            idToken: '',
            theme: localGet('invertColor'),
            loginType: 'apple'
        })
        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        // 初始化文件
        const renderBtn = () => {
            if (!window.AppleID) {
                loadScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js').then(() => {
                    AppleID.auth.init({
                        clientId: appId.value,
                        redirectURI: window.location.origin + window.location.pathname,
                        usePopup: true,
                        scope: 'name email'
                    })
                })
            }
        }

        // apple登录
        const onAppleLogin = () => {
            window.AppleID.auth.signIn()
            state.loading = true
        }

        // 授权成功回调
        const authSuccess = (res) => {
            console.log('apple授权成功', res.detail)
            state.loading = false
            const data = res.detail
            // 处理与cats系统交互
            handleCBLogin(data.authorization.id_token, {
                code: data.authorization.code,
                email: data.user?.email || ''
            })
        }

        // 授权失败回调
        const authFailure = (error) => {
            console.log('apple授权失败', error)
            state.loading = false
        }

        watch(() => appId.value, (val) => {
                  if (val) renderBtn()
              },
              {
                  immediate: true
              }
        )

        onMounted(() => {
            document.addEventListener('AppleIDSignInOnSuccess', authSuccess, false)
            document.addEventListener('AppleIDSignInOnFailure', authFailure, false)
        })

        onBeforeUnmount(() => {
            document.removeEventListener('AppleIDSignInOnSuccess', authSuccess, false)
            document.removeEventListener('AppleIDSignInOnFailure', authFailure, false)
        })

        return {
            onAppleLogin,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByApple {
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
        background-size: 100%;
        background-image: url('/images/apple-black.png?545454545');
    }
}
body.night {
    .loginByApple {
        .icon {
            background-image: url('/images/apple-white.png?545454545');
        }
    }
}
</style>
