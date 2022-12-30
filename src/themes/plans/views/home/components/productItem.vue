<template>
    <li class='product-item' @click='handleJump'>
        <div class='symbol-name'>
            <div class='icon'>
                <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
                <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
            </div>
            <div class='name'>
                {{ product.symbolName }}
            </div>
        </div>
        <div class='bg'>
            <div
                class='price'
                :class='{
                    "up": (product.sell_color === "riseColor"),
                    "down": (product.sell_color === "fallColor"),
                }'
            >
                <span> {{ getVal(product.sell_price) }}</span>
            </div>
        </div>

        <div
            class='bg'
        >
            <div
                class='price'
                :class='{
                    "up": (product.buy_color === "riseColor"),
                    "down": (product.buy_color === "fallColor"),
                }'
            >
                <span> {{ getVal(product.buy_price) }}</span>
            </div>
        </div>
    </li>
</template>

<script setup>
import { computed, unref, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useSymbolIcon from '@/hooks/useSymbolIcon'

const props = defineProps({
    symbolKey: String,
    isFX: Boolean
})

const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const product = computed(() => store.state._quote.productMap[props.symbolKey])
const style = computed(() => store.state.style)
const getVal = (val) => val || '--'

const handleJump = () => {
    const currentProduct = unref(product)
    if (currentProduct?.symbolId && currentProduct?.tradeType) {
        router.push(`/product?symbolId=${currentProduct.symbolId}&tradeType=${currentProduct.tradeType}`)
    }
}
const { currencyList } = useSymbolIcon(props.symbolKey)
</script>
