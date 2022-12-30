<template>
    <div>
        <!-- 用来tsource登录的路由页面 -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

// 进入页面的提示
const alertTip = () => {
    Dialog.alert({
        title: '',
        message: t('common.platformTips'),
        confirmButtonText: t('fundInfo.iknow'),
    }).then(() => {

    }).catch(() => {})
}
onMounted(() => {
    alertTip()
    router.replace({ 'name': 'Home' })
})
</script>

<style lang="scss" scoped>

</style>
