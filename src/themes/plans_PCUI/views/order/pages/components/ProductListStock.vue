<template>
    <div class='listWrap'>
        <div class='listHead'>
            <span class='name' @click='sortHandler("symbolName")'>
                {{ $t('trade.name') }}
                <SortIcon name='symbolName' :sort-field='sortField' :sort-type='sortType' />
            </span>
            <span @click='sortHandler("cur_price")'>
                {{ $t('trade.newPrice') }}
                <SortIcon name='cur_price' :sort-field='sortField' :sort-type='sortType' />
            </span>
            <span @click='sortHandler("upDownAmount")'>
                {{ $t('chart.diffPrice') }}
                <SortIcon name='upDownAmount' :sort-field='sortField' :sort-type='sortType' />
            </span>
            <span @click='sortHandler("upDownWidth")'>
                {{ $t('chart.quoteChange') }}
                <SortIcon name='upDownWidth' :sort-field='sortField' :sort-type='sortType' />
            </span>
        </div>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <div v-for='item in productStockList' :key='item.id' class='item li' :class='[item.symbolKey === productActived.symbolKey && "active"]' @click='onClick(item)'>
                <i v-if='isCollect(item.tradeType,item.symbolId)' class='icon icon_hangqingliebiaoyijiazixuan' @click.stop='addOptional(item)'></i>
                <i v-else class='icon icon_hangqingliebiaoweijiazixuan' @click.stop='addOptional(item)'></i>
                <div class='box'>
                    <p>
                        <span class='name'>
                            {{ item.symbolName }}
                        </span>
                        <ETF v-if='productMap[item.symbolKey].etf' />
                    </p>
                    <p class='productLabelBox'>
                        <span
                            v-show='checkLabel(item.symbolKey, "us-stock") || checkLabel(item.symbolKey, "hk-stock")'
                            class='supLabel'
                            :class='{ hk:checkLabel(item.symbolKey, "hk-stock"),us:checkLabel(item.symbolKey, "us-stock") }'
                        >
                            {{ checkLabel(item.symbolKey, 'us-stock') ? 'US':'HK' }}
                        </span>
                        <img v-if='productMap[item.symbolKey].enableLongLoan==1' class='icon-loan rong' :src="'/images/rong.png?v=1'" />
                        <img v-if='productMap[item.symbolKey].enableShortLoan==1' class='icon-loan kong' :src="'/images/kong.png?v=1'" />
                        <img v-if='productMap[item.symbolKey].dividend==1' class='icon-loan chu' :src="'/images/chu.png?v=1'" />
                    </p>
                </div>
                <span :class='[productMap[item.symbolKey]?.cur_color]'>
                    {{ productMap[item.symbolKey]?.cur_price || '- -' }}
                </span>
                <span :class='[productMap[item.symbolKey]?.upDownColor]'>
                    {{ productMap[item.symbolKey]?.upDownAmount || '- -' }}
                </span>
                <span :class='[productMap[item.symbolKey]?.upDownColor]'>
                    {{ productMap[item.symbolKey]?.upDownWidth || '- -' }}
                </span>
            </div>
        </div>
        <div v-if='productStockList.length === 0' class='none-data'>
            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
        </div>
    </div>
</template>

<script setup>
import ETF from '@planspc/components/etfIcon'
import { ref, watch, nextTick, computed, toRef, defineProps, inject, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { QuoteSocket } from '@/plugins/socket/socket'
import SortIcon from '@planspc/components/sortIcon.vue'
import { sortFieldFn, sortTypeFn, sortFunc, productStockListSet } from '@planspc/hooks/useProduct'
import { isEmpty, localSet, localGet, getCookie, setCookie } from '@/utils/util'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    categoryType: String,
    list: {
        type: Array,
        default: () => []
    }
})
const productMap = computed(() => store.state._quote.productMap)
const productActived = computed(() => store.getters.productActived)
const labels = computed(() => productActived.value.labels?.toLowerCase().split(',') || [])
const isUS = computed(() => labels.value.includes('us-stock'))
const isHK = computed(() => labels.value.includes('hk-stock'))

const checkLabel = (symbolKey, label) => {
    const product = productMap.value[symbolKey]
    const labels = product.labels?.toLowerCase().split(',') || []
    return labels.includes(label)
}

const productStockList = ref([])
const productListReset = () => {
    productStockList.value = productStockListSet(props.list)
}
// 股票玩法30s定时排序
let stockSortTimer = null
const clearStockSortTimer = () => {
    if (stockSortTimer) {
        clearInterval(stockSortTimer)
        stockSortTimer = null
    }
}
const resetStockSortTimer = () => {
    clearStockSortTimer()
    stockSortTimer = setInterval(() => {
        const subscribeSymbolKey = props.list.map(el => el.symbolKey)
        QuoteSocket.send_subscribe_stock(subscribeSymbolKey).then(res => {
            productListReset()
        })
    }, 30000)
}

const sortField = sortFieldFn()
const sortType = sortTypeFn()
// 点击排序
const sortHandler = (field) => {
    sortFunc(field)
    productListReset()
}

const isReLoadProductSearch = inject('isReLoadProductSearch')

