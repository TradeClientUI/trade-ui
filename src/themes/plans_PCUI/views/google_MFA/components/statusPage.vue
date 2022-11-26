<template>
    <div class='page-wrap'>
        <!-- <LayoutTop :back='true' /> -->
        <Top absolute back left-icon='arrow-left' :right-action='false' show-center>
            <template #left>
                <a class='topBack' href='javascript:;' @click='$router.back()'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>
        <div class='bigIcon'>
            <i class='icon icon_dunpai'></i>
        </div>
        <p class='desc'>
            {{ $t("mfa.enableDesc") }}
        </p>
        <van-cell :title='$t("mfa.enableTitle")'>
            <template #right-icon>
                <van-switch :active-color='$style.primary' :model-value='statusChecked' size='24px' @update:model-value='onUpdateStatus' />
            </template>
        </van-cell>
    </div>
</template>

<script setup>
import Top from '@/components/top'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

const statusChecked = computed(() => store.state._user.customerInfo?.googleId > 0)
const onUpdateStatus = (newValue) => {
    const routeMatched = route.matched
    const parent = routeMatched[routeMatched.length - 2]
    router.push({ path: newValue ? parent.path + '/googleMFA/install' : parent.path + '/googleMFA/bind' })
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(60px);
        color: var(--primary);
        font-size: rem(180px);
        text-align: center;
    }
    .desc {
        padding-top: rem(10px);
        padding-bottom: rem(100px);
        color: var(--minorColor);
        font-size: rem(28px);
        text-align: center;
    }
}
</style>
