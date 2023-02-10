<template>
    <div class='page-wrap' :style='"min-height:" + wrapperHeight'>
        <noAccess />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import noAccess from '@/themeCommon/user/noAccess.vue'

const wrapperHeight = ref(0)
const setMinHeight = () => {
    const heightFooter = document.querySelectorAll('div.footer-nav')
    const headerFooter = document.querySelectorAll('div.header-nav')
    const calcHeight = heightFooter[0].clientHeight + headerFooter[0].clientHeight
    wrapperHeight.value = 'calc(100vh - ' + calcHeight +
        'px)'
}
onMounted(() => {
    setMinHeight()
})

</script>

<style lang="scss" scoped>
.page-wrap{
    width: 500px;
    margin: 0 auto;
}
</style>
