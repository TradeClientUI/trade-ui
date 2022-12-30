<template>
    <div class='module-content'>
        <div class='module-case'>
            <!-- 不在存款时间内 -->
            <time-tips v-if='showTimeTip' :time-list='timeList' />
            <!-- 充值操作 -->
            <template v-else>
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
                            <!-- 下拉菜单组件 -->
                            <dropdown-menu
                                v-if='accountList.length > 0'
                                v-model:currency='currency'
                                v-model:show='currencyShowMenu'
                                :list='accountList'
                                :top='48'
                            />
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
                            <!-- 下拉菜单组件 -->
                            <dropdown-menu
                                v-if='chainList.length > 0'
                                v-model:currency='chainName'
                                v-model:show='paymentShowMenu'
                                :list='chainList'
                                :show-icon='false'
                                :top='48'
                            />
                        </div>
                        <p class='block-tip'>
                            <van-icon class='warning' name='warning' :size='14' />
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
                        <div v-if='address' v-loading='loadAddress' class='have-address'>
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
                        <div v-else v-loading='loadAddress' class='none-address'>
                            <p class='tip' v-html="$t('deposit.noneAddressTip', { currency })"></p>
                            <button class='get' @click='applyBindAddress'>
                                {{ $t('deposit.getAddress') }}
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- 存款时间弹窗 -->
    <time-dialog v-model='timeShow' :time-list='timeList' />

    <!-- 地址弹窗 -->
    <van-dialog v-model:show='addressShow' confirm-button-text='Got it' :title="$t('withdraw.hint')">
        <div class='dialog-wrap'>
            <p v-html="$t('deposit.addressDialogTip', { currency, singleLowAmount: accountInfo.singleLowAmount })"></p>
        </div>
    </van-dialog>
</template>

<script>
import { toRefs } from 'vue'
import { useDirect, showExplain } from '@/hooks/deposit'
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

        return {
            ...toRefs(state),
            copyAddress,
            getRechargeAddress,
            applyBindAddress,
            qrCode,
            copy,
            toggleBuyMenu,
            togglePaymentMenu,
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

// 充值操作
.module-handle {
    width: 100%;
    .block {
        position: relative;
        font-size: 16px;
    }
    .first-block {
        margin-bottom: 40px;
    }
    .second-block {
        margin-bottom: 20px;
    }
    .block-label {
        line-height: 1;
        margin-bottom: 12px;
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
        und-colozr: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: 5px;
        position: relative;
        &:hover {
            border: 1px solid var(--primary);
        }
        .select {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0 15px;
            cursor: pointer;
            span {
                flex: 1;
                margin: 0 6px;
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
    }
    .block-tip {
        display: flex;
        margin-top: 6px;
        font-size: 12px;
        color: red;
        .warning {
            margin-right: rem(6px);
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
        background: var(--bgColor);
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
        padding: 30px;
        margin-top: 10px;
        background-color: var(--bgColor);
        border-radius: 6px;
        .tip {
            text-align: center;
        }
        .qr-code {
            display: flex;
            justify-content: center;
            margin: 12px auto 0;
            position: relative;
        }
        .warn-box {
            margin-top: 20px;
            p {
                line-height: 1.5;
                font-size: 13px;
                color: var(--color);
                b {
                    margin-left: 3px;
                    color: red;
                }
            }
        }
    }
    .none-address {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        margin-top: 10px;
        background-color: var(--bgColor);
        border-radius: 6px;
        .tip {
            text-align: center;
        }
        .get {
            @include hover();
            display: flex;
            justify-content: center;
            align-items: center;
            width: rem(260px);
            height: rem(88px);
            margin-top: 12px;
            font-size: rem(30px);
            color: #FFF;
            background: var(--primary);
            border-radius: rem(10px);
            cursor: pointer;
        }
    }
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
