<template>
    <!-- 不在存款时间内 -->
    <time-tips v-if='showTimeTip' :time-list='timeList' />
    <!-- 充值操作 -->
    <div v-else class='module-content'>
        <div class='module-case'>
            <div class='module-handle'>
                <div class='block first-block'>
                    <p class='block-label'>
                        <span>{{ $t('deposit.rechargeCurrency') }}</span>
                        <van-icon class='info' name='info' @click="showExplain($t('deposit.rechargeCurrencyTip'))" />
                    </p>
                    <div class='block-box'>
                        <div :class="['select', currencyShowMenu ? 'show' : 'hide']" @click.stop='toggleBuyMenu'>
                            <currency-icon v-if='paymentInfo' :currency='currency' :size='24' />
                            <span>{{ currency }}</span>
                            <van-icon class='arrow' name='arrow-down' />
                        </div>
                    </div>
                </div>
                <div class='block second-block'>
                    <p class='block-label'>
                        <span>{{ $t('deposit.rechargeNework') }}</span>
                        <van-icon class='info' name='info' @click="showExplain($t('deposit.rechargeNeworkTip'))" />
                    </p>
                    <div class='block-box'>
                        <div :class="['select', paymentShowMenu ? 'show' : 'hide']" @click.stop='togglePaymentMenu'>
                            <span>{{ chainName }}</span>
                            <van-icon class='arrow' name='arrow-down' />
                        </div>
                    </div>
                    <p class='block-tip'>
                        <van-icon name='warning' :size='14' />
                        <span>{{ $t('deposit.selectNeworkTip') }}</span>
                    </p>
                </div>
                <div>
                    <p class='address-title'>
                        {{ $t('deposit.sendAddress') }}
                    </p>
                    <!-- 复制地址 -->
                    <div v-if='address' class='address-box'>
                        <p class='text'>
                            {{ address }}
                        </p>
                        <button
                            id='copy'
                            ref='copy'
                            class='copy'
                            :data-clipboard-text='address'
                            @click='copyAddress'
                            @mouseenter='copyAddress'
                        >
                            {{ $t('common.copy') }}
                        </button>
                    </div>
                    <!-- 有地址 -->
                    <div v-if='address' class='have-address'>
                        <p class='tip'>
                            {{ $t('deposit.scanTip') }}
                        </p>
                        <div class='qr-code'>
                            <div ref='qrCode' class='qrcode'></div>
                        </div>
                        <div class='warn-box'>
                            <p v-html="$t('deposit.addressTip1', { singleLowAmount: accountInfo.singleLowAmount, currency })"></p>
                            <p v-html="$t('deposit.addressTip2', { currency })"></p>
                            <p v-html="$t('deposit.addressTip3', { chainName })"></p>
                        </div>
                    </div>
                    <!-- 无地址 -->
                    <div v-else class='none-address'>
                        <p class='tip' v-html="$t('deposit.noneAddressTip', { currency })"></p>
                        <button class='get' @click='applyBindAddress'>
                            {{ $t('deposit.getAddress') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 充值资产列表 -->
    <assetsList
        v-if='currencyShowMenu && accountList.length > 0'
        :account-list='accountList'
        :currency='currency'
        :hidden-title='true'
        :show='currencyShowMenu'
        @update:currency='updateCurrency'
        @update:show='currencyShowMenu = false'
    />

    <!-- 链名称列表 -->
    <select-chain-dialog
        v-if='paymentShowMenu && chainList.length > 0'
        :account-list='chainList'
        :currency='chainName'
        :hidden-title='true'
        :show='paymentShowMenu'
        @update:currency='updatePaymentCurrency'
        @update:show='paymentShowMenu = false'
    />

    <!-- 存款时间弹窗 -->
    <time-dialog v-model='timeShow' :time-list='timeList' />

    <!-- 地址弹窗 -->
    <van-dialog v-model:show='addressShow' :confirm-button-text="$t('common.know')" :title="$t('withdraw.hint')">
        <div class='dialog-wrap'>
            <p v-html="$t('deposit.addressDialogTip', { currency, singleLowAmount: accountInfo.singleLowAmount })"></p>
        </div>
    </van-dialog>
</template>

<script>
import { toRefs } from 'vue'
import { useDirect, showExplain } from '@/hooks/deposit'
import currencyIcon from '@/components/currencyIcon'
import assetsList from '@/themeCommon/components/assetsList/assetsList.vue'
import selectChainDialog from './select-chain-dialog.vue'
import timeDialog from './time-dialog.vue'
import timeTips from './time-tips.vue'

export default {
    components: {
        currencyIcon,
        assetsList,
        selectChainDialog,
        timeDialog,
        timeTips
    },
    setup () {
        const {
            state,
            copyAddress,
            getRechargeAddress,
            applyBindAddress,
            qrCode,
            copy,
            toggleBuyMenu,
            togglePaymentMenu
        } = useDirect()

        // 更新充值币种
        const updateCurrency = (item) => {
            state.currency = item.currency
            state.currencyShowMenu = false
        }

        // 更新链名称
        const updatePaymentCurrency = (item) => {
            state.chainName = item.currency
            state.paymentShowMenu = false
        }

        return {
            ...toRefs(state),
            copyAddress,
            getRechargeAddress,
            applyBindAddress,
            qrCode,
            copy,
            toggleBuyMenu,
            togglePaymentMenu,
            updateCurrency,
            updatePaymentCurrency,
            showExplain
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

// 充值操作
.module-handle {
    .block {
        position: relative;
        font-size: rem(30px);
    }
    .first-block {
        margin-bottom: rem(70px);
    }
    .second-block {
        margin-bottom: rem(30px);
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
        .select {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0 rem(30px);
            cursor: pointer;
            span {
                flex: 1;
                margin: 0 rem(12px);
                margin-top: rem(6px);
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
    }
    .block-tip {
        display: flex;
        margin-top: rem(12px);
        font-size: rem(24px);
        color: red;
        &:deep {
            .van-icon-warning {
                margin-top: rem(-2px);
                margin-right: rem(8px);
            }
        }
    }
    .address-title {
        text-align: center;
    }
    .address-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(25px);
        margin-top: rem(10px);
        background: var(--assistColor);
        border-radius: rem(10px);
        .text {
            text-align: center;
            line-height: rem(32px);
            word-break: break-all;
            font-size: rem(24px);
            color: var(--color);
        }
        .copy {
            font-size: rem(28px);
            font-weight: bold;
            color: var(--primary);
            background: none;
            cursor: pointer;
        }
    }
    .have-address {
        padding: rem(60px);
        margin-top: rem(20px);
        background-color: var(--bgColor);
        border-radius: rem(12px);
        .tip {
            line-height: 1.5;
            text-align: center;
        }
        .qr-code {
            display: flex;
            justify-content: center;
            margin: rem(24px) auto 0;
            position: relative;
        }
        .warn-box {
            margin-top: rem(40px);
            p {
                line-height: 1.5;
                font-size: rem(26px);
                color: var(--color);
                b {
                    margin-left: rem(6px);
                    color: red;
                }
            }
        }
    }
    .none-address {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: rem(60px);
        margin-top: rem(20px);
        background-color: var(--bgColor);
        border-radius: rem(12px);
        .tip {
            line-height: 1.5;
            text-align: center;
        }
        .get {
            @include hover();
            display: flex;
            justify-content: center;
            align-items: center;
            width: rem(250px);
            height: rem(80px);
            margin-top: 20px;
            font-size: rem(30px);
            color: #FFF;
            background: var(--primary);
            border-radius: rem(10px);
            cursor: pointer;
        }
    }
}

// 充值记录
.module-record {
    margin-top: 8px;
}
.dialog-wrap {
    line-height: 1.2;
    padding: rem(20px) rem(30px) rem(50px);
    font-size: rem(28px);
    p {
        margin-bottom: rem(10px);
        b {
            color: red;
        }
    }
}
</style>
