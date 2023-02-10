<template>
    <!-- pc端充值活动页面提示，只有全仓玩法有充值活动 -->
    <div v-if='countdownAvailable' class='register-activity'>
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
    box-sizing: border-box;
    padding: 12px 16px;
    width: 100%;
    display: flex;
    color: var(--color);
    align-items: center;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--lineColor);
    border-radius: rem(16px);
    font-size: 14px;
    margin-bottom: 10px;
    background: var(--primary);
    color: #FFF;
    .gift {
        margin-right: 5px;
        color: var(--primary);
        fill: var(--primary);
    }
    span {
        margin-left: 10px;
    }
    :deep(.count-down-box) {
        align-items: flex-start;
        .clock-icon {
            height: 18px;
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
