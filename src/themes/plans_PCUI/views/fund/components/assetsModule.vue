<template>
    <section v-if='$store.state._user.customerInfo' class='assetsModule'>
        <h2 class='tradeTypeName'>
            {{ tradeTypeNames[5] }}
        </h2>
        <!-- 现货撮合 -->
        <div class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})</p>
                <p class='amount'>
                    {{ assetsInfo.totalBalance }}
                </p>
            </div>
            <van-button class='btn' type='primary' @click='goDesposit'>
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button class='btn' type='primary' @click='goWithdraw'>
                {{ $t('trade.withdraw') }}
            </van-button>
            <van-button v-if='$store.state._base.plans.length>1' class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType=5')">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
    </section>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t, tm } = useI18n({ useScope: 'global' })
        const tradeTypeNames = tm('tradeType')

        // 3,5,9玩法资产
        const assetsInfo = computed(() => (store.state._user.assetsInfo[5] || {}))

        // 合约全仓资产
        const accountTradeType1 = computed(() => {
            const accountAssets = store.state._user.accountAssets['1']
            const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === parseInt(5))
            return Object.assign({}, account, accountAssets)
        })

        // 合约逐仓资产
        const accountTradeType2 = computed(() => store.state._user.accountAssets['2'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 跳转充值页面
        const goDesposit = () => {
            if (store.state._user.customerInfo?.accountList?.length > 1) {
                router.push({
                    path: route.path + '/depositChoose',
                    query: {
                        tradeType: 5
                    }
                })
            } else {
                router.push({
                    path: route.path + '/deposit',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        currency: assetsInfo.value.currency,
                        tradeType: 5
                    }
                })
            }
        }

        // 跳转提现页面
        const goWithdraw = () => {
            router.push({
                path: route.path + '/withdrawAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: 5
                }
            })
        }

        // 跳转到借款页面
        const goLoan = () => {
            router.push({
                path: route.path + '/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: 5,
                    type: 1
                }
            })
        }

        // 跳转到还款页面
        const goRepayment = () => {
            router.push({
                path: route.path + '/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: 5,
                    type: 3
                }
            })
        }
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger')
        }

        return {
            riskLevelMap,
            tradeTypeNames,
            assetsInfo,
            accountTradeType1,
            accountTradeType2,
            goDesposit,
            goWithdraw,
            goLoan,
            goRepayment,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsModule {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    margin-top: 8px;
    padding: 0 15px;
    color: var(--color);
    background: var(--contentColor);
    .tradeTypeName {
        font-size: 16px;
        line-height: 60px;
    }
    .rightActions {
        display: flex;
    }
    .assetItem {
        padding-right: 60px;
        color: var(--minorColor);
        font-size: 12px;
        line-height: 1.2;
        .amount {
            color: var(--color);
            font-size: 14px;
        }
    }
    .riskRate {
        .amount {
            color: var(--success);
        }
    }
    .btn {
        @include hover();
        min-width: 80px;
        height: 32px;
        margin-left: 10px;
        color: var(--primary);
        line-height: 32px;
        background: var(--primaryAssistColor);
        border: transparent;
    }
}
.riskLevel {
    position: relative;
    margin-left: rem(10px);
    padding-left: rem(25px);
    font-size: rem(28px);
    &::before {
        position: absolute;
        top: 50%;
        left: 0%;
        display: block;
        width: rem(16px);
        height: rem(16px);
        border-radius: 16px;
        transform: translate(0, -50%);
        content: '';
    }
}
.riskLevel1 {
    color: var(--success);
    &::before {
        background: var(--success);
    }
}
.riskLevel2 {
    color: var(--focusColor);
    &::before {
        background: var(--focusColor);
    }
}
.riskLevel3 {
    color: var(--warn);
    &::before {
        background: var(--warn);
    }
}
</style>
