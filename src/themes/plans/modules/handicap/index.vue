<template>
    <div v-if='product' class='handicap-header'>
        <!-- <div v-if='showField' class='my'>
            {{ $t('trade.my') }}
        </div> -->
        <div class='alignLeft ' :class="!showField ? 'pl10' : ''">
            {{ $t('trade.volumes') }}
            <!-- ({{ product.baseCurrency }}) -->
        </div>
        <div class='padding' :class="showField ? 'alignRight' : 'alignCenter'">
            {{ $t('trade.priceLabel') }}
            <!-- ({{ product.profitCurrency }}) -->
        </div>
        <!-- v-if='[3, 5, 9].indexOf(Number(tradeType)) > -1' -->
        <div class='depth alignLeft'>
            <span class='depth-select'>
                <van-popover
                    v-model:show='showPopover'
                    :actions='digitLevelList'
                    placement='top'
                    :theme='theme'
                    @select='onSelect'
                >
                    <template #reference>
                        <span>{{ curDigits }}</span>
                        <span class='triangleDiv'></span>
                    </template>
                </van-popover>
            </span>
        </div>
        <!-- <div v-else class='alignCenter'>
            {{ $t('trade.priceLabel') }}({{ product.profitCurrency }})
        </div> -->
        <div class='alignRight' :class="!showField ? 'pr10' : ''">
            {{ $t('trade.volumes') }}
            <!-- ({{ product.baseCurrency }}) -->
        </div>
        <!-- <div v-if='showField' class='my'>
            {{ $t('trade.my') }}
        </div> -->
    </div>
    <van-empty v-if='!ask_deep' :description='$t("common.noData")' image='/images/empty.png' />
    <div class='stalls-wrap' :class='{ padding: !showField }'>
        <div class='sell-wrap'>
            <div v-for='(item,index) in ask_deep' :key='index' class='item'>
                &nbsp;&nbsp;&nbsp;
                <!-- <span v-if='showField' class='label fallColor alignLeft'>
                    {{ item.unitNum === 0 ? '': item.unitNum }}
                </span> -->
                <span class='quantity alignLeft'>
                    {{ formatAmount(item.volume_ask) }}
                </span>
                <span
                    class='histogram sell-histogram'
                    :style='"width:"+ item?.width + "%"'
                ></span>

                <span class='price price-right fallColor'>
                    {{ item.price_ask }}
                </span>
            </div>
        </div>
        <div class='buy-wrap'>
            <div v-for='(item,index) in bid_deep' :key='index' class='item'>
                <span class='price riseColor '>
                    {{ item.price_bid }}
                </span>
                <span class='quantity alignRight'>
                    {{ formatAmount(item.volume_bid) }}
                </span>
                <!-- <span v-if='showField' class='label alignRight riseColor'>
                    {{ item.unitNum === 0 ? '': item.unitNum }}
                </span> -->
                &nbsp;&nbsp;&nbsp;
                <span
                    class='histogram buy-histogram'
                    :style='"width:"+ item?.width + "%"'
                ></span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { pow, formatAmount } from '@/utils/calculation'
