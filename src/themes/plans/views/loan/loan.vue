<template>
    <div class='page-wrap'>
        <LayoutTop>
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t('assets.loanRecord') }}
                </a>
            </template>
        </LayoutTop>

        <div class='returnMoneyPop'>
            <div class='container'>
                <div class='actionBar' @click='selectcurCurrency'>
                    <span class='currencySpan'>
                        {{ curCurrency }}
                    </span>
                    <van-icon name='arrow' />
                </div>
                <div class='actionBar'>
                    <input v-model='amount' class='input' :placeholder='$t("assets.loanAmount")' type='number' />
                    <a class='all' href='javascript:;' @click='handleAll'>
                        {{ $t('trade.allPosition') }}
                    </a>
                </div>
                <div class='info'>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.maxLoan') }}<van-icon name='question-o' @click='showInfo(1)' />
                        </span>
                        <span class='fr'>
                            {{ account?.availableLoan }}
                        </span>
                    </div>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.dailyRate') }}<van-icon name='question-o' @click='showInfo(2)' />
                        </span>
                        <span class='fr'>
                            {{ account?.interestProportion }} %
                        </span>
                    </div>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.alreadyLoan') }}
                        </span>
                        <span class='fr'>
                            {{ account?.liabilitiesPrincipal }}
                        </span>
                    </div>
                </div>
            </div>
            <div class='footerBtn'>
                <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleLoan'>
                    {{ $t('trade.get') }} {{ curCurrency }}
                </van-button>
            </div>
        </div>
    </div>
    <van-popup v-model:show='pickerShow' class='assetsPicker' :confirm-button-text="$t('common.sure')" position='bottom'>
        <van-picker
            :cancel-button-text="$t('common.cancel')"
            :columns='columns'
            :columns-field-names='customFieldName'
            :confirm-button-text="$t('common.sure')"
            :default-index='0'
            :duration='0.2'
            title=''
            @cancel='pickerShow = false'
            @confirm='onPickerConfirm'
        />
    </van-popup>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { gt } from '@/utils/calculation'

import { manualLoan } from '@/api/user'
import { computed, reactive, toRefs } from 'vue'
import { isEmpty } from '@/utils/util'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            show: false,
            pickerShow: false,
            amount: '',
            curCurrency: route.query.currency,
            loading: false,
            accountId: route.query.accountId,
            tradeType: route.query.tradeType
        })

        const customInfo = computed(() => store.state._user.customerInfo)
        // 当前币种
        const columns = computed(() => accountList.value.filter(item => item.tradeType === Number(state.tradeType)).map(el => {
            return {
                currency: el.currency,
                accountId: el.accountId
            }
        })
        )

        const accountList = computed(() => store.state._user.customerInfo?.accountList || [])

        const account = computed(() => accountList.value.find(({ currency, tradeType }) => currency === state.curCurrency && tradeType === Number(state.tradeType)))

        // 选中的币种
        const curAccount = computed(() =>
            customInfo?.value?.accountMap[state.curCurrency]
        )

        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }

        // 显示选币弹窗
        const selectcurCurrency = val => {
            state.pickerShow = true
        }

        const onPickerConfirm = val => {
            console.log(val, state.curCurrency)
            state.pickerShow = false
            state.curCurrency = val.currency
            state.accountId = val.accountId

            // 获取最新的资产数据
            store.dispatch('_user/queryAccountAssetsInfo', {
                tradeType: state.tradeType,
                accountId: val.accountId
            })
        }

        const showInfo = (type) => {
            const params = type === 1 ? [account.value.availableLoan] : [state.curCurrency, account.value?.interestProportion || '--']
            Dialog.alert({
                message: t(`assets.loanNotice[${type}]`, params),
                confirmButtonText: t('common.sure')
            }).then(() => {
                // on close
            })
        }

        const handleAll = () => {
            state.amount = account.value?.availableLoan
        }

        // 借款
        const handleLoan = () => {
            if (parseFloat(state.amount) <= 0) {
                return Toast(t('assets.loanAmountLess'))
            }
            if (isEmpty(state.amount)) {
                return Toast(t('assets.loanAmountNotice'))
            }

            if (gt(state.amount, account.value?.availableLoan)) {
                return Toast(t('assets.loanAmountExcess'))
            }

            state.loading = true
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: state.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: state.curCurrency,
                amount: state.amount,
                tradeType: state.tradeType
            }
            manualLoan(params)
                .then(res => {
                    state.loading = false
                    state.show = false
                    if (res.check()) {
                        Toast(t('assets.loanSuccess'))
                        state.amount = ''
                        store.dispatch('_user/queryAccountAssetsInfo', {
                            tradeType: state.tradeType,
                            accountId: state.accountId
                        })
                    } else {
                        state.amount = ''
                    }
                })
        }

        const toRecord = () => {
            router.push({
                path: '/record',
                query: {
                    accountId: state.accountId,
                    tradeType: state.tradeType,
                    type: 1
                }
            })
        }

        store.dispatch('_user/queryAccountAssetsInfo', {
            tradeType: state.tradeType,
            accountId: parseInt(state.accountId)
        })

        return {
            columns,
            showInfo,
            handleLoan,
            onPickerConfirm,
            selectcurCurrency,
            handleAll,
            account,
            toRecord,
            curAccount,
            customFieldName,
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
            justify-content: space-between;
            height: rem(80px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(80px);
            background: var(--assistColor);
            .icon_icon_arrow {
                margin-left: rem(10px);
                font-size: rem(24px);
            }
            .input {
                flex: 1;
                height: rem(40px);
                line-height: rem(40px);
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
        .info {
            padding: 0 rem(30px);
            .info-item {
                display: flex;
                justify-content: space-between;
                margin-top: rem(10px);
                color: var(--minorColor);
                .van-icon {
                    margin-left: rem(5px);
                }
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
            .returnBtn {
                margin: rem(20px);
                color: #FFF;
                font-size: rem(30px);
                background: var(--primary);
            }
        }
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
}
</style>
