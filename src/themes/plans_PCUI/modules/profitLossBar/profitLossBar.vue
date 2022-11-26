<template>
    <div class='profitLossBar'>
        <van-row align='center' justify='space-between'>
            <van-col>
                <slot name='title'></slot>
            </van-col>
            <van-col class='relative'>
                <StepperComp
                    v-model='num'
                    class='stepper'
                    :class="{ 'warn': warn }"
                    :controlbtn='true'
                    :digits='product.price_digits'
                    :max='max'
                    :min='min'
                    :step='step'
                    @change='change'
                    @firstMinus='firstChange'
                    @firstPlus='firstChange'
                />
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { plus, div, pow, lt, gt } from '@/utils/calculation'
import StepperComp from '@planspc/components/stepper'

export default {
    components: {
        StepperComp,
    },
    props: ['modelValue', 'product', 'min', 'max'],
    emits: ['update:modelValue', 'change'],
    data () {
        return {
            num: ''
        }
    },
    computed: {
        step () {
            return pow(0.1, this.product.price_digits)
        },
        warn () {
            const minInvalid = this.modelValue && lt(this.modelValue, this.min)
            const maxInvalid = this.modelValue && gt(this.modelValue, this.max)
            return minInvalid || maxInvalid
        }
    },
    watch: {
        modelValue (newval) {
            if (newval !== this.num) this.num = newval
        }
    },
    created () {
        this.num = this.modelValue
    },
    methods: {
        change (val) {
            this.$emit('update:modelValue', val)
            this.$emit('change', val)
        },
        firstChange () {
            const sumVal = plus(this.max, this.min)
            const val = div(sumVal, 2)
            this.$emit('update:modelValue', val)
            this.$emit('change', val)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.profitLossBar {
    align-items: center;
    padding-top: 16px;
    color: var(--minorColor);
    line-height: 1.5;
}
.stepper {
    background: var(--assistColor);
    border-radius: rem(10px);
    &.warn {
        color: var(--warn);
    }
    :deep(.input) {
        width: rem(240px);
        &::-webkit-input-placeholder {
            color: var(--placeholdColor);
        }
    }
}

</style>
