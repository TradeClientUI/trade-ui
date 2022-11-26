<template>
    <div class='pcInputBar'>
        <input
            ref='inputEl'
            class='pcInput'
            :class='{ block }'
            :placeholder='placeholder'
            :type='type'
            :value='modelValue'
            @blur='onBlur'
            @input='onInput'
        />
        <span v-if='clear' v-show='modelValue.length' class='van-badge__wrapper van-icon van-icon-clear' @click='onClear'></span>
        <slot></slot>
    </div>
</template>

<script>
import { reactive, computed, ref } from 'vue'
export default {
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        block: {
            type: Boolean,
            default: false
        },
        clear: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
    },
    emits: ['update:modelValue', 'onBlur'],
    setup (props, { emit }) {
        const inputEl = ref()

        // 输入内容
        const onInput = event => {
            const val = event.target.value
            emit('update:modelValue', val)
        }
        // 离开输入框
        const onBlur = event => {
            emit('onBlur', event.target.value)
        }

        // 清空内容
        const onClear = event => {
            if (inputEl.value) inputEl.value.value = ''
            emit('update:modelValue', '')
        }
        return {
            inputEl,
            onInput,
            onBlur,
            onClear,
        }
    }
}
</script>

<style lang="scss" scoped>
.pcInputBar {
    display: flex;
    align-items: center;
    background: var(--assistColor);
}
.pcInput {
    flex: 1;
    height: 48px;
    padding: 0 0 0 20px;
    line-height: 48px;
    ::placeholder {
        color: var(--placeholdColor);
    }
    &.block {
        width: 100%;
    }
}
.van-icon-clear {
    margin-top: -3px;
    padding: 0 10px;
    color: var(--minorColor);
    font-size: 18px;
    cursor: pointer;
}

</style>
