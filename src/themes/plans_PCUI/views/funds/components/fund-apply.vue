<template>
    <div class='handle-module'>
        <div class='block'>
            <p class='title'>
                {{ $t('fundInfo.youPay') }}
                <van-icon class='icon-question' name='question-o' size='14' @click='currencyExplainShow=true' />
            </p>

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
                                    {{ $t('fundInfo.applyCountTip',{ count: fundAssetsList.length }) }}
                                </p>
                                <p v-else>
                                    {{ $t('fundInfo.payCurrencyBuy', { currency: activeCurrency }) }}
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
                                    {{ $t('fundInfo.payBasketBuy') }}
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
                                <p class='mute'>
                                    {{ $t('fundInfo.payCurrencyBuy', { currency: item.currencyCode }) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-popover>
        </div>
        <!-- 切换 -->
        <div class='switch-block'>
            <!-- <i class='switch-icon icon_huidui' @click='switchWay'></i> -->
            <div class='switch'>
                <img alt='' class='switch-icon' src='/images/transfer.png' srcset='' @click='switchWay' />
                <div class='line'></div>
            </div>

            <div class='switch-text'>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.rate') }}:
                    </span>
                    <span v-if='activeAssets.purchaseFeeProportion' class='muted'>
                        {{ mul(activeAssets.purchaseFeeProportion,100) }}%
                    </span>
                </p>
                <p>
                    <span class='muted'>
                        1 {{ fund.shareTokenCode }} =
                    </span>
                    <span class='muted'>
                        {{ sharesNet || fund.netValue }}{{ fund.currency }}
                    </span>
                </p>
            </div>
        </div>

        <div class='block'>
            <p class='title'>
                {{ $t('fundInfo.wantGet') }}
            </p>
            <div class='box'>
                <label class='label'>
                    <CurrencyIcon :currency='fund.shareTokenCode' :size='24' />
                    <span class='name'>
                        {{ fund.shareTokenCode }}
                    </span>
                </label>
                <span class='line'></span>
                <span class='value'>
                    <!-- {{ sharesPlaceholder }} -->
                    <el-input
                        v-model='amountPay'
                        :disabled='fund.canPurchase !== 1 || !customerInfo'
                        :placeholder="$t('fundInfo.inputCount')"
                        size='normal'
                        @input='onInput'
                    />
                </span>
            </div>
        </div>

        <div class='pay-wrap'>
            <p class='title'>
                {{ $t('fundInfo.needAssets') }}
            </p>
            <div class='header'>
                <span> {{ $t('trade.asset') }}</span>
                <span> {{ $t('fundInfo.payCount') }}</span>
            </div>
            <van-loading
                v-if='calcLoading'
                class='loading-block'
                :color='$style.primary'
                size='24'
            />
            <ul class='content'>
                <li v-for='item in lastAssetsPay' :key='item.currencyCode'>
                    <div class='flex'>
                        <div class='c-left'>
                            <currencyIcon
                                :currency='item.currency'
                                size='18'
                            />
                            <span class='currency-text'>
                                {{ item.currency }}
                            </span>
                        </div>
                        <div class='c-right'>
                            <div class='cr-inline'>
                                <span>{{ item.amountPay }}</span>
                            </div>
                            <div v-if='item.isShow' class='cr-icon'>
                                <el-popover
                                    v-if='item.depositAmount > 0'
                                    placement='left'
                                    trigger='hover'
                                    :width='400'
                                >
                                    <template #reference>
                                        <van-icon
                                            class='icon-add'
                                            :color='$style.primary'
                                            name='add'
                                            size='20'
                                            @click='openAddAssets(item)'
                                        />
                                    </template>
                                    <div class='add-wrap'>
                                        <h2> {{ $t('fundInfo.chooseGetAssets') }} </h2>
                                        <div class='type' @click='toDeposit(item)'>
                                            <div class='left'>
                                                <i
                                                    class='icon iconfont icon_icon_assets'
                                                ></i>
                                                <div class='text'>
                                                    <h3> {{ $t('fundInfo.deposit') }}</h3>
                                                    <h5> {{ $t('fundInfo.depositTip') }}</h5>
                                                </div>
                                            </div>
                                            <van-icon name='arrow' />
                                        </div>
                                        <div class='type' @click='toOrderFund(item.currency)'>
                                            <div class='left'>
                                                <img alt='' class='icon trade-icon' src='/images/trade.png' />
                                                <div class='text'>
                                                    <h3> {{ $t('trade.buy') }}</h3>
                                                    <h5> {{ $t('fundInfo.buyTip') }}</h5>
                                                </div>
                                            </div>
                                            <van-icon name='arrow' />
                                        </div>
                                    </div>
                                </el-popover>

                                <van-icon
                                    v-else
                                    :color='$style.placeholdColor'
                                    name='checked'
                                    size='20'
                                />
                            </div>
                        </div>
                    </div>
                    <p v-if='item.isShow && item.depositAmount > 0' class='error-text'>
                        * {{ $t('fundInfo.availableNot') }}  {{ item.depositAmount }}
                    </p>
                </li>
            </ul>
            <div class='notice'>
                {{ $t('fundInfo.applyCalculateTip') }}
            </div>
        </div>

        <!-- 已登录 -->
        <div v-if='isLogin'>
            <div
                v-loading='loading'
                :class="{ 'handle-button': true, 'disable': fund.canPurchase !== 1 }"
                @click='submitHandler'
            >
                <span>{{ fund.canPurchase === 1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}</span>
                <em></em>
                <span v-if='fund.canPurchase === 1'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <p class='rules-link'>
                <span @click='openApplyRecords'>
                    {{ $t('fundInfo.applyRecords') }}
                </span>
                <span @click='openRules'>
                    {{ $t('fundInfo.applyRules') }}
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

    <!-- 申购规则弹窗 -->
    <applyRulesDialog ref='applyRulesDialogRef' />

    <!-- 资产说明弹窗 -->
    <CurrencyExplainDialog
        v-model:show='currencyExplainShow'
        :currency='activeCurrency'
        direction='buy'
        :fund='fund'
        :fund-assets-list='fundAssetsList'
        :list='selectActions'
    />
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import applyRulesDialog from './apply-rules-dialog.vue'
import CurrencyExplainDialog from './currency-explain-dialog.vue'
import { computed, unref, ref, defineProps, inject, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { orderHook } from '../hooks.js'
import { limitNumber, limitDecimal, mul } from '@/utils/calculation'
import { debounce, getCookie } from '@/utils/util'
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
// 最新基金净值
const sharesNet = inject('sharesNet')
const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5)) // 现货玩法的账户列表
// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)

// 选择的币种account
const activeAccount = computed(() => accountList.value.find(el => el.currency === props.currency))

// 组件ref
const applyRulesDialogRef = ref(null)
const currencyExplainShow = ref(false)
// 是否显示新增资产弹窗
const addAssetShow = ref(false)
// 新增资产的货币
const addAssetsCurrency = ref('')
const popoverVis = ref(false)

const {
    loading,
    calcApplyShares,
    submitFundApply,
    selectActions,
    activeCurrency,
    curAccount,
    calcApplyFee,
    calcShares,
    isLogin,
    fundAssetsList,
    lastAssetsPay,
    activeAssets,
    onSelect,
    fund,
    queryFundNetValue,
    calcLoading
} = orderHook({ fund: props.fund, direction: 'buy' })

const amountPay = ref('')

// 输入事件控制
const onInput = value => {
    const newval = limitNumber(value)
    amountPay.value = newval
    const digits = fund.shareTokenDigits || 0
    amountPay.value = limitDecimal(newval, digits)
    inputHandler()
}

// 选择资产
const selectAssets = (item) => {
    popoverVis.value = false
    const action = selectActions.value.find(el => el.currencyCode === item)
    onSelect(action)
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}, 300)

// 提交申购
const submitHandler = () => {
    const fund = props.fund
    if (fund.canPurchase !== 1 || loading.value) return
    submitFundApply({
        fundId: parseInt(fund.fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
        applyType: 2
    }).then(res => {
        if (res.check()) {
            amountPay.value = ''
            calcApplyShares()
            Dialog.confirm({
                title: t('fundInfo.applySuccessed'),
                confirmButtonText: t('fundInfo.records'),
                cancelButtonText: t('fundInfo.iknow'),
            }).then(() => {
                openApplyRecords()
            }).catch(() => {
                // on cancel
            })
        }
    })
}

// 打开申购记录
const openApplyRecords = () => {
    changeShowModel('fundRecord', 'apply')
}

// 打开规则弹窗
const openRules = () => {
    const fund = props.fund
    applyRulesDialogRef.value.open(true, fund.fundId)
}

// 切换申购赎回
const switchWay = () => {
    emit('switchDirection', 'redeem')
}

// 显示添加资产弹窗
const openAddAssets = (item) => {
    addAssetShow.value = true
    addAssetsCurrency.value = item.currency
}

// 跳转到充值页面
const toDeposit = (item) => {
    router.push({
        path: '/assets/depositChoose',
        query: {
            tradeType: 5
        }
    })
}

// 点击前往交易页面的对应产品
const toOrderFund = currency => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === currency && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === currency && el.tradeType === 5)
    }
    if (!product || product.baseCurrency === product.profitCurrency) {
        return Toast(t('fundInfo.noTradeMarket'))
    }
    router.replace(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handle-module {
    .block {
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
                    margin-left: 10px;
                }
            }
            .value {
                display: inline-flex;
                flex: 1;
                align-items: center;
                height: 100%;
                padding: 0 15px;
                :deep(.el-input__inner) {
                    padding: 0 5px 0 0;
                    text-align: right;
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
            }
            .is-disabled .el-input__inner {
                background: none !important;
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
            cursor: pointer;
        }
        .switch-text {
            p {
                line-height: 1.6;
            }
        }
    }
    .pay-wrap {
        position: relative;
        margin: 15px 0;
        padding: 15px 0 0;
        background: var(--contentColor);
        .loading-block {
            position: absolute;
            top: 50%;
            left: 50%;
        }
        .title {
            color: var(--color);
            font-weight: bold;
            font-size: 15px;
            text-align: center;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
        }
        .content {
            margin-bottom: 15px;
            border-bottom: solid 1px var(--lineColor);
            li {
                margin-bottom: 15px;
                .flex {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .c-left {
                        display: flex;
                        align-items: center;
                        height: 100%;
                        .currency-text {
                            margin-top: 2px;
                            margin-left: 5px;
                            font-weight: bold;
                        }
                    }
                    .c-right {
                        display: flex;
                        align-items: center;
                        text-align: right;
                        .icon_success {
                            margin-left: 10px;
                            color: var(--normalColor);
                            font-size: 14px;
                        }
                        .van-icon {
                            margin-left: 10px;
                            &.icon-add {
                                cursor: pointer;
                            }
                        }
                        .cr-inline {
                            display: inline-block;
                        }
                    }
                }
            }
            .error-text {
                color: var(--warn);
                text-align: right;
            }
        }
        .notice {
            color: var(--minorColor);
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
.add-wrap {
    padding: 15px;
    h2 {
        margin: 10px 0 20px;
        text-align: center;
    }
    .type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding: 20px 15px;
        background: var(--bgColor);
        cursor: pointer;
        .left {
            display: flex;
            align-items: center;
            .icon {
                margin-right: 20px;
                font-size: 40px;
                &.icon_icon_assets {
                    color: var(--focusColor);
                }
                &.trade-icon {
                    width: 40px;
                    height: 40px;
                }
            }
            .text {
                h3 {
                    font-weight: bold;
                }
                h5 {
                    color: var(--minorColor);
                }
            }
        }
    }
}
.el-select-dropdown__item {
    height: auto;
    overflow: auto;
}
</style>

<style>
body .popover-select {
    background-color: var(--bgColor) !important;
}
</style>
