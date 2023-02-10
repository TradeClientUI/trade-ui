<template>
    <div
        v-if='productList && productList.length > 0'
        class='product-list'
    >
        <h3>{{ t('latestTradingOpportunities') }}</h3>
        <van-row class='product-list-title'>
            <van-col span='12'>
                {{ $t('common.symbolName') }}
            </van-col>
            <van-col class='text-right' span='6'>
                {{ $t('latestPrice') }}
            </van-col>
            <van-col class='text-right' span='6'>
                {{ $t('24Hchange') }}
            </van-col>
        </van-row>
        <van-row
            v-for='item in productList'
            :key='item.symbolId'
            class='product-list-content'
            @click='toProduct(item.symbolId, item.tradeType)'
        >
            <van-col span='12'>
                <div class='list-title'>
                    <div class='icon'>
                        <img
                            :src='`/images/currency_icon/${item.baseCurrency}.png`'
                        />
                        <img
                            :src='`/images/currency_icon/${item.profitCurrency}.png`'
                        />
                    </div>
                    <div class='name font-medium'>
                        {{ item.symbolName }}
                    </div>
                </div>
            </van-col>
            <van-col class='text-right' span='6'>
                {{ item.rolling_last_price || "--" }}
            </van-col>
            <van-col class='text-right' span='6'>
                <span
                    :class="[
                        item.rolling_upDownColor,
                        'font-medium',
                    ]"
                >
                    {{ item.rolling_upDownWidth || "--" }}
                </span>
            </van-col>
        </van-row>
    </div>
</template>

<script setup >
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'

const store = useStore()
const router = useRouter()

const businessConfig = computed(() => store.state.businessConfig)

// 获取配置的需要展示的产品
const productList = computed(() => {
    const productKeys = []
    const ids = businessConfig.value.registerSuccessProductIds || []
    // businessConfig文件配置需要展示的产品
    const list = store.state._quote.productList
        .filter((item) => ids.includes(item.symbolId))
        .map((item) => {
            productKeys.push(item.symbolId + '_' + item.tradeType)
            return item
        })
    // 订阅产品数据
    QuoteSocket.send_subscribe24H(productKeys)
    return list
})

const toProduct = (symbolId, tradeType) => {
    router.push({ path: '/product', query: { symbolId, tradeType } })
}
</script>

<style scoped lang="scss">
.product-list {
    margin-bottom: rem(40px);
    h3 {
        margin-bottom: 8px;
    }
    .product-list-title {
        color: var(--minorColor);
        padding: 12px 0;
    }
    .product-list-content {
        padding: 12px 0;
        &:hover {
            background-color: var(--bgColor);
        }
        .van-col:not(:nth-of-type(1)) {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
    .list-title {
        display: flex;
        align-items: center;
        color: var(--color);
        font-size: 14px;
        .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .icon {
            display: flex;
            align-items: center;
            margin-right: 8px;
            img {
                width: 24px;
                height: 24px;
                border-radius: 100%;
                &:last-child {
                    margin-left: -10px;
                }
            }
        }
    }
}
.text-right {
    text-align: right;
}
.font-medium {
    font-weight: 500;
}
</style>
