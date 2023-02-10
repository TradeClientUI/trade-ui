<template>
    <div class='header'>
        <div v-for='symbolKey in symbolKeys' :key='symbolKey' class='item' @click='gotoOrder(symbolKey)'>
            <div class='symbol-name'>
                <ProductIcon :symbol-key='symbolKey' />
                <span class='name'>
                    {{ productMap[symbolKey]?.symbolName || '- -' }}
                </span>
            </div>
            <span class='price' :class='[productMap[symbolKey]?.last_color]'>
                {{ productMap[symbolKey]?.rolling_last_price || '- -' }}
            </span>
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
import { computed, onUnmounted, watch, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import ProductIcon from './ProductIcon.vue'

const store = useStore()
const router = useRouter()
// 产品列表
const productMap = computed(() => store.state._quote.productMap)

const gotoOrder = (symbolKey) => {
    if (!unref(productMap)[symbolKey]) return
    const [symbolId, tradeType] = symbolKey.split('_')
    router.push({
        name: 'Order',
        query: {
            symbolId,
            tradeType
        }
    })
}
let unSubscribe = () => {}
const symbolKeys = computed(() => {
    const isDemo = store.state._user.customerInfo?.companyType === 'demo'
    return isDemo ? store.state.businessConfig?.productKeysDemo : store.state.businessConfig?.productKeys
})
// const symbolKeys = ['1353_1', '1352_1', '1351_1', '1350_1', '1349_1'] // pre
// const symbolKeys = ['1_5', '20_5', '21_5', '38_5', '2_5'] // prd

watch(() => symbolKeys.value, (val) => {
    if (val) {
        unSubscribe = QuoteSocket.add_subscribe({ moduleId: 'topQuote', symbolKeys: val })
    }
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 40px;
    .item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 224px;
        height: 116px;
        color: var(--color);
        background: var(--contentColor);
        border-radius: 10px;
        padding: 10px 20px 15px;
        line-height: normal;
        cursor: pointer;
        &:hover {
            box-shadow: 0 0 0 999px rgba($color: #000, $alpha: 0.097) inset;
        }
        .symbol-name {
            display: flex;
            align-items: center;
        }
        .symbol-icon {
            margin-right: 8px;
        }
        .name {
            font-size: 16px;
            font-weight: 400;
            line-height: 18px;
        }
        .price {
            font-size: 24px;
            line-height: 26px;
        }
        .change {
            height: 12px;
            line-height: 14px;
            .upDownAmount {
                margin-right: 10px;
            }
        }
        .currency-icon {
            position: absolute;
            right: 14px;
            top: 11px;
        }
    }
}
</style>
