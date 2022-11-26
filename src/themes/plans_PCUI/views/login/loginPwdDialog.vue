<template>
    <van-popup v-model:show='visible' :close-on-click-overlay='false' :style="{ 'border-radius':'8px','background-color': $style.bgColor }">
        <section class='popContainer'>
            <a class='noTip' href='javascript:;' @click='noTip'>
                {{ $t('login.neverTip') }}
            </a>
            <div class='containerBox'>
                <p class='iconPwd'>
                    <span class='icon_password'></span>
                </p>
                <p class='tipContent'>
                    {{ $t('login.pwdTips') }}
                </p>
            </div>
            <div class='btnBox'>
                <button class='btn' @click='loginPwdSet'>
                    {{ $t('login.goSet') }}
                </button>
                <button class='btn muted' @click='loginPwdSetNext'>
                    {{ $t('login.nextTime') }}
                </button>
            </div>
        </section>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { localSet } from '@/utils/util'
import LoginHook from './loginHook'
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: true
        },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const router = useRouter()
        const { loginToPath } = LoginHook()

        const visible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 设置登录密码
        const loginPwdSet = () => {
            emit('update:modelValue', false)
            router.replace('/home').then(() => {
                router.push('/home/setLoginPwd')
            })
        }
        // 下次设置登录密码
        const loginPwdSetNext = () => {
            emit('update:modelValue', false)
            loginToPath()
        }
        // 设置登录密码不再提醒
        const noTip = () => {
            localSet('loginPwdIgnore', true)
            emit('update:modelValue', false)
            loginToPath()
        }

        return {
            visible,
            loginPwdSet,
            loginPwdSetNext,
            noTip,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.popContainer {
    position: relative;
    width: 400px;
    background: var(--contentColor);
    border-radius: 8px;
    .kycTimeLine {
        padding: rem(60px);
    }
    .containerBox {
        padding: rem(80px) rem(60px);
    }
    .tipContent {
        font-size: rem(28px);
        line-height: 1.5;
        text-align: center;
    }
    .iconPwd {
        padding-bottom: rem(35px);
        text-align: center;
    }
    .icon_password {
        color: var(--primary);
        font-size: rem(60px);
    }
    .noTip {
        position: absolute;
        top: rem(20px);
        right: rem(20px);
        color: var(--minorColor);
    }
    .btnBox {
        position: relative;
        display: flex;
        color: var(--color);
        font-size: rem(34px);
        text-align: center;
        background: var(--bgColor);
        border-top: 1px solid var(--lineColor);
        &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1px;
            height: rem(50px);
            background: var(--lineColor);
            transform: translateY(-50%);
            content: '';
        }
        .btn {
            @include active();
            flex: 1;
            height: rem(100px);
            cursor: pointer;
            line-height: 1;
            background: none;
        }
    }
}
</style>
