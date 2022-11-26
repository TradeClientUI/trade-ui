<template>
    <div class='dialog-wrap'>
        <van-popup v-model:show='show' @close='close'>
            <div class='popup-model'>
                <!-- 标题 -->
                <div class='model-header'>
                    <strong v-if='showSuccess' class='title'>
                    </strong>
                    <strong v-else class='title'>
                        Redeem {{ fund.thirdCoinCode }}
                    </strong>
                    <van-icon class='close' name='cross' @click='close' />
                </div>
                <!-- 切换网络 -->
                <div v-if='isSwitchNetwork' class='network-warn'>
                    <span v-if='fund'>
                        Please switch to {{ fund.marketName }}<i v-show='fund.networkName'>
                            {{ ' '+ fund.networkName }}
                        </i>.
                    </span>
                    <span>
                        <button @click='onSwitchNetwork'>
                            Switch Network
                        </button>
                    </span>
                </div>
                <!-- 赎回成功 -->
                <div v-if='showSuccess' class='success-content'>
                    <div class='success-block'>
                        <div class='success-icon'>
                            <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                <svg aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                                    <path clip-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' fill-rule='evenodd' />
                                </svg>
                            </svg>
                        </div>
                        <h4 class='all-done'>
                            All done!
                        </h4>
                        <p class='amount'>
                            You Redeemed {{ count }} {{ fund.thirdCoinCode }}
                        </p>
                    </div>
                    <div class='handle-action'>
                        <div class='review' @click='reviewDetail(successData.transactionHash)'>
                            <span>
                                Review tx details
                            </span>
                            <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                <svg
                                    aria-hidden='true'
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-width='2'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' stroke-linecap='round' stroke-linejoin='round' />
                                </svg>
                            </svg>
                        </div>
                        <button class='default' @click='close'>
                            Ok, Close
                        </button>
                    </div>
                </div>
                <!-- 赎回操作 -->
                <div v-else class='model-content'>
                    <div class='block'>
                        <div class='title'>
                            <label>Amount</label>
                        </div>
                        <div class='box'>
                            <div class='row-1'>
                                <input
                                    placeholder='0.00'
                                    :readonly='withdrawLoading'
                                    type='text'
                                    :value='count'
                                    @input='onInput'
                                />
                                <div class='coin'>
                                    <img :src='"/images/tokens/"+ (isETH ? "eth" : fund.thirdCoinCode.toLowerCase()) + ".svg"' />
                                    <span>{{ isETH ? 'ETH' : fund.thirdCoinCode }}</span>
                                </div>
                            </div>
                            <div class='row-2'>
                                <b v-if='usdCount < 0.01 && usdCount > 0'>
                                    &lt; $0.01
                                </b>
                                <b v-else>
                                    ${{ toFixed(usdCount) }}
                                </b>
                                <strong>
                                    <span>
                                        Balance {{ formatAmount(fund.balance, 5) }}
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
                            <label>Transaction overview</label>
                        </div>
                        <div class='box'>
                            <div class='row-3'>
                                <span class='name'>
                                    Remaining supply
                                </span>
                                <span class='value'>
                                    <b>{{ formatAmount(minus(fund.balance, count), 5) }} {{ fund.thirdCoinCode }}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='total'>
                        <svg class='svg-icon' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='m19.77 7.23.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z' />
                        </svg>
                        <van-loading v-if='feeLoading' :color='style.normalColor' :size='20' />
                        <div v-else>
                            <div v-if='fee'>
                                <span class='amount'>
                                    ${{ fee }}
                                </span>
                                <van-popover v-model:show='showTotalPopover' :offset='[50, 8]' placement='top'>
                                    <div class='popover-content'>
                                        <p>This gas calculation is only an estimation. Your wallet will set the price of the transaction. You can modify the gas settings directly from your wallet provider.</p>
                                    </div>
                                    <template #reference>
                                        <van-icon class='info' :color='showTotalPopover ? style.primary : style.normalColor' name='info-o' />
                                    </template>
                                </van-popover>
                            </div>
                            <span v-else>
                                --
                            </span>
                        </div>
                    </div>
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
                        <span class='reject-tip-text'>
                            {{ rejectTip }}
                        </span>
                    </div>
                    <!-- 操作按钮 -->
                    <div class='handle-action'>
                        <!-- 不同网络 -->
                        <button v-if='isSwitchNetwork' class='disable'>
                            Wrong Network
                        </button>
                        <!-- 未输入数量 -->
                        <button v-else-if='count <= 0 || feeLoading' class='disable'>
                            <van-loading v-if='feeLoading' :size='24' />
                            <span v-else>
                                Enter an amount
                            </span>
                        </button>
                        <!-- 已输入数量 -->
                        <div v-else>
                            <!-- 授权按钮 -->
                            <div v-if='showAllowance'>
                                <div v-if='isApproved' class='approved-tip'>
                                    <div class='state'>
                                        <van-icon class='tick' name='success' />
                                        <span>Approve confirmed</span>
                                    </div>
                                    <div class='review' @click='reviewDetail(approvedData.transactionHash)'>
                                        <span>
                                            Review approval tx details
                                        </span>
                                        <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                            <svg
                                                aria-hidden='true'
                                                fill='none'
                                                stroke='currentColor'
                                                stroke-width='2'
                                                viewBox='0 0 24 24'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' stroke-linecap='round' stroke-linejoin='round' />
                                            </svg>
                                        </svg>
                                    </div>
                                </div>
                                <div v-else class='approve-need'>
                                    <span>Why do I need to approve?</span>
                                    <van-icon class='info' :color='style.normalColor' name='info-o' @click='viewApproveTip' />
                                </div>
                                <button :class="allowanceLoading || isApproved ? 'disable' : 'default'" @click='withdrawApproveHandler'>
                                    <label v-if='allowanceLoading'>
                                        <van-loading :size='24' />
                                        <span>
                                            Approving ...
                                        </span>
                                    </label>
                                    <span v-else-if='isApproved'>
                                        Approved
                                    </span>
                                    <span v-else>
                                        Approve to continue
                                    </span>
                                </button>
                            </div>
                            <!-- 申购按钮 -->
                            <button :class="isWithdraw && !withdrawLoading ? 'default' : 'disable'" @click='withdrawHandler'>
                                <label v-if='withdrawLoading'>
                                    <van-loading :size='24' />
                                    <span>Redeeming {{ fund.thirdCoinCode }}</span>
                                </label>
                                <span v-else>
                                    Redeem {{ fund.thirdCoinCode }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>

    <!-- 授权提示弹窗 -->
    <aave-approve-tip v-model:show='showApproveTip' text='Before redeeming, you need to approve its usage by the Aave protocol.' />
</template>

<script setup>
import { ref, computed, watch, defineExpose, defineEmits, unref } from 'vue'
import { useStore } from 'vuex'
import { isEmpty, debounce } from '@/utils/util'
import { formatAmount, toFixed, pow, mul, limitNumber, gt, minus, div } from '@/utils/calculation'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { provider, web3Hooks } from '@/plugins/web3/index'
import aaveApproveTip from './aave-approve-tip.vue'

const emit = defineEmits(['withdrawSuccess'])
const store = useStore()
const style = computed(() => store.state.style)
const userAddress = computed(() => store.state._web3.userAddress)
const chainId = computed(() => store.state._web3.chainId)
const {
    executeConnect,
    switchNetwork,
    estimateFee,
    withdrawDAI,
    withdrawETH,
    openExtBrowser,
    allowance,
    withdrawETHApprove
} = web3Hooks()

// 是否需要切换网络
const isSwitchNetwork = computed(() => Number(fund.value.chainId !== Number(chainId.value)))
// 是否需要授权额度
const showAllowance = computed(() => {
    if (isApproved.value) {
        return true
    } else {
        return isETH.value && Number(count.value) > Number(allowanceBalance.value)
    }
})
// 是否可进行赎回
const isWithdraw = computed(() => {
    if (isEmpty(count.value) || count.value <= 0) return false
    if (showAllowance.value && !isApproved.value) {
        return false
    } else {
        return true
    }
})
// 当前赎回数量转换成USD的数量
const usdCount = computed(() => {
    return count.value > 0 ? mul(count.value, fund.value.price) : 0
})

// 是否显示弹窗
const show = ref(false)
// 申购基金
const fund = ref({})
// 是否显示金额统计说明弹窗
const showTotalPopover = ref(false)
// 赎回的数量
const count = ref('')
// 是否显示授权提示弹窗
const showApproveTip = ref(false)
// 授权额度查询中
const allowanceBalanceLoading = ref(false)
// 代币授权额度
const allowanceBalance = ref('')
// 授权中
const allowanceLoading = ref(false)
// 是否授权完成
const isApproved = ref(false)
// 授权成功返回的数据
const approvedData = ref({})
// 是否使用ETH赎回
const isETH = ref(false)
// 赎回中
const withdrawLoading = ref(false)
// 代币余额
const assetBalance = ref(0)
// 代币余额获取中
const assetBalanceLoading = ref(true)
// 预估手续费
const fee = ref('')
// 预估手续费获取中
const feeLoading = ref(false)
// 是否显示申购成功弹窗
const showSuccess = ref(false)
// 申购成功返回的数据
const successData = ref({})
// 拒绝提示内容
const rejectTip = ref('')

// 重置数据
const reset = () => {
    count.value = ''
    allowanceBalance.value = ''
    fee.value = ''
    assetBalance.value = 0
    allowanceBalanceLoading.value = false
    allowanceLoading.value = false
    withdrawLoading.value = false
    feeLoading.value = false
    assetBalanceLoading.value = true
    rejectTip.value = ''
    setTimeout(() => {
        isApproved.value = false
        approvedData.value = {}
        showSuccess.value = false
        successData.value = {}
    }, 1000)
}

// 初始化
const init = () => {
    isETH.value = ['WETH', 'ETH'].includes(fund.value.thirdCoinCode)
    show.value = true
    // 查询授权余额
    if (isETH.value) allowanceHandler()
}

// 切换电子钱包账户
const accountsChangedFn = async (accounts) => {
    if (accounts.length === 0) {
        close()
        return false
    }
}

// 打开弹窗
const open = (data) => {
    reset()
    fund.value = data
    if (userAddress.value) {
        init()
    } else {
        // 连接狐狸钱包
        executeConnect().then(() => {
            console.log('连接狐狸钱包成功')
            init()
        })
    }
    provider.on('accountsChanged', accountsChangedFn)
}

// 关闭弹窗
const close = () => {
    show.value = false
    reset()
    provider.removeListener('accountsChanged', accountsChangedFn)
}

// 查询授权余额
const allowanceHandler = () => {
    if (fund.value.chainId !== chainId.value) return
    allowance(fund.value.aTokenAddress, isETH.value).then(value => {
        allowanceBalance.value = div(value, pow(10, fund.value.decimals))
        allowanceBalanceLoading.value = false
        console.log('查询授权余额成功', allowanceBalance.value)
    }).catch((err) => {
        console.log('查询授权余额失败', err)
        allowanceBalanceLoading.value = false
    })
}

// 代币取款授权
const withdrawApproveHandler = () => {
    if (fund.value.chainId !== chainId.value) return
    if (allowanceLoading.value || isApproved.value) return
    allowanceLoading.value = true
    const approveValue = mul(999999, pow(10, fund.value.decimals))
    withdrawETHApprove(fund.value.aTokenAddress, approveValue).then(res => {
        console.log('代币取款授权成功', res)
        allowanceLoading.value = false
        isApproved.value = true
        approvedData.value = res
        rejectTip.value = ''
        // 获取授权余额
        allowanceHandler()
        // 获取手续费
        getFee()
    }).catch(err => {
        console.log('代币取款授权失败', err)
        allowanceLoading.value = false
        rejectTip.value = err.message
    })
}

// 获取手续费
const getFee = () => {
    if (fund.value.chainId !== chainId.value) return
    const value = mul(count.value, pow(10, fund.value.decimals))
    estimateFee(fund.value.assetId, value, unref(isETH), false).then(res => {
        console.log('获取手续费成功', res)
        feeLoading.value = false
        fee.value = toFixed(res)
    }).catch(err => {
        console.log('获取手续费失败', err)
        feeLoading.value = false
    })
}

// 代币取款
const withdrawHandler = () => {
    if (fund.value.chainId !== chainId.value) return
    if (!isWithdraw.value || withdrawLoading.value) return
    withdrawLoading.value = true
    rejectTip.value = ''
    const value = mul(count.value, pow(10, fund.value.decimals))
    if (isETH.value) {
        withdrawETH(value).then(res => {
            if (withdrawLoading.value) {
                showSuccess.value = true
                successData.value = res
                rejectTip.value = ''
                store.dispatch('_web3/getAAVEMarkets')
                emit('withdrawSuccess')
                console.log('代币取款成功', res)
            }
            withdrawLoading.value = false
        }).catch(err => {
            withdrawLoading.value = false
            rejectTip.value = err.message
            console.log('代币取款失败', err)
        })
    } else {
        withdrawDAI(fund.value.assetId, value).then(res => {
            if (withdrawLoading.value) {
                showSuccess.value = true
                successData.value = res
                rejectTip.value = ''
                store.dispatch('_web3/getAAVEMarkets')
                emit('withdrawSuccess')
                console.log('代币取款成功', res)
            }
            withdrawLoading.value = false
        }).catch(err => {
            withdrawLoading.value = false
            rejectTip.value = err.message
            console.log('代币取款失败', err)
        })
    }
}

// 切换网络
const onSwitchNetwork = () => {
    switchNetwork(fund.value.chainId).then(res => {
        console.log('切换网络成功')
    }).catch(err => {
        console.log('切换网络失败')
    })
}

// 监听赎回数量
watch(() => count.value, () => {
    if (isEmpty(count.value) || Number(count.value) <= 0) {
        feeLoading.value = false
        fee.value = ''
    } else {
        feeLoading.value = true
        inputHandler()
    }
})

// 输入事件控制
const onInput = (e) => {
    let newval = limitNumber(e.target.value)
    if (gt(newval, fund.value.balance)) newval = fund.value.balance
    e.target.value = newval
    count.value = newval
    isApproved.value = false
    approvedData.value = {}
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    if (isEmpty(count.value) || Number(count.value) <= 0) return
    // 获取手续费
    getFee()
}, 500)

