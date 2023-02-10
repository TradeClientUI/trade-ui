<template>
    <div class='orderVolume'>
        <input
            ref='inputEl'
            :class='["input", isDefaultValue ? "defaultInput": ""]'
            :placeholder='$t("trade.priceLabel")'
            type='text'
            :value='modelValue'
            @blur='onBlur'
            @input='onInput'
        />
        <div class='right-val'>
            {{ product?.profitCurrency || '' }}
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { getDecimalNum, toFixed } from '@/utils/calculation'
export default {
    name: 'PendingBar',
    props: {
        product: {
            type: Object
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        direction: {
            type: String
        }
    },
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const store = useStore()
        const inputEl = ref(null)
        const isDefaultValue = ref(true) // 是否预设值，预设值为placholder颜色
        const onInput = (e) => {
            isDefaultValue.value = false
            let newval = e.target.value
            if (/[^0-9\.]/.test(newval)) { // 只能输入数字
                newval = newval.replace(/[^0-9\.]/g, '')
                e.target.value = newval
            }
            const digits = props.product.price_digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            emit('update:modelValue', newval)
            emit('change', newval)
        }
        const onBlur = (e) => {
            let value = e.target.value
            if (value === props.modelValue) return false
            value = value ? toFixed(value, this.digits) : value
            emit('change', value)
        }

        return {
            inputEl,
            onInput,
            onBlur,
            isDefaultValue,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderVolume {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .input {
        width: 100%;
        line-height: 1;
        text-align: center;
        color: var(--normalColor);
        &.defaultInput {
            color: var(--placeholdColor);
        }
    }
    .right-val {
        color: var(--normalColor);
    }
}
body.night .orderVolume .right-val {
    color: #FFF;
}
</style>
