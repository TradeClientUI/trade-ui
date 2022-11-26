<template>
    <centerViewDialog>
        <div class='page-wrap'>
            <LayoutTop icon='icon_icon_close_big' />
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
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        centerViewDialog,
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
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    overflow: auto;
    //background: var(--contentColor);
    .page-content {
        margin-top: rem(20px);
        //padding: 0 rem(20px);
        background: var(--contentColor);
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
