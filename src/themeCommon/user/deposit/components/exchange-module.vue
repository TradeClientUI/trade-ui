<template>
    <div class='module-content'>
        <!-- 不在存款时间内 -->
        <time-tips v-if='showTimeTip' :time-list='timeList' />
        <!-- 充值操作 -->
        <div v-else class='module-case'>
            <!-- 待购买 -->
            <div v-if='pageModule === 1' class='module-handle'>
                <div class='block'>
                    <p class='block-label'>
                        <span>{{ $t('deposit.youReceive') }}</span>
                        <van-icon class='info' name='info' @click="showExplain($t('deposit.youReceiveTip'))" />
                    </p>
                    <div class='block-box'>
                        <div class='import'>
                            <van-field v-model='amount' class='mobile_deposit_receive_input_ga' :placeholder='buyPlaceholder' type='number' @input='inputAmount' />
                            <van-icon v-if='amount' class='clear' name='clear' @click='clearInput' />
                        </div>
                        <div :class="['select', currencyShowMenu ? 'show' : 'hide']" @click.stop='toggleBuyMenu'>
                            <currency-icon v-if='currency' :currency='currency' :size='25' />
                            <span>{{ currency }}</span>
                            <van-icon class='arrow' name='arrow-down' />
                        </div>
                    </div>
                    <p v-if='showBuyTip' class='block-tip red'>
                        <van-icon class='warning' name='warning' :size='14' />
                        <span>{{ $t('deposit.amountTip', { singleLowAmount: accountInfo.singleLowAmount, singleHighAmount: accountInfo.singleHighAmount }) }}</span>
                    </p>
                </div>
                <div class='block'>
                    <p class='block-label'>
                        <span>{{ $t('deposit.youPay') }}</span>
                        <van-icon class='info' name='info' @click="showExplain($t('deposit.youPayTip'))" />
                    </p>
                    <div class='block-box'>
                        <div class='import'>
                            <van-field v-model='expectedAmount' class='mobile_deposit_pay_input_ga' :placeholder="$t('deposit.inputAmount')" type='number' @input='inputExpectedAmount' />
                            <van-icon v-if='expectedAmount' class='clear' name='clear' @click='clearInput' />
                        </div>
                        <div :class="['select', paymentShowMenu ? 'show' : 'hide']" @click.stop='togglePaymentMenu'>
                            <currency-icon v-if='paymentCurrency' :currency='paymentCurrency' :size='25' />
                            <span>{{ paymentCurrency }}</span>
                            <van-icon class='arrow' name='arrow-down' />
                        </div>
                    </div>
                    <p v-if='paymentCurrency' class='block-tip'>
                        <span>{{ $t('deposit.includeFee') }}: {{ payCurrencyFee || '0.00' }} {{ paymentCurrency }}</span>
                    </p>
                </div>
                <div v-if='chainList.length > 0' class='block'>
                    <p class='block-label'>
                        <span>{{ $t('deposit.depositNework') }}</span>
                        <van-icon class='info' name='info' @click="showExplain($t('deposit.depositNeworkTip1'))" />
                    </p>
                    <div class='block-box'>
                        <div :class="['select select-flex', chainShowMenu ? 'show' : 'hide']" @click.stop='toggleChainMenu'>
                            <span>{{ chainName }}</span>
                            <van-icon class='arrow' name='arrow-down' />
                        </div>
                    </div>
                    <p class='block-tip red'>
                        <van-icon class='warning' name='warning' :size='14' />
                        <span>{{ $t('deposit.depositNeworkTip2') }}</span>
                    </p>
                </div>
                <div class='handle'>
                    <p v-if='paymentCurrency' class='handle-conversion'>
                        {{ $t('deposit.estimatedPrice') }}: 1 {{ currency }} = {{ rateNum }} {{ paymentCurrency }}
                    </p>
                    <button v-if='isNext' class='handle-next mobile_deposit_continue_ga default' @click='handleDeposit'>
                        <van-loading v-if='isSubmit' />
                        <span v-else>
                            {{ $t('common.continue') }}
                        </span>
                    </button>
                    <div v-else class='handle-relative'>
                        <button
                            class='handle-next mobile_deposit_continue_ga disable'
                            @click='openPopoverTip'
                        >
                            <span>
                                {{ $t('common.continue') }}
                            </span>
                        </button>
                        <popover-tips v-model='showPopoverTip' auto-close :text="$t('deposit.inputAmount')" />
                    </div>
                    <!-- <p class='handle-tip'>
                        {{ $t('deposit.channelTip') }}
                    </p> -->
                </div>
            </div>
            <!-- 支付结果 -->
            <div v-else class='module-result'>
                <!-- 待支付、待处理 -->
                <div v-if='pageModule === 2 || pageModule === 3' class='module-result-unpaid'>
                    <template v-if='isRefresh'>
                        <van-loading :color='style.primary' :size='70' />
                        <p class='state'>
                            <span>{{ $t('common.loading') }}</span>
                        </p>
                    </template>
                    <template v-else>
                        <van-icon name='todo-list' />
                        <p class='state'>
                            <span>{{ pageModule === 2 ? $t('deposit.tobePay') : $t('deposit.tobeProcessed') }}</span>
                        </p>
                        <p class='tip-1'>
                            {{ $t('deposit.payTip1') }}
                            <span @click='onRefresh'>
                                {{ $t('common.refresh') }}
                            </span>
                        </p>
                    </template>
                    <div class='tip-2'>
                        {{ $t('deposit.payTip2') }}
                        <span @click='goService'>
                            {{ $t('common.serivce') }}
                        </span>
                    </div>
                </div>
                <!-- 购买成功 -->
                <div v-if='pageModule === 4' class='module-result-success'>
                    <van-icon name='checked' />
                    <p class='state'>
                        {{ $t('deposit.depositSuccess') }}
                    </p>
                    <p class='tip-1'>
                        {{ $t('deposit.payTip3', { finalAmount: orderResult.finalAmount, depositCurrency: orderResult.depositCurrency }) }}
                    </p>
                    <div class='btn-group'>
                        <button class='btn-1' @click='toOrderPriority(tradeType)'>
                            {{ $t('deposit.toTrade') }}
                        </button>
                        <button class='btn-2' @click='goAssets'>
                            {{ $t('deposit.checkAccount') }}
                        </button>
                    </div>
                </div>
                <!-- 购买失败 -->
                <div v-if='pageModule === 5' class='module-result-fail'>
                    <van-icon name='clear' />
                    <p class='state'>
                        {{ $t('deposit.rechargeFailed') }}
                    </p>
                    <p v-if='orderResult.remark' class='tip-1'>
                        {{ $t('deposit.failureReason') }}：{{ orderResult.remark }}
                    </p>
                    <div class='btn-group'>
                        <button class='btn-1' @click='goService'>
                            {{ $t('common.serivce') }}
                        </button>
                        <button class='btn-2' @click='pageModule = 1'>
                            {{ $t('deposit.againRecharge') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 补充资料弹窗 -->
    <van-popup v-if='!isEmpty(appendMap)' v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%', width: '80%' }">
        <div class='append-wrap'>
            <p class='title'>
                {{ $t('deposit.appendFiled') }}
            </p>
            <p class='appendVisDesc'>
                {{ $t('deposit.appendVisDesc') }}
            </p>
            <van-cell-group inset>
                <van-field
                    v-for='(item, key) in paymentInfo.extend'
                    :key='key'
                    v-model='appendMap[key].value'
                    :data='item'
                    :label='item[lang]'
                    label-width='70'
                    :placeholder="$t('common.input') + item[lang]"
                    :required='true'
                />
            </van-cell-group>
            <van-button class='btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>

    <!-- 存款时间弹窗 -->
    <time-dialog v-model='timeShow' :time-list='timeList' />

    <!-- 支付表单 -->
    <form id='payForm' :action='despositResult.url' class='payForm' method='post'>
        <input
            v-for='(value, key) in JSON.parse(despositResult.data)'
            :key='key'
            :name='key'
            type='text'
            :value='value'
        />
    </form>

    <!-- 购买资产列表 -->
    <assetsList
        v-if='currencyShowMenu && accountList.length > 0'
        :account-list='accountList'
        :currency='currency'
        :show='currencyShowMenu'
        :title="$t('deposit.youReceive')"
        @update:currency='updateCurrency'
        @update:show='currencyShowMenu = false'
    />

    <!-- 支付资产币种 -->
    <assetsList
        v-if='paymentShowMenu && paymentCurrencyList.length > 0'
        :account-list='paymentCurrencyList'
        :currency='paymentCurrency'
        :show='paymentShowMenu'
        :title="$t('deposit.youPay')"
        @update:currency='updatePaymentCurrency'
        @update:show='paymentShowMenu = false'
    />

    <!-- 链名称列表 -->
    <assetsList
        v-if='chainShowMenu && chainList.length > 0'
        :account-list='chainList'
        :currency='chainName'
        :flex='1'
        :show='chainShowMenu'
        :title="$t('deposit.depositNework')"
        @update:currency='updateChainName'
        @update:show='chainShowMenu = false'
    />
</template>

<script>
import { toRefs } from 'vue'
import useMethods from '@plans/hooks/useMethods'
import { useExchange, showExplain } from '@/hooks/deposit'
import { isEmpty } from '@/utils/util'
import currencyIcon from '@/components/currencyIcon'
import assetsList from '@/themeCommon/components/assetsList/assetsList.vue'
import timeDialog from './time-dialog.vue'
import timeTips from './time-tips.vue'
import popoverTips from '@/components/popover-tips.vue'

export default {
    components: {
        currencyIcon,
        assetsList,
        timeDialog,
        timeTips,
        popoverTips
    },
    setup () {
        const { toOrderPriority } = useMethods()
        const {
            state,
            style,
            buyPlaceholder,
            showBuyTip,
            isNext,
            businessConfig,
            toggleBuyMenu,
            togglePaymentMenu,
            toggleChainMenu,
            clearInput,
            inputAmount,
            inputExpectedAmount,
            handleDeposit,
            goService,
            goAssets,
            onRefresh,
            handleAppendField,
            timingQueryDepositResult
        } = useExchange()

        // 打开气泡弹窗提示
        const openPopoverTip = () => {
            if (isEmpty(state.amount)) {
                state.showPopoverTip = true
            }
        }

        // 更新购买币种
        const updateCurrency = (item) => {
            state.currency = item.currency
            state.currencyShowMenu = false
        }

        // 更新支付币种
        const updatePaymentCurrency = (item) => {
            state.paymentCurrency = item.currency
            state.paymentShowMenu = false
        }

        // 更新链名称
        const updateChainName = (item) => {
            state.chainName = item.currency
            state.chainShowMenu = false
        }

        return {
            isEmpty,
            ...toRefs(state),
            toOrderPriority,
            style,
            buyPlaceholder,
            showBuyTip,
            isNext,
            businessConfig,
            toggleBuyMenu,
            togglePaymentMenu,
            toggleChainMenu,
            clearInput,
            inputAmount,
            inputExpectedAmount,
            handleDeposit,
            goService,
            goAssets,
            onRefresh,
            handleAppendField,
            updateCurrency,
            updatePaymentCurrency,
            updateChainName,
            timingQueryDepositResult,
            showExplain,
            openPopoverTip
        }
    }
}
</script>

<style lang="scss" scoped>
.module-case {
    padding: rem(50px) rem(30px);
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-radius: rem(16px);
}
.module-not {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(150px) 0;
    background-color: var(--contentColor);
    img {
        width: rem(200px);
        height: rem(200px);
    }
    span {
        margin-top: rem(30px);
        font-size: rem(42px);
    }
}

// 待购买
.module-handle {
    .block {
        margin-bottom: rem(70px);
        position: relative;
        font-size: rem(32px);
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    .block-label {
        margin-bottom: rem(16px);
        span {
            color: var(--color);
        }
        .info {
            margin-left: rem(8px);
            color: var(--minorColor);
            cursor: pointer;
        }
    }
    .block-box {
        display: flex;
        align-items: center;
        height: rem(96px);
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: rem(10px);
        position: relative;
        &:hover {
            border: 1px solid var(--primary);
        }
        .import {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;
            height: 100%;
            padding-left: rem(20px);
            .van-cell {
                padding: 0;
                font-size: rem(32px);
                width: 100%;
                &::after {
                    content: none;
                }
            }
            input {
                width: 100%;
                height: 100%;
                font-size: rem(30px);
            }
            .clear {
                margin: rem(-6px) rem(10px) 0;
                color: var(--minorColor);
                font-size: rem(36px);
                cursor: pointer;
            }
        }
        .select {
            display: flex;
            align-items: center;
            width: rem(220px);
            height: 100%;
            padding: 0 rem(20px);
            border-left: 1px solid var(--lineColor);
            cursor: pointer;
            &:deep(.currencyIcon) {
                margin-right: rem(12px);
                border: 1px solid var(--lineColor);
                border-radius: 50%;
            }
            span {
                flex: 1;
                margin-right: rem(12px);
                margin-top: rem(6px);
                font-size: rem(28px);
            }
            .arrow {
                transition: 0.15s;
                margin-top: rem(-4px);
            }
            &.show {
                .arrow {
                    margin-top: rem(4px);
                    transform: rotate(180deg);
                }
            }
        }
        .select-flex {
            width: 100%;
        }
    }
    .block-tip {
        display: flex;
        align-items: flex-start;
        width: 100%;
        position: absolute;
        top: rem(160px);
        font-size: rem(24px);
        &.red {
            color: red;
        }
        .warning {
            margin-right: rem(6px);
        }
    }
    .handle {
        margin-top: rem(120px);
    }
    .handle-relative {
        position: relative;
    }
    .handle-conversion {
        margin-bottom: rem(24px);
        text-align: center;
        font-size: rem(24px);
    }
    .handle-next {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: rem(96px);
        font-size: rem(32px);
        border-radius: rem(10px);
        transition: ease-in-out 0.15s;
        &.disable {
            background-color: var(--primary);
            opacity: 0.3;
            color: #FFF;
        }
        &.default {
            @include hover();
            background-color: var(--primary);
            color: #FFF;
            cursor: pointer;
        }
    }
    .handle-tip {
        text-align: center;
        font-size: rem(24px);
        margin: rem(20px) auto 0 auto;
        max-width: 260px;
    }
}

// 支付结果
.module-result {
    padding: 0;
    .state {
        margin-top: rem(30px);
        font-size: rem(42px);
    }
    .tip-1 {
        margin-top: rem(4px);
        span {
            color: var(--primary);
            cursor: pointer;
        }
    }
    .tip-2 {
        margin-top: rem(40px);
        padding: rem(30px) rem(60px);
        background-color: var(--bgColor);
        border: 1px solid var(--lineColor);
        border-radius: rem(12px);
        span {
            color: var(--primary);
            cursor: pointer;
        }
    }
    .btn-group {
        display: flex;
        margin-top: rem(60px);
        button {
            @include hover();
            display: flex;
            justify-content: center;
            align-items: center;
            width: rem(300px);
            height: rem(90px);
            font-size: rem(30px);
            cursor: pointer;
            border-radius: rem(12px);
            &.btn-1 {
                color: var(--color);
                background: var(--bgColor);
                border: 1px solid var(--lineColor);
                margin-right: rem(40px);
            }
            &.btn-2 {
                background: var(--primary);
                color: #FFF;
            }
        }
    }
    :deep {
        .van-icon {
            font-size: rem(120px);
        }
    }
}
// 待支付
.module-result-unpaid {
    display: flex;
    flex-direction: column;
    align-items: center;
    .state {
        color: var(--color);
    }
    :deep {
        .van-icon-todo-list {
            color: var(--normalColor);
        }
    }
}
// 购买成功
.module-result-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    .state {
        color: rgb(0, 204, 0);
    }
    :deep {
        .van-icon-checked {
            color: rgb(0, 204, 0);
        }
    }
}
// 购买失败
.module-result-fail {
    display: flex;
    flex-direction: column;
    align-items: center;
    .state {
        color: rgb(255, 0, 0);
    }
    :deep {
        .van-icon-clear {
            color: rgb(255, 0, 0);
        }
    }
}

// 补充资料弹窗
.append-popup {
    .append-wrap {
        text-align: center;
        .title {
            padding: rem(60px) 0;
            color: var(--color);
            font-size: rem(32px);
            text-align: center;
        }
        .appendVisDesc {
            padding: 0 rem(50px) rem(40px);
            text-align: left;
        }
        .btn {
            width: 80%;
            margin: rem(50px) auto;
        }
    }
}

// 支付表单
.payForm {
    position: fixed;
    bottom: -100%;
    width: 100%;
    padding: 0 rem(30px);
    background: var(--contentColor);
    opacity: 0;
    input {
        width: 100%;
        height: rem(50px);
    }
}
</style>
