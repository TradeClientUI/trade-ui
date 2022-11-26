<template>
    <div class='trustWrapper'>
        <div class='hd'>
            <span v-if='[2,5].includes(Number(product.tradeType))'>
                {{ $t('trade.dealList') }}
            </span>
            <span v-else>
                {{ $t('c.cur') + $t([1,2].includes(product.tradeType) ? 'trade.pending':'trade.trust') }} ({{ pendingList.length }})
            </span>
            <a class='allTrust' href='javascript:;' @click="$router.push({ name:'List',query:{ tradeType: $route.query.tradeType } })">
                <i class='icon_mingxi1'></i>
            </a>
        </div>
        <div v-if='[2,5].indexOf(Number(product.tradeType)) === -1' class='bd'>
            <van-empty
                v-if='pendingList?.length === 0'
                :description="$t('trade.pendingEmpty')"
                image='/images/empty.png'
            />
            <trustItem v-for='item in pendingList' v-else :key='item.id' :product='item' />
        </div>
    </div>
</template>

<script>
import { computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import trustItem from '@/themes/plans/modules/trust/trustItem.vue'
import { useRoute } from 'vue-router'
export default {
    components: {
        trustItem,
    },
    props: ['product'],
    emits: ['quoteSubscribe'],
    setup (props, { emit }) {
        const loading = ref(false)
        const store = useStore()
        const route = useRoute()

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[route.query.tradeType] || [])

        watch(
            () => pendingList.value?.length,
            async (newval) => {
                await nextTick()
                emit('quoteSubscribe')
            },
            { immediate: true }
        )

        return {
            pendingList,
            loading

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trustWrapper {
    margin-top: rem(20px);
    background: var(--contentColor);
    .hd {
        display: flex;
        justify-content: space-between;
        height: rem(80px);
        padding: 0 rem(30px);
        font-size: rem(28px);
        line-height: rem(80px);
        border-bottom: 1px solid var(--assistColor);
        .allTrust {
            color: var(--normalColor);
            font-size: rem(36px);
        }
    }
}
</style>
