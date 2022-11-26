<template>
    <div class='product-item' @click='toPositionDetail(data)'>
        <div class='item'>
            <div class='cell'>
                <div class='th'>
                    <div class='name'>
                        {{ data.symbolName }}
                    </div>
                    <div class='lot'>
                        {{ product.symbolCode }}
                    </div><p>
                        <span :class="Number(data.closeDirection) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(data.closeDirection) === 1 ? $t('trade.buy') :$t('trade.sell') }}&nbsp;
                        </span>{{ data.closeVolume }} {{ $t('trade.volumeUnit') }}
                    </p>
                </div>
                <div class='ft'>
                    <span class='currency'>
                        {{ $t('trade.profit') }} ({{ customerInfo.currency }})
                    </span>
                    <div class='ft amount' :class="parseFloat(data.profit) > 0 ? 'riseColor': 'fallColor'">
                        {{ parseFloat(data.profit) > 0 ? '+': '' }}{{ data.profit }}
                    </div>
                </div>
            </div>
            <div class='cell'>
                <div class='price'>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.positionPrice') }}
                        </span><span>
                            {{ data.openPrice }}
                        </span>
                    </div><div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.swap_2') }}
                        </span>
                        <span class='grayColor'>
                            {{ data.interest }}
                        </span>
                    </div>
                    <div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.closedPrice') }}
                        </span><span class=''>
                            {{ data.closePrice }}
                        </span>
                    </div><div class='price_item'>
                        <span class='title'>
                            {{ $t('trade.fee') }}
                        </span><span class=''>
                            {{ data.commission||'--' }}
                        </span>
                    </div>
                </div>
                <div class='ft'>
                    {{ formatTime(data.closeTime) }}
                </div>
            </div>
        </div>
    </div>

    <DialogClosePosition v-if='cpVis' :data='data' :show='cpVis' @update:show='updateShow' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'
import DialogClosePosition from '@plans/components/dialogClosePosition'
export default {
    components: {
        DialogClosePosition
    },
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList)
        const product = computed(() => store.state._quote.productMap[data.symbolId])

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({ path: '/historyDetail', query: { symbolId: item.symbolId, orderId: item.orderId } })
        }

        const updateShow = (val) => {
            state.cpVis = val
        }

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            product,
            toPositionDetail,
            updateShow
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
                display: flex;
                flex: 1;
                flex-wrap: wrap;
                .price_item {
                    width: 50%;
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
                padding-top: rem(6px);
                padding-right: rem(6px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .currency {
                position: relative;
                top: rem(6px);
            }
            .warn {
                color: var(--color);
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
                background-color: #F3F8FF;
            }
        }
        .van-button {
            border-radius: rem(6px);
            &__text {
                color: #477FD3;
            }
            &--mini {
                min-width: rem(124px);
                height: rem(48px);
                padding: 0 rem(10px);
                font-size: rem(24px);
                line-height: rem(48px);
            }
        }
    }
}
</style>
