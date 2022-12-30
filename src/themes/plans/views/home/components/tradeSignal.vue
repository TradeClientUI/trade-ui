<template>
    <div class='tradeSignal-module'>
        <div class='title-warp'>
            <h2 class='title'>
                {{ $t('homeJD.tradingIdeas') }}
            </h2>
            <p class='title-label'>
                {{ $t('homeJD.tradingIdeasDesc') }}
            </p>
        </div>
        <TopTab
            ref='tabList'
            v-model='categoryType'
            class='tradeSortNav'
            line-width='50'
            :list='categoryList'
        />

        <div class='list'>
            <Swiper
                class='swiper'
                :long-swipes-ratio='0.1'
                :modules='modulesSwiper'
                :pagination='true'
                :space-between='32'
            >
                <SwiperSlide
                    v-for='item in productList.slice(0, 4)'
                    :key='item.symbolKey'
                >
                    <div class='list-item'>
                        <div class='list-title'>
                            <div class='icon'>
                                <img :src='`/images/currency_icon/${item.baseCurrency}.png`' />
                                <img :src='`/images/currency_icon/${item.profitCurrency}.png`' />
                            </div>
                            <div class='name'>
                                {{ item.symbolName }}
                            </div>
                        </div>
                        <div class='list-content'>
                            <p class='list-content-title'>
                                MACD
                            </p>
                            <ul class='list-desc'>
                                <li>
                                    <p class='list-time'>
                                        现在
                                    </p>
                                    <p :class='item.upDownColor'>
                                        {{ item.upDownColor === 'riseColor' ? '买入': '卖出' }}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        有效期：
                                    </p>
                                    <p>
                                        日内
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div class='list-svg'>
                            <klineSvg
                                :data='item?.kline_list'
                                :height='40'
                                :product='item'
                                :width='200'
                            />
                        </div>
                    </div>
                    <div class='list-detail'>
                        <a>
                            Details
                        </a>
                        <span>|</span>
                        <a>
                            Trade now
                        </a>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import TopTab from '@plans/components/topTab'
import { QuoteSocket } from '@/plugins/socket/socket'
import useProduct from '@plans/hooks/useProduct'
import { Pagination } from 'swiper'
import { Swiper } from 'swiper/vue/swiper'
import { SwiperSlide } from 'swiper/vue/swiper-slide'
import klineSvg from '@plans/components/klineSvg'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.css'

let unSubscribe = () => {}

const modulesSwiper = [Pagination]

const router = useRouter()
const store = useStore()
const list = ref([])
const curTab = ref(1)
const moduleId = 'quote_' + Date.now()
const tradeType = ref('1')
// 获取板块列表和所选板块的产品列表
const categoryType = ref(0)

const { categoryList, productList } = useProduct({
    tradeType,
    categoryType,
    isSort: false,
    isSelfSymbol: false,
    defaultSortField: '',
    defaultSortType: 'desc'
})

// 需要订阅的产品列表
const subscribeSymbolsList = computed(() => {
    const systemOptional = unref(categoryList.value)[unref(categoryType.value)]?.listByUser || [] // 系统默认推送的自选列表
    const symbolKeys = systemOptional.map(symbolId => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
    return symbolKeys
})

watch([() => subscribeSymbolsList.value], (val) => {
    if (val) {
        const res = val[0].map((symbolKeyAndmode) => {
            const item = symbolKeyAndmode.split('_')
            return {
                symbol_id: item[0],
                trade_type: item[1],
                trade_mode: 1,
                kline_type: 7,
                query_kline_num: 50,
                kline_timestamp_end: Math.round(new Date().getTime() / 1000).toString()
            }
        })
        // 拉取k线数据报价
        QuoteSocket.batchGetKlineData(res)
        unSubscribe = QuoteSocket.add_subscribe({ moduleId, symbolKeys: val[0] })
    }
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
.tradeSignal-module {
    @include pagePadding();
    font-weight: 500;
    .title-warp {
        margin: rem(96px) 0 rem(50px);
        .title {
            text-align: center;
            color: var(--color);
            font-size: rem(48px);
            font-weight: bold;
            line-height: rem(72px);
            margin-bottom: rem(16px);
        }
        .title-label {
            text-align: center;
            color: var(--color);
            font-size: rem(28px);
        }
    }
    .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .swiper {
            padding: 30px 10px 40px;
            flex: 1;
        }
        &-item {
            background: var(--assistColor);
            border-radius: 8px;
            padding: 24px;
            // flex: 1;
            width: 100%;
            height: 280px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            &:hover {
                box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
            }
            .list-title {
                display: flex;
                align-items: center;
                font-size: 18px;
                color: var(--color);
                line-height: 30px;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.15);
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
            .list-content {
                .list-content-title {
                    color: var(--color);
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                .list-desc {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    li {
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        .list-time {
                            margin-right: 8px;
                        }
                    }
                }
            }
            .list-svg {
                margin: 40px 0;
            }
        }
        .list-detail {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            margin-top: 15px;
            span {
                margin: 0 15px;
            }
            a {
                font-size: 16px;
                font-weight: bold;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
}
.tradeSortNav {
    border-bottom: 1px solid var(--lineColor);
    margin-bottom: 10px;
    :deep(.van-tabs__wrap) {
        .van-tab {
            flex: 1;
            &.van-tab--active {
                background: none;
            }
        }
        .van-tabs__line {
            bottom: 10px;
            height: 2px;
            background: var(--primary) !important;
        }
        .van-tab__text {
            .title {
                padding: 0;
            }
        }
    }
}
</style>
