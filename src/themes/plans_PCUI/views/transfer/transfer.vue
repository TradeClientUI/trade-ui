<template>
    <centerViewDialog class='transferPage'>
        <transferMain />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import transferMain from './components/transferMain'

export default {
    components: {
        centerViewDialog,
        transferMain
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindEmailPage {
    line-height: 50px;
}
</style>
