<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        @close='close'
        @open='open'
    >
        <div class='popup-assets-list'>
            <p class='title'>
                {{ direction === 'buy' ? $t('fundInfo.choosePayAsset') : $t('fundInfo.chooseRedeemWay') }}
            </p>
            <div v-for='item in list' :key='item.currencyCode' class='asset-item' @click='switchCurrency(item)'>
                <div class='left'>
                    <div class='top-block'>
                        <currencyIcon
                            :currency='item.currencyCode'
                            size='24'
                        />
                        <span class='currency'>
                            {{ item.currencyCode === 'self' ? $t('fundInfo.basketAssets') : item.currencyCode }}
                        </span>
                    </div>
                    <p v-if="item.currencyCode === 'self'" class='desc'>
                        {{ direction === 'buy' ? $t('fundInfo.payBasketBuy') : $t('fundInfo.getBasketAssets') }}
                    </p>
                    <p v-else class='desc'>
                        <span v-if="direction === 'buy'">
                            {{ $t('fundInfo.payCurrencyBuy', { currency: item.currencyCode }) }}
                        </span>
                    </p>
                    <div v-if="item.currencyCode === 'self'" class='currency-list'>
                        <currencyIcon
                            v-for='(elem, index) in fundAssetsList'
                            :key='index'
                            :currency='elem.currencyCode'
                        />
                    </div>
                </div>
                <div class='right'>
                    <van-icon :color='currency === item.currencyCode ? $style.success : $style.minorColor' name='checked' size='22' />
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import CurrencyIcon from '@/components/currencyIcon.vue'

const props = defineProps({
    // 是否显示弹窗
    show: {
        type: Boolean,
        default: false
    },
    // 资产列表
    list: {
        type: Array,
        default: () => []
    },
    // 默认选择的资产
    activeCurrency: {
        type: String,
        default: ''
    },
    // 基金底层资产列表数据
    fundAssetsList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:show', 'select'])
const route = useRoute()
const { direction } = route.query

// 当前选择的资产
const currency = ref('')

// 打开弹窗
const open = () => {
    currency.value = props.activeCurrency
}

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}

// 切换资产
const switchCurrency = (item) => {
    if (currency.value === item.currencyCode) return
    currency.value = item.currencyCode
    close()
    emit('select', item)
}
</script>

<style lang="scss" scoped>
.popup-assets-list {
    padding: rem(30px);
    background: var(--bgColor);
    .title {
        font-size: rem(32px);
        text-align: center;
    }
    .asset-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(30px);
        padding: rem(30px);
        background: var(--contentColor);
        border-radius: rem(12px);
        .top-block {
            .currency {
                margin-left: rem(15px);
                color: var(--color);
                font-weight: bold;
                vertical-align: middle;
            }
        }
        .desc {
            margin-top: rem(10px);
            color: var(--minorColor);
            font-weight: bold;
        }
        .currency-list {
            margin-top: rem(30px);
            margin-left: 10px;
            :deep(.currencyIcon) {
                width: 20px;
                margin-left: -5px;
            }
        }
    }
}
</style>
