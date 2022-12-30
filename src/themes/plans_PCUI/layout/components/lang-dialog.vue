<template>
    <div class='dialog-layer lang-dialog'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('compLang.languageAreas')"
            width='800px'
            @close='close'
        >
            <div class='lang-body'>
                <p class='title'>
                    {{ $t('compLang.SelectLanguageAreas') }}
                </p>
                <div class='list'>
                    <ul>
                        <li
                            v-for='(item, index) in langActions'
                            :key='index'
                            :class="{ 'active': item.val === currentLang }"
                            @click='changeLangHandler(item.val)'
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import i18n, { loadLocaleMessages } from '@planspc/i18n/i18n.js'
import { getCookie, setCookie } from '@/utils/util.js'
import { changeLang } from '@/api/base'

defineProps({
    // 是否显示弹窗
    modelValue: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:modelValue'])

const store = useStore()
const { locale } = useI18n({ useScope: 'global' })
// 客户信息
const customInfo = computed(() => store.state._user.customerInfo)
// 是否显示弹窗
const show = ref(false)
// 语言列表
const langActions = store.state.supportLanguages
// 当前语言
const currentLang = getCookie('lang')

// 打开弹窗
const open = () => {
    show.value = true
    emits('update:modelValue', true)
}

// 关闭弹窗
const close = () => {
    show.value = false
    emits('update:modelValue', false)
}

// 切换语言
const changeLangHandler = lang => {
    if (lang === locale.value) return false
    new Promise((resolve, reject) => {
        if (customInfo.value) {
            return changeLang(lang).then(res => {
                return res.check() ? resolve() : reject()
            })
        } else {
            resolve()
        }
    }).then(() => {
        close()

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
            store.commit('Update_countryList', [])
            store.commit('Update_countryListAll', [])
        })

        setCookie('lang', lang, 'y10')
    }).catch(() => {
        close()
    })
}

defineExpose({
    open
})
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.lang-dialog {
    :deep(.el-dialog__header) {
        width: 100% !important;
        text-align: left !important;
        border-bottom: 1px solid var(--lineColor);
    }
    :deep(.el-dialog__title) {
        font-size: 14px !important;
    }
    .lang-body {
        .title {
            font-size: 14px;
            color: var(--color);
        }
        .list {
            ul {
                display: flex;
                flex-wrap: wrap;
            }
            li {
                display: inline-flex;
                align-items: center;
                width: calc(25% - 16px);
                height: 40px;
                margin-top: 16px;
                margin-right: 16px;
                padding: 0 12px;
                font-size: 14px;
                color: var(--color);
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                    background: var(--assistColor);
                }
            }
            .active {
                color: var(--primary);
            }
        }
    }
}
</style>
