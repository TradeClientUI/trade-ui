<template>
    <div class='plansList'>
        <el-tabs v-model='activePlans' @tab-click='handleClick'>
            <el-tab-pane v-for='item in plansList' :key='item.id' :label="$t('tradeType.'+item.id)" :name='String(item.id)' />
        </el-tabs>
    </div>
</template>

<script setup>
import { computed, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { ElTabPane, ElTabs } from 'element-plus'

const store = useStore()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
})

// 玩法列表
const isWallet = store.state._base.wpCompanyInfo.isWallet
const plansList = computed(() => store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet)))
const activePlans = ref(String(props.modelValue || plansList.value[0]?.id))
emit('update:modelValue', unref(activePlans))

const handleClick = (val) => {
    emit('update:modelValue', val.paneName)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.plansList{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex: 1;
    :deep{
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__nav-wrap::after{
            display: none;
        }
        .el-tabs__active-bar{
            height: 3px;
        }
        .el-tabs__item{
            font-size: 20px;
            color: var(--normalColor);
            line-height: 22px;
            font-weight: 400;
            &.is-active{
                color: var(--primary);
                font-weight: bold;
            }
        }
        .el-tabs__active-bar{
            background-color: var(--primary);
        }
    }
}
</style>
