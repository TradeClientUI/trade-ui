<template>
    <div class='pages-faq'>
        <faqs />
        <NewFooter />
    </div>
</template>

<script setup>
import faqs from '@/themeCommon/user/faqs.vue'
import NewFooter from '../../../layout/layoutBottom'

</script>

<style lang="scss" scoped>
.pages-faq {
    padding-top: rem(80px);
}
</style>
