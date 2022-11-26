<template>
    <div class='currency-bg'>
        <img alt='' :src='getCurrencyIcon(curCurrency.currency)' />
    </div>
    <div class='fullPageWrapper'>
        <LayoutTop
            :back='true'
            :custom-style='customStyle'
            :menu='false'
            :title='$t("trade.asset")'
        >
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t('assets.transferRecord') }}
                </a>
            </template>
        </LayoutTop>

        <div class='page-content'>
            <!-- <p class='header'>
                {{ $t('assets.transferAsset') }}
            </p> -->

            <div class='transfer'>
                <div class='label'>
                    {{ $t('common.from') }}
                    <div class='dots'>
                        <span class='dot'></span>
                        <span class='dot'></span>
                    </div> {{ $t('common.to') }}
                </div>

                <div class='center'>
                    <div class='from account' @click='handleFrom(fromAccount?.id)'>
                        <span> {{ fromAccount?.name }}</span>
                        <van-icon v-if='Number(fromAccount?.id) !== 5' name='arrow' @click='handleFrom(fromAccount?.id)' />
                    </div>
                    <div class='to account' @click='handleTo(toAccount?.id)'>
                        <span> {{ toAccount?.name }}</span>
                        <van-icon v-if='Number(toAccount?.id) !== 5' name='arrow' @click='handleTo(toAccount?.id)' />
                    </div>
                </div>
                <div class='right' @click='handleSwap'>
                    <div class='icon-wrap'>
                        <i class='icon_zhuanhuan'></i>
                    </div>
                </div>
            </div>

            <p class='header mt60'>
                {{ $t('assets.transferAsset') }}
            </p>
            <div class='action-bar mb60' @click='pickerShow=true'>
                <img alt='' class='currency-icon' :src='getCurrencyIcon(curCurrency.currency)' srcset='' />
                <span class='label'>
                    {{ curCurrency?.currency }}
                </span>
                <van-icon name='arrow' @click='pickerShow=true' />
            </div>

            <p class='header mt60'>
                {{ $t('trade.orderVolume') }}
            </p>
            <div class='action-bar'>
                <input v-model='amount' :placeholder='$t("assets.minTransfer")+ minTransfer' type='number' />
                <span class='unit'>
                    {{ curCurrency?.currency }}
                </span>
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='tip'>
                {{ $t('assets.maxTransfer') }}
                <span class='val'>
                    {{ maxTransfer }}
                </span> {{ curCurrency?.currency }}
            </p>
        </div>

        <div class='footerBtn'>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleTransfer'>
                {{ $t('trade.transfer') }} {{ curCurrency?.currency }}
            </van-button>
        </div>
        <Loading :show='loading' />
        <!-- 资产列表 -->
        <assetsList
            v-if='pickerShow'
            :account-list='accountList'
            :currency='curCurrency?.currency'
            :show='pickerShow'
            :trade-type='fromAccount.id'
            @update:currency='onCurrencyConfirm'
            @update:show='updatePopupVis'
        />

        <!-- <van-popup
            v-model:show='pickerShow'
            class='assetsPicker'
            :duration='0.2'
            position='bottom'
        >
            <van-picker
                :cancel-button-text="$t('common.cancel')"
                :columns='accountList'
                :columns-field-names='currencyField'
                :confirm-button-text="$t('common.sure')"
                @cancel='pickerShow = false'
                @confirm='onCurrencyConfirm'
            />
        </van-popup> -->
        <van-popup
            v-model:show='accountShow'
            class='assetsPicker'
            :duration='0.2'
            position='bottom'
        >
            <van-picker
                :cancel-button-text="$t('common.cancel')"
                :columns='plans'
                :columns-field-names='customField'
                :confirm-button-text="$t('common.sure')"
                @cancel='accountShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { pow, gt, lt } from '@/utils/calculation'
