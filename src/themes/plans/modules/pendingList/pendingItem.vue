<template>
    <div class='product-item' @click='toPositionDetail(data)'>
        <!-- {{ data.direction }} -->
        <div class='item'>
            <div class='cell'>
                <div class='th'>
                    <div class='name'>
                        {{ data.symbolName }}
                    </div>
                    <div class='lot'>
                        {{ data.symbolCode }}
                    </div>
                </div>
            </div>
            <div class='cell'>
                <div class='price'>
                    <div>
                        <div class='price_item'>
                            <span class='title' :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                            </span><span>
                                {{ data.requestNum }} {{ $t('trade.volumeUnit') }}
                            </span>
                        </div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.pendingPrice') }}
                            </span>
                            <span class='grayColor'>
                                {{ shiftedBy(data.requestPrice, -1*product.price_digits) }}
                            </span>
                        </div>
                    </div><div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.expired') }}
                            </span>
                            <span class=''>
                                {{ Number(data.expireType) === 1 ? $t('trade.expireType1'): $t('trade.expireType2') }}
                            </span>
                        </div><div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.currentPrice') }}
                            </span>
                            <span :class='[Number(data.direction) === 1 ? product.buy_color : product.sell_color]'>
                                {{ Number(data.direction) === 1 ? product.buy_price : product.sell_price }}
                            </span>
                        </div>
                    </div>
                </div><div class='ft'>
                    <div class='bd' @click.stop='toProduct(data.symbolId)'>
                        <i class='icon_tubiao hidden'></i>
                    </div>
                    <van-button
                        color='#2B70AE'
                        hairline
                        size='mini'
                        type='default'
                        @click.stop='handleClose'
                    >
                        {{ $t('cancel') }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus, shiftedBy } from '@/utils/calculation'
export default {
    props: ['data'],
    emits: ['showClose'],
    setup ({ data }, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList)
        const product = computed(() => store.state._quote.productMap[data.symbolId])
        const positionVolume = computed(() => minus(data.openVolume, data.closeVolume))

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({ path: '/pendingDetail', query: { symbolId: item.symbolId, id: item.id } })
        }

        // 取消订单
        const handleClose = () => {
            emit('showClose', data)
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId } })
        }

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            shiftedBy,
            product,
            positionVolume,
            toPositionDetail,
            toProduct,
            handleClose,
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.product-item {
    .item {
        position: relative;
        margin-bottom: rem(20px);
        padding: rem(20px) rem(30px) 0;
        overflow: hidden;
        background: var(--contentColor);
        border-radius: rem(10px);
        .cell {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            margin-bottom: rem(20px);
            color: #999;
            font-size: rem(20px);
            line-height: 1.45;
            .th {
                flex: 1;
            }
            &:last-child {
                align-items: flex-end;
            }
            .bd {
                position: relative;
                top: rem(4px);
                display: inline-block;
                margin-right: rem(20px);
                text-align: center;
            }
            .price {
                flex: 1;
                .price_item {
                    display: inline-block;
                    width: rem(220px);
                    span {
                        padding: 0 rem(4px);
                    }
                    .title {
                        margin-right: rem(4px);
                        padding: 0;
                    }
                }
            }
            .ft {
                text-align: right;
                vertical-align: middle;
                .van-button {
                    vertical-align: middle;
                    background: rgb(243, 248, 255);
                    border-color: rgb(243, 248, 255);
                }
            }
            .amount {
                padding-right: rem(6px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .currency {
                position: relative;
                top: rem(6px);
            }
            .warn {
                color: #333;
                background-color: #FFA700;
            }
            .name {
                display: inline-block;
                max-width: rem(360px);
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(38px);
                vertical-align: bottom;
            }
            .lot {
                display: inline-block;
                margin-left: 0.5em;
                vertical-align: bottom;
            }
            .time {
                color: #999;
                font-size: rem(20px);
            }
        }
        .icon_tubiao {
            display: inline-block;
            width: rem(52px);
            height: rem(46px);
            font-size: rem(30px);
            font-style: normal;
            line-height: rem(46px);
            text-align: center;
            border-radius: rem(6px);
            &.hidden {
                color: #477FD3;
                background-color: var(--primaryAssistColor);
            }
        }
        .van-button {
            width: rem(124px);
            height: rem(48px);
            color: var(--primary) !important;
            font-size: rem(24px);
            line-height: rem(48px);
            background: var(--primaryAssistColor) !important;
            border-color: var(--primaryAssistColor) !important;
            border-radius: rem(6px);
        }
    }
}
</style>
