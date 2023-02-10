<template>
    <!-- 手机端充值页面活动提示 -->
    <div
        v-if='countdownAvailable'
        class='register-activity'
    >
        <registerActivityCountdown dense />
        <span>
            {{
                $t("registerActivity.depositToGet", {
                    rechargeAmount: activityInfo.rechargeAmount,
                    rewardAmount: activityInfo.rewardAmount,
                })
            }}
        </span>
    </div>
</template>

<script setup >
import { useRegisterActivity, registerActivityCountdown } from '@/components/registerActivity'
const { countdownAvailable, activityInfo } = useRegisterActivity(true)
</script>

<style lang="scss" scoped>
.register-activity {
    z-index: 1000;
    box-sizing: border-box;
    margin: 0 auto;
    padding: rem(20px) rem(20px);
    width: 100%;
    display: flex;
    line-height: 20px;
    color: #FFF;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    font-size: 14px;
    span {
        margin-left: 5px;
    }
    .register-activity-title {
        display: flex;
        align-items: center;
    }
    :deep(.count-down-box) {
        align-items: center;
        .clock-icon {
            height:  20px;
        }
        .clock-icon path {
            fill: #FFF;
        }
        .van-count-down {
            color: #FFF;
        }
        .count-down {
            font-size: 20px;
            color: #FFF;
        }
    }
}
</style>
