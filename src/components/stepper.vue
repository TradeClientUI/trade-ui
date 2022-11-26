<template>
    <div class='stepper'>
        <button ref='minus' class='minus van-stepper__minus' :disabled='disabledMinus' @click='minus'></button>
        <input
            class='input inputEl'
            :disabled='disabled'
            :placeholder='placeholderText'
            type='number'
            :value='modelValue'
            @blur='blur'
            @input='input'
        />
        <button ref='plus' class='plus van-stepper__plus' :disabled='disabledPlus' @click='plus'></button>
    </div>
</template>

<script>

import { plus, minus, toFixed, getDecimalNum } from '@/utils/calculation'
import { addEvent } from '@/utils/bindEvent'
export default {
    name: 'Stepper',
    props: {
        digits: {
            type: [Number, String],
            default: 2
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        step: {
            type: [Number, String],
            default: 1
        },
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: Infinity
        },
        placeholder: {
            type: [Number, String],
            default: ''
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    data () {
        return {
            data: 'value'
        }
    },
    computed: {
        placeholderText () {
            return this.placeholder || this.$t('common.noSet')
        },
        disabledPlus () {
            return this.disabled || !!(this.modelValue && Number(this.modelValue) >= this.max)
        },
        disabledMinus () {
            return this.disabled || !!(this.modelValue && Number(this.modelValue) <= this.min)
        },
    },
    mounted () {
        this.initEvent()
    },
    emits: ['update:modelValue', 'change', 'firstMinus', 'firstPlus'],
    methods: {
        minus () {
            const curval = (this.modelValue == '' || this.modelValue == 'NaN') && this.max && this.max !== Infinity ? this.max : this.modelValue
            if (this.disabledMinus) return false
            const newval = minus(curval, this.step)
            this.$emit('update:modelValue', toFixed(newval, this.digits))
            this.$emit('change', toFixed(newval, this.digits))
            if (this.modelValue == '') this.$emit('firstMinus')
        },
        input (e) {
            let newval = e.target.value
            const digits = this.digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            this.$emit('update:modelValue', newval)
            this.$emit('change', newval)
        },
        blur (e) {
            let value = e.target.value
            if (value === this.modelValue) return false
            value = value ? toFixed(value, this.digits) : value
            this.$emit('change', value)
        },
        plus () {
            const curval = this.modelValue == '' || this.modelValue == 'NaN' && this.min ? this.min : this.modelValue
            if (this.disabledPlus) return
            const newval = plus(curval, this.step)
            this.$emit('update:modelValue', toFixed(newval, this.digits))
            this.$emit('change', toFixed(newval, this.digits))
            if (this.modelValue == '') this.$emit('firstPlus')
        },
        longPressStep (type) {
            const timer = Date.now() - this.longPressTimerStart > 3000 ? 50 : 200
            this.longPressTimer = setTimeout(() => {
                this[type]()
                this.longPressStep(type)
            }, timer)
        },
        initEvent () {
            if (window.isPC) return
            const minus = this.$refs.minus
            const plus = this.$refs.plus
            const touchFn = (e) => {
                e.stopPropagation()
                e.preventDefault()
                const target = e.target
                const type = target.classList.contains('minus') ? 'minus' : 'plus'
                this[type]()
                this.longPressTimerStart = Date.now()
                this.longPressTimer = setTimeout(() => {
                    this.longPressStep(type)
                }, 600)
                return false
            }
            const touchendFn = (e) => {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer)
                }
            }
            addEvent(minus, 'touchstart', touchFn)
            addEvent(plus, 'touchstart', touchFn)
            addEvent(minus, 'touchend', touchendFn)
            addEvent(plus, 'touchend', touchendFn)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.stepper {
    font-size: 0;
    button,
    input {
        width: rem(80px);
        height: rem(80px);
        line-height: 1;
        text-align: center;
        vertical-align: middle;
        background: none;
    }
    .input {
        width: rem(180px);
        color: inherit;
        font-size: rem(28px);
    }
    button {
        color: var(--color);
        font-weight: 400;
        font-size: rem(28px);
        &:disabled {
            color: var(--mutedColor);
        }
    }
    .van-stepper__minus::before,
    .van-stepper__plus::before {
        width: 30%;
        border-color: transparent;
    }
    .van-stepper__plus::after {
        height: 30%;
        border-color: transparent;
    }
}
</style>
