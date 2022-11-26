<template>
    <div class='module-content'>
        <div class='body-case'>
            <div class='standard-config'>
                <div v-if='list.length === 0' class='empty'>
                    <img src='/images/empty.png' />
                    <p class='tip'>
                        {{ $t('fundManager.standard.tip3') }}
                    </p>
                </div>
                <template v-else>
                    <div class='header'>
                        <span class='title-1'>
                            {{ $t('fundManager.standard.title1') }}：
                        </span>
                        <span class='title-2'>
                            {{ $t('fundManager.standard.title2') }}：
                        </span>
                    </div>
                    <div class='list'>
                        <div v-for='(item, index) in list' :key='index' class='item'>
                            <div class='select'>
                                <el-select
                                    v-model='item.symbolId'
                                    clearable
                                    filterable
                                    :placeholder="$t('fundManager.standard.tip1')"
                                    @change='changeProduct(item, index)'
                                >
                                    <el-option
                                        v-for='product in productList'
                                        :key='product.symbolId'
                                        :disabled='selectIds.includes(Number(product.symbolId))'
                                        :label='product.symbolName'
                                        :value='product.symbolId'
                                    />
                                </el-select>
                            </div>
                            <div class='input'>
                                <el-input
                                    v-model='item.rate'
                                    clearable
                                    :placeholder="$t('fundManager.standard.tip2')"
                                    type='number'
                                    @input='inputRatio(item)'
                                >
                                    <template #suffix>
                                        <span>%</span>
                                    </template>
                                </el-input>
                            </div>
                            <div class='minus' @click='onMinus(index)'>
                                <van-icon name='minus' />
                            </div>
                        </div>
                    </div>
                </template>
                <div class='handle'>
                    <button class='btn' @click='onAdd'>
                        {{ $t('compLang.add') }}
                    </button>
                    <button v-if='list.length > 0' v-loading='isSubmit' class='btn' @click='onConfirm'>
                        {{ $t('compLang.confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// api
import { getAllOrderProducts, getOrderStandard, saveOrderStandard } from '@/api/fund'
import { Toast } from 'vant'
import { onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { getDecimalNum, retainDecimal } from '@/utils/calculation'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 是否提交中
const isSubmit = ref(false)
// 玩货玩法产品列表数据
const productList = ref([])
// 当前选择的产品id集合
const selectIds = ref([])
// 下单执行标准数据
const list = ref([])

// 监听list数据
watch(list, () => {
    // 设置选择的产品id集合
    setSelectIds()
})

// 获取所有可设置的下单执行标准的产品
const getProductList = () => {
    getAllOrderProducts({
        customerGroupId: customerInfo.value.customerGroupId
    }).then(res => {
        productList.value = res.data
    })
}
// 获取下单执行标准
const queryOrderStandard = () => {
    getOrderStandard({
        customerGroupId: customerInfo.value.customerGroupId
    }).then(res => {
        if (res.check()) {
            const { data } = res
            const arr = []
            data.map(elem => {
                arr.push({
                    baseCurrency: elem.baseCurrency,
                    profitCurrency: elem.profitCurrency,
                    symbolId: elem.symbolId,
                    rate: elem.rate
                })
            })
            list.value = arr
        }
    })
}
// 设置选择的产品id集合
const setSelectIds = () => {
    selectIds.value = list.value.map(elem => {
        if (elem.symbolId) return Number(elem.symbolId)
    })
}
// 修改选择的产品
const changeProduct = (data, index) => {
    const item = list.value[index]
    const product = productList.value.find(elem => Number(elem.symbolId) === Number(data.symbolId))
    item.baseCurrency = product?.baseCurrency || ''
    item.profitCurrency = product?.profitCurrency || ''
    // 设置选择的产品id集合
    setSelectIds()
}
// 输入下单比例
const inputRatio = (item) => {
    if (Number(getDecimalNum(item.rate)) > 4) {
        item.rate = retainDecimal(item.rate, 4)
    }
}
// 点击添加按钮
const onAdd = () => {
    list.value.push({
        baseCurrency: '',
        profitCurrency: '',
        symbolId: '',
        rate: ''
    })
}
// 点击删除按钮
const onMinus = (index) => {
    list.value = list.value.filter((elem, i) => i !== index)
}
// 点击确定按钮
const onConfirm = () => {
    if (isSubmit.value) return
    let totalRatio = 0
    for (let i = 0; i < list.value.length; i++) {
        const item = list.value[i]
        totalRatio += Number(item.rate)
        if (isEmpty(item.symbolId)) {
            return Toast(t('fundManager.standard.tip1'))
        }
        if (isEmpty(item.rate)) {
            return Toast(t('fundManager.standard.tip2'))
        }
    }
    if (totalRatio > 100) {
        return Toast(t('fundManager.standard.tip5'))
    }

    isSubmit.value = true
    saveOrderStandard({
        customerGroupId: customerInfo.value.customerGroupId,
        configDtoList: list.value
    }).then(res => {
        isSubmit.value = false
        if (res.check()) {
            Toast(t('c.handleSuccess'))
            // 获取下单执行标准
            queryOrderStandard()
        }
    })
}

onMounted(() => {
    // 获取下单执行标准
    queryOrderStandard()
    // 获取现货玩法产品列表数据
    getProductList()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '../index.scss';
.module-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
}
.body-case {
    flex: 1;
    padding: 30px;
    background: var(--contentColor);
    border-radius: 10px;
}
.standard-config {
    display: inline-block;
    margin-left: 50px;
    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            width: 160px;
            height: 160px;
        }
    }
    .header {
        display: flex;
        .title-1 {
            width: 200px;
            margin-right: 15px;
        }
        .title-2 {
            width: 160px;
        }
    }
    .list {
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .select {
                width: 200px;
                margin-right: 15px;
            }
            .input {
                width: 160px;
                margin-right: 15px;
            }
            .minus {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 22px;
                height: 22px;
                background: var(--primary);
                border-radius: 50%;
                cursor: pointer;
                &:deep(.van-icon) {
                    margin-top: -3px;
                    color: #fff;
                }
                &:hover {
                    opacity: .9;
                }
            }
        }
    }
    .handle {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 40px;
            margin: 0 10px;
            color: #fff;
            background: var(--primary);
            border-radius: 20px;
            cursor: pointer;
            &:hover {
                opacity: .9;
            }
        }
    }
}
</style>
