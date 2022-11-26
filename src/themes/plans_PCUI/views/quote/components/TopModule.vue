<template>
    <div class='header'>
        <div v-for='symbolKey in symbolKeys' :key='symbolKey' class='item' @click='gotoOrder(symbolKey)'>
            <span class='name'>
                {{ productMap[symbolKey]?.symbolName || '- -' }}
            </span>
            <span class='price' :class='[productMap[symbolKey]?.last_color]'>
                {{ productMap[symbolKey]?.rolling_last_price || '- -' }}
            </span>
            <currency-icon v-if='productMap[symbolKey]' class='currency-icon' :currency='productMap[symbolKey].baseCurrency' :size='32' />
            <div class='change'>
                <span class='upDownAmount' :class='[productMap[symbolKey]?.rolling_upDownColor]'>
                    {{ productMap[symbolKey]?.rolling_upDownAmount || '- -' }}
                </span>
                <span class='upDownWidth' :class='[productMap[symbolKey]?.rolling_upDownColor]'>
                    {{ productMap[symbolKey]?.rolling_upDownWidth || '- -' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import currencyIcon from '@/components/currencyIcon.vue'
const store = useStore()
const router = useRouter()
const gotoOrder = (symbolKey) => {
    const [symbolId, tradeType] = symbolKey.split('_')
    router.push({
        name: 'Order',
        query: {
            symbolId,
            tradeType
        }
    })
}
// 产品列表
const productMap = computed(() => store.state._quote.productMap)
// const symbolKeys = ['1564_5', '706_5', '709_5', '714_5', '720_5'] // pre
const symbolKeys = ['1_5', '20_5', '21_5', '38_5', '2_5'] // prd
const unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'topQuote', symbolKeys })

onUnmounted(() => {
    unSubscribe()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.header{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 40px;
    .item{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 224px;
        height: 116px;
        color: var(--color);
        background: var(--contentColor);
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        &:hover{
            box-shadow: 0 0 0 999px rgba($color: #000000, $alpha: .097) inset;
        }
        .name{
            font-size: 16px;
            font-weight: 400;
            line-height: 18px;
        }
        .price{
            font-size: 24px;
            line-height: 26px;
        }
        .change{
            height: 12px;
            line-height: 14px;
            .upDownAmount{
                margin-right: 10px;
            }
        }
        .currency-icon{
            position: absolute;
            right: 14px;
            top: 11px;
        }
    }
}
</style>
