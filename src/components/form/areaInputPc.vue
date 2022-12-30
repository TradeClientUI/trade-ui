<template>
    <div class='mobileBar'>
        <div v-if="type ==='mobile'" class='zone' :class='{ "disabled": disabled }'>
            <!-- <VueSelect v-model='zoneVal' :actions='countryList' :text="type === 'mobile' ? 'name': 'countryName'" value='name' @select='zoneOnSelect' /> -->

            <el-popover v-model:visible='countryListVis' placement='bottom-start' trigger='click' width='300px'>
                <div class='country-list'>
                    <div class='search-box'>
                        <el-input
                            v-model='searchText'
                            :placeholder='$t("common.input")'
                            :prefix-icon='Search'
                            size='large'
                        />
                    </div>
                    <div v-if='fileterList.length > 0' class='country-list-container'>
                        <div
                            v-for='item in fileterList'
                            :key='item.code'
                            class='country-item'
                            @click='zoneOnSelect(item.code)'
                        >
                            <div>
                                <img
                                    alt=''
                                    class='icon-country'
                                    :src="cdnUrl+'/images/countries_flags/' + item.countryCode +'.png'"
                                    srcset=''
                                />
                                <span class='country-name'></span>{{ item.displayName }}
                            </div>
                            <div>{{ item.code }}</div>
                        </div>
                    </div>
                    <div v-else class='no-data'>
                        {{ $t('common.searchEmpty') }}
                    </div>
                </div>
                <template #reference>
                    <div class='zone-wrap'>
                        <img
                            alt=''
                            class='icon-country'
                            :src="cdnUrl+'/images/countries_flags/' + countryCode +'.png'"
                            srcset=''
                        />
                        <span class='zone-text'>
                            {{ zoneVal }}
                        </span>
                        <el-icon size='18'>
                            <CaretTop v-if='countryListVis' />
                            <CaretBottom v-else />
                        </el-icon>
                    </div>
                </template>
            </el-popover>
            <!-- <el-select
                v-model='zoneVal'
                :disabled='disabled'
                :filter-method='filterZone'
                filterable
                placeholder='Select'
                @change='zoneOnSelect'
                @visible-change='zoneOnBlur'
            >
                <el-option
                    v-for='item in fileterList'
                    :key='item.code'
                    :value='item.code'
                >
                    <span class='label-country'>
                        {{ item.countryName }}
                    </span>
                    <span
                        class='label-zone'
                    >
                        {{ item.code }}
                    </span>
                </el-option>
            </el-select> -->
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
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
    </div>
</template>

