<template>
    <div class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' />
        <FundCard v-if='fund' class='fundCardInfo' :fund='fund' />
        <fundInformation v-if='fund' class='fundInfoBlock' :fund-id='fundId' />
        <fundBottomBtn :fund='fund' />
    </div>
</template>

<script >
import { defineAsyncComponent, computed } from 'vue'
import FundCard from './components/fundCard.vue'
import fundBottomBtn from './components/fundBottomBtn.vue'
import LoadingComponent from '@/components/loadingComponent'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components: {
        FundCard,
        fundBottomBtn,
        fundInformation: defineAsyncComponent({
            loader: () => import('@plans/modules/fundInformation'),
            loadingComponent: LoadingComponent,
            delay: 0, // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
            suspensible: false
        })
    },
    setup () {
        const route = useRoute()
        const store = useStore()
        const { fundId } = route.query

        const fund = computed(() => store.state._quote.fundInfo)

        // 获取基金产品最新净值
        store.dispatch('_quote/fundNetValue', { fundId })
        store.dispatch('_quote/queryFundInfo', fundId)

        return {
            fundId,
            fund,
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    margin-bottom: rem(120px);
    overflow-y: auto;
    .fundCardInfo{
        margin: rem(60px) 0 0 0;
    }
    .fundInfoBlock{
        background: var(--contentColor);
        margin-top: rem(30px);
        padding-top: rem(30px);
    }
}
</style>
