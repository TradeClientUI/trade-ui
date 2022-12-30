<template>
    <centerViewDialog>
        <div class='page-wrap'>
            <LayoutTop icon='icon_icon_close_big' />
            <div class='page-content'>
                <p class='head-text'>
                    {{ $t('withdraw.outAccount') }}
                </p>
                <el-select v-model='accountId' class='currencyBox' placeholder='' @change='changeOutCurrency'>
                    <el-option
                        v-for='item in columns'
                        :key='item.accountId'
                        :label='item.currency'
                        :value='item.accountId'
                    />
                </el-select>
                <p class='head-text'>
                    {{ $t('withdraw.inAccount') }}
                </p>
                <el-select v-model='inCurrency' class='currencyBox' placeholder='' style='padding-bottom: 20px;' @change='changeInCurrency'>
                    <el-option
                        v-for='item in inCurrencyList'
                        :key='item.currency'
                        :label='item.currency'
                        :value='item.currency'
                    />
                </el-select>
                <p v-if='withdrawMethodVis' class='head-text'>
                    {{ $t('withdraw.withdrawMethod') }}
                </p>
                <el-select
                    v-if='withdrawMethodVis'
                    v-model='withdrawMethodText'
                    class='currencyBox'
                    placeholder='Select'
                    style='padding-bottom: 20px;'
                    @change='changeWithdrawMethod'
                >
                    <el-option
                        v-for='item in methodList'
                        :key='item.val'
                        :label='item.methonText'
                        :value='item.val'
                    />
                </el-select>
                <div class='footerBtn'>
                    <van-button block class='pc_withdraw_next_ga' :disabled='disabled' type='primary' @click='next'>
                        {{ $t('common.nextStep') }}
                    </van-button>
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { withdrawCurrencyList } from '@/api/user'
import { Toast } from 'vant'

