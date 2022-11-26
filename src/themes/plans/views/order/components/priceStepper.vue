<template>
    <!-- <van-stepper
        v-model='value'
        class='priceStepper'
        :class="{ 'disabled':disabled }"
        :decimal-length='product.price_digits'
        :disabled='disabled'
        :min='-999'
        :step='step'
        @change='onChange'
        @focus='onFocus'
        @minus='onMinus'
        @plus='onPlus'
    /> -->
    <Stepper
        class='priceStepper'
        :digits='product.price_digits'
        :disabled='disabled'
        :step='step'
        :value='value'
        @change='onChange'
        @firstMinus='onFirstMinus'
        @firstPlus='onFirstPlus'
    />
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { minus, plus } from '@/utils/calculation'
import Stepper from '@/components/stepper'
import BigNumber from 'bignumber.js'
export default {
    components: {
        Stepper
    },
    props: {
        modelValue: {

        },
        product: {

        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        let prevValue = props.modelValue
        const state = reactive({
            value: props.modelValue,
        })
        const step = computed(() => Math.pow(0.1, props.product.price_digits).toFixed(props.product.price_digits) * 1)
        let type
        watch(
            () => props.modelValue,
            newVal => {
                if (newVal !== state.value) state.value = newVal
            }
        )

        const onFocus = () => {
            type = ''
        }
        const onMinus = () => {
            type = 'minus'
        }
        const onPlus = () => {
            type = 'plus'
        }
        const onChange = (newVal) => {
            // newVal = Number(newVal)
            // if (Number(prevValue) === 0 && newVal !== 0 && type) {
            //     newVal = type === 'minus' ? minus(props.product.sell_price, step.value) : plus(props.product.sell_price, step.value)
            // }
            state.value = newVal
            emit('update:modelValue', newVal)
            prevValue = newVal
        }
        const onFirstPlus = () => {
            const newVal = BigNumber(props.product.sell_price).plus(step.value).toFixed(props.product.price_digits)
            state.value = newVal
            emit('update:modelValue', newVal)
        }
        const onFirstMinus = () => {
            const newVal = BigNumber(props.product.sell_price).minus(step.value).toFixed(props.product.price_digits)
            state.value = newVal
            emit('update:modelValue', newVal)
        }

        return {
            ...toRefs(state),
            step,
            onFirstPlus,
            onFirstMinus,
            onMinus,
            onPlus,
            onChange,
            onFocus,
        }
    }
}
</script>

<style lang="scss" scoped>

.priceStepper {
    display: flex;
    width: 100%;
    &.disabled {
        :deep(.van-stepper__minus) {
            color: var(--placeholder);
        }
        :deep(.van-stepper__plus) {
            color: var(--placeholder);
        }
    }
    :deep(.van-stepper__input) {
        flex: 1;
    }
    :deep(.van-stepper__minus) {
        color: var(--primary);
        background: none;
    }
    :deep(.van-stepper__plus) {
        color: var(--primary);
        background: none;
    }
    :deep(.van-stepper__input) {
        background: none;
    }
    &.warn {
        color: var(--warn);
    }
}
</style>
