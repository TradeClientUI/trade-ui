<template>
    <van-popup
        v-model:show='langShow'
        class='custom-popup lang-popup'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.lang') }}
            </div>
            <i class='icon_guanbi' @click='langShow=false'></i>
        </div>

        <div class='popup-wrap'>
            <div
                v-for='(item, index) in supportLanguages'
                :key='index'
                class='lang-item'
                :class='{ active: lang === item.val }'
                @click='langSelect(item)'
            >
                <img alt='' class='lang-icon' :src="'/images/country_icon/'+ item.val + '.png?555'" />
            </div>
        </div>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue-demi'
import { useStore } from 'vuex'
import { changeLang } from '@/api/base'
import { getCookie, setCookie } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import i18n, { loadLocaleMessages } from '@/themeCommon/i18n/i18n.js'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const { t, locale } = useI18n({ useScope: 'global' })

        const state = reactive({
            loading: false,
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
        })

        // pop显示隐藏
        const langShow = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const supportLanguages = computed(() => store.state.supportLanguages)

        // 选择语言
        const langSelect = (action) => {
            state.loading = true
            new Promise((resolve, reject) => {
                if (customInfo.value) {
                    return changeLang(action.val).then(res => {
                        return res.check() ? resolve() : reject()
                    })
                } else {
                    resolve()
                }
            }).then(() => {
                state.loading = false
                state.lang = action.val

                // 替换URL
                const str = location.pathname
                const firstSlash = str.indexOf('/') + 1
                const twoSlash = str.indexOf('/', firstSlash) // 第二个斜杠下标
                const pathTemp = str.substring(twoSlash).substring(1, str.length)
                location.pathname = action.val + '/' + pathTemp

                loadLocaleMessages(i18n, action.val).then(() => {
                    locale.value = action.val // change!
                    store.commit('del_cacheViews', 'Home')
                    store.commit('del_cacheViews', 'Layout')
                })

                setCookie('lang', action.val, 'y10')
            }).catch(err => (state.loading = false))
        }

        return {
            ...toRefs(state),
            langShow,
            supportLanguages,
            langSelect,
        }
    }
}
</script>

<style lang="scss" scoped>
.lang-popup {
    .popup-wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 0 rem(25px);
        .lang-item {
            box-sizing: content-box;
            margin-right: rem(20px);
            margin-bottom: rem(42px);
            padding: rem(8px) rem(8px) rem(2px) rem(8px);
            border: rem(4px) solid transparent;
            .lang-icon {
                width: rem(120px);
                height: rem(120px);
            }
            &.active {
                border: rem(4px) solid var(--primary);
                border-radius: 50%;
            }
        }
    }
}
</style>
