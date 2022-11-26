<template>
    <div class='header'>
        <span class='title'>
            {{ $t('route.transRecords') }}
        </span>
        <PlansType v-model='tradeType' />
        <div class='filter'>
            <el-config-provider :locale='locale'>
                <el-date-picker
                    v-if='timeValue === "custom"'
                    ref='datePickerRef'
                    v-model='timeRange'
                    class='datePicker'
                    :disabled-date='disabledDate'
                    range-separator='To'
                    size='small'
                    type='daterange'
                    @change='onTimeRangeSelect'
                />
            </el-config-provider>
            <el-select v-model='timeValue' placeholder='Select' popper-class='timeSelect' @change='onTimeSelect'>
                <el-option
                    v-for='item in filterList.time'
                    :key='item.value'
                    :label='item.text'
                    :value='item.value'
                />
            </el-select>
            <el-select v-model='direction' placeholder='Select'>
                <el-option
                    v-for='item in filterList.direction'
                    :key='item.value'
                    :label='item.text'
                    :value='item.value'
                />
            </el-select>
            <el-select v-model='productValue' placeholder='Select'>
                <template v-for='item in filterList.product' :key='item.value'>
                    <el-option
                        v-if='unref(item.text)'
                        :label='unref(item.text)'
                        :value='item.value'
                    />
                </template>
            </el-select>
            <el-select v-model='orderType' placeholder='Select'>
                <el-option
                    v-for='item in orderTypeList'
                    :key='item.value'
                    :label='item.text'
                    :value='item.value'
                />
            </el-select>
        </div>
    </div>

    <el-dialog
        v-model='dialogProductVisible'
        custom-class='productDialog'
        :title='$t("common.chooseProduct")'
        width='400px'
        @closed='onClosed'
    >
        <ProductSearch class='productSearch' :trade-type='tradeType'>
            <template #list='{ list }'>
                <ProductList :list='list' @onSelect='onSelect' />
            </template>
        </ProductSearch>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, unref, nextTick, watch } from 'vue'
import { ElDialog, ElConfigProvider, ElDatePicker } from 'element-plus'
import { useI18n } from 'vue-i18n'
import PlansType from '../../quote/components/PlansType'
import ProductSearch from '@planspc/views/order/pages/productSearch.vue'
import ProductList from './ProductList'
import { useRoute, useRouter } from 'vue-router'
import i18n from '@planspc/i18n/i18n.js'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import { Toast } from 'vant'
const locale = computed(() => i18n.global.locale === 'zh-CN' ? zhCn : en)

const props = defineProps({
    params: {
        type: Object,
        default: () => ({})
    },
})
const emit = defineEmits(['update:params'])
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
// 限制选择的时间
const disabledDate = (time) => {
    return time.getTime() > Date.now()
}
const filterList = {
    time: [
        // { text: t('common.allDate'), value: 0, executeStartTime: -1 },
        { text: t('common.curToday'), value: 1, executeStartTime: window.dayjs().startOf('day').valueOf() },
        { text: t('common.curWeek'), value: 2, executeStartTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf() },
        { text: t('common.curMonth'), value: 3, executeStartTime: window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf() },
        { text: t('common.curThreeMonth'), value: 4, executeStartTime: window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf() },
        { text: t('information.custom'), value: 'custom' }
    ],
    direction: [
        { text: t('trade.direction'), value: -1 },
        { text: t('trade.buy'), value: 1 },
        { text: t('trade.sell'), value: 2 },
    ],
    positionType: [
        { text: t('trade.openClose'), value: -1 },
        { text: t('trade.openPosition'), value: 1 },
        { text: t('trade.closePosition'), value: 2 },
    ],
    priceTypeList: [
        { text: t('trade.priceOrLimit'), value: -1 },
        { text: t('trade.orderTypeShort1'), value: 3 },
        { text: t('trade.orderTypeShort2'), value: 4 },
    ],
    product: [
        { text: t('common.allProduct'), value: 0 },
        { text: t('common.chooseProduct'), value: 1, },
        { text: computed(() => unref(product)?.symbolName || false), value: 'custom', },
    ]
}

