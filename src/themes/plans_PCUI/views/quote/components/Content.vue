<template>
    <div class='content'>
        <div class='header'>
            <PlansType v-model='tradeType' />
            <Autocomplete :trade-type='tradeType' />
        </div>
        <CategoryList v-model='categoryType' :list='computedCategoryList' />
        <div class='productWrapper'>
            <ProductList v-if='tradeType' :list='productList' :trade-type='tradeType' />
            <div v-if='categoryType === "0" && productList.length === 0' class='AddToOptional'>
                <van-button plain size='small' type='primary' @click='goAddOptional'>
                    <van-icon name='add' /> {{ $t('trade.addToOptional') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, onUnmounted, onMounted, onBeforeMount, provide, nextTick, watchEffect } from 'vue'
import PlansType from './PlansType'
import useProduct from '@planspc/hooks/useProduct'
import { QuoteSocket } from '@/plugins/socket/socket'
import ProductList from './ProductList'
import CategoryList from './CategoryList'
import Autocomplete from './Autocomplete'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const tradeType = ref('')
const productListData = ref([])
const route = useRoute()

// 获取板块列表和所选板块的产品列表
const categoryType = ref('1')
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})
const planMap = computed(() => store.state._quote.planMap) // 每个玩法下配置的产品

provide('isReLoadProductList', (value, productId) => {
    if (value === true) {
        const ArrPro = unref(productListData).value
        const tempCur = categoryType.value
        categoryType.value = categoryType.value === '1' ? '0' : '1'
        categoryType.value = tempCur
    }
})

const computedCategoryList = computed((el) => {
    const list = [...unref(categoryList)]
    list.forEach(el => {
        if (el.id === 'selfSymbol') {
            el.slot = {
                label: <div>
                            <span class="icon iconfont icon_lansezixuan"></span>
                            <span>
                                {el.title}
                            </span>
                        </div>
            }
        }
    })
    return list
})

// 需要订阅的产品列表
const subscribeSymbolsList = computed(() => {
    const symbolList = planMap.value[tradeType.value].symbolList
    const symbolKeys = symbolList.map(symbolId => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
    return symbolKeys
})

const moduleId = 'quote_' + Date.now()
let unSubscribe = () => {}

watch(
    () => unref(tradeType),
    () => {
        categoryType.value = '1'
        if (unref(subscribeSymbolsList).length === 0) return false
        unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: subscribeSymbolsList.value })
    }
)

// 初始化需要显示的板块
onMounted(() => {
    if (route.query.categoryType) {
        categoryType.value = route.query.categoryType
    }
})

const initList = () => {
    productListData.value = ref(productList)
}

const goAddOptional = () => {
    categoryType.value = '1'
}

onBeforeMount(() => {
    // console.log(productList)
    initList()
})

onUnmounted(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 80px;
    padding-bottom: 20px;
    background: var(--contentColor);
    border-radius: 10px;
    .header {
        position: relative;
        display: flex;
        flex: 0 0 56px;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 20px;
        line-height: 56px;
        &::after {
            position: absolute;
            bottom: -1px;
            left: 0;
            z-index: var(--el-index-normal);
            width: 100%;
            height: 3px;
            background-color: var(--assistColor);
            content: '';
        }
    }
    .icon_lansezixuan {
        margin-right: 5px;
        font-size: 14px;
    }
}
.productWrapper {
    position: relative;
}
.AddToOptional {
    position: absolute;
    top: 45%;
    right: 20%;
    left: 20%;
    z-index: 9;
    display: inline-block;
    margin: 0 0 20px;
    text-align: center;
    .van-button {
        width: 200px;
        height: 80px;
        color: var(--primary);
        font-weight: bold;
        font-size: 18px;
        line-height: 80px;
        background: var(--contentColor);
        border: none;
        transition: ease-in 0.2s;
        &:hover {
            background: var(--assistColor);
        }
    }
}
</style>
