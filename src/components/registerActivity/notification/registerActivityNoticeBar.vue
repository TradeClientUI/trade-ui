<template>
    <!-- 移动的端行情、交易页面活动提示 -->
    <div v-if='show' class='register-activity-notice-bar'>
        <registerActivityCountdown dense />
        <div class='notice-bar-action'>
            <van-button size='small' type='primary' @click='toDeposit'>
                {{ $t('registerActivity.get') }}&nbsp;${{ activityInfo.rewardAmount }}
            </van-button>
            <van-icon name='cross' @click='close' />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMethods from '@plans/hooks/useMethods'
import { useRegisterActivity, openNotification, closeNotification, registerActivityCountdown } from '@/components/registerActivity'

const { countdownAvailable, activityInfo } = useRegisterActivity(true)
const store = useStore()
const { toDeposit } = useMethods()

const customerNo = store.state._user.customerInfo.customerNo
const show = ref(customerNo && openNotification(customerNo) && countdownAvailable.value)

const close = () => {
    closeNotification(store.state._user.customerInfo.customerNo)
    show.value = false
}

watch(() => countdownAvailable.value, (value) => {
    // 判断用户是否主动关闭弹窗和是否在活动时间内
    show.value = customerNo && openNotification(customerNo) && value
})

</script>

<style scoped lang="scss">
@import '@/sass/mixin.scss';
.register-activity-notice-bar {
    background: #181A20;
    color: #FFF;
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 10;
    display: flex;
    padding: rem(20px);
    justify-content: space-between;
    align-items: center;
    .notice-bar-action {
        display: flex;
        align-items: center;
        margin-left: rem(20px);
        .van-icon-cross {
            font-size: rem(30px);
            margin-left: rem(20px);
        }
    }
    :deep(.van-button) {
        width: rem(200px);
    }
    :deep(.count-down-box) {
        width: 60vw;
        align-items: center;
        .clock-icon {
            height: rem(40px);
        }
        .count-down {
            font-size: rem(50px);
        }
        .clock-icon path {
            fill: #FFF;
        }
        .van-count-down {
            color: #FFF;
        }
    }
}
</style>