// 开平/市限
const orderTypeList = computed(() => {
    if ([1, 2].includes(Number(unref(tradeType)))) {
        return filterList.positionType
    } else if ([3, 5, 9].includes(Number(unref(tradeType)))) {
        return filterList.priceTypeList
    }
    return []
})

const tradeType = ref(route.query.tradeType || '')
const timeValue = ref(2)
const datePickerRef = ref(null)
const timeRange = ref([])
const direction = ref(filterList.direction[0].value)
const productValue = ref(filterList.product[0].value)
const orderType = ref(-1)
const executeStartTime = ref(window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf())
const executeEndTime = ref(window.dayjs().endOf('day').valueOf())
const dialogProductVisible = ref(false)
const product = ref(null)
const symbolId = computed(() => unref(product)?.symbolId || null)
onMounted(() => {
    // 自动更新请求参数
    emit('update:params', {
        ...props.params,
        tradeType,
        executeStartTime,
        executeEndTime,
        direction,
        orderType,
        symbolId
    })

    watch(() => tradeType.value, () => {
        if (route.query.tradeType !== tradeType.value) {
            router.replace({
                query: {}
            })
        }

        // 重置其他值
        timeRange.value = []
        onTimeSelect(timeValue.value = filterList.time[1].value)
        direction.value = filterList.direction[0].value
        productValue.value = filterList.product[0].value
        orderType.value = -1
    })
})

// 时间下拉选项
const onTimeSelect = async (val) => {
    if (val === 'custom') {
        // 自定义时间
        await nextTick()
        unref(datePickerRef).focus()
    } else {
        const target = filterList.time.find(e => e.value === val)
        executeStartTime.value = target.executeStartTime
        executeEndTime.value = window.dayjs().endOf('day').valueOf()
        timeRange.value = []
    }
}
// 时间范围
const onTimeRangeSelect = (val) => {
    const diffDay = window.dayjs(val[1]).diff(window.dayjs(val[0]), 'day')
    if (diffDay > 180) {
        Toast(t('compLang.timeLimit'))
        timeRange.value = []
    } else {
        executeStartTime.value = window.dayjs(val[0]).startOf('day').valueOf()
        executeEndTime.value = window.dayjs(val[1]).endOf('day').valueOf()
    }
}

// 产品弹层
watch(() => unref(productValue), val => {
    if (val === 0) {
        product.value = null
    } else if (val === 1) {
        dialogProductVisible.value = true
    }
})

const onClosed = () => {
    if (!unref(product)) {
        productValue.value = filterList.product[0].value
    }
}

const onSelect = val => {
    product.value = val
    dialogProductVisible.value = false
    productValue.value = filterList.product[filterList.product.length - 1].value
}

</script>

<style lang="scss" scoped>
.header{
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &::after{
        content: "";
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 3px;
        background-color: var(--assistColor);
        z-index: var(--el-index-normal);
    }
    .title{
        display: inline-flex;
        flex-shrink: 0;
        font-size: 16px;
        font-weight: bold;
        color: var(--color);
        margin: 0 50px 0 20px;
    }
    :deep{
        .plansList {
            line-height: 60px;
        }
        .plansList .el-tabs__item{
            font-size: 14px;
        }
    }

    .filter{
        padding: 10px 0;
        margin-top: -5px;
        margin-right: 20px;
        :deep{
            .el-select{
                margin-top: 5px;
                margin-left: 8px;
                .el-input__inner{
                    width: 145px;
                    height: 32px;
                    background: var(--assistColor);
                    border-radius: 4px;
                    border-radius: 4px;
                    border: 0;
                    font-size: 14px;
                    color: var(--normalColor);
                }
                .el-input__suffix, .el-input__icon{
                    line-height: 32px;
                }
            }
            .datePicker{
                width: 300px!important;
                margin: 0 8px;
                background: var(--bgColor);
                border-color: transparent;
                &.is-active{
                    border-color: var(--primary);
                }
            }
        }
    }

}

// 覆盖样式
.productSearch{
    width: 100%;
    margin-top: -20px;
    padding-bottom: 0;
    :deep{
        .search-input{
             width: 100%;
        }
        .tabs{
            padding: 0;
            .el-tabs__item{
                margin-left: 0;
            }
        }
    }
}

</style>
