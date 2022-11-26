<template>
    <div>
        <van-tabs v-model:active='active' class='fundInfoTab' type='card'>
            <van-tab :title='$t("fundInfo.baseInfo")'>
                <baseVue v-if='active===0' />
            </van-tab>
            <van-tab :title='$t("fundInfo.fundPerformance")'>
                <performanceVue v-if='active===1' />
            </van-tab>
            <van-tab :title='$t("fundInfo.investCompose")'>
                <realtime-invest-compose v-if='active===2' />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup>
import { localGet, localSet } from '@/utils/util'
import { provide, ref, defineProps, watchEffect } from 'vue'
import baseVue from './base.vue'
import performanceVue from './performance.vue'
import realtimeInvestCompose from './realtimeInvestCompose.vue'
const props = defineProps({
    fundId: [String, Number]
})
const active = ref(parseFloat(localGet('fundInfoTabIndex') || 1))
watchEffect(() => {
    localSet('fundInfoTabIndex', active.value)
})
provide('fundId', props.fundId)
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fundInfoTab{
    margin: rem(30px) rem(20px);
    min-height: 320px;
    :deep(.van-tabs__wrap){
        border: 0 !important;
        margin-bottom: rem(30px);
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
}
</style>
