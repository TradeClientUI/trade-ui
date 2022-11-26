<template>
    <div class='tradeAssetBar'>
        <!-- 选择框 -->
        <div v-if='canChooseCurrency' class='cell' @click='chooseCurrency'>
            <div class='leftCell'>
                <p class='label'>
                    <span>{{ label }}</span>
                    <van-icon name='question-o' size='18' @click.stop="emit('open')" />
                </p>
                <div class='row'>
                    <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
                    <div>
                        <p class='currency'>
                            {{ currency === 'self' ? $t('fundInfo.basketAssets') : currency }}
                        </p>
                        <p v-if="currency === 'self'" class='assets'>
                            <span v-if="direction === 'buy'">
                                {{ $t('fundInfo.applyCountTip', { count: fundAssetsList.length }) }}
                            </span>
                            <span v-else>
                                {{ $t('fundInfo.redeemCountTip', { count: fundAssetsList.length }) }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class='rightCell'>
                <i class='arrowDown'></i>
            </div>
        </div>
        <!-- 输入框 -->
        <div v-if='!canChooseCurrency' class='cell'>
            <div class='leftCell'>
                <p class='label'>
                    <span>{{ label }}</span>
                </p>
                <div class='row'>
                    <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
                    <p class='currency'>
                        {{ currency }}
                    </p>
                </div>
            </div>
            <div class='rightCell'>
                <input
                    :placeholder='placeholder'
                    type='text'
                    :value='modelValue'
                    @blur='onBlur'
                    @input='onInput'
                />
                <a v-if='modelValue' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
            </div>
        </div>
    </div>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { debounce } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, defineProps, defineEmits } from 'vue'
const props = defineProps({
    readonly: Boolean,
    canChooseCurrency: {
        type: Boolean,
        default: false,
    },
    digits: [String, Number],
    label: String,
    currency: String,
    placeholder: String,
    modelValue: String,
    // 基金底层资产列表
    fundAssetsList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['input', 'touchCurrency', 'update:modelValue', 'open', 'clear'])
const router = useRouter()
const route = useRoute()

// 申购、赎回类型
const { direction, fundId } = route.query

// 切换币种
const chooseCurrency = () => {
    if (props.canChooseCurrency) emit('touchCurrency')
}

// 输入事件控制
const onInput = (e) => {
    let newval = e.target.value
    if (/[^0-9\.]/.test(newval)) { // 只能输入数字
        newval = newval.replace(/[^0-9\.]/g, '')
        e.target.value = newval
    }
    const digits = props.digits
    const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
    if (getDecimalNum(newval) > digits) {
        newval = (newval.match(reg) && newval.match(reg)[0]) || ''
        if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
        e.target.value = newval
    }

    inputUpdate(e)
}

// 离开输入框焦点再次验证
const onBlur = (e) => {
    let value = e.target.value
    if (value === props.modelValue) return false
    const digits = props.digits
    value = value ? toFixed(value, digits) : value
    inputUpdate(e)
}

// 输入事件，防抖
const inputUpdate = (e) => {
    if (props.readonly) return false
    emit('update:modelValue', e.target.value)
    inputHandler(e)
}

const inputHandler = debounce((e) => {
    if (props.readonly) return false
    emit('input', e.target.value, e)
}, 800)

// 点击清空
const onClear = () => {
    emit('update:modelValue', '')
    emit('input', '')
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeAssetBar {
    --van-tab-active-text-color: var(--primary);
    .cell {
        display: flex;
        align-items: center;
        padding: rem(30px);
        background: var(--assistColor);
        border-radius: 6px;
        .leftCell {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            .label {
                display: flex;
                align-items: center;
                color: var(--minorColor);
                font-size: rem(34px);
                span {
                    margin-right: rem(10px);
                }
                :deep(.van-icon) {
                    margin-top: rem(-4px);
                }
            }
            .row {
                display: inline-flex;
                align-items: center;
                margin-top: rem(20px);
                .currency {
                    margin-top: rem(4px);
                    font-weight: bold;
                    font-size: rem(30px);
                }
                .currencyImg {
                    align-self: flex-start;
                    margin-right: rem(15px);
                }
                .assets {
                    margin-top: rem(15px);
                    color: var(--minorColor);
                    font-size: rem(26px);
                }
            }
        }
        .rightCell {
            display: flex;
            align-items: center;
            height: 100%;
            input {
                width: rem(300px);
                height: 100%;
                font-size: rem(28px);
                text-align: right;
            }
            .arrowDown {
                width: 0;
                height: 0;
                vertical-align: middle;
                border: 7px solid var(--placeholdColor);
                border-color: var(--placeholdColor) transparent transparent transparent;
                border-bottom: 0;
                border-radius: 3px;
            }
        }
    }
}
.van-icon-clear {
    margin-top: rem(-10px);
    margin-left: rem(12px);
    color: var(--minorColor);
    font-size: rem(36px);
}
</style>
