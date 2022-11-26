<template>
    <p class='minorTip'>
        {{ $t('fundInfo.fundChartTip') }}
    </p>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.minorTip{
    text-align: center;
    margin-top: rem(50px);
    color: var(--minorColor);
}
</style>
