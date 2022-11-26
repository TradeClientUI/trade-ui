<template>
    <div class='orderAssets'>
        <van-row justify='space-between'>
            <van-col>{{ $t('trade.free') }}</van-col>
            <van-col v-if='Number(product.tradeType) === 1' class='balance'>
                {{ accountTradeType1?.availableMargin }}
                {{ account.currency }}
                <router-link v-if='$store.state._base.plans.length>1' :to='$route.path + "/transfer?tradeType="+ product.tradeType'>
                    {{ $t('trade.transfer') }}
                </router-link>
            </van-col>
            <van-col v-else-if='Number(product.tradeType) === 2' class='balance'>
                {{ accountTradeType2?.availableMargin }}
                {{ account[direction]?.currency }}
                <router-link v-if='$store.state._base.plans.length>1' :to='$route.path + "/transfer?tradeType="+ product.tradeType'>
                    {{ $t('trade.transfer') }}
                </router-link>
            </van-col>
            <van-col v-else class='balance'>
                {{ account[direction]?.available }}
                {{ direction === 'buy' ? product.profitCurrency : product.baseCurrency }}
                <router-link v-if='$store.state._base.plans.length>1' :to='$route.path + "/transfer?tradeType="+ product.tradeType'>
                    {{ $t('trade.transfer') }}
                </router-link>
            </van-col>
        </van-row>

        <div v-if='[3,9].includes(product.tradeType)' class='borrowMoney'>
            <van-row class='mtop10' justify='space-between'>
                <van-col v-if='product.tradeType===3'>
                    {{ $t('trade.availableLoanAmount') }}

                    <el-popover
                        placement='top-start'
                        transition='el-fade-in-linear'
                        trigger='hover'
                        :width='500'
                    >
                        <template #reference>
                            <van-icon class='questionIcon' name='question-o' />
                        </template>

                        <div class='availableLoanContent'>
                            <p>{{ $t('trade.availableLoanContent7') }}</p>
                            <p>{{ $t('trade.availableLoanContent8') }}</p>
                        </div>
                    </el-popover>
                </van-col>
                <van-col v-else-if='product.tradeType===9'>
                    {{ $t('trade.availableLoanAgent') }}
                    <van-icon class='questionIcon' name='question-o' @click='loanTradeType9=true' />
                </van-col>
                <van-col>{{ account[direction]?.availableLoan }} {{ account[direction]?.currency }}</van-col>
            </van-row>
        </div>

        <!-- 代理可借的解说 -->
        <van-dialog v-model:show='loanTradeType9' title=''>
            <div class='availableLoanContent'>
                <p>{{ $t('trade.availableLoanContent1', [maxBorrow]) }}</p>
                <p>{{ $t('trade.availableLoanContent2') }}</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { mul, div, toFixed } from '@/utils/calculation'
export default {
    props: ['direction', 'product', 'volume', 'account'],
    setup (props, { emit }) {
        const store = useStore()
        const checked = ref(2)
        const loanTradeType9 = ref(false)
        watch(
            () => props.operationType,
            newval => { checked.value = newval },
            { immediate: true }
        )

        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)

        // 合约全仓资产
        const accountTradeType1 = computed(() => {
            const accountAssets = store.state._user.accountAssets['1']
            const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === parseInt(props.product?.tradeType))
            return Object.assign({}, account, accountAssets)
        })

        // 合约逐仓资产
        const accountTradeType2 = computed(() => store.state._user.accountAssets['2'])

        // 最大可借额度
        const maxBorrow = computed(() => {
            const assetsCurrency = store.state._user.assetsInfo?.currency
            if (props.product.tradeType === 9) return props.product.totalCredit + assetsCurrency // abcc玩法显示总授信
            const accountMapKey = `${props.product.tradeType}_${props.account[props.direction].currency}`
            const assetsId = accountMap?.value[accountMapKey]?.assetsId
            if (props.product.borrowLimitList) {
                const borrowLimit = props.product?.borrowLimitList.find(item => Number(item.assetsId) === Number(assetsId))?.value
                return borrowLimit || '--'
            }
            return '--'
        })

        // 预计占用
        const lockFunds = computed(() => {
            let amount = ''
            if (props.direction === 'buy') {
                amount = mul(props.volume, props.product.buy_price)
            } else {
                amount = props.volume
            }
            if (amount === '') amount = 0
            return toFixed(amount, props.account[props.direction].digits)
        })

        return {
            loanTradeType9,
            checked,
            maxBorrow,
            lockFunds,
            accountTradeType1,
            accountTradeType2
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderAssets {
    margin-top: 10px;
    margin-bottom: 16px;
    color: var(--minorColor);
    line-height: 1.5;
    .balance {
        color: var(--color);
        >a {
            color: var(--primary);
        }
    }
}
.borrowMoney {
    margin-top: rem(20px);
    color: var(--minorColor);
    :deep(.van-radio__icon .van-icon) {
        width: rem(30px);
        height: rem(30px);
        font-size: rem(26px);
        line-height: 0.9;
    }
    .questionIcon {
        font-size: 15px;
        cursor: pointer;
    }

    --van-radio-label-color: var(--minorColor);
}
.availableLoanContent {
    line-height: 20px;
    p {
        margin-top: rem(10px);
    }
}
</style>
