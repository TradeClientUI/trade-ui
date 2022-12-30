<template>
    <div class='orderAssets'>
        <!-- <van-row justify='space-between'>
            <van-col>{{ $t('trade.estimatedMargin') }}</van-col>
            <van-col>
                {{ lockFunds }}
                {{ direction==='buy'?product.profitCurrency:product.baseCurrency }}
            </van-col>
        </van-row> -->
        <van-row justify='space-between'>
            <van-col>{{ $t('trade.free') }}</van-col>
            <van-col v-if='Number(product.tradeType) === 1' class='balance'>
                <span class='val'>
                    {{ accountTradeType1?.availableMargin }}
                </span>
                <span v-if='isDemo'>
                    &nbsp;{{ account.currency }}
                </span>
                <span v-else @click='showActionSheet'>
                    &nbsp;{{ account.currency }}
                    <van-popover
                        v-model:show='showDepositPopover'
                        class='depositPopover'
                        :offset='[10,8]'
                        placement='bottom-end'
                        theme='dark'
                        trigger='manual'
                    >
                        <p class='depositPopoverText'>
                            {{ $t('common.depositPopoverText') }}
                        </p>
                        <template #reference>
                            <van-icon class='addIcon mobile_trade_deposit_add_ga' name='add' />
                        </template>
                    </van-popover>
                </span>
            </van-col>
            <van-col v-else-if='Number(product.tradeType) === 2' class='balance'>
                <span class='val'>
                    {{ accountTradeType2?.availableMargin }}
                </span>
                {{ account.currency }}
            </van-col>
            <van-col v-else>
                <span class='val'>
                    {{ account.available }}
                </span>
                <span>
                    {{ account.currency }}
                </span>
                {{ direction==='buy'?product.profitCurrency:product.baseCurrency }}
            </van-col>
        </van-row>

        <van-row v-if='[1,2].includes(product.tradeType)' justify='space-between'>
            <van-col>{{ $t('common.previewMargin') }}</van-col>
            <van-col class='balance'>
                <template v-if='previewMargin'>
                    <span class='val'>
                        {{ previewMargin }}
                    </span>&nbsp;
                    <span>
                        {{ account.currency }}
                    </span>
                </template>

                <span v-else class='muted'>
                    --
                </span>
            </van-col>
        </van-row>

        <van-row v-if='[1,2].includes(product.tradeType)' justify='space-between'>
            <van-col>{{ $t('common.previewFee') }}</van-col>
            <van-col class='balance'>
                <template v-if='previewFee'>
                    <span class='val'>
                        {{ previewFee }}&nbsp;
                    </span>
                    <span>
                        {{ account.currency }}
                    </span>
                </template>

                <span v-else class='muted'>
                    --
                </span>
            </van-col>
        </van-row>

        <div v-if='[3,9].includes(product.tradeType)' class='borrowMoney'>
            <van-row class='mtop10' justify='space-between'>
                <van-col v-if='product.tradeType===3'>
                    {{ $t('trade.availableLoanAmount') }}
                    <van-icon class='questionIcon' name='question-o' @click='loanTradeType3=true' />
                </van-col>
                <van-col v-else-if='product.tradeType===9'>
                    {{ $t('trade.availableLoanAgent') }}
                    <van-icon class='questionIcon' name='question-o' @click='loanTradeType9=true' />
                </van-col>
                <van-col>
                    <span class='val'>
                        {{ account.availableLoan }}
                    </span>

                    {{ account.currency }}
                </van-col>
            </van-row>
        </div>

        <!-- 杠杆玩法可借额度的解说 -->
        <van-dialog v-model:show='loanTradeType3' :confirm-button-text="$t('common.sure')" title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent7') }}</p>
                <p>{{ $t('trade.availableLoanContent8') }}</p>
            </div>
        </van-dialog>
        <!-- 代理可借的解说 -->
        <van-dialog v-model:show='loanTradeType9' :confirm-button-text="$t('common.sure')" title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent1', [maxBorrow]) }}</p>
                <p>{{ $t('trade.availableLoanContent2') }}</p>
            </div>
        </van-dialog>

        <!-- 去充值actionsheet -->
        <van-action-sheet
            v-model:show='actionsheetVisible'
            :actions='actionsheetActions'
            :cancel-text="$t('common.cancel')"
            @select='openHandlerType'
        />
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { MsgSocket } from '@/plugins/socket/socket'
import { mul, div, toFixed } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { localGet, localSet } from '@/utils/util'
export default {
    props: ['direction', 'product', 'volume', 'account', 'previewMargin', 'previewFee'],
    setup (props, { emit }) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const checked = ref(2)
        const loanTradeType9 = ref(false)
        const loanTradeType3 = ref(false)
        watch(
            () => props.operationType,
            newval => { checked.value = newval },
            { immediate: true }
        )

        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const isDemo = computed(() => store.state._user.customerInfo?.companyType === 'demo')

        // 全仓合约资产
        const accountTradeType1 = computed(() => {
            const accountAssets = store.state._user.accountAssets['1']
            const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === parseInt(props.product?.tradeType))
            return Object.assign({}, account, accountAssets)
        })

        // 逐仓合约资产
        const accountTradeType2 = computed(() => store.state._user.accountAssets['2'])

        // 最大可借额度
        const maxBorrow = computed(() => {
            const assetsCurrency = store.state._user.assetsInfo?.currency
            if (props.product.tradeType === 9) return props.product.totalCredit + assetsCurrency // abcc玩法显示总授信
            const accountMapKey = `${props.product.tradeType}_${props.account.currency}`
            const assetsId = accountMap?.value[accountMapKey]?.assetsId
            if (props.product.borrowLimitList) {
                const borrowLimit = props.product?.borrowLimitList.find(item => Number(item.assetsId) === Number(assetsId))?.value
                return borrowLimit || '--'
            }
            return '--'
        })

        // 预计占用
        const lockFunds = computed(() => {
            let amount = ''
            if (props.direction === 'buy') {
                amount = mul(props.volume, props.product.buy_price)
            } else {
                amount = props.volume
            }
            if (amount === '') amount = 0
            return toFixed(amount, props.account.digits)
        })

        watch(() => props.product?.tradeType, val => {
            MsgSocket.subscribedListAdd(function () {
                MsgSocket.subscribeAsset(val)
            })
        }, {
            immediate: true
        })

        const showDepositPopover = ref(false)
        const actionsheetVisible = ref(false)
        const actionsheetActions = computed(() => {
            let actions = [
                { name: t('cRoute.transfer'), val: 'transfer' },
            ]
            if (props.product.tradeType === 5) {
                actions = [
                    { name: t('common.deposit'), val: 'deposit' },
                    { name: t('cRoute.transfer'), val: 'transfer' },
                ]
            }
            return actions
        })

        // 跳转充值、划转
        const openHandlerType = (item) => {
            actionsheetVisible.value = false
            let routePrams = null
            switch (item.val) {
                case 'deposit':
                    routePrams = {
                        name: 'DepositChoose',
                        query: {
                            tradeType: props.product.tradeType,
                            currency: props.account.currency,
                            accountId: props.account.accountId,
                            back: 'historyBack'
                        }
                    }
                    break
                case 'transfer':
                    routePrams = {
                        name: 'Transfer',
                        query: {
                            tradeType: props.product.tradeType,
                            accountId: props.account.accountId,
                            currency: props.account.currency
                        }
                    }
                    break
            }
            routePrams && router.push(routePrams)
        }

        // 显示去充值的actionSheet弹窗
        const showActionSheet = () => {
            if (store.state._base.plans.length === 1) {
                openHandlerType({ val: 'deposit' })
            } else {
                actionsheetVisible.value = true
            }
        }

        onMounted(() => {
            showDepositPopover.value = Boolean(!localGet('showDepositPopover') || false)
            localSet('showDepositPopover', 'false')
        })

        onUnmounted(() => {
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            actionsheetVisible,
            actionsheetActions,
            showDepositPopover,
            openHandlerType,
            showActionSheet,
            loanTradeType3,
            loanTradeType9,
            isDemo,
            checked,
            maxBorrow,
            lockFunds,
            accountTradeType1,
            accountTradeType2
        }
    }
}
</script>

<style lang="scss">
.depositPopover .van-popover__arrow {
    right: 7px !important;
}
.depositPopoverText {
    padding: rem(10px) rem(15px);
    font-size: rem(24px);
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderAssets {
    margin-top: rem(20px);
    color: var(--minorColor);
    line-height: 1.5;
    .val {
        color: var(--color);
    }
    .addIcon {
        font-size: rem(32px);
        color: var(--primary);
        vertical-align: -2px;
    }
}
.borrowMoney {
    margin-top: rem(20px);
    color: var(--minorColor);
    font-size: rem(24px);
    :deep(.van-radio__icon .van-icon) {
        width: rem(30px);
        height: rem(30px);
        font-size: rem(26px);
        line-height: 0.9;
    }
    .questionIcon {
        font-size: rem(30px);
        vertical-align: -2px;
    }

    --van-radio-label-color: var(--minorColor);
}
.availableLoanContent {
    padding: rem(30px);
    font-size: rem(24px);
    p {
        margin-top: rem(10px);
    }
}
</style>
