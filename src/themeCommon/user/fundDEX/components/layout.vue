<template>
    <div class='wrap'>
        <div class='limit-width'>
            <div class='module-body'>
                <div class='side-menu'>
                    <div
                        :class="['handle-item href', { 'active': route.name === 'Dashboard' }]"
                        @click="switchRouter('/dashboard')"
                    >
                        <span class='name'>
                            <van-icon name='paid' /> Dashboard
                        </span>
                    </div>
                    <div class='menu-list'>
                        <div :class="['handle-item']">
                            <span class='name'>
                                <img alt='' class='svg-icon-1' src='/images/chart.svg' srcset='' />
                                Funds
                            </span>
                            <i class='el-icon-caret-bottom'></i>
                        </div>
                        <ul class='children-list'>
                            <li
                                :class="['children-item', { 'active': route.name === 'Earning' }]"
                                @click="switchRouter('/earning')"
                            >
                                <img alt='' class='svg-icon-2' src='/images/earning.svg' srcset='' />
                                Earning
                            </li>
                            <li
                                :class="['children-item', { 'active': route.name === 'IndexFunds' }]"
                                @click="switchRouter('/indexFunds')"
                            >
                                <img alt='' class='svg-icon-2' src='/images/indexFunds.svg' srcset='' />
                                Index Funds
                            </li>
                        </ul>
                    </div>
                </div>
                <div class='main-content'>
                    <div class='lead'>
                        <div v-if='bodyWidth > 768' class='lead-left'>
                            <ul v-if="['Earning', 'IndexFunds'].includes(curentCrumbs)">
                                <li class='row'>
                                    <span class='path active'>
                                        Funds
                                    </span>
                                </li>
                            </ul>
                            <ul v-else-if='crumbsList.length > 0'>
                                <li v-for='(item, index) in crumbsList' :key='index' class='row'>
                                    <span :class="['path', { 'active': item === curentCrumbs }]" @click='switchCrumbs(item)'>
                                        {{ item }}
                                    </span>
                                    <span v-if='crumbsList.length - 1 !== index' class='split'>
                                        /
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div v-else class='lead-left'>
                            <ul>
                                <li v-if='crumbsList.length > 1' class='row' @click='switchCrumbs(crumbsList[0])'>
                                    <i class='back icon_icon_back1'></i>
                                    <span class='path active'>
                                        Details
                                    </span>
                                </li>
                                <li v-else-if="['Earning', 'IndexFunds'].includes(curentCrumbs)" class='row'>
                                    <span class='path active'>
                                        Funds
                                    </span>
                                </li>
                                <li v-else class='row'>
                                    <span class='path active'>
                                        {{ curentCrumbs }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class='lead-right'>
                            <van-popover v-model:show='showPopover' theme='dark'>
                                <p style='line-height:30px;padding:2px 10px'>
                                    The app is running in testnet mode.
                                </p>
                                <template #reference>
                                    <div v-show='_web3 && _web3?.testnetMode' class='test-tag'>
                                        TESTNET
                                        <van-icon name='info-o' />
                                    </div>
                                </template>
                            </van-popover>

                            <!-- 已连接钱包 -->
                            <div v-show='_web3?.userAddress' class='handle-wallet'>
                                <div class='wallet-row' @click.stop='toggleWalletMenus'>
                                    <img class='icon' :src='generateIcon(_web3?.userAddress)' />
                                    <span v-if='showAddress' class='address'>
                                        {{ hideWalletMiddleInfo(_web3?.userAddress) }}
                                    </span>
                                    <van-icon class='arrow' :name="showWalletMenus ? 'arrow-up' : 'arrow-down'" />
                                </div>

                                <div
                                    :class="['wallet-menus', showWalletMenus ? 'show' : 'hide']"
                                    :style="bodyWidth < 768 ? 'right: 0': 'left:0'"
                                    @click.stop
                                >
                                    <div class='account'>
                                        <img class='icon' :src='generateIcon(_web3?.userAddress)' />
                                        <span class='address'>
                                            {{ hideWalletMiddleInfo(_web3?.userAddress) }}
                                        </span>
                                    </div>
                                    <div class='network'>
                                        <label>Network</label>
                                        <div class='name'>
                                            <em></em>
                                            <span>{{ networkConfigs[_web3?.chainId]?.name }}</span>
                                        </div>
                                    </div>
                                    <ul class='options'>
                                        <li class='copy-btn' :data-clipboard-text='_web3?.userAddress' @click='copyAddress($event)'>
                                            <img alt='' src='/images/copy.svg' srcset='' />

                                            <span>Copy address</span>
                                        </li>
                                        <li @click='toAddressQuery'>
                                            <img alt='' src='/images/share.svg' srcset='' />

                                            <span>View on Explorer</span>
                                        </li>
                                        <li @click='disconnect'>
                                            <img alt='' src='/images/disconnect.svg' srcset='' />
                                            <span>Disconnect Wallet</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!-- 未连接钱包 -->
                            <div v-show='!_web3?.userAddress' class='connect-wallet'>
                                <button @click='executeConnect'>
                                    Connect wallet
                                </button>
                            </div>
                            <div class='setting-module'>
                                <div class='setting-control' @click.stop='toggleSettingMenus'>
                                    <van-icon class='icon' name='setting' />
                                </div>
                                <div :class="['setting-menus', showSettingMenus ? 'show' : 'hide']">
                                    <div class='testnet-mode'>
                                        <label>Testnet mode</label>
                                        <span>{{ isTestMode ? 'ON' : 'OFF' }}</span>
                                        <van-switch
                                            v-model='isTestMode'
                                            :active-color='style.primary'
                                            :inactive-color='style.lineColor'
                                            size='16px'
                                            @change='toggleTestMode'
                                            @click.stop
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class='setting-module-wap' @click='wapMenushow=true'>
                                <i class='icon_chouti1'></i>
                            </div>
                        </div>
                    </div>
                    <router-view />
                </div>
            </div>
        </div>
    </div>
    <van-popup
        v-model:show='wapMenushow'
        position='top'
        round=''
    >
        <div class='menu-wrap'>
            <div class='head'>
                <span class='header-title'>
                    Menu
                </span>
                <span class='close' @click='wapMenushow=false'>
                    <van-icon name='cross' size='20' />
                </span>
            </div>
            <ul class='menus'>
                <li @click="fowardPage('/dashboard')">
                    <span class='name'>
                        <van-icon name='paid' size='24' />
                        <span class='text'>
                            Dashboard
                        </span>
                    </span>
                </li>
                <li @click="fowardPage('/earning')">
                    <span class='name'>
                        <svg
                            class='svg-icon'
                            stroke-width='0'
                            viewBox='0 0 24 24'
                            width='24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g><path d='M0 0H24V24H0z' fill='none' /><path d='M5 3v16h16v2H3V3h2zm14.94 2.94l2.12 2.12L16 14.122l-3-3-3.94 3.94-2.12-2.122L13 6.88l3 3 3.94-3.94z' /></g>
                        </svg>
                        <span class='text'>
                            Funds
                        </span>
                    </span>
                </li>
            </ul>
            <div class='setting-wrap'>
                <p class='header-title'>
                    Global Settings
                </p>
                <div class='testnet-mode'>
                    <label>Testnet mode</label>
                    <span>
                        <span class='switch-text'>
                            {{ isTestMode ? 'ON' : 'OFF' }}
                        </span>
                        <van-switch
                            v-model='isTestMode'
                            :active-color='style.primary'
                            :inactive-color='style.lineColor'
                            size='20px'
                            @change='toggleTestMode'
                            @click.stop
                        />
                    </span>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { hideWalletMiddleInfo, localSet, localGet, sessionSet, sessionGet, getDevice } from '@/utils/util'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { web3Hooks } from '@/plugins/web3/index'
import makeBlockie from 'ethereum-blockies-base64'
import { useViewport } from '@/utils/hooks/useViewport'

const {
    executeConnect,
    disconnect,
    openExtBrowser
} = web3Hooks()
const { t } = useI18n({ useScope: 'global' })

const store = useStore()
const route = useRoute()
const router = useRouter()
const { isUniapp } = route.query
if (isUniapp) {
    sessionSet('isUniapp', isUniapp)
}

const style = computed(() => store.state?.style)
// web3连接信息
const _web3 = computed(() => store.state._web3)

// 面包屑导航
const crumbsList = ref([])
// 当前选择的面包屑导航
const curentCrumbs = ref('')
// 是否显示钱包下拉菜单
const showWalletMenus = ref(false)
// 是否显示设置下拉菜单
const showSettingMenus = ref(false)
// 是否开启测试模式
const isTestMode = ref(JSON.parse(localGet('isTestMode')) || false)
// 移动端菜单下拉控制
const wapMenushow = ref(false)
// 测试模式弹窗
const showPopover = ref(false)
const { bodyWidth } = useViewport()
// 切换路由
const switchRouter = (value) => {
    if (value === route.path) return
    router.replace({ path: value })
}

// 是否显示钱包地址
const showAddress = computed(() => {
    return bodyWidth.value > 768
})
// 设置面包屑导航
const setCrumbsList = () => {
    const arr = route?.name.split('-') || []
    if (arr.length > 0) {
        crumbsList.value = arr
        curentCrumbs.value = arr[arr.length - 1]
    }
}
// 切换面包屑导航
const switchCrumbs = (name) => {
    if (curentCrumbs.value === name) return
    router.replace({ name })
}
// 控制钱包下拉菜单
const toggleWalletMenus = () => {
    showWalletMenus.value = !showWalletMenus.value
    showSettingMenus.value = false
}
// 控制设置下拉菜单
const toggleSettingMenus = () => {
    showWalletMenus.value = false
    showSettingMenus.value = !showSettingMenus.value
}
// 控制测试模式
const toggleTestMode = (val) => {
    isTestMode.value = val
    store.commit('_web3/Update_testnetMode', val)
    localSet('isTestMode', isTestMode.value)
    wapMenushow.value = false
    closeMenus()
    // 如果在详情页，则跳转到对应的列表页
    if (curentCrumbs.value === 'Detail') {
        router.replace({ name: crumbsList.value[0] })
    }
}
// 关闭下拉菜单
const closeMenus = () => {
    showWalletMenus.value = false
    showSettingMenus.value = false
}
// 复制钱包地址
const copyAddress = ($event) => {
    var clipboard = new Clipboard('.copy-btn')
    clipboard.on('success', e => {
        Toast(t('common.copySuccess'))
        // 释放内存
        clipboard.destroy()
    })
    clipboard.on('error', e => {
        // 释放内存
        clipboard.destroy()
    })
    clipboard.onClick($event)
    closeMenus()
}
// 跳转到钱包地址查询页面
const toAddressQuery = () => {
    const explorerLink = networkConfigs[_web3.value.chainId]?.explorerLink + '/address/' + _web3.value.userAddress
    openExtBrowser(explorerLink)
    closeMenus()
}

const generateIcon = (address) => {
    if (address) { return makeBlockie(address) }
}

// 跳转路由
const fowardPage = path => {
    router.push(path)
    wapMenushow.value = false
}
// 监听路由变化
watch(() => route.path, () => {
    setCrumbsList()
})
// 监听isTestMode
watch(() => isTestMode.value, () => {
    if (isUniapp && uni) {
        uni.postMessage({
            data: {
                action: 'message',
                type: 'testMode',
                params: {
                    isTestMode: isTestMode.value
                }
            }
        })
    }
}, { immediate: true })

onMounted(async () => {
    // 监听页面点击事件
    document.body.addEventListener('click', closeMenus, false)
    // 设置面包屑导航
    setCrumbsList()
    if (localGet('walletProvider')) {
        executeConnect()
    }
    // await executeConnect()
})
onBeforeUnmount(() => {
    // 销毁页面监听事件
    document.body.removeEventListener('click', closeMenus, false)
})
</script>

<style lang="scss" scoped>
.wrap {
    min-height: calc(100vh - 162px);
    padding: 20px 20px 150px;
    @media (max-width: 768px){
        padding: 0;
    }
}
.limit-width {
    max-width: 1200px;
    margin: 0 auto;
    @media (max-width: 768px){
        max-width: 750px;
    }
}
.module-body {
    display: flex;
}
.main-content {
    flex: 1;
    overflow: hidden;
    @media (max-width: 768px){
        padding-top: 55px;
    }
}
.side-menu {
    width: 200px;
    margin-right: 10px;
    padding-top: 20px;
    padding-left: 10px;
    @media (max-width: 768px){
        display: none;
    }
    .van-icon {
        display: inline-block;
        margin-right: 5px;
        font-size: 24px;
        vertical-align: -3px;
    }
    .svg-icon-1 {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
        stroke: currentColor;
        stroke-width: 0;
    }
    .svg-icon-2 {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
        stroke: currentColor;
        stroke-width: 0;
    }
    .handle-item {
        margin-bottom: 12px;
        padding: 10px;
        color: var(--mainColor);
        font-size: 18px;
        line-height: 24px;
        border-radius: 8px;
        transition: ease 0.4s;
        &.href {
            cursor: pointer;
            &:hover {
                color: var(--primary);
                background: var(--primaryBg);
            }
        }
        &.active {
            color: var(--primary);
        }
        .el-icon-caret-bottom {
            font-size: 20px;
        }
    }
    .children-item {
        margin-bottom: 10px;
        padding: 10px 10px 10px 25px;
        color: var(--mainColor);
        font-size: 16px;
        line-height: 24px;
        border-radius: 8px;
        cursor: pointer;
        transition: ease 0.4s;
        &:hover {
            color: var(--primary);
            background: var(--primaryBg);
        }
        &.active {
            color: var(--primary);
        }
    }
}
.lead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 84px;
    padding: 0 25px;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
    @media (max-width: 768px){
        padding: 0 10px;
        width: 100%;
        height: 55px;
        border-radius: 0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 101;
    }
}
.lead-left {
    height: 100%;
    ul {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .row {
        display: inline-flex;
        align-items: center;
        color: var(--minorColor);
        font-size: 16px;
        .path {
            font-weight: bold;
            cursor: pointer;
            &:hover {
                color: var(--color);
            }
        }
        .active {
            color: var(--color);
            cursor: inherit;
        }
        .split {
            margin: 0 5px;
        }
        @media (max-width: 768px){
            font-size: 13px;
            .back {
                margin-right: 4px;
                color: var(--color);
            }
        }
    }
}
.lead-right {
    display: flex;
    align-items: center;
    height: 100%;
    .test-tag {
        margin-right: 10px;
        padding: 0 8px;
        color: #FFF;
        font-size: 12px;
        line-height: 23px;
        text-align: center;
        background: var(--normalColor);
        border-radius: 5px;
        cursor: pointer;
        @media (max-width: 768px){
            transform: scale(0.8);
            margin-right: 0;
        }
    }
    .wallet-row {
        display: flex;
        align-items: center;
        min-width: 64px;
        height: 36px;
        padding: 0 10px;
        color: var(--primary);
        font-size: 16px;
        background: var(--primaryBg);
        border: 1px solid transparent;
        border-radius: 5px;
        cursor: pointer;
        @media (max-width: 768px) {
            padding: 0 5px;
            min-width: 40px;
            height: 30px;
        }
        .icon {
            width: 20px;
            height: 20px;
           margin-right: 5px;
            border-radius: 50%;
        }
        .arrow {
            margin-top: -5px;
            //margin-left: 5px;
        }
        .address{
            margin-right:  5px;
        }
        &:hover {
            border: 1px solid var(--primary);
        }
    }
    .connect-wallet {
        button {
            padding: 6px 12px;
            padding: 0 20px;
            color: #FFF;
            font-weight: 500;
            font-size: 14px;
            font-family: Inter, Arial;
            line-height: 36px;
            background: linear-gradient(248.86deg, #5292F1 10.51%, #5BECBC 90.41%);
            border-radius: 4px;
            box-shadow: none;
            cursor: pointer;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
            @media (max-width: 768px){
                padding: 0 8px;
                font-size: 12px;
                line-height: 30px;
            }
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
.handle-wallet {
    position: relative;
    z-index: 100;
}
.wallet-menus {
    position: absolute;
    top: 38px;
    z-index: 100;
    right: 0;
    min-width: 240px;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0 0 2px, rgb(0 0 0 / 10%) 0 2px 10px;
    transform-origin: 32px 0;
    transition: all ease-in-out .2s;
    &.show {
        transform: scale(1, 1);
        visibility: visible;
        opacity: 1;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    &.hide {
        transform: scale(0.75, 0.5625);
        visibility: hidden;
        opacity: 0;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 103ms;
    }
    .account {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--lineColor);
        .icon {
            width: 38px;
            height: 38px;
            margin-right: 12px;
            border-radius: 50%;
        }
        .address {
            color: var(--color);
            font-weight: 600;
            font-size: 16px;
        }
    }
    .network {
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
        border-bottom: 1px solid var(--lineColor);
        label {
            margin-bottom: 4px;
            color: var(--minorColor);
            font-size: 12px;
        }
        .name {
            display: flex;
            align-items: center;
            em {
                width: 6px;
                height: 6px;
                margin-right: 8px;
                background-color: rgb(101, 201, 112);
                border-radius: 50%;
                box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
            }
            span {
                color: var(--color);
                font-weight: bold;
                font-size: 14px;
            }
        }
    }
    .options {
        padding: 4px 0;
        li {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: var(--normalColor);
            cursor: pointer;
            img {
                width: 22px;
                height: 22px;
                margin-right: 12px;
            }
            span {
                font-weight: bold;
                font-size: 14px;
            }
            &:hover {
                background: var(--bgColor);
            }
        }
    }
}
.setting-module {
    position: relative;
    z-index: 100;
    margin-left: 12px;
    @media (max-width: 768px){
         display: none;
    }
}
.setting-module-wap{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--primaryBg);
    border-radius: 5px;
    border: 1px solid transparent;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    display: none;
    @media (max-width: 768px){
        display: flex;
        width: 30px;
        height: 30px;
         .icon_chouti1{
            font-size: 14px;
        }
    }

}
.setting-control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--primaryBg);
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    .icon {
        margin-top: -4px;
        color: var(--primary);
        font-size: 18px;
    }
    &:hover {
        border: 1px solid var(--primary);
    }
}
.setting-menus {
    position: absolute;
    top: 38px;
    right: 0;
    min-width: 240px;
    padding: 4px 0;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0 0 2px, rgb(0 0 0 / 10%) 0 2px 10px;
    transform-origin: 32px 0;
    transition: all ease-in-out .2s;
    &.show {
        transform: scale(1, 1);
        visibility: visible;
        opacity: 1;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    &.hide {
        transform: scale(0.75, 0.5625);
        visibility: hidden;
        opacity: 0;
        // transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 103ms;
    }
    .testnet-mode {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        font-size: 14px;
        cursor: pointer;
        label {
            flex: 1;
            color: var(--color);
            font-weight: 600;
            cursor: pointer;
        }
        span {
            margin-right: 6px;
            color: var(--normalColor);
        }
        &:hover {
            background: var(--bgColor);
        }
    }
}
//手机端弹窗菜单样式

.menu-wrap{

    //background: rgba(56, 61, 81, 0.88);
    //backdrop-filter: blur(20px);
    .head{
        padding: 20px 30px;
        display: flex;
        font-size: 16px;
        justify-content: space-between;
        line-height: 30px;
            color: var(--minorColor);
        .van-icon{
            font-weight: bold;
            color: var(--color);
        }

    }
    .menus{
        padding: 0 30px;
        border-bottom: solid 1px var(--lineColor);
        li{
            margin-bottom: 20px;
            .van-icon,.svg-icon,.text{
                vertical-align: middle;
            }
            .van-icon{
                margin-top: -3px;
            }
            .text{
                font-size: 18px;
            }

        }

    }
    .setting-wrap{
        padding:  30px;
        .header-title{
            font-size: 16px;
            color: var(--minorColor);
            margin-bottom: 15px ;
        }
        .testnet-mode{
            //font-size: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .switch-text{
                vertical-align: middle;
                margin-right: 5px;
            }
            .van-switch{
                vertical-align: middle;
            }
        }
    }
}

</style>
