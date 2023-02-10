<template>
    <div class='terms'>
        <terms />
        <NewFooter />
    </div>
</template>

<script setup>
import terms from '@/themeCommon/user/terms'
import NewFooter from '../../../layout/layoutBottom'
</script>

<style lang="scss" scoped>
.terms {
    flex: 1;
    overflow-y: auto;
}
</style>
