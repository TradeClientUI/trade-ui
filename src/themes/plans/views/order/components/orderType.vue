<template>
    <div class='orderTypeTabWrapper'>
        <van-tabs v-model:active='orderType' class='orderTypeTab' @change='changeOrderType'>
            <van-tab v-for='(item,i) in btnList' :key='i' :name='item.val' :title='item.title' />
        </van-tabs>
        <a v-if="[1,2].includes(product.tradeType) && product.marginInfo?.type!=='1'" class='multipleBtn' href='javascript:;' @click='showMultipleSet'>
            <span class='text'>
                {{ mVal }}x
            </span>
            <i class='icon_icon_arrow'></i>
        </a>
    </div>
    <MultipleSet
        v-if="product && [2].includes(product.tradeType) && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :product='product'
    />
    <MultipleSetCross
        v-if="product && [1].includes(product.tradeType) && product.marginInfo && product.marginInfo.type!=='1'"
        v-model='multipleSetVisible'
        v-model:multipleVal='mVal'
        :product='product'
    />
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import MultipleSet from '@plans/components/multipleSet'
import MultipleSetCross from '@plans/components/multipleSetCross'
import { toolHooks } from '@plans/hooks/handicap'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    components: {
        MultipleSet,
        MultipleSetCross,
    },
    props: ['modelValue', 'tradeType', 'multipleVal', 'product', 'tradeMode'],
    emits: ['update:modelValue', 'selected', 'update:multipleVal'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { dealModeShowMap } = toolHooks()
        const state = reactive({
            orderType: 1,
            multipleSetVisible: false,
        })

        const mVal = computed({
            get: () => props.multipleVal,
            set: val => emit('update:multipleVal', val)
        })

        // 订单类型
        const btnList = computed(() => {
            const list = [
                {
                    title: t('trade.marketPrice'),
                    val: 1
                }
            ]

            const pendingTab = dealModeShowMap.value[props.tradeMode]?.pendingTab || {}
            if (pendingTab.show && pendingTab.tradeType?.includes(parseInt(props.tradeType))) {
                list.push({
                    // title: [3, 5, 9].includes(props.tradeType) ? t('trade.pending2') : t('trade.pending'),
                    title: t('trade.pending2'),
                    val: 10
                })
            }

            return list
        })
        watchEffect(() => {
            if (props.modelValue !== state.orderType) state.orderType = props.modelValue
        })
        const changeOrderType = (val) => {
            emit('update:modelValue', val)
            emit('selected', val)
        }

        // 显示杠杆倍数弹窗
        const showMultipleSet = () => {
            const customerInfo = store.state._user.customerInfo
            if (!customerInfo) return router.push('/login')
            state.multipleSetVisible = true
        }

        return {
            ...toRefs(state),
            mVal,
            showMultipleSet,
            changeOrderType,
            btnList,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderTypeTabWrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 rem(20px);
    .multipleBtn{
        height: rem(48px);
        line-height: rem(48px);
        color: var(--color);
        background: var(--assistColor);
        padding: 0 rem(16px);
        border-radius: rem(6px);
        color: var(--color);
        @include active();
        .text{
            display: inline-block;
            padding-right: rem(20px);
            font-size: rem(26px);
        }
        .icon_icon_arrow{
            font-size: rem(20px);
            vertical-align: 1px;
        }
    }
}

.orderTypeTab {

    --van-tabs-bottom-bar-width: 11vw;
    --van-tabs-line-height: 40px;
    --van-tabs-bottom-bar-color: var(--primary);
    :deep(.van-tab) {
        flex: none;
        margin-right: rem(40px);
        padding: 0;
        text-align: center;
    }
}
</style>
