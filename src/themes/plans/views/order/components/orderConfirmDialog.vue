<template>
    <van-dialog v-model:show='show' show-cancel-button @close='close' @confirm='confirm'>
        <div class='dialog-content'>
            <!-- 市价单 -->
            <div v-if='Number(orderType) === 1'>
                <!-- 需要融资融券 -->
                <div v-if='isMarginFinancing'>
                    <!-- 买入 -->
                    <p v-if="direction === 'buy'">
                        {{ $t('trade.marketPriceConfirm.tip1',
                              { 'loanAmount': loanAmount, 'currencyType': currencyType, 'tradeDirection': directionText, 'tradeAmount': volume, 'stockName': product.symbolName })
                        }}
                    </p>
                    <!-- 卖出 -->
                    <p v-else>
                        {{ $t('trade.marketPriceConfirm.tip2',
                              { 'borrowStockamount': volume, 'tradeDirection': directionText, 'tradeAmount': volume, 'stockName': product.symbolName })
                        }}
                    </p>
                </div>
                <!-- 不需要融资融券 -->
                <div v-else>
                    <p>{{ $t('trade.marketPriceConfirm.tip3', { 'tradeDirection': directionText, 'tradeAmount': volume, 'stockName': product.symbolName }) }}</p>
                </div>
            </div>
            <!-- 限价单 -->
            <div v-if='Number(orderType) === 10'>
                <!-- 需要融资融券 -->
                <div v-if='isMarginFinancing'>
                    <!-- 买入 -->
                    <p v-if="direction === 'buy'">
                        {{ $t('trade.limitPriceConfirm.tip1',
                              { 'tradeDirection': directionText, 'inputPrice': pendingPrice, 'currencyType': currencyType, 'compareResult': compareResult, 'lastPrice': curPrice, 'loanAmount': loanAmount, 'tradeAmount': volume, 'stockName': product.symbolName })
                        }}
                    </p>
                    <!-- 卖出 -->
                    <p v-else>
                        {{ $t('trade.limitPriceConfirm.tip2',
                              { 'tradeDirection': directionText, 'inputPrice': pendingPrice, 'currencyType': currencyType, 'compareResult': compareResult, 'lastPrice': curPrice, 'borrowStockamount': volume, 'tradeAmount': volume, 'stockName': product.symbolName })
                        }}
                    </p>
                </div>
                <!-- 不需要融资融券 -->
                <div v-else>
                    <p>{{ $t('trade.limitPriceConfirm.tip3', { 'tradeDirection': directionText, 'inputPrice': pendingPrice, 'currencyType': currencyType, 'compareResult': compareResult, 'lastPrice': curPrice, 'tradeAmount': volume, 'stockName': product.symbolName }) }}</p>
                </div>
            </div>
        </div>
    </van-dialog>
</template>

<script setup>
import { ref, watch, computed, defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    // 是否显示弹窗
    modelValue: {
        type: Boolean,
        default: false
    },
    // 产品数据
    product: {
        type: Object,
        default: () => ({})
    },
    // 下单类型
    orderType: {
        type: [Number, String],
        default: ''
    },
    // 方向
    direction: {
        type: String,
        default: ''
    },
    // 挂单价
    pendingPrice: {
        type: [Number, String],
        default: ''
    },
    // 手数
    volume: {
        type: [Number, String],
        default: ''
    },
    // 融资金额
    loanAmount: {
        type: [Number, String],
        default: ''
    },
    // 可平仓股数
    canClosePositionNum: {
        type: [Number, String],
        default: ''
    }
})
const emit = defineEmits(['update:modelValue', 'confirm'])

// 是否需要融资融券
const isMarginFinancing = computed(() => {
    if (props.direction === 'buy') {
        return Number(props.loanAmount) > 0
    } else {
        return Number(props.canClosePositionNum) === 0
    }
})
// 币种
const currencyType = computed(() => {
    return props.product.labels?.toLowerCase().split(',').includes('hk-stock') ? 'HKD' : 'USD'
})
// 方向文案
const directionText = computed(() => {
    return props.direction === 'buy' ? t('trade.buy') : t('trade.sell')
})
// 当前价格
const curPrice = ref('')
// 挂单价和当前价格对比后返回的文案
const compareResult = ref('')

// 是否显示弹窗
const show = ref(false)
// 监听modelValue
watch(() => props.modelValue, () => {
    if (props.modelValue) {
        curPrice.value = props.product.cur_price
        if (Number(props.pendingPrice) > Number(curPrice.value)) {
            compareResult.value = t('common.bigThan')
        } else if (Number(props.pendingPrice) < Number(curPrice.value)) {
            compareResult.value = t('common.smallThan')
        } else {
            compareResult.value = t('common.equal')
        }
    }
    show.value = props.modelValue
})

// 关闭弹窗
const close = () => {
    emit('update:modelValue', false)
}

// 点击确认按钮
const confirm = () => {
    emit('confirm')
}
</script>

<style lang="scss" scoped>
.dialog-content {
    padding: rem(50px) rem(40px);
    font-size: rem(28px);
    color: var(--color);
}
</style>
