<template>
    <centerViewDialog>
        <pageContainer />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import pageContainer from './components/createSuccess'

export default {
    components: {
        centerViewDialog,
        pageContainer
    },
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.pageWrapper {
    line-height: 50px;
}
</style>
