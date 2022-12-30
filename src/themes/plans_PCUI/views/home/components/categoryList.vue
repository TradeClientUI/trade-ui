<template>
    <div class='plansList'>
        <el-tabs v-model='activeName' @tab-click='handleClick'>
            <el-tab-pane v-for='(item, index) in props.list' :key='index' :label="item.title" :name='String(index)' />
        </el-tabs>
    </div>
</template>

<script setup>
import { computed, unref } from 'vue'
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

emit('update:modelValue', unref(activeName))

const handleClick = (val) => {
    emit('update:modelValue', val.paneName)
}

</script>
