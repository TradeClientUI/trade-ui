<template>
    <p class='title'>
        {{ $t('trade.deal') }}
    </p>
    <van-empty v-if='dealList.length === 0' :description='$t("common.noData")' image='/images/empty.png' />
    <div v-else class='content'>
        <div class='list-wrap'>
            <div class='col time-col'>
                {{ $t('trade.dealTime') }}
            </div>
            <div class='col price-col'>
                {{ $t('trade.priceLabel') }}
            </div>
            <div class='col volume-col'>
                {{ $t('trade.volumes') }}
            </div>
        </div>
        <div class='deal-list'>
            <div v-for='item in dealList' :key='item.symbolId' class='deal-item'>
                <span>{{ formatTime(item.dealTime) }}</span>

                <span :class="[Number(item.trade_direction)===1?'riseColor':'fallColor']">
                    {{ item.price }}
                </span>
                <span>{{ formatAmount(item.volume) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatAmount } from '@/utils/calculation'
export default {
    name: 'DealList',
    props: ['symbolId'],
    setup (props) {
        const store = useStore()

        // 获取成交数据
        const dealList = computed(() => store.state._quote.dealList.filter(item => Number(item.symbolId) === Number(props.symbolId)))

        // 格式化时间
        const formatTime = (val) => {
            return window.dayjs(Number(val)).format('HH:mm:ss')
        }

        return {
            dealList,
            formatAmount,
            formatTime
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.title{
    color: var(--color);
    margin-bottom: 5px;
}

.list-wrap {
    font-size: 12px;
    display: flex;
    .col {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: var(--minorColor);
        line-height: rem(50px);
        white-space: nowrap;
        text-align: left;
        &:last-child {
            margin-right: 0;
        }
        &.time-col {
            width: 25%;
        }
        .vals {
            position: absolute;
            top: rem(50px);
            z-index: 0;
            min-height: 100%;
            color: var(--normalColor);
            .val {
                display: block;
                margin: rem(15px) 0;
            }
        }
        .forWide {
            height: 0;
            margin: 0 rem(2px);
            overflow: hidden;
            color: #FFF;
            opacity: 0;
        }
    }
    .price-col {
        flex: 1;
        align-items: flex-end;
        text-align: right;
    }
    .volume-col {
        flex: 1;
        align-items: flex-end;
        margin-left: rem(6px);
        text-align: right;
    }
}
.content{
    position: relative;

    .deal-list {
        position: absolute;
        width: 100%;
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
        @media screen and (max-width: 1560px){
            font-size: 12px;
        }
        .deal-item {
            line-height: 27px;
            color: var(--normalColor);
            >span {
                display: inline-block;
                &:first-child {
                    width: 30%;
                }

                &:nth-child(2) {
                    width: 34%;
                    text-align: right;
                }
                &:last-child {
                    width: 36%;
                    text-align: right;
                }
            }
        }
    }
    .deal-list::-webkit-scrollbar {
        display: none;

    }
}
</style>
