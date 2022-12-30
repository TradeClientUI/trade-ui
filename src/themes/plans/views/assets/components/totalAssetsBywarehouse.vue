<template>
    <div class='totalAssets'>
        <!-- v-if='assetsInfo && assetsInfo.totalBalance>0' -->
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <div class='label'>
                    <p class='name'>
                        <span @click='showExplain(5)'>
                            {{ $t('trade.freeMargin') }}({{ assetsInfo?.currency }})
                        </span>
                        <van-icon class='question' name='question-o' @click='showExplain(5)' />
                    </p>
                    <span class='tag'>
                        <i class='icon_zijinmingxi' @click="$router.push({ name:'Record',query:{ tradeType:tradeType, accountId:assetsInfo.accountId } })"></i>
                    </span>
                </div>
                <p class='totalAmount'>
                    {{ userAccount?.availableMargin || '--' }}
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    <span @click='showExplain(6)'>
                        {{ $t('trade.allOriginalMargin') }}
                    </span>
                    <van-icon class='question' name='question-o' @click='showExplain(6)' />
                </p>
                <p>{{ userAccount?.occupyMargin || '--' }}</p>
            </li>
        </ul>

        <div class='btns'>
            <template v-if='businessConfig?.tradeTypeShowCash.includes(Number(tradeType)) && customerInfo.companyType === "real"'>
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
    </div>

    <!-- 说明弹窗 -->
    <explain-popup
        v-model='isExplain'
        :explain-type='explainType'
        :user-account='userAccount'
    />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import explainPopup from './explain-popup.vue'

export default {
    components: {
        explainPopup
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
        const assetsInfo = computed(() => store.state._user.customerInfo.accountList && store.state._user.customerInfo.accountList.find(el => Number(el.tradeType) === Number(tradeType.value)))
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType.value)))
        const customerInfo = computed(() => store.state._user.customerInfo)
        const userAccount = computed(() => store.state._user.accountAssets[2])
        const accountInfo = computed(() => accountList?.value[0])
        const state = reactive({
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0
        })

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

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
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

        return {
            assetsInfo,
            userAccount,
            tradeType,
            toTransfer,
            showExplain,
            toDesposit,
            toWirhdraw,
            customerInfo,
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
    .question {
        margin-top: rem(-10px);
        margin-left: rem(8px);
        font-size: rem(32px);
    }
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
        .name {
            display: inline-flex;
            align-items: center;
        }
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
    }
}
.btns {
    display: flex;
    .van-button {
        display: block;
        width: 100%;
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
</style>
