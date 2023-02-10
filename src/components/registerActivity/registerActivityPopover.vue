<template>
    <van-popover
        v-if='countdownAvailable'
        :actions="[
            { text: '+ ' + activityInfo.rewardAmount + activityInfo.rewardCurrency },
        ]"
        class='register-activity-popover'
        placement='top'
        :show='isMobile'
    >
        <template #reference>
            <slot></slot>
        </template>
    </van-popover>
    <registerActivityCountdown v-if='countdownAvailable' show-rule-text />
</template>

<script setup>
import { registerActivityCountdown, useRegisterActivity } from '@/components/registerActivity'
const isMobile = process.env.VUE_APP_theme === 'plans'
const { countdownAvailable, activityInfo } = useRegisterActivity()

</script>

<style lang="scss">
body .register-activity-popover[data-popper-placement^=top] {
    --van-popover-light-background-color: var(--primary);
    --van-popover-light-text-color: #FFF;
    .van-popover__arrow {
        bottom: 1px;
    }
}
</style>
