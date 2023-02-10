<template>
    <div v-if='isLogin' class='register-box'>
        <div class='register-btns'>
            <button class='btn mobile_home_deposit_ga' @click='toDeposit'>
                {{ countdownAvailable ?
                    $t("registerActivity.depositToGet", {
                        rechargeAmount: activityInfo.rechargeAmount,
                        rewardAmount: activityInfo.rewardAmount,
                    })
                    : $t('homeJD.deposit') }}
            </button>
        </div>
        <registerActivityCountdown dense show-end-text />
        <registerActivityRulePopup />
    </div>
    <div v-else class='register-box'>
        <registerActivityBannerMobile />
        <button class='btn' @click='goRegister'>
            <i class='icon-register'></i>
            <div class='btn-text'>
                <span> {{ $t("homeJD.createAccountFree") }} </span>
                <b :class="{ split: locale === 'en-US' }">
                    {{ $t("homeJD.real") }}
                </b>
                <span> {{ $t("homeJD.and") }} </span>
                <b :class="{ split: locale === 'en-US' }">
                    {{ $t("homeJD.demo") }}
                </b>
                <span> {{ $t("homeJD.account") }} </span>
            </div>
        </button>
        <div v-if='!accessFlag' class='third-login'>
            <div class='title'>
                <span>{{ $t("homeJD.useThirdLogin") }}</span>
            </div>
            <div class='option'>
                <LoginByGoogle>
                    <button class='gray'>
                        <i class='icon-google'></i>
                        <span>Google</span>
                    </button>
                </LoginByGoogle>
                <LoginByTelegram>
                    <button class='gray'>
                        <i class='icon-telegram'></i>
                        <span>Telegram</span>
                    </button>
                </LoginByTelegram>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import { registerActivityBannerMobile, useRegisterActivity, registerActivityCountdown, registerActivityRulePopup } from '@/components/registerActivity'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMethods from '@plans/hooks/useMethods'

const { locale } = useI18n({ useScope: 'global' })

const store = useStore()
const router = useRouter()
const { countdownAvailable, activityInfo } = useRegisterActivity(true)
const { toDeposit } = useMethods()

onMounted(() => {
    // 初始化三方登录配置、国家代号
    store.dispatch('getCountryListByParentCode')
    store.dispatch('_base/getLoginConfig')
})

const isLogin = computed(() => store.state._user.customerInfo)
const accessFlag = computed(() => store.state._base.accessFlag)

const goRegister = () => {
    router.push({ name: 'Register' })
}

</script>

<style lang="scss" scoped>
:deep(.count-down-box) {
    margin-top: 8px;
    margin-bottom: 20px;
}
.register-box {
    margin: 80px 0 20px;
    width: 384px;
    :deep(.van-popover__wrapper) {
        width: 100%;
    }
    .register-btns {
        display: flex;
        align-items: center;
        margin-bottom: rem(20px);
        width: 100%;
    }
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 50px;
        font-size: 16px;
        margin-left: 12px;
        color: #FFF;
        background: var(--primary);
        border-radius: 12px;
        border: 1px solid var(--primary);
        cursor: pointer;
        @include hover();
    }
    .btn {
        border-radius: 4px;
        width: 100%;
        margin-left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-register {
            width: 20px;
            height: 20px;
            background-size: cover;
            margin-right: 10px;
            background-image: url('/images/icon-register.png');
        }
        .btn-text {
            display: flex;
            align-items: baseline;
            b {
                font-size: 24px;
                &.split {
                    margin: 0 3px;
                }
            }
        }
    }
    .detail-btn {
        border-color: var(--primary);
        background: transparent;
        color: var(--primary);
        margin-left: 32px;
    }
    .third-login {
        margin-top: 20px;
        .title {
            margin-bottom: 10px;
            color: var(--normalColor);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                padding: 0 8px;
            }
            &::after {
                background: var(--lineColor);
                content: '';
                flex: 1;
                height: 1px;
            }
            &::before {
                background: var(--lineColor);
                content: '';
                flex: 1;
                height: 1px;
            }
        }
        .option {
            display: flex;
            align-items: center;
            margin: 16px 0;
            .gray {
                width: 100%;
                margin-left: 0;
                border-radius: 4px;
                background: #EAECEF;
                border-color: transparent;
                color: var(--color);
                display: flex;
                align-items: center;
                justify-content: center;
                .icon-google,
                .icon-telegram {
                    width: 16px;
                    height: 16px;
                    background-size: 100%;
                    margin-right: 10px;
                    background-image: url('/images/google.png');
                }
                .icon-telegram {
                    background-image: url('/images/telegram.png');
                }
            }
            :deep(.login-google) {
                flex: 1;
                height: 50px;
            }
            :deep(.login-telegram) {
                flex: 1;
                height: 50px;
                &:last-child {
                    margin-left: 24px;
                }
            }
        }
    }
}
body.night {
    .register-box {
        .third-login {
            .option {
                .gray {
                    background: rgb(43, 49, 57);
                }
            }
        }
    }
}

</style>
