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
                    {{ $t('trade.jingzhi') }}
                </p>
                <p>
                    {{ userAccount?.netWorth || '--' }}
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.marginLevel') }}
                </p>
                <p>
                    {{ userAccount?.marginRadio }}%
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.freeMargin') }}
                </p>
                <p>
                    {{ userAccount?.availableMargin || '--' }}
                </p>
            </li>

            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.originalMargin') }}
                </p>
                <p>
                    {{ userAccount?.occupyMargin || '--' }}
                </p>
            </li>
        </ul>
        <div v-if='assetsInfo && $store.state._base.plans.length>1' class='btns'>
            <van-button
                size='mini'
                @click='toTransfer'
            >
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

export default {

    setup () {
        const router = useRouter()
        const store = useStore()
        const userAccount = computed(() => store.state._user.accountAssets[1])
        const { t } = useI18n({ useScope: 'global' })

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)

        const assetsInfo = computed(() => store.state._user?.customerInfo && store.state._user?.customerInfo?.accountList.find(el => Number(el.tradeType) === Number(tradeType.value)))

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType.value)))

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

        return {
            assetsInfo,
            userAccount,
            tradeType,
            toTransfer
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
        font-size: rem(24px);
    }
}
.btns {
    display: flex;
    height: rem(65px);
    //justify-content: space-evenly;
    .van-button {
        width: 100%;
        //display: block;
        //flex: 1;
        height: 100%;
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
