<template>
    <div class='filter'>
        <div class='item'>
            <el-select
                v-model='currencyShares'
                clearable
                filterable
                :placeholder="$t('fundInfo.chooseApplyAsset')"
            >
                <el-option
                    v-for='item in assetsList'
                    :key='item.value'
                    :label='item.name'
                    :value='item.value'
                />
            </el-select>
        </div>
        <div class='item-date'>
            <el-date-picker
                v-model='time'
                :placeholder="$t('fundInfo.purchaseTime')"
                type='datetime'
                value-format='YYYY-MM-DD HH:mm:ss'
                @change='selectTime'
            />
        </div>
        <button class='btn' @click='onSearch'>
            {{ $t('compLang.search') }}
        </button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
    // 基金产品列表
    assetsList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['filter'])

// 选择的基金份额代币
const currencyShares = ref('')
// 选择的时间
const time = ref('')
// 申请时间
const startTime = ref('')

// 选择时间
const selectTime = () => {
    if (time.value) {
        startTime.value = window.dayjs(time.value).valueOf()
    } else {
        startTime.value = ''
    }
}
// 点击搜索
const onSearch = () => {
    emit('filter', { current: 1, size: 10, currencyShares: currencyShares.value, startTime: startTime.value })
}
</script>

<style lang="scss" scoped>
.filter {
    display: flex;
    align-items: center;
    .item {
        margin-right: 10px;
        &:deep {
            width: 160px;
        }
    }
    .item-date {
        margin-right: 10px;
    }
    .fixedWidth {
        &:deep {
            width: 195px;
        }
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 32px;
        color: #fff;
        background: var(--primary);
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            opacity: .9;
        }
    }
}
:deep {
    .el-input__inner {
        height: 32px;
        line-height: 32px;
        background: var(--assistColor);
        border: none;
        border-radius: 4px;
    }
    .el-input__suffix {
        display: inline-flex;
        align-items: center;
    }
    .el-input__icon  {
        height: auto;
        line-height: 1;
    }
    .el-range-separator {
        height: auto;
        line-height: 1;
        color: var(--color);
    }
}
</style>