import { capitalTransfer, queryAccountById } from '@/api/user'
import { isEmpty } from '@/utils/util'
import assetsList from '@/themeCommon/components/assetsList/assetsList.vue'
export default {
    components: {
        assetsList
    },
    setup (props, { emit }) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { accountId, tradeType } = route.query
        const state = reactive({
            pickerShow: false,
            accountShow: false,
            loading: false,
            toAccount: {},
            fromAccount: {},
            assetsList: [],
            transferType: '',
            amount: '',
            curCurrency: '',
            maxTransfer: '',
            curTradeType: ''
        })

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans.filter(el => Number(el.id) !== 5))
        // 获取账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        const toAccountId = computed(() =>
            store.state._user?.customerInfo?.accountList.find(el => Number(el.tradeType) === Number(state.toAccount.id) && el.currency === state.curCurrency.currency)
        )

        const accountList = computed(() => {
            return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.fromAccount.id))
        })

        // 自定义头部样式
        const customStyle = {
            'background': 'transparent',
            'z-index': 0
        }

        const swapAccount = computed({
            get () {
                return store.state._base.plans.find(el => Number(el.id) === 5)
            },
            set (val) {
                state.fromAccount = val
            }
        })

        state.fromAccount = swapAccount.value

        // state.fromAccount = store.state._base.plans.find(el => Number(el.id) === 5)

        if (Number(tradeType) === 5) {
            state.toAccount = plans.value.filter(el => el.name !== state.fromAccount.name)[0]
        } else {
            state.toAccount = plans.value.find(el => Number(el.id) === Number(tradeType))
        }
        state.curTradeType = state.fromAccount.id

        // 最大可转
        // const maxTransfer = computed(() => accountList.value.find(item => item.currency === state.curCurrency.currency)?.withdrawAmount)
        const minTransfer = computed(() => {
            const digits = state.curCurrency.digits
            return pow(0.1, digits)
        })

        const queryAccount = () => {
            queryAccountById({
                accountId: state.curCurrency.accountId,
                tradeType: state.fromAccount.id
            }).then(res => {
                if (res.check()) {
                    state.maxTransfer = res.data.available
                }
            }).catch(err => {
                state.loading = false
            })
        }

        watch(() => accountList, val => {
            if (val.value.length > 0) {
                state.curCurrency = accountList.value[0]
                state.curTradeType = accountList.value[0]?.tradeType
            }
        }, {
            immediate: true
        })

        watchEffect(() => {
            queryAccount()
        })

        const handleTransfer = () => {
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip6'))
            }
            if (isEmpty(toAccountId.value)) {
                return Toast(state.toAccount.name + t('common.notFound') + state.curCurrency.currency + t('common.account'))
            }

            if (gt(state.amount, state.maxTransfer)) {
                return Toast(t('assets.transferTip4'))
            }
            if (lt(state.amount, minTransfer.value)) {
                return Toast(t('assets.transferTip5'))
            }
            state.loading = true
            const params = {
                customerNo: customInfo.customerNo,
                accountId: state.curCurrency.accountId,
                customerId: customInfo.id,
                tradeType: state.fromAccount.id,
                accountDigit: state.curCurrency.digits,
                toTradeType: state.toAccount.id,
                toAccountId: toAccountId.value.accountId,
                toCustomerNo: customInfo.customerNo,
                toAccountDigit: state.curCurrency.digits,
                amount: state.amount
            }

            capitalTransfer(params).then(res => {
                state.loading = false
                if (res.check() && res.data) {
                    state.amount = ''
                    Toast(t('assets.transferSuccess'))
                    queryAccount()
                    if ([3, 5, 9].includes(Number(state.fromAccount.id))) {
                        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.fromAccount.id })
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleAll = () => {
            state.amount = state.maxTransfer
        }

        const getCurrencyIcon = (currency) => {
            try {
                return require('@/assets/currency_icon/' + currency + '.png')
            } catch (error) {
                return require('@/assets/currency_icon/default.png')
            }
        }

        const onPickerConfirm = (val) => {
            state.accountShow = false

            if (state.transferType === 1) {
                state.fromAccount = val
            } else {
                state.toAccount = val
            }
            state.curCurrency = accountList.value.filter(el => Number(el.tradeType) === Number(state.fromAccount.tradeType))[0]
            state.amount = ''

            /*   // abcc 现货杠杆 杠杆全仓重新拉账户资产
            if ([3, 5, 9].includes(Number(state.fromAccount.id))) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.fromAccount.id })
            } */
        }
        const toRecord = () => {
            router.push({
                path: '/record',
                query: {
                    accountId,
                    tradeType,
                    type: 3
                }
            })
        }
        const handleFrom = (tradeType) => {
            if (Number(tradeType) === 5) return
            state.transferType = 1
            state.accountShow = true
            state.assetsList = plans.value.filter(el => el.name !== state.toAccount.name)
            // state.assetsList = plans.value.filter(el => el.name !== state.toAccount)
        }

        // 选取币种确定事件
        const onCurrencyConfirm = (val) => {
            state.curCurrency = val
            state.pickerShow = false
            state.amount = ''
        }

        const handleTo = (tradeType) => {
            if (Number(tradeType) === 5) return
            state.transferType = 2
            state.accountShow = true
            state.assetsList = plans.value.filter(el => el.name !== state.fromAccount.name)
        }
        const customField = {
            text: 'name',
        }

        const currencyField = {
            text: 'currency'
        }

        const handleSwap = () => {
            [state.fromAccount, state.toAccount] = [state.toAccount, state.fromAccount]
            state.curCurrency = accountList.value.filter(el => Number(el.tradeType) === Number(state.fromAccount.tradeType))[0]
            state.amount = ''
        }

        const updatePopupVis = (val) => {
            state.pickerShow = val
        }

        store.commit('_base/Update_plansNames', tm('tradeType'))

        /* if ([3, 5, 9].includes(Number(route.query.tradeType))) {
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: route.query.tradeType })
        } */

        return {
            plans,
            handleTransfer,
            handleSwap,
            onCurrencyConfirm,
            onPickerConfirm,
            handleFrom,
            handleTo,
            customField,
            toRecord,
            handleAll,
            accountList,
            currencyField,
            minTransfer,
            customStyle,
            updatePopupVis,
            getCurrencyIcon,
            ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.currency-bg {
    position: fixed;
    top: -55px;
    right: -60px;
    overflow: hidden;
    opacity: 0.05;
    img {
        width: 320px;
    }
}
.fullPageWrapper {
    .page-content {
        position: relative;
        z-index: 1;
        padding: 0 rem(30px);
        overflow: hidden;
        .header {
            // font-weight: bold;
            padding-bottom: rem(10px);
            font-size: rem(48px);
        }
        .transfer {
            display: flex;
            align-items: center;
            margin-top: rem(30px);
            .label {
                height: rem(200px);
                padding: rem(45px) rem(44px) 0 rem(20px);
                color: var(--color);
                // font-weight: bold;
                font-size: rem(48px);
                line-height: rem(27px);
                text-align: center;
                word-wrap: break-word;
                background: var(--contentColor);
                .dots {
                    margin: rem(20px) 0;
                    text-align: center;
                    .dot {
                        display: block;
                        width: rem(6px);
                        height: rem(6px);
                        margin: 0 auto  rem(10px) auto;
                        text-align: center;
                        background: var(--placeholdColor);
                        border-radius: 50%;
                    }
                }
            }
            .center {
                flex: 1;
                background: var(--contentColor);
                border-top-left-radius: rem(6px);
                border-bottom-left-radius: rem(6px);
                .account {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: rem(100px);
                    padding-right: rem(30px);
                    padding-left: rem(30px);
                    font-size: rem(28px);
                    line-height: rem(100px);
                    &.from {
                        border-bottom: solid 1px var(--lineColor);
                    }
                    .van-icon {
                        color: var(--minorColor);
                    }
                }
            }
            .right {
                display: flex;
                align-items: center;
                height: rem(200px);
                //flex: 1;
                background: var(--contentColor);
                border-top-right-radius: rem(6px);
                border-bottom-right-radius: rem(6px);
                .icon-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    .icon_zhuanhuan {
                        margin: 0 rem(32px);
                        color: var(--color);
                        font-size: rem(40px);
                    }
                }
            }
        }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(100px);
            margin-top: rem(20px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            background: var(--contentColor);
            border-radius: rem(6px);
            input {
                flex: 1;
            }
            .unit {
                margin-right: rem(30px);
                padding-right: rem(30px);
                color: var(--placeholdColor);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
            }
            .currency-icon {
                width: rem(48px);
                margin-right: rem(20px);
            }
            .label {
                flex: 1;
            }
        }
        .tip {
            margin-left: rem(23px);
            color: var(--minorColor);
            text-align: right;
            .val {
                color: var(--color);
            }
        }
        .mt60 {
            margin-top: rem(60px);
        }
        .mb60 {
            margin-bottom: rem(60px);
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
            font-weight: bold;
            font-size: rem(30px);
            background: var(--primary);
            border: none;
            border-radius: rem(6px);
        }
    }
    .right-title {
        color: var(--color);
        font-size: rem(24px);
    }
}
</style>
