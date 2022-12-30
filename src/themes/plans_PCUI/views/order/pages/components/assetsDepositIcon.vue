<template>
    <van-popover
        v-model:show='showPopover'
        :actions='actionsheetActions'
        class='depositPopoverIcon'
        :theme='theme'
        trigger='manual'
    >
        <div class='depositPopoverWrapper'>
            <div class='cell' @click="openHandlerType('deposit')">
                <span class='icon icon_icon_assets'></span>
                <div class='content'>
                    <p>{{ $t('common.deposit') }}</p>
                    <p>{{ $t('common.depositWayTip') }}</p>
                </div>
                <span class='arrowRight'>
                    <svg height='28' viewBox='0 0 12 12' width='28' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                        <g fill='none'>
                            <path d='M6 1a5 5 0 1 1 0 10A5 5 0 0 1 6 1zm.098 2.646a.5.5 0 0 0 0 .708L7.244 5.5H3.5a.5.5 0 0 0 0 1h3.744L6.098 7.646a.5.5 0 1 0 .707.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.707 0z' fill='currentColor' />
                        </g>
                    </svg>
                </span>
            </div>
            <div v-if='$store.state._base.plans.length>1' class='cell' @click="openHandlerType('transfer')">
                <span class='icon'>
                    <img class='iconTrade' src='/images/trade.png' />
                </span>
                <div class='content'>
                    <p>{{ $t('cRoute.transfer') }}</p>
                    <p>{{ $t('common.transferWayTip') }}</p>
                </div>
                <span class='arrowRight'>
                    <svg height='28' viewBox='0 0 12 12' width='28' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                        <g fill='none'>
                            <path d='M6 1a5 5 0 1 1 0 10A5 5 0 0 1 6 1zm.098 2.646a.5.5 0 0 0 0 .708L7.244 5.5H3.5a.5.5 0 0 0 0 1h3.744L6.098 7.646a.5.5 0 1 0 .707.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.707 0z' fill='currentColor' />
                        </g>
                    </svg>
                </span>
            </div>
        </div>
        <template #reference>
            <van-icon class='addIcon pc_trade_deposit_add_ga' name='add' size='17' @click='addIconHandler' />
        </template>
    </van-popover>
</template>

<script setup>
import { localGet } from '@/utils/util'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    product: {
        type: Object,
        default: () => ({})
    },
    account: {
        type: Object,
        default: () => ({})
    },
})

const theme = localGet('invertColor') === 'night' ? 'dark' : 'light'

const showPopover = ref(false)
const actionsheetActions = computed(() => {
    let actions = [
        { text: t('cRoute.transfer'), val: 'transfer' },
    ]
    if (props.product.tradeType === 5) {
        actions = [
            { text: t('common.deposit'), val: 'deposit' },
            { text: t('cRoute.transfer'), val: 'transfer' },
        ]
    }
    return actions
})
const openHandlerType = (type) => {
    showPopover.value = false
    let routePrams = null
    const { tradeType } = props.product
    const { accountId, currency } = props.account
    switch (type) {
        case 'deposit':
            routePrams = `/depositChoose?tradeType=${tradeType}&accountId=${accountId}&currency=${currency}&back=historyBack`
            break
        case 'transfer':
            routePrams = `/order/transfer?tradeType=${tradeType}&accountId=${accountId}&currency=${currency}`
            break
    }
    routePrams && router.push(routePrams)
}

// 点击充值+号按钮
const addIconHandler = () => {
    if (store.state._base.plans.length === 1) {
        openHandlerType('deposit')
    } else {
        showPopover.value = true
    }
}
</script>

<style lang="scss" scoped>
.addIcon {
    cursor: pointer;
    margin-left: 3px;
    vertical-align: -1px;
    color: var(--primary);
    &:hover {
        opacity: 0.7;
    }
}
.depositPopoverWrapper {
    padding: 10px;
    .cell {
        display: flex;
        align-items: center;
        cursor: pointer;
        background: var(--assistColor);
        padding: 10px;
        border-radius: 6px;
        &:first-of-type {
            margin-bottom: 10px;
        }
        &:hover {
            background: var(--primaryBg);
            .arrowRight {
                opacity: 1;
            }
        }
    }
    .content {
        padding: 0 10px;
    }
    .icon_icon_assets {
        font-size: 28px;
        color: var(--focusColor);
    }
    .iconTrade {
        display: block;
        width: 28px;
    }
    .arrowRight {
        opacity: 0.7;
        line-height: 1;
    }
}

</style>
