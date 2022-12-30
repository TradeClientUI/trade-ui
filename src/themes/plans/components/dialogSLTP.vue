<template>
    <van-popup
        v-model:show='showDialog'
        class='m-dialog m-dialogZyzs custom-popup'
        :duration='0.2'
        get-container='body'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
        @open='open'
    >
        <div v-if='!!warn' class='floatTip'>
            {{ warn }}
        </div>
        <div class='header'>
            <div class='header-title'>
                {{ data?.symbolName }}
            </div>
            <i class='icon_guanbi' @click='$emit("update:show",false)'></i>
        </div>
        <!-- <div class='dialog-header'>
            <div class='title'>
                <p class='productName'>
                    {{ data?.symbolName }}
                </p><p class='lot'>
                    {{ product?.symbolCode }}
                </p>
            </div>
            <div class='right' @click='closeHandler'>
                <i class='icon_guanbi'></i>
            </div>
        </div> -->
        <div class='popup-wrap'>
        </div>
        <div class='dialog-body'>
            <div class='inputNumber'>
                <div class='item-block'>
                    <div class='name'>
                        {{ $t('trade.positionPrice') }}
                    </div>
                    <div class='open-price'>
                        {{ data.openPrice }}
                    </div>
                </div>

                <div class='item-block'>
                    <div class='name'>
                        {{ $t('trade.currentPrice') }}
                    </div>
                    <div :class='[parseFloat(data.direction)===1 ? product.sell_color:product.buy_color]'>
                        {{ parseFloat(data.direction)===1 ? product.sell_price:product.buy_price }}
                    </div>
                </div>

                <div v-if='Number(product.tradeType) === 2' class='item-block'>
                    <div class='name'>
                        {{ $t('trade.previewStopPrice') }}
                    </div>
                    <div>
                        {{ data.previewStopPrice || '--' }}
                    </div>
                </div>
            </div>
        </div>

        <ModifyProfitLoss
            ref='modifyProfitLossRef'
            v-model:stopLoss='stopLossPrice'
            v-model:stopProfit='stopProfitPrice'
            class='modifyProfitLoss'
            :direction='data.direction'
            :order-data='data'
            :product='product'
        />

        <div class='dialog-footer'>
            <van-button :loading='loading' @click='submitHandler'>
                {{ $t('save') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, watchEffect, computed, ref } from 'vue'
import ModifyProfitLoss from '@plans/components/modifyProfitLoss'
import { updateOrder, updatePboOrder } from '@/api/trade'
import { equalTo, mul, pow, minus } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import Base from '@/store/modules/base'
import { useStore } from 'vuex'
export default {
    components: {
        ModifyProfitLoss,
    },
    props: ['show', 'product', 'data'],
    emits: ['update:show'],
    setup (props, context) {
        const modifyProfitLossRef = ref(null)
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            showDialog: false,
            stopLossPrice: '',
            stopProfitPrice: '',
        })

        // 获取账户
        const account = computed(() => store.state._user.customerInfo.accountList.find(item => Number(item.tradeType) === Number(props.data.tradeType)))
        // 客户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 提示信息
        const warn = computed(() => modifyProfitLossRef.value?.stopLossWarn || modifyProfitLossRef.value?.stopProfitWarn)

        const positionVolume = computed(() => minus(props.data?.openVolume, props.data?.closeVolume))

        watchEffect(() => {
            state.showDialog = props.show
            if (props.data?.positionId) store.commit('_trade/Update_modifyPositionId', props.data.positionId + '_' + props.data.tradeType)
        })
        watchEffect(() => {
            if (props.data?.stopLoss > 0) state.stopLossPrice = props.data.stopLossDecimal
            if (props.data?.takeProfit > 0) state.stopProfitPrice = props.data.takeProfitDecimal
        })
        const closed = () => { // 关闭弹出层且动画结束后触发
            state.stopLossPrice = ''
            state.stopProfitPrice = ''
            context.emit('update:show', false)
        }
        const closeHandler = () => {
            state.showDialog = false
        }
        const open = () => {
            if (props.data?.stopLoss > 0) state.stopLossPrice = props.data.stopLossDecimal
            if (props.data?.takeProfit > 0) state.stopProfitPrice = props.data.takeProfitDecimal
        }
        // 获取修改止盈止损参数
        const submitParams = () => {
            const data = props.data
            if (equalTo(data.takeProfit, state.stopLossPrice) && equalTo(data.stopLoss, state.stopProfitPrice)) {
                Toast(t('trade.unModify'))
                return false
            }
            const p = pow(10, props.product.price_digits)

            const params = {
                orderId: data.orderId,
                positionId: data.positionId,
                stopLoss: !state.stopLossPrice ? 0 : mul(state.stopLossPrice, p),
                takeProfit: !state.stopProfitPrice ? 0 : mul(state.stopProfitPrice, p),
                tradeType: props.data.tradeType,
                accountId: account.value.accountId,
                accountDigits: account.value.digits
            }
            return params
        }
        // 提交修改止盈止损
        const submitHandler = () => {
            const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(props.data.tradeType))?.accountId
            const params = submitParams()
            if (!params) return false
            state.loading = true
            updateOrder(params).then(res => {
                state.loading = false

                if (res.check()) {
                    store.dispatch('_trade/queryPositionPage', {
                        tradeType: props.data.tradeType,
                        accountId,
                        sortFieldName: 'openTime',
                        sortType: 'desc',
                        hideLoading: true
                    })
                    Toast(t('trade.modifySuccess'))
                    closed()
                }
            }).catch((err) => {
                state.loading = false
                console.log(err)
            })
        }

        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', {
            symbolId: props.data.symbolId, tradeType: props.data.tradeType
        })

        return {
            ...toRefs(state),
            modifyProfitLossRef,
            positionVolume,
            warn,
            closed,
            open,
            closeHandler,
            submitHandler
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.floatTip {
    position: absolute;
    top: rem(24px);
    left: 0;
    width: 100%;
    min-height: rem(50px);
    color: var(--warn);
    line-height: rem(50px);
    text-align: center;
    background: #FFF0E2;
    transform: translateY(-100%);
}
.dialog-header {
    padding: rem(30px) 0;
    text-align: center;
    .title {
        font-size: rem(32px);
        .productName {
            color: var(--color);
        }
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
        padding: rem(35px) rem(25px) rem(25px) rem(25px);
        color: var(--normalColor);
        font-size: rem(28px);
    }
}
.modifyProfitLoss {
    margin: 0 0 rem(30px) 0;
}
.m-dialogZyzs {
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .dialog-body {
        //height: rem(300px);
        flex: none;
        overflow-y: visible;
        :deep(.layout-1) {
            padding-bottom: rem(30px);
        }
        .mtop {
            padding: 0 rem(40px);
        }
        .inputNumber {
            position: relative;
            display: flex;
            line-height: 1.45;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 rem(20px) 0;
            font-size: rem(28px);
            .item-block {
                &:last-child {
                    text-align: right;
                }
            }
            .name {
                color: var(--minorColor);
                font-size: rem(24px);
            }
            .open-price {
                color: var(--color);
            }
            .left,
            .right {
                font-size: rem(20px);
            }
            .left {
                width: rem(300px);
            }
            .right {
                display: flex;
                flex: 1;
                justify-content: space-between;
                .line {
                    position: relative;
                    flex: 1;
                    .lineInfo {
                        margin: 0 rem(40px);
                        padding-top: rem(20px);
                        padding-bottom: rem(10px);
                        text-align: center;
                        border-color: #999;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.m-dialogZyzs {
    overflow: visible;
    background-color: var(--contentColor);
}
</style>
