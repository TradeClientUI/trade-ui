<template>
    <!-- pc端行情、交易页面活动提示 -->
    <div
        v-if='show'
        class='el-notification right'
        role='alert'
    >
        <div class='el-notification__group'>
            <registerActivityCountdown dense />
            <div class='buttons'>
                <van-button
                    type='primary'
                    @click='toDeposit'
                >
                    {{ $t('registerActivity.get') }}&nbsp;${{ activityInfo.rewardAmount }}
                </van-button>
                <van-icon name='cross' @click='close' />
            </div>
        </div>
        <el-collapse>
            <el-collapse-item name='4' :title="$t('registerActivity.activityRules')">
                <registerActivityRule />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { closeNotification, openNotification, useRegisterActivity, registerActivityRule, registerActivityCountdown } from '@/components/registerActivity'
import useMethods from '@planspc/hooks/useMethods'

const { toDeposit } = useMethods()
const store = useStore()
const { countdownAvailable, activityInfo } = useRegisterActivity(true)
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

<style lang="scss" scoped>
.el-notification {
    width: 400px;
    top: 70px;
    z-index: 1000;
    padding-right: 14px;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    .el-notification__group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
    }
    :deep(.el-collapse-item__header) {
        border-bottom: none;
        .el-collapse-item__arrow {
            margin: 0 0 0 4px;
        }
    }
    .buttons {
        display: flex;
        align-items: center;
        margin-left: 20px;
        min-width: 120px;
    }
    .van-icon-cross {
        font-size: 18px;
        font-weight: 500;
        margin-left: 14px;
        margin-bottom: 4px;
        cursor: pointer;
    }
    .el-collapse {
        margin-top: 8px;
    }
    :deep(.el-collapse-item) {
        .el-collapse-item__wrap {
            height: 60vh;
            overflow-y: scroll;
        }
    }
    :deep(.count-down-box) {
        .clock-icon {
            height: 20px;
        }
        .count-down {
            font-size: 24px;
        }
    }
}

</style>