// 点击MAX
const onMax = () => {
    if (withdrawLoading.value) return
    count.value = fund.value.balance
}

// 查看授权提示
const viewApproveTip = () => {
    showApproveTip.value = true
}

// 跳转到问询台详情
const reviewDetail = (transactionHash) => {
    const explorerLink = networkConfigs[chainId.value]?.explorerLink + '/tx/' + transactionHash
    openExtBrowser(explorerLink)
}

// 暴露方法
defineExpose({
    open
})
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
    width: 420px;
    min-height: 416px;
    max-height: calc(100vh - 80px);
    background-color: var(--contentColor);
    color: var(--normalColor);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
    overflow-y: auto;
    padding: 24px;
    position: relative;
    @media (max-width: 768px) {
        width: calc(100% - 30px);
        margin: 0 auto;
        padding: 24px 16px;
    }
}
.model-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color);
    margin-bottom: 24px;
    .title {
        font-size: 20px;
    }
    .close {
        font-size: 24px;
        cursor: pointer;
    }
}
.model-content {
    .block {
        margin-bottom: 20px;
    }
    .title {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        .info {
            margin-top: -2px;
            margin-left: 4px;
            cursor: pointer;
        }
    }
    .box {
        line-height: 1.6;
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
        align-items: center;
        line-height: 1.2;
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
        .reject-tip-text {
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 95px;
            display: inline-block;
            word-break: break-word;
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
    @media (max-width: 768px) {
        .row-1 {
            input {
                max-width: 200px;
            }
            .coin {
                img {
                    width: 20px;
                    height: 20px;
                }
                span {
                    font-size: 14px;
                }
            }
        }
    }
}
.popover-content {
    width: 220px;
    padding: 10px 12px;
    line-height: 1.2;
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
    margin-bottom: 24px;
    button {
        background: none;
        text-decoration: underline;
        cursor: pointer;
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

// 成功内容
.success-content {
    .success-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 300px;
        padding-top: 10px;
        color: var(--color);
    }
    .success-icon {
        display: flex;
        width: 48px;
        height: 48px;
        justify-content: center;
        align-items: center;
        background-color: rgb(236, 248, 237);
        border-radius: 50%;
        .svg-icon {
            width: 32px;
            height: 32px;
            color: rgb(76, 175, 80);
        }
    }
    .all-done {
        margin-top: 16px;
        font-size: 18px;
        font-weight: 600;
    }
    .amount {
        margin-top: 8px;
    }
    .handle-action {
        .review {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: var(--color);
            font-size: 13px;
            cursor: pointer;
            .svg-icon {
                width: 14px;
                height: 14px;
                margin-left: 2px;
            }
            &:hover {
                text-decoration: underline;
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
            &.default {
                @include hover();
                background: var(--primary);
                color: #FFF;
                cursor: pointer;
            }
        }
    }
}
</style>
