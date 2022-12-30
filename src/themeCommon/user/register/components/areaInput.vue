<template>
    <div class='mobileBar'>
        <div v-if='zoneShow' class='zone' :class='{ disabled: disabled }'>
            <div class='selectWrap'>
                <img
                    v-if='countryCode'
                    alt=''
                    class='icon-country'
                    :src="cdnUrl+'/images/countries_flags/' + countryCode +'.png'"
                    srcset=''
                />
                <span class='selectval' @click='handleVisible(true)'>
                    {{ zoneVal }}
                    <van-icon v-if='showSelect' name='arrow-down' />
                </span>
            </div>
        </div>
        <div class='inputWrapper'>
            <input
                :id='id'
                v-bind='$attrs'
                class='input'
                required
                :type='inputType'
                :value='modelValue'
                @blur='onBlur'
                @input='onInput'
            />
            <label v-if='label' class='label' :for='id'>
                {{ label }}
            </label>
        </div>
        <a
            v-if='clear'
            v-show='modelValue.length'
            class='van-icon van-icon-clear'
            href='javascript:;'
            tabindex='-1'
            @click='onClear'
        ></a>
    </div>
    <!-- 选择国家的弹窗 -->
    <CountrySheet v-model='countryVisible' :account-type='accountType' @select='zoneOnSelect' />
</template>

<script>
import { ref, computed } from 'vue'
import { randomId } from '@/utils/util'
import CountrySheet from './countrySheet.vue'
import { cdnUrl } from '@/config'
export default {
    components: {
        CountrySheet
    },
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        accountType: {
            type: Number,
            default: 0
        },
        clear: {
            type: Boolean,
            default: false
        },
        zoneShow: { // 是否显示国家区号
            type: Boolean,
            default: true
        },
        zone: { //  国家区号
            type: [Number, String],
            default: ''
        },
        inputType: { // 表单类型
            type: [String, Number],
            default: 'tel'
        },
        label: { // 其他文案
            type: [String, Number],
            default: ''
        },
        disabled: { // 禁用下拉框
            type: Boolean,
            default: false
        },
        showSelect: {
            type: Boolean, // 是否下拉箭头
            default: true
        },
        countryCode: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue', 'update:zone', 'input', 'zoneSelect', 'onBlur'],
    setup (props, { emit, attrs }) {
        const id = ref(attrs.id || randomId)

        const zoneVal = computed({
            get: () => props.zone,
            set: val => {
                if (!props.disabled) {
                    emit('update:modelValue', val)
                }
            }
        })

        // 选择国家弹窗
        const countryVisible = ref(false)

        const handleVisible = (type) => {
            countryVisible.value = type
        }

        const zoneOnSelect = (item) => {
            if (!props.disabled) {
                handleVisible(false)
                emit('zoneSelect', item)
            }
        }

        const onClear = () => {
            emit('update:modelValue', '')
            emit('input', '')
        }

        const onInput = ($event) => {
            emit('update:modelValue', $event.target.value)
            emit('input', $event.target.value)
        }

        const onBlur = ($event) => {
            emit('onBlur', $event.target.value)
        }

        return {
            id,
            zoneVal,
            onInput,
            onClear,
            onBlur,
            handleVisible,
            countryVisible,
            zoneOnSelect,
            cdnUrl
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mobileBar {
    display: flex;
    align-items: center;
    width: 100%;
    &>div {
        flex: 1;
    }
    .zone {
        flex: none;
        // width: rem(220px);
        margin-right: rem(20px);
        &.disabled {
            color: #C5C5C5;
            pointer-events: none;
        }
        :deep() {
            .selectval {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .van-icon {
                margin-top: -3px;
                margin-left: rem(10px);
            }
        }
    }
}
.inputWrapper {
    position: relative;
}
.input {
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    &:focus~.label,
    &:valid~.label {
        transform: scale(0.8) translateY(-90%);
        transform-origin: bottom left;
    }
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
:deep(.selectWrap) {
    min-width: rem(150px);
    margin-right: rem(20px);
    .icon_arrow-down {
        right: rem(25px);
    }
    &::after {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: rem(50px);
        margin-top: rem(-25px);
        background: var(--lineColor);
        content: '';
    }
}
.selectval {
    position: relative;
    display: block;
    height: rem(75px);
    padding: 0 rem(20px) 0 rem(5px);
    overflow: hidden;
    font-size: rem(26px);
    line-height: rem(75px);
    white-space: nowrap;
    text-overflow: ellipsis;
    // border-radius: rem(10px);
    // border: 1px solid var(--bdColor);
    // &:not(:disabled){
    //     @include active();
    // }
}
.selectWrap {
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    width: 100%;
    .icon_arrow-down {
        position: absolute;
        top: rem(25px);
        right: rem(10px);
    }
    .icon-country {
        margin-right: rem(10px);
        width: rem(50px);
        height: rem(38px);
        border: solid 1px var(--lineColor);
    }
}
</style>
