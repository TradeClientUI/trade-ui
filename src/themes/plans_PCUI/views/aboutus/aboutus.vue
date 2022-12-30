<template>
    <router-view />
    <about />
</template>

<script>
import about from '@/themeCommon/user/about.vue'
export default {
    components: {
        about
    },
    setup () {

    }
}
</script>
