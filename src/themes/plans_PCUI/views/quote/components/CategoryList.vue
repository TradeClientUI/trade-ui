<template>
    <div class='categoryList'>
        <el-tabs v-model='activeName'>
            <el-tab-pane v-for='(item, index) in props.list' :key='item.id' :label='item.title' :name='String(index)'>
                <template #label>
                    <component :is='item.slot?.label' v-if='item.slot?.label' />
                    <template v-else>
                        {{ item.title }}
                    </template>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:modelValue'])
const activeName = computed({
    get: () => props.modelValue,
    set: val => {
        emit('update:modelValue', val)
    }
})

</script>

<style lang="scss" scoped>
.categoryList{
    padding: 30px 20px 12px;
    :deep{
        .el-tabs__header{
            margin: 0;
            .el-tabs__item{
                @include hover();
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                background: var(--assistColor);
                color: var(--color);
                border-radius: 4px;
                margin-right: 20px;
                font-size: 14px;
                font-weight: 400;
                &.is-active{
                    color: var(--primary);
                    font-weight: 700;
                }
            }
        }
        .el-tabs__nav-wrap::after, .el-tabs__active-bar{
            display: none;
        }
    }
}
</style>
