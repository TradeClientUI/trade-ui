<template>
    <div class='assetsInfoWrapper fullPageWrapper'>
        <layoutTop
            :custom-style='{
                "background": $style.bgColor
            }'
            :title='$route.query.currency'
        />

        <div v-if='account' class='totalAsset'>
            <div class='leftInfo'>
                <p>{{ $t('assets.totalAssets') }}</p>
                <p class='totalAmount'>
                    {{ account.balance }}
                </p>
            </div>

            <div class='assets-btns'>
                <!-- <div v-if='Number(tradeType) === 3' class='assets-item-btn' @click='toLoan'>
                    {{ $t('trade.loan') }}
                </div> -->
                <div v-if='Number(tradeType) === 5' class='assets-item-btn' @click='toDesposit'>
                    {{ $t('trade.desposit') }}
                </div>
                <!-- <div v-if='Number(tradeType) === 3' class='assets-item-btn' @click='toRepayment'>
                    {{ $t('trade.repayment') }}
                </div> -->
                <div v-if='Number(tradeType) === 5' class='assets-item-btn' @click='toWithdraw'>
                    {{ $t('trade.withdraw') }}
                </div>
                <!-- <div class='assets-item-btn' @click='toTransfer'>
                    {{ $t('cRoute.transfer') }}
                </div> -->
            </div>
        </div>

        <ul class='assetInfoUl'>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.free') }}</p>
                    <p class='value'>
                        {{ account?.available }}
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('assets.frozen') }}</p>
                    <p class='value'>
                        {{ account?.frozen }}
                    </p>
                </div>
            </li>
            <li v-if='Number(tradeType) !== 5' class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.borrowed') }}</p>
                    <p class='value'>
                        {{ account?.liabilitiesPrincipal }}
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('trade.swap_2') }}</p>
                    <p class='value'>
                        {{ account?.interest }}
                    </p>
                </div>
            </li>
            <li class='item'>
                <div v-if='Number(tradeType) !== 5' class='hd'>
                    <p>{{ $t('assets.maxLoan') }}</p>
                    <p class='value'>
                        {{ account?.availableLoan }}
                    </p>
                </div>
                <div class='ft'>
                    <p :class="Number(tradeType) === 5 ? 'alignLeft': 'alignRight' ">
                        {{ $t('withdrawCoin.can') }}
                    </p>
                    <p class='value' :class="Number(tradeType) === 5 ? 'alignLeft': 'alignRight' ">
                        {{ account?.withdrawAmount }}
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {

    props: ['product'],
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            returnMoneyVisible: false,
            loanVisible: false,
            list: Array(3).fill(),
            tradeType: route.query.tradeType,
            currency: route.query.currency,
            accountId: route.query.accountId
        })
        // 颜色值
        const style = computed(() => store.state.style)
        const accountList = computed(() => store.state._user.customerInfo?.accountList || [])

        const account = computed(() => {
            return accountList.value.find(item => item.tradeType === Number(state.tradeType) && item.currency === state.currency)
        })

        store.dispatch('_user/queryAccountAssetsInfo', {
            tradeType: state.tradeType,
            accountId: parseInt(state.accountId)
        })

        const query = {
            accountId: state.accountId,
            currency: state.currency,
            tradeType: state.tradeType
        }

        // 跳转充值页面
        const toDesposit = () => {
            router.push({
                path: '/depositChoose',
                query
            })
        }

        // 跳转提现页面
        const toWithdraw = () => {
            router.push({
                path: '/withdrawAccount',
                query
            })
        }

        // 跳转到借款页面
        const toLoan = () => {
            router.push({
                path: '/loan',
                query
            })
        }

        // 跳转到还款页面
        const toRepayment = () => {
            router.push({
                path: '/returnMoney',
                query
            })
        }

        // 跳转划转页面
        const toTransfer = () => {
            router.push({
                path: '/transfer',
                query: {
                    accountId: state.accountId,
                    tradeType: state.tradeType
                }
            })
        }

        return {
            ...toRefs(state),
            accountList,
            account,
            toDesposit,
            toWithdraw,
            toLoan,
            toRepayment,
            toTransfer
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAsset {
    margin: rem(20px) ;
    padding: rem(30px);
    color: var(--minorColor);
    line-height: 1.5;
    background: var(--contentColor);
    border-radius: rem(10px);
    .totalAmount {
        color: var(--color);
        font-size: rem(70px);
        letter-spacing: rem(-2px);
        word-break: break-all;
    }
    .takeMoneyBtn {
        height: rem(48px);
        color: var(--primary);

        --van-button-primary-background-color: var(--primaryAssistColor);
        --van-button-primary-border-color: var(--primaryAssistColor);
    }
    .assets-btns{
        margin-top: rem(30px);
        display: flex;
        justify-content: space-between;
        .assets-item-btn{
            position: relative;
            height: rem(56px);
            line-height: rem(56px);
            border-radius: rem(6px);
            color: var(--primary);
            flex: 1;
            text-align: center;
            margin-right: rem(25px);
            &::after{
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                background: var(--primary);
                opacity: 0.05;
            }
            &:last-child{
                margin-right: 0;
            }
        }
    }
}
.assetInfoUl {
    margin: rem(20px);
    background: var(--contentColor);
    border-radius: rem(10px);
    .item {
        display: flex;
        justify-content: space-between;
        padding: rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
        line-height: 1.4;
        border-bottom: 1px solid var(--lineColor);
        .ft {
            text-align: right;
        }
        .value {
            color: var(--color);
            font-size: rem(28px);
        }
        &:last-child{
            border-bottom: none;
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
    .van-button {
        width: 45%;
        height: rem(80px);
        margin-bottom: rem(20px);
        color: #FFF;
        font-size: rem(30px);
        background: var(--primary);
        border: none;
        //margin: rem(20px);
        border-radius: rem(6px);
        &.full {
            width: 100%;
            margin: rem(20px);
        }
    }
}
</style>
