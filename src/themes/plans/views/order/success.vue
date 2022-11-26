<template>
    <div class='orderSuccess'>
        <a class='back' href='javascript:;' @click='$router.back()'>
            <i class='icon_icon_close_small'></i>
        </a>
        <span class='successIcon'>
            <SuccessAnimation :disabled-succ-animtion='$store.state.disabledSuccAnimtion' />
        </span>
        <p class='title successColor' :class="{ 'animate':!$store.state.disabledSuccAnimtion }">
            {{ $t(orderInfo.bizType===1?'trade.openPositionSuccess':'trade.openPendingSuccess') }}
        </p>

        <div class='orderInfo'>
            <div class='product'>
                <p class='productTitle'>
                    {{ product.symbolName }}
                </p>
                <p class='productCode'>
                    {{ product.symbolCode }}
                </p>
            </div>
            <template v-if='orderInfo && orderInfo.bizType===1'>
                <van-cell class='dataBar' :title="$t('trade.positionPrice')" :value='shiftedBy(orderInfo.requestPrice,orderInfo.digits*-1)' />
                <van-cell class='dataBar' :title="$t('trade.volumes')">
                    <template #default>
                        <span
                            :class="[orderInfo.direction===1?'riseColor':'fallColor']"
                        >
                            {{ orderInfo.direction===1?$t('trade.buy'):$t('trade.sell') }}
                        </span>
                        {{ orderInfo.requestNum+$t('trade.volumeUnit') }}
                    </template>
                </van-cell>
                <van-cell v-if='orderInfo.fee' class='dataBar' :title="$t('fee')">
                    <span
                        :class="[orderInfo.fee?'':'muted']"
                    >
                        {{ orderInfo.fee + accountCurrency }}
                    </span>
                </van-cell>
                <van-cell class='dataBar' :title="$t('trade.takeLoss')">
                    <span
                        v-if='orderInfo.stopLoss'
                        :class="[orderInfo.stopLoss?'':'muted']"
                    >
                        {{ shiftedBy(orderInfo.stopLoss, orderInfo.digits*-1) }}
                    </span>
                    <span v-else class='muted'>
                        {{ $t('c.noSetup') }}
                    </span>
                </van-cell>
                <van-cell class='dataBar' :title="$t('trade.takeProfit')">
                    <span
                        v-if='orderInfo.takeProfit'
                        :class="[orderInfo.takeProfit?'':'muted']"
                    >
                        {{ shiftedBy(orderInfo.takeProfit, orderInfo.digits*-1) }}
                    </span>
                    <span v-else class='muted'>
                        {{ $t('c.noSetup') }}
                    </span>
                </van-cell>
            </template>
            <template v-else-if='orderInfo'>
                <van-cell class='dataBar' :title="$t('trade.pendingPrice')" :value='shiftedBy(orderInfo.requestPrice,orderInfo.digits*-1)' />
                <van-cell class='dataBar' :title="$t('trade.volumes')">
                    <template #default>
                        <span
                            :class="[orderInfo.direction===1?'riseColor':'fallColor']"
                        >
                            {{ orderInfo.direction===1?$t('trade.buy'):$t('trade.sell') }}
                        </span>
                        {{ orderInfo.requestNum+$t('trade.volumeUnit') }}
                    </template>
                </van-cell>
                <van-cell
                    class='dataBar'
                    :title="$t('trade.expireTime')"
                    :value="orderInfo.expireType===1?$t('trade.expireType1'):$t('trade.expireType2')"
                />
                <van-cell class='dataBar' :title="$t('trade.takeLoss')">
                    <span
                        v-if='orderInfo.stopLoss'
                        :class="[orderInfo.stopLoss?'':'muted']"
                    >
                        {{ shiftedBy(orderInfo.stopLoss, orderInfo.digits*-1) }}
                    </span>
                    <span v-else class='muted'>
                        {{ $t('c.noSetup') }}
                    </span>
                </van-cell>
                <van-cell class='dataBar' :title="$t('trade.takeProfit')">
                    <span
                        v-if='orderInfo.takeProfit'
                        :class="[orderInfo.takeProfit?'':'muted']"
                    >
                        {{ shiftedBy(orderInfo.takeProfit, orderInfo.digits*-1) }}
                    </span>
                    <span v-else class='muted'>
                        {{ $t('c.noSetup') }}
                    </span>
                </van-cell>
            </template>

            <van-row class='btnGroup' gutter='10'>
                <van-col span='12'>
                    <button
                        class='primary toDetail'
                        @click='toDetail'
                    >
                        {{ $t(orderInfo.bizType==1?'trade.lookPositions':'trade.lookPendings') }}
                    </button>
                </van-col>
                <van-col span='12'>
                    <button
                        class='primaryBg goonOrder'
                        @click='$router.back()'
                    >
                        {{ $t('trade.buyAgain') }}
                    </button>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import SuccessAnimation from '@plans/components/successAnimation'
