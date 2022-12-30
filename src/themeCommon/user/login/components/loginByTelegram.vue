<template>
    <div class='login-telegram'>
        <div ref='telegramRef' class='telegram'></div>
        <slot>
            <a class='login'>
                <i class='icon'></i>
            </a>
        </slot>
    </div>
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
import { reactive, toRefs, computed, watch, ref, watchEffect } from 'vue'
import hooks from '../loginHooks'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const telegramRef = ref(null)
        const store = useStore()
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false,
            loginType: 'telegram'
        })

        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'telegram')?.clientId)

        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        const onTelegramAuth = (res) => {
            handleCBLogin(res)
        }

        const renderBtn = () => {
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://telegram.org/js/telegram-widget.js?19'
            script.setAttribute('data-size', 'large')
            script.setAttribute('data-telegram-login', appId.value)
            script.setAttribute('data-request-access', 'write')
            window.onTelegramAuth = onTelegramAuth
            script.setAttribute('data-onauth', 'window.onTelegramAuth(user)')
            telegramRef.value?.appendChild(script)
        }

        watchEffect(() => {
            if (appId.value) {
                renderBtn()
            }
        })

        return {
            telegramRef,
            onTelegramAuth,
            areaActions,
            onSelectCountry,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login-telegram {
    cursor: pointer;
    display: inline-block;
    width: rem(80px);
    height: rem(80px);
    position: relative;
    overflow: hidden;
    .telegram {
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
        background-image: url('/images/telegram.png');
        background-size: 100%;
    }
}
</style>
