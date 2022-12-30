<template>
    <div class='quoteWrap'>
        <plansType v-if='plansLen > 1' :list='plansList' :value='tradeType' @change='handleTradeType' />
        <div class='tradeNav'>
            <TopTab
                ref='tabList'
                v-model='categoryType'
                :background='$style.contentColor'
                class='tradeSortNav'
                :dot='true'
                line-height='0'
                line-width='0'
                :list='categoryList'
                @change='tabChange'
                @tabClick='tabClick'
            />
            <!-- <van-icon class='iconSearch' name='search' @click='openSearch' /> -->
            <i class='icon_sousuo iconSearch' @click='openSearch'></i>
        </div>

        <!-- etf banner -->
        <a v-if='String(categoryType)===fundBannerPosition[1] && tradeType===fundBannerPosition[0]' class='etfBanner' href='javascript:;' @click='toETF'>
            <img alt='' :src='"/images/ETF_banner_"+locale+".png"' />
        </a>

        <div class='titleBar van-hairline--bottom'>
            <span class='item' @click='sortHandler("symbolName")'>
                {{ $t('trade.nameCode') }}
                <SortIcon name='symbolName' :sort-field='sortField' :sort-type='sortType' />
            </span>
            <span class='item' @click='sortHandler("rolling_last_price")'>
                {{ $t('trade.newPrice') }}
                <SortIcon name='rolling_last_price' :sort-field='sortField' :sort-type='sortType' />
            </span>
            <span class='item' @click='sortHandler("rolling_upDownWidth")'>
                {{ $t('trade.changePercent') }}
                <SortIcon name='rolling_upDownWidth' :sort-field='sortField' :sort-type='sortType' />
            </span>
        </div>
        <productListComp ref='productListEl' :product-list='productList' />
        <div v-if='categoryType === 0 && productList.length === 0' class='AddToOptional'>
            <van-button plain size='small' type='primary' @click='goSearchPage'>
                <van-icon name='add' /> {{ $t('trade.addToOptional') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import TopTab from '@plans/components/topTab'
import productListComp from '@plans/modules/productList/productList.vue'
import SortIcon from '@plans/components/sortIcon.vue'
import { ref, watch, computed, onActivated, unref, nextTick, onMounted } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localSet, localGet } from '@/utils/util'
export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
        SortIcon,
        plansType
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })

        const productListEl = ref(null)
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )
        const symbolKey = computed(() => store.state._quote.productActivedID || '')
        const productTradeType = computed(() => unref(symbolKey).split('_')[1] || 0)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const quoteTradeType = computed(() => store.state._quote.quoteTradeType) // 行情页面显示的默认玩法
        // 1.玩法类型
        const tradeType = ref(unref(productTradeType))
        const tradeTypeOld = ref(0)
        const categoryTypeOld = ref(0)
        // 2.板块类型
        const categoryType = ref(1)
        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList, sortField, sortType, sortFunc } = useProduct({
            tradeType, categoryType
        })

        // 初始化需要显示的板块
        watch(() => route.query.categoryType, (value) => {
            if (value) {
                categoryType.value = Number(value)
                console.log(value, categoryType.value)
            }
        }, {
            immediate: true
        })

        const localSelfSymbolListCur = ref(localGet('localSelfSymbolList'))

        const localSymbolUpdate = computed(() => store.state._user.localSelfSymbolList)

        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            if (isWallet) {
                arr = arr.filter(el => {
                    return userProductCategory[el]?.find(o => o.listByUser?.length) && Number(el) !== 5
                })
            } else {
                arr = arr.filter(el => {
                    return userProductCategory[el]?.find(o => o.listByUser?.length)
                })
            }

            return arr.length
        })

        // 点击排序
        const sortHandler = (field) => {
            sortFunc(field)
        }

        // 监听玩法类型
        const handleTradeType = async (val) => {
            tradeType.value = val
            tradeTypeOld.value = val
            categoryType.value = 0
            await nextTick()
            unref(productList).length && store.commit('_quote/Update_productActivedID', unref(productList)[0].symbolId + '_' + val)
        }

        // 监听行情页面默认玩法
        watch(() => quoteTradeType.value, () => {
            if (quoteTradeType.value) {
                tradeType.value = quoteTradeType.value.toString()
                store.commit('_quote/setQuoteTradeType', '')
            }
        }, { immediate: true })

        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        watch(
            [tradeType, categoryType, productList],
            async () => {
                await nextTick()
                if (productListEl.value) productListEl.value.subscribeAll()
            }
        )

        onActivated(async () => {
            await nextTick()
            if (productListEl.value) productListEl.value.subscribeAll()
            // 未登录游客自选操作后返回过滤更新列表
            if (!customerInfo.value) {
                console.log(categoryType.value)
                if (categoryType.value === 0) {
                    // if (JSON.parse(localGet('localSelfSymbolList')).length !== JSON.parse(localSelfSymbolListCur.value).length) {
                    // tradeType.value = tradeTypeOld.value
                    categoryType.value = null
                    // await nextTick()
                    // 定时切换一下玩法，触发刷新列表
                    var st = setTimeout(() => {
                        categoryType.value = 0
                        localSelfSymbolListCur.value = localGet('localSelfSymbolList')
                        clearTimeout(st)
                    }, 150)
                    // }
                }
            }
        })

        const tabChange = (i) => {}
        const tabClick = (i) => {}

        const showSidebar = ref(false)
        const openSearch = () => {
            router.push(`/productSearch?tradeType=${tradeType.value}`)
        }

        // 进入基金产品列表页面
        const toETF = () => {
            store.commit('del_cacheViews', 'FundProductList')
            router.push('/fundProductList')
        }

        const goSearchPage = () => {
            router.push(`/productSearch?tradeType=${tradeType.value}`)
        }

        return {
            locale,
            fundBannerPosition: window['fundBannerPosition'].split('-'),
            openSearch,
            categoryType,
            productListEl,
            plansLen,
            plansList,
            categoryList,
            productList,
            sortField,
            sortType,
            sortHandler,
            tabChange,
            tabClick,
            handleTradeType,
            tradeType,
            toETF,
            localSelfSymbolListCur,
            tradeTypeOld,
            categoryTypeOld,
            showSidebar,
            goSearchPage,
            customerInfo,
            localSymbolUpdate
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quoteWrap {
    margin-top: 2px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 2px);
    // margin-top: rem(90px);
    overflow: auto;
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
}
.tradeNav {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    //padding-bottom: rem(10px);
    background-color: var(--contentColor);
    //border-bottom: solid 4px var(--lineColor);
    .van-tab {
        background: yellow !important;
    }
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    .iconSearch {
        position: absolute;
        top: rem(30px);
        right: rem(28px);
        font-size: rem(32px);
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    &::after {
        border-color: var(--bgColor);
    }
    .item {
        width: rem(210px);
        text-align: right;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:nth-child(2) {
            width: rem(210px);
            text-align: left;
        }
    }
}
.etfBanner {
    display: block;
    padding: 4px 0;
    background: var(--contentColor);
    img {
        display: block;
        width: 100%;
    }
}
.AddToOptional {
    position: absolute;
    top: 45%;
    right: 20%;
    left: 20%;
    display: inline-block;
    margin: 0 0 rem(20px) 0;
    text-align: center;
    .van-button {
        width: 80%;
        height: rem(160px);
        color: var(--primary);
        font-weight: bold;
        line-height: rem(160px);
        border: none;
        background: var(--contentColor);
    }
}
</style>
