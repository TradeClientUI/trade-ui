<template>
    <van-tabs v-model:active='orderType' class='orderTypeTab' @change='changeOrderType'>
        <van-tab v-for='(item,i) in btnList' :key='i' :name='item.val' :title='item.title' />
    </van-tabs>
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { toolHooks } from '@planspc/hooks/handicap'
export default {
    props: ['modelValue', 'tradeType', 'tradeMode'],
    emits: ['update:modelValue', 'selected'],
    setup (props, { emit }) {
        const { dealModeShowMap } = toolHooks()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            orderType: 1
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

        return {
            ...toRefs(state),
            changeOrderType,
            btnList,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderTypeTab {
    margin: 0 0 rem(20px);

    --van-tabs-bottom-bar-width: 11vw;
    --van-tabs-line-height: 40px;
    --van-tabs-bottom-bar-color: var(--primary);
    :deep(.van-tab) {
        flex: none;
        margin-right: 20px;
        padding: 0;
        text-align: center;
    }
    :deep(.van-tabs__line) {
        bottom: 17px;
        width: 35px;
    }
}
</style>
