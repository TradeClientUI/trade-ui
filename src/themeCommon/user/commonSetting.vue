<template>
    <LayoutTop :custom-back='true' :menu='false' :title='$t("route.mine")' @back='back' />
    <div class='page-wrap'>
        <p class='header'>
            {{ $t('cRoute.commonSetting') }}
        </p>
        <van-cell-group :border='false' class='cellGroup'>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.lang")'
                @click='langShow=true'
            >
                <template #right-icon>
                    <span class='label'>
                        {{ langItem.name }}
                    </span>
                    <van-icon class='right-arrow' name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='Number(chartVal) === 1 ? $t("common.redDown") : $t("common.redUp")'
                @click='colorShow=true'
            >
                <template #right-icon>
                    <img alt='' class='updown-icon' :src='Number(chartVal) === 1 ? "/images/redDown.png" : "/images/redUp.png"' />
                    <van-icon class='right-arrow' name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.dark")'
            >
                <template #right-icon>
                    <van-switch v-model='themeVal' :active-color='$style.primary' size='24px' @change='colorSelect' />
                </template>
            </van-cell>
            <van-cell
                v-if='inviteVis'
                class='cellItem'
                is-link
                :title='$t("common.invite")'
                to='/invite'
            />
        </van-cell-group>
    </div>
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
                <span class='lang-label'>
                    {{ item.name }}
                </span>
                <van-icon class='success-icon' name='success' />
            </div>
        </div>
    </van-popup>

    <van-popup
        v-model:show='colorShow'
        class='custom-popup'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.chartColor') }}
            </div>
            <i class='icon_guanbi' @click='colorShow=false'></i>
        </div>
        <div class='popup-wrap'>
            <van-radio-group v-model='chartVal' @change='colorShow = false'>
                <van-cell-group :border='false' inset>
                    <van-cell
                        class='popup-item'
                        clickable
                        @click='upDownColorSelect("1")'
                    >
                        <template #title>
                            <div class='left'>
                                <span class='label'>
                                    {{ $t('common.up') }}
                                </span>
                                <i class='icon icon_lvzhang color-green'></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class='label'>
                                    {{ $t('common.down') }}
                                </span>
                                <i class='icon icon_hongdie color-red'></i>
                            </div>
                        </template>
                        <template #right-icon>
                            <van-radio name='1' />
                        </template>
                    </van-cell>
                    <van-cell
                        class='popup-item'
                        clickable
                        @click='upDownColorSelect("2")'
                    >
                        <template #title>
                            <div class='left'>
                                <span class='label'>
                                    {{ $t('common.up') }}
                                </span>
                                <i class='icon icon_hongzhang color-red'></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class='label'>
                                    {{ $t('common.down') }}
                                </span>
                                <i class='icon icon_lvdie color-green'></i>
                            </div>
                        </template>
                        <template #right-icon>
                            <van-radio name='2' />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
