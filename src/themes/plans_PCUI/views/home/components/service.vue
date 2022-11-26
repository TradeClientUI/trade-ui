<template>
    <a v-if='onlineService' class='service' :href='onlineService' target='_blank'>
        <i class='icon icon_xiaoxizhongxin' :title="$t('newHomeFooter.customer')"></i>
    </a>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
// 在线客服地址
const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)
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
        color: #fff;
    }
}
</style>
