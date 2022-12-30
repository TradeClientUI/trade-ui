<template>
    <el-affix class='affixWrapper' :offset='0'>
        <div class='header-nav'>
            <div class='nav-left'>
                <router-link to='/home'>
                    <h1 class='logo'>
                        <img v-if='logoUrl' alt='' height='42' :src='logoUrl' />
                    </h1>
                </router-link>
            </div>
            <div class='menus'>
                <!-- <div v-if='businessConfig?.fundDEX' :class="['item', { 'active': $route.path === '/earning' }]">
                        <router-link to='/earning'>
                            <span class='link'>
                                Funds
                            </span>
                        </router-link>
                    </div> -->
                <div :class="['item', { 'active': $route.path === '/quote' }]">
                    <router-link to='/quote'>
                        <span class='link'>
                            {{ $t('header.quote') }}
                        </span>
                    </router-link>
                </div>
                <div v-if='plansList.length > 1' :class="['item', { 'active': $route.path === '/order' }]">
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
                <div v-else-if='plansList.length === 1' :class="['item', { 'active': $route.path === '/order' }]">
                    <span class='link' @click='changePlans(plansList[0])'>
                        {{ $t('route.trade') }}
                    </span>
                </div>
                <!-- <div :class="['item', { 'active': $route.path === '/fund' }]">
                        <router-link to='/fund'>
                            <span class='link'>
                                {{ $t('header.fund') }}
                            </span>
                            <span class='symbolUp'></span>
                        </router-link>
                    </div> -->
                <!-- <div v-if='customerInfo.isFund === 1' :class="['item', { 'active': $route.path === '/fundManager' }]">
                        <router-link to='/fundManager'>
                            <span class='link'>
                                {{ $t('header.fundManager') }}
                            </span>
                        </router-link>
                    </div> -->
                <!-- <div :class="['item', { 'active': $route.path === '/notice' }]">
                    <router-link to='/notice'>
                        <span class='link'>
                            {{ $t('route.noticeTitle') }}
                        </span>
                    </router-link>
                </div> -->
                <div :class="['item']">
                    <a :href='`https://academy.MagnaMarkets.com/${academyLocale}/`' target='_blank'>
                        <span class='link'>
                            {{ $t('route.academy') }}
                        </span>
                    </a>
                </div>
                <!-- craig--新增aboutnew页面 -->
                <div :class="['item', { 'active': $route.path === '/aboutus' }]">
                    <router-link to='/aboutus'>
                        <span class='link'>
                            {{ $t('header.aboutus') }}
                        </span>
                    </router-link>
                </div>
            </div>
            <div class='nav-right'>
                <!-- 未登录 -->
                <div v-if="userAccountType==='G'" class='handle-not'>
                    <router-link class='login' to='/login'>
                        {{ $t('c.login') }}
                    </router-link>
                    <router-link class='register pc_top_nav_signup_ga' to='/register'>
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
                                    <li v-if='Number(customerInfo.openAccountType) === 1 && isReal' class='item' @click="$router.push('/businessKYC')">
                                        {{ $t('businessKYC.enterpriseKYC') }}
                                    </li>
                                    <li v-if='Number(customerInfo.openAccountType) === 0 && isReal' class='item' @click="handRoutTo('/authentication')">
                                        {{ $t('cRoute.regKyc') }}
                                    </li>
                                    <li v-if='customInfo && isReal' class='item' @click='handRoutTo("/bindMobile")'>
                                        {{ customInfo.phone ? $t("setting.replacePhone") : $t('setting.bindPhone') }}
                                    </li>
                                    <li v-if='customInfo && isReal' class='item' @click='handRoutTo("/bindEmail")'>
                                        {{ customInfo.email ? $t("setting.replaceEmail") : $t('setting.bindEmail') }}
                                    </li>
                                    <li v-if='isReal' class='item' @click="handRoutTo('/googleMFA/status')">
                                        {{ $t('mfa.routeTitile') }}
                                    </li>
                                    <li v-if='isReal' class='item' @click="handRoutTo('/walletAddress')">
                                        {{ $t('withdraw.withdrawLink') }}
                                    </li>
                                    <li v-if='isReal' class='item' @click="handRoutTo('/bankList')">
                                        {{ $t('cRoute.bankList') }}
                                    </li>
                                    <li v-if='customInfo && isReal' class='item' @click='handRoutTo("/setLoginPwd")'>
                                        {{ Number(customInfo.loginPassStatus) === 1 ? $t("forgot.setPwd") : $t('login.modifyLoginPwd') }}
                                    </li>
                                    <li v-if='customInfo && isReal' class='item' @click='handRoutTo("/setFundPwd")'>
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

                                    <li class='item' @click='logoutHandler'>
                                        {{ $t('quitLogin') }}
                                    </li>
                                </ul>
                            </div>
                        </el-popover>
                    </div>
                    <div class='item'>
                        <span class='link' @click="$router.push('/assets')">
                            {{ $t('common.assets') }}
                        </span>
                    </div>
                    <div class='line'></div>
                    <div v-if='Number(customerInfo.associationCompanyId) > 0' class='item'>
                        <el-dropdown
                            popper-class='mock-account'
                        >
                            <div class='link account' :class="{ 'mock': customerInfo.companyType === 'demo' }">
                                {{ customerInfo.companyType === 'real' ? $t('mockAccount.real') : $t('mockAccount.demo') }}
                                <div class='triangle'></div>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>
                                        <div
                                            class='account-type'
                                            :class="{ 'active': customerInfo.companyType==='real' }"
                                            @click='switchAccount("real")'
                                        >
                                            <span class='radio'></span>
                                            <span>{{ $t('mockAccount.realAccount') }}</span>

                                            <!-- <p>交易品种更多，功能更强大</p> -->
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div
                                            class='account-type demo'
                                            :class="{ 'active': customerInfo.companyType==='demo' }"
                                            @click='switchAccount("demo")'
                                        >
                                            <span class='radio'></span>
                                            <span>{{ $t('mockAccount.demoAccount') }}</span>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <template v-if='showTopNavDeposit'>
                        <div class='line'></div>
                        <div class='item deposit' @click='goDeposit'>
                            {{ $t('trade.desposit') }}
                        </div>
                    </template>
                    <div class='line'></div>
                </div>
                <!-- 操作功能 -->
                <div class='handle-feature'>
                    <div class='item'>
                        <a @click="$router.push('/service')">
                            <i class='icon icon_kefu' :title="$t('newHomeFooter.customer')"></i>
                        </a>
                    </div>

                    <!-- <div class='item'>
                    <DownloadIcon />
                </div> -->
                    <div class='item'>
                        <LangIcon />
                    </div>
                    <div class='item'>
                        <ThemeIcon />
                    </div>
                </div>
            </div>
        </div>
        <el-affix :offset='0' />
    </el-affix>