import { changeLang } from '@/api/base'
import { useI18n } from 'vue-i18n'
import Colors, { setRootVariable } from '@plans/colorVariables'
import i18n, { loadLocaleMessages } from '@/themeCommon/i18n/i18n.js'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    components: { Top },
    setup (props, context) {
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            themeVal: localGet('invertColor') === 'night',
            langShow: false,
            colorShow: false,
            chartVal: JSON.parse(localGet('chartConfig'))?.chartColorType.toString() || '1',
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const supportLanguages = computed(() => store.state.supportLanguages)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })
        // 当前选择的语言项
        const langItem = computed(() => supportLanguages.value.find(el => el.val === state.lang))

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
            const themeColor = action ? 'night' : 'light'
            // 设置全局变量
            store.commit('Update_invertColor', themeColor)
            setRootVariable(themeColor)
            state.colorVisible = false

            let themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                themeColors = JSON.parse(themeColors)

                document.body.style.setProperty('--color', themeColors[themeColor].color)
                document.body.style.setProperty('--contentColor', themeColors[themeColor].contentColor)
                document.body.style.setProperty('--primaryAssistColor', themeColors[themeColor].primaryAssistColor)
                document.body.style.setProperty('--bgColor', themeColors[themeColor].bgColor)
                document.body.style.setProperty('--normalColor', themeColors[themeColor].normalColor)
                document.body.style.setProperty('--minorColor', themeColors[themeColor].minorColor)
                document.body.style.setProperty('--lineColor', themeColors[themeColor].lineColor)
                document.body.style.setProperty('--assistColor', themeColors[themeColor].assistColor)
                document.body.style.setProperty('--placeholdColor', themeColors[themeColor].placeholdColor)
            }
        }

        // 设置红涨绿跌颜色
        const upDownColorSelect = (chartObj) => {
            const curTheme = localGet('invertColor')
            state.chartVal = chartObj
            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': chartObj
                }))
            } else {
                locChartConfig['chartColorType'] = chartObj
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }
            const themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                const { riseColor, fallColor } = JSON.parse(themeColors)[curTheme]
                if (chartObj === 1) {
                    document.body.style.setProperty('--riseColor', riseColor)
                    document.body.style.setProperty('--fallColor', fallColor)
                } else {
                    document.body.style.setProperty('--riseColor', fallColor)
                    document.body.style.setProperty('--fallColor', riseColor)
                }
            }

            setRootVariable()
            state.colorShow = false
        }

        const back = () => {
            return router.replace('/mine')
        }

        return {
            supportLanguages,
            langSelect,
            colorSelect,
            upDownColorSelect,
            back,
            inviteVis,
            langItem,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-popup {
    --van-cell-group-inset-padding: 0;
    --van-cell-group-background-color: var(--bgColor);
    --van-cell-group-inset-border-radius: 0;
    .popup-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: rem(20px);
        padding: 0 rem(30px);
        line-height: rem(130px);
        background: var(--contentColor);
        border-radius: rem(10px);
        &:last-child {
            margin-bottom: 0;
        }
        .left {
            .label {
                font-size: rem(32px);
                vertical-align: middle;
            }
            .color-icon {
                width: rem(40px);
            }
            .icon {
                margin-left: -3px;
                font-size: rem(50px);
                vertical-align: middle;
            }
            .color-red {
                color: #B72122;
            }
            .color-green {
                color: #2B70AE;
            }
        }
        .van-radio {
            .van-radio__icon--checked {
                .van-icon {
                    line-height: normal;
                }
            }
        }
        &::after {
            border-bottom: none;
        }
    }
}
.lang-popup {
    .popup-wrap {
        .lang-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: rem(130px);
            padding: 0 rem(30px);
            margin-bottom: rem(12px);
            background: var(--contentColor);
            border-radius: rem(10px);
            .lang-label {
                color: var(--color);
                font-size: rem(32px);
            }
            .lang-icon {
                width: rem(72px);
                height: rem(72px);
                border-radius: 50%;
            }
            .success-icon {
                display: none;
                font-size: rem(42px);
                color: var(--primary);
            }
        }
        .active {
            .success-icon {
                display: block;
            }
        }
    }
}

</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.custom-popup {
    :deep(.van-radio-group) {
        background: chocolate;
    }
}
.page-wrap {
    padding-top: rem(110px);
    .header {
        padding-bottom: rem(30px);
        padding-left: rem(30px);
        font-size: rem(48px);
        background: var(--contentColor);
    }
    .cellGroup {
        .cellItem {
            //background: none;
            display: flex;
            align-items: center;
            height: rem(120px);
            font-size: rem(32px);
            line-height: rem(120px);
            background: var(--contentColor);
            border-top: solid rem(10px) var(--bgColor);
            //margin-top: rem(10px);
            &::after {
                border: none;
            }
            :deep(.van-cell__title) {
                color: var(--color);
            }
            .label {
                color: var(--color);
                margin-right: rem(20px);
            }
            .lang-icon {
                width: rem(56px);
                height: rem(56px);
                margin-right: rem(20px);
                border-radius: 50%;
            }
            .right-arrow {
                margin-top: -4px;
                color: var(--minorColor);
            }
            .updown-icon {
                width: rem(40px);
                margin-right: rem(20px);
            }
        }
    }
}
</style>
