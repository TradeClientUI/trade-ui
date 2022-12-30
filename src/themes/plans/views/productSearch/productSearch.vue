<template>
    <div class='quoteWrap'>
        <plansType v-if='plansLen>1' :list='plansList' :value='tradeType' @change='handleTradeType' />
        <div class='search_box' :class='{ top: plansLen>1 }'>
            <div class='search_input'>
                <van-search
                    v-model='state.searchKey'
                    :action-text='$t("common.cancel")'
                    clearable
                    :placeholder='$t("search.keywords")'
                    show-action
                    @cancel='onCancel'
                    @search='onSearch'
                    @update:model-value='updateVal'
                />
            </div>
            <div class='search_products'>
                <div v-for='item in state.searchList' :key='item.symbolId' class='product_item' @click='openProduct(item.id)'>
                    <span>
                        <span v-for='(childName,index) in item.name' :key='index' :class="{ 'activeText':isSearchText(childName) }">
                            {{ childName }}
                        </span>
                    </span>
                    <button v-preventReClick class='collectIcon' @click.stop='addOptional(item)'>
                        <i
                            :class="item.isSelfSymbol ? 'icon_zixuan2': 'icon_zixuan1'"
                        ></i>
                    </button>
                    <p v-if='item.etf'>
                        <ETF />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, computed, onActivated, reactive } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { addCustomerOptional, removeCustomerOptional, getSymbolList } from '@/api/trade'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import ETF from '@plans/components/etfIcon'

export default {
    name: 'ProductSearch',
    components: {
        plansType,
        ETF,
    },
    setup () {
        const state = reactive({
            searchKey: '',
            searchFlag: false,
            searchList: []
        })
        const { t } = useI18n({ useScope: 'global' })
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )

        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })

        const productMap = computed(() => store.state._quote.productMap)

        // 1.玩法类型
        const tradeType = ref(route.query.tradeType || plansList.value[0].id)

        // 自选股
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            console.log('val', val)
            state.searchList = []
            state.searchKey = ''
        }
        const isSearchText = (val) => {
            if (state.searchKey.indexOf(val) != -1) {
                return true
            } else {
                return false
            }
        }

        const onSearch = () => {
            if (!state.searchKey) return false
            getSymbolList({ name: state.searchKey, tradeType: tradeType.value }).then(res => {
                if (res.check()) {
                    const list = res.data || []
                    state.searchList = []
                    list.forEach(item => {
                        for (const el in productMap.value) {
                            if (productMap.value[el].symbolKey === (String(item.id) + '_' + tradeType.value)) {
                                state.searchList.push(item)
                            }
                        }
                    })
                    const currentSelfSymbolList = selfSymbolList.value[tradeType.value] || []
                    const isSelfSymbol = false
                    state.searchList.forEach(item => {
                        item.isSelfSymbol = isSelfSymbol
                        currentSelfSymbolList.forEach(el => {
                            if (item.id === el.symbolId || item.id === el.id) {
                                item.isSelfSymbol = true
                            }
                        })
                    })
                }
            })
        }
        const updateVal = (val) => {
            onSearch(val)
        }
        const openSearch = () => {
            state.searchList = []
            state.searchFlag = true
        }
        const onCancel = () => {
            router.push('/quote')
        }
        const openProduct = (symbolId) => {
            router.push(`/product?symbolId=${symbolId}&tradeType=${tradeType.value}`)
        }
        // 添加自选
        const addOptional = (item) => {
            if (item.isSelfSymbol) {
                removeCustomerOptional({ symbolList: [item.id], tradeType: tradeType.value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                        for (const key in selfSymbolList.value) {
                            selfSymbolList.value[key].forEach((el, index) => {
                                if (item.id === el.symbolId || item.id === el.id) {
                                    selfSymbolList.value[key].splice(index, 1)
                                }
                            }
                            )
                        }
                        // store.commit('_user/Update_selfSymbolList', selfSymbolList)
                        onSearch()
                    }
                }).catch(err => {
                })
            } else {
                addCustomerOptional({ symbolList: [item.id], tradeType: tradeType.value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        selfSymbolList.value[tradeType.value].push(item)
                        // store.commit('_user/Update_selfSymbolList', selfSymbolList)
                        onSearch()
                        Toast(t('trade.addOptionalOk'))
                    }
                }).catch(err => {

                })
            }
        }

        return {
            updateVal,
            openSearch,
            addOptional,
            openProduct,
            onSearch,
            onCancel,
            state,
            plansLen,
            plansList,
            handleTradeType,
            tradeType,
            isSearchText
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.van-cell) {
    background-color: var(--bgColor) !important;
}
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    //padding-bottom: rem(100px);
    overflow: auto;
    padding-top: rem(128px);
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
    .search_box {
        position: absolute;
        top: rem(134px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        background: var(--contentColor);
        overflow: auto;
        &.top {
            //top: rem(100px);
        }
        .search_input {
            .van-field {
                border-radius: 3px;
            }
            :deep(.van-cell) {
                padding-left: 0;
            }
            :deep(.van-search__action) {
                padding: 0 rem(40px);
            }
        }
        .search_label {
            display: inline-block;
            color: #333;
        }
        .search_products {
            background: var(--contentColor);
            .product_item {
                width: 100%;
                height: rem(116px);
                padding: rem(40px);
                border-bottom: 1px solid var(--lineColor);
                button {
                    float: right;
                    background: none;
                }
                .icon_zixuan2 {
                    color: #FC822F;
                    animation: heartBeat 1.3s ease-in-out forwards;
                }
                .activeText {
                    color: var(--primary);
                }
            }
        }
    }
}
.tradeNav {
    // position: absolute;
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
    i {
        position: relative;
        right: rem(40px);
        bottom: rem(60px);
        float: right;
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
</style>
