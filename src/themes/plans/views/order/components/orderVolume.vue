<template>
    <div class='orderVolume'>
        <div v-if='[2].includes(product.tradeType)' class='entry-type'>
            <div class='left active'>
                {{ parseInt(entryType) === 1 ? $t('trade.volumes') : $t('trade.margin') }}
            </div>
            <div class='right' @click='entryTypeUpdate'>
                <van-icon name='arrow' />
                {{ parseInt(entryType) === 1 ? $t('trade.margin') : $t('trade.volumes') }}
            </div>
        </div>
        <input
            ref='inputEl'
            class='input'
            :placeholder='placeText'
            type='text'
            :value='modelValue'
            @blur='onBlur'
            @focus='onFocus'
            @input='onInput'
        />
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
export default {
    props: {
        product: {
            type: Object
        },
        account: {
            type: [Object, String]
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        entryType: {
            type: [Number, String],
            default: 1 // 1按数量下单 2按成交额下单
        },
    },
    emits: ['update:modelValue', 'change', 'update:entryType'],
    setup (props, { emit }) {
        const inputEl = ref(null)
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const placeText = ref('')
        const placeholder = computed({
            get () {
                const curTradeType = props.product.tradeType
                if (curTradeType === 1) {
                    const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === curTradeType)
                    const currencyText = account?.currency ? `(${account?.currency})` : ''
                    const product = props.product
                    const volumeRange = product.minVolume ? `${t('trade.orderVolume')} ${product.minVolume + t('trade.volumeUnit')} - ${product.maxVolume + t('trade.volumeUnit')}` : ''
                    return parseInt(props.entryType) === 1 ? volumeRange : t('trade.orderAmount') + currencyText
                    // } else if ([3].includes(curTradeType)) {
                    //     return t('trade.orderVolume') + `(${props.product.baseCurrency})`
                } else if (curTradeType === 2) {
                    const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === curTradeType)
                    const currencyText = account?.currency ? `(${account?.currency})` : ''
                    return parseInt(props.entryType) === 1 ? t('trade.orderVolume') + '(' + t('trade.volumeUnit') + ')' : t('trade.margin') + currencyText
                } else if ([3, 5].includes(curTradeType)) {
                    return parseInt(props.entryType) === 1 ? t('trade.orderVolume') + `(${props.product.baseCurrency})` : t('trade.orderAmount') + `(${props.product.profitCurrency})`
                } else {
                    return parseInt(props.entryType) === 1 ? t('trade.volumes') : t('trade.orderAmount')
                }
            },
            set (val) {
                placeText.value = val
            }

        })

        watchEffect(() => {
            placeText.value = placeholder.value
        })

        const onInput = (e) => {
            let newval = e.target.value
            if (/[^0-9\.]/.test(newval)) { // 只能输入数字
                newval = newval.replace(/[^0-9\.]/g, '')
                e.target.value = newval
            }
            const minVolumeDigits = props.product?.numberDigits
            const digits = parseInt(props.entryType) === 1 ? minVolumeDigits : props?.account?.digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg) && newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            emit('update:modelValue', newval)
            emit('change', newval)
        }
        const onBlur = (e) => {
            placeText.value = placeholder.value
            let value = e.target.value
            if (value === props.modelValue) return false
            const minVolumeDigits = props.product?.numberDigits
            const digits = parseInt(props.entryType) === 1 ? minVolumeDigits : props?.account?.digits
            value = value ? toFixed(value, digits) : value
            emit('change', value)
        }

        // 切换数量下单、金额下达
        const entryTypeUpdate = () => {
            emit('update:modelValue', '')
            emit('update:entryType', props.entryType === 1 ? 2 : 1)
        }

        const onFocus = () => {
            placeholder.value = ''
        }

        return {
            inputEl,
            entryTypeUpdate,
            placeholder,
            onInput,
            onBlur,
            onFocus,
            placeText
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderVolume {
    position: relative;
    margin-top: rem(20px);
    .entry-type {
        display: flex;
        justify-content: space-between;
        margin-bottom: rem(15px);
        color: var(--primary);
        font-size: rem(28px);
        fint-weight: 500;
        .active {
            color: var(--color);
        }
        .right {
            .van-icon {
                margin-right: -2px;
            }
        }
    }
    .input {
        width: 100%;
        height: rem(80px);
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        background: var(--assistColor);
        border-radius: rem(6px);
    }
    .entryType {
        position: absolute;
        right: rem(20px);
        height: rem(80px);
        color: var(--color);
        line-height: rem(80px);
    }
}
</style>
