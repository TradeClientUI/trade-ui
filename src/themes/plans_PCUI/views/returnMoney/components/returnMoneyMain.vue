<template>
    <div class='page-wrap'>
        <LayoutTop>
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t('assets.returnRecord') }}
                </a>
            </template>
        </LayoutTop>

        <div class='returnMoneyPop'>
            <div class='container'>
                <div class='actionBar'>
                    <span class='muted lefe-label' @click='selectPickerField("outCurrency")'>
                        {{ $t('trade.yi') }}
                    </span>
                    <span class='currencySpan' @click='selectPickerField("outCurrency")'>
                        {{ outCurrency }}
                    </span>
                    <span class='icon_icon_arrow' @click='selectPickerField("outCurrency")'></span>
                    <input v-model='outAmount' class='input' type='number' />
                    <a class='all' href='javascript:;' @click='handleAll'>
                        {{ $t('trade.allPosition') }}
                    </a>
                </div>

                <p class='mutedTip'>
                    {{ $t('trade.free') + outAccount?.available + outCurrency }}
                </p>
                <div class='actionBar mtop20'>
                    <span class='muted lefe-label' @click='selectPickerField("inCurrency")'>
                        {{ $t('trade.huan') }}
                    </span>
                    <span class='currencySpan' @click='selectPickerField("inCurrency")'>
                        {{ inCurrency }}
                    </span>

                    <span class='icon_icon_arrow' @click='selectPickerField("inCurrency")'></span>
                    <span v-if='sameCurrency'>
                        ≈
                    </span>

                    <input class='input' readonly type='number' :value='inAmount' />
                    <van-loading v-if='computLoading' size='18' />
                </div>
                <p class='mutedTip'>
                    {{ $t('trade.daihuan') + ' ' + inAccount?.liabilities + ' ' + inCurrency }}
                </p>
            </div>
            <div class='footerBtn'>
                <van-button block class='returnBtn' :loading='loading' @click='returnMoney'>
                    {{ $t('trade.huan') }} {{ inCurrency }}
                </van-button>
            </div>
        </div>

        <van-popup
            v-model:show='pickerShow'
            class='assetsPicker'
            position='bottom'
        >
            <van-picker
                :cancel-button-text="$t('common.cancel')"
                :columns='columns'
                :confirm-button-text="$t('common.sure')"
                :default-index='2'
                title=''
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { manualRepayment, addRepaymentOrder, previewOrder } from '@/api/user'
import { Toast } from 'vant'
import { debounce, isEmpty } from '@/utils/util'
export default {
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            show: false,
            pickerShow: false,
            pickerField: ' ', // 选择还币还是被还的币 outCurrency, inCurrency
            outCurrency: '', // 以xx币还
            inCurrency: '', // 还xx币
            outAmount: '', // 以xx币还的金额
            loading: false,
            computLoading: false,
            inAmount: '',
            sameCurrency: false,
            tradeType: route.query.tradeType
        })

        const customInfo = computed(() => store.state._user.customerInfo)
        const assetsInfo = computed(() => store.state._user.assetsInfo)
        const outAccount = computed(() => {
            return customInfo.value?.accountList.find(item => item.tradeType === Number(state.tradeType) && item.currency === state.outCurrency)
        }) // 以xx币还的账户

        const inAccount = computed(() => customInfo.value?.accountList.find(item => item.tradeType === Number(state.tradeType) && item.currency === state.inCurrency)) // 还xx币的账户

        const accountList = computed(() => store.state._user.customerInfo?.accountList || [])

        const account = computed(() => {
            return accountList.value.find(({ currency }) => currency === route.query.currency)
        })

        // 当前币种
        const columns = computed(() => accountList.value.filter(item => item.tradeType === Number(state.tradeType)).map(el => el.currency))

        watchEffect(() => {
            // 金额变动重新计算汇率
            if (!isEmpty(state.outAmount)) {
                if (state.outCurrency === state.inCurrency) {
                    state.inAmount = state.outAmount
                } else {
                    computeReturnMoney()
                }
            } else {
                state.inAmount = ''
            }
        })

        // 防抖处理还币输入框，
        const computeReturnMoney = debounce(() => {
            // state.searchKey = val
            state.computLoading = true
            const params = {
                tradeType: state.tradeType,
                sourceCurrency: state.outCurrency,
                targetCurrency: state.inCurrency,
                requestNum: state.outAmount,
                requestTime: Date.now(),
                remark: '',
                customerCurrency: assetsInfo.value.currency,
            }
            previewOrder(params)
                .then(res => {
                    state.computLoading = false
                    state.loading = false
                    if (res.check()) {
                        state.inAmount = res.data
                    } else {
                        state.inAmount = ''
                    }
                }).catch(err => {
                    state.computLoading = false
                })
        })

        // 显示选币弹窗
        const selectPickerField = val => {
            // state.pickerField = val
            // state.pickerShow = true
        }
        const onPickerConfirm = val => {
            console.log(val, state.pickerField)
            state[state.pickerField] = val
            state.pickerShow = false
            if (!isEmpty(state.outAmount) && state.outCurrency !== state.inCurrency) {
                computeReturnMoney()
                state.sameCurrency = true
            } else if (state.outCurrency === state.inCurrency) {
                state.sameCurrency = false
            }
        }

        const handleAll = () => {
            if (parseFloat(outAccount.value.available) > parseFloat(inAccount.value.liabilities)) {
                state.outAmount = inAccount.value.liabilities
            } else {
                state.outAmount = outAccount.value.available
            }
        }

        const returnSuccess = () => {
            Toast(t('trade.repaymentSuccess'))
            state.show = false
            store.dispatch('_user/queryCustomerAssetsInfo', {
                tradeType: state.tradeType
            })
            state.inAmount = ''
            state.outAmount = ''
        }

        // 手动还币
        const returnMoney = () => {
            if (isEmpty(state.outAmount)) {
                return Toast(t('trade.enterReturnAmount'))
            }

            if (parseFloat(state.outAmount) <= 0) {
                return Toast(t('trade.enterReturnAmountLess'))
            }
            state.loading = true

            // 如果来源货币和目标货币相同，刚手动还款，否则通过下单还币
            if (state.outCurrency === state.inCurrency) {
                manualRepayment({
                    tradeType: state.tradeType,
                    customerNo: customInfo.value.customerNo,
                    accountId: route.query.accountId,
                    customerGroupId: customInfo.value.customerGroupId,
                    accountCurrency: route.query.currency,
                    amount: state.outAmount,
                })
                    .then(res => {
                        state.loading = false
                        if (res.check() && res.data) {
                            returnSuccess()
                        }
                    }).catch(err => {
                        state.loading = false
                    })
            } else {
                addRepaymentOrder({
                    tradeType: state.tradeType,
                    sourceCurrency: state.outCurrency,
                    targetCurrency: state.inCurrency,
                    customerCurrency: assetsInfo.value.currency,
                    requestNum: state.outAmount,
                    requestTime: Date.now(),
                    remark: '',
                }).then(res => {
                    state.loading = false
                    if (res.check()) {
                        returnSuccess()
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
        }

        const toRecord = () => {
            const routeParent = route.matched[route.matched.length - 2]
            router.push(routeParent.path + `/record?tradeType=${state.tradeType}&accountId=${route.query.accountId}&type=2`)
        }

        onMounted(() => {
            // 默认还币为当前子账户币种
            state.inCurrency = route.query.currency
            state.outCurrency = route.query.currency
            if (parseFloat(account.value.available) === 0) {
                const accountList = store.state._user.customerInfo?.accountList.filter(item => [3, 5, 9].includes(item.tradeType)) || []
                const newAccountList = accountList.slice().sort((a, b) => parseFloat(b.available) - parseFloat(a.available))
                if (newAccountList.length && newAccountList[0].available > 0) {
                    // state.outCurrency = newAccountList[0].currency
                }
            }
        })

        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.tradeType })

        return {
            ...toRefs(state),
            onPickerConfirm,
            selectPickerField,
            outAccount,
            inAccount,
            columns,
            returnMoney,
            handleAll,
            assetsInfo,
            toRecord
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    padding: 0 rem(20px);
    overflow: auto;
    background: var(--contentColor);
    .returnMoneyPop {
        padding-top: rem(40px);
        .closeBtn {
            position: absolute;
            top: rem(30px);
            right: rem(30px);
        }
        .icon_icon_close_big {
            color: var(--color);
        }
        .actionBar {
            position: relative;
            display: flex;
            align-items: center;
            height: rem(80px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(80px);
            background: var(--assistColor);
            .lefe-label {
                margin-right: rem(30px);
            }
            .icon_icon_arrow {
                margin-left: rem(10px);
                font-size: rem(24px);
            }
            .input {
                flex: 1;
                height: rem(40px);
                margin-left: rem(20px);
                padding-left: rem(20px);
                line-height: rem(40px);
                border-left: 1px solid var(--lineColor);
            }
            .all {
                position: absolute;
                top: 0;
                right: rem(20px);
                bottom: 0;
                margin: auto;
                color: var(--primary);
                font-size: rem(26px);
            }
            .currencySpan {
                margin-left: 3px;
            }
        }
        .mutedTip {
            margin-top: 5px;
            padding-left: rem(30px);
            color: var(--minorColor);
            font-size: rem(24px);
        }
        .footerBtn {
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            width: 100%;
            .van-button {
                flex: 1;
                height: rem(80px);
                margin: rem(20px);
                //margin-bottom: rem(20px);
                color: #FFF;
                font-size: rem(30px);
                //width: 45%;
                background: var(--primary);
                border: none;
            }
        }
    }
    .assetsPicker {
        --van-picker-background-color: var(--contentColor);
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
}
</style>
