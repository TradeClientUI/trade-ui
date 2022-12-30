<template>
    <div class='productList'>
        <!-- {{ productList }} -->
        <div class='header'>
            <div></div>
            <div></div>
            <div class='bg'>
                {{ $t('homeJD.sell') }}
            </div>

            <div class='bg'>
                {{ $t('homeJD.buy') }}
            </div>

            <div v-if='!isFX' class='flex-end'>
                {{ $t('homeJD.24hChange') }}
            </div>

            <div v-if='isFX' class='flex-end'>
                {{ $t('homeJD.change') }}
            </div>
            <div v-else class='flex-end'>
                {{ $t('homeJD.marketGap') }}
            </div>
        </div>
        <ul v-if='productList.length > 0' class='list'>
            <ProductItem
                v-for='(item, index) in currentList'
                :key='item + "_" + index'
                :is-f-x='isFX'
                :symbol-key='item'
            />
        </ul>
    </div>
</template>

<script setup>
import { computed, defineProps, watch, unref } from 'vue'
import ProductItem from './productItem.vue'
import { QuoteSocket } from '@/plugins/socket/socket'

const props = defineProps({
    productList: {
        type: Array,
        default: () => []
    },
    isFX: Boolean // 是否外汇
})

// symbolKeys
const currentList = computed(() => {
    return props.productList.map((symbolKeyAndmode) => {
        const item = symbolKeyAndmode.split('_')
        return item[0] + '_' + item[1]
    })
})

watch(() => props.productList, val => {
    if (val.length) {
        const res = val.map((symbolKeyAndmode) => {
            const item = symbolKeyAndmode.split('_')
            return {
                symbol_id: item[0],
                trade_type: item[1],
                trade_mode: item[2],
                kline_type: 7,
                query_kline_num: 50,
                kline_timestamp_end: Math.round(new Date().getTime() / 1000).toString()
            }
        })
        // 拉取k线数据报价
        QuoteSocket.batchGetKlineData(res)
    }
}, {
    immediate: true
})

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productList {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    .header {
        display: flex;
        margin-bottom: 20px;
        padding: 0 12px;
        >div {
            flex: 1;
            color: var(--normalColor);
            &:first-child {
                flex: 1.4;
                min-width: 290px;
            }
            &.bg {
                padding-right: 0;
                text-align: right;
            }
            &.flex-end {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
    .list {
        min-height: 300px;
        :deep(.product-item) {
            padding: 0 12px;
            border-bottom: solid 1px var(--lineColor);
            display: flex;
            height: 60px;
            cursor: pointer;
            &:hover {
                background-color: var(--bgColor);
            }
            >div {
                flex: 1;
                display: flex;
                align-items: center;
                font-size: 16px;
                &:first-child {
                    font-weight: bold;
                    flex: 1.4;
                    min-width: 290px;
                }
                &.flex-end {
                    display: flex;
                    justify-content: flex-end;
                }
                &.symbol-name {
                    display: flex;
                    align-items: center;
                    .icon {
                        display: flex;
                        align-items: center;
                        margin-right: rem(28px);
                        height: rem(80px);
                        img {
                            width: rem(52px);
                            height: rem(52px);
                            border: 1px solid #FFF;
                            border-radius: 100%;
                            &:last-child {
                                margin-left: -10px;
                            }
                        }
                    }
                }
                .riseColor {
                    color: var(--riseColor);
                }
                .fallColor {
                    color: var(--fallColor);
                }
                &.bg {
                    justify-content: flex-end;
                    .price {
                        position: relative;
                        background: var(--minorColor);
                        color: #FFF;
                        min-width: 126px;
                        text-align: right;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 8px 15px;
                        border-radius: 4px;
                        &.up {
                            background: var(--riseColor);
                            &::after {
                                content: '';
                                width: 0;
                                height: 0;
                                border-width: 0 6px 6px;
                                border-style: solid;
                                border-color: transparent transparent rgb(255, 255, 255);
                                margin-left: 6px;
                            }
                        }
                        &.down {
                            background: var(--fallColor);
                            &::after {
                                content: '';
                                width: 0;
                                height: 0;
                                border-width: 6px 6px 0;
                                border-style: solid;
                                border-color: #FFF transparent transparent;
                                margin-left: 6px;
                            }
                        }
                    }
                }
                .star {
                    padding: 20px 0 20px 10px;
                }
            }
        }
    }
}
body.night {
    .productList {
        .list {
            :deep(.product-item) {
                &:hover {
                    background-color: var(--contentColor);
                }
            }
        }
    }
}

</style>