// 监听列表滚动，订阅/获取产品数据
const list = toRef(props, 'list')
const { productListEl, subscribList } = subscribeProducts(productStockList)

// 切换当前选中产品
const onClick = product => {
    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
    router.replace({
        query: {
            ...route.query,
            name: product.symbolName.replace(/ /g, '_'),
            symbolId: product.symbolId,
            tradeType: product.tradeType
        }
    })
}

watch(() => subscribList.value, () => {
    QuoteSocket.add_subscribe({ moduleId: 'productList', symbolKeys: subscribList.value })
}, {
    immediate: true,
    deep: true
})

watch(
    [() => props.categoryType, () => props.list.length],
    (val) => {
        resetStockSortTimer()
        if (props.list.length) {
            const subscribeSymbolKey = props.list.map(el => el.symbolKey)
            QuoteSocket.send_subscribe_stock(subscribeSymbolKey).then(res => {
                productListReset()
            })
        } else {
            productListReset()
        }
    }, {
        immediate: true,
    })

/** 监听是否存在滚动条，调整样式 */
const scrollBarWidth = ref(0)
watch(() => [props.list.length], async () => {
    await nextTick()
    if (productListEl && props.list.length) {
        scrollBarWidth.value = productListEl.value.offsetWidth - productListEl.value.clientWidth
    }
}, { immediate: true })
/** 监听是否存在滚动条，调整样式 */

/** 添加自选逻辑 */
const customerInfo = computed(() => store.state._user.customerInfo)
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
// const isCollect = (tradeType, symbolId) => selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))

/** 添加自选逻辑 标星状态 */
const isCollect = (tradeType, symbolId) => {
    if (isEmpty(customerInfo.value)) {
        const newId = parseInt(symbolId) + '_' + tradeType
        if (localGet('localSelfSymbolList')) {
            if (JSON.parse(localGet('localSelfSymbolList')).find(el => el === newId)) {
                return true
            } else {
                return false
            }
        }
    } else {
        return selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))
    }
}

const addOptional = ({ symbolId, tradeType }) => {
    if (!customerInfo.value) {
        // ElMessage.warning(t('common.noLogin'))
        // return router.push('/login')
        console.log({ symbolId, tradeType })
        // 未登录 缓存到本地
        var localSelfSymbolList = localGet('localSelfSymbolList') ? JSON.parse(localGet('localSelfSymbolList')) : []
        const newId = symbolId + '_' + tradeType
        if (localSelfSymbolList.find(el => el === newId)) {
            localSelfSymbolList.map((it, index) => {
                if (it === newId) {
                    localSelfSymbolList.splice(index, 1)
                    ElMessage.success(t('trade.removeOptionalOk'))
                }
            })
        } else {
            localSelfSymbolList.push(newId)
            ElMessage.success(t('trade.addOptionalOk'))
        }
        store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
        isReLoadProductSearch(true, symbolId)
    } else {
        if (isCollect(tradeType, symbolId)) {
            removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.removeOptionalOk'))
                }
            }).catch(err => {
            })
        } else {
            addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                    // 手动修改optional值
                    store.commit('_user/Update_optional', 1)
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.addOptionalOk'))
                }
            }).catch(err => {
            })
        }
    }
}
/** 添加自选逻辑 */

onBeforeUnmount(() => {
    clearStockSortTimer()
})

</script>

<style lang="scss" scoped>
.listWrap {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    margin-top: 9px;
    overflow: hidden;
    color: var(--color);
    font-weight: 500;
    font-size: rem(30px);
    line-height: rem(32px);
    .item {
        display: flex;
        align-items: center;
        user-select: none;
        .icon {
            margin-right: 5px;
            align-self: start;
            margin-top: 6px;
        }
        .box {
            display: inline-flex;
            flex-direction: column;
            flex: 1;
            p {
                @include ellipsis();
                max-width: 80px;
            }
            .name {
                font-size: 14px;
            }
        }
        > span {
            flex: 1;
            text-align: right;
            margin-right: 4px;
        }
    }
    .listHead {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 16px;
        color: var(--minorColor);
        font-size: 12px;
        line-height: 26px;
        span {
            flex: 1;
            text-align: right;
            cursor: pointer;
        }
        .name {
            text-align: left;
        }
    }
    .items {
        flex: 1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .li {
            height: 45px;
            padding: 0 8px;
            font-size: 12px;
            cursor: pointer;
            .name {
                color: var(--color);
                font-weight: 400;
            }
            &.active,
            &:hover {
                background: var(--primaryAssistColor);
                border-radius: 4px;
            }
            :deep(.etfIcon) {
                margin-top: 2px;
            }
        }
    }
    .none-data {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        width: 100%;
    }
}
.productLabelBox {
    margin-top: 3px;
    .icon-loan {
        margin-left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        vertical-align: middle;
    }
}
.supLabel {
    font-weight: normal;
    line-height: 1;
    font-size: 12px;
    padding: 1px 2px;
    display: inline-block;
    transform: scale(0.857);
    border-radius: 2px;
    &.hk {
        color: #ED8700;
        background: #FFF0D3;
    }
    &.us {
        color: #0062FF;
        background: #E4E4E4;
    }
}
</style>
