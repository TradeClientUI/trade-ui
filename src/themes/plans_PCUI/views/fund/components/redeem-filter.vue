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
        <!-- 当前赎回时间筛选 -->
        <div v-if='sharesStatus === 0' class='item-date'>
            <el-date-picker
                v-model='applyTime'
                :placeholder="$t('fundInfo.applyTime')"
                type='datetime'
                value-format='YYYY-MM-DD HH:mm:ss'
            />
        </div>
        <!-- 历史赎回时间筛选 -->
        <div v-if='sharesStatus === 1' class='item-date'>
            <el-date-picker
                v-model='updateTime'
                :placeholder="$t('fundInfo.confirmTime')"
                type='datetime'
                value-format='YYYY-MM-DD HH:mm:ss'
            />
        </div>
        <button class='btn' @click='onSearch'>
            {{ $t('compLang.search') }}
        </button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
    // 基金产品列表
    assetsList: {
        type: Array,
        default: () => []
    },
    // 赎回记录状态
    sharesStatus: {
        type: [String, Number],
        default: ''
    }
})
const emit = defineEmits(['filter'])

// 选择的基金份额代币
const currencyShares = ref('')
// 选择的申请时间
const applyTime = ref('')
// 更新时间
const updateTime = ref('')

// 监听sharesStatus
watch(() => props.sharesStatus, () => {
    applyTime.value = ''
    updateTime.value = ''
})

// 点击搜索
const onSearch = () => {
    const params = {
        current: 1,
        size: 10,
        currencyShares: currencyShares.value
    }
    params.startTime = applyTime.value ? window.dayjs(applyTime.value).valueOf() : ''
    params.updateStartTime = updateTime.value ? window.dayjs(updateTime.value).valueOf() : ''
    emit('filter', params)
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
