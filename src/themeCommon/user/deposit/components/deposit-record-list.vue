<template>
    <div class='record-list'>
        <van-collapse
            v-for='(item, index) in list'
            :key='index'
            v-model='activeIndex'
            accordion
            :border='false'
            @change='handleFold(index)'
        >
            <van-collapse-item :name='index+1'>
                <template #title>
                    <p class='amount'>
                        {{ item.intendAmount }} {{ item.depositCurrency }}
                    </p>
                    <p class='time'>
                        {{ formatTime(item.createTime) }}
                    </p>
                </template>
                <template #right-icon>
                    <div>
                        <span class='state'>
                            {{ handleDepositState(item) }}
                        </span>
                        <van-icon :name='activeIndex === index + 1 ? "arrow-up" : "arrow-down"' />
                    </div>
                </template>
                <div class='block'>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.rechargeCurrency') }}
                        </span>
                        <span class='right-val'>
                            {{ item.depositCurrency }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.amount') }}({{ $t('deposit.includeFee') }})
                        </span>
                        <span class='right-val'>
                            {{ item.intendAmount }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.receiptAmount') }}
                        </span>
                        <span class='right-val'>
                            {{ item.finalAmount }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('common.fee') }}
                        </span>
                        <span v-if='item.depositFee' class='right-val'>
                            {{ item.depositFee }}
                        </span>
                        <span v-else class='right-val'>
                            --
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.payCurrency') }}
                        </span>
                        <span class='right-val'>
                            {{ item.paymentCurrency }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.payAmount') }}
                        </span>
                        <span class='right-val'>
                            {{ item.fromPaymentAmount || '--' }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('common.createTime') }}
                        </span>
                        <span class='right-val'>
                            {{ formatTime(item.createTime) }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('common.updateTime') }}
                        </span>
                        <span class='right-val'>
                            {{ formatTime(item.updateTime) }}
                        </span>
                    </div>
                    <div class='w-item'>
                        <p class='left-label'>
                            <span>TXID</span>
                            <van-icon class='info' name='info' @click="showExplain($t('deposit.txid'))" />
                        </p>
                        <span class='right-val w250'>
                            <span class='val'>
                                {{ item.txid || '--' }}
                            </span>
                            <span v-if='item.txid' class='copy-btn' :data-clipboard-text='item.txid' @click='copyTXID'>
                                <img alt='' src='@/assets/copy.png' srcset='' />
                            </span>
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            {{ $t('deposit.orderNo') }}
                        </span>
                        <span class='right-val'>
                            {{ item.proposalNo }}
                        </span>
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { handleDepositState } from '@/hooks/deposit'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import Clipboard from 'clipboard'
const { t } = useI18n({ useScope: 'global' })

defineProps({
    // 列表数据
    list: {
        type: Array,
        default: () => []
    },
    // 类型 1. 直充 2.汇兑
    type: {
        type: String,
        default: ''
    }
})

// 当前展开
const activeIndex = ref(0)

// 点击展开数据
const handleFold = (val) => {
    activeIndex.value = val
}

// 复制txid
const copyTXID = () => {
    const clipboard = new Clipboard('.copy-btn')
    clipboard.on('success', e => {
        Toast(t('common.copySuccess'))
        // 释放内存
        clipboard.destroy()
    })
}

// 说明弹窗
const showExplain = (message) => {
    Dialog.alert({
        message
    })
}

</script>

<style lang="scss" scoped>
.record-list {
    .van-collapse-item {
        // border-bottom: solid rem(20px) var(--bgColor);
        border-bottom: 1px solid var(--lineColor);
    }
    .amount {
        color: var(--color);
        font-weight: bold;
        font-size: rem(28px);
    }
    .time {
        color: var(--minorColor);
        font-size: rem(20px);
    }
    .state {
        margin-right: rem(5px);
        color: var(--primary);
    }
}
.block {
    .w-item {
        display: flex;
        line-height: rem(60px);
        span {
            flex: 1;
            font-size: rem(24px);
        }
        .right-val {
            display: flex;
            justify-content: flex-end;
            color: var(--color);
            font-weight: bold;
            text-align: right;
            &.w250 {
                width: rem(600px);
            }
            &.state {
                color: var(--primary);
            }
            .val {
                display: inline-block;
                width: rem(300px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: middle;
            }
            .copy-btn {
                display: inline-block;
                margin-left: rem(5px);
                flex: none;
                img {
                    width: rem(40px);
                    vertical-align: middle;
                }
            }
        }
        .left-label {
            color: var(--minorColor);
            .info {
                margin-left: rem(6px);
            }
        }
    }
}
</style>
