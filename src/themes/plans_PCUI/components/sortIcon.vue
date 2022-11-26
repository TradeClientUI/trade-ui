<template>
    <span class='sortIcon'>
        <i class='upArrow' :class="{ active:sortType==='asc' && sortField===name }"></i>
        <i class='downArrow' :class="{ active:sortType==='desc' && sortField===name }"></i>
    </span>
</template>

<script setup>
const props = defineProps({
    name: String,
    sortField: String,
    sortType: String,
})
</script>

<style lang="scss" scoped>
.sortIcon{
    display: inline-flex;
    flex-direction: column;
    vertical-align: middle;
    height: 12px;
    margin-left: .2em;
    .upArrow,.downArrow{
        width: 0;
        height: 0;
        border: 4px solid var(--placeholdColor);
        border-width: 0 4px 4px;
        border-color: transparent transparent var(--placeholdColor) transparent;
        &.active{
            border-color: transparent transparent var(--primary) transparent;
        }
    }
    .downArrow{
        margin-top: 2px;
        border-width: 4px 4px 0;
        border-color: var(--placeholdColor) transparent transparent transparent;
        &.active{
            border-color: var(--primary) transparent transparent transparent;
        }
    }
}
</style>
