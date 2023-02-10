<template>
    <div id='homePage' class='homePage'>
        <router-view />
        <div class='banner'>
            <div class='banner_full'>
                <!-- 快速注册模块 -->
                <new-quick />
            </div>
        </div>
        <!-- 公告模块 -->
        <new-notice />
        <!-- 交易信号 -->
        <!-- <trade-signal /> -->
        <!--投资机会-->
        <!-- <opportunities /> -->
        <!--排行榜-->
        <top-products />
        <!--加入基金的优势-->
        <advantages />
        <!--现在是分批买入加密基金的好时机-->
        <!-- <buy-now /> -->
        <!--选择vitatoken-->
        <choose-vitatoken />
        <!--评价vitatoken-->
        <said-about-vitatoken />
        <!--3分钟开启投资-->
        <start-investment />
        <!--下载vitatoken-->
        <download-vitatoken />

        <!--faq-->
        <faq />
    </div>
    <!-- 底部隐私协议 -->
    <!-- <div v-if='privacyVis' class='privacy'>
        <div class='close-wrap'>
            <div class='close' @click='privacyVis=false'>
                <svg class='icon-svg' height='10' viewBox='0 0 20 20' width='10' xmlns='http://www.w3.org/2000/svg'>
                    <g><polygon points='18.096 19.174 19.497 17.747 1.7 .286 .3 1.714' /><polygon points='19.497 1.714 18.096 .286 .3 17.747 1.7 19.174' /></g>
                </svg>
            </div>
        </div>
        <div class='content'>
            {{ $t('home.privacy.text1') }}
            <a class='sc-AxiKw cJlLNA' color='light' href='javascript:;' rel='noopener' @click='openPrivacy'>
                {{ $t('home.privacy.text2') }}
            </a>
        </div>
        <div class='footer'>
            <span class='agree' @click='agree'>
                {{ $t('home.privacy.agree') }}
            </span>
            <div class='close-btn' @click='privacyVis=false'>
                {{ $t('home.privacy.close') }}
            </div>
        </div>
    </div> -->
    <div class='serviceIcon' @click='goService'>
        <!-- 置顶-->
        <!-- <img v-if='showTop' alt='' class='img' src='../../images/home/top.png' @click='toTop' /> -->
        <!-- 客服 -->
        <i class='icon icon_xiaoxizhongxin'></i>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { MsgSocket } from '@/plugins/socket/socket'
import { localGet, localSet } from '@/utils/util'
import newQuick from './components/new-quick.vue'
import newNotice from './components/new-notice.vue'
import tradeSignal from './components/tradeSignal.vue'
import advantages from './components/advantages.vue'
import buyNow from './components/buyNow.vue'
import topProducts from './components/topProducts.vue'
import chooseVitatoken from './components/chooseVitatoken.vue'
import saidAboutVitatoken from './components/saidAboutVitatoken.vue'
import meetVitatoken from './components/meetVitatoken.vue'
import faq from './components/faq.vue'
import opportunities from './components/opportunities.vue'
import privacyTip from './components/privacy-tip.vue'
import downloadVitatoken from './components/downloadVitatoken.vue'
import startInvestment from './components/startInvestment.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const store = useStore()
const customerInfo = computed(() => store.state._user.customerInfo)
// 是否显示全仓玩法真实模拟净值
const showFullNetAsset = computed(() => store.getters.showFullNetAsset)

const bannerClick = () => {
    // 游客去到开户界面，登录去V10
    if (customerInfo.value) {
        router.push('/fundV10/index')
    } else {
        router.push('/register')
    }
}
const privacyVis = ref(false)
const agree = () => {
    localSet('privacyFlag', true)
    privacyVis.value = false
}

if (!localGet('privacyFlag')) {
    privacyVis.value = true
}

onMounted(() => {
    // 订阅资产
    if (showFullNetAsset.value) {
        MsgSocket.subscribedListAdd(() => {
            MsgSocket.subscribeAsset(1)
        })
    }
})

onBeforeUnmount(() => {
    // 取消订阅资产
    if (!showFullNetAsset.value) {
        MsgSocket.cancelSubscribeAsset()
    }
})
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.homePage {
    padding-top: rem(116px);
    position: relative;
    background: var(--contentColor);
    color: var(--color);
    .relativeFloor {
        position: relative;
        z-index: 101;
    }
}
// 内容模块
.content-module {
    padding-bottom: 4px;
    overflow: auto;
    background-color: var(--bgColor);
}
// banner文字
.banner {
    width: 100%;
    background: url('../../images/home/new_version/banner_bgd.png') top center no-repeat;
    background-size: 100% 100%;
    padding: rem(100px) rem(32px) rem(60px);
    &_full {
        display: flex;
        margin: auto;
        justify-content: space-between;
        width: 100%;
    }
    .right {
        height: 600px;
        margin-left: 40px;
        cursor: pointer;
    }
}
.privacy {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    padding: rem(30px);
    overflow: hidden;
    font-size: rem(28px);
    line-height: rem(50px);
    background-color: rgb(250, 251, 252);
    .close-wrap {
        display: flex;
        justify-content: flex-end;
        margin-bottom: rem(10px);
        .close {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            align-self: flex-end;
            justify-content: center;
            width: 24px;
            height: 24px;
            padding: 0;
            background-color: rgb(112, 133, 153);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0.5;
            -webkit-box-align: center;
            -webkit-box-pack: center;
            .icon-svg {
                cursor: pointer;
                transition: fill 0.15s ease 0s;
                fill: rgb(255, 255, 255);
            }
        }
    }
    a {
        color: var(--primary);
    }
    .content {
        padding: 0 0 10px;
    }
    .footer {
        text-align: center;
        .close-btn {
            display: inline-block;
            padding: 0 24px;
            color: var(--primary);
            border: solid 1px var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
        .agree {
            display: inline-block;
            width: fit-content;
            margin-right: rem(40px);
            padding: 0 24px;
            color: rgb(255, 255, 255);
            // font-size: 14px;
            white-space: nowrap;
            background-color: var(--primary);
            border: 1px solid var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.serviceIcon {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    right: rem(32px);
    bottom: rem(160px);
    background: var(--primary);
    border-radius: 50%;
    z-index: 109;
    padding: rem(20px);
    width: rem(80px);
    height: rem(80px);
    .icon {
        font-size: rem(40px);
        color: #FFF;
        position: relative;
    }
}
body.night {
    .banner {
        background: #21262F;
    }
}
</style>

<style lang="scss">
.nav-wrap-Home {
    position: fixed !important;
}
</style>
