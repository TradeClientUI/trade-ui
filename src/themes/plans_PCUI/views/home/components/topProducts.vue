<template>
    <div class='topFunds-module'>
        <div class='title-warp'>
            <h2 class='title' data-aos='fade-up'>
                {{ $t('homeJD.quotationList') }}
            </h2>
            <p class='title-label' data-aos='fade-up' data-aos-delay='200'>
                {{ $t('homeJD.quotationListDesc') }}
            </p>
        </div>
        <CategoryList v-model='categoryType' :list='categoryList' />
        <ProductList
            :is-crypto='isCrypto'
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
import CategoryList from './categoryList'
import ProductList from './productList'
import { QuoteSocket } from '@/plugins/socket/socket'
import useProduct from '@planspc/hooks/useProduct'

let unSubscribeFX = () => {}
let unSubscribe = () => {}

const router = useRouter()
const store = useStore()
const list = ref([])
const curTab = ref(1)
const moduleId = 'quote_' + Date.now()
const tradeType = ref('1')
// 获取板块列表和所选板块的产品列表
const categoryType = ref('0')

const { categoryList, productList } = useProduct({
    tradeType,
    categoryType,
    isSelfSymbol: false,
    defaultSortField: '',
    defaultSortType: ''
})

// 判断当前列表是否是数字货币
const isCrypto = computed(() => {
    const firstProduct = unref(productList)[0]
    return firstProduct?.isCryptocurrency ?? false
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

watch([() => subscribeSymbolsList.value, () => isCrypto.value], (val) => {
    const switchAccounting = store.state._user.switchAccounting // 是否处于真实模拟切换中
    if (!switchAccounting && val) {
        if (unref(val[1])) {
            // 数字货币需要24h数据
            unSubscribeFX = QuoteSocket.add_subscribe({ moduleId, symbolKeys: val[0] })
            unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: val[0] })
        } else {
            unSubscribeFX = QuoteSocket.add_subscribe({ moduleId, symbolKeys: val[0] })
        }
    }
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
    unSubscribeFX()
})

// 更多btn
const moreHandle = () => {
    router.push(`/quote?categoryType=${Number(categoryType.value) + 1}`)
}

</script>

<style lang="scss" scoped>
.topFunds-module {
    @include pagePadding();
    margin-top: 80px;
    font-weight: 500;
    .title-warp {
        margin-bottom: 48px;
        .title {
            text-align: center;
            color: var(--mainColor);
            font-size: 48px;
            line-height: 56px;
            font-weight: 700;
        }
        .title-label {
            text-align: center;
            color: var(--color);
            font-size: 16px;
            line-height: 20px;
            margin-top: 16px;
        }
    }
    :deep(.plansList) {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
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
            color: var(--mainColor);
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
        height: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
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
.logo-wrap {
    position: relative;
    padding: 0 8px;
    .logo {
        position: absolute;
        width: 16px;
        right: 8px;
        top: 0;
        background: var(--contentColor);
        border-radius: 100%;
        border: 1px solid var(--contentColor);
    }
}
.skeleton-wrap {
    column-count: 3;
    column-gap: 48px;
    margin-top: 36px;
}
.skeleton-fild {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    .filed {
        height: 30px;
    }
    .text {
        width: 30px;
    }
    .circle {
        min-width: 30px;
        margin: 0 8px;
    }
    .name {
        margin-right: 64px;
    }
    .value {
        min-width: 40px;
        width: 40px;
        margin-left: auto;
    }
}
.warnTabs {
    cursor: pointer;
}
.tooltip-cont {
    max-width: 200px;
}
body.night {
    .topFunds-module .title-warp .title {
        color: var(--mainColor);
    }
}
</style>
