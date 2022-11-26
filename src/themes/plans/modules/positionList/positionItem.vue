<template>
    <div class='product-item'>
        <div class='item' :data='activeNames'>
            <van-collapse
                v-model='activeNames'
                class='activeNames'
            >
                <van-collapse-item :name='data.positionId'>
                    <template #title>
                        <div class='cell'>
                            <div class='th'>
                                <div class='tl'>
                                    <span class='name'>
                                        {{ data.symbolName }}
                                    </span>
                                    <span class='lot'>
                                        {{ data.symbolCode }}
                                    </span>
                                    <div class='bd' @click.stop='toProduct(data.symbolId)'>
                                        <i class='icon_tubiao hidden'></i>
                                    </div>
                                    <span v-if='data.crossLevelNum' class='multipleVal' :class="{ arrow: data.marginSetType==='2' }" @click.stop='data.marginSetType==="2" ? $emit("showMultiplePopup",data):""'>
                                        <i>{{ data.crossLevelNum }}x</i>
                                        <i v-if="data.marginSetType==='2'" class='icon_icon_arrow'></i>
                                    </span>
                                </div>
                            </div>
                            <div class='block'>
                                <div class='bleft'>
                                    <span class='direction' :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                                        {{ Number(data.direction) === 1 ? $t('trade.buyShort') :$t('trade.sellShort') }}
                                    </span>{{ minus(data.openVolume, data.closeVolume) }} {{ $t('trade.volumeUnit') }}
                                </div>
                                <div class='bright'>
                                    <span class='ft amount' :class="parseFloat(data.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                                        {{ data.profitLoss }} {{ customerInfo.currency }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class='cell' @click.stop='toPositionDetail(data)'>
                        <div class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.positionPrice') }}
                                </div>
                                <div class='val'>
                                    {{ data.openPrice }}
                                </div>
                            </div>
                            <div class='flex-item alignRight'>
                                <div class='title'>
                                    {{ $t('trade.currentPrice') }}
                                </div>
                                <div class='cur-price' :class='[Number(data.direction) === 1 ? product?.sell_color : product?.buy_color]'>
                                    {{ Number(data.direction) === 1 ? product?.sell_price : product?.buy_price }}
                                </div>
                            </div>
                            <div v-if='Number(tradeType) === 2' class='flex-item'>
                                <div class='title alignRight'>
                                    {{ $t('trade.previewStopPrice') }}
                                </div>
                                <div class='val alignRight'>
                                    {{ data.previewStopPrice || '--' }}
                                </div>
                            </div>
                        </div>
                        <div class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.stopProfitPrice') }}
                                </div>
                                <div class='val'>
                                    {{ parseFloat(data.takeProfitDecimal) ? data.takeProfitDecimal : '--' }}
                                </div>
                            </div>
                            <div class='flex-item alignRight'>
                                <div class='title'>
                                    {{ $t('trade.stopLossPrice') }}
                                </div>
                                <div class='val'>
                                    {{ parseFloat(data.stopLossDecimal) ? data.stopLossDecimal : '--' }}
                                </div>
                            </div>
                        </div>

                        <div v-if='Number(tradeType) === 2' class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.originalMargin') }}
                                </div>
                                <div class='val'>
                                    {{ data.occupyTheMargin || '--' }}
                                </div>
                            </div>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.holdMargin') }}
                                </div>
                                <div class='val'>
                                    {{ data?.maintenanceMargin || '--' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='cell'>
                        <div class='ft'>
                            <van-button
                                v-if='Number(tradeType) === 2'
                                size='mini'
                                type='default'
                                @click.stop='$emit("showAdjustPopup",data)'
                            >
                                {{ $t('trade.modifyMargin') }}
                            </van-button>
                            <van-button
                                size='mini'
                                type='default'
                                @click.stop='$emit("showSLTP",data)'
                            >
                                {{ $t('trade.tackStopSetup') }}
                            </van-button>
                            <van-button
                                size='mini'
                                type='default'
                                @click.stop='$emit("showClose",data)'
                            >
                                {{ $t('trade.closed') }}
                            </van-button>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'
export default {
    props: ['data'],
    // emits: ['showClose', 'showAdjustPopup', 'showSLTP'],
    setup ({ data }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false,
            activeNames: []
        })
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList[tradeType.value])
        const product = computed(() => store.state._quote.productMap[data.symbolId + '_' + tradeType.value])
        const btnBg = computed(() => store.state.style.primary + '0D')

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({
                path: '/positionDetail',
                query: {
                    symbolId: item.symbolId,
                    positionId: item.positionId,
                    tradeType: item.tradeType
                }
            })
        }
        const updateShow = (val) => {
            state.cpVis = val
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId, tradeType: tradeType.value } })
        }

        watchEffect(() => {
            if (positionList.value?.length > 0) {
                state.activeNames = positionList.value.map(item => item.positionId)
            }
        })

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            product,
            toPositionDetail,
            updateShow,
            toProduct,
            minus,
            btnBg,
            tradeType
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.product-item {
    .item {
        position: relative;
        //height: rem(100px);
        //margin-bottom: rem(20px);
        overflow: hidden;
        background: var(--contentColor);
        border-bottom: solid rem(1px) var(--lineColor);
        border-radius: rem(10px);
        :deep(.van-collapse-item__title) {
            padding: rem(20px) rem(30px) 0 rem(30px);
            .van-cell__right-icon {
                color: var(--color);
                vertical-align: middle;
            }
        }
        :deep(.van-collapse) {
            .van-cell {
                &::after {
                    border: none;
                }
            }
            &::after {
                border: none;
            }
        }
        .cell {
            width: 100%;
            margin-bottom: rem(20px);
            color: var(--color);
            font-size: rem(24px);
            line-height: 1.45;
            .th {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                margin-bottom: rem(30px);
            }
            &:last-child {
                align-items: flex-end;
            }
            .bd {
                position: relative;
                display: inline-block;
                //margin-right: rem(15px);
                text-align: center;
            }
            .block{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .bleft{
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
                }
            }

            .riseColor{

            }
            .flex-wrap {
                display: flex;
                justify-content: space-between;
                margin-bottom: rem(30px);
                .flex-item {
                    display: inline-block;
                    .title {
                        padding: 0;
                        color: var(--minorColor);
                    }
                    .val {
                        color: var(--color);
                        font-size: rem(28px);
                    }
                    .cur-price{
                        font-size: rem(28px);
                    }
                    &:nth-child(2n) {
                        .val {
                            text-align: right;
                        }
                    }
                }
            }
            .ft {
                display: flex;
                vertical-align: middle;
                .van-button {
                    color: var(--primary);
                    vertical-align: middle;
                    background: v-bind(btnBg);
                    border-color: var(--primaryAssistColor);
                }
            }
            .amount {
                padding-right: rem(16px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .arrow {
                color: var(--color);
                vertical-align: middle;
            }
            .warn {
                color: var(--color);
                background-color: var(--focusColor);
            }
            .name {
                display: inline-block;
                max-width: rem(360px);
                color: var(--color);
                font-size: rem(36px);
                line-height: rem(38px);
                vertical-align: middle;
            }
            .lot {
                display: inline-block;
                margin-left: 0.5em;
                vertical-align: middle;
            }
            .time {
                color: var(--minorColor);
                font-size: rem(20px);
            }
        }
        .icon_tubiao {
            display: inline-block;
            width: rem(52px);
            height: rem(52px);
            font-size: rem(26px);
            font-style: normal;
            line-height: rem(52px);
            text-align: center;
            border-radius: rem(6px);
            &.hidden {
                color: var(--normalColor);
                margin-right: rem(10px);
            }
        }
        .van-button {
            //width: rem(165px);
            flex: 1;
            height: rem(52px);
            margin-right: rem(20px);
            color: var(--primary) !important;
            font-size: rem(24px);
            line-height: rem(48px);
            background: b-bind(--btnBg) !important;
            border: none;
            border-color: var(--btnBg) !important;
            border-radius: rem(6px);
            &:last-child{
                margin-right: 0;
            }
        }
        .multipleVal{
            vertical-align: middle;
            position: relative;
            height: rem(32px);
            line-height: rem(32px);
            padding-left: rem(8px);
            padding-right: rem(10px);
            font-size: rem(24px);
            color: var(--color);
            border-radius: 3px;
            border: 1px solid var(--color);
            &.arrow{
                padding-right: rem(50px);
                color: var(--color);
            }

            .icon_icon_arrow{
                font-size: rem(22px);
                position: absolute;
                right: 4px;
                top: -0.5px;
            }
        }
    }
}
</style>
