<template>
    <div class='orderVolume'>
        <input
            ref='inputEl'
            class='input'
            :placeholder='$t("trade.priceLabel")'
            type='text'
            :value='modelValue'
            @blur='onBlur'
            @input='onInput'
        />
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { getDecimalNum, toFixed } from '@/utils/calculation'
export default {
    props: {
        product: {
            type: Object
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
    },
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const inputEl = ref(null)
        const onInput = (e) => {
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderVolume {
    margin-top: rem(20px);
    .input {
        width: 100%;
        height: rem(80px);
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        background: var(--assistColor);
    }
}
</style>
