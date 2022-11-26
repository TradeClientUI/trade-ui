<template>
    <LayoutTop :custom-back='true' :menu='false' title='' @back='back' />
    <div class='page-wrap'>
        <van-cell v-if='customInfo' is-link :title='$t(Number(customInfo.loginPassStatus) === 1 ?"forgot.setPwd" : "login.modifyLoginPwd")' to='/setLoginPwd' />
        <van-cell v-if='customInfo && !customInfo.phone' is-link :title='$t("setting.bindPhone")' to='/bindMobile' />
        <van-cell v-if='customInfo && !customInfo.email' is-link :title='$t("setting.bindEmail")' to='/bindEmail' />
        <van-cell v-if='customInfo && customInfo.email' is-link :title='$t("setting.replaceEmail")' to='/changeBindEmail' />
        <van-cell v-if='customInfo && customInfo.phone' is-link :title='$t("setting.replacePhone")' to='/changeBindMobile' />
        <van-cell is-link :title='$t("setting.setLang")' :value='langText' @click='langVisible=true' />
        <van-cell is-link :title='$t("setting.color")' :value='colorText' @click='colorVisible=true' />
        <van-cell is-link :title='$t("common.chartColor")' :value='chartText' @click='chartSettingVisible=true' />

        <van-button v-if='customInfo' class='logout-btn' :loading='loading' type='primary' @click='handleLogout'>
            <span>{{ $t("setting.logout") }}</span>
        </van-button>

        <van-action-sheet v-model:show='langVisible' :actions='langActions' @select='langSelect' />
        <van-action-sheet v-model:show='colorVisible' :actions='colorsActions' @select='colorSelect' />
        <van-action-sheet v-model:show='chartSettingVisible' :actions='chartAction' @select='chartSelect' />
        <Loading :show='loading' />
    </div>
</template>

<script>
import { toRefs, reactive, computed, getCurrentInstance, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { isEmpty, removeLoginParams, localSet, localGet, setCookie, getCookie } from '@/utils/util'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { changeLang } from '@/api/base'
import i18n, { loadLocaleMessages } from '@plans/i18n/i18n.js'
import Colors, { setRootVariable } from '@plans/colorVariables'
export default {
    setup (props) {
        const instance = getCurrentInstance()
        const { t, locale } = useI18n({ useScope: 'global' })
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const colorsActions = [
            { val: 'light', name: t('theme.day') },
            { val: 'night', name: t('theme.night') }
        ]
        const chartAction = [
            { val: 1, name: t('common.redDown') },
            { val: 2, name: t('common.redUp') },
        ]

        const store = useStore()
        const router = useRouter()
        const state = reactive({
            loading: false,
            langVisible: false,
            colorVisible: false,
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
            langActions: store.state.supportLanguages,
            checked: false,
            chartSettingVisible: false,
            chartVal: JSON.parse(localGet('chartConfig'))?.chartColorType || 1
        })
        const langText = computed(() => {
            const curLang = state.langActions.find(el => el.val === state.lang)
            return curLang ? curLang.name : ''
        })
        const colorText = computed(() => {
            const cur = colorsActions.find(el => el.val === store.state.invertColor)
            return cur ? cur.name : ''
        })

        const chartText = computed(() => chartAction.find(el => el.val === state.chartVal)?.name)

        const handleLogout = () => {
            Dialog.confirm({
                confirmButtonText: t('common.sure'),
                cancelButtonText: t('common.cancel'),
                title: t('common.tip'),
                message: t('setting.logoutConfirm'),
            }).then(() => {
                state.loading = true
                // 退出登录
                instance.appContext.config.globalProperties.$MsgSocket.logout()
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push('/login')
            }).then(() => {
                location.reload()
            }).catch(() => {
                // on cancel
            })
        }

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
                state.langVisible = false
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

        // 选择颜色
        const colorSelect = (action) => {
            // 设置全局变量
            store.commit('Update_invertColor', action.val)
            setRootVariable(action.val)
            state.colorVisible = false

            let themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                themeColors = JSON.parse(themeColors)

                document.body.style.setProperty('--color', themeColors[action.val].color)
                document.body.style.setProperty('--contentColor', themeColors[action.val].contentColor)
                document.body.style.setProperty('--primaryAssistColor', themeColors[action.val].primaryAssistColor)
                document.body.style.setProperty('--bgColor', themeColors[action.val].bgColor)
                document.body.style.setProperty('--normalColor', themeColors[action.val].normalColor)
                document.body.style.setProperty('--minorColor', themeColors[action.val].minorColor)
                document.body.style.setProperty('--lineColor', themeColors[action.val].lineColor)
                document.body.style.setProperty('--assistColor', themeColors[action.val].assistColor)
                document.body.style.setProperty('--placeholdColor', themeColors[action.val].placeholdColor)
            }
        }

        // 设置图表颜色
        const chartSelect = (chartObj) => {
            state.chartVal = chartObj.val

            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': chartObj.val
                }))
            } else {
                locChartConfig['chartColorType'] = chartObj.val
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }
            const themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                const { riseColor, fallColor } = JSON.parse(themeColors)?.common
                if (chartObj.val === 1) {
                    document.body.style.setProperty('--riseColor', riseColor)
                    document.body.style.setProperty('--fallColor', fallColor)
                } else {
                    document.body.style.setProperty('--riseColor', fallColor)
                    document.body.style.setProperty('--fallColor', riseColor)
                }
            }

            setRootVariable()
            state.chartSettingVisible = false
        }

        const back = () => {
            return router.replace('/')
        }

        return {
            colorsActions,
            customInfo,
            handleLogout,
            langText,
            langSelect,
            colorSelect,
            colorText,
            chartAction,
            chartSelect,
            chartText,
            back,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    padding-top: rem(100px);
    overflow: auto;
    color: var(--color);
    background: var(--contentColor);
    .logout-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: rem(90px);
        background: var(--contentColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(30px);
        }
    }
}
</style>
