<template>
    <div class='inputWrapper van-hairline--bottom'>
        <input
            v-if='pwd'
            :id='id'
            v-model='val'
            class='input'
            v-bind='$attrs'
            :maxlength='maxLength'
            :placeholder='label'
            required
            :type='pwdVisible ? "text" : "password"'
            @blur='onBlur'
            @input='onInput'
        />
        <input
            v-else
            :id='id'
            v-model='val'
            class='input'
            v-bind='$attrs'
            :maxlength='maxLength'
            :placeholder='label'
            required
            type='text'
            @blur='onBlur'
            @input='onInput'
        />
        <!-- <label v-if='label' class='label' :for='id'>{{ label }}</label> -->
        <a v-if='clear' v-show='val.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
        <a v-if='pwd' :class='[pwdVisible?"icon_icon_pressed":"icon_icon_default"]' href='javascript:;' @click='pwdVisible=!pwdVisible'></a>
    </div>
</template>

<script>
import { randomId } from '@/utils/util'
export default {
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: [String, Number],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        pwd: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number
        }
    },
    emits: ['update:modelValue', 'input', 'onBlur'],
    data () {
        return {
            val: this.modelValue,
            pwdVisible: false,
            id: this.$attrs.id || randomId()
        }
    },
    watch: {
        modelValue (newval) {
            if (newval !== this.val) this.val = newval
        }
    },
    methods: {
        onClear () {
            this.val = ''
            this.$emit('update:modelValue', '')
            this.$emit('input', '')
        },
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
        onBlur ($event) {
            this.$emit('onBlur', $event.target.value)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.inputWrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 0.8em;
}
.label {
    position: absolute;
    top: 0;
    left: 5px;
    height: rem(75px);
    color: var(--placeholder);
    font-size: rem(30px);
    line-height: rem(75px);
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
    &.active {
        transform: scale(0.8) translateY(-90%);
    }
}
.input {
    flex: 1;
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    //color: var(--white);
    &:focus~.label,
    &:valid~.label {
        transform: scale(0.8) translateY(-90%);
        transform-origin: bottom left;
    }
}
.van-icon-clear {
    color: var(--minorColor);
    font-size: rem(36px);
}
.icon_icon_default,
.icon_icon_pressed {
    margin-left: 0.8em;
    color: var(--minorColor);
    font-size: rem(36px);
}
</style>
