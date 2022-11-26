<template>
    <div class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' :title='pageTitle' />
        <van-tabs
            v-model:active='tabActive'
            class='recordTabBar'
            color='$style.primary'
            @change='directionChange'
        >
            <van-tab :title='$t("fundInfo.applyRecords")' />
            <van-tab :title='$t("fundInfo.redeemRecords")' />
        </van-tabs>
        <applyRecord v-if='tabActive === 0' />
        <redeemRecord v-else />
    </div>
</template>

<script setup>
import applyRecord from './components/applyRecord.vue'
import redeemRecord from './components/redeemRecord.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const tabActive = ref(route.query.direction === 'buy' ? 0 : 1)

const pageTitle = computed(() => tabActive.value === 0 ? t('fundInfo.applyRecords') : t('fundInfo.redeemRecords'))

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp {
    height: 100%;
    margin-top: rem(110px);
    overflow: hidden;

    --van-tabs-bottom-bar-color: var(--primary);
}

</style>
