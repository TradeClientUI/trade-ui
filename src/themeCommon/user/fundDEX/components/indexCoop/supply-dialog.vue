<template>
    <div v-if='fundData' class='dialog-wrap'>
        <van-popup v-model:show='show' @close='close' @open='onOpen'>
            <div class='popup-model'>
                <div class='model-header'>
                    <strong v-if='showSuccess' class='title'>
                    </strong>
                    <strong v-else class='title'>
                        Quick Trade
                    </strong>
                    <van-icon class='close' name='cross' @click='close' />
                </div>

                <div v-if='isSwitchNetwork' class='network-warn'>
                    <span>
                        Please switch to {{ fundData.marketLinkType }}.
                    </span>
                    <span>
                        <button @click='onSwitchNetwork'>
                            Switch Network
                        </button>
                    </span>
                </div>

                <!-- 申购成功 -->
                <SupplySuccess v-if='showSuccess' :count='fromAmount' :fund='fundData' :success-data='successData' @close='close' />

                <!-- 申购操作 -->
                <div v-else class='model-content'>
                    <div class='case'>
                        <div v-if='from' class='block'>
                            <div class='title'>
                                <label>From</label>
                            </div>
                            <div class='box'>
                                <div class='row-1'>
                                    <input
                                        v-positiveNumber='18'
                                        placeholder='0.00'
                                        :readonly='isSwitchNetwork || loading'
                                        type='text'
                                        :value='fromAmount'
                                        @input='onInputAmount'
                                    />
                                    <div v-if="swapType==='purchase'" class='coin pointer' @click='selectTokenHandler'>
                                        <img :src='"/images/tokens/"+ from.symbol.toLowerCase() +".svg"' />
                                        <span>{{ from.symbol }}</span>
                                    </div>
                                    <div v-else class='coin'>
                                        <img :src='from.image' />
                                        <span>{{ from.symbol }}</span>
                                    </div>
                                </div>
                                <div class='row-2'>
                                    <b>
                                        $ {{ toFixed(fromAmountToUSD) }}
                                    </b>
                                    <strong>
                                        <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='18' />
                                        <span v-else-if="swapType==='purchase'">
                                            Balance {{ formatAmount(from.balance, 5) }}
                                        </span>
                                        <span v-else>
                                            Balance {{ formatAmount(toBalance, 5) }}
                                        </span>
                                        <button @click='onMax'>
                                            MAX
                                        </button>
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div class='block'>
                            <div class='title'>
                                <label>To</label>
                                <button class='switchSwapHandler' @click='switchSwapHandler'>
                                    <svg aria-hidden='true' class='chakra-icon css-onkibi' focusable='false' viewBox='-1 -1 9 11'>
                                        <path d='M 3.5 0L 3.98809 -0.569442L 3.5 -0.987808L 3.01191 -0.569442L 3.5 0ZM 3.5 9L 3.01191 9.56944L 3.5 9.98781L 3.98809 9.56944L 3.5 9ZM 0.488094 3.56944L 3.98809 0.569442L 3.01191 -0.569442L -0.488094 2.43056L 0.488094 3.56944ZM 3.01191 0.569442L 6.51191 3.56944L 7.48809 2.43056L 3.98809 -0.569442L 3.01191 0.569442ZM -0.488094 6.56944L 3.01191 9.56944L 3.98809 8.43056L 0.488094 5.43056L -0.488094 6.56944ZM 3.98809 9.56944L 7.48809 6.56944L 6.51191 5.43056L 3.01191 8.43056L 3.98809 9.56944Z' fill='currentColor' />
                                    </svg>
                                </button>
                            </div>
                            <div class='box'>
                                <div class='row-1'>
                                    <input
                                        placeholder='0.00'
                                        readonly
                                        type='text'
                                        :value='swapQuoteInfo ? toFixed(swapQuoteInfo.minimumReceived, 5):""'
                                    />
                                    <div v-if="swapType==='purchase'" class='coin'>
                                        <img :src='to.image' />
                                        <span>{{ to.symbol }}</span>
                                    </div>
                                    <div v-else class='coin pointer' @click='selectTokenHandler'>
                                        <img :src='"/images/tokens/"+ to.symbol.toLowerCase() +".svg"' />
                                        <span>{{ to.symbol }}</span>
                                    </div>
                                </div>
                                <div class='row-2'>
                                    <span>
                                        <b> $ {{ toFixed(toAmountToUSD) }} </b>
                                        <b v-if='discountRate'>
                                            ({{ discountRate }})
                                        </b>
                                    </span>
                                    <strong>
                                        <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='18' />
                                        <span v-else-if="swapType==='purchase'">
                                            Balance {{ formatAmount(toBalance, 5) }}
                                        </span>
                                        <span v-else>
                                            Balance {{ formatAmount(to.balance, 5) }}
                                        </span>
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <SupplySummary v-if='!!swapQuoteInfo && to && from' :count='fromAmount' :from='from' :swap-quote-info='swapQuoteInfo' :to='to' />

                        <!-- 拒绝提示 -->
                        <div v-if='rejectTip' class='reject-tip'>
                            <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                <svg
                                    aria-hidden='true'
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-width='2'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' stroke-linecap='round' stroke-linejoin='round' />
                                </svg>
                            </svg>
                            <span>{{ rejectTip }}</span>
                        </div>

                        <div class='btnBox'>
                            <van-button
                                block
                                class='btn'
                                :disabled='!fromAmount || isSwitchNetwork || insufficientAmount'
                                :loading='loading || quoteLoading'
                                loading-text='Trading...'
                                type='primary'
                                @click='swapHandler'
                            >
                                {{ swapBtnText }}
                            </van-button>
                            <p v-if='swapQuoteInfo' class='text'>
                                This trade will be executed on contract:
                            </p>
                            <p v-if='swapQuoteInfo' class='text pointer underline' @click='openContractAddress'>
                                {{ swapQuoteInfo.to }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
        <CoopSelectTokenDialog v-model='selectTokenDialogVisible' :pay-coin-list='payCoinList' :to='to' @select='selectToken' />
    </div>
</template>

<script setup>
import { ref, computed, defineEmits, unref, defineExpose, nextTick } from 'vue'
import { useStore } from 'vuex'
import { debounce } from '@/utils/util'
import { formatAmount, toFixed, pow, mul, div, gt, minus } from '@/utils/calculation'
import { baseSymbol, provider, web3Hooks } from '@/plugins/web3/index'
import CoopSelectTokenDialog from './coop-selectToken-dialog.vue'
import SupplySuccess from './supply-success.vue'
import SupplySummary from './supply-summary.vue'
import { Toast } from 'vant'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import SupplyHooks from './supplyHooks'

const props = defineProps(['modelValue', 'fundData'])
const emit = defineEmits(['update:modelValue', 'swapSuccess'])
const store = useStore()
const style = computed(() => store.state.style)
const { switchNetwork, openExtBrowser } = web3Hooks()

const {
    payCoinList,
    getBalanceOf,
    swapType,
    swapQuoteInfo,
    usdRate,
    fundUsdRate,
    getDaiPriceHandler,
    reset,
    getEthereumPayCoinListBalance,
    querySwapQuote,
    indexCoopPurchase,
    allowanceApproveHandler,
    queryAllowance
} = SupplyHooks()

// 是否需要切换网络
const isSwitchNetwork = computed(() => props.fundData?.chainId !== store.state._web3.chainId)

// 当前申购数量转换成USD的数量
const fromAmountToUSD = computed(() => {
    const rate = swapType.value === 'purchase' ? usdRate.value : fundUsdRate.value
    return fromAmount.value > 0 ? mul(fromAmount.value, rate) : '0'
})

// 申购基金对应的usd值
const toAmountToUSD = computed(() => {
    const rate = swapType.value === 'purchase' ? fundUsdRate.value : usdRate.value
    if (!swapQuoteInfo.value) return '0'
    return mul(swapQuoteInfo.value.minimumReceived, rate)
})

// 折价率
const discountRate = computed(() => {
    if (toAmountToUSD.value === '0' || !fromAmountToUSD.value || fromAmountToUSD.value === '0') {
        return ''
    }
    const fromAmountUSD = toFixed(fromAmountToUSD.value)
    const toAmountUSD = toFixed(toAmountToUSD.value)
    if (fromAmountUSD === '0.00') return ''
    const val = div(minus(toAmountUSD, fromAmountUSD), fromAmountUSD)
    return toFixed(mul(val, 100)) + '%'
})

// 是否显示弹窗
const show = computed({
    get: () => props.modelValue,
    set: newval => emit('update:modelValue', newval)
})
// 是否显示代币的弹窗
const selectTokenDialogVisible = ref(false)

// 当前选择的支付币种在列表中的下标
const payCoinIndex = ref(0)

// 支付币种
const from = ref('')
// 申购币种
const to = ref('')
// 申购币种余额
const toBalance = ref('0')

const insufficientAmount = computed(() => {
    const balance = swapType.value === 'purchase' ? from.value.balance : toBalance.value
    const invalidAmount = fromAmount.value === '0'
    return gt(fromAmount.value, balance) || invalidAmount
})

// 申购的数量
const fromAmount = ref('')

// 代币授权额度
let allowanceBalance = 0
// 是否需要授权额度
const showAllowance = ref(false)
// 代币余额获取中
const assetBalanceLoading = ref(true)

const loading = ref(false)
const quoteLoading = ref(false)

// 是否显示申购成功弹窗
const showSuccess = ref(false)
// 申购成功返回的数据
const successData = ref(null)
// 拒绝提示内容
const rejectTip = ref(false)

const swapBtnText = computed(() => {
    if (isSwitchNetwork.value) {
        const { chainId } = store.state._web3
        return networkConfigs[chainId] ? `Not Available on ${networkConfigs[chainId].name}` : 'Wrong Network'
    } else if (!fromAmount.value || fromAmount.value === '0') {
        return 'Enter an amount'
    } else if (insufficientAmount.value) {
        return 'Insufficient funds'
    } else if (showAllowance.value) {
        return 'Approve Tokens'
    } else {
        return 'Trade'
    }
})

// 关闭弹窗
const close = () => {
    provider.removeListener('accountsChanged', accountsChangedFn)
    emit('update:modelValue', false)
}

// 切换网络
const onSwitchNetwork = () => {
    switchNetwork(props.fundData.chainId).then(res => {
        console.log('切换网络成功')
    }).catch(err => {
        console.log('切换网络失败')
        Toast(err.message)
    })
}

// 获取授权余额
const getAllowance = async () => {
    return queryAllowance(from).then(res => {
        allowanceBalance = res
        return res
    })
}

// 显示选择支付代币的弹窗
const selectTokenHandler = () => {
    if (!loading.value) selectTokenDialogVisible.value = true
}

// 选择支付代币
const selectToken = (item) => {
    if (swapType.value === 'purchase') {
        from.value = item
    } else {
        to.value = item
    }
    getDaiPriceHandler(item)
    if (!insufficientAmount.value) getSwapQuoteHandler()
}

const init = () => {
    const { chainId, address, polygonAddress, decimals = 18 } = props.fundData
    const daiAddress = chainId === 1 ? address : polygonAddress

    // 然后获取支付币种余额
    getEthereumPayCoinListBalance(chainId).then(res => {
        assetBalanceLoading.value = false
    })

    // 获取申购基金的余额
    getBalanceOf(chainId, daiAddress).then(res => {
        toBalance.value = div(res, pow(10, decimals))
    })
}

// 显示弹窗事件
const onOpen = () => {
    reset(props.fundData)
    init()

    payCoinIndex.value = 0
    toBalance.value = '0'
    fromAmount.value = ''
    from.value = payCoinList.value[0]
    to.value = props.fundData
    showSuccess.value = false
    loading.value = false
    console.log('%cFrom:', 'color:red', from.value)
    console.log('%cTo:', 'color:red', to.value)

    getDaiPriceHandler(from.value)

    provider.on('accountsChanged', accountsChangedFn)
}

// 切换电子钱包账户
const accountsChangedFn = async (accounts) => {
    // console.log('accountsChanged', accounts)
    if (accounts.length === 0) {
        close()
        return false
    }
    init()
}

// 获取交易行情数据
const getSwapQuoteHandler = () => {
    if (!fromAmount.value) return false
    quoteLoading.value = true
    querySwapQuote(from, to, fromAmount).then(async res => {
        const fromSymbol = from.value.symbol
        const isBaseSymbol = baseSymbol.includes(fromSymbol.toLowerCase()) // 支付币种是否为基础symbol
        // 获取授权余额
        if (!isBaseSymbol) await getAllowance()
        showAllowance.value = !isBaseSymbol && gt(fromAmount.value, allowanceBalance)
        console.log('获取授权余额成功', allowanceBalance)
        return res
    }).catch(err => {
        console.log('获取授权余额失败', err)
    }).finally(() => {
        quoteLoading.value = false
    })
}

// 输入申购金额
const onInputAmount = (e) => {
    const val = e.target.value.trim()
    fromAmount.value = val

    // 获取交易行情
    launchSwapQuote()
}
// 获取交易行情
const launchSwapQuote = debounce(async (e) => {
    await nextTick()
    if (insufficientAmount.value) return false
    if (fromAmount.value && fromAmount.value > 0) getSwapQuoteHandler()
    else swapQuoteInfo.value = null
}, 400)

// 点击max
const onMax = () => {
    fromAmount.value = swapType.value === 'purchase' ? from.value.balance : toBalance.value
    launchSwapQuote()
}

// 点击申购按钮
const swapHandler = () => {
    if (showAllowance.value) {
        // 需要授权
        loading.value = true
        allowanceApproveHandler(from, fromAmount.value).then(res => {
            console.log('授权成功', res)
            allowanceBalance = fromAmount.value
            showAllowance.value = false
        }).catch(err => {
            console.log('授权失败', err)
        }).finally(() => {
            loading.value = false
        })
        return
    }
    loading.value = true
    indexCoopPurchase(swapQuoteInfo.value).then(res => {
        console.log('交易成功', res)
        successData.value = res
        showSuccess.value = true
        emit('swapSuccess')
    }).catch(err => {
        console.log('交易失败', err)
        console.log(err)
    }).finally(() => {
        loading.value = false
    })
}

// 切换申购赎回
const switchSwapHandler = () => {
    if (loading.value) return false;
    [to.value, from.value] = [from.value, to.value]
    swapType.value = swapType.value === 'purchase' ? 'withdraw' : 'purchase'

    if (fromAmount.value && !insufficientAmount.value) getSwapQuoteHandler()
}

// 打开合约地址
const openContractAddress = () => {
    const explorerLink = networkConfigs[props.fundData.chainId].explorerLink
    const url = `${explorerLink}/address/${swapQuoteInfo.value.to}`
    openExtBrowser(url)
}

defineExpose({ switchSwapHandler })

</script>

<style lang="scss" scoped>
.dialog-wrap {
    :deep(.van-popup) {
        background: transparent;
        @media (max-width: 768px) {
            width: 100%;
        }
    }
}
.popup-model {
    display: flex;
    flex-direction: column;
    width: 420px;
    min-height: 416px;
    max-height: calc(100vh - 150px);
    background-color: var(--contentColor);
    color: var(--normalColor);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
    overflow-y: auto;
    position: relative;
    .case {
        padding: 24px;
    }
    @media (max-width: 768px) {
        width: calc(100% - 30px);
        margin: 0 auto;
        .case {
            padding: 24px 16px;
        }
    }
}
.model-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color);
    padding: 24px;
    .title {
        font-size: 20px;
    }
    .close {
        font-size: 24px;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        padding: 16px;
    }
}
.model-content {
    flex: 1;
    overflow-y: auto;
    .block {
        margin-bottom: 20px;
    }
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        .info {
            margin-top: -2px;
            margin-left: 4px;
            cursor: pointer;
        }
        .switchSwapHandler {
            width: 40px;
            height: 40px;
            background: none;
            border-radius: 10px;
            border: 2px solid var(--minorColor);
            cursor: pointer;
            line-height: 40px;
            margin-bottom: 15px;
            align-items: flex-end;
            @include hover();
            svg {
                width: 16px;
                height: 16px;
            }
        }
    }
    .box {
        padding: 8px 12px;
        border: 1px solid var(--lineColor);
        border-radius: 6px;
        margin-bottom: 4px;
    }
    .row-1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 28px;
        color: var(--color);
        input {
            flex: 1;
            height: 100%;
            font-size: 18px;
            margin-right: 16px;
            min-width: 100px;
            color: var(--color);
        }
        .coin {
            display: inline-flex;
            align-items: center;
            height: 100%;
            img {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }
            span {
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
    .row-2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        b {
            font-weight: normal;
            color: var(--minorColor);
        }
        strong {
            display: inline-flex;
            align-items: center;
            span {
                font-weight: normal;
            }
            button {
                margin-left: 6px;
                background: none;
                color: var(--color);
                cursor: pointer;
            }
        }
    }
    .row-3 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        color: var(--color);
        &:last-of-type {
            margin-bottom: 0;
        }
        .value {
            b {
                font-weight: normal;
            }
            em {
                font-style: normal;
                color: var(--normalColor);
            }
        }
        .state {
            display: inline-flex;
            align-items: center;
            color: rgb(76, 175, 80);
            .tick {
                font-size: 16px;
                margin-right: 2px;
            }
        }
    }
    .total {
        display: flex;
        align-items: center;
        margin-top: 24px;
        color: var(--normalColor);
        .svg-icon {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
        .amount {
            margin-right: 2px;
            color: var(--color);
        }
        .info {
            margin-top: -2px;
            cursor: pointer;
        }
    }
    .reject-tip {
        display: flex;
        padding: 8px 12px;
        margin-top: 16px;
        font-weight: 400;
        font-size: 14px;
        color: rgb(79, 25, 25);
        background: rgb(249, 235, 235);
        border-radius: 4px;
        .svg-icon {
            width: 20px;
            height: 20px;
            margin-top: 2px;
            margin-right: 5px;
            color: rgba(188, 0, 0, 0.72);
        }
    }
    .handle-action {
        margin-top: 48px;
        .approved-tip {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 13px;
            .state {
                display: inline-flex;
                align-items: center;
                color: rgb(76, 175, 80);
            }
            .review {
                display: inline-flex;
                align-items: center;
                color: var(--color);
                cursor: pointer;
                .svg-icon {
                    width: 14px;
                    height: 14px;
                    margin-top: 4px;
                    margin-left: 2px;
                }
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        .approve-need {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 12px;
            color: var(--normalColor);
            .info {
                margin-top: -2px;
                margin-left: 4px;
                font-size: 14px;
                cursor: pointer;
            }
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 44px;
            margin-top: 8px;
            font-size: 16px;
            border-radius: 4px;
            transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            label {
                display: inline-flex;
                align-items: center;
                span {
                    margin-left: 5px;
                }
            }
            &.default {
                @include hover();
                background: var(--primary);
                color: #FFF;
                cursor: pointer;
            }
            &.disable {
                background: var(--lineColor);
                color: var(--minorColor);
            }
        }
    }
}
.pointer {
    cursor: pointer;
}
.popover-content {
    width: 280px;
    padding: 16px 24px;
    line-height: 16px;
    font-size: 12px;
}
.network-warn {
    border-radius: 4px;
    padding: 10px 12px;
    font-weight: 400;
    letter-spacing: 0.009375rem;
    line-height: 20px;
    font-size: 14px;
    align-items: flex-start;
    color: rgb(79, 25, 25);
    background: rgb(249, 235, 235);
    margin: 0 24px 24px;
    button {
        background: none;
        text-decoration: underline;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        margin: 0 16px 24px;
    }
}
.cancel-warn {
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 10px 12px;
    font-weight: 400;
    line-height: 20px;
    font-size: 14px;
    color: rgb(79, 25, 25);
    background: rgb(249, 235, 235);
    margin-top: 16px;
    svg {
        width: 24px;
        height: 24px;
        margin-right: 12px;
    }
    button {
        margin-left: 4px;
        text-decoration: underline;
        cursor: pointer;
    }
}
.btnBox {
    margin-top: 48px;
    .btn {
        border: 0;
        font-size: 16px;
        margin-bottom: 20px;
        &:disabled {
            background-color: var(--minorColor);
        }
    }
    .text {
        font-size: 12px;
        text-align: center;
        &.underline {
            text-decoration: underline;
        }
    }
}
</style>
