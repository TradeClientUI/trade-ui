<template>
    <div class='header-nav'>
        <div class='nav-left'>
            <router-link to='/home'>
                <h1 class='logo'>
                    <img alt='' height='30' :src='logoUrl' />
                </h1>
            </router-link>
            <div class='menus'>
                <div v-if='businessConfig?.fundDEX' :class="['item', { 'active': $route.path === '/earning' }]">
                    <router-link to='/earning'>
                        <span class='link'>
                            Funds
                        </span>
                    </router-link>
                </div>
                <div :class="['item', { 'active': $route.path === '/quote' }]">
                    <router-link to='/quote'>
                        <span class='link'>
                            {{ $t('header.quote') }}
                        </span>
                    </router-link>
                </div>
                <div :class="['item', { 'active': $route.path === '/order' }]">
                    <el-dropdown @command='changePlans'>
                        <span class='link'>
                            {{ plansName }}
                            <i class='el-icon-caret-bottom'></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    v-for='item in plansList'
                                    :key='item.id'
                                    :command='item'
                                >
                                    {{ item.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div v-if='fundShow' :class="['item', { 'active': $route.path === '/fund' }]">
                    <router-link to='/fund'>
                        <span class='link'>
                            {{ $t('header.fund') }}
                        </span>
                        <span class='symbolUp'></span>
                    </router-link>
                </div>
                <div v-if='customerInfo.isFund === 1' :class="['item', { 'active': $route.path === '/fundManager' }]">
                    <router-link to='/fundManager'>
                        <span class='link'>
                            {{ $t('header.fundManager') }}
                        </span>
                    </router-link>
                </div>
                <div :class="['item', { 'active': $route.path === '/notice' }]">
                    <router-link to='/notice'>
                        <span class='link'>
                            {{ $t('route.noticeTitle') }}
                        </span>
                    </router-link>
                </div>
            </div>
        </div>
        <div class='nav-right'>
            <!-- 未登录 -->
            <div v-if="userAccountType==='G'" class='handle-not'>
                <router-link class='login' to='/login'>
                    {{ $t('c.login') }}
                </router-link>
                <router-link class='register' to='/register'>
                    {{ $t('c.register') }}
                </router-link>
            </div>
            <!-- 已登录 -->
            <div v-else-if='customerInfo' class='handle-have'>
                <div class='item'>
                    <el-popover
                        ref='popoverRef'
                        placement='bottom'
                        trigger='hover'
                        :width='250'
                    >
                        <template #reference>
                            <div class='user'>
                                <i class='head'></i>
                                <span class='no'>
                                    {{ customerInfo.customerNo }}
                                </span>
                            </div>
                        </template>
                        <div class='settingDrapdown'>
                            <ul class='list'>
                                <li v-if='Number(customerInfo.openAccountType) === 1' class='item' @click="$router.push('/businessKYC')">
                                    {{ $t('businessKYC.enterpriseKYC') }}
                                </li>
                                <li v-if='Number(customerInfo.openAccountType) === 0' class='item' @click="handRoutTo('/authentication')">
                                    {{ $t('cRoute.regKyc') }}
                                </li>
                                <li v-if='customInfo' class='item' @click='handRoutTo("/bindMobile")'>
                                    {{ customInfo.phone ? $t("setting.replacePhone") : $t('setting.bindPhone') }}
                                </li>
                                <li v-if='customInfo' class='item' @click='handRoutTo("/bindEmail")'>
                                    {{ customInfo.email ? $t("setting.replaceEmail") : $t('setting.bindEmail') }}
                                </li>
                                <li class='item' @click="handRoutTo('/googleMFA/status')">
                                    {{ $t('mfa.routeTitile') }}
                                </li>
                                <li class='item' @click="handRoutTo('/walletAddress')">
                                    {{ $t('withdraw.withdrawLink') }}
                                </li>
                                <li class='item' @click="handRoutTo('/bankList')">
                                    {{ $t('cRoute.bankList') }}
                                </li>
                                <li v-if='customInfo' class='item' @click='handRoutTo("/setLoginPwd")'>
                                    {{ Number(customInfo.loginPassStatus) === 1 ? $t("forgot.setPwd") : $t('login.modifyLoginPwd') }}
                                </li>
                                <li v-if='customInfo' class='item' @click='handRoutTo("/setFundPwd")'>
                                    {{ Number(customInfo.assertPassStatus) === 1 ? $t("forgot.setFundPwd") : $t('forgot.resetFundPwd') }}
                                </li>
                                <li class='item flexBetween'>
                                    <span>{{ $t('setting.chartColor') }}</span>
                                    <van-icon class='arrowIcon' name='arrow' />
                                    <div class='subDrapdown'>
                                        <ul class='list'>
                                            <li
                                                v-for='(item,i) in chartColorAction'
                                                :key='i'
                                                class='item flexBetween'
                                                :class='{ active:Number(item.val)===Number(chartColorActive) }'
                                                @click='changeChartColor(item)'
                                            >
                                                <span>{{ item.name }}</span>
                                                <van-icon v-show='Number(item.val)===Number(chartColorActive)' name='success' />
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li class='item' @click="$router.push('/api')">
                                    {{ $t('api.title') }}
                                </li>

                                <li class='item' @click='logoutHandler'>
                                    {{ $t('quitLogin') }}
                                </li>
                            </ul>
                        </div>
                    </el-popover>
                </div>
                <div class='item'>
                    <span class='link' @click="$router.push('/assets')">
                        {{ $t('common.wallet') }}
                    </span>
                </div>

                <div class='line'></div>
            </div>
            <!-- 操作功能 -->
            <div class='handle-feature'>
                <div v-if='onlineService' class='item'>
                    <a :href='onlineService' target='_blank'>
                        <i class='icon icon_kefu' :title="$t('newHomeFooter.customer')"></i>
                    </a>
                </div>
                <!-- <div class='item'>
                    <DownloadIcon />
                </div> -->
                <div class='item'>
                    <LangIcon />
                </div>
                <!-- <div class='item'>
                    <ThemeIcon />
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { onBeforeMount, computed, reactive, toRefs, ref, unref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { isEmpty, localGet, localSet, localRemove } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ThemeIcon from './components/themeIcon'
import LangIcon from './components/langIcon'
import Msg from './components/msg'
import DownloadIcon from './components/downloadIcon'
import { colors, setRootVariable } from '@planspc/colorVariables'
import { MsgSocket } from '@/plugins/socket/socket'
import { GridItem } from 'vant'
import useMethods from '@planspc/hooks/useMethods'
const logoImg = require('@planspc/images/logo.png')

export default {
    components: {
        ThemeIcon,
        LangIcon,
        Msg,
        DownloadIcon
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { toOrderPriority } = useMethods()
        const businessConfig = computed(() => store.state.businessConfig)
        const popoverRef = ref()
        const state = reactive({
            chartColorActive: JSON.parse(localGet('chartConfig'))?.chartColorType || 1,
        })
        const chartColorAction = [
            { val: '1', name: t('common.redDown') },
            { val: '2', name: t('common.redUp') },
        ]

        const plansName = computed(() => {
            if (route.query.tradeType) {
                const tradeType = route.query.tradeType
                return t('tradeType[' + tradeType + ']')
            } else {
                return t('header.trade')
            }
        })

        const logoUrl = computed(() => {
            return store.state.businessConfig?.pcuiLogo || logoImg
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 在线客服地址
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        // 设置涨跌颜色
        const changeChartColor = item => {
            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': item.val
                }))
            } else {
                locChartConfig['chartColorType'] = item.val
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }

            state.chartColorActive = item.val

            const { riseColor, fallColor } = colors.common
            if (parseInt(item.val) === 1) {
                document.body.style.setProperty('--riseColor', riseColor)
                document.body.style.setProperty('--fallColor', fallColor)
            } else {
                document.body.style.setProperty('--riseColor', fallColor)
                document.body.style.setProperty('--fallColor', riseColor)
            }
            setRootVariable()
            const event = new CustomEvent('Launch_chartColor', { detail: item.val })
            document.body.dispatchEvent(event)
        }
        // 退出登录
        const logoutHandler = () => {
            MsgSocket.logout()
            Promise.resolve().then(() => {
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push({ name: 'Login' })
            }).then(() => {
                location.reload()
            })
        }

        // 路由跳转
        const handRoutTo = (path) => {
            if (route.path.includes(path)) return
            popoverRef.value.visibility = false
            router.push(route.path + path)
        }

        return {
            logoUrl,
            plansList,
            onlineService,
            userAccountType,
            customerInfo,
            handRoutTo,
            customInfo,
            formatTime,
            changePlans,
            plansName,
            ...toRefs(state),
            // 是否显示基金功能
            chartColorAction,
            changeChartColor,
            logoutHandler,
            fundShow: window['fundShow'],
            popoverRef,
            businessConfig
        }
    }
}
</script>

<style lang="scss" scoped>
.header-nav {
    position: relative;
    z-index: 100;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    min-width: 1200px;
    height: 64px;
    padding: 0 16px;
    background-color: #181A20;
    &.Home {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #181A20;
    }
    .nav-left {
        display: flex;
        align-items: center;
        height: 100%;
        .logo {
            display: flex;
            align-items: center;
            margin-right: 32px;
        }
        .menus {
            display: flex;
            align-items: center;
            height: 100%;
            font-weight: bold;
            .item {
                position: relative;
                margin-right: 30px;
                cursor: pointer;
                &:last-of-type {
                    margin-right: 0;
                }
                .link {
                    color: #FFF;
                    font-size: 16px;
                    cursor: pointer;
                    line-height: normal;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
            .active {
                .link {
                    color: var(--primary);
                }
            }
            .symbolUp {
                display: inline-block;
                width: 14px;
                height: 14px;
                margin-top: -2px;
                margin-left: 4px;
                vertical-align: middle;
                background: url('/images/arrowUp.png') no-repeat;
                background-size: cover;
            }
        }
    }
    .nav-right {
        display: flex;
        align-items: center;
        height: 100%;
        .handle-not {
            display: flex;
            align-items: center;
            margin-right: 24px;
            font-size: 14px;
            .login {
                margin-right: 15px;
                color: #FFF;
                &:hover {
                    color: var(--primary);
                }
            }
            .register {
                @include hover();
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 28px;
                color: #FFF;
                background: var(--primary);
                border-radius: 4px;
            }
        }
        .handle-have {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 20px;
                &:nth-last-child(2) {
                    margin-right: 0;
                }
                .link {
                    color: #FFF;
                    font-size: 16px;
                    cursor: pointer;
                    &:hover {
                        color: var(--primary);
                    }
                }
                .user {
                    display: flex;
                    align-items: center;
                    color: #D6DAE1;
                    cursor: pointer;
                    .head {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        margin-right: 8px;
                        overflow: hidden;
                        // background: #91B6EE;
                        background: url('../images/user.png') center center no-repeat;
                        border-radius: 50%;
                        i {
                            margin-top: 10px;
                            color: #FFF;
                            font-size: 24px;
                        }

                        // &::before{
                        //     margin-top: 9px;
                        //     font-size: 22px;
                        //     color: #fff;
                        // }
                    }
                    .no {
                        font-size: 16px;
                        line-height: 1;
                    }
                }
                .icon {
                    color: #D6DAE1;
                    font-size: 16px;
                    cursor: pointer;
                }
            }
            .line {
                width: 1px;
                height: 18px;
                margin: 0 24px;
                background: #515366;
            }
        }
        .handle-feature {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 20px;
                line-height: 1;
                &:last-of-type {
                    margin-right: 0;
                }
                .icon {
                    color: #D6DAE1;
                    font-size: 16px;
                    cursor: pointer;
                }
                &:deep(.icon_yuyan) {
                    display: inline-flex;
                }
            }
        }
    }
}
.information_box {
    width: 400px;
    height: 600px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    .information_head {
        width: 100%;
        height: 48px;
        text-align: center;
        background-color: #FFF;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        .current_type {
            font-size: 16px;
            line-height: 48px;
            cursor: pointer;
            i {
                margin-left: 4px;
                color: #DCDFE6;
                cursor: pointer;
            }
        }
    }
    .type_list {
        ul {
            width: 100%;
            li {
                width: 100%;
                height: 40px;
                font-size: 14px;
                line-height: 44px;
                text-align: center;
                background-color: #FFF;
                cursor: pointer;
            }
        }
        .activeLi {
            color: #EE0A24;
        }
    }
    .msg-list {
        flex: 1;
        height: 552px;
        overflow: auto;
        background-color: var(--bgColor);
        .msg-item {
            margin: 7px;
            padding: 10px;
            background-color: var(--contentColor);
            border-top: solid 10px var(--bgColor);
            .msg-title {
                color: var(--color);
                font-weight: bold;
                font-size: 14px;
                line-height: 30px;
            }
            .msg-content {
                color: var(--color);
                font-weight: 500;
                font-size: 12px;
                line-height: 20px;
            }
            .msg-time {
                color: var(--minorColor);
                font-weight: 400;
                font-size: 12px;
                line-height: 30px;
            }
        }
    }
}
.settingDrapdown {
    font-size: 14px;
    .item {
        position: relative;
        width: 220px;
        height: 40px;
        padding: 0 0 0 10px;
        color: var(--color);
        line-height: 40px;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 5px;
        cursor: pointer;
        .arrowIcon {
            display: none;
            float: right;
        }
        &:hover,
        &.active {
            color: var(--primary);
            .arrowIcon,
            .subDrapdown {
                display: block;
            }
        }
    }
    .flexBetween {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .subDrapdown {
        position: absolute;
        top: 0;
        right: 100%;
        display: none;
        width: 110%;
        padding: 8px;
        color: var(--color);
        background: var(--contentColor);
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
}
</style>
