<template>
    <div class='fullPageWrapper'>
        <LayoutTop :back='true' icon='icon_icon_close_big' :menu='false'>
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t('assets.transferRecord') }}
                </a>
            </template>
        </LayoutTop>
        <div class='page-content'>
            <div class='transfer'>
                <div class='label'>
                    {{ $t('common.from') }}
                    <div class='dots'>
                        <span v-for='i in 3' :key='i' class='dot'></span>
                    </div> {{ $t('common.to') }}
                </div>

                <div class='center'>
                    <div class='from account'>
                        <span v-if="fromAccount.id==='5'" class='accountTradeTypeName'>
                            {{ fromAccount.name }}
                        </span>
                        <el-select
                            v-else
                            v-model='fromAccountTradeType'
                            class='accountSelect'
                            :disabled="fromAccount.tradeType==='5'"
                            placeholder='Select'
                            @change='fromAccountChange'
                        >
                            <el-option
                                v-for='item in plans'
                                :key='item.tradeType'
                                :label='item.name'
                                :value='item.tradeType'
                            />
                        </el-select>
                        <van-icon v-if='Number(fromAccount.id) !== 5' name='arrow' />
                    </div>
                    <div class='to account'>
                        <span v-if="toAccount.id==='5'" class='accountTradeTypeName'>
                            {{ toAccount.name }}
                        </span>
                        <el-select
                            v-else
                            v-model='toAccountTradeType'
                            class='accountSelect'
                            :disabled="toAccount.tradeType==='5'"
                            placeholder='Select'
                            @change='toAccountChange'
                        >
                            <el-option
                                v-for='item in plans'
                                :key='item.tradeType'
                                :label='item.name'
                                :value='item.tradeType'
                            />
                        </el-select>
                        <van-icon v-if='Number(toAccount.id) !== 5' name='arrow' />
                    </div>
                </div>
                <div class='right' @click='handleSwap'>
                    <i class='icon_zhuanhuan1'></i>
                </div>
            </div>
            <div class='action-bar'>
                <el-select v-model='curCurrencyValue' class='accountSelect' placeholder='Select' @change='curCurrencyChange'>
                    <el-option
                        v-for='item in accountList'
                        :key='item.currency'
                        :label='item.currency'
                        :value='item.currency'
                    />
                </el-select>
                <van-icon name='arrow' />
            </div>
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
                {{ $t('assets.maxTransfer') }} {{ maxTransfer }} {{ curCurrency?.currency }}
            </p>
        </div>

        <div class='footerBtn'>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleTransfer'>
                {{ $t('trade.transfer') }} {{ curCurrency?.currency }}
            </van-button>
        </div>
        <Loading :show='loading' />
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
export default {
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { accountId, tradeType } = route.query
        const state = reactive({
            loading: false,
            fromAccount: '',
            toAccount: '',
            fromAccountTradeType: '', // 转出的玩法
            toAccountTradeType: '', // 转入的玩法
            assetsList: [],
            transferType: '',
            amount: '',
            curCurrency: '',
            curCurrencyValue: '', // 划转币种
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

        // 默认从现货撮合转出
        state.fromAccount = store.state._base.plans.find(el => Number(el.id) === 5)

        if (Number(tradeType) === 5) {
            state.toAccount = plans.value.filter(el => el.name !== state.fromAccount.name)[0]
        } else {
            state.toAccount = plans.value.find(el => Number(el.id) === Number(tradeType))
        }
        state.toAccountTradeType = state.toAccount.tradeType
        state.curTradeType = state.fromAccount.id
        state.curCurrencyValue = accountList.value[0].currency

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
                    state.maxTransfer = res.data.withdrawAmount
                }
            }).catch(err => {
                state.loading = false
            })
        }

        watch(() => accountList.value, val => {
            if (val.length > 0) {
                state.curCurrency = accountList.value[0]
                state.curCurrencyValue = state.curCurrency.currency
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

        const toRecord = () => {
            const routeParent = route.matched[route.matched.length - 2]
            router.push(routeParent.path + `/record?tradeType=${tradeType}&accountId=${accountId}&type=3`)
        }

        // 切换转出账户
        const fromAccountChange = (val) => {
            state.fromAccount = store.state._base.plans.find(el => Number(el.id) === Number(val))
            state.curCurrency = accountList.value.find(el => Number(el.tradeType) === Number(state.fromAccount.tradeType))
            state.amount = ''
        }
        // 切换转出账户
        const toAccountChange = (val) => {
            state.toAccount = store.state._base.plans.find(el => Number(el.id) === Number(val))
            // state.curCurrency = accountList.value.find(el => Number(el.tradeType) === Number(state.fromAccount.tradeType))
            state.amount = ''
        }
        // 切换币种
        const curCurrencyChange = (val) => {
            state.curCurrency = accountList.value.find(el => el.currency === val)
        }

        const handleSwap = () => {
            [state.fromAccount, state.toAccount] = [state.toAccount, state.fromAccount];
            [state.toAccountTradeType, state.fromAccountTradeType] = [state.fromAccountTradeType, state.toAccountTradeType]
            state.curCurrency = accountList.value.filter(el => Number(el.tradeType) === Number(state.fromAccount.tradeType))[0]
            state.curCurrencyValue = state.curCurrency.currency
            state.amount = ''
        }

        /* if ([3, 5, 9].includes(Number(route.query.tradeType))) {
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: route.query.tradeType })
        } */

        return {
            plans,
            handleTransfer,
            handleSwap,
            toRecord,
            handleAll,
            fromAccountChange,
            toAccountChange,
            curCurrencyChange,
            accountList,
            minTransfer,
            ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fullPageWrapper {
    //background-color: var(--contentColor);
    .page-content {
        padding: rem(20px);
        .transfer {
            display: flex;
            align-items: center;
            background: var(--contentColor);
            .label {
                margin: 0 rem(30px) 0 rem(22px);
                color: var(--minorColor);
                font-weight: bold;
                font-size: rem(28px);
                line-height: rem(27px);
                text-align: center;
                word-wrap: break-word;
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
                border-right: solid 1px var(--lineColor);
                .account {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: rem(100px);
                    padding-right: rem(30px);
                    font-size: rem(28px);
                    line-height: rem(100px);
                    &.from {
                        border-bottom: solid 1px var(--lineColor);
                    }
                    .van-icon-arrow {
                        position: absolute;
                        right: 20px;
                        pointer-events: none;
                    }
                }
            }
            .right {
                //flex: 1;
                .icon_zhuanhuan1 {
                    margin: 0 rem(32px);
                    color: var(--primary);
                    font-size: rem(44px);
                    cursor: pointer;
                }
            }
        }
        .action-bar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(100px);
            margin-top: rem(50px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            background: var(--contentColor);
            border-radius: rem(6px);
            cursor: pointer;
            input {
                flex: 1;
            }
            .unit {
                margin-right: rem(30px);
                padding-right: rem(30px);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
                cursor: pointer;
            }
            .van-icon-arrow {
                position: absolute;
                right: 20px;
                pointer-events: none;
            }
        }
        .tip {
            margin-top: rem(23px);
            margin-left: rem(23px);
            color: var(--minorColor);
        }
    }
    .accountSelect {
        width: 100%;
        :deep(.el-input__suffix) {
            display: none;
        }
        :deep(.el-input__inner) {
            width: 100%;
            color: var(--color);
            border: 0;
            background: var(--contentColor);
        }

        --el-disabled-border-base: transparent;
        --el-disabled-fill-base: transparent;
        --el-input-border: transparent;
        --el-disabled-color-base: var(--color);
    }
    .accountTradeTypeName {
        padding-left: 15px;
        color: var(--color);
    }
    .footerBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        .returnBtn {
            @include hover();
            margin: rem(20px);
            color: #FFF;
            font-size: rem(30px);
            background: var(--primary);
            border: none;
            border-radius: rem(6px);
        }
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
}
</style>