import { localGet } from '@/utils/util'
import computeHandicap from '@plans/hooks/handicap'
export default {
    components: { },
    props: ['symbolId', 'showPending'],
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            curDigits: 0,
            showPopover: false,
            theme: localGet('invertColor') === 'light' ? 'light' : 'dark',
            tradeType: route.query.tradeType
        })

        // 获取用户类型
        const userAccountType = computed(() => store.getters['_user/userAccountType'])

        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find(item => item.symbol_id === props.symbolId))

        const { handicapResult } = computeHandicap({
            showPending: true
        })

        const ask_deep = computed(() => handicapResult?.value?.ask_deep?.slice(0))
        const bid_deep = computed(() => handicapResult?.value?.bid_deep?.slice(0))

        const accountList = computed(() => store.state._user?.customerInfo?.accountList?.filter(el => el.tradeType === Number(state.tradeType)))

        // 获取当前产品
        const product = computed(() => store.getters.productActived)

        // 是否显示'我的'列
        const showField = computed(() => {
            if (userAccountType.value !== 'G' && props.showPending) {
                return true
            } else {
                return false
            }
        })

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            var symbolDigits = product.value?.price_digits
            while (symbolDigits > -3) {
                digits.push({ text: pow(0.1, symbolDigits) })
                symbolDigits--
            }

            return digits.splice(0, 5)
        })

        // 产品切换重新订阅
        watch(() => ([product.value.symbolId]), newVal => {
            state.curDigits = digitLevelList.value[0]?.text
        })

        watchEffect(() => {
            state.curDigits = state.curDigits || digitLevelList.value[0]?.text
            store.commit('_quote/Update_deepthDigits', state.curDigits)
            if (state.curDigits) {
                QuoteSocket.deal_subscribe(product.value.symbolId, product.value.priceBreadth, state.curDigits, state.tradeType, 20)
            }
        })

        // 修改报价深度
        const onSelect = (val) => {
            state.curDigits = val.text
        }

        const queryPBOOrderPage = () => {
            const accountIds = []
            if (accountList.value && accountList.value.length > 0) {
                accountList.value.forEach(element => {
                    accountIds.push(element.accountId)
                })
                store.dispatch('_trade/queryPBOOrderPage', {
                    tradeType: state.tradeType,
                    sortFieldName: 'orderTime',
                    sortType: 'desc',
                    accountIds: accountIds + ''
                })
            }
        }

        queryPBOOrderPage()

        onBeforeUnmount(() => {
            // 组件销毁取消订阅
            QuoteSocket.cancel_subscribe(2)
            store.commit('_quote/Delete_dealList')
        })

        return {
            handicapList,
            userAccountType,
            product,
            onSelect,
            ask_deep,
            bid_deep,
            digitLevelList,
            ...toRefs(state),
            showField,
            formatAmount,
            handicapResult
            // handicapResult
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handicap-header {
    display: flex;
    align-items: center;
    height: rem(80px);
    padding: 0 rem(20px);
    line-height: rem(80px);
    >div {
        display: inline-block;
        flex: 1;
        overflow: hidden;
        color: var(--minorColor);
        font-size: rem(20px);
        white-space: nowrap;
        text-overflow: ellipsis;
        &.my {
            flex: 0 0 rem(100px);
            text-align: center;
        }
        &.padding {
            // padding: 0 rem(20px);
        }
        &.depth {
            flex: none;
            padding-left: rem(10px);
            .depth-select {
                display: block;
                height: rem(40px);
                padding: 0 rem(10px);
                line-height: rem(40px);
                background-color: var(--assistColor);
                border-radius: rem(6px);
                span {
                    margin-left: rem(10px);
                    //vertical-align: middle;
                }
                :deep(.van-popover__wrapper) {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .triangleDiv {
                        width: 0;
                        height: 0;
                        margin-left: rem(10px);
                        border-color: var(--minorColor) transparent transparent;
                        border-style: solid;
                        border-width: 5px 5px 0;
                    }
                }
            }
        }
        &.pl10 {
            padding-left: rem(20px);
        }
        &.pr10 {
            padding-right: rem(20px);
        }
    }
}
.stalls-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 0 rem(5px);
    &.padding {
        padding: 0 rem(50px);
    }
    .sell-wrap,
    .buy-wrap {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: flex-start;
        color: var(--mutedColor);
        font-size: rem(22px);
        .item {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            height: rem(60px);
            //width: 100%;
            overflow: hidden;
            //padding: 0 rem(10px);
            white-space: nowrap;
            .label,
            .price,
            .quantity {
                position: relative;
                z-index: 1;
            }
            .label {
                //flex: 1;
                width: rem(100px);
            }
            .price {
                flex: 1;
                margin-right: rem(10px);
                padding-left: rem(10px);
                text-align: left;
                &.price-right {
                    text-align: right;
                }
            }
            .quantity {
                flex: 1;
                color: var(--normalColor);
                //text-align: center;
            }
            .histogram {
                position: absolute;
                // top: 0;
                // width: 0;
                // max-width: 100%;
                height: 100%;
                opacity: 0.2;
                // transition: width 0.28s ease-in-out;
                &.sell-histogram {
                    right: 0;
                    background: var(--fallColor);
                    opacity: 0.05;
                }
                &.buy-histogram {
                    background: var(--riseColor);
                    opacity: 0.05;
                }
            }
        }
    }
    .scale-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        box-sizing: border-box;
        height: rem(50px);
        padding: 0 rem(10px);
        .left {
            display: block;
            flex: 0 0 50%;
            height: rem(10px);
            // background: linear-gradient(-60deg, transparent rem(5px), rgb(15, 52, 255) 0);
            transition: flex 0.28s ease-in-out;
        }
        .right {
            display: block;
            flex: 1;
            height: rem(10px);
            // background: linear-gradient(127deg, transparent rem(5px), rgb(247, 75, 33) 0);
        }
    }
}
</style>
