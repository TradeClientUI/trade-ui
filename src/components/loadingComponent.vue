<template>
    <div v-bind='$attrs' class='loadingComponents'>
        <span class='loadIcon'></span>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loadingComponents{
    position: relative;
    min-height: 60px;
}
</style>
