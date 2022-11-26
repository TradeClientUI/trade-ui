<template>
    <div class='searchWrapper'>
        <van-search
            v-model='keywords'
            :background='$style.contentColor'
            :placeholder="$t('search.placeholder')"
            show-action
            @search='onSearch'
            @update:model-value='updateVal'
        >
            <template #action>
                <div class='van-search__action' @click='onCancel'>
                    {{ $t('compLang.cancel') }}
                </div>
            </template>
        </van-search>
        <div v-if='!keywords' class='searchRecord'>
            <div class='label'>
                {{ $t('search.lastest') }}
            </div>
            <ResultItem v-for='item in localRecord' :key='item.sourceId' :product='item' />
        </div>
        <div class='searchBody'>
            <ResultItem v-for='item in resultList' :key='item.sourceId' :product='item' />
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import ResultItem from './resultItem.vue'
import { useStore } from 'vuex'
import { getSymbolList } from '@/api/trade'
import { localGet, debounce } from '@/utils/util'
export default {
    components: {
        ResultItem,
    },
    setup () {
        const store = useStore()
        const productMap = computed(() => store.state._quote.productMap)
        const state = reactive({
            keywords: '',
            localList: JSON.parse(localGet('searchProducts')) || [],
            resultList: []
        })
        const localRecord = computed(() => state.localList.map(id => productMap.value[id]).filter(el => el))
        const updateVal = (val) => {
            onSearch(val)
        }
        // 清楚搜索
        const onClear = () => {
            state.resultList = []
        }
        // 搜索
        const onSearch = debounce((key) => {
            if (!key) return false
            getSymbolList({ name: key, customerGroupId: store.getters.customerGroupId }).then(res => {
                if (res.check()) {
                    let list = res.data || []
                    list = list.map(el => productMap.value[el.id]).filter(el => !!el)
                    state.resultList = list
                }
            })
        })
        // 返回
        const onCancel = () => {
            history.back()
        }
        return {
            ...toRefs(state),
            localRecord,
            updateVal,
            onClear,
            onSearch,
            onCancel,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.searchWrapper {
    height: 100%;
    background: var(--contentColor);
    .searchBody {
        background: var(--contentColor);
    }
    .searchRecord {
        background: var(--contentColor);
        .label {
            padding: rem(20px) rem(30px);
            color: var(--minorColor);
            font-size: rem(26px);
            line-height: rem(36px);
        }
    }
}
</style>