export default {
    components: {
        centerViewDialog
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        const { tradeType } = route.query

        const state = reactive({
            outPickerShow: false,
            inPickerShow: false,
            outCurrency: '',
            inCurrency: '',
            inCurrencyList: [],
            currentTab: '',
            accountId: route.query.accountId,
            withdrawMethod: '',
            withdrawMethodVis: false,
            withdrawMap: {},
            lang: getCookie('lang'),
            methodPickerShow: false,
            methodList: [],
            withdrawMethodText: '',
            disabled: false
        })

        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        // 当前币种
        const columns = computed(() => accountList.value.filter(item => item.tradeType === Number(tradeType)).map(el => {
            return {
                currency: el.currency,
                accountId: el.accountId
            }
        })
        )

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType)))

        state.outCurrency = columns.value[0].currency
        state.accountId = columns.value[0].accountId

        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }

        const customMethodName = {
            text: 'methonText',
            // values: 'values'
        }

        // const onPickerConfirm = val => {
        //     state.outPickerShow = false
        //     state.accountId = val.accountId
        //     state.outCurrency = val.currency
        // }
        const changeOutCurrency = val => {
            state.accountId = val
            columns.value.forEach(el => {
                if (el.accountId == val) {
                    state.outCurrency = el.currency
                }
            })
        }

        const onInPickerConfirm = (val) => {
            state.inPickerShow = false
            state.currentTab = val.withdrawMethod
            state.inCurrency = val.currency

            if (val.withdrawMethod.split(',').length > 1) {
                // 如果选择的币种支持多种取款方式
                state.withdrawMethodVis = true
                const methods = val.withdrawMethod.split(',')
                state.methodList = methods.map(el => {
                    return {
                        val: el,
                        methonText: state.withdrawMap[el][state.lang]
                    }
                })
                state.currentTab = state.methodList[0].val
                state.withdrawMethodText = state.methodList[0].methonText
            } else {
                state.withdrawMethodVis = false
            }
        }
        const changeInCurrency = (val) => {
            state.inCurrency = val
            state.inCurrencyList.forEach(el => {
                if (el.currency == val) {
                    state.currentTab = el.withdrawMethod
                }
            })

            if (state.currentTab.split(',').length > 1) {
                // 如果选择的币种支持多种取款方式
                state.withdrawMethodVis = true
                const methods = state.currentTab.split(',')
                state.methodList = methods.map(el => {
                    return {
                        val: el,
                        methonText: state.withdrawMap[el][state.lang]
                    }
                })
                state.currentTab = state.methodList[0].val
                state.withdrawMethodText = state.methodList[0].methonText
            } else {
                state.withdrawMethodVis = false
            }
        }

        const next = () => {
            const query = {
                currency: state.inCurrency,
                currentTab: state.currentTab,
                tradeType,
                accountId: state.accountId
            }

            if (['bank', 'otc365_cny', 'micropay'].includes(state.currentTab)) {
                // 跳转到提现银行卡页面
                router.push({
                    path: '/assets/withdrawMoney',
                    query
                })
            } else if (['payredeem'].includes(state.currentTab)) {
                // 跳转到提现payredeem页面
                router.push({
                    path: '/assets/withdrawRedeem',
                    query
                })
            } else if (['GCash', 'Maya'].includes(state.currentTab)) {
                // 跳转到提现pay8Account页面
                router.push({
                    path: '/assets/pay8Account',
                    query
                })
            } else if (['Bank_Account'].includes(state.currentTab)) {
                // 跳转到提现pay8Bank页面
                router.push({
                    path: '/assets/pay8Bank',
                    query
                })
            } else {
                // 跳转到提币页面
                router.push({
                    path: '/assets/withdrawCoin',
                    query
                })
            }
        }

        // 取款方式确定
        const changeWithdrawMethod = (option) => {
            state.currentTab = option
            state.methodList.forEach(item => {
                if (item.val == option) {
                    state.withdrawMethodText = item.methonText
                }
            })
        }

        // 获取到账币种
        withdrawCurrencyList({
            customerGroupId: customInfo.customerGroupId,
            customerNo: customInfo.customerNo,
            tradeType,
            accountId: state.accountId

        }).then(res => {
            state.currencyList = res.data
            if (res.check() && res.data.list.length > 0) {
                state.disabled = false
                state.withdrawMap = res.data.map
                state.inCurrencyList = res.data.list.map(el => {
                    return {
                        currency: el.currency,
                        withdrawMethod: el.withdrawMethod
                    }
                })
                state.inCurrency = res.data.list[0].currency
                state.currentTab = res.data.list[0].withdrawMethod
                changeInCurrency(state.inCurrency)
            } else {
                if (columns.value.length === 0 || state.inCurrencyList.length === 0) {
                    state.disabled = true
                    return Toast(t('withdraw.tips1'))
                }
            }
        }).catch(err => {
            state.loadingMore = false
            state.loading = false
        })

        return {
            accountList,
            columns,
            changeOutCurrency,
            changeInCurrency,
            changeWithdrawMethod,
            next,
            customFieldName,
            customMethodName,
            ...toRefs(state)
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
    overflow: auto;
    background: var(--contentColor);
    .page-content {
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background: var(--contentColor);
        :deep(.el-select) {
            width: 100%;
        }
        :deep(.el-input__inner) {
            border: none;
            color: var(--color);
        }
        .head-text {
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(90px);
        }
        .actionBar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(80px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(80px);
            background: var(--assistColor);
            border-radius: rem(6px);
            .icon_icon_arrow {
                margin-left: rem(10px);
                font-size: rem(24px);
            }
            .input {
                flex: 1;
                height: rem(40px);
            }
            .all {
                position: absolute;
                top: 0;
                right: rem(20px);
                bottom: 0;
                margin: auto;
                color: var(--primary);
                font-size: rem(24px);
            }
            .currencySpan {
                margin-right: rem(10px);
            }
            .muted {
                margin-right: rem(15px);
            }
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
                @include hover();
                //width: 45%;
                flex: 1;
                height: rem(80px);
                margin: rem(20px);
                //margin-bottom: rem(20px);
                color: #FFF;
                font-size: rem(30px);
                border: none;
                border-radius: rem(6px);
            }
        }
    }
}
</style>