<script>
// import VueSelect from '@/components/select'
import { find } from 'lodash'
import { randomId } from '@/utils/util'
import { cdnUrl } from '@/config'
import { CaretBottom, CaretTop } from '@element-plus/icons'
export default {
    components: {
        // VueSelect
        CaretBottom,
        CaretTop
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
        type: {
            type: String,
            default: 'mobile'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isBusiness: {
            type: Boolean,
            default: false
        },
        countryCode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            value: '',
            id: this.$attrs.id || randomId(),
            filterValue: '',
            fileterList: [],
            searchText: '',
            cdnUrl,
            countryListVis: false,
            selectItem: ''
        }
    },
    computed: {
        countryList () {
            const countryList = this.isBusiness ? this.$store.getters.companyCountryList : this.$store.state.countryList
            const tempArr = []

            countryList.forEach(item => {
                const lable = this.type === 'mobile' ? item.countryCode : item.name
                const value = this.type === 'mobile' ? item.countryCode : item.code
                tempArr.push({
                    name: lable,
                    code: value,
                    countryCode: item.code,
                    countryName: item.name,
                    displayName: item.displayName,
                    formatName: item.formatName,
                    nationalCode: item.nationalCode
                })
            })
            return tempArr
        },
        zoneVal: {
            get () {
                return this.type === 'mobile' ? this.zone : this.zone.split('(')[0]
            },
            set (value) {
                if (!this.disabled) {
                    this.$emit('update:zone', value)
                }
            }
        }
    },
    watch: {
        searchText (newVal) {
            this.filterZone(newVal)
        },
        countryList: {
            handler (value) {
                this.fileterList = [
                    ...value
                ]
            },
            immediate: true
        },
        filterValue: {
            handler (value) {
                if (value) {
                    this.fileterList = this.countryList.filter(el => {
                        if ((el.code && el.code.toUpperCase().indexOf(value) !== -1) || (el.countryCode && el.countryCode.toUpperCase().indexOf(value) !== -1) || (el.displayName && el.displayName.toUpperCase().indexOf(value) !== -1)) {
                            return true
                        } else {
                            return false
                        }
                    })
                } else {
                    this.fileterList = this.countryList
                }
            },
            immediate: true
        }
    },
    emits: ['update:modelValue', 'update:zone', 'input', 'zoneSelect', 'onBlur'],
    methods: {
        onClear () {
            this.$emit('update:modelValue', '')
            this.$emit('input', '')
        },
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
        zoneOnSelect (val) {
            // {
            //     code: "86",
            //     countryCode: "ISO_3166_156",
            //     countryName: "中国大陆",
            //     name: "中国大陆 (86)",
            // }

            if (!this.disabled) {
                const typeKey = this.type === 'mobile' ? 'code' : 'countryCode'
                const item = find(this.countryList, { [typeKey]: val })

                if (!this.disabled) {
                    this.selectItem = item
                    this.$emit('update:zone', item.name)
                    this.$emit('zoneSelect', item)
                    this.countryListVis = false
                }
            }
        },
        zoneOnBlur (visible) {
            if (visible === false) {
                this.filterValue = ''
            }
        },
        onBlur ($event) {
            this.$emit('onBlur', $event.target.value)
        },
        filterZone (value) {
            value = value.toUpperCase()
            this.filterValue = value
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mobileBar {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    &>div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: 120px;
        margin-right: 10px;
        .zone-wrap {
            border-radius: 4px;
            border: solid 1px var(--lineColor);
            height: 48px;
            line-height: 48px;
            cursor: pointer;
            text-align: center;
            &:hover {
                border: solid 1px var(--primary);
            }
            .zone-text {
                vertical-align: middle;
                margin-right: 5px;
                font-size: 16px;
            }
            .el-icon {
                vertical-align: -4px;
                transition: all 0.3s;
            }
            .icon-country {
                width: 25px;
                height: 18px;
                vertical-align: middle;
                margin-right: 5px;
                border: solid 1px var(--lineColor);
            }
        }
        &.disabled {
            color: #C5C5C5;
            pointer-events: none;
        }
        :deep {
            .el-input__inner {
                height: 48px;
                color: var(--color);
                font-size: 16px;
                line-height: 48px;
                //background-color: var(--assistColor);
                border: none;
                border-radius: 4px;
            }
            .el-input__suffix-inner {
                .el-input__icon {
                    color: var(--color);
                    line-height: 48px;
                }
            }
        }
    }
}
.el-select-dropdown {
    .el-select-dropdown__item {
        padding: 0 10px;
        .label-country {
            float: left;
            width: 100px;
            overflow: hidden; //超出的文本隐藏
            white-space: nowrap; //溢出不换行
            text-overflow: ellipsis; //溢出用省略号显示
        }
        .label-zone {
            float: right;
        }
    }
}
.inputWrapper {
    position: relative;
    //background-color: var(--assistColor);
    border: solid 1px var(--lineColor);
    border-radius: 3px;
    &:hover {
        border: solid 1px var(--primary);
    }
}
.input {
    width: 100%;
    height: 48px;
    padding: 0 10px;
    font-size: 16px;
    border-radius: 3px;
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
    position: absolute;
    right: 10px;
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
.country-list {
    .search-box {
        margin-bottom: 10px;
    }
    .country-list-container {
        overflow: auto;
        max-height: 280px;
        min-height: 90px;
        .country-item {
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            line-height: 40px;
            cursor: pointer;
            .icon-country {
                vertical-align: middle;
                border: solid 1px var(--lineColor);
                width: 30px;
                height: 20px;
                margin-right: 10px;
            }
            .country-name {
                vertical-align: middle;
            }
            &:hover {
                background: var(--bgColor);
            }
        }
        &::-webkit-scrollbar-track {
            background: #FFF;
            border-radius: 10px;
            outline: none;
            border: none;
        }
    }
    .no-data {
        text-align: center;
        line-height: 40px;
    }
}
</style>
