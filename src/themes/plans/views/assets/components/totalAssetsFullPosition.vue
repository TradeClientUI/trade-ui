<template>
    <div class='totalAssets'>
        <!-- v-if='assetsInfo && assetsInfo.totalBalance>0' -->
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <p class='label'>
                    <span> {{ $t('assets.balance') }}({{ assetsInfo?.currency }}) </span>
                    <span class='tag'>
                        <i class='icon_zijinmingxi' @click="$router.push({ name:'Record',query:{ tradeType: tradeType, accountId:assetsInfo.accountId } })"></i>
                    </span>
                </p>
                <p class='totalAmount'>
                    {{ userAccount?.balance }}
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    <span @click='showExplain(1)'>
                        {{ $t('trade.jingzhi') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(1)' />
                </p>
                <p class='value'>
                    {{ userAccount?.netWorth || '--' }}
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span @click='showExplain(4)'>
                        {{ $t('trade.marginLevel') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(4)' />
                </p>
                <p class='value'>
                    <span>{{ userAccount?.marginRadio }}%</span>
                    <span :class='["riskLevel", "riskLevel" + userAccount?.riskStatus]'>
                        {{ riskLevelMap[userAccount?.riskStatus] }}
                    </span>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span @click='showExplain(2)'>
                        {{ $t('trade.freeMargin') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(2)' />
                </p>
                <p class='value'>
                    {{ userAccount?.availableMargin || '--' }}
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span @click='showExplain(3)'>
                        {{ $t('trade.originalMargin') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(3)' />
                </p>
                <p class='value'>
                    {{ userAccount?.occupyMargin || '--' }}
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span>
                        {{ $t('fund.acceptAmount') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(12)' />
                </p>
                <p class='value'>
                    {{ userAccount?.withdrawAmount || '--' }}
                </p>
            </li>
        </ul>
        <div v-if="customerInfo.companyType === 'demo'" class='btns'>
            <van-button
                size='mini'
                type='primary'
                @click='resetAccountConfirm'
            >
                {{ $t('mockAccount.resetAccount') }}
            </van-button>
        </div>
        <div v-if="customerInfo.companyType === 'demo'" class='reset-desc' @click='showExplain(11)'>
            <span>{{ $t('assetsExplain.text29') }}</span>
        </div>
        <div class='btns'>
            <template v-if='businessConfig?.tradeTypeShowCash?.includes(Number(tradeType)) && customerInfo.companyType === "real"'>
                <van-button
                    class='mobile_assets_deposit_ga'
                    size='mini'
                    type='primary'
                    @click='toDesposit'
                >
                    {{ $t('trade.desposit') }}
                </van-button>
                <van-button
                    size='mini'
                    type='primary'
                    @click='toWirhdraw'
                >
                    {{ $t('trade.withdraw') }}
                </van-button>
            </template>
            <van-button
                v-if='assetsInfo && $store.state._base.plans.length>1'
                size='mini'
                @click='toTransfer'
            >
                {{ $t('trade.transfer') }}
            </van-button>
        </div>

        <!-- 说明弹窗 -->
        <explain-popup
            v-model='isExplain'
            :explain-type='explainType'
            :user-account='userAccount'
        />

        <Loading :show='loading' />
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import explainPopup from './explain-popup.vue'
import { queryAccountById, resetAccount } from '@/api/user'

export default {
    components: {
        explainPopup
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const userAccount = computed(() => store.state._user.accountAssets[1])
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0,
            loading: false
        })
        // 保证金水平等级文案
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger')
        }

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)

        const assetsInfo = computed(() => store.state._user?.customerInfo && store.state._user?.customerInfo?.accountList.find(el => Number(el.tradeType) === Number(tradeType.value)))
        const accountInfo = computed(() => accountList?.value[0])

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType.value)))
        const customerInfo = computed(() => store.state._user.customerInfo)
        const businessConfig = computed(() => store.state.businessConfig)
        // 跳转划转记录
        const toTransfer = () => {
            if (!checkAssets()) return
            router.push({
                path: '/transfer',
                query: {
                    accountId: assetsInfo.value.accountId,
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

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
        }

        // 重置账户二次弹窗
        const resetAccountConfirm = () => {
            Dialog.confirm({
                title: t('mockAccount.resetTip2'),
                message: t('mockAccount.resetTip1'),
                cancelButtonText: t('common.cancel'),
                confirmButtonText: t('common.sure'),
                class: 'dialog-resetAccount'
            })
                .then(() => {
                    resetUserAccount()
                })
                .catch(() => {
                // on cancel
                })
        }

        // 重置账户
        const resetUserAccount = () => {
            state.loading = true
            resetAccount().then(res => {
                if (res.check()) {
                    Toast(t('mockAccount.resetSuccess'))
                }
            }).finally(() => {
                state.loading = false
            })
        }

        return {
            assetsInfo,
            userAccount,
            tradeType,
            toTransfer,
            riskLevelMap,
            showExplain,
            businessConfig,
            customerInfo,
            toDesposit,
            toWirhdraw,
            resetAccountConfirm,
            ...toRefs(state)
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
        justify-content: space-between;
        height: rem(46px);
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        line-height: rem(46px);
        .tag {
            color: var(--normalColor);
            font-size: rem(38px);
        }
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
        display: flex;
        align-items: center;
        font-size: rem(24px);
        .question {
            margin-top: rem(-10px);
            margin-left: rem(8px);
            font-size: rem(32px);
        }
    }
}
.btns {
    display: flex;

    //justify-content: space-evenly;
    .van-button {
        width: 100%;
        //display: block;
        //flex: 1;
        height: rem(65px);
        margin-right: rem(20px);
        color: var(--primary);
        font-size: rem(28px);
        line-height: rem(65px);
        background: none;
        border: solid 1px var(--primary);
        border-radius: rem(6px);
        &:last-child {
            margin-right: 0;
        }
    }
}
.reset-desc {
    margin: rem(30px) 0;
    text-align: right;
    text-decoration: underline;
    color: var(--normalColor);
}
.riskLevel {
    display: inline-flex;
    align-items: center;
    position: relative;
    margin-left: rem(16px);
    padding-left: rem(20px);
    font-size: rem(22px);
    &::before {
        position: absolute;
        top: 50%;
        left: 0%;
        display: block;
        width: rem(12px);
        height: rem(12px);
        border-radius: 50%;
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

<style lang="scss">
.dialog-resetAccount {
    &.van-dialog {
        .van-dialog__header {
            color: var(--color);
        }
        .van-dialog__message {
            color: var(--normalColor);
        }
    }
}
</style>
