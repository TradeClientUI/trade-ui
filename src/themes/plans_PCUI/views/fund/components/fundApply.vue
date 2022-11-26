<template>
    <div class='handle-module'>
        <div class='block'>
            <p class='title'>
                {{ $t('fundInfo.choosePayAsset') }}
            </p>
            <div class='box'>
                <el-select
                    v-model='activeCurrency'
                    :placeholder="$t('fundInfo.choosePayAsset')"
                    @change='onSelect'
                >
                    <el-option
                        v-for='(item, index) in selectActions'
                        :key='index'
                        :label='item.currencyCode'
                        :value='item.currencyCode'
                    />
                </el-select>
                <span class='line'></span>
                <el-input
                    v-model='amountPay'
                    clearable
                    :disabled='fund.canPurchase !== 1 || !customerInfo'
                    :placeholder='payPlaceholder'
                    type='number'
                    @input='onInput'
                />
            </div>
        </div>
        <div class='block'>
            <p class='title'>
                {{ $t('fundInfo.chooseApplyAsset') }}
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
                    {{ sharesPlaceholder }}
                </span>
            </div>
        </div>
        <div class='total'>
            <p>
                <span>{{ $t('fundInfo.available') }}：</span>
                <strong>{{ curAccount?.available }} {{ activeCurrency }}</strong>
            </p>
            <p>
                <span>{{ $t('fundInfo.fundApplyFeeCalc') }}：</span>
                <strong>{{ calcApplyFee || '--' }} {{ activeCurrency }}</strong>
            </p>
        </div>
        <!-- 已登录 -->
        <div v-if='isLogin'>
            <div
                v-loading='loading'
                :class="{ 'handle-button': true, 'disable': fund.canPurchase !== 1 }"
                @click='submitHandler'
            >
                <span>{{ fund.canPurchase === 1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}</span>
                <em v-if="lang === 'en-US'"></em>
                <span v-if='fund.canPurchase === 1'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <p class='rules-link' @click='openRules'>
                <span>{{ $t('fundInfo.applyRules') }}</span>
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
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import applyRulesDialog from './applyRulesDialog.vue'
import { computed, unref, ref, defineProps, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { orderHook } from '../hooks.js'
import { limitNumber, limitDecimal } from '@/utils/calculation'
import { debounce, getCookie } from '@/utils/util'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 当前语言
const lang = getCookie('lang')
// 申购成功后更新列表数据
const updateRecord = inject('updateRecord')
// 组件ref
const applyRulesDialogRef = ref(null)

const {
    loading,
    calcApplyShares,
    submitFundApply,
    selectActions,
    onSelect,
    activeCurrency,
    curAccount,
    calcApplyFee,
    calcShares,
    isLogin
} = orderHook({ fund: props.fund, direction: 'buy' })

// 支付资产输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.available') + curAccount.value?.available
    return unref(curAccount) ? text : '--'
})
const amountPay = ref('')

// 份额输入框的placeholder
const sharesPlaceholder = computed(() => {
    const text = '≈ ' + calcShares.value
    return unref(calcShares) ? text : '--'
})

// 输入事件控制
const onInput = (value) => {
    const newval = limitNumber(value)
    amountPay.value = newval
    const digits = curAccount.value?.digits || 0
    amountPay.value = limitDecimal(newval, digits)
    inputHandler()
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    calcApplyShares(amountPay.value)
}, 800)

// 提交申购
const submitHandler = () => {
    const fund = props.fund
    if (fund.canPurchase !== 1 || loading.value) return
    submitFundApply({
        fundId: parseInt(fund.fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
    }).then(res => {
        if (res.check()) {
            amountPay.value = ''
            calcApplyShares()
            updateRecord('apply')
            Dialog.alert({
                title: t('fundInfo.applySuccessed'),
                message: '',
            }).then(() => {})
        }
    })
}

// 打开规则弹窗
const openRules = () => {
    const fund = props.fund
    applyRulesDialogRef.value.open(true, fund.fundId)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handle-module {
    padding-top: 20px;
    .block {
        margin-bottom: 30px;
        &:nth-of-type(2) {
            margin-bottom: 0;
        }
        .title {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .box {
            display: flex;
            align-items: center;
            height: 50px;
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
                width: 100px;
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
        &:deep {
            .el-select {
                width: 100px;
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
    .total {
        margin-top: 10px;
        font-size: 12px;
        p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            strong {
                font-weight: normal;
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
        margin-top: 10px;
        text-align: center;
        span {
            color: var(--primary);
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
