<template>
    <van-popup
        v-model:show='show'
        :duration='0.2'
        position='left'
        :style="{ height: '100%' }"
        teleport='body'
        @closed='onClosed'
        @open='onOpen'
    >
        <div class='sidebarProduct'>
            <plansType
                v-if='!hideTradeType'
                ref='plansTypeRef'
                class='plansType'
                :list='plansList'
                :value='tradeType'
                @change='handleTradeType'
            />
            <search
                ref='searchRef'
                :class='{ margin: hideTradeType }'
                :trade-type='tradeType'
                @cancel='onCancel'
                @select='onClick'
            >
                <TopTab
                    v-model='categoryType'
                    :background='$style.contentColor'
                    class='tabs'
                    :dot='true'
                    line-height='0'
                    line-width='0'
                    :list='categoryList'
                />
                <div class='listWrap'>
                    <div v-for='item in productList' :key='item.id' class='li' @click='() => onClick(item)'>
                        {{ item.symbolName }}
                    </div>
                </div>
            </search>
        </div>
    </van-popup>
</template>

<script>
import { ref, computed, unref, toRaw, watch } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import TopTab from '@plans/components/topTab'
import useProduct from '@plans/hooks/useProduct'
import search from './search'
import { useStore } from 'vuex'

export default {
    components: {
        plansType,
        TopTab,
        search
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        defaultTradeType: {
            type: [String, Number],
            default: ''
        },
        hideTradeType: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue', 'select'],
    setup (props, context) {
        const store = useStore()
        const show = computed({
            get: () => props.modelValue,
            set: val => {
                context.emit('update:modelValue', val)
            }
        })

        const plansTypeRef = ref(null)
        const searchRef = ref(null)

        // 取消按钮事件
        const onCancel = () => {
            show.value = false
        }

        const isWallet = store.state._base.wpCompanyInfo.isWallet

        // 玩法列表
        const plansList = computed(() => store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet)))
        // 默认玩法类型
        const InitialTradeType = computed(() => String(props.defaultTradeType) || unref(plansList)[0].id)
        // 1.玩法类型
        const tradeType = ref(unref(InitialTradeType))
        // 2.板块类型
        const categoryType = ref(0)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            categoryType.value = 0
            unref(searchRef) && unref(searchRef).reset()
        }

        const localSymbolUpdate = computed(() => store.state._user.localSelfSymbolList)

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType, isSort: false
        })

        const onClick = product => {
            context.emit('select', toRaw(product), onCancel)
        }

        const onOpen = () => {
            tradeType.value = unref(InitialTradeType)
            categoryType.value = 0
            unref(plansTypeRef) && unref(plansTypeRef).reset()
        }

        const onClosed = () => {
            unref(searchRef) && unref(searchRef).reset()
        }

        watch(
            () => localSymbolUpdate.value, list => {
                if (unref(categoryType) === 0) {
                    const tempCur = categoryType.value
                    categoryType.value = categoryType.value === '1' ? '0' : '1'
                    categoryType.value = tempCur
                }
            }
        )

        return {
            show,
            tradeType,
            handleTradeType,
            categoryType,
            categoryList,
            productList,
            plansList,
            onCancel,
            onClick,
            plansTypeRef,
            onOpen,
            searchRef,
            onClosed
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.sidebarProduct {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: rem(640px);
    height: 100%;
    overflow: hidden;
    background: var(--contentColor);
    .plansType {
        flex: 0 0 rem(100px);
        border: 0;
    }
    .plansType,
    .tabs {
        box-sizing: border-box;
        width: 100%;
        padding: 0 rem(20px);
    }
    .tabs {
        margin: rem(20px) 0 0 0;
    }
    .listWrap {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        overflow-y: auto;
        color: var(--color);
        font-weight: 500;
        font-size: rem(30px);
        line-height: rem(32px);
        .li {
            width: 100%;
            padding: rem(40px) rem(20px);
            text-indent: rem(30px);
            border-bottom: 1px solid var(--bgColor);
            &:last-child {
                border: 0;
            }
        }
    }
    .margin {
        margin-top: rem(30px);
    }
}
</style>
