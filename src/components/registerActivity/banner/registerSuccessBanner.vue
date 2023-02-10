<template>
    <!-- 注册成功页面活动提示 -->
    <template v-if='loading'>
        <van-loading :color='$style.primary' show type='spinner' />
    </template>
    <template v-else>
        <div
            v-if='countdownAvailable'
            class='register-activity'
        >
            <van-button
                size='large'
                type='primary'
                @click='toDeposit'
            >
                {{ $t('registerActivity.depositToTrade') }}<br />
                <div class='activity-deposit-to-get'>
                    {{
                        $t("registerActivity.depositToGet", {
                            rechargeAmount: activityInfo.rechargeAmount,
                            rewardAmount: activityInfo.rewardAmount,
                        })
                    }}
                </div>
            </van-button>
            <div class='tips'>
                <div class='line'></div>
                <div class='text'>
                    {{ registerBannerText }}
                </div>
                <div class='line'></div>
            </div>
            <registerActivityCountdown dense />
        </div>
        <div v-else class='success-handle'>
            <button
                class='btn state-2'
                @click='toQuote'
            >
                {{ $t('register.tradingOpportunity') }}
            </button>
            <button
                class='btn state-1'
                @click='props.toDeposit'
            >
                {{ $t('deposit.immediateRecharge') }}
            </button>
        </div>
    </template>
</template>

<script setup>
import registerActivityCountdown from '../registerActivityCountdown'
import useRegisterActivity from '../useRegisterActivity'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

const { countdownAvailable, registerBannerText, activityInfo } = useRegisterActivity(true)
const store = useStore()
const loading = computed(() => store.state._activity.getActFinishStatusLoading || store.state._activity.getEnableActLoading)

const router = useRouter()
const props = defineProps({
    toDeposit: Function,
})
// 跳转到行情页面
const toQuote = () => {
    return router.replace({ name: 'Quote' })
}

</script>

<style lang="scss" scoped>
.register-activity {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    button {
         width: rem(600px);
    }
    :deep(.clock-icon) {
        margin-bottom: 4px;
    }
    .tips {
        width: 100%;
        display: flex;
        margin-top: 16px;
        margin-bottom: 16px;
        align-items: center;
        justify-content: center;
        .line {
            margin: 0;
            min-width: 0;
            height: 1px;
            flex: 1;
            background: var(--lineColor);
        }
        .text {
            color: var(--minorColor);
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            margin-left: 8px;
            margin-right: 8px;
        }
    }
    .van-button {
        border-radius: rem(10px);
    }
}
.success-handle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: rem(20px);
    .btn {
        @include hover();
        display: flex;
        justify-content: center;
        align-items: center;
        width: rem(600px);
        padding: rem(30px) 0;
        margin: 0 rem(30px) rem(50px);
        border-radius: rem(10px);
        cursor: pointer;
        &.state-1 {
            background: var(--primary);
            color: #FFF;
        }
        &.state-2 {
            color: var(--primary);
            background-color: #F3F8FE;
        }
    }
}
.activity-deposit-to-get {
    margin-top: 4px;
    font-size: 12px;
}
</style>
