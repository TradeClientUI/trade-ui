<template>
    <div class='page-wrap'>
        <Top back show-center />
        <div class='page-content'>
            <p v-if='Number(type) === 1' class='head-text'>
                {{ $t('trade.loanCurrency') }}
            </p>
            <p v-else-if='Number(type) === 3' class='head-text'>
                {{ $t('trade.repaymentCurrency') }}
            </p>
            <p v-else class='head-text'>
                {{ $t('deposit.chooseCurrency') }}
            </p>
            <van-cell
                v-for='item in accountList'
                :key='item.accountId'
                is-link
                :title='item.currency'
                :to='{ path: routeName, query:{ accountId: item.accountId,currency: item.currency,tradeType } }'
            />
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            tradeType: route.query.tradeType
        })

        const routeName = computed(() => {
            if (Number(type) === 1) {
                return 'loan'
            } else if (Number(type) === 3) {
                return 'returnMoney'
            } else {
                return 'deposit'
            }
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        return {
            accountList,
            type,
            routeName,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .page-content {
        flex: 1;
        margin-top: rem(20px);
        padding: 0;
        background: var(--contentColor);
        overflow-y: auto;
        .head-text {
            padding-left: rem(30px);
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(90px);
            border-bottom: solid 1px var(--lineColor);
        }

        --van-cell-line-height: 30px;
        --van-cell-text-color: #F00;
    }
}
</style>
