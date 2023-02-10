<template>
    <li v-if='product' class='product-item' @click='handleJump'>
        <div class='symbol-name'>
            <div v-if='currencyList.length' class='icon'>
                <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
                <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
            </div>
            <div class='name'>
                {{ product.symbolName }}
            </div>
        </div>
        <div>
            <klineSvg
                :color='color'
                :data='product?.kline_list'
                :height='20'
                :product='product'
                :width='90'
            />
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

        <div
            v-if='isCrypto'
            class='flex-end'
        >
            <span> {{ getVal(product.rolling_upDownWidth) }} </span>
        </div>

        <div class='flex-end'>
            <span
                v-if='!isCrypto'
            >
                {{ getVal(product.upDownWidth) }}
            </span>
            <span v-else>
                {{ getVal(formatAmount(product.rolling_transactions_number)) }}
            </span>
            <i
                :class='[
                    "icon",
                    "star",
                    isCollectRef ? "icon_hangqingliebiaoyijiazixuan": "icon_hangqingliebiaoweijiazixuan"
                ]'
                @click.stop='handleOptional'
            >
            </i>
        </div>
    </li>
</template>

<script setup>
import { computed, ref, unref, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { formatAmount } from '@/utils/calculation'
import { useStore } from 'vuex'
import hooks from '@/hooks/home/useOptional'
import klineSvg from '@plans/components/klineSvg'
import useSymbolIcon from '@/hooks/useSymbolIcon'

const props = defineProps({
    symbolKey: String,
    isCrypto: Boolean
})

const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const product = computed(() => store.state._quote.productMap[props.symbolKey])
const style = computed(() => store.state.style)
const getVal = (val) => val || '--'

const updateNum = ref(1)
const { isCollect, addOptional } = hooks()

const isCollectRef = computed(() => {
    // 计数器触发刷新
    return updateNum.value ? isCollect(product.value.tradeType, product.value.symbolId) : false
})

const handleOptional = () => {
    addOptional({
        symbolId: product.value.symbolId,
        tradeType: product.value.tradeType,
        callback: () => {
            updateNum.value += 1
        }
    })
}
// 折线图颜色
const color = computed(() => {
    const currentProduct = store.state._quote.productMap[props.symbolKey]
    if (currentProduct.last_color === 'riseColor') {
        return unref(style).riseColor
    } else if (currentProduct.last_color === 'fallColor') {
        return unref(style).fallColor
    } else {
        return ''
    }
})
const handleJump = () => {
    const currentProduct = unref(product)
    if (currentProduct?.symbolId && currentProduct?.tradeType) {
        router.push({
            name: 'Order',
            query: {
                name: currentProduct?.symbolName?.replace(/ /g, '_'),
                symbolId: currentProduct.symbolId,
                tradeType: currentProduct.tradeType
            }
        })
    }
}

const { currencyList } = useSymbolIcon(props.symbolKey)
</script>
