<template>
    <div class='module-content'>
        <div class='module-case'>
            <!-- 不在存款时间内 -->
            <time-tips v-if='showTimeTip' :time-list='timeList' />
            <!-- 充值操作 -->
            <template v-else>
                <!-- 待购买 -->
                <div v-if='pageModule === 1' class='module-handle'>
                    <div class='block'>
                        <p class='block-label'>
                            <span>{{ $t('deposit.youReceive') }}</span>
                            <van-icon class='info' name='info' @click="showExplain($t('deposit.youReceiveTip'))" />
                        </p>
                        <div class='block-box'>
                            <div class='import'>
                                <input
                                    v-model='amount'
                                    class='pc_deposit_receive_input_ga'
                                    :placeholder='buyPlaceholder'
                                    type='number'
                                    @DOMMouseScroll='stopScrollFun'
                                    @input='inputAmount'
                                    @mousewheel='stopScrollFun'
                                />
                                <van-icon v-if='amount' class='clear' name='clear' @click='clearInput' />
                            </div>
                            <div :class="['select', currencyShowMenu ? 'show' : 'hide']" @click.stop='toggleBuyMenu'>
                                <currency-icon v-if='currency' :currency='currency' :size='24' />
                                <span>{{ currency }}</span>
                                <van-icon class='arrow' name='arrow-down' />
                            </div>
                            <!-- 下拉菜单组件 -->
                            <dropdown-menu
                                v-if='accountList.length > 0'
                                v-model:currency='currency'
                                v-model:show='currencyShowMenu'
                                :list='accountList'
                                :show-label='true'
                                :top='48'
                            />
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
                                <input
                                    v-model='expectedAmount'
                                    class='pc_deposit_pay_input_ga'
                                    :placeholder="$t('deposit.inputAmount')"
                                    type='number'
                                    @DOMMouseScroll='stopScrollFun'
                                    @input='inputExpectedAmount'
                                    @mousewheel='stopScrollFun'
                                />
                                <van-icon v-if='expectedAmount' class='clear' name='clear' @click='clearInput' />
                            </div>
                            <div :class="['select', paymentShowMenu ? 'show' : 'hide']" @click.stop='togglePaymentMenu'>
                                <currency-icon v-if='paymentCurrency' :currency='paymentCurrency' :size='24' />
                                <span>{{ paymentCurrency }}</span>
                                <van-icon class='arrow' name='arrow-down' />
                            </div>
                            <!-- 下拉菜单组件 -->
                            <dropdown-menu
                                v-if='paymentCurrencyList.length > 0'
                                v-model:currency='paymentCurrency'
                                v-model:show='paymentShowMenu'
                                :list='paymentCurrencyList'
                                :top='48'
                            />
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
                            <!-- 下拉菜单组件 -->
                            <dropdown-menu
                                v-if='chainList.length > 0'
                                v-model:currency='chainName'
                                v-model:show='chainShowMenu'
                                :list='chainList'
                                :show-icon='false'
                                :top='48'
                            />
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
                        <button :class="['handle-next pc_deposit_continue_ga', isNext && !isSubmit ? 'default' : 'disable']" @click='handleDeposit'>
                            <van-loading v-if='isSubmit' />
                            <span v-else>
                                {{ $t('common.continue') }}
                            </span>
                        </button>
                        <!-- <p class='handle-tip'>
                            The pay with card service is provided by ARX, all funds are stored in UnionBank.
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
                                <span>{{ $t('common.loading') }}...</span>
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
            </template>
        </div>
    </div>

    <!-- 补充资料弹窗 -->
    <van-popup v-if='!isEmpty(appendMap)' v-model:show='appendVis' class='append-popup' position='right' :style="{ height: '100%', width: '500px' }">
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
            <van-button class='confirm-btn' size='large' type='primary' @click='handleAppendField'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>

    <!-- 存款时间弹窗 -->
    <time-dialog v-model='timeShow' :time-list='timeList' />

    <!-- 支付表单 -->
    <form id='payForm' :action='despositResult.url' class='payForm' method='post' target='_blank'>
        <input
            v-for='(value, key) in JSON.parse(despositResult.data)'
            :key='key'
            :name='key'
            type='text'
            :value='value'
        />
    </form>
</template>

<script>
import { toRefs } from 'vue'
import useMethods from '@planspc/hooks/useMethods'
import { useExchange, showExplain } from '@/hooks/deposit'
import { isEmpty, stopScrollFun } from '@/utils/util'
import currencyIcon from '@/components/currencyIcon'
import dropdownMenu from '@planspc/components/dropdownMenu'
import timeDialog from './time-dialog.vue'
import timeTips from './time-tips.vue'

export default {
    components: {
        currencyIcon,
        dropdownMenu,
        timeDialog,
        timeTips
    },
    setup () {
        const { toOrderPriority } = useMethods()
        const {
            state,
            style,
            buyPlaceholder,
            showBuyTip,
            isNext,
            depositRecordRef,
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
        } = useExchange()

        return {
            isEmpty,
            stopScrollFun,
            ...toRefs(state),
            toOrderPriority,
            style,
            buyPlaceholder,
            showBuyTip,
            isNext,
            depositRecordRef,
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
            showExplain
        }
    }
}
</script>

<style lang="scss" scoped>
.module-case {
    display: flex;
    justify-content: center;
    padding: 20px 0 40px;
}
.module-not {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: rem(300px) 0;
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
    width: 100%;
    .block {
        margin-bottom: 40px;
        position: relative;
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    .block-label {
        margin-bottom: 8px;
        font-size: 18px;
        span {
            color: var(--color);
        }
        .info {
            margin-left: 4px;
            color: var(--minorColor);
            cursor: pointer;
        }
    }
    .block-box {
        display: flex;
        align-items: center;
        height: 48px;
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: 5px;
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
            padding-left: 15px;
            input {
                width: calc(100% - 40px);
                height: 100%;
                font-size: 18px;
            }
            .clear {
                margin-right: 10px;
                margin-top: -3px;
                color: var(--minorColor);
                font-size: 20px;
                cursor: pointer;
            }
        }
        .select {
            display: flex;
            align-items: center;
            width: 140px;
            height: 100%;
            padding: 0 12px;
            border-left: 1px solid var(--lineColor);
            cursor: pointer;
            .currencyIcon {
                margin-right: 6px;
            }
            span {
                flex: 1;
                margin-right: 6px;
                margin-top: 3px;
            }
            .arrow {
                transition: 0.15s;
                margin-top: -2px;
            }
            &.show {
                .arrow {
                    margin-top: 2px;
                    transform: rotate(180deg);
                }
            }
        }
        .select-flex {
            width: 100%;
            border-left: none;
        }
    }
    .block-tip {
        display: flex;
        width: 100%;
        position: absolute;
        top: 85px;
        font-size: 12px;
        &.red {
            color: red;
        }
        .warning {
            margin-right: rem(6px);
        }
    }
    .handle {
        margin-top: 60px;
    }
    .handle-conversion {
        margin-bottom: 6px;
        text-align: center;
        font-size: 13px;
    }
    .handle-next {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 48px;
        font-size: 16px;
        border-radius: 5px;
        transition: ease-in-out 0.15s;
        &.disable {
            background-color: var(--primaryAssistColor);
            color: var(--color);
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
        font-size: 13px;
        margin: 8px auto;
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
    background-color: var(--bgColor);
    .append-wrap {
        text-align: center;
        //padding: 0 rem(30px);
        background-color: var(--contentColor);
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
        .confirm-btn {
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