import { computed, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { shiftedBy } from '@/utils/calculation'
export default {
    components: {
        SuccessAnimation,
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        const { orderId } = route.query
        const state = reactive({
            orderInfo: JSON.parse(sessionStorage.getItem('order_' + orderId))
        })
        if (!state.orderInfo) return router.push('/')

        // 查看详情
        const toDetail = () => {
            router.push(state.orderInfo.bizType === 1 ? '/position' : '/position?tab=1')
        }
        return {
            ...toRefs(state),
            product,
            orderId,
            shiftedBy,
            toDetail,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.orderSuccess {
    position: relative;
    height: 100%;
    overflow: auto;
    background: var(--bgColor);
    .back {
        position: absolute;
        top: rem(40px);
        right: rem(40px);
        color: inherit;
        font-size: rem(40px);
        font-style: normal;
        &:active {
            box-shadow: 0 0 999px rgba(0, 0, 0, 0.05) inset;
            opacity: 0.7;
        }
    }
    .successIcon {
        position: relative;
        display: block;
        width: rem(90px);
        height: rem(90px);
        margin: rem(120px) auto 0;
        color: #FFF;
        font-size: rem(70px);
        line-height: rem(110px);
        text-align: center;
        border-radius: 100%;
    }
    .title {
        padding-top: rem(20px);
        padding-bottom: rem(20px);
        font-size: rem(34px);
        line-height: 1;
        text-align: center;
        &.animate {
            opacity: 0;
            animation: fadeInUp 0.3s linear 0.9s forwards;
        }
    }
    .adTopBox {
        width: rem(580px);
        margin: rem(50px) auto 0;
    }
    .fullScreenLink {
        width: rem(580px);
        margin: rem(30px) auto rem(90px);
        text-align: center;
    }
    .adBottomBox {
        width: rem(580px);
        margin: 0 auto rem(90px);
    }
    .orderInfo {
        box-sizing: border-box;
        width: rem(580px);
        margin: 0 auto;
        margin-top: rem(40px);
        padding: rem(66px) rem(40px);
        line-height: 1.6;
        background: var(--contentColor);
        border-radius: rem(10px);
    }
    .product {
        padding-bottom: rem(40px);
        .productTitle {
            @include single-line-clamp();
            font-size: rem(34px);
            text-align: center;
        }
        .productCode {
            color: var(--minorColor);
            font-size: rem(20px);
            text-align: center;
        }
    }
    .dataBar {
        :deep(.van-cell__title) {
            color: var(--minorColor);
        }
        :deep(.van-cell__value) {
            color: var(--color);
        }
    }
    .dataBar {
        padding: 6px 0;
        white-space: nowrap;
        &::after {
            opacity: 0;
        }
    }
    .goonOrder,
    .toDetail {
        display: block;
        width: 100%;
        height: rem(80px);
        color: #FFF;
        font-size: rem(26px);
        line-height: 1;
        text-align: center;
        border-radius: rem(6px);
        cursor: pointer;
    }
    .toDetail {
        color: var(--color);
        background-color: var(--primaryAssistColor);
    }
    .btnGroup {
        margin-top: rem(45px);
    }
    .hasAdded {
        margin-top: rem(40px);
        color: var(--minorColor);
        text-align: center;
    }
}
</style>
