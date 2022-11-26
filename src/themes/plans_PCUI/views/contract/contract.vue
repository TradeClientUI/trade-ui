<template>
    <centerViewDialog class='contractPage'>
        <contractComp />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import contractComp from './components/contractComp'

export default {
    components: {
        centerViewDialog,
        contractComp
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.contractPage {
    line-height: 50px;
}
</style>
