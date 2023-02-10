<template>
    <div class='layout'>
        <about />
        <NewFooter />
    </div>
</template>

<script>
import NewFooter from '../../../layout/layoutBottom'
import about from '@/themeCommon/user/about.vue'
export default {
    components: {
        NewFooter,
        about
    },
    setup () {

    }
}
</script>

<style scoped lang="scss">
.layout {
    flex: 1;
    overflow-y: auto;
}
</style>
