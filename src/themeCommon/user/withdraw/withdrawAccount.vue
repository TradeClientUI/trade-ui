<template>
    <div class='page-wrap'>
        <LayoutTop />
        <div class='page-content'>
            <p class='head-text'>
                {{ $t('withdraw.outAccount') }}
            </p>
            <div class='actionBar' @click='selectCurrency'>
                <span class='currencySpan'>
                    {{ outCurrency }}
                </span>
                <van-icon name='arrow' />
            </div>
            <p class='head-text'>
                {{ $t('withdraw.inAccount') }}
            </p>
            <div class='actionBar' @click='selectInCurrency'>
                <span class='currencySpan'>
                    {{ inCurrency }}
                </span>
                <van-icon name='arrow' />
            </div>

            <p v-if='withdrawMethodVis' class='head-text'>
                {{ $t('withdraw.withdrawMethod') }}
            </p>
            <div v-if='withdrawMethodVis' class='actionBar' @click='selectWithdraw'>
                <span class='currencySpan'>
                    {{ withdrawMethodText }}
                </span>
                <van-icon name='arrow' />
            </div>

            <div class='footerBtn'>
                <van-button block :disabled='disabled' type='primary' @click='next'>
                    {{ $t('common.nextStep') }}
                </van-button>
            </div>
        </div>
    </div>

    <van-popup v-model:show='outPickerShow' class='assetsPicker' position='bottom'>
        <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='columns'
            :columns-field-names='customFieldName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            @cancel='outPickerShow = false'
            @confirm='onPickerConfirm'
        />
    </van-popup>

    <van-popup v-model:show='inPickerShow' class='assetsPicker' position='bottom'>
        <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='inCurrencyList'
            :columns-field-names='customFieldName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            @cancel='inPickerShow = false'
            @confirm='onInPickerConfirm'
        />
    </van-popup>

    <van-popup v-model:show='methodPickerShow' class='assetsPicker' position='bottom'>
        <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='methodList'
            :columns-field-names='customMethodName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            @cancel='methodPickerShow = false'
            @confirm='onMethonConfirm'
        />
    </van-popup>
</template>

<script>
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { withdrawCurrencyList } from '@/api/user'
import { Toast } from 'vant'

export default {
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        const { tradeType } = route.query

        const state = reactive({
            outPickerShow: false,
            inPickerShow: false,
            outCurrency: route.query.currency,
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
        }))

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType)))

        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }

        const customMethodName = {
            text: 'methonText',
            // values: 'values'
        }

        const onPickerConfirm = val => {
            state.outPickerShow = false
            state.accountId = val.accountId
            state.outCurrency = val.currency
        }

        const onInPickerConfirm = (val) => {
            state.inPickerShow = false
            state.currentTab = val.withdrawMethod
            state.inCurrency = val.currency
            setMethodList(val)
        }

        // 设置取款方式
        const setMethodList = (val) => {
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

        // 显示选币弹窗
        const selectCurrency = val => {
            state.outPickerShow = true
        }

        const selectInCurrency = val => {
            state.inPickerShow = true
        }

        const next = () => {
            const query = {
                currency: state.inCurrency,
                currentTab: state.currentTab,
                tradeType,
                accountId: state.accountId
            }

            if (['bank', 'otc365_cny'].includes(state.currentTab)) {
                // 跳转到提现银行卡页面
                router.push({
                    path: '/withdrawMoney',
                    query
                })
            } else if (['payredeem'].includes(state.currentTab)) {
                // 跳转到提现payredeem页面
                router.push({
                    path: '/withdrawRedeem',
                    query
                })
            } else if (['GCash', 'Maya', 'APay_GCash'].includes(state.currentTab)) {
                // 跳转到提现pay8Account页面
                router.push({
                    path: '/pay8Account',
                    query
                })
            } else if (['Bank_Account', 'APay_Bank'].includes(state.currentTab)) {
                // 跳转到提现pay8Bank页面
                router.push({
                    path: '/pay8Bank',
                    query
                })
            } else {
                // 跳转到提币页面
                router.push({
                    path: '/withdrawCoin',
                    query
                })
            }
        }

        const selectWithdraw = () => {
            state.methodPickerShow = true
        }

        // 取款方式弹窗确定
        const onMethonConfirm = (option) => {
            state.currentTab = option.val
            state.withdrawMethodText = option.methonText
            state.methodPickerShow = false
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
                setMethodList(res.data.list[0])
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
            onPickerConfirm,
            next,
            selectCurrency,
            selectInCurrency,
            onInPickerConfirm,
            customFieldName,
            customMethodName,
            onMethonConfirm,
            selectWithdraw,
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
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            width: 100%;
            .van-button {
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
