<template>
    <el-dropdown>
        <i class='icon icon_yuyan' :title="$t('header.language')"></i>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for='item in langActions' :key='item.val' @click='changeLangHandler(item.val)'>
                    {{ item.name }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { setCookie } from '@/utils/util'
import { changeLang } from '@/api/base'
import { useI18n } from 'vue-i18n'
import i18n, { loadLocaleMessages } from '@planspc/i18n/i18n.js'
export default {
    setup () {
        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        const { locale } = useI18n({ useScope: 'global' })
        const state = reactive({
            langActions: store.state.supportLanguages,
            loading: false,
        })

        // 切换语言
        const changeLangHandler = lang => {
            if (lang === locale.value) return false
            state.loading = true
            new Promise((resolve, reject) => {
                if (customInfo.value) {
                    return changeLang(lang).then(res => {
                        return res.check() ? resolve() : reject()
                    })
                } else {
                    resolve()
                }
            }).then(() => {
                state.loading = false

                // 替换URL
                const str = location.pathname
                const firstSlash = str.indexOf('/') + 1
                const twoSlash = str.indexOf('/', firstSlash) // 第二个斜杠下标
                const pathTemp = str.substring(twoSlash).substring(1, str.length)
                location.pathname = lang + '/' + pathTemp

                loadLocaleMessages(i18n, lang).then(() => {
                    locale.value = lang // change!
                    store.commit('del_cacheViews', 'Home')
                    store.commit('del_cacheViews', 'Layout')
                })

                setCookie('lang', lang, 'y10')
            }).catch(err => (state.loading = false))
        }
        return {
            ...toRefs(state),
            changeLangHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 16px;
    color: #D6DAE1;
    cursor: pointer;
}
</style>
