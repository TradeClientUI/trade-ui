<template>
    <div class='mobileBar van-hairline--bottom'>
        <div v-if='zoneShow' class='zone' :class='{ disabled: disabled }'>
            <!-- <VueSelect
                v-model='zoneVal'
                :actions='countryList'
                :show-select='showSelect'
                text='code'
                value='code'
                @select='zoneOnSelect'
            /> -->
            <div class='selectWrap'>
                <span class='selectval' @click='zoneOnSelect'>
                    {{ zoneVal }}
                    <van-icon v-if='showSelect' name='arrow-down' />
                </span>
            </div>
        </div>
        <div class='inputWrapper'>
            <input
                :id='id'
                class='input'
                v-bind='$attrs'
                required
                :type='inputType'
                :value='modelValue'
                @input='onInput'
            />
            <label v-if='label' class='label' :for='id'>
                {{ label }}
            </label>
        </div>
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
    </div>
</template>

<script>
import VueSelect from '@/components/select'
import { randomId } from '@/utils/util'
export default {
    components: {
        VueSelect
    },
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        zoneShow: {
            type: Boolean,
            default: true
        },
        zone: {
            type: [Number, String],
            default: ''
        },
        inputType: {
            type: [String, Number],
            default: 'tel'
        },
        label: {
            type: [String, Number],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showSelect: {
            type: Boolean,
            default: true
        },
        openAccountType: {
            type: [Number],
            default: 0
        },
        allCountry: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            value: '',
            id: this.$attrs.id || randomId(),
            allCountryList: []
        }
    },
    computed: {
        countryList () {
            if (this.allCountry) {
                return this.allCountryList
            } else {
                const countryList = this.$store.state.countryList || []
                const tempArr = []
                countryList.forEach(item => {
                    tempArr.push({
                        name: item.name + ' (' + item.countryCode + ')',
                        code: item.countryCode,
                        countryCode: item.code,
                        countryName: item.name
                    })
                })
                return tempArr
            }
        },
        zoneVal: {
            get () {
                return this.zone
            },
            set (value) {
                if (!this.disabled) {
                    this.$emit('update:zone', value)
                }
            }
        }
    },
    emits: ['update:modelValue', 'update:zone', 'input', 'zoneSelect'],
    mounted () {
        this.$store.dispatch('getCountryListByParentCode').then(res => {
            if (res.data.length > 0) {
                const tempArr = []
                res.data.forEach(item => {
                    tempArr.push({
                        name: item.name + ' (' + item.countryCode + ')',
                        code: item.countryCode,
                        countryCode: item.code,
                        countryName: item.name
                    })
                })
                this.allCountryList = tempArr
            }
        })
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
            if (!this.disabled) {
                // this.$emit('update:zone', item.code)
                this.$emit('zoneSelect', item)
            }
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
    position: relative;
    align-items: center;
    width: 100%;
    .icon_arrow-down {
        position: absolute;
        top: rem(25px);
        right: rem(10px);
    }
}
</style>
