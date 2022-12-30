<template>
    <div class='page-wrap'>
        <LayoutTop
            :custom-style='{
                "background": $style.bgColor
            }'
            :title='positionData?.symbolName'
        >
            <template #right>
                <i class='icon_tubiao hidden' @click='toProduct(positionData.symbolId)'></i>
            </template>
        </LayoutTop>
        <div v-if='positionData' class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub alignLeft'>
                                {{ $t('trade.profit') }}({{ assetsInfo?.currency }})
                            </div>
                            <div class='name profit' :class="parseFloat(positionData?.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                                {{ positionData?.profitLoss || '--' }}
                            </div>
                        </div>

                        <!-- abcc版本不需要显示手续费 -->
                        <!-- <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.fee') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                {{ positionData.openFee || '--' }}
                            </div>
                        </div> -->
                    </div>
                    <div v-if='Number(positionData.tradeType) === 2' class='item'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.swap_2') }}({{ assetsInfo.currency }})
                            </div>
                            <div class='name lx'>
                                {{ positionData.interest || '--' }}
                            </div>
                        </div>
                    </div>
                    <div class='btns'>
                        <div class='item-btn' @click='showSetProfit = true'>
                            {{ $t('trade.tackStopSetup') }}
                        </div>
                        <div class='item-btn' @click='closeHandler'>
                            {{ $t('trade.closeOrder') }}
                        </div>
                    </div>
                </div>
                <div class='layout layout-1'>
                    <div class='header van-hairline--bottom'>
                        <div class='col'>
                            <span class='sub direction' :class="Number(positionData?.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(positionData?.direction) === 1 ? $t('trade.buyShort') :$t('trade.sellShort') }}
                            </span>
                            <span class='name'>
                                {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                            </span>
                        </div>
                    </div>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.positionPrice') }}
                            </div>
                            <div class='name'>
                                {{ positionData?.openPrice }}
                            </div>
                        </div>
                        <div class='col alignRight'>
                            <div class='sub'>
                                {{ $t('trade.currentPrice') }}
                            </div>
                            <div class='name' :class='[Number(positionData.direction) === 1 ? product?.sell_color : product?.buy_color]'>
                                {{ (Number(positionData?.direction) === 1 ? product?.sell_price : product?.buy_price) || '--' }}
                            </div>
                        </div>
                    </div>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopLossPrice') }}
                            </div>
                            <div class='name'>
                                <span class='number'>
                                    {{ parseFloat(positionData?.stopLossDecimal) ? positionData?.stopLossDecimal : $t('trade.nosSet') }}
                                </span>
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub alignRight'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div>
                            <div class='name alignRight'>
                                <span class='number'>
                                    {{ parseFloat(positionData?.takeProfitDecimal) ? positionData?.takeProfitDecimal : $t('trade.nosSet') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.openTime') }}
                            </div>
                            <div class='name'>
                                {{ formatTime(positionData?.openTime) }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub alignRight'>
                                {{ $t('trade.positionId') }}
                            </div>
                            <div class='name'>
                                ID : {{ positionId }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <DialogSLTP
        v-if='positionData'
        :data='positionData'
        :product='product'
        :show='showSetProfit'
        @submit='setProfitSuccess'
        @update:show='updateSLTPVisible'
    />
    <DialogClosePosition
        v-if='positionData'
        v-model:show='closeVisible'
        :data='positionData'
        :product='product'
    />
</template>

<script>
import DialogSLTP from '@plans/components/dialogSLTP'
import DialogClosePosition from '@plans/components/dialogClosePosition'
import { reactive, toRefs, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { MsgSocket, QuoteSocket } from '@/plugins/socket/socket'
import { minus } from '@/utils/calculation'
export default {
    components: {
        DialogSLTP,
        DialogClosePosition,
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            showSetProfit: false,
            closeVisible: false,
        })

        const { orderId, positionId, symbolId, tradeType } = route.query

        const assetsInfo = computed(() => store.state._user.customerInfo.accountList.find(el => Number(el.tradeType) === Number(tradeType)))

        const customerInfo = computed(() => store.state._user.customerInfo)

        const positionData = computed(() => store.state._trade.positionMap[positionId + '_' + tradeType])

        const product = computed(() => store.state._quote.productMap[symbolId + '_' + tradeType])

        const positionVolume = computed(() => minus(positionData.value?.openVolume, positionData.value?.closeVolume))
        const style = computed(() => store.state.style)

        const btnBg = style.value.primary + '0D'
        const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(tradeType))?.accountId
        // 初始化设置
        const init = () => {
            QuoteSocket.send_subscribe([product.value.symbolKey])
            // 订阅资产数据
            MsgSocket.subscribedListAdd(function () {
                MsgSocket.subscribeAsset(tradeType)
            })
            if (!product.value?.minVolume) {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', {
                    symbolId,
                    tradeType: tradeType
                })
            }
            // 订阅报价
            if (positionId && !positionData.value?.positionId) {
                store.dispatch('_trade/queryPositionPage', {
                    tradeType: tradeType,
                    accountId,
                })
            }
        }

        const setProfitSuccess = () => {}
        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }
        // 平仓
        const closeHandler = () => {
            state.closeVisible = true
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId, tradeType } })
        }

        store.commit('_quote/Update_productActivedID', symbolId + '_' + tradeType)

        onMounted(() => {
            init()
        })

        onBeforeUnmount(() => {
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            ...toRefs(state),
            setProfitSuccess,
            updateSLTPVisible,
            positionVolume,
            closeHandler,
            product,
            positionData,
            orderId,
            assetsInfo,
            positionId,
            toProduct,
            btnBg
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    padding-top: 1.2rem;
    font-size: 0.37333rem;
    background: var(--bgColor);
    .m-orderInfo {
        padding: rem(20px) rem(20px) 0 rem(20px);
        .layout {
            padding: 0 rem(30px) 0;
            margin-bottom: rem(20px);
            background-color: var(--contentColor);
            border-radius: 10px;
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 0 rem(40px);
                &.item-1 {
                    padding-bottom: 0;
                }
            }
            .header{
                padding-bottom: rem(30px);
                padding-top: rem(30px);
            }
        }
        :deep(.van-button) {
            border-radius: rem(6px);
        }
        :deep(.van-button__text) {
            color: var(--primary);
        }
        :deep(.van-button__text) {
            width: rem(124px);
            height: rem(48px);
            font-size: rem(24px);
            line-height: rem(48px);
        }
        .layout-1 {
            .item-2 {
                padding-top: rem(30px);
                .col {
                    .name {
                        margin-bottom: rem(4px);
                        .number {
                            color: var(--color);
                        }
                    }
                    :nth-child(1n) {
                        .name {
                            text-align: left;
                        }
                    }
                }
            }
            .btns{
                padding-bottom: rem(30px);
                display: flex;
                justify-content: space-between;
                .item-btn{
                    height: rem(56px);
                    line-height: rem(56px);
                    border-radius: rem(6px);
                    background: v-bind(btnBg);
                    color: var(--primary);
                    flex: 1;
                    text-align: center;
                    margin-right: rem(25px);
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .name {
                font-size: rem(28px);
                &.lx{
                    font-size: rem(34px);
                }
                &.profit{
                    font-size: rem(70px);
                }
            }
            .code {
                color: var(--minorColor);
                font-size: rem(20px);
            }
            .sub {
                color: var(--minorColor);
                font-size: rem(28px);
            }
            .direction{
                display: inline-block;
                height: rem(36px);
                line-height: rem(40px);
                border-radius: rem(6px);
                color: #fff;
                text-align: center;
                padding: 0 rem(8px);
                font-size: rem(24px);
                margin-right: rem(10px);
                &.riseColor{
                    background: var(--riseColor);
                }
                &.fallColor{
                    background: var(--fallColor);
                }
            }
            .active {
                color: var(--color);
                font-size: rem(28px);
            }
        }
    }
}

</style>
