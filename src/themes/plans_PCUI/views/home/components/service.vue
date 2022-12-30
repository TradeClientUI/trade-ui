<template>
    <a class='service' @click='goService'>
        <i class='icon icon_xiaoxizhongxin' :title="$t('newHomeFooter.customer')"></i>
    </a>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const router = useRouter()
const goService = () => {
    router.push('service')
}
</script>

<style lang='scss' scoped>
.service {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: 50%;
    position: fixed;
    right: 10px;
    bottom: 16px;
    z-index: 102;
    cursor: pointer;
    @include hover();
    .icon {
        font-size: 18px;
        color: #FFF;
    }
}
</style>
