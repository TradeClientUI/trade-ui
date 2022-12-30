<template>
    <section v-if='$store.state._user.customerInfo' class='assetsModule'>
        <h2 class='tradeTypeName'>
            {{ tradeTypeNames[product.tradeType] }}
        </h2>
        <!-- 全仓合约 -->
        <div v-if='product.tradeType===1' class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.balance') }}({{ accountTradeType1.currency }})</p>
                <p class='amount'>
                    {{ accountTradeType1.balance }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.jingzhi') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.netWorth || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.marginLevel') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.marginRadio }}%
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.freeMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.availableMargin || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.originalMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.occupyMargin || '--' }}
                </p>
            </div>
            <van-button v-if='$store.state._base.plans.length>1' class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+product.tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 逐仓合约 -->
        <div v-else-if='product.tradeType===2' class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.freeMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType2?.availableMargin || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.allOriginalMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType2?.occupyMargin || '--' }}
                </p>
            </div>
            <van-button v-if='$store.state._base.plans.length>1' class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+product.tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 杠杆全仓 -->
        <div v-else-if='product.tradeType===3' class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})</p>
                <p class='amount'>
                    {{ assetsInfo.totalBalance }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.netAssets') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalNetAssets }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.totalLoan') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalLiabilitiesPrincipal }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('trade.swap_2') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalInterest }}
                </p>
            </div>
            <div class='assetItem riskRate '>
                <p></p>
                <p class='riskLevel' :class='["riskLevel" + assetsInfo.riskLevel]'>
                    {{ riskLevelMap[assetsInfo.riskLevel] }}
                </p>
            </div>
            <!-- <van-button class='btn' type='primary' @click='goLoan'>
                {{ $t('trade.loan') }}
            </van-button> -->
            <van-button class='btn' type='primary' @click='goRepayment'>
                {{ $t('trade.repayment') }}
            </van-button>
            <van-button v-if='$store.state._base.plans.length>1' class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+product.tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 现货撮合 -->
        <div v-else-if='product.tradeType===5' class='rightActions'>
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
            <van-button v-if='$store.state._base.plans.length>1' class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+product.tradeType)">
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
        const product = computed(() => store.getters.productActived)
        const tradeTypeNames = tm('tradeType')

        // 3,5,9玩法资产
        const assetsInfo = computed(() => (store.state._user.assetsInfo[product.value?.tradeType] || {}))

        // 全仓合约资产
        const accountTradeType1 = computed(() => {
            const accountAssets = store.state._user.accountAssets['1']
            const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === parseInt(product.value?.tradeType))
            return Object.assign({}, account, accountAssets)
        })

        // 逐仓合约资产
        const accountTradeType2 = computed(() => store.state._user.accountAssets['2'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 跳转充值页面
        const goDesposit = () => {
            if (store.state._user.customerInfo?.accountList?.length > 1) {
                router.push({
                    path: '/depositChoose',
                    query: {
                        tradeType: product.value?.tradeType
                    }
                })
            } else {
                router.push({
                    path: route.path + '/deposit',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        currency: assetsInfo.value.currency,
                        tradeType: product.value?.tradeType
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
                    tradeType: product.value?.tradeType
                }
            })
        }

        // 跳转到借款页面
        const goLoan = () => {
            router.push({
                path: route.path + '/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: product.value?.tradeType,
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
                    tradeType: product.value?.tradeType,
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
            product,
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
    padding: 0 20px;
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
            margin-top: 4px;
        }
        &.riskRate {
            line-height: 30px;
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
