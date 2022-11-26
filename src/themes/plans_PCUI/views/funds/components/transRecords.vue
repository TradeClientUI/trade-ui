<template>
    <router-view />
    <div class='transRecords'>
        <Header v-model:params='params' />
        <Content v-if='params.tradeType && mounted' :common-options='commonOptions' :params='params' />
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import Header from './Header'
import Content from './Content'

const commonOptions = {}
const params = ref({})
// 不同table数据混在一起了
const mounted = ref(true)
watch(() => params.value.tradeType, async () => {
    mounted.value = false
    await nextTick()
    mounted.value = true
})
</script>

<style lang="scss" scoped>
.transRecords{
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: var(--contentColor);
    border-radius: 10px;
}
</style>
