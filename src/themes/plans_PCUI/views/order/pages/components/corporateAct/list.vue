<template>
    <div v-if='list.length > 0' class='act-list'>
        <div class='title'>
            <p>{{ $t('route.corporateAct') }}</p>
            <a @click='toAct'>
                {{ $t('corporateAct.more') + '>' }}
            </a>
        </div>
        <ul class='content'>
            <li
                v-for='(item, index) in list'
                :key='index'
            >
                <div class='label'>
                    {{ $t('corporateAct.exDividendDate') }}:
                </div>
                <p class='desc'>
                    {{ item.actionInfo }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore, } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const product = computed(() => {
            return store.getters.productActived
        })

        const list = computed(() => {
            // 股票玩法才展示公司行动 合并除权除息信息 最多取三条
            if (store.getters.productActived?.tradeType === 6) {
                const dividendPastInfos = store.getters.productActived?.dividendPastInfos || []
                return dividendPastInfos.slice(0, 3)
            } else {
                return []
            }
        })

        const toAct = () => {
            router.push({
                path: '/corporateAct',
                query: {
                    symbolId: product.symbolId || route.query.symbolId,
                    tradeType: product.tradeType || route.query.tradeType,
                }
            })
        }
        return {
            list,
            toAct,
        }
    }
}

</script>

<style lang="scss" scoped>
.act-list{
    background-color:  var(--contentColor);
    padding: rem(30px) rem(15px);
    margin-top: rem(10px);
    .title{
        padding-bottom: rem(15px);
        font-size: rem(30px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        a{
            color: var(--primary);
            font-size: rem(24px);
        }
    }
    .content{
        li{
            padding-bottom: rem(16px);
            &:last-child{
                padding-bottom: 0;
            }
            .label{
                color: var(--normalColor)
            }
            .desc{
                color: var(--minorColor);
                font-size: rem(24px);
                margin-top: rem(4px);
            }
        }

    }
}

</style>
