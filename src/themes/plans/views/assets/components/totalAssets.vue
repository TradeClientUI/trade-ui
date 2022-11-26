<template>
    <div class='totalAssets'>
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <div class='label'>
                    <div class='left'>
                        <span class='total'>
                            {{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})
                        </span>
                        <span v-if='Number(tradeType) === 3' :class='["riskLevel", "riskLevel" + assetsInfo.riskLevel]'>
                            {{ riskLevelMap[assetsInfo.riskLevel] }}
                        </span>
                        <span v-else-if='Number(tradeType) !== 5' class='tag'>
                            {{ $t('assets.riskLevel') }} {{ assetsInfo?.closeProportion }}
                        </span>
                    </div>
                    <i class='icon_zijinmingxi' @click="$router.push({ name:'Record',query:{ tradeType:tradeType, accountId:assetsInfo.accountId } })"></i>
                </div>
                <div class='totalAmount'>
                    {{ assetsInfo?.totalBalance }}
                </div>
            </div>
        </div>
        <ul v-if='Number(tradeType) !== 5' class='assetList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('assets.netAssets') }}
                </p>
                <p>{{ assetsInfo?.totalNetAssets }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('assets.totalLoan') }}
                </p>
                <p>{{ assetsInfo?.totalLiabilitiesPrincipal }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.swap_2') }}
                </p>
                <p>{{ assetsInfo?.totalInterest }}</p>
            </li>
        </ul>

        <div v-if='[3,5].includes(Number(tradeType))' class='btns'>
            <!-- <van-button
                v-if='Number(tradeType) === 3'
                size='mini'
                type='primary'
                @click='toLoan'
            >
                {{ $t('trade.loan') }}
            </van-button> -->
            <van-button
                v-if='Number(tradeType) === 5'
                size='mini'
                type='primary'
                @click='toDesposit'
            >
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button
                v-if='Number(tradeType) === 3'
                size='mini'
                type='primary'
                @click='toRepayment'
            >
                {{ $t('trade.repayment') }}
            </van-button>
            <van-button
                v-else
                size='mini'
                type='primary'
                @click='toWirhdraw'
            >
                {{ $t('trade.withdraw') }}
            </van-button>
        </div>
        <div v-if='$store.state._base.plans.length>1' class='btns2'>
            <van-button
                class='transfer-btn'
                size='mini'
                @click='toTransfer'
            >
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

export default {
    components: {
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const assetsInfo = computed(() => store.state._user.assetsInfo[tradeType.value] || {})
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType.value)))
        const accountInfo = computed(() => accountList?.value[0])

        // 跳转充值页面
        const toDesposit = () => {
            if (!checkAssets()) return
            router.push({
                path: '/depositChoose',
                query: {
                    tradeType: tradeType.value
                }
            })
        }

        // 跳转提现页面
        const toWirhdraw = () => {
            if (!checkAssets()) return
            router.push({
                path: '/withdrawAccount',
                query: {
                    accountId: accountInfo.value.accountId,
                    currency: accountInfo.value.currency,
                    tradeType: tradeType.value
                }
            })
        }

        // 跳转到借款页面
        const toLoan = () => {
            if (!checkAssets()) return
            router.push({
                path: '/chooseAccount',
                query: {
                    tradeType: tradeType.value,
                    type: 1
                }
            })
        }

        // 跳转到还款页面
        const toRepayment = () => {
            router.push({
                path: '/chooseAccount',
                query: {
                    tradeType: tradeType.value,
                    type: 3
                }
            })
        }

        // 跳转划转记录
        const toTransfer = () => {
            if (!checkAssets()) return
            router.push({
                path: '/transfer',
                query: {
                    accountId: accountInfo.value.accountId,
                    tradeType: tradeType.value
                }
            })
        }

        // 验证是否有资产
        const checkAssets = () => {
            if (assetsInfo.value) {
                return true
            } else {
                Toast(t('trade.nullAssets'))
                return false
            }
        }

        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger')
        }
        return {
            assetsInfo,
            tradeType,
            toDesposit,
            toTransfer,
            toWirhdraw,
            toLoan,
            toRepayment,
            riskLevelMap
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAssets {
    padding: rem(10px) rem(30px) rem(30px) rem(30px);
    background: var(--contentColor);
    border-radius: 4px;
}
.totalAssetsBlock {
    margin-bottom: rem(40px);
}
.totalAssetsInfo {
    font-size: rem(28px);
    .label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: rem(46px);
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        line-height: rem(46px);
        .left {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .tag {
            height: rem(40px);
            margin-left: rem(10px);
            padding: rem(5px) rem(10px);
            color: var(--success);
            font-size: rem(20px);
            line-height: rem(40px);
            text-align: center;
            border: 1px solid var(--success);
            border-radius: rem(6px);
        }
    }
    .icon_zijinmingxi {
        color: var(--normalColor);
        font-size: rem(38px);
    }
    .totalAmount {
        margin-top: rem(10px);
        color: var(--color);
        font-size: rem(70px);
        letter-spacing: rem(-2px);
        word-break: break-all;
    }
}
.assetList {
    display: flex;
    flex-flow: row wrap;
    grid-template-columns: auto auto auto;
    align-content: flex-start;
    justify-content: space-around;
    font-size: rem(34px);
    line-height: 1.5;
    .item {
        flex: 50% 1;
        margin-bottom: rem(30px);
    }
    .muted {
        font-size: rem(24px);
    }
}
.btns {
    display: flex;
    height: rem(65px);
    :deep(.van-button) {
        display: block;
        width: 50%;
        height: 100%;
        margin-right: rem(20px);
        font-size: rem(28px);
        line-height: rem(70px);
        border: none;
        border-radius: rem(6px);
        &:last-child {
            flex: 1;
            margin-right: 0;
        }
        &.transfer-btn {
            color: var(--primary);
            background: none;
            border: solid 1px var(--primary);
        }
    }
}
.btns2 {
    height: rem(65px);
    margin-top: rem(30px);
    :deep(.van-button) {
        width: 100%;
        height: 100%;
        color: var(--primary);
        color: var(--primary);
        font-size: rem(28px);
        line-height: rem(70px);
        background: none;
        border: solid 1px var(--primary);
        border-radius: rem(6px);
    }
}
.riskLevel {
    position: relative;
    margin-left: rem(10px);
    padding-left: rem(25px);
    font-size: rem(22px);
    &::before {
        position: absolute;
        top: 45%;
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