</template>

<script>
import { computed, reactive, toRefs, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { isEmpty, localGet, localSet } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ThemeIcon from './components/themeIcon'
import LangIcon from './components/langIcon'
import { colors, setRootVariable } from '@planspc/colorVariables'
import { MsgSocket } from '@/plugins/socket/socket'
import { Toast } from 'vant'
import useMethods from '@planspc/hooks/useMethods'

export default {
    components: {
        ThemeIcon,
        LangIcon,
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t, locale } = useI18n({ useScope: 'global' })
        const { toOrderPriority, handleSwitchAccount, toDeposit } = useMethods()
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
            return store.state.businessConfig?.pcuiLogo
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
        const isReal = computed(() => customerInfo.value.companyType === 'real')
        // 判断是否显示顶部充值按钮
        const showTopNavDeposit = computed(() => {
            if (route.query.tradeType) {
                // url上有tradeType参数，判断typeType是否支持充值
                return businessConfig.value?.tradeTypeShowCash?.includes(route.query.tradeType) && businessConfig.value?.topNavDeposit
            }
            return businessConfig.value?.topNavDeposit
        })

        const changePlans = (item) => {
            // 跳转到下单页面并优先显示指定产品
            toOrderPriority(item.tradeType)
        }

        const goDeposit = () => {
            toDeposit(route.query?.tradeType)
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
            popoverRef.value.hide()
            // 缓存最后一次修改颜色的类型
            localSet('lastModifyType', 1)
        }

        // 切换真实模拟账号
        const switchAccount = type => {
            if (state.accountType === type) return
            state.loading = true
            state.accountType = type
            handleSwitchAccount({
                type,
                fail: () => {
                    state.loading = false
                    Toast('模拟账户开户中，请稍等')
                }
            })
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
            popoverRef.value.hide()
            router.push(route.path + path)
        }

        // 学院多语言
        const academyLocale = computed(() => {
            return unref(locale) === 'en-US' ? 'en' : unref(locale)
        })

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
            businessConfig,
            switchAccount,
            isReal,
            academyLocale,
            goDeposit,
            showTopNavDeposit
        }
    }
}
</script>

