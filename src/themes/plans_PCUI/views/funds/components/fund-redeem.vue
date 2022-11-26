<template>
    <div class='handle-module'>
        <div class='block'>
            <p class='title'>
                {{ $t('fundInfo.youPay') }}
            </p>
            <div class='box-bg'>
                <div class='box'>
                    <label class='label'>
                        <CurrencyIcon :currency='fund.shareTokenCode' :size='24' />
                        <span class='name'>
                            {{ fund.shareTokenCode }}
                        </span>
                    </label>
                    <span class='line'></span>
                    <el-input
                        v-model='amountPay'
                        clearable
                        :disabled='fund.canRedemption !== 1 || !customerInfo'
                        :placeholder='payPlaceholder'
                        type='number'
                        @input='onInput'
                    />
                </div>
            </div>
        </div>
        <!-- 切换 -->
        <div class='switch-block'>
            <div class='switch'>
                <img alt='' class='switch-icon' src='/images/transfer.png' srcset='' @click='switchWay' />
                <div class='line'></div>
            </div>

            <div class='switch-text'>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.rate') }}:
                    </span>
                    <span v-if='activeAssets.redemptionFeeProportion' class='muted'>
                        {{ mul(activeAssets.redemptionFeeProportion, 100) }}%
                    </span>
                </p>
                <p>
                    <span class='muted'>
                        1 {{ fund.shareTokenCode }} =
                    </span>
                    <span class='muted'>
                        {{ fund.netValue }}{{ fund.currency }}
                    </span>
                </p>
            </div>
        </div>
        <div class='block'>
            <p class='title'>
                <!-- {{ $t('fundInfo.redeemAssets') }} -->
                {{ $t('fundInfo.wantGet') }}
                <van-icon class='icon-question' name='question-o' size='14' @click='currencyExplainShow=true' />
            </p>
            <div class='box-bg'>
                <el-popover
                    v-model:visible='popoverVis'
                    placement='bottom'
                    popper-class='popover-select'
                    trigger='click'
                    :width='328'
                >
                    <template #reference>
                        <div class='pay-bar'>
                            <div class='left'>
                                <CurrencyIcon :currency='activeCurrency' :size='24' />
                                <div class='text'>
                                    <p class='currenct'>
                                        {{ activeCurrency === 'self' ? $t("fundInfo.basketAssets") : activeCurrency }}
                                    </p>
                                    <p v-if="activeCurrency === 'self'">
                                        {{ $t('fundInfo.redeemCountTip',{ count: fundAssetsList.length }) }}
                                    </p>
                                </div>
                            </div>
                            <van-icon name='arrow-down' />
                        </div>
                    </template>
                    <div class='select-wrap'>
                        <div
                            v-for='(item, index) in selectActions'
                            :key='index'
                            class='select-option'
                            :label='item.currencyCode === "self" ? $t("fundInfo.basketAssets"): item.currencyCode'
                            :value='item.currencyCode'
                        >
                            <div v-if="item.currencyCode === 'self'" :class="['asset-item', { 'item-active': item.currencyCode === activeCurrency }]" @click='selectAssets(item.currencyCode)'>
                                <div class='top'>
                                    <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                </div>
                                <div>
                                    <p class='currency-text'>
                                        {{ $t('fundInfo.basketAssets') }}
                                    </p>
                                    <p class='mute'>
                                        {{ $t('fundInfo.getBasketAssets') }}
                                    </p>
                                    <div class='asset-list'>
                                        <currencyIcon
                                            v-for='(elem, i) in fundAssetsList'
                                            :key='i'
                                            :currency='elem.currencyCode'
                                            size='24'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-else :class="['asset-item', { 'item-active': item.currencyCode === activeCurrency }]" @click='selectAssets(item.currencyCode)'>
                                <div class='top'>
                                    <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                </div>
                                <div>
                                    <p class='currency-text'>
                                        {{ item.currencyCode }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-popover>

                <!-- <div class='box'>
                    <el-select
                        v-model='activeCurrency'
                        :placeholder="$t('fundInfo.redeemAssets')"
                        @change='selectAssets'
                    >
                        <template #prefix>
                            <CurrencyIcon :currency='activeCurrency' :size='24' />
                        </template>
                        <el-option
                            v-for='(item, index) in selectActions'
                            :key='index'
                            :label='item.currencyCode === "self" ? $t("fundInfo.basketAssets") : item.currencyCode'
                            :value='item.currencyCode'
                        >
                            <div v-if="item.currencyCode === 'self'" class='asset-item'>
                                <div class='top'>
                                    <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                    <span class='currency-text'>
                                        {{ $t('fundInfo.basketAssets') }}
                                    </span>
                                </div>
                                <div class='asset-list'>
                                    <p> {{ $t('fundInfo.getBasketAssets') }}</p>
                                    <currencyIcon
                                        v-for='(elem, i) in fundAssetsList'
                                        :key='i'
                                        class='icon-asset'
                                        :currency='elem.currencyCode'
                                    />
                                </div>
                            </div>
                            <div v-else class='asset-item'>
                                <div class='top'>
                                    <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                    <span class='currency-text'>
                                        {{ item.currencyCode }}
                                    </span>
                                </div>
                            </div>
                        </el-option>
                    </el-select>
                </div>
                <p v-if="activeCurrency === 'self'" class='desc'>
                    {{ $t('fundInfo.redeemCountTip',{ count: fundAssetsList.length }) }}
                </p> -->
            </div>
            <div class='pay-wrap'>
                <p class='title'>
                    {{ $t('fundInfo.expectedGetAssets') }}
                </p>
                <!-- 一篮子资产 -->
                <div v-if="activeCurrency === 'self'" class='redeem-assets'>
                    <div v-for='(item, index) in fundAssetsList' :key='index' class='redeem-asset-item'>
                        <currencyIcon
                            :currency='item.currencyCode'
                            size='30'
                        />
                        <p class='currency'>
                            {{ item.currencyCode }}
                        </p>
                        <p class='percent'>
                            {{ item.weight }}
                        </p>
                    </div>
                </div>
                <!-- 单资产 -->
                <div v-else class='redeem-type'>
                    <div class='header'>
                        <span> {{ $t('trade.asset') }} </span>
                        <span> {{ $t('fundInfo.expectedGetAmount') }}</span>
                    </div>
                    <ul class='content'>
                        <li>
                            <div class='c-left'>
                                <currencyIcon
                                    :currency='activeCurrency'
                                    size='18'
                                />
                                <span class='currency-text'>
                                    {{ activeCurrency }}
                                </span>
                            </div>
                            <div class='c-right'>
                                <span> {{ $t('fundInfo.t2Tip1') }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="activeCurrency === 'self'" class='notice'>
                    {{ $t('fundInfo.t2Tip2') }}
                </div>
            </div>
        </div>
        <!-- 已登录 -->
        <div v-if='isLogin'>
            <div
                v-loading='loading'
                :class="{ 'handle-button': true, 'disable': fund.canRedemption !== 1 }"
                @click='submitHandler'
            >
                <span>{{ fund.canRedemption === 1 ? $t('fundInfo.sell') : $t('fundInfo.disabledSell') }}</span>
                <em></em>
                <span v-if='fund.canRedemption === 1'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <p class='rules-link'>
                <span @click='openRedeemRecords'>
                    {{ $t('fundInfo.redeemRecords') }}
                </span>
                <span @click='openRules'>
                    {{ $t('fundInfo.redeemRules') }}
                </span>
            </p>
        </div>
        <!-- 未登录 -->
        <div v-if='!isLogin' class='handle-not'>
            <button class='register-btn' @click="router.push('/register')">
                {{ $t('c.register') }}
            </button>
            <button class='login-btn' @click="router.push('/login')">
                {{ $t('c.login') }}
            </button>
        </div>
    </div>

    <!-- 赎回规则弹窗 -->
    <redeemRulesDialog ref='redeemRulesDialogRef' />

    <!-- 资产说明弹窗 -->
    <CurrencyExplainDialog
        v-model:show='currencyExplainShow'
        :currency='activeCurrency'
        direction='sell'
        :fund='fund'
        :fund-assets-list='fundAssetsList'
        :list='selectActions'
    />
</template>

<script setup>
import CurrencyExplainDialog from './currency-explain-dialog.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import redeemRulesDialog from './redeem-rules-dialog.vue'
import { computed, unref, ref, defineProps, inject, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { orderHook } from '../hooks.js'
import { limitNumber, limitDecimal, toFixed, mul } from '@/utils/calculation'
import { getCookie } from '@/utils/util.js'

const emit = defineEmits(['switchDirection'])
const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
const changeShowModel = inject('changeShowModel')

// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 当前语言
const lang = getCookie('lang')
// 组件ref
const redeemRulesDialogRef = ref(null)
const currencyExplainShow = ref(false)
const popoverVis = ref(false)

const {
    accountList,
    loading,
    submitFundRedeem,
    selectActions,
    onSelect,
    activeCurrency,
    isLogin,
    calcApplyShares,
    fundAssetsList,
    lastAssetsPay,
    activeAssets,
    queryFundNetValue

} = orderHook({ fund: props.fund, direction: 'sell' })

const fundAccount = computed(() => accountList.value?.find(el => el.currency === props.fund?.shareTokenCode))
const redeemFeeRate = computed(() => {
    return toFixed(props.fund?.redemptionFeeProportion * 100, 2) + '%'
})

// 赎回份额输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.canRedeemMax') + ' ' + (fundAccount.value?.available || 0)
    return text
})
const amountPay = ref('')

// 输入事件控制
const onInput = (value) => {
    queryFundNetValue()
    const newval = limitNumber(value)
    amountPay.value = newval
    const digits = fundAccount.value?.digits || 0
    amountPay.value = limitDecimal(newval, digits)
}

// 提交申购或者赎回
const submitHandler = () => {
    const fund = props.fund
    if (fund.canRedemption !== 1 || loading.value) return
    submitFundRedeem({
        fundId: parseInt(fund.fundId),
        shares: unref(amountPay),
        currencyCode: unref(activeCurrency),
    }).then(res => {
        if (res?.check && res.check()) {
            amountPay.value = ''
            Dialog.confirm({
                title: t('fundInfo.redeemSubmiteed'),
                message: t('fundInfo.redeemSubmiteedDesc'),
                confirmButtonText: t('fundInfo.records'),
                cancelButtonText: t('fundInfo.iknow'),
            }).then(() => {
                openRedeemRecords()
            }).catch(() => {
                // on cancel
            })
        }
    })
}

// 打开赎回记录
const openRedeemRecords = () => {
    changeShowModel('fundRecord', 'redeem')
}

// 选择资产
const selectAssets = (item) => {
    popoverVis.value = false
    const action = selectActions.value.find(el => el.currencyCode === item)
    onSelect(action)
    queryFundNetValue()
}

// 打开规则弹窗
const openRules = () => {
    const fund = props.fund
    redeemRulesDialogRef.value.open(true, fund.fundId)
}

// 切换申购赎回
const switchWay = () => {
    emit('switchDirection', 'apply')
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handle-module {
    .block {
        margin-bottom: 10px;
        &:nth-of-type(2) {
            margin-bottom: 0;
        }
        .title {
            margin-bottom: 8px;
            color: var(--minorColor);
            font-size: 14px;
            .icon-question {
                cursor: pointer;
            }
        }
        .box-bg {
            background: #F4F4F4;
            .box {
                display: flex;
                align-items: center;
                height: 70px;
                background: var(--assistColor);
                border-radius: 5px;
                .line {
                    width: 1px;
                    height: 30px;
                    background: var(--lineColor);
                }
                .label {
                    display: inline-flex;
                    align-items: center;
                    width: 120px;
                    height: 100%;
                    padding: 0 12px;
                    .name {
                        margin-left: 5px;
                    }
                }
                .value {
                    display: inline-flex;
                    flex: 1;
                    align-items: center;
                    height: 100%;
                    padding: 0 15px;
                }
            }
            .desc {
                padding: 0 0 8px 15px;
                color: var(--minorColor);
            }
            .pay-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 70px;
                margin-bottom: 20px;
                padding: 0 15px;
                background: var(--assistColor);
                border-radius: 5px;
                cursor: pointer;
                .left {
                    display: flex;
                    align-items: center;
                    .text {
                        margin-left: 10px;
                        .currenct {
                            color: var(--color);
                            font-weight: bold;
                        }
                    }
                }
                &:hover {
                    //border: solid 1px var(--primary);
                }
            }
        }
        &:deep {
            .el-select {
                width: 100%;
                .el-input__inner {
                    padding-left: 40px !important;
                }
                .currencyIcon {
                    margin-left: 5px;
                }
            }
            .el-input {
                flex: 1;
                line-height: 50px;
            }
            .el-input__inner {
                height: 50px;
                text-align: right;
            }
            .is-disabled .el-input__inner {
                background: none !important;
            }
        }
        .pay-wrap {
            margin: 15px 0;
            padding: 15px 0;
            background: var(--contentColor);
            .title {
                color: var(--color);
                font-weight: bold;
                font-size: 15px;
                text-align: center;
            }
            .redeem-type {
                overflow: hidden;
                .header {
                    display: flex;
                    justify-content: space-between;
                    margin: rem(30px) 0;
                }
                .content {
                    margin: rem(30px) 0;
                    li {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: rem(30px);
                        .c-left {
                            display: flex;
                            align-items: center;
                            height: 100%;
                            .currency-text {
                                margin-top: rem(4px);
                                margin-left: rem(10px);
                                font-weight: bold;
                            }
                        }
                        .c-right {
                            display: flex;
                            align-items: center;
                            text-align: right;
                            .icon_success {
                                margin-left: rem(20px);
                                color: var(--success);
                                font-size: rem(28px);
                            }
                            .icon_icon_assets {
                                margin-left: rem(20px);
                                color: var(--primary);
                                font-size: rem(28px);
                            }
                            .van-icon {
                                position: relative;
                                top: -2px;
                                display: inline-block;
                                margin-left: rem(20px);
                                vertical-align: -12%;
                            }
                            .error-text {
                                color: var(--warn);
                            }
                            .cr-inline {
                                display: inline-block;
                            }
                        }
                    }
                }
            }
            .redeem-assets {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                .redeem-asset-item {
                    flex: 1;
                    width: calc((100% - 20px) / 3);  // 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
                    min-width: calc((100% - 20px) / 3); // 加入这两个后每个item的宽度就生效了
                    max-width: calc((100% - 20px) / 3);
                    margin-right: 10px;
                    margin-bottom: 10px;
                    padding: 13px 0;
                    text-align: center;
                    background-color: var(--contentColor);
                    border: solid 1px var(--lineColor);
                    border-radius: 10px;
                    &:nth-child(3n) { // 去除第3n个的margin-right
                        margin-right: 0;
                    }
                    .currency {
                        margin: 5px 0 3px;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    .percent {
                        font-size: 10px;
                    }
                }
            }
            .notice {
                padding: 0 15px;
                color: var(--minorColor);
                .toRule {
                    color: var(--primary);
                    text-decoration: underline;
                }
            }
        }
    }
    .switch-block {
        display: flex;
        align-items: center;
        margin: 20px 0;
        .switch {
            position: relative;
            .line {
                position: absolute;
                top: -15px;
                right: 25px;
                z-index: 0;
                height: 60px;
                border-right: 1px dashed var(--placeholdColor);
            }
        }
        .switch-icon {
            position: relative;
            z-index: 1;
            width: 28px;
            height: 28px;
            margin-right: 10px;
            color: var(--primary);
            font-size: 30px;
            cursor: pointer;
        }
        .switch-text {
            p {
                line-height: 1.6;
            }
        }
    }
    .handle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        margin-top: 30px;
        color: #FFF;
        font-size: 14px;
        background: var(--primary);
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
        &.disable {
            background: var(--lineColor);
            &:hover {
                opacity: 1;
            }
        }
        em {
            margin-right: 4px;
        }
    }
    .handle-not {
        margin-top: 30px;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 50px;
            margin-bottom: 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            &.register-btn {
                color: #FFF;
                background: var(--primary);
            }
            &.login-btn {
                color: var(--primary);
                background: var(--lineColor);
            }
        }
    }
    .rules-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        span {
            color: var(--primary);
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
.el-select-dropdown__item,
.select-wrap {
    padding: 0;
    .asset-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 15px;
        background: var(--contentColor);
        cursor: pointer;
        .currencyIcon {
            margin-right: -5px;
        }
        .currency-text {
            font-weight: bold;
        }
        .mute {
            color: var(--placeholdColor);
        }
        .top {
            width: 24px;
            margin-right: 10px;
        }
        .asset-list {
            margin-top: 15px;
        }
    }
    .item-active {
        border: 1px solid var(--primary);
    }
}
.el-select-dropdown__item {
    height: auto;
    overflow: auto;
}
</style>
