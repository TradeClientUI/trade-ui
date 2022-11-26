<template>
    <div class='assetsItem'>
        <div class='assets-top' @click='toInfo'>
            <div class='rowflex currency'>
                <span>{{ data.currency }}</span>
                <span>{{ data.balance }}</span>
            </div>
            <div class='rowflex muted mtop20'>
                <div class='asset-info'>
                    <p>{{ $t('trade.free') }}</p>
                    <p class='val'>
                        {{ data.available }}
                    </p>
                    <template v-if='Number(tradeType) !== 5'>
                        <p class='mtop10'>
                            {{ $t('trade.borrowed') }}
                        </p>
                        <p class='val'>
                            {{ data.liabilitiesPrincipal }}
                        </p>
                    </template>
                </div>
                <div class='alignRight asset-info'>
                    <p>{{ $t('assets.frozen') }}</p>
                    <p class='val'>
                        {{ data.frozen }}
                    </p>
                    <template v-if='Number(tradeType) !== 5'>
                        <p class='mtop10'>
                            {{ $t('trade.swap_2') }}
                        </p>
                        <p class='val'>
                            {{ data.interest }}
                        </p>
                    </template>
                </div>
            </div>
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
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { reactive, toRefs, computed } from 'vue'
import { plus } from '@/utils/calculation'
export default {
    props: {
        data: {
            type: Object,
        },
    },
    setup (props) {
        // console.log('propsdata===', props.data)
        const store = useStore()
        const router = useRouter()
        // 颜色值
        const style = computed(() => store.state.style)
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote
            .curTradeType || plans.value[0].id)
        const query = {
            accountId: props.data.accountId,
            currency: props.data.currency,
            tradeType: tradeType.value
        }
        const toInfo = () => {
            router.push({
                name: 'AssetsInfo',
                query
            })
        }

        // 跳转充值页面
        const toDesposit = () => {
            router.push({
                path: '/depositChoose',
                query: {
                    tradeType: tradeType.value,
                    accountId: props.data.accountId,
                    currency: props.data.currency
                }
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
                    accountId: props.data.accountId,
                    tradeType: tradeType.value
                }
            })
        }

        return {
            toInfo,
            tradeType,
            plus,
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
.assetsItem {
    padding: rem(30px);
    font-size: rem(24px);
    background: var(--contentColor);
    .rowflex {
        display: flex;
        justify-content: space-between;
        width: 100%;
        line-height: 1.5;
        &.currency {
            font-size: rem(30px);
            font-weight: bold;
        }
        .asset-info{
            .val{
                color: var(--color);
                font-size: rem(28px);
            }
        }
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

</style>