<style lang="scss" scoped>
.affixWrapper {
    width: 100% !important;
    // 修复顶部没铺满问题
    :deep(> div) {
        flex: 1;
    }
}
.header-nav {
    width: 100%;
    position: relative;
    z-index: 100;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    min-width: 1200px;
    height: 64px;
    padding: 0 16px;
    background-color: #181A20;
    color: #FFF;
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
        flex: 1;
        .logo {
            display: flex;
            align-items: center;
            margin-right: 32px;
        }
    }
    .menus {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-weight: bold;
        flex: 1;
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
                font-weight: normal;
                white-space: nowrap;
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
    .nav-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        flex: 1;
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
                min-width: 64px;
                padding: 4px 8px;
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
            font-size: 16px;
            .item {
                display: flex;
                align-items: center;
                margin-right: 20px;
                .link {
                    color: #FFF;
                    font-size: 16px;
                    cursor: pointer;
                    white-space: nowrap;
                    &:hover {
                        color: var(--primary);
                    }
                    &.account {
                        text-align: left;
                        position: relative;
                        font-size: 12px;
                        background: var(--primary);
                        padding: 5px 20px 5px 10px;
                        border-radius: 4px;
                        &:hover {
                            color: #FFF;
                        }
                        .triangle {
                            position: absolute;
                            top: 50%;
                            right: 8px;
                            margin-top: -5px;
                            border: 3px solid;
                            border-color: transparent transparent var(--van-gray-4) var(--van-gray-4);
                            transform: rotate(-45deg);
                            opacity: 0.8;
                            content: '';
                        }
                    }
                    &.center {
                        text-align: center;
                        padding: 2px 15px;
                    }
                    &.mock {
                        background-color: #3762FF;
                    }
                }
                :deep(.el-dropdown) {
                    .el-icon-caret-bottom {
                        color: #FFF;
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
                margin-right: 20px;
                background: #515366;
            }
            .deposit {
                min-width: 54px;
                padding: 5px 10px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--primary);
                font-size: 12px;
                border-radius: 4px;
                cursor: pointer;
                white-space: nowrap;
            }
        }
        .handle-feature {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 20px;
                line-height: 1;
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
.mock-account {
    .el-dropdown-menu {
        &:deep(.el-dropdown-menu__item) {
            margin-bottom: rem(20px);
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .account-type {
        color: var(--normalColor);
        display: flex;
        align-items: center;
        // margin-bottom: rem(20px);
        padding: 0 rem(40px);
        justify-content: space-around;
        border-radius: rem(10px);
        //color: var(--primary);
        .radio {
            margin-right: rem(20px);
            width: rem(40px);
            height: rem(40px);
            border-radius: 50%;
            border: solid 1px var(--minorColor);
            &.active {
                border: solid 1px var(--primary);
                &::after {
                    position: absolute;
                    left: rem(8px);
                    top: rem(8px);
                    content: '';
                    width: rem(20px);
                    height: rem(20px);
                    border-radius: 50%;
                    background: var(--primary);
                }
            }
        }
        &.active {
            color: var(--primary);
            .radio {
                display: flex;
                align-items: center;
                justify-content: center;
                border: solid 1px var(--primary);
                &::after {
                    content: '';
                    width: rem(20px);
                    height: rem(20px);
                    border-radius: 50%;
                    background: var(--primary);
                }
            }
            &.demo {
                color: #3762FF;
                .radio {
                    border: solid 1px #3762FF;
                    &::after {
                        background: #3762FF;
                    }
                }
            }
        }
    }
}
</style>
