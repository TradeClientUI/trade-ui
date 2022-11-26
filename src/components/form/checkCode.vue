<template>
    <div class='checkCodeBar van-hairline--bottom'>
        <div class='checkCodeInput'>
            <input
                :id='id'
                class='input'
                v-bind='$attrs'
                :placeholder='label'
                type='text'
                :value='modelValue'
                @input='onInput'
            />
            <!-- <label v-if='label' class='label' :for='id'>
                {{ label }}
            </label> -->
        </div>
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
        <button ref='getCodeBtn' class='getCodeBtn' :disabled='disabled' type='button' @click='getCode'>
            <van-loading v-if='loading' size='20px' />
            <span v-else>
                {{ getCodeText }}
            </span>
        </button>
        <!-- <div class='checkCodeBtn'>
            <van-button block :color='$store.state.style.primary' type='primary' @click="$emit('getCode')">获取验证码</van-button>
        </div> -->
    </div>
</template>

<script>
import { randomId } from '@/utils/util'
import { useI18n } from 'vue-i18n'
export default {
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        zone: {
            type: [Number, String],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        label: {
            type: [String, Number],
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 类型：login / fund
        type: {
            type: String
        }
    },
    data () {
        return {
            value: '',
            id: this.$attrs.id || randomId(),
            disabled: false,
            getCodeText: this.$t('login.getVerifyCode'),
        }
    },
    emits: ['update:modelValue', 'update:zone', 'input', 'verifyCodeSend'],
    beforeUnmount () {
        clearInterval(this.interval)
    },
    methods: {
        onClear () {
            this.$emit('update:modelValue', '')
            this.$emit('input', '')
        },
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
        zoneOnSelect (item) {
            console.log(item)
            this.$emit('update:zone', item.value)
        },
        getCode () {
            this.disabled = true
            this.$emit('verifyCodeSend', this.getCodeBtnCountDown)
            // this.getCodeBtnCountDown()
        },
        getCodeBtnCountDown (flag) {
            if (flag === false) return (this.disabled = false)
            let len = 60
            this.interval = setInterval(() => {
                if (len === 0) {
                    clearInterval(this.interval)
                    this.getCodeText = this.$t('register.reGet')
                    this.disabled = false
                    return
                }
                len--
                this.getCodeText = `${len}s`
            }, 1000)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.checkCodeBar {
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: solid 1px var(lineColor);
    .checkCodeInput {
        position: relative;
        flex: 1;
        font-size: rem(26px);

    }
    .getCodeBtn {
        margin-left: rem(20px);
        color: var(--color);
        font-size: rem(26px);
        background: none;
        cursor: pointer;
        &:disabled {
            color: var(--minorColor);
        }
    }
}
.input {
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    //color: var(--white);
    // &:focus~.label,
    // &:valid~.label {
    //     transform: scale(0.8) translateY(-90%);
    //     transform-origin: bottom left;
    // }
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
.van-icon-clear {
    color: var(--minorColor);
    font-size: rem(36px);
}
</style>
