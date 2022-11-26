<template>
    <div class='recordTab'>
        <van-tabs v-model:active='tabActive' class='recordTabBar'>
            <van-tab :title='$t("fundInfo.applyRecords")' />
            <van-tab :title='$t("fundInfo.redeemRecords")' />
            <van-tab :title='$t("fundInfo.assets")' title-class='last' />
        </van-tabs>

        <a v-if='tabActive<2' class='recordAll' href='javascript:;' @click='recordAll'>
            <i class='link icon_mingxi1'></i>
            <!-- {{ $t('trade.allPosition') }} -->
        </a>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    active: Number
})
const emit = defineEmits(['update:active'])
const tabActive = computed({
    get: () => props.active,
    set: value => emit('update:active', value)
})

// 跳转到所有记录的页面
const recordAll = () => {
    router.push({
        name: 'FundRecord',
        query: {
            direction: tabActive.value === 0 ? 'buy' : 'sell',
        }
    })
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.recordTab{
    display: flex;
    justify-content: space-between;
    background: var(--contentColor);

    --van-tabs-bottom-bar-color: var(--primary);
    .recordTabBar{
        width: 80%;
        :deep(.last){
            flex: none;
        }
    }
    .recordAll{
        margin-right: rem(30px);
        color: var(--color);
        line-height: rem(88px);
        .icon_mingxi1{
            font-size: rem(32px);
            vertical-align: middle;
            color: var(--color);
        }
    }
}
</style>
