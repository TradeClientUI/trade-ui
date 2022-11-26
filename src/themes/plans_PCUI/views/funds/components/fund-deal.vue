<template>
    <div class='fund-deal'>
        <!-- 选项卡 -->
        <div class='deal-tabs'>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'apply' }]" @click="switchTab('apply')">
                    <img src='../../../images/deal-icon1.png' />
                    <span>{{ $t('fundInfo.buy') }}</span>
                </div>
                <div :class="['item', { 'active': activeName === 'redeem' }]" @click="switchTab('redeem')">
                    <img src='../../../images/deal-icon2.png' />
                    <span>{{ $t('fundInfo.sell') }}</span>
                </div>
            </div>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'trade' }]" @click="switchTab('trade')">
                    <img src='../../../images/deal-icon3.png' />
                    <span>{{ $t('funds.cashDeal') }}</span>
                </div>
            </div>
        </div>
        <div class='deal-case'>
            <fundApply
                v-if="activeName === 'apply'"
                :fund='fund'
                @switchDirection='switchDirection'
            />
            <fundRedeem
                v-if="activeName === 'redeem'"
                :fund='fund'
                @switchDirection='switchDirection'
            />
            <spot-trade v-if="activeName === 'trade'" />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue'
import fundApply from './fund-apply.vue'
import fundRedeem from './fund-redeem.vue'
import spotTrade from './spot-trade.vue'

defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
const dealAcitve = inject('dealAcitve')
// 更新基金净值
const updateSharesNet = inject('updateSharesNet')

// 当前选择选项卡 apply:申购 redeem:赎回 trade:现货买卖
const activeName = ref(dealAcitve.value || 'apply')

// 切换选项卡
const switchTab = value => {
    if (activeName.value !== value) {
        activeName.value = value
        updateSharesNet('')
    }
}

// 接收事件
const switchDirection = value => {
    switchTab(value)
}
</script>

<style lang='scss' scoped>
.deal-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        margin-right: 16px;
        color: var(--mainColor);
        line-height: 1;
        background: var(--contentColor);
        border-radius: 15px;
        box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &.active {
            border: 1px solid var(--primary);
        }
        &:hover {
            border: 1px solid var(--primary);
            transform: scale(1.05);
        }
        img {
            width: 42px;
            height: 42px;
        }
        span {
            font-weight: 400;
            font-size: 14px;
        }
    }
    .group {
        .item:last-of-type {
            margin-right: 0;
        }
    }
}
.deal-case {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 400px;
    padding: 32px;
    background-color: var(--contentColor);
    border-radius: 12px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
}
</style>
