<template>
    <van-tabs v-if='showTabs' v-model:active='active' class='fundInfoTab' type='card'>
        <van-tab :title='$t("fundInfo.baseInfo")'>
            <baseVue v-if='active === 0' />
        </van-tab>
        <van-tab :title='$t("fundInfo.fundPerformance")'>
            <performanceVue v-if='active === 1' />
        </van-tab>
        <van-tab :title='$t("fundInfo.investCompose")'>
            <realtime-invest-compose v-if='active === 2' :all-show='allShow' :rotate='90' />
        </van-tab>
    </van-tabs>
    <div v-else>
        <baseVue />
        <performanceVue />
        <realtime-invest-compose :all-show='allShow' :rotate='0' />
    </div>
</template>

<script setup>
import { provide, ref, defineProps, watchEffect } from 'vue'
import baseVue from './base.vue'
import performanceVue from './performance.vue'
import realtimeInvestCompose from './realtimeInvestCompose.vue'
import { localGet, localSet } from '@/utils/util'
const props = defineProps({
    fundId: [String, Number],
    jump: String,
    // 是否显示选项卡
    showTabs: {
        type: Boolean,
        default: true
    },
    // 是否全部显示
    allShow: {
        type: Boolean,
        default: false
    }
})
const active = ref(parseFloat(localGet('fundInfoTabIndex') || 1))
provide('fundId', props.fundId)
provide('jump', props.jump)

watchEffect(() => {
    localSet('fundInfoTabIndex', active.value)
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fundInfoTab{
    margin: rem(30px) rem(20px);
    min-height: 320px;
    :deep(.van-tabs__wrap){
        border: 0 !important;
    }
    :deep(.van-tabs__nav){
        border: 0;
        span.van-tab__text{
            font-weight: normal !important;
        }
    }
    :deep(.van-tab){
        border: 0;
        &.van-tab--active{
            background: var(--assistColor);
            color: var(--primary);
        }
    }
    :deep(.van-tabs__content) {
        margin-top: 10px;
    }
}
</style>
