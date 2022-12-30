<template>
    <a class='login-google'>
        <div ref='googleRef' class='google'></div>
        <slot>
            <a class='login'>
                <i class='icon'></i>
            </a>
        </slot>
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
import { reactive, toRefs, computed, ref, watch, getCurrentInstance } from 'vue'
import loadScript from '@/utils/loadScript'
import { useI18n } from 'vue-i18n'
import hello from 'hellojs/dist/hello.all.min.js'
import { useStore } from 'vuex'
import hooks from '../loginHooks'
export default {
    setup (props, context) {
        const store = useStore()
        const googleRef = ref(null)
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
            loadScript('https://accounts.google.com/gsi/client').then(() => {
                startApp()
            })
        }

        const attachSignin = (element) => {
            const code = element.credential
            handleCBLogin(code)
        }

        const startApp = () => {
            window.google.accounts.id.initialize({
                // 主要就是填写client_id
                client_id: appId.value,
                auto_select: false,
                callback: attachSignin,
            })
            // 设置按钮的样式等
            window.google.accounts.id.renderButton(
                googleRef.value,
                {
                    theme: 'filled_blue',
                    size: 'large',
                    type: 'standard',
                    text: 'signin_with'
                }
            )
        }

        watch(
            () => appId.value, (val) => {
                if (val) {
                    renderBtn()
                }
            }, {
                immediate: true
            }
        )

        return {
            googleRef,
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
.login-google {
    cursor: pointer;
    display: inline-block;
    width: rem(80px);
    height: rem(80px);
    position: relative;
    overflow: hidden;
    .google {
        overflow: hidden;
        opacity: 0.00001;  // 透明度为0的时候firefox无法触发点击事件
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }
}
.login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--lineColor);
    border-radius: 50%;
    .icon {
        display: inline-block;
        width: rem(46px);
        height: rem(46px);
        background-image: url('/images/google.png');
        background-size: 100%;
    }
}
</style>
