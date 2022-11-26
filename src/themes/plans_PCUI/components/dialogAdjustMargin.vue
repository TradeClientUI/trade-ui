<template>
    <van-popup
        v-model:show='showDialog'
        class='m-dialogAdjust'
        position='bottom'
        teleport='body'
        :transition-appear='true'
        @closed='closed'
    >
        <div class='dialog-header'>
            <div class='title'>
                <p class='productName'>
                    {{ data.symbolName }}
                </p>
                <p class='lot'>
                    {{ data.symbolCode }}
                </p>
            </div>
            <div class='right' @click='closeHandler'>
                <i class='icon_icon_close_big'></i>
            </div>
        </div>

        <div class='dialog-body'>
            <p class='title'>
                {{ $t('trade.modifyMargin') }}
            </p>
            <div class='input-wrap'>
                <span class='fl' @click='operation'>
                    <!-- <img alt='' src='../images/transfer.png' srcset='' /> -->
                    <i class='icon icon_qiehuan1'></i>
                    <span class='oper-text'>
                        {{ operText }}
                    </span>
                </span>
                <span class='line'></span>
                <input v-model='amount' class='input' :placeholder="$t('trade.modifyAmount')" type='number' />
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='desc'>
                <span v-if='operType'>
                    {{ $t('trade.maxRaise') }}: {{ accountInfo?.available }} {{ accountInfo?.currency }}
                </span>
                <span v-else>
                    {{ $t('trade.maxReduce') }}: {{ positionData?.canReduceMargin }} {{ accountInfo?.currency }}
                </span>
            </p>
        </div>
        <div class='dialog-footer'>
            <van-button
                block
                class='pcHandler'
                :loading='loading'
                @click='submitAdjustMargin'
            >
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, computed, watchEffect, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { updateOccupyTheMargin } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { pow } from '@/utils/calculation'
export default {

    props: ['show', 'data'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            showDialog: false,
            loading: false,
            amount: '',
            operType: true,
            operText: t('trade.raise')
        })

        const tradeType = computed(() => store.state._quote.curTradeType)

        // 获取账户
        const accountInfo = computed(() =>
            store.state._user.customerInfo.accountList.find(item => Number(item.tradeType) === Number(tradeType.value)))

        const positionData = computed(() => {
            return store.state._trade.positionList[tradeType.value]?.find(item => item.positionId === props.data.positionId)
        })

        watch(
            () => props.show,
            (val) => {
                state.showDialog = props.show
                if (val) {
                    store.dispatch('_user/findCustomerInfo', false)
                }
            })

        const closeHandler = () => {
            state.showDialog = false
        }

        const operation = () => {
            state.operType = !state.operType

            if (state.operType) {
                store.dispatch('_user/findCustomerInfo', false)
            } else {
                store.dispatch('_trade/queryPositionPage', {
                    tradeType: tradeType.value,
                    hideLoading: true,
                    accountId: accountInfo.value.accountId
                })
            }
            state.operText = state.operType ? t('trade.raise') : t('trade.reduce')
        }

        const handleAll = () => {
            if (state.operType) {
                state.amount = accountInfo.value.available
            } else {
                state.amount = props.data.canReduceMargin
            }
        }

        // 调整保证金
        const submitAdjustMargin = () => {
            if (isEmpty(state.amount) || parseFloat(state.amount) === 0) {
                return Toast(t('trade.enterMarginAmountRequire'))
            }

            if (parseFloat(state.amount) < 0) {
                return Toast(t('trade.enterMarginAmountTip'))
            }

            state.loading = true
            // 处理金额*10 小数位次方
            const margin = state.operType ? parseFloat(state.amount) : -parseFloat(state.amount)
            const occupyTheMargin = margin * pow(10, props.data.openAccountDigits)

            const params = {
                tradeType: tradeType.value,
                accountId: accountInfo.value.accountId,
                positionId: props.data.positionId,
                accountDigits: props.data.openAccountDigits,
                occupyTheMargin,
                orderId: props.data.orderId,
                remark: '',
                resp: ''
            }

            updateOccupyTheMargin(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast(t('common.submitSuccess'))
                    state.operType = true
                    state.operText = t('trade.raise')
                    state.amount = ''
                    state.showDialog = false
                    store.dispatch('_trade/queryPositionPage', {
                        tradeType: tradeType.value,
                        accountId: accountInfo.value.accountId,
                        sortFieldName: 'openTime',
                        sortType: 'desc',
                    })
                }
            }).catch(res => {
                state.loading = false
                Toast(res.msg)
            })
        }
        const closed = () => { // 关闭弹出层且动画结束后触发
            context.emit('update:show', false)
        }

        return {
            ...toRefs(state),
            submitAdjustMargin,
            closeHandler,
            closed,
            operation,
            accountInfo,
            tradeType,
            positionData,
            handleAll
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.dialog-header {
    padding: rem(30px) 0;
    text-align: center;
    .productName {
        color: var(--color);
    }
    .title {
        font-size: rem(32px);
    }
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        padding: rem(25px);
        color: var(--normalColor);
        font-size: rem(38px);
    }
}
.dialog-footer {
    width: 100%;
    .pcHandler {
        color: #FFF;
        background: var(--primary);
        border: none;
        border-radius: 0;
    }
}
.m-dialogAdjust {
    z-index: 1000;
    height: rem(500px);
    overflow: visible;
    .dialog-body {
        flex: 1;
        padding: 0 rem(30px);
        .title {
            margin: 0 0 rem(30px) 0;
            color: var(--normalColor);
            font-size: rem(28px);
        }
        .input-wrap {
            display: flex;
            align-items: center;
            padding: 0 rem(30px);
            //line-height: rem(80px);
            background-color: var(--primaryAssistColor);
            border-radius: rem(6px);
            .fl {
                margin: rem(20px) rem(20px) rem(20px) rem(10px);
                padding-right: rem(20px);
                border-right: solid 1px var(--lineColor);
                .icon {
                    width: rem(24px);
                    margin-right: rem(10px);
                    vertical-align: middle;
                }
                .oper-text {
                    color: var(--color);
                    vertical-align: middle;
                }
                .line {
                    // width: rem(1px);
                    // height: 1;
                }
            }
            .input {
                flex: 1;
            }
            .all {
                color: var(--primary);
            }
        }
        .desc {
            margin-top: rem(20px);
            color: var(--minorColor);
        }
    }
}
</style>

<style lang='scss'>
@import '~@/sass/mixin.scss';
.m-dialogAdjust {
    z-index: 1000;
    display: flex;
    flex-flow: column;
    height: rem(480px);
    overflow: visible;
    background-color: var(--contentColor);
}
</style>
