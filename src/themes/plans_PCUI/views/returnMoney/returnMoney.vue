<template>
    <centerViewDialog class='returnMoneyPage'>
        <returnMoneyMain />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import returnMoneyMain from './components/returnMoneyMain'

export default {
    components: {
        centerViewDialog,
        returnMoneyMain
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindEmailPage {
    line-height: 50px;

}
</style>
