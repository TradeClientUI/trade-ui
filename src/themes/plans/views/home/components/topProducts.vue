<template>
    <div class='topProducts-module'>
        <div class='title-warp'>
            <h2 class='title'>
                {{ $t('homeJD.quotationList') }}
            </h2>
            <p class='title-label'>
                {{ $t('homeJD.quotationListDesc') }}
            </p>
        </div>
        <TopTab
            ref='tabList'
            v-model='categoryType'
            class='tradeSortNav'
            line-width='50'
            :list='categoryList'
        />
        <ProductList
            :is-f-x='isFX'
            :product-list='baseList'
        />
        <div class='tips'>
            {{ $t('homeJD.priceTips') }}
        </div>
        <p class='more-btn' @click='moreHandle'>
            {{ $t('homeJD.moreRankings') }}
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import TopTab from '@plans/components/topTab'
import ProductList from './productList'
import { QuoteSocket } from '@/plugins/socket/socket'
import useProduct from '@plans/hooks/useProduct'

let unSubscribe = () => {}

const router = useRouter()
const store = useStore()
const list = ref([])
const curTab = ref(1)
const moduleId = 'quote_' + Date.now()
const tradeType = ref('1')
// 获取板块列表和所选板块的产品列表
const categoryType = ref(0)

const { categoryList, productList } = useProduct({
    tradeType,
    categoryType,
    isSort: false,
    isSelfSymbol: false,
    defaultSortField: '',
    defaultSortType: ''
})

// 判断当前列表是否是外汇
const isFX = computed(() => {
    const firstProduct = unref(productList)[0]
    return firstProduct?.isFX ?? false
})

// 展示的列表
const baseList = ref([])
watch(() => productList.value, (val) => {
    if (val.length) {
        const currentBaseList = val.slice(0, 5).map((item) => item.symbolKey + '_' + item.dealMode)
        // 比较列表是否更新
        if (baseList.value.join('') !== currentBaseList.join('')) {
            baseList.value = currentBaseList
        }
    }
}, {
    immediate: true
})

// 需要订阅的产品列表
const subscribeSymbolsList = computed(() => {
    const systemOptional = unref(categoryList.value)[unref(categoryType.value)]?.listByUser || [] // 系统默认推送的自选列表
    const symbolKeys = systemOptional.map(symbolId => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
    return symbolKeys
})

watch([() => subscribeSymbolsList.value, () => isFX.value], (val) => {
    if (val) {
        unSubscribe = QuoteSocket.add_subscribe({ moduleId, symbolKeys: val[0] })
    }
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
})

// 更多btn
const moreHandle = () => {
    router.push(`/quote?categoryType=${categoryType.value + 1}`)
}

</script>

<style lang="scss" scoped>
.topProducts-module {
    @include pagePadding();
    font-weight: 500;
    .title-warp {
        margin: rem(96px) 0 rem(50px);
        .title {
            text-align: center;
            color: var(--color);
            font-size: rem(48px);
            font-weight: bold;
            line-height: rem(72px);
            margin-bottom: rem(16px);
        }
        .title-label {
            text-align: center;
            color: var(--color);
            font-size: rem(28px);
        }
    }
    :deep(.plansList) {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__active-bar {
            height: 2px;
            background: var(--primary);
        }
        .el-tabs__nav-wrap {
            &::after {
                content: none;
            }
        }
        .el-tabs__item {
            padding-bottom: 16px;
            font-weight: 600;
            color: #666;
            font-size: 20px;
            vertical-align: middle;
            margin: 0 15px 10px;
            &.is-active,
            &:hover {
                color: var(--primary);
            }
        }
    }
    .tips {
        padding: rem(40px) 0;
        color: var(--minorColor);
        font-weight: normal;
    }
    .more-btn {
        width: 200px;
        line-height: 46px;
        color: var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid var(--lineColor);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
.tradeSortNav {
    border-bottom: 1px solid var(--lineColor);
    margin-bottom: 10px;
    :deep(.van-tabs__wrap) {
        .van-tabs__nav {
            .van-tab.van-tab--line {
                flex: 1;
                &.van-tab--active {
                    background: none;
                }
            }
        }
        .van-tabs__line {
            bottom: 10px;
            height: 2px;
            background: var(--primary) !important;
        }
        .van-tab__text {
            .title {
                padding: 0;
            }
        }
    }
}
</style>
