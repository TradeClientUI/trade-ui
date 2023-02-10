<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title='data.symbolName'
            width='500px'
        >
            <div v-if='show' class='body-module'>
                <div class='row'>
                    <div class='col'>
                        <div class='name'>
                            {{ $t('trade.hold') }}
                        </div>
                        <div class='value'>
                            <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                            </span>
                            <span>{{ positionVolume }} {{ $t('trade.volumeUnit') }}</span>
                        </div>
                    </div>
                    <div class='col'>
                        <div class='name'>
                            {{ $t('trade.positionPrice') }}
                        </div>
                        <div class='value'>
                            {{ data.openPrice }}
                        </div>
                    </div>
                    <div class='col'>
                        <div class='name'>
                            {{ $t('trade.currentPrice') }}
                        </div>
                        <div class='value'>
                            <span :class='[Number(data.direction) === 1 ? product?.sell_color : product?.buy_color]'>
                                {{ Number(data.direction) === 1 ? product.sell_price : product?.buy_price }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class='handle'>
                    <div class='title'>
                        {{ $t('trade.closedNumHands') }}
                    </div>
                    <stepper
                        v-model='count'
                        class='stepper'
                        :placeholder="$t('trade.positionNum')"
                        :step='product.volumeStep'
                        @change='change'
                    />
                </div>
                <div class='tabs'>
                    <span v-for='item in tabs' :key='item.value' :class="{ 'item': true, 'item-active': item.value === currentValue }" @click='volumeHandler(item)'>
                        {{ item.title }}
                    </span>
                </div>
            </div>
            <template #footer>
                <button v-loading='isSubmit' class='handle-btn' @click='submitCloseHandler'>
                    {{ $t('trade.confirmClose') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { pow, minus, getDecimalNum, mul, lte, toFixed } from '@/utils/calculation'
import { Toast } from 'vant'
import { addMarketOrder } from '@/api/trade'
import stepper from '@planspc/components/stepper'

export default {
    components: {
        stepper
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 提交状态
            isSubmit: false,
            // 持仓数据
            data: {},
            // 数量
            count: '',
            // 按钮选项
            tabs: [
                { title: t('trade.allPosition'), value: 1, divValue: 1 },
                { title: '1/2', value: 2, divValue: 2 },
                { title: '1/3', value: 3, divValue: 3 },
                { title: '1/4', value: 4, divValue: 4 }
            ],
            // 当前选项卡
            currentValue: ''
        })
        // 产品数据
        const product = computed(() => store.state._quote.productMap[state.data.symbolId + '_' + state.data.tradeType] || {})
        // 持有手数
        const positionVolume = computed(() => minus(state.data.openVolume, state.data.closeVolume))
        // 手数小数位
        const volumeDigit = computed(() => product.value.numberDigits)
        // 账户列表
        const accountList = computed(() => store.state._user.customerInfo?.accountList)
        // 账户信息
        const account = computed(() => accountList.value.find(item => Number(item.tradeType) === Number(state.data.tradeType)))

        // 根据输入的手数高亮快速平仓手数
        // watchEffect(() => {
        //     const item = state.tabs.find(el => {
        //         const elVolume = div(positionVolume.value, el.divValue)
        //         if (eq(elVolume, state.count)) return true
        //     })
        //     state.currentValue = item ? item.value : -1
        // })

        // 打开弹窗
        const open = (row) => {
            store.dispatch('_quote/querySymbolInfo', {
                symbolId: row.symbolId,
                tradeType: row.tradeType
            })
            state.data = row
            state.currentValue = ''
            state.count = Number(positionVolume.value)
            state.isSubmit = false
            state.show = true
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
        }

        const change = () => {
            state.currentValue = ''
        }

        // 快速设置平仓手数
        const volumeHandler = (item) => {
            const minVolume = product.value.minVolume
            const volumeStep = product.value.volumeStep
            const volumeDigit = getDecimalNum(product.value.minVolume)
            state.currentValue = item.value
            if (lte(positionVolume.value, minVolume)) {
                state.count = minVolume
            } else {
                const newVolume = toFixed(volumeStep * Math.round((positionVolume.value / volumeStep) / parseFloat(item.divValue)), volumeDigit)
                state.count = newVolume
            }
        }

        // 平仓接口参数
        const submitCloseParam = () => {
            if (!state.count) {
                Toast(t('trade.inputCloseNum'))
                return
            }
            const data = state.data
            const requestPrice = data.direction === 1 ? product.value.sell_price : product.value.buy_price
            const direction = data.direction === 1 ? 2 : 1
            const p = pow(10, product.value.price_digits)
            const params = {
                bizType: 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                positionId: data.positionId,
                symbolId: product.value.symbolId,
                requestTime: Date.now(),
                requestNum: state.count,
                requestPrice: mul(requestPrice, p),
                expireType: data.expireType,
                stopLoss: data.stopLoss,
                takeProfit: data.takeProfit,
                tradeType: data.tradeType,
                accountId: account.value.accountId,
                accountCurrency: account.value.currency,
                accountDigits: account.value.digits
            }
            return params
        }

        // 确认平仓
        const submitCloseHandler = () => {
            const params = submitCloseParam()
            if (!params) return
            state.isSubmit = true
            addMarketOrder(params).then(res => {
                state.isSubmit = false
                if (res.check()) {
                    state.show = false
                    Toast(t('trade.closeSuccessToast'))
                    queryPositionList()
                    store.dispatch('_trade/tradeRecordList')
                } else {
                    Toast(res.msg)
                }
            }).catch(res => {
                state.isSubmit = false
                Toast(res.msg)
            })
        }

        // 获取持仓列表
        const queryPositionList = () => {
            const data = state.data
            const accountId = account.value.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: data.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId
            })
        }

        return {
            ...toRefs(state),
            open,
            close,
            product,
            positionVolume,
            volumeDigit,
            volumeHandler,
            submitCloseHandler,
            change
        }
    }
}
</script>

<style lang="scss" scoped>
.body-module {
    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        font-size: 14px;
        .col {
            display: inline-flex;
            flex-direction: column;
            .name {
                color: var(--minorColor);
            }
            .value {
                margin-top: 5px;
                span {
                    margin-right: 3px;
                }
            }
        }
    }
    .handle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            color: var(--minorColor);
            font-size: 14px;
        }
        .stepper {
            background: var(--assistColor);
            border-radius: 5px;
        }
    }
    .tabs {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 25px;
            margin-left: 10px;
            font-size: 13px;
            background: var(--assistColor);
            border-radius: 2px;
            cursor: pointer;
        }
        .item-active {
            background: var(--primary);
            color: #FFF;
        }
    }
}
.handle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    width: 100%;
    height: 48px;
    font-size: 16px;
    color: #FFF;
    border-radius: 4px;
    cursor: pointer;
}
</style>
